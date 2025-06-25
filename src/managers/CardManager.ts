import Phaser from 'phaser';
import type { LZoreCard, GameState } from '../types/gameTypes';
import { CARD_DATABASE, GAME_CONFIG } from '../constants/gameData';
import { getElementText, getCardTypeColor, getPillarName, isPositionSafe } from '../utils/gameUtils';

/**
 * 卡牌管理器
 * 负责卡牌创建、渲染、交互
 */
export class CardManager {
    private scene: Phaser.Scene;
    private gameState: GameState;
    private cardDatabase: LZoreCard[];
    private playerHand: Phaser.GameObjects.Group;
    private opponentHand: Phaser.GameObjects.Group;
    private placedCards: Phaser.GameObjects.Container[] = [];
    private opponentPlacedCards: Phaser.GameObjects.Container[] = [];
    private opponentCards: LZoreCard[] = [];

    constructor(
        scene: Phaser.Scene, 
        gameState: GameState,
        playerHand: Phaser.GameObjects.Group,
        opponentHand: Phaser.GameObjects.Group
    ) {
        this.scene = scene;
        this.gameState = gameState;
        this.playerHand = playerHand;
        this.opponentHand = opponentHand;
        this.cardDatabase = [...CARD_DATABASE];
    }

    /**
     * 创建卡牌纹理
     */
    createCardTextures() {
        const { CARD_WIDTH, CARD_HEIGHT } = GAME_CONFIG;
        
        // 吉神卡 - 霓虹青色
        this.createCyberpunkCard('card-auspicious', CARD_WIDTH, CARD_HEIGHT, 0x00ffff, 0x00cccc, 'auspicious');
        
        // 凶神卡 - 霓虹粉色
        this.createCyberpunkCard('card-inauspicious', CARD_WIDTH, CARD_HEIGHT, 0xff00ff, 0xcc00cc, 'inauspicious');
        
        // 特殊神煞卡 - 霓虹紫色
        this.createCyberpunkCard('card-special', CARD_WIDTH, CARD_HEIGHT, 0x9900ff, 0x7700cc, 'special');
        
        // 卡牌背面 - 霓虹蓝色
        this.createCyberpunkCard('card-back', CARD_WIDTH, CARD_HEIGHT, 0x0066ff, 0x0044cc, 'back');
    }
    
    /**
     * 创建赛博朋克风格卡牌
     */
    private createCyberpunkCard(key: string, width: number, height: number, mainColor: number, borderColor: number, type: string) {
        const graphics = this.scene.add.graphics();
        
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
        
        // 根据类型绘制赛博朋克装饰
        this.drawCyberpunkDecoration(graphics, width, height, mainColor, type);
        
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    /**
     * 绘制赛博朋克装饰
     */
    private drawCyberpunkDecoration(graphics: Phaser.GameObjects.Graphics, width: number, height: number, color: number, type: string) {
        graphics.fillStyle(color, 0.8);
        
        switch (type) {
            case 'auspicious':
                // 吉神 - 数字化十字
                this.drawDigitalCross(graphics, width / 2, height / 2, 15, color);
                // 角落电路图案
                this.drawCircuitPattern(graphics, 8, 8, color);
                this.drawCircuitPattern(graphics, width - 8, 8, color);
                this.drawCircuitPattern(graphics, 8, height - 8, color);
                this.drawCircuitPattern(graphics, width - 8, height - 8, color);
                break;
                
            case 'inauspicious':
                // 凶神 - 数字化X
                this.drawDigitalX(graphics, width / 2, height / 2, 15, color);
                // 故障线条
                this.drawGlitchLines(graphics, width, height, color);
                break;
                
            case 'special':
                // 特殊 - 六边形网格
                this.drawHexGrid(graphics, width / 2, height / 2, 12, color);
                break;
                
            case 'back':
                // 卡背 - 数字雨图案
                this.drawDigitalRainPattern(graphics, width, height, color);
                break;
        }
    }

    /**
     * 绘制数字化十字
     */
    private drawDigitalCross(graphics: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number) {
        graphics.fillStyle(color, 0.9);
        
        // 垂直线
        graphics.fillRect(x - 2, y - size, 4, size * 2);
        
        // 水平线
        graphics.fillRect(x - size, y - 2, size * 2, 4);
        
        // 数字化像素点
        const pixels = [
            { x: x - 6, y: y - 6 }, { x: x + 6, y: y - 6 },
            { x: x - 6, y: y + 6 }, { x: x + 6, y: y + 6 }
        ];
        
        pixels.forEach(pixel => {
            graphics.fillRect(pixel.x - 1, pixel.y - 1, 2, 2);
        });
    }

    /**
     * 绘制数字化X
     */
    private drawDigitalX(graphics: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number) {
        graphics.fillStyle(color, 0.9);
        
        // 绘制X的像素块
        for (let i = -size; i <= size; i += 3) {
            // 主对角线
            graphics.fillRect(x + i - 1, y + i - 1, 2, 2);
            // 反对角线
            graphics.fillRect(x + i - 1, y - i - 1, 2, 2);
        }
    }

    /**
     * 绘制电路图案
     */
    private drawCircuitPattern(graphics: Phaser.GameObjects.Graphics, x: number, y: number, color: number) {
        graphics.lineStyle(1, color, 0.6);
        
        // 绘制小型电路
        graphics.moveTo(x - 4, y);
        graphics.lineTo(x + 4, y);
        graphics.moveTo(x, y - 4);
        graphics.lineTo(x, y + 4);
        graphics.strokePath();
        
        // 中心点
        graphics.fillStyle(color, 0.8);
        graphics.fillRect(x - 1, y - 1, 2, 2);
    }

    /**
     * 绘制故障线条
     */
    private drawGlitchLines(graphics: Phaser.GameObjects.Graphics, width: number, height: number, color: number) {
        graphics.lineStyle(1, color, 0.4);
        
        // 随机故障线条
        for (let i = 0; i < 5; i++) {
            const y = Math.random() * height;
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }
        
        graphics.strokePath();
    }

    /**
     * 绘制六边形网格
     */
    private drawHexGrid(graphics: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number) {
        graphics.lineStyle(2, color, 0.7);
        
        // 绘制六边形
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            points.push({
                x: x + Math.cos(angle) * size,
                y: y + Math.sin(angle) * size
            });
        }
        
        for (let i = 0; i < points.length; i++) {
            const nextIndex = (i + 1) % points.length;
            graphics.moveTo(points[i].x, points[i].y);
            graphics.lineTo(points[nextIndex].x, points[nextIndex].y);
        }
        
        graphics.strokePath();
    }

    /**
     * 绘制数字雨图案
     */
    private drawDigitalRainPattern(graphics: Phaser.GameObjects.Graphics, width: number, height: number, color: number) {
        graphics.fillStyle(color, 0.3);
        
        for (let x = 5; x < width - 5; x += 8) {
            for (let y = 10; y < height - 5; y += 10) {
                if (Math.random() < 0.3) {
                    // 绘制简单的数字像素块
                    graphics.fillRect(x, y, 2, 6);
                }
            }
        }
    }

    /**
     * 发初始手牌
     */
    dealInitialCards() {
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
     * 创建卡牌容器
     */
    createCard(cardData: LZoreCard, x: number, y: number): Phaser.GameObjects.Container {
        const { CARD_WIDTH, CARD_HEIGHT } = GAME_CONFIG;
        const container = this.scene.add.container(x, y);
        
        // 获取卡牌背景纹理
        const cardTexture = this.getCyberpunkCardTexture(cardData.type);
        const cardBg = this.scene.add.image(0, 0, cardTexture);
        cardBg.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
        container.add(cardBg);
        
        // 添加发光效果
        this.addCardGlowEffect(container, this.getCyberpunkCardColor(cardData.type));
        
        // 卡牌标题
        const title = this.scene.add.text(0, -CARD_HEIGHT / 2 + 20, cardData.name, {
            fontSize: '14px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        container.add(title);
        
        // 卡牌类型和元素
        const typeText = this.scene.add.text(-CARD_WIDTH / 2 + 10, -CARD_HEIGHT / 2 + 40, 
            cardData.type === 'auspicious' ? '吉神' : '凶神', {
            fontSize: '10px',
            color: this.getRarityColor(cardData.rarity)
        });
        container.add(typeText);
        
        // 神煞名称
        const shenShaText = this.scene.add.text(0, 10, cardData.shenSha, {
            fontSize: '12px',
            color: '#88ffff',
            fontStyle: 'bold'
        });
        shenShaText.setOrigin(0.5);
        container.add(shenShaText);
        
        // 效果描述
        const effectText = this.scene.add.text(0, 30, cardData.description || '', {
            fontSize: '8px',
            color: '#cccccc',
            wordWrap: { width: CARD_WIDTH - 20 },
            align: 'center'
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
     * 获取赛博朋克卡牌颜色
     */
    private getCyberpunkCardColor(type: string): number {
        switch (type) {
            case 'auspicious': return 0x00ffff;  // 青色
            case 'inauspicious': return 0xff00ff; // 粉色
            case 'special': return 0x9900ff;     // 紫色
            default: return 0x0066ff;            // 蓝色
        }
    }

    /**
     * 获取稀有度颜色
     */
    private getRarityColor(rarity: string): string {
        switch (rarity) {
            case 'common': return '#cccccc';
            case 'rare': return '#00ffff';
            case 'epic': return '#9900ff';
            case 'legendary': return '#ff8800';
            default: return '#ffffff';
        }
    }

    /**
     * 添加卡牌发光效果
     */
    private addCardGlowEffect(container: Phaser.GameObjects.Container, color: number) {
        const glow = this.scene.add.graphics();
        glow.lineStyle(4, color, 0.3);
        glow.strokeRect(-GAME_CONFIG.CARD_WIDTH / 2, -GAME_CONFIG.CARD_HEIGHT / 2, 
                       GAME_CONFIG.CARD_WIDTH, GAME_CONFIG.CARD_HEIGHT);
        
        glow.lineStyle(2, color, 0.5);
        glow.strokeRect(-GAME_CONFIG.CARD_WIDTH / 2 + 1, -GAME_CONFIG.CARD_HEIGHT / 2 + 1, 
                       GAME_CONFIG.CARD_WIDTH - 2, GAME_CONFIG.CARD_HEIGHT - 2);
        
        container.add(glow);
        glow.setDepth(-1); // 放在背景层
    }

    /**
     * 创建对手卡牌
     */
    createOpponentCard(cardData: LZoreCard, x: number, y: number): Phaser.GameObjects.Container {
        const { CARD_WIDTH, CARD_HEIGHT } = GAME_CONFIG;
        const container = this.scene.add.container(x, y);
        
        // 对手卡牌显示为卡背
        const cardBg = this.scene.add.image(0, 0, 'card-back');
        cardBg.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
        container.add(cardBg);
        
        // 添加对手卡牌特效
        this.createOpponentCardEffects(container);
        
        // 存储卡牌数据
        container.setData('cardData', cardData);
        container.setData('originalX', x);
        container.setData('originalY', y);
        
        container.setSize(CARD_WIDTH, CARD_HEIGHT);
        
        return container;
    }

    /**
     * 创建对手卡牌特效
     */
    private createOpponentCardEffects(container: Phaser.GameObjects.Container) {
        // 神秘发光效果
        const glow = this.scene.add.graphics();
        glow.lineStyle(3, 0x6600ff, 0.4);
        glow.strokeRect(-GAME_CONFIG.CARD_WIDTH / 2, -GAME_CONFIG.CARD_HEIGHT / 2, 
                       GAME_CONFIG.CARD_WIDTH, GAME_CONFIG.CARD_HEIGHT);
        
        container.add(glow);
        glow.setDepth(-1);
        
        // 呼吸动画
        this.scene.tweens.add({
            targets: glow,
            alpha: 0.2,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    /**
     * 抽牌
     */
    drawCard(): Phaser.GameObjects.Container | null {
        if (this.playerHand.children.entries.length >= 7) {
            return null; // 手牌已满
        }
        
        // 从卡牌数据库中随机选择一张卡
        const randomCard = this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)];
        
        // 计算新卡牌位置
        const handCount = this.playerHand.children.entries.length;
        const startX = this.scene.cameras.main.width * 0.15;
        const cardSpacing = 110;
        const x = startX + handCount * cardSpacing;
        const y = this.scene.cameras.main.height - 108;
        
        // 创建卡牌
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
        
        return cardContainer;
    }

    /**
     * 对手抽牌
     */
    drawOpponentCard(): Phaser.GameObjects.Container | null {
        if (this.opponentHand.children.entries.length >= 7) {
            return null; // 手牌已满
        }
        
        // 从卡牌数据库中随机选择一张卡
        const randomCard = this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)];
        this.opponentCards.push(randomCard);
        
        // 计算新卡牌位置
        const handCount = this.opponentHand.children.entries.length;
        const startX = this.scene.cameras.main.width * 0.15;
        const cardSpacing = 110;
        const x = startX + handCount * cardSpacing;
        const y = 90; // 对手手牌区域
        
        // 创建对手卡牌
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
     * 设置卡牌悬停效果
     */
    setupCardHoverEffects(cardContainer: Phaser.GameObjects.Container) {
        const originalScale = cardContainer.scaleX;
        const originalY = cardContainer.y;
        
        cardContainer.on('pointerover', () => {
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
            
            // 显示卡牌详情
            const cardData = cardContainer.getData('cardData') as LZoreCard;
            if (cardData) {
                this.showCardTooltip(cardContainer, cardData);
            }
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
            this.hideCardTooltip();
        });
    }

    /**
     * 显示卡牌提示
     */
    private showCardTooltip(cardContainer: Phaser.GameObjects.Container, cardData: LZoreCard) {
        // 这里可以实现卡牌详情提示
        // 暂时省略具体实现
    }

    /**
     * 隐藏卡牌提示
     */
    private hideCardTooltip() {
        // 这里可以实现隐藏卡牌详情提示
        // 暂时省略具体实现
    }

    /**
     * 获取玩家手牌数量
     */
    getPlayerHandCount(): number {
        return this.playerHand.children.entries.length;
    }

    /**
     * 获取对手手牌数量
     */
    getOpponentHandCount(): number {
        return this.opponentHand.children.entries.length;
    }

    /**
     * 获取已放置卡牌
     */
    getPlacedCards(): Phaser.GameObjects.Container[] {
        return this.placedCards;
    }

    /**
     * 添加已放置卡牌
     */
    addPlacedCard(card: Phaser.GameObjects.Container) {
        this.placedCards.push(card);
    }

    /**
     * 获取对手已放置卡牌
     */
    getOpponentPlacedCards(): Phaser.GameObjects.Container[] {
        return this.opponentPlacedCards;
    }

    /**
     * 添加对手已放置卡牌
     */
    addOpponentPlacedCard(card: Phaser.GameObjects.Container) {
        this.opponentPlacedCards.push(card);
    }
} 