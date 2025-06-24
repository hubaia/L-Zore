import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

/**
 * L-Zore神煞卡牌数据结构
 */
interface LZoreCard {
    id: string;
    name: string;
    type: 'auspicious' | 'inauspicious' | 'special';
    element: 'metal' | 'wood' | 'water' | 'fire' | 'earth' | 'special';
    power: number;
    cost: number;
    rarity: string;
    description: string;
    effect: string;
}

/**
 * 游戏状态接口
 */
interface GameState {
    currentTurn: number;
    actionPoints: number;
    playerHealth: number;
    opponentHealth: number;
    gamePhase: 'preparation' | 'battle' | 'ended';
}

/**
 * L-Zore神煞卡牌游戏场景
 * 使用Phaser引擎实现的高性能卡牌战斗系统
 */
class LZoreGameScene extends Phaser.Scene {
    private gameState!: GameState;
    private playerHand!: Phaser.GameObjects.Group;
    private opponentHand!: Phaser.GameObjects.Group;
    private battleField!: Phaser.GameObjects.Container;
    private cardDatabase!: LZoreCard[];
    private draggedCard: Phaser.GameObjects.Sprite | null = null;
    private dropZones: Phaser.GameObjects.Zone[] = [];
    private particles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

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
        // 初始化游戏状态
        this.initializeGameState();
        
        // 创建游戏背景
        this.createBackground();
        
        // 创建战场布局
        this.createBattleField();
        
        // 创建卡牌数据库
        this.createCardDatabase();
        
        // 创建玩家手牌区域
        this.createPlayerHandArea();
        
        // 创建对手手牌区域
        this.createOpponentHandArea();
        
        // 设置拖拽系统
        this.setupDragAndDrop();
        
        // 创建UI界面
        this.createGameUI();
        
        // 创建粒子系统
        this.createParticleEffects();
        
        // 发初始手牌
        this.dealInitialCards();
        
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
        const cardWidth = 120;
        const cardHeight = 180;
        
        // 创建不同类型的卡牌背景
        const cardTypes = [
            { key: 'card-auspicious', color: 0x4CAF50, borderColor: 0x2E7D32 },
            { key: 'card-inauspicious', color: 0xF44336, borderColor: 0xC62828 },
            { key: 'card-special', color: 0xFF9800, borderColor: 0xE65100 },
            { key: 'card-back', color: 0x3F51B5, borderColor: 0x1A237E }
        ];

        cardTypes.forEach(cardType => {
            const graphics = this.add.graphics();
            
            // 卡牌主体
            graphics.fillStyle(cardType.color);
            graphics.fillRoundedRect(0, 0, cardWidth, cardHeight, 8);
            
            // 卡牌边框
            graphics.lineStyle(3, cardType.borderColor);
            graphics.strokeRoundedRect(0, 0, cardWidth, cardHeight, 8);
            
            // 装饰图案
            graphics.fillStyle(cardType.borderColor);
            graphics.fillCircle(cardWidth / 2, 20, 8);
            graphics.fillCircle(cardWidth / 2, cardHeight - 20, 8);
            
            graphics.generateTexture(cardType.key, cardWidth, cardHeight);
            graphics.destroy();
        });
    }

    /**
     * 初始化游戏状态
     */
    private initializeGameState() {
        this.gameState = {
            currentTurn: 1,
            actionPoints: 3,
            playerHealth: 8,
            opponentHealth: 8,
            gamePhase: 'preparation'
        };
    }

    /**
     * 创建游戏背景
     */
    private createBackground() {
        const { width, height } = this.scale;
        
        // 创建渐变背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x533483);
        bg.fillRect(0, 0, width, height);
        
        // 添加星空效果
        for (let i = 0; i < 50; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 3),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 0.8)
            );
            
            // 星星闪烁动画
            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1
            });
        }
    }

    /**
     * 创建战场布局
     */
    private createBattleField() {
        const { width, height } = this.scale;
        
        // 创建八格战场容器
        this.battleField = this.add.container(width / 2, height / 2);
        
        // 创建八个格子（四柱八字）
        const gridSize = 80;
        const gridSpacing = 90;
        
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 4; col++) {
                const x = (col - 1.5) * gridSpacing;
                const y = (row - 0.5) * gridSpacing;
                
                // 创建格子背景
                const gridCell = this.add.rectangle(x, y, gridSize, gridSize, 0x2c3e50, 0.7);
                gridCell.setStrokeStyle(2, 0x34495e);
                this.battleField.add(gridCell);
                
                // 创建投放区域
                const dropZone = this.add.zone(x, y, gridSize, gridSize);
                dropZone.setRectangleDropZone(gridSize, gridSize);
                dropZone.setData('position', row * 4 + col);
                this.battleField.add(dropZone);
                this.dropZones.push(dropZone);
                
                // 添加柱位标签
                const pillarLabels = ['年柱', '月柱', '日柱', '时柱'];
                const stemBranch = row === 0 ? '天干' : '地支';
                
                const label = this.add.text(x, y + 40, `${pillarLabels[col]}\\n${stemBranch}`, {
                    fontSize: '10px',
                    color: '#ecf0f1',
                    align: 'center'
                });
                label.setOrigin(0.5);
                this.battleField.add(label);
            }
        }
    }

    /**
     * 创建卡牌数据库
     */
    private createCardDatabase() {
        this.cardDatabase = [
            {
                id: 'tianyiguiren',
                name: '天乙贵人',
                type: 'auspicious',
                element: 'metal',
                power: 4,
                cost: 2,
                rarity: '⭐⭐⭐',
                description: '最高吉星，避免厄运，遇事有人帮',
                effect: '保护己方4枚元素不被中和'
            },
            {
                id: 'wenchang',
                name: '文昌贵人',
                type: 'auspicious',
                element: 'water',
                power: 2,
                cost: 1,
                rarity: '⭐⭐',
                description: '聪明擅艺，主聪明过人，利考试学术',
                effect: '中和对方2枚元素，智慧加成'
            },
            {
                id: 'yangren',
                name: '羊刃',
                type: 'inauspicious',
                element: 'fire',
                power: 3,
                cost: 2,
                rarity: '⭐⭐⭐',
                description: '刚烈冲动，易惹是非，吉则勇猛',
                effect: '中和对方3枚元素，可能反噬'
            },
            {
                id: 'huagai',
                name: '华盖',
                type: 'special',
                element: 'earth',
                power: 1,
                cost: 1,
                rarity: '⭐',
                description: '性情恬淡资质聪颖，易倾向宗教艺术',
                effect: '隐藏战术意图，属性转换'
            },
            {
                id: 'yima',
                name: '驿马',
                type: 'special',
                element: 'fire',
                power: 2,
                cost: 1,
                rarity: '⭐⭐',
                description: '主奔波变动异地发展，吉则升迁远行',
                effect: '增加行动次数，快速移动'
            }
        ];
    }

    /**
     * 创建玩家手牌区域
     */
    private createPlayerHandArea() {
        const { width, height } = this.scale;
        
        this.playerHand = this.add.group();
        
        // 手牌背景
        const handBg = this.add.rectangle(width / 2, height - 100, width - 40, 160, 0x2c3e50, 0.8);
        handBg.setStrokeStyle(2, 0x3498db);
    }

    /**
     * 创建对手手牌区域
     */
    private createOpponentHandArea() {
        const { width } = this.scale;
        
        this.opponentHand = this.add.group();
        
        // 对手手牌背景
        const opponentBg = this.add.rectangle(width / 2, 100, width - 40, 160, 0x2c3e50, 0.8);
        opponentBg.setStrokeStyle(2, 0xe74c3c);
    }

    /**
     * 设置拖拽系统
     */
    private setupDragAndDrop() {
        // 拖拽开始
        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
            this.draggedCard = gameObject;
            
            // 卡牌拖拽效果
            this.tweens.add({
                targets: gameObject,
                scaleX: 1.1,
                scaleY: 1.1,
                rotation: 0.1,
                alpha: 0.8,
                duration: 150,
                ease: 'Power2'
            });
            
            // 高亮可放置区域
            this.highlightDropZones(true);
        });

        // 拖拽中
        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        // 拖拽结束
        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dropped: boolean) => {
            if (!dropped) {
                // 返回原位置
                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.getData('originalX'),
                    y: gameObject.getData('originalY'),
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 0,
                    alpha: 1,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            }
            
            this.draggedCard = null;
            this.highlightDropZones(false);
        });

        // 放置卡牌
        this.input.on('drop', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone) => {
            this.dropCard(gameObject, dropZone);
        });
    }

    /**
     * 高亮投放区域
     */
    private highlightDropZones(highlight: boolean) {
        this.dropZones.forEach((zone, index) => {
            const gridCell = this.battleField.list[index * 3]; // 假设每个位置有3个对象
            
            if (highlight) {
                this.tweens.add({
                    targets: gridCell,
                    alpha: 1,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 200,
                    ease: 'Power2'
                });
            } else {
                this.tweens.add({
                    targets: gridCell,
                    alpha: 0.7,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Power2'
                });
            }
        });
    }

    /**
     * 放置卡牌
     */
    private dropCard(cardSprite: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone) {
        const position = dropZone.getData('position');
        
        // 卡牌放置动画
        this.tweens.add({
            targets: cardSprite,
            x: dropZone.x,
            y: dropZone.y,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            alpha: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                // 播放神煞激活特效
                this.playGodActivationEffect(dropZone.x, dropZone.y);
                
                // 发送卡牌放置事件
                this.events.emit('cardPlaced', {
                    card: cardSprite.getData('cardData'),
                    position: position
                });
            }
        });
    }

    /**
     * 创建游戏UI
     */
    private createGameUI() {
        const { width, height } = this.scale;
        
        // 状态栏
        const statusBar = this.add.rectangle(width / 2, 50, width - 40, 80, 0x2c3e50, 0.9);
        statusBar.setStrokeStyle(2, 0x3498db);
        
        // 回合数显示
        this.add.text(50, 30, `回合: ${this.gameState.currentTurn}`, {
            fontSize: '16px',
            color: '#ecf0f1'
        });
        
        // 行动点数显示
        this.add.text(50, 50, `行动点: ${this.gameState.actionPoints}`, {
            fontSize: '16px',
            color: '#e74c3c'
        });
        
        // 玩家生命值
        this.add.text(width - 150, 30, `玩家生命: ${this.gameState.playerHealth}`, {
            fontSize: '16px',
            color: '#2ecc71'
        });
        
        // 对手生命值
        this.add.text(width - 150, 50, `对手生命: ${this.gameState.opponentHealth}`, {
            fontSize: '16px',
            color: '#e74c3c'
        });
    }

    /**
     * 创建粒子效果
     */
    private createParticleEffects() {
        // 创建神煞激活粒子效果
        const godActivationParticles = this.add.particles(0, 0, 'particle', {
            scale: { start: 0.5, end: 0 },
            speed: { min: 50, max: 150 },
            alpha: { start: 1, end: 0 },
            lifespan: 600,
            tint: [0xffd700, 0xff6347, 0x00ff7f]
        });
        
        this.particles.push(godActivationParticles);
    }

    /**
     * 发初始手牌
     */
    private dealInitialCards() {
        const { width, height } = this.scale;
        
        // 给玩家发5张牌
        for (let i = 0; i < 5; i++) {
            const card = this.createCard(this.cardDatabase[i % this.cardDatabase.length], true);
            const cardX = width / 2 + (i - 2) * 130;
            const cardY = height - 100;
            
            card.setPosition(cardX, cardY);
            card.setData('originalX', cardX);
            card.setData('originalY', cardY);
            
            this.playerHand.add(card);
            
            // 发牌动画
            this.tweens.add({
                targets: card,
                y: cardY,
                duration: 300 + i * 100,
                ease: 'Back.easeOut',
                delay: i * 100
            });
        }
        
        // 给对手发5张牌背
        for (let i = 0; i < 5; i++) {
            const cardBack = this.createCard(null, false);
            const cardX = width / 2 + (i - 2) * 130;
            const cardY = 100;
            
            cardBack.setPosition(cardX, cardY);
            this.opponentHand.add(cardBack);
            
            // 发牌动画
            this.tweens.add({
                targets: cardBack,
                y: cardY,
                duration: 300 + i * 100,
                ease: 'Back.easeOut',
                delay: i * 100
            });
        }
    }

    /**
     * 创建卡牌精灵
     */
    private createCard(cardData: LZoreCard | null, isPlayerCard: boolean): Phaser.GameObjects.Sprite {
        let textureKey: string;
        
        if (cardData) {
            textureKey = `card-${cardData.type}`;
        } else {
            textureKey = 'card-back';
        }
        
        const card = this.add.sprite(0, 0, textureKey);
        card.setScale(0.8);
        card.setData('cardData', cardData);
        
        if (isPlayerCard && cardData) {
            // 设置为可交互和拖拽
            card.setInteractive();
            this.input.setDraggable(card);
            
            // 添加悬停效果
            card.on('pointerover', () => {
                this.tweens.add({
                    targets: card,
                    scaleX: 0.85,
                    scaleY: 0.85,
                    y: card.y - 10,
                    duration: 150,
                    ease: 'Power2'
                });
            });
            
            card.on('pointerout', () => {
                if (this.draggedCard !== card) {
                    this.tweens.add({
                        targets: card,
                        scaleX: 0.8,
                        scaleY: 0.8,
                        y: card.getData('originalY'),
                        duration: 150,
                        ease: 'Power2'
                    });
                }
            });
            
            // 添加卡牌文本信息
            this.addCardText(card, cardData);
        }
        
        return card;
    }

    /**
     * 添加卡牌文本信息
     */
    private addCardText(card: Phaser.GameObjects.Sprite, cardData: LZoreCard) {
        // 卡牌名称
        const nameText = this.add.text(card.x, card.y - 60, cardData.name, {
            fontSize: '12px',
            color: '#ffffff',
            align: 'center'
        });
        nameText.setOrigin(0.5);
        
        // 威力值
        const powerText = this.add.text(card.x - 40, card.y + 40, `⚡${cardData.power}`, {
            fontSize: '14px',
            color: '#f1c40f'
        });
        
        // 消耗值
        const costText = this.add.text(card.x + 40, card.y + 40, `💰${cardData.cost}`, {
            fontSize: '14px',
            color: '#e74c3c'
        });
    }

    /**
     * 播放神煞激活特效
     */
    private playGodActivationEffect(x: number, y: number) {
        // 粒子爆发效果
        this.particles[0].emitParticleAt(x, y, 30);
        
        // 闪光效果
        const flash = this.add.circle(x, y, 50, 0xffffff, 0.8);
        this.tweens.add({
            targets: flash,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });
    }
}

/**
 * React UI组件接口
 */
interface LZorePhaserGameProps {
    onGameStateChange?: (state: GameState) => void;
    onCardPlayed?: (cardData: LZoreCard, position: number) => void;
}

/**
 * L-Zore Phaser游戏React组件
 * 集成Phaser游戏引擎与React UI系统
 */
export const LZorePhaserGame: React.FC<LZorePhaserGameProps> = ({ 
    onGameStateChange, 
    onCardPlayed 
}) => {
    const gameRef = useRef<HTMLDivElement>(null);
    const phaserGameRef = useRef<Phaser.Game | null>(null);
    const [gameReady, setGameReady] = useState(false);
    const [gameState, setGameState] = useState<GameState>({
        currentTurn: 1,
        actionPoints: 3,
        playerHealth: 8,
        opponentHealth: 8,
        gamePhase: 'preparation'
    });

    useEffect(() => {
        if (!gameRef.current) return;

        // Phaser游戏配置
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 1200,
            height: 800,
            parent: gameRef.current,
            backgroundColor: '#1a1a2e',
            scene: LZoreGameScene,
            
            // 物理引擎配置
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: false
                }
            },
            
            // 输入配置
            input: {
                activePointers: 3 // 支持多点触控
            },
            
            // 缩放配置
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                min: {
                    width: 800,
                    height: 600
                },
                max: {
                    width: 1600,
                    height: 1200
                }
            },
            
            // 渲染配置
            render: {
                antialias: true,
                pixelArt: false,
                roundPixels: false
            }
        };

        phaserGameRef.current = new Phaser.Game(config);

        // 监听游戏事件
        phaserGameRef.current.events.once('ready', () => {
            setGameReady(true);
            
            const scene = phaserGameRef.current?.scene.getScene('LZoreGameScene') as LZoreGameScene;
            if (scene) {
                // 监听游戏状态变化
                scene.events.on('gameStateChanged', (newState: GameState) => {
                    setGameState(newState);
                    onGameStateChange?.(newState);
                });
                
                // 监听卡牌放置事件
                scene.events.on('cardPlaced', (data: { card: LZoreCard, position: number }) => {
                    onCardPlayed?.(data.card, data.position);
                });
            }
        });

        return () => {
            if (phaserGameRef.current) {
                phaserGameRef.current.destroy(true);
                phaserGameRef.current = null;
            }
        };
    }, [onGameStateChange, onCardPlayed]);

    return (
        <div className="relative w-full h-full bg-gray-900">
            {/* Phaser游戏容器 */}
            <div 
                ref={gameRef} 
                className="w-full h-full rounded-lg overflow-hidden shadow-2xl"
            />
            
            {/* 加载状态 */}
            {!gameReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        <div className="text-white text-xl font-bold">
                            🌟 L-Zore神煞系统启动中...
                        </div>
                        <div className="text-gray-300 text-sm mt-2">
                            正在初始化赛博朋克命理战斗引擎
                        </div>
                    </div>
                </div>
            )}
            
            {/* React UI覆盖层 */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
                <div className="text-sm space-y-2">
                    <div>🎮 回合: {gameState.currentTurn}</div>
                    <div>⚡ 行动点: {gameState.actionPoints}</div>
                    <div>❤️ 生命值: {gameState.playerHealth}</div>
                    <div>🎯 阶段: {gameState.gamePhase}</div>
                </div>
            </div>
            
            {/* 游戏控制按钮 */}
            <div className="absolute bottom-4 left-4 flex gap-2">
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => {
                        const scene = phaserGameRef.current?.scene.getScene('LZoreGameScene');
                        scene?.events.emit('endTurn');
                    }}
                >
                    结束回合
                </button>
                
                <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => {
                        const scene = phaserGameRef.current?.scene.getScene('LZoreGameScene');
                        scene?.events.emit('useSpecialAbility');
                    }}
                >
                    特殊能力
                </button>
            </div>
        </div>
    );
};
