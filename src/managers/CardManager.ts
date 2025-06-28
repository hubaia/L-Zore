import Phaser from 'phaser';
import type { LZoreCard, GameState } from '../types/gameTypes';
import { CARD_DATABASE, GAME_CONFIG } from '../constants/gameData';
import { getElementText, getCardTypeColor, getPillarName, isPositionSafe } from '../utils/gameUtils';
import { AudioManager } from './AudioManager';

/**
 * 卡牌管理器 - 处理所有卡牌相关功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 * 现已扩展为完整的卡牌系统管理器
 */
export class CardManager {
    private scene: Phaser.Scene;
    private gameState: GameState;
    private cardDatabase: LZoreCard[];
    private showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void;
    private audioManager: AudioManager | null = null;
    
    // 卡牌组和相关数据
    private playerHand!: Phaser.GameObjects.Group;
    private opponentHand!: Phaser.GameObjects.Group;
    private placedCards: Phaser.GameObjects.Container[] = [];
    private opponentPlacedCards: Phaser.GameObjects.Container[] = [];
    private discardPile: LZoreCard[] = [];
    private opponentDiscardPile: LZoreCard[] = [];
    private opponentCards: LZoreCard[] = [];
    // 卡组（牌库）数量追踪
    private playerDeckCount: number = 25; // 初始牌库数量
    private opponentDeckCount: number = 25;
    
    constructor(
        scene: Phaser.Scene, 
        gameState: GameState, 
        showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void,
        audioManager?: AudioManager
    ) {
        this.scene = scene;
        this.gameState = gameState;
        this.showMessage = showMessage;
        this.cardDatabase = [...CARD_DATABASE];
        this.audioManager = audioManager || null;
    }
    
    /**
     * 设置手牌组引用
     */
    setHandGroups(playerHand: Phaser.GameObjects.Group, opponentHand: Phaser.GameObjects.Group): void {
        this.playerHand = playerHand;
        this.opponentHand = opponentHand;
    }
    
    /**
     * 发初始手牌
     */
    dealInitialCards(): void {
        if (!this.playerHand || !this.opponentHand) {
            console.error('❌ CardManager: hand groups未初始化，无法发放初始手牌');
            this.showMessage('卡牌系统未就绪，无法发牌！', 'error');
            return;
        }
        
        // 玩家抽5张初始手牌
        for (let i = 0; i < 5; i++) {
            this.drawCard();
        }
        
        // 对手抽5张初始手牌
        for (let i = 0; i < 5; i++) {
            this.drawOpponentCard();
        }
        
        this.showMessage('🃏 初始手牌发放完成！', 'success');
    }
    
    /**
     * 玩家抽牌
     */
    drawCard(): Phaser.GameObjects.Container | null {
        if (!this.playerHand) {
            console.error('❌ CardManager: playerHand未初始化，请先调用setHandGroups()');
            this.showMessage('卡牌系统未就绪！', 'error');
            this.audioManager?.playUISFX('error');
            return null;
        }
        
        if (this.playerHand.children.entries.length >= 7) {
            this.showMessage('手牌已满！', 'warning');
            this.audioManager?.playUISFX('error');
            return null;
        }
        
        if (this.playerDeckCount <= 0) {
            this.showMessage('牌库已空！', 'error');
            this.audioManager?.playUISFX('error');
            return null;
        }
        
        // 播放抽卡音效
        this.audioManager?.playCardSFX('draw');
        
        // 减少牌库数量
        this.playerDeckCount--;
        
        // 随机选择一张神煞卡
        const randomCard = this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)];
        
        // 创建卡牌容器
        const handCount = this.playerHand.children.entries.length;
        const startX = this.scene.cameras.main.width * 0.15;
        const cardSpacing = 110;
        const x = startX + handCount * cardSpacing;
        const y = this.scene.cameras.main.height - 108;
        
        const cardContainer = this.createCard(randomCard, x, y);
        this.playerHand.add(cardContainer);
        
        // 抽卡动画
        cardContainer.setScale(0);
        this.scene.tweens.add({
            targets: cardContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        this.showMessage(`抽到了 ${randomCard.name}！剩余牌库：${this.playerDeckCount}张`, 'success');
        this.audioManager?.playUISFX('success');
        
        return cardContainer;
    }
    
    /**
     * 对手抽牌
     */
    drawOpponentCard(): Phaser.GameObjects.Container | null {
        if (!this.opponentHand) {
            console.error('❌ CardManager: opponentHand未初始化，请先调用setHandGroups()');
            return null;
        }
        
        if (this.opponentHand.children.entries.length >= 7) {
            return null; // 手牌已满
        }
        
        if (this.opponentDeckCount <= 0) {
            return null; // 牌库已空
        }
        
        // 播放抽卡音效（音量稍低，表示对手抽卡）
        this.audioManager?.playSFX('card_draw', 0.7);
        
        // 减少对手牌库数量
        this.opponentDeckCount--;
        
        // 从卡牌数据库中随机选择一张卡
        const randomCard = this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)];
        this.opponentCards.push(randomCard);
        
        // 计算新卡牌位置
        const handCount = this.opponentHand.children.entries.length;
        const startX = this.scene.cameras.main.width * 0.15;
        const cardSpacing = 110;
        const x = startX + handCount * cardSpacing;
        const y = 90; // 对手手牌区域
        
        // 创建对手卡牌（显示为卡背）
        const cardContainer = this.createOpponentCard(randomCard, x, y);
        this.opponentHand.add(cardContainer);
        
        // 抽卡动画
        cardContainer.setScale(0);
        this.scene.tweens.add({
            targets: cardContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        return cardContainer;
    }
    
    /**
     * 创建玩家卡牌容器
     */
    createCard(cardData: LZoreCard, x: number, y: number): Phaser.GameObjects.Container {
        const { CARD_WIDTH, CARD_HEIGHT } = GAME_CONFIG;
        const container = this.scene.add.container(x, y);
        
        // 获取卡牌背景纹理
        const cardTexture = this.getCyberpunkCardTexture(cardData.type);
        const cardBg = this.scene.add.image(0, 0, cardTexture);
        cardBg.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
        container.add(cardBg);
        
        // 卡牌标题
        const title = this.scene.add.text(0, -CARD_HEIGHT / 2 + 20, cardData.name, {
            fontSize: '14px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        container.add(title);
        
        // 卡牌效果描述
        const effectText = this.scene.add.text(0, 10, cardData.effect || '', {
            fontSize: '10px',
            color: '#88ffff',
            fontStyle: 'bold',
            wordWrap: { width: CARD_WIDTH - 20 }
        });
        effectText.setOrigin(0.5);
        container.add(effectText);
        
        // 存储卡牌数据
        container.setData('cardData', cardData);
        container.setData('originalX', x);
        container.setData('originalY', y);
        
        // 设置交互
        container.setSize(CARD_WIDTH, CARD_HEIGHT);
        container.setInteractive();
        this.scene.input.setDraggable(container);
        
        // 设置悬停效果
        this.setupCardHoverEffects(container);
        
        return container;
    }
    
    /**
     * 创建对手卡牌容器
     */
    createOpponentCard(cardData: LZoreCard, x: number, y: number): Phaser.GameObjects.Container {
        const { CARD_WIDTH, CARD_HEIGHT } = GAME_CONFIG;
        const container = this.scene.add.container(x, y);
        
        // 对手卡牌显示为卡背
        const cardBg = this.scene.add.image(0, 0, 'card-back');
        cardBg.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
        container.add(cardBg);
        
        // 存储卡牌数据
        container.setData('cardData', cardData);
        container.setData('originalX', x);
        container.setData('originalY', y);
        
        container.setSize(CARD_WIDTH, CARD_HEIGHT);
        
        return container;
    }
    
    /**
     * 获取赛博朋克卡牌纹理
     */
    getCyberpunkCardTexture(type: string): string {
        switch (type) {
            case 'auspicious': return 'card-auspicious';
            case 'inauspicious': return 'card-inauspicious';
            case 'special': return 'card-special';
            default: return 'card-back';
        }
    }
    
    /**
     * 设置卡牌悬停效果
     */
    setupCardHoverEffects(cardContainer: Phaser.GameObjects.Container): void {
        const originalScale = cardContainer.scaleX;
        const originalY = cardContainer.y;
        
        cardContainer.on('pointerover', () => {
            // 播放悬停音效
            this.audioManager?.playCardSFX('hover');
            
            // 悬停时放大并上移
            this.scene.tweens.add({
                targets: cardContainer,
                scaleX: originalScale * 1.1,
                scaleY: originalScale * 1.1,
                y: originalY - 20,
                duration: 200,
                ease: 'Power2'
            });
            
            // 设置高层级显示
            cardContainer.setDepth(100);
        });
        
        cardContainer.on('pointerout', () => {
            // 恢复原状
            this.scene.tweens.add({
                targets: cardContainer,
                scaleX: originalScale,
                scaleY: originalScale,
                y: originalY,
                duration: 200,
                ease: 'Power2'
            });
            
            cardContainer.setDepth(0);
        });
        
        // 添加点击选择音效
        cardContainer.on('pointerdown', () => {
            this.audioManager?.playCardSFX('select');
        });
    }
    
    /**
     * 移除使用过的卡牌
     */
    removeUsedCard(cardData: LZoreCard): void {
        if (!this.playerHand) {
            console.error('❌ CardManager: playerHand未初始化，无法移除卡牌');
            return;
        }
        
        // 查找并移除手牌中对应的卡牌
        const handCards = this.playerHand.children.entries as Phaser.GameObjects.Container[];
        const usedCard = handCards.find(card => {
            const data = card.getData('cardData');
            return data && data.name === cardData.name;
        });
        
        if (usedCard) {
            // 播放卡牌激活音效
            this.audioManager?.playCardSFX('activate');
            
            // 添加到弃牌堆
            this.discardPile.push(cardData);
            
            // 从手牌移除
            this.playerHand.remove(usedCard);
            
            // 销毁卡牌对象
            usedCard.destroy();
            
            this.showMessage(`${cardData.name} 已使用完毕，进入弃牌堆`, 'success');
        }
    }
    
    /**
     * 获取手牌数量信息
     */
    getHandCounts(): { playerHandCount: number; opponentHandCount: number } {
        return {
            playerHandCount: this.playerHand ? this.playerHand.children.entries.length : 0,
            opponentHandCount: this.opponentHand ? this.opponentHand.children.entries.length : 0
        };
    }
    
    /**
     * 获取弃牌堆状态
     */
    getDiscardPileStatus(): { playerDiscardCount: number; opponentDiscardCount: number } {
        return {
            playerDiscardCount: this.discardPile.length,
            opponentDiscardCount: this.opponentDiscardPile.length
        };
    }
    
    /**
     * 获取牌库数量信息
     */
    getDeckCounts(): { playerDeckCount: number; opponentDeckCount: number } {
        return {
            playerDeckCount: this.playerDeckCount,
            opponentDeckCount: this.opponentDeckCount
        };
    }
    
    /**
     * 获取对手卡牌数据（用于AI攻击）
     */
    getOpponentCards(): LZoreCard[] {
        return [...this.opponentCards];
    }
    
    /**
     * 移除对手卡牌（用于AI攻击后）
     */
    removeOpponentCard(index: number): LZoreCard | null {
        if (!this.opponentHand) {
            console.error('❌ CardManager: opponentHand未初始化，无法移除对手卡牌');
            return null;
        }
        
        if (index >= 0 && index < this.opponentCards.length) {
            const removedCard = this.opponentCards.splice(index, 1)[0];
            
            // 移除对应的手牌显示
            if (this.opponentHand.children.entries[index]) {
                const cardToRemove = this.opponentHand.children.entries[index] as Phaser.GameObjects.Container;
                this.opponentHand.remove(cardToRemove);
                cardToRemove.destroy();
            }
            
            return removedCard;
        }
        return null;
    }
    
    /**
     * 清空弃牌堆（用于游戏重启）
     */
    clearDiscardPiles(): void {
        this.discardPile = [];
        this.opponentDiscardPile = [];
        this.opponentCards = [];
    }
    
    /**
     * 更新卡牌位置（重新排列手牌）
     */
    rearrangeHandCards(): void {
        if (!this.playerHand) {
            console.error('❌ CardManager: playerHand未初始化，无法重新排列手牌');
            return;
        }
        
        const handCards = this.playerHand.children.entries as Phaser.GameObjects.Container[];
        const startX = this.scene.cameras.main.width * 0.15;
        const cardSpacing = 110;
        
        handCards.forEach((card, index) => {
            const targetX = startX + index * cardSpacing;
            const targetY = this.scene.cameras.main.height - 108;
            
            this.scene.tweens.add({
                targets: card,
                x: targetX,
                y: targetY,
                duration: 300,
                ease: 'Power2'
            });
            
            // 更新原始位置数据
            card.setData('originalX', targetX);
            card.setData('originalY', targetY);
        });
    }
    
    /**
     * 更新卡牌生命元素显示
     */
    updateCardLifeElements(cardContainer: Phaser.GameObjects.Container, cardData: LZoreCard): void {
        // 查找或创建生命元素显示
        let lifeElementText = cardContainer.list.find(child => 
            child.getData && child.getData('lifeElementDisplay')
        ) as Phaser.GameObjects.Text;
        
        if (!lifeElementText) {
            lifeElementText = this.scene.add.text(0, 60, '', {
                fontSize: '12px',
                color: '#ffff00',
                fontStyle: 'bold',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: { x: 4, y: 2 }
            });
            lifeElementText.setOrigin(0.5);
            lifeElementText.setData('lifeElementDisplay', true);
            cardContainer.add(lifeElementText);
        }
        
        const current = cardData.currentLifeElements || 0;
        const max = cardData.maxLifeElements || 0;
        const elementType = cardData.lifeElementGeneration?.elementType || 'special';
        
        if (current > 0) {
            lifeElementText.setText(`💎${current}/${max} ${this.getElementName(elementType)}`);
            
            // 添加生命元素光效
            this.createLifeElementGlow(cardContainer, elementType);
        } else {
            lifeElementText.setText('');
        }
    }
    
    /**
     * 创建生命元素光效
     */
    private createLifeElementGlow(cardContainer: Phaser.GameObjects.Container, elementType: string): void {
        const colors = {
            'metal': 0xffd700,
            'wood': 0x00ff00,
            'water': 0x0088ff,
            'fire': 0xff4400,
            'earth': 0xffaa00
        };
        
        const color = colors[elementType as keyof typeof colors] || 0xffffff;
        
        // 检查是否已有光效，避免重复创建
        const existingGlow = cardContainer.list.find(child => 
            child.getData && child.getData('lifeElementGlow')
        );
        
        if (existingGlow) {
            return; // 已有光效，不重复创建
        }
        
        // 播放生命元素激活音效
        this.audioManager?.playShenshaSFX('activate');
        
        // 创建光效
        const glow = this.scene.add.graphics();
        glow.lineStyle(2, color, 0.8);
        glow.strokeRect(-62, -92, 124, 184);
        glow.setDepth(98);
        glow.setData('lifeElementGlow', true);
        cardContainer.add(glow);
        
        // 闪烁动画
        this.scene.tweens.add({
            targets: glow,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // 3秒后移除光效
        this.scene.time.delayedCall(3000, () => {
            if (glow && glow.active) {
                glow.destroy();
            }
        });
    }
    
    /**
     * 获取元素中文名称
     */
    private getElementName(element: string): string {
        const names = {
            'metal': '金',
            'wood': '木',
            'water': '水',
            'fire': '火',
            'earth': '土'
        };
        return names[element as keyof typeof names] || '特';
    }
    
    /**
     * 清理资源
     */
    dispose(): void {
        this.cardDatabase = [];
        this.discardPile = [];
        this.opponentDiscardPile = [];
        this.opponentCards = [];
    }
} 