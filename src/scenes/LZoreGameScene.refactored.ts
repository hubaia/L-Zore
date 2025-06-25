import Phaser from 'phaser';
import { Interface } from 'phaser-react-ui';
import type { LZoreCard, GameState } from '../types/gameTypes';
import { CARD_DATABASE, INITIAL_GAME_STATE, GAME_CONFIG } from '../constants/gameData';
import { LZoreGameUI } from '../components/LZoreGameUI';
import { RealtimeSystemManager } from '../managers/RealtimeSystemManager';
import { BackgroundRenderManager } from '../managers/BackgroundRenderManager';
import { UIManager } from '../managers/UIManager';
import { BattlefieldManager } from '../managers/BattlefieldManager';

/**
 * L-Zore神煞卡牌游戏场景 - 重构版本
 * 使用管理器架构，将大型场景拆分为多个专业化管理器
 */
export class LZoreGameScene extends Phaser.Scene {
    // 核心游戏状态
    private gameState!: GameState;
    private cardDatabase!: LZoreCard[];
    
    // 游戏对象
    private playerHand!: Phaser.GameObjects.Group;
    private opponentHand!: Phaser.GameObjects.Group;
    private placedCards: Phaser.GameObjects.Container[] = [];
    
    // 弃牌堆系统
    private discardPile: LZoreCard[] = [];
    private opponentDiscardPile: LZoreCard[] = [];
    
    // 效果面板系统
    private effectPanel: Phaser.GameObjects.Container | null = null;
    private isEffectPanelOpen: boolean = false;
    
    // AI对手系统
    private opponentCards: LZoreCard[] = [];
    private opponentPlacedCards: Phaser.GameObjects.Container[] = [];
    
    // 管理器系统
    private realtimeManager!: RealtimeSystemManager;
    private backgroundManager!: BackgroundRenderManager;
    private uiManager!: UIManager;
    private battlefieldManager!: BattlefieldManager;
    
    // phaser-react-ui 接口
    private ui!: Interface;

    constructor() {
        super({ key: 'LZoreGameScene' });
    }

    preload() {
        // 预加载神煞卡牌资源
        this.loadCardAssets();
        
        // 加载粒子效果资源
        this.loadParticleAssets();
    }

    create() {
        // 禁用音频以避免AudioContext问题
        try {
            if (this.sound) {
                this.sound.mute = true;
                this.sound.volume = 0;
            }
        } catch (error) {
            console.warn('音频设置警告:', error);
        }
        
        // 初始化游戏状态
        this.initializeGameState();
        
        // 初始化管理器系统
        this.initializeManagers();
        
        // 创建游戏背景
        this.backgroundManager.createBackground();
        
        // 创建战场布局
        this.battlefieldManager.createBattleField();
        
        // 创建卡牌数据库
        this.createCardDatabase();
        
        // 创建玩家手牌区域
        this.createPlayerHandArea();
        
        // 创建对手手牌区域
        this.createOpponentHandArea();
        
        // 设置拖拽系统
        this.battlefieldManager.setupDragAndDrop();
        
        // 创建UI界面
        this.uiManager.createGameUI();
        
        // 创建粒子系统
        this.backgroundManager.createParticleEffects();
        
        // 发初始手牌
        this.dealInitialCards();
        
        // 启动全局位置监控系统
        this.startGlobalPositionMonitor();
        
        // 添加键盘快捷键支持
        this.setupKeyboardControls();
        
        // 初始化phaser-react-ui接口
        this.initializeUI();
        
        // 发送游戏就绪事件
        this.events.emit('gameReady');
    }

    /**
     * 加载粒子效果资源
     */
    private loadParticleAssets() {
        // 创建粒子纹理
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(0, 0, 8);
        graphics.generateTexture('particle', 16, 16);
        graphics.destroy();
    }

    /**
     * 加载卡牌资源
     */
    private loadCardAssets() {
        // 创建程序化生成的卡牌纹理
        this.load.on('complete', () => {
            this.createCardTextures();
        });
    }

    /**
     * 创建卡牌纹理
     */
    private createCardTextures() {
        const { CARD_WIDTH, CARD_HEIGHT } = GAME_CONFIG;
        
        // 吉神卡 - 霓虹青色
        this.createCyberpunkCard('card-auspicious', CARD_WIDTH, CARD_HEIGHT, 0x00ffff, 0x00cccc);
        
        // 凶神卡 - 霓虹粉色
        this.createCyberpunkCard('card-inauspicious', CARD_WIDTH, CARD_HEIGHT, 0xff00ff, 0xcc00cc);
        
        // 特殊神煞卡 - 霓虹紫色
        this.createCyberpunkCard('card-special', CARD_WIDTH, CARD_HEIGHT, 0x9900ff, 0x7700cc);
        
        // 卡牌背面 - 霓虹蓝色
        this.createCyberpunkCard('card-back', CARD_WIDTH, CARD_HEIGHT, 0x0066ff, 0x0044cc);
    }
    
    /**
     * 创建赛博朋克风格卡牌
     */
    private createCyberpunkCard(key: string, width: number, height: number, mainColor: number, borderColor: number) {
        const graphics = this.add.graphics();
        
        // 卡牌主体 - 深色背景
        graphics.fillStyle(0x0f0f23);
        graphics.fillRect(0, 0, width, height);
        
        // 霓虹边框 - 多层发光效果
        graphics.lineStyle(4, borderColor, 0.3);
        graphics.strokeRect(0, 0, width, height);
        
        graphics.lineStyle(2, mainColor, 0.6);
        graphics.strokeRect(1, 1, width - 2, height - 2);
        
        graphics.lineStyle(1, 0xffffff, 0.8);
        graphics.strokeRect(2, 2, width - 4, height - 4);
        
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    /**
     * 初始化游戏状态 - 即时系统
     */
    private initializeGameState() {
        this.gameState = { ...INITIAL_GAME_STATE };
        this.gameState.gamePhase = 'realtime'; // 直接进入实时模式
        
        // 确保元素数量正确初始化为8枚
        this.gameState.playerRemainingElements = 8;
        this.gameState.opponentRemainingElements = 8;
        
        console.log('🎲 游戏初始化完成');
        console.log(`玩家八字: ${this.getBaZiDisplayText(this.gameState.playerBazi)}`);
        console.log(`对手八字: ${this.getBaZiDisplayText(this.gameState.opponentBazi)}`);
        console.log(`玩家元素: ${this.gameState.playerRemainingElements}/8 枚`);
        console.log(`对手元素: ${this.gameState.opponentRemainingElements}/8 枚`);
    }

    /**
     * 获取八字显示文本
     */
    private getBaZiDisplayText(bazi: any): string {
        return `${bazi.year.gan}${bazi.year.zhi} ${bazi.month.gan}${bazi.month.zhi} ${bazi.day.gan}${bazi.day.zhi} ${bazi.hour.gan}${bazi.hour.zhi}`;
    }

    /**
     * 初始化管理器系统
     */
    private initializeManagers() {
        // 初始化UI管理器
        this.uiManager = new UIManager(this, this.gameState);
        
        // 初始化即时系统管理器
        this.realtimeManager = new RealtimeSystemManager(
            this,
            this.gameState,
            (text, type) => this.uiManager.showMessage(text, type),
            () => this.updateGameStateUI(),
            () => this.autoDrawCards()
        );
        
        // 初始化背景渲染管理器
        this.backgroundManager = new BackgroundRenderManager(this);
        
        // 初始化战场管理器
        this.battlefieldManager = new BattlefieldManager(
            this,
            this.gameState,
            (text, type) => this.uiManager.showMessage(text, type),
            (card, position) => this.onCardPlaced(card, position)
        );
        
        // 启动实时系统
        this.realtimeManager.startRealtimeSystem();
    }

    /**
     * 卡牌放置处理
     */
    private onCardPlaced(card: Phaser.GameObjects.Container, position: number) {
        const cardData = card.getData('cardData');
        
        console.log(`处理卡牌放置: ${cardData.name} 到位置 ${position}`);
        console.log('放置前手牌数量:', this.playerHand.children.entries.length);
        console.log('放置前场上卡牌数量:', this.placedCards.length);
        
        // 从手牌中移除
        this.playerHand.remove(card);
        this.placedCards.push(card);
        
        console.log('放置后手牌数量:', this.playerHand.children.entries.length);
        console.log('放置后场上卡牌数量:', this.placedCards.length);
        
        // 获得优先权
        this.realtimeManager.gainPriority('player');
        
        // 更新UI状态
        this.updateGameStateUI();
        
        // 所有卡牌放置后都弹出效果面板
        this.openEffectPanel(cardData, card);
    }

    /**
     * 自动抽卡回调
     */
    private autoDrawCards() {
        // 时停检查：如果游戏暂停则跳过自动抽卡
        if (this.gameState.isPaused) return;
        
        // 双方同时自动抽卡
        if (this.playerHand.children.entries.length < 7) {
            this.drawCard();
        }
        
        if (this.opponentHand.children.entries.length < 7) {
            this.drawOpponentCard();
        }
    }

    /**
     * 创建卡牌数据库
     */
    private createCardDatabase() {
        this.cardDatabase = [...CARD_DATABASE];
    }

    /**
     * 创建玩家手牌区域
     */
    private createPlayerHandArea() {
        const { width, height } = this.cameras.main;
        
        // 创建手牌组
        this.playerHand = this.add.group();
        
        // 创建手牌区域背景 - 极简设计
        const handAreaBg = this.add.graphics();
        handAreaBg.fillStyle(0x000000, 0.08); // 几乎透明
        handAreaBg.fillRect(0, height - 198, width, 198); // 99%显示的高度
        handAreaBg.setDepth(-1);
    }

    /**
     * 创建对手手牌区域
     */
    private createOpponentHandArea() {
        const { width } = this.cameras.main;
        
        // 创建对手手牌组
        this.opponentHand = this.add.group();
        
        // 创建对手手牌区域背景
        const opponentHandBg = this.add.graphics();
        opponentHandBg.fillStyle(0x660000, 0.1);
        opponentHandBg.fillRect(0, 0, width, 120);
        opponentHandBg.setDepth(-1);
    }

    /**
     * 发初始手牌
     */
    private dealInitialCards() {
        // 玩家抽5张初始手牌
        for (let i = 0; i < 5; i++) {
            this.drawCard();
        }
        
        // 对手抽5张初始手牌
        for (let i = 0; i < 5; i++) {
            this.drawOpponentCard();
        }
    }

    /**
     * 抽牌
     */
    drawCard(): Phaser.GameObjects.Container | null {
        if (this.gameState.isPaused) {
            this.uiManager.showMessage('⏸️ 时空暂停中，无法抽牌！', 'warning');
            return null;
        }
        
        if (this.playerHand.children.entries.length >= 7) {
            return null; // 手牌已满
        }
        
        // 从卡牌数据库中随机选择一张卡
        const randomCard = this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)];
        
        // 计算新卡牌位置
        const handCount = this.playerHand.children.entries.length;
        const startX = this.cameras.main.width * 0.15;
        const cardSpacing = 110;
        const x = startX + handCount * cardSpacing;
        const y = this.cameras.main.height - 108; // 精确的99%显示位置
        
        // 创建卡牌
        const cardContainer = this.createCard(randomCard, x, y);
        this.playerHand.add(cardContainer);
        
        // 抽卡动画
        cardContainer.setScale(0);
        this.tweens.add({
            targets: cardContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        return cardContainer;
    }

    /**
     * 对手抽牌
     */
    private drawOpponentCard(): Phaser.GameObjects.Container | null {
        if (this.opponentHand.children.entries.length >= 7) {
            return null; // 手牌已满
        }
        
        // 从卡牌数据库中随机选择一张卡
        const randomCard = this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)];
        this.opponentCards.push(randomCard);
        
        // 计算新卡牌位置
        const handCount = this.opponentHand.children.entries.length;
        const startX = this.cameras.main.width * 0.15;
        const cardSpacing = 110;
        const x = startX + handCount * cardSpacing;
        const y = 90; // 对手手牌区域
        
        // 创建对手卡牌（显示为卡背）
        const cardContainer = this.createOpponentCard(randomCard, x, y);
        this.opponentHand.add(cardContainer);
        
        // 抽卡动画
        cardContainer.setScale(0);
        this.tweens.add({
            targets: cardContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        // 对手有30%几率自动使用卡牌攻击玩家
        if (Math.random() < 0.3 && this.opponentCards.length > 0) {
            this.time.delayedCall(2000, () => {
                this.executeOpponentAttack();
            });
        }
        
        return cardContainer;
    }

    /**
     * 执行对手攻击
     */
    private executeOpponentAttack() {
        if (this.opponentCards.length === 0) return;
        
        // 随机选择一张卡牌
        const randomIndex = Math.floor(Math.random() * this.opponentCards.length);
        const attackCard = this.opponentCards[randomIndex];
        
        // 对玩家造成伤害
        const damage = Math.min(attackCard.power, this.gameState.playerRemainingElements);
        this.gameState.playerRemainingElements -= damage;
        
        this.uiManager.showMessage(`对手使用 ${attackCard.name}！你失去${damage}枚元素，剩余${this.gameState.playerRemainingElements}枚`, 'error');
        
        // 检查玩家是否败北
        if (this.gameState.playerRemainingElements <= 0) {
            this.onGameEnd('opponent');
            return;
        }
        
        // 移除使用的卡牌
        this.opponentCards.splice(randomIndex, 1);
        
        // 移除对应的手牌显示
        if (this.opponentHand.children.entries[randomIndex]) {
            const cardToRemove = this.opponentHand.children.entries[randomIndex] as Phaser.GameObjects.Container;
            this.opponentHand.remove(cardToRemove);
            cardToRemove.destroy();
        }
        
        // 更新UI
        this.updateGameStateUI();
    }

    /**
     * 创建卡牌容器
     */
    private createCard(cardData: LZoreCard, x: number, y: number): Phaser.GameObjects.Container {
        const { CARD_WIDTH, CARD_HEIGHT } = GAME_CONFIG;
        const container = this.add.container(x, y);
        
        // 获取卡牌背景纹理
        const cardTexture = this.getCyberpunkCardTexture(cardData.type);
        const cardBg = this.add.image(0, 0, cardTexture);
        cardBg.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
        container.add(cardBg);
        
        // 卡牌标题
        const title = this.add.text(0, -CARD_HEIGHT / 2 + 20, cardData.name, {
            fontSize: '14px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        container.add(title);
        
        // 卡牌效果描述
        const effectText = this.add.text(0, 10, cardData.effect || '', {
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
        this.input.setDraggable(container);
        
        // 设置悬停效果
        this.setupCardHoverEffects(container);
        
        return container;
    }

    /**
     * 创建对手卡牌
     */
    private createOpponentCard(cardData: LZoreCard, x: number, y: number): Phaser.GameObjects.Container {
        const { CARD_WIDTH, CARD_HEIGHT } = GAME_CONFIG;
        const container = this.add.container(x, y);
        
        // 对手卡牌显示为卡背
        const cardBg = this.add.image(0, 0, 'card-back');
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
    private getCyberpunkCardTexture(type: string): string {
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
    private setupCardHoverEffects(cardContainer: Phaser.GameObjects.Container) {
        const originalScale = cardContainer.scaleX;
        const originalY = cardContainer.y;
        
        cardContainer.on('pointerover', () => {
            // 悬停时放大并上移
            this.tweens.add({
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
            this.tweens.add({
                targets: cardContainer,
                scaleX: originalScale,
                scaleY: originalScale,
                y: originalY,
                duration: 200,
                ease: 'Power2'
            });
            
            cardContainer.setDepth(0);
        });
    }

    /**
     * 触发自动放置效果
     */
    private triggerAutoPlace(cardContainer: Phaser.GameObjects.Container) {
        // 创建放置特效
        this.backgroundManager.createForceEffect(cardContainer);
        
        this.uiManager.showMessage('🎯 卡牌已放置！获得优先权！', 'success');
    }

    /**
     * 启动全局位置监控系统
     */
    private startGlobalPositionMonitor() {
        this.time.addEvent({
            delay: 16, // 60 FPS
            callback: this.updateCardHoverEffects,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * 更新卡牌悬停效果
     */
    private updateCardHoverEffects() {
        // 监控卡牌位置和状态
        // 这里可以添加更多的动态效果
    }

    /**
     * 添加键盘快捷键支持
     */
    private setupKeyboardControls() {
        // D键 - 抽牌
        this.input.keyboard!.on('keydown-D', () => {
            if (!this.gameState.isPaused && !this.isEffectPanelOpen) {
                this.drawCard();
            } else if (this.gameState.isPaused) {
                this.uiManager.showMessage('⏸️ 时空暂停中，操作被禁用', 'warning');
            }
        });
        
        // S键 - 使用神煞
        this.input.keyboard!.on('keydown-S', () => {
            if (!this.gameState.isPaused && !this.isEffectPanelOpen) {
                this.useSpecialAbility();
            } else if (this.gameState.isPaused) {
                this.uiManager.showMessage('⏸️ 时空暂停中，操作被禁用', 'warning');
            }
        });
        
        // R键 - 释放优先权
        this.input.keyboard!.on('keydown-R', () => {
            if (!this.gameState.isPaused && !this.isEffectPanelOpen) {
                this.realtimeManager.releasePriority();
            } else if (this.gameState.isPaused) {
                this.uiManager.showMessage('⏸️ 时空暂停中，操作被禁用', 'warning');
            }
        });
        
        // ESC键 - 关闭面板
        this.input.keyboard!.on('keydown-ESC', () => {
            if (this.isEffectPanelOpen) {
                this.closeEffectPanel();
            }
        });
    }

    /**
     * 使用特殊能力
     */
    useSpecialAbility() {
        if (this.gameState.isPaused) {
            this.uiManager.showMessage('⏸️ 时空暂停中，无法使用神煞！', 'warning');
            return;
        }
        
        if (!this.gameState.canPlayerUseCards) {
            this.uiManager.showMessage('冷却期间无法使用神煞！', 'warning');
            return;
        }
        
        if (this.gameState.activePlayer !== 'player') {
            this.uiManager.showMessage('需要获得优先权才能使用神煞！', 'warning');
            return;
        }
        
        // 开始冷却期
        this.realtimeManager.startPlayerCooldown();
        
        this.uiManager.showMessage('🔥 神煞能力已使用！进入冷却期', 'success');
    }

    /**
     * 初始化phaser-react-ui接口
     */
    private initializeUI() {
        try {
            this.ui = new Interface(this);
            this.ui.render(LZoreGameUI);
            
            // 设置UI事件监听器
            this.setupUIEventListeners();
            
            console.log('🎮 phaser-react-ui 初始化成功');
        } catch (error) {
            console.error('❌ phaser-react-ui 初始化失败:', error);
        }
    }

    /**
     * 设置UI事件监听器
     */
    private setupUIEventListeners() {
        // 监听来自React UI的事件
        this.events.on('drawCard', () => {
            this.drawCard();
        });

        this.events.on('useSpecialAbility', () => {
            this.useSpecialAbility();
        });

        this.events.on('releasePriority', () => {
            this.realtimeManager.releasePriority();
        });

        // 监听React发送的执行效果事件 - 使用phaser-react-ui事件系统
        this.events.on('executeEffect', (data: {
            cardData: LZoreCard,
            actionType: 'damage' | 'buff',
            target: any,
            value: number
        }) => {
            this.executeEffectFromReact(data);
        });

        // 监听React发送的关闭面板事件
        this.events.on('effectPanelClose', () => {
            this.closeEffectPanel();
        });

        // 监听React发送的多目标执行效果事件 - phaser-react-ui事件处理
        this.events.on('executeMultiTargetEffect', (data: {
            cardData: LZoreCard,
            actionType: 'damage' | 'buff',
            allocations: Record<string, number>,
            targets: any[]
        }) => {
            this.executeMultiTargetEffectFromReact(data);
        });
    }

    /**
     * 执行来自React的效果 - phaser-react-ui事件处理
     */
    private executeEffectFromReact(data: {
        cardData: LZoreCard,
        actionType: 'damage' | 'buff',
        target: any,
        value: number
    }) {
        const { cardData, actionType, target, value } = data;
        
        if (target.type === 'fieldCard') {
            // 对场上神煞卡的效果
            const { card, cardData: targetCardData } = target.data;
            
            if (actionType === 'damage') {
                // 直接中和目标神煞卡
                card.setData('neutralized', true);
                card.setAlpha(0.5);
                card.list.forEach((child: any) => {
                    if (child.setTint) {
                        child.setTint(0x666666);
                    }
                });
                
                this.uiManager.showMessage(`${cardData.name} 以${value}炁克元素中和了 ${targetCardData.name}！`, 'success');
                
                // 延迟后移入弃牌堆
                this.time.delayedCall(1500, () => {
                    this.moveToDiscardPile(card);
                });
            } else {
                // 增益效果：强化己方神煞卡
                const glowEffect = this.add.graphics();
                glowEffect.lineStyle(3, 0x00ff00, 0.8);
                glowEffect.strokeRect(card.x - 60, card.y - 90, 120, 180);
                glowEffect.setDepth(99);
                
                // 标记为已强化
                card.setData('buffed', true);
                card.setData('buffValue', value);
                
                this.uiManager.showMessage(`${cardData.name} 以${value}炁克元素强化了 ${targetCardData.name}！`, 'success');
                
                // 移除发光效果
                this.time.delayedCall(3000, () => {
                    glowEffect.destroy();
                });
            }
        } else if (target.type === 'bazi') {
            // 对本命八字的效果
            const { pillarIndex, pillarName } = target.data;
            
            if (actionType === 'damage') {
                // 对对手本命八字造成伤害
                const actualDamage = Math.min(value, this.gameState.opponentRemainingElements);
                this.gameState.opponentRemainingElements -= actualDamage;
                
                this.uiManager.showMessage(`${cardData.name} 以${actualDamage}炁克元素攻击了${pillarName}！对手剩余${this.gameState.opponentRemainingElements}枚元素`, 'error');
                
                if (this.gameState.opponentRemainingElements <= 0) {
                    this.onGameEnd('player');
                    return;
                }
            } else {
                // 对己方本命八字增益
                const actualHeal = Math.min(value, 8 - this.gameState.playerRemainingElements);
                this.gameState.playerRemainingElements += actualHeal;
                
                this.uiManager.showMessage(`${cardData.name} 以${actualHeal}炁克元素增益了${pillarName}！玩家剩余${this.gameState.playerRemainingElements}枚元素`, 'success');
            }
        }
        
        // 更新UI状态
        this.updateGameStateUI();
        
        // 检查是否触发元素中和
        this.checkElementNeutralization();
    }

    /**
     * 执行来自React的多目标效果 - phaser-react-ui事件处理
     */
    private executeMultiTargetEffectFromReact(data: {
        cardData: LZoreCard,
        actionType: 'damage' | 'buff',
        allocations: Record<string, number>,
        targets: any[]
    }) {
        const { cardData, actionType, allocations, targets } = data;
        
        console.log(`执行多目标${actionType === 'damage' ? '伤害' : '增益'}:`, allocations);
        
        // 遍历所有分配，对每个目标应用效果
        Object.entries(allocations).forEach(([targetId, value]) => {
            // 根据targetId找到对应的目标
            const target = targets.find(t => t.id === targetId);
            if (!target || value <= 0) return;
            
            if (target.type === 'fieldCard') {
                // 对场上神煞卡的效果
                const { card, cardData: targetCardData } = target.data;
                
                if (actionType === 'damage') {
                    // 直接中和目标神煞卡
                    card.setData('neutralized', true);
                    card.setAlpha(0.5);
                    card.list.forEach((child: any) => {
                        if (child.setTint) {
                            child.setTint(0x666666);
                        }
                    });
                    
                    this.uiManager.showMessage(`${cardData.name} 以${value}炁克元素中和了 ${targetCardData.name}！`, 'success');
                    
                    // 延迟后移入弃牌堆
                    this.time.delayedCall(1500, () => {
                        this.moveToDiscardPile(card);
                    });
                } else {
                    // 增益效果：强化己方神煞卡
                    const glowEffect = this.add.graphics();
                    glowEffect.lineStyle(3, 0x00ff00, 0.8);
                    glowEffect.strokeRect(card.x - 60, card.y - 90, 120, 180);
                    glowEffect.setDepth(99);
                    
                    // 标记为已强化
                    card.setData('buffed', true);
                    card.setData('buffValue', value);
                    
                    this.uiManager.showMessage(`${cardData.name} 以${value}炁克元素强化了 ${targetCardData.name}！`, 'success');
                    
                    // 移除发光效果
                    this.time.delayedCall(3000, () => {
                        glowEffect.destroy();
                    });
                }
            } else if (target.type === 'bazi') {
                // 对本命八字的效果
                const { pillarIndex, pillarName } = target.data;
                
                if (actionType === 'damage') {
                    // 对对手本命八字造成伤害
                    const actualDamage = Math.min(value, this.gameState.opponentRemainingElements);
                    this.gameState.opponentRemainingElements -= actualDamage;
                    
                    this.uiManager.showMessage(`${cardData.name} 以${actualDamage}炁克元素攻击了${pillarName}！对手剩余${this.gameState.opponentRemainingElements}枚元素`, 'error');
                    
                    if (this.gameState.opponentRemainingElements <= 0) {
                        this.onGameEnd('player');
                        return;
                    }
                } else {
                    // 对己方本命八字增益
                    const actualHeal = Math.min(value, 8 - this.gameState.playerRemainingElements);
                    this.gameState.playerRemainingElements += actualHeal;
                    
                    this.uiManager.showMessage(`${cardData.name} 以${actualHeal}炁克元素增益了${pillarName}！玩家剩余${this.gameState.playerRemainingElements}枚元素`, 'success');
                }
            }
        });
        
        // 显示多目标执行完成消息
        const targetCount = Object.keys(allocations).length;
        const totalValue = Object.values(allocations).reduce((sum, val) => sum + val, 0);
        this.uiManager.showMessage(`🎯 多目标${actionType === 'damage' ? '攻击' : '增益'}完成！影响${targetCount}个目标，总计${totalValue}炁克`, 'warning');
        
        // 更新UI状态
        this.updateGameStateUI();
        
        // 检查是否触发元素中和
        this.checkElementNeutralization();
    }

    /**
     * 根据八字计算玩家能量
     */
    private calculatePlayerEnergy(): number {
        // 统计玩家八字中的五行分布
        const elements = this.countBaZiElements(this.gameState.playerBazi);
        // 计算能量：五行平衡度越高，能量越强
        const totalElements = Object.values(elements).reduce((sum, count) => sum + count, 0);
        const balance = this.calculateElementBalance(elements);
        return Math.floor((totalElements + balance) * 5); // 基础能量计算
    }

    /**
     * 计算五行平衡度
     */
    private calculateElementBalance(elements: { [element: string]: number }): number {
        const values = Object.values(elements);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
        return Math.max(0, 10 - variance); // 方差越小，平衡度越高
    }

    /**
     * 统计八字的五行分布
     */
    private countBaZiElements(baZi: any): { [element: string]: number } {
        const elementCount: { [element: string]: number } = {
            '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
        };
        
        // 统计四柱的天干地支五行
        const pillars = [baZi.year, baZi.month, baZi.day, baZi.hour];
        
        pillars.forEach(pillar => {
            // 这里需要实际的天干地支五行映射逻辑
            // 暂时使用简化版本，后续可以接入真实的八字五行计算
            const ganElement = this.getGanElement(pillar.gan);
            const zhiElement = this.getZhiElement(pillar.zhi);
            
            elementCount[ganElement] = (elementCount[ganElement] || 0) + 1;
            elementCount[zhiElement] = (elementCount[zhiElement] || 0) + 1;
        });
        
        return elementCount;
    }

    /**
     * 获取天干对应五行
     */
    private getGanElement(gan: string): string {
        const ganElements: { [key: string]: string } = {
            '甲': '木', '乙': '木',
            '丙': '火', '丁': '火', 
            '戊': '土', '己': '土',
            '庚': '金', '辛': '金',
            '壬': '水', '癸': '水'
        };
        return ganElements[gan] || '土';
    }

    /**
     * 获取地支对应五行
     */
    private getZhiElement(zhi: string): string {
        const zhiElements: { [key: string]: string } = {
            '子': '水', '丑': '土', '寅': '木', '卯': '木',
            '辰': '土', '巳': '火', '午': '火', '未': '土',
            '申': '金', '酉': '金', '戌': '土', '亥': '水'
        };
        return zhiElements[zhi] || '土';
    }

    /**
     * 更新游戏状态UI
     */
    private updateGameStateUI() {
        // 更新本地UI
        this.uiManager.updateUI();
        
        // 更新React UI数据
        const gameStateData = {
            playerHealth: this.gameState.playerRemainingElements,  // 玩家剩余元素（8枚）
            opponentHealth: this.gameState.opponentRemainingElements,  // 对手剩余元素（8枚）
            playerEnergy: this.calculatePlayerEnergy(),  // 根据八字计算能量
            currentTurn: this.gameState.currentCycle,
            playerHandCount: this.playerHand ? this.playerHand.children.entries.length : 0,
            isPlayerTurn: this.gameState.canPlayerUseCards,
            battlefieldCards: this.placedCards.length,
            gameTime: this.gameState.gameTime,
            playerCooldown: this.gameState.playerCooldownRemaining,
            opponentCooldown: this.gameState.opponentCooldownRemaining,
            activePlayer: this.gameState.activePlayer,
            priorityHolder: this.gameState.priorityHolder,
            
            // 八字信息
            playerBazi: this.gameState.playerBazi,
            opponentBazi: this.gameState.opponentBazi,
            playerRemainingElements: this.gameState.playerRemainingElements,
            opponentRemainingElements: this.gameState.opponentRemainingElements,
            
            // 时停系统状态
            isPaused: this.gameState.isPaused,
            pauseReason: this.gameState.pauseReason,
            
            // 弃牌堆状态
            discardPileCount: this.discardPile.length,
            opponentDiscardPileCount: this.opponentDiscardPile.length
        };

        // 发送状态更新事件给React UI
        this.events.emit('gameStateUpdate', gameStateData);
    }

    /**
     * 显示消息（备用方法）
     */
    private showMessage(text: string, type: 'success' | 'warning' | 'error' = 'success') {
        const colors = {
            success: '#00ff88',
            warning: '#ffaa00',
            error: '#ff4444'
        };
        
        const message = this.add.text(this.cameras.main.centerX, 100, text, {
            fontSize: '16px',
            color: colors[type],
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: {
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
            }
        });
        
        message.setOrigin(0.5);
        message.setDepth(1000);
        
        // 自动消失
        this.time.delayedCall(3000, () => {
            message.destroy();
        });
    }

    /**
     * 打开神煞效果面板 - 使用phaser-react-ui事件系统
     */
    private openEffectPanel(cardData: LZoreCard, sourceCard: Phaser.GameObjects.Container) {
        if (this.isEffectPanelOpen) return;
        
        this.isEffectPanelOpen = true;
        
        // ⏸️ 时停：暂停游戏时间
        this.gameState.isPaused = true;
        this.gameState.pauseReason = `正在使用 ${cardData.name} 的神煞能力`;
        
        this.uiManager.showMessage('⏸️ 时空暂停！选择神煞效果...', 'warning');
        
        // 收集目标数据
        const actionType = cardData.type === 'auspicious' ? 'buff' : 'damage';
        const targets = this.collectAllTargets(actionType);
        
        // 发送事件到React UI - 使用phaser-react-ui事件系统
        this.events.emit('effectPanelOpen', {
            cardData: cardData,
            sourceCard: sourceCard,
            targets: targets
        });
    }

    /**
     * 应用效果
     */
    private applyEffect(cardData: LZoreCard, type: 'damage' | 'buff', targetPosition: number) {
        if (type === 'damage') {
            // 对对手造成伤害 - 减少对手的剩余元素
            const damage = Math.min(cardData.power, this.gameState.opponentRemainingElements);
            this.gameState.opponentRemainingElements -= damage;
            
            this.uiManager.showMessage(`对${this.getPillarName(targetPosition)}造成${damage}点元素伤害！对手剩余${this.gameState.opponentRemainingElements}枚元素`, 'error');
            
            // 检查对手是否败北
            if (this.gameState.opponentRemainingElements <= 0) {
                this.onGameEnd('player');
                return;
            }
            
        } else if (type === 'buff') {
            // 为己方增益 - 恢复玩家的剩余元素（不超过8枚）
            const heal = Math.min(cardData.power, 8 - this.gameState.playerRemainingElements);
            this.gameState.playerRemainingElements += heal;
            
            this.uiManager.showMessage(`为${this.getPillarName(targetPosition)}提供${heal}点元素增益！玩家剩余${this.gameState.playerRemainingElements}枚元素`, 'success');
        }
        
        // 卡牌使用效果后保留在格子中，等待元素中和
        this.uiManager.showMessage(`${cardData.name} 已使用效果，等待元素中和...`, 'success');
        
        // 更新UI显示最新的元素数量
        this.updateGameStateUI();
        
        // 检查是否触发元素中和
        this.checkElementNeutralization();
    }

    /**
     * 应用特殊效果
     */
    private applySpecialEffect(effectName: string) {
        this.uiManager.showMessage(`施展特殊效果：${effectName}！`, 'warning');
        
        // 根据特殊效果名称执行不同逻辑
        switch (effectName) {
            case '全体增益':
                const playerHeal = Math.min(2, 8 - this.gameState.playerRemainingElements);
                this.gameState.playerRemainingElements += playerHeal;
                this.uiManager.showMessage(`全体增益：恢复${playerHeal}枚元素！`, 'success');
                break;
                
            case '全体伤害':
                const opponentDamage = Math.min(2, this.gameState.opponentRemainingElements);
                this.gameState.opponentRemainingElements -= opponentDamage;
                this.uiManager.showMessage(`全体伤害：对手失去${opponentDamage}枚元素！`, 'error');
                
                if (this.gameState.opponentRemainingElements <= 0) {
                    this.onGameEnd('player');
                    return;
                }
                break;
                
            case '中和效果':
                this.uiManager.showMessage('强制触发元素中和！', 'warning');
                // 强制触发一次元素中和
                this.forceElementNeutralization();
                break;
        }
        
        // 更新UI显示最新的元素数量
        this.updateGameStateUI();
        
        // 检查是否触发元素中和
        this.checkElementNeutralization();
    }

    /**
     * 强制触发元素中和
     */
    private forceElementNeutralization() {
        const neutralizableCards = this.placedCards.filter(card => {
            const cardData = card.getData('cardData');
            return cardData && !card.getData('neutralized');
        });
        
        if (neutralizableCards.length > 0) {
            const targetCard = neutralizableCards[0]; // 选择第一张卡
            const cardData = targetCard.getData('cardData');
            
            // 标记为已中和
            targetCard.setData('neutralized', true);
            
            // 视觉效果：卡牌变灰
            targetCard.setAlpha(0.5);
            targetCard.list.forEach((child: any) => {
                if (child.setTint) {
                    child.setTint(0x666666);
                }
            });
            
            this.uiManager.showMessage(`⚖️ 强制中和！${cardData.name} 被中和，即将进入弃牌堆！`, 'warning');
            
            // 延迟后移入弃牌堆
            this.time.delayedCall(2000, () => {
                this.moveToDiscardPile(targetCard);
            });
        }
    }

    /**
     * 游戏结束处理
     */
    private onGameEnd(winner: 'player' | 'opponent') {
        this.gameState.gamePhase = 'ended';
        this.gameState.isPaused = true;
        this.gameState.pauseReason = '游戏结束';
        
        const winnerText = winner === 'player' ? '玩家胜利！' : '对手胜利！';
        const message = winner === 'player' 
            ? '🎉 恭喜！你成功消耗了对手的所有元素！' 
            : '💀 失败！你的元素已被全部消耗！';
            
        this.uiManager.showMessage(`${winnerText} ${message}`, winner === 'player' ? 'success' : 'error');
        
        // 3秒后显示重新开始选项
        this.time.delayedCall(3000, () => {
            this.uiManager.showMessage('按R键重新开始游戏', 'success');
            
            // 监听重新开始
            this.input.keyboard!.once('keydown-R', () => {
                this.restartGame();
            });
        });
    }

    /**
     * 重新开始游戏
     */
    private restartGame() {
        // 重置游戏状态
        this.gameState = { ...INITIAL_GAME_STATE };
        this.gameState.gamePhase = 'realtime';
        
        // 清理场景
        this.placedCards.forEach(card => card.destroy());
        this.placedCards = [];
        this.discardPile = [];
        this.opponentDiscardPile = [];
        
        // 重新发牌
        this.playerHand.clear(true);
        this.opponentHand.clear(true);
        this.dealInitialCards();
        
        // 重启实时系统
        this.realtimeManager.startRealtimeSystem();
        
        this.uiManager.showMessage('🔄 游戏重新开始！', 'success');
    }

    /**
     * 检查元素中和机制
     */
    private checkElementNeutralization() {
        // 这里实现复杂的元素中和逻辑
        // 暂时简化为随机触发，实际应该基于五行相克规则
        if (Math.random() < 0.3) { // 30%概率触发中和
            // 寻找可以中和的卡牌
            const neutralizableCards = this.placedCards.filter(card => {
                const cardData = card.getData('cardData');
                return cardData && !card.getData('neutralized');
            });
            
            if (neutralizableCards.length > 0) {
                const targetCard = neutralizableCards[Math.floor(Math.random() * neutralizableCards.length)];
                const cardData = targetCard.getData('cardData');
                
                // 标记为已中和
                targetCard.setData('neutralized', true);
                
                // 视觉效果：卡牌变灰
                targetCard.setAlpha(0.5);
                // 对容器中的所有子对象进行着色
                targetCard.list.forEach((child: any) => {
                    if (child.setTint) {
                        child.setTint(0x666666);
                    }
                });
                
                this.uiManager.showMessage(`⚖️ 元素中和！${cardData.name} 被中和，即将进入弃牌堆！`, 'warning');
                
                // 延迟后移入弃牌堆
                this.time.delayedCall(2000, () => {
                    this.moveToDiscardPile(targetCard);
                });
            }
        }
    }

    /**
     * 将卡牌移入弃牌堆
     */
    private moveToDiscardPile(cardContainer: Phaser.GameObjects.Container) {
        const cardData = cardContainer.getData('cardData');
        const position = cardContainer.getData('position');
        
        // 添加到弃牌堆
        this.discardPile.push(cardData);
        
        // 从战场移除
        this.placedCards = this.placedCards.filter(card => card !== cardContainer);
        
        // 清空战场位置状态
        if (position !== undefined && position !== null) {
            this.battlefieldManager.clearPosition(position);
            // 重置格子的视觉状态
            this.battlefieldManager?.getGridCells()?.[position]?.setFillStyle(0x0066ff, 0.1);
        }
        
        // 创建移入弃牌堆的动画效果
        this.tweens.add({
            targets: cardContainer,
            x: 100, // 弃牌堆位置
            y: 100,
            scaleX: 0.3,
            scaleY: 0.3,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                cardContainer.destroy();
                this.uiManager.showMessage(`${cardData.name} 已进入弃牌堆`, 'success');
                
                // 更新UI状态
                this.updateGameStateUI();
            }
        });
    }

    /**
     * 关闭效果面板 - 使用phaser-react-ui事件系统
     */
    private closeEffectPanel() {
        this.isEffectPanelOpen = false;
        
        // ▶️ 恢复游戏时间
        this.gameState.isPaused = false;
        this.gameState.pauseReason = '';
        
        this.uiManager.showMessage('▶️ 时空恢复！游戏继续...', 'success');
        
        // 通知React UI关闭面板
        this.events.emit('effectPanelClose');
    }

    /**
     * 收集所有可能的目标 - 仍需要在Phaser中使用
     */
    private collectAllTargets(actionType: 'damage' | 'buff'): Array<{
        id: string,
        name: string,
        type: 'fieldCard' | 'bazi',
        owner: 'player' | 'opponent',
        data: any
    }> {
        const targets: Array<{
            id: string,
            name: string,
            type: 'fieldCard' | 'bazi',
            owner: 'player' | 'opponent',
            data: any
        }> = [];
        
        // 收集场上的神煞卡
        this.placedCards.forEach((card, index) => {
            const cardData = card.getData('cardData');
            const isPlayerCard = card.y > this.cameras.main.height / 2; // 根据位置判断归属
            
            // 根据行动类型过滤目标
            if (actionType === 'damage' && isPlayerCard) return; // 伤害不能针对己方卡牌
            if (actionType === 'buff' && !isPlayerCard) return; // 增益不能针对敌方卡牌
            
            if (cardData && !card.getData('neutralized')) {
                targets.push({
                    id: `field_${index}`,
                    name: cardData.name,
                    type: 'fieldCard',
                    owner: isPlayerCard ? 'player' : 'opponent',
                    data: { card, cardData, index }
                });
            }
        });
        
        // 收集本命八字目标
        const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
        
        if (actionType === 'damage') {
            // 伤害：针对对手八字
            pillarNames.forEach((pillarName, index) => {
                targets.push({
                    id: `opponent_bazi_${index}`,
                    name: `对手${pillarName}`,
                    type: 'bazi',
                    owner: 'opponent',
                    data: { pillarIndex: index, pillarName }
                });
            });
        } else {
            // 增益：针对己方八字
            pillarNames.forEach((pillarName, index) => {
                targets.push({
                    id: `player_bazi_${index}`,
                    name: `己方${pillarName}`,
                    type: 'bazi',
                    owner: 'player',
                    data: { pillarIndex: index, pillarName }
                });
            });
        }
        
        return targets;
    }

    /**
     * 获取柱位名称 - 仍需要在其他地方使用
     */
    private getPillarName(position: number): string {
        const names = ['年柱', '月柱', '日柱', '时柱'];
        return names[position % 4];
    }
} 