import Phaser from 'phaser';
import { Interface } from 'phaser-react-ui';
import type { LZoreCard, GameState, OpponentAction } from '../types/gameTypes';
import { CARD_DATABASE, INITIAL_GAME_STATE, GAME_CONFIG } from '../constants/gameData';
import { getElementText, getCardTypeColor, getPillarName, isPositionSafe, PixelDrawUtils, getFullBaZiText, getBaZiPillarInfo } from '../utils/gameUtils';
import { LZoreGameUI } from '../components/LZoreGameUI';

/**
 * L-Zore神煞卡牌游戏场景
 * 使用Phaser引擎实现的高性能卡牌战斗系统
 */
export class LZoreGameScene extends Phaser.Scene {
    private gameState!: GameState;
    private playerHand!: Phaser.GameObjects.Group;
    private opponentHand!: Phaser.GameObjects.Group;
    private battleField!: Phaser.GameObjects.Container;
    private cardDatabase!: LZoreCard[];
    private draggedCard: Phaser.GameObjects.Container | null = null;
    private dropZones: Phaser.GameObjects.Zone[] = [];
    private gridCells: Phaser.GameObjects.Rectangle[] = []; // 存储格子引用
    private particles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
    private uiTexts: { [key: string]: Phaser.GameObjects.Text } = {};
    
    // 神煞效果界面相关
    private effectPanel: Phaser.GameObjects.Container | null = null;
    private placedCards: Phaser.GameObjects.Container[] = [];
    private isEffectPanelOpen: boolean = false;
    
    // AI对手系统
    private opponentCards: LZoreCard[] = []; // 对手的卡牌
    private opponentPlacedCards: Phaser.GameObjects.Container[] = []; // 对手已放置的卡牌
    private isOpponentTurn: boolean = false;
    
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
     * 创建赛博朋克风格卡牌纹理
     */
    private createCardTextures() {
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
        const chars = ['0', '1', '一', '二'];
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
     * 初始化游戏状态 - 即时系统
     */
    private initializeGameState() {
        this.gameState = { ...INITIAL_GAME_STATE };
        this.gameState.gamePhase = 'realtime'; // 直接进入实时模式
        
        // 启动实时系统
        this.startRealtimeSystem();
    }
    
    /**
     * 启动实时系统
     */
    private startRealtimeSystem() {
        // 游戏主计时器 - 每100ms更新一次
        this.time.addEvent({
            delay: 100,
            callback: this.updateRealtimeSystem,
            callbackScope: this,
            loop: true
        });
        
        // 自动抽卡计时器 - 每3秒自动抽卡
        this.time.addEvent({
            delay: GAME_CONFIG.AUTO_DRAW_INTERVAL * 1000,
            callback: this.autoDrawCards,
            callbackScope: this,
            loop: true
        });
        
        this.showMessage('🚀 即时卡牌系统启动！双方同时进行，抢先打出获得优先权！', 'success');
    }
    
    /**
     * 更新实时系统
     */
    private updateRealtimeSystem() {
        if (this.gameState.gamePhase !== 'realtime') return;
        
        // 更新游戏时间
        this.gameState.gameTime += 0.1;
        
        // 更新周期
        const newCycle = Math.floor(this.gameState.gameTime / GAME_CONFIG.CYCLE_DURATION) + 1;
        if (newCycle > this.gameState.currentCycle) {
            this.gameState.currentCycle = newCycle;
            this.onNewCycle();
        }
        
        // 更新冷却时间
        if (this.gameState.playerCooldownRemaining > 0) {
            this.gameState.playerCooldownRemaining = Math.max(0, this.gameState.playerCooldownRemaining - 0.1);
            this.gameState.canPlayerUseCards = this.gameState.playerCooldownRemaining <= 0;
        }
        
        if (this.gameState.opponentCooldownRemaining > 0) {
            this.gameState.opponentCooldownRemaining = Math.max(0, this.gameState.opponentCooldownRemaining - 0.1);
            this.gameState.canOpponentUseCards = this.gameState.opponentCooldownRemaining <= 0;
        }
        
        // 检查优先权超时
        this.checkPriorityTimeout();
        
        // 更新UI
        this.updateGameStateUI();
    }
    
    /**
     * 新周期开始
     */
    private onNewCycle() {
        this.showMessage(`🔄 第${this.gameState.currentCycle}周期开始！公共卡池更新`, 'warning');
        // 这里可以添加公共卡池更新逻辑
    }
    
    /**
     * 自动抽卡系统
     */
    private autoDrawCards() {
        if (this.gameState.gamePhase !== 'realtime') return;
        
        // 双方同时自动抽卡
        if (this.playerHand.children.entries.length < 7) {
            this.drawCard();
        }
        
        if (this.opponentHand.children.entries.length < 7) {
            this.drawOpponentCard();
        }
    }
    
    /**
     * 检查优先权超时
     */
    private checkPriorityTimeout() {
        // 如果有优先权持有者但超过超时时间，重置优先权
        if (this.gameState.priorityHolder !== 'none' && this.gameState.activePlayer !== 'none') {
            // 这里可以添加超时逻辑
        }
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

        this.events.on('endTurn', () => {
            this.endTurn();
        });

        this.events.on('useSpecialAbility', () => {
            this.useSpecialAbility();
        });

        this.events.on('effectTarget', (position: number) => {
            console.log('选择目标位置:', position);
            // 处理效果目标选择
            this.closeEffectPanel();
        });

        this.events.on('closeEffectPanel', () => {
            this.closeEffectPanel();
        });
    }

    /**
     * 更新游戏状态UI
     */
    private updateGameStateUI() {
        const gameStateData = {
            playerHealth: 100, // 可以从实际游戏状态获取
            opponentHealth: 100,
            playerEnergy: 50,
            currentTurn: this.gameState.currentCycle, // 使用当前周期
            playerHandCount: this.playerHand ? this.playerHand.children.entries.length : 0,
            isPlayerTurn: this.gameState.canPlayerUseCards, // 基于是否可以使用卡牌
            battlefieldCards: this.placedCards.length,
            
            // 新增即时系统状态
            gameTime: this.gameState.gameTime,
            playerCooldown: this.gameState.playerCooldownRemaining,
            opponentCooldown: this.gameState.opponentCooldownRemaining,
            activePlayer: this.gameState.activePlayer,
            priorityHolder: this.gameState.priorityHolder
        };

        // 发送状态更新事件给React UI
        this.events.emit('gameStateUpdate', gameStateData);
    }

    /**
     * 创建卡牌数据库
     */
    private createCardDatabase() {
        this.cardDatabase = [...CARD_DATABASE];
    }

    /**
     * 创建赛博朋克像素风背景
     */
    private createBackground() {
        const { width, height } = this.scale;
        
        // 创建赛博朋克渐变背景
        this.createCyberpunkGradient(width, height);
        
        // 添加赛博朋克网格纹理
        this.createCyberpunkGrid(width, height);
        
        // 添加数字雨效果
        this.createDigitalRain(width, height);
        
        // 添加扫描线效果
        this.createScanLines(width, height);
        
        // 添加霓虹装饰边框
        this.createNeonBorders(width, height);
        
        // 添加故障效果
        this.createGlitchEffect(width, height);
    }

    /**
     * 创建赛博朋克渐变背景
     */
    private createCyberpunkGradient(width: number, height: number) {
        const bg = this.add.graphics();
        
        // 使用多层矩形模拟赛博朋克渐变
        const colors = [
            { color: 0x0f0f23, alpha: 1.0 },      // 深蓝黑
            { color: 0x1a1a2e, alpha: 0.9 },      // 深紫蓝
            { color: 0x16213e, alpha: 0.8 },      // 中蓝
            { color: 0x0f3460, alpha: 0.7 },      // 深蓝
            { color: 0x533483, alpha: 0.6 }       // 紫色
        ];
        
        colors.forEach((colorData, index) => {
            const layerHeight = height / colors.length;
            bg.fillStyle(colorData.color, colorData.alpha);
            bg.fillRect(0, index * layerHeight, width, layerHeight * 1.2);
        });
    }

    /**
     * 创建赛博朋克网格
     */
    private createCyberpunkGrid(width: number, height: number) {
        const gridGraphics = this.add.graphics();
        
        // 霓虹青色网格线
        gridGraphics.lineStyle(1, 0x00ffff, 0.3);
        
        // 绘制垂直网格线 (更密集)
        for (let x = 0; x < width; x += 20) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, height);
        }
        
        // 绘制水平网格线
        for (let y = 0; y < height; y += 20) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(width, y);
        }
        
        gridGraphics.strokePath();
        
        // 添加重点网格线 (霓虹粉色)
        gridGraphics.lineStyle(2, 0xff00ff, 0.5);
        
        // 每隔100像素画一条重点线
        for (let x = 0; x < width; x += 100) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, height);
        }
        
        for (let y = 0; y < height; y += 100) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(width, y);
        }
        
        gridGraphics.strokePath();
    }

    /**
     * 创建数字雨效果
     */
    private createDigitalRain(width: number, height: number) {
        const digitalChars = ['0', '1', '一', '二', '甲', '乙', '子', '丑', '寅', '卯'];
        
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, width);
            const char = Phaser.Math.RND.pick(digitalChars);
            
            const rainText = this.add.text(x, -20, char, {
                fontSize: '14px',
                color: '#00ff41',
                fontFamily: 'monospace'
            });
            
            // 数字雨动画
            this.tweens.add({
                targets: rainText,
                y: height + 50,
                duration: Phaser.Math.Between(3000, 8000),
                ease: 'Linear',
                repeat: -1,
                delay: Phaser.Math.Between(0, 5000),
                onRepeat: () => {
                    rainText.x = Phaser.Math.Between(0, width);
                    rainText.setText(Phaser.Math.RND.pick(digitalChars));
                }
            });
            
            // 透明度闪烁
            this.tweens.add({
                targets: rainText,
                alpha: 0.2,
                duration: Phaser.Math.Between(500, 1500),
                yoyo: true,
                repeat: -1,
                ease: 'Power2'
            });
        }
    }

    /**
     * 创建扫描线效果
     */
    private createScanLines(width: number, height: number) {
        const scanLine = this.add.graphics();
        scanLine.fillStyle(0x00ffff, 0.1);
        scanLine.fillRect(0, 0, width, 2);
        
        // 扫描线动画
        this.tweens.add({
            targets: scanLine,
            y: height,
            duration: 3000,
            ease: 'Linear',
            repeat: -1,
            yoyo: false,
            onRepeat: () => {
                scanLine.y = -2;
            }
        });
        
        // 水平扫描线
        const horizontalScanLine = this.add.graphics();
        horizontalScanLine.fillStyle(0xff00ff, 0.08);
        horizontalScanLine.fillRect(0, 0, 2, height);
        
        this.tweens.add({
            targets: horizontalScanLine,
            x: width,
            duration: 4000,
            ease: 'Linear',
            repeat: -1,
            onRepeat: () => {
                horizontalScanLine.x = -2;
            }
        });
    }

    /**
     * 创建霓虹装饰边框
     */
    private createNeonBorders(width: number, height: number) {
        const neonGraphics = this.add.graphics();
        
        // 霓虹边框 - 多层发光效果
        const borderColors = [
            { color: 0xff00ff, width: 6, alpha: 0.3 },
            { color: 0x00ffff, width: 4, alpha: 0.5 },
            { color: 0xffffff, width: 2, alpha: 0.8 }
        ];
        
        borderColors.forEach(border => {
            neonGraphics.lineStyle(border.width, border.color, border.alpha);
            neonGraphics.strokeRect(10, 10, width - 20, height - 20);
        });
        
        // 角落霓虹装饰
        this.createNeonCornerDecorations(neonGraphics, width, height);
    }

    /**
     * 创建霓虹角落装饰
     */
    private createNeonCornerDecorations(graphics: Phaser.GameObjects.Graphics, width: number, height: number) {
        const cornerSize = 30;
        
        // 霓虹青色角落装饰
        graphics.lineStyle(3, 0x00ffff, 0.8);
        
        // 左上角
        graphics.moveTo(10, 10 + cornerSize);
        graphics.lineTo(10, 10);
        graphics.lineTo(10 + cornerSize, 10);
        
        // 右上角
        graphics.moveTo(width - 10 - cornerSize, 10);
        graphics.lineTo(width - 10, 10);
        graphics.lineTo(width - 10, 10 + cornerSize);
        
        // 左下角
        graphics.moveTo(10, height - 10 - cornerSize);
        graphics.lineTo(10, height - 10);
        graphics.lineTo(10 + cornerSize, height - 10);
        
        // 右下角
        graphics.moveTo(width - 10 - cornerSize, height - 10);
        graphics.lineTo(width - 10, height - 10);
        graphics.lineTo(width - 10, height - 10 - cornerSize);
        
        graphics.strokePath();
        
        // 添加角落发光点
        const cornerDots = [
            { x: 10, y: 10 },
            { x: width - 10, y: 10 },
            { x: 10, y: height - 10 },
            { x: width - 10, y: height - 10 }
        ];
        
        cornerDots.forEach(dot => {
            const glowDot = this.add.circle(dot.x, dot.y, 4, 0x00ffff, 0.8);
            
            // 发光脉动动画
            this.tweens.add({
                targets: glowDot,
                scaleX: 1.5,
                scaleY: 1.5,
                alpha: 0.3,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Power2'
            });
        });
    }

    /**
     * 创建故障效果
     */
    private createGlitchEffect(width: number, height: number) {
        // 随机故障条纹
        const glitchBars: Phaser.GameObjects.Graphics[] = [];
        
        for (let i = 0; i < 3; i++) {
            const glitchBar = this.add.graphics();
            glitchBar.fillStyle(Phaser.Math.RND.pick([0xff00ff, 0x00ffff, 0xff4444]), 0.6);
            glitchBar.fillRect(0, 0, width, 2);
            glitchBar.y = Phaser.Math.Between(0, height);
            glitchBar.visible = false;
            
            glitchBars.push(glitchBar);
        }
        
        // 故障效果定时器
        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 8000),
            callback: () => {
                const glitchBar = Phaser.Math.RND.pick(glitchBars);
                glitchBar.y = Phaser.Math.Between(0, height);
                glitchBar.visible = true;
                
                // 快速闪烁后消失
                this.time.delayedCall(50, () => {
                    glitchBar.visible = false;
                });
                
                this.time.delayedCall(100, () => {
                    glitchBar.visible = true;
                });
                
                this.time.delayedCall(120, () => {
                    glitchBar.visible = false;
                });
            },
            loop: true
        });
    }



    /**
     * 创建战场布局 - 调整为双方各4个位置，适应全屏布局
     */
    private createBattleField() {
        const { width, height } = this.scale;
        
        // 战场居中，但避开左右面板区域
        const leftPanelWidth = 340; // 留出左侧面板空间
        const rightPanelWidth = 220; // 留出右侧面板空间
        const availableWidth = width - leftPanelWidth - rightPanelWidth;
        const battleFieldX = leftPanelWidth + availableWidth / 2;
        const battleFieldY = height / 2;
        
        // 创建八格战场容器
        this.battleField = this.add.container(battleFieldX, battleFieldY);
        
        // 创建8个格子（双方各4个位置：年月日时柱）
        const { GRID_SIZE, GRID_SPACING, PILLAR_NAMES } = GAME_CONFIG;
        
        // 对手4个位置（上方）
        for (let col = 0; col < 4; col++) {
            const x = (col - 1.5) * GRID_SPACING;
            const y = -GRID_SPACING / 2;
            
            // 创建赛博朋克风格格子背景
            const gridCell = this.add.rectangle(x, y, GRID_SIZE, GRID_SIZE, 0x0f0f23, 0.8);
            gridCell.setStrokeStyle(4, 0xff00ff); // 霓虹粉色边框表示对手
            this.battleField.add(gridCell);
            this.gridCells.push(gridCell); // 存储格子引用
            
            // 添加霓虹发光效果
            const glowCell = this.add.rectangle(x, y, GRID_SIZE + 4, GRID_SIZE + 4, 0xff00ff, 0.2);
            this.battleField.add(glowCell);
            
            // 创建投放区域
            const dropZone = this.add.zone(x, y, GRID_SIZE, GRID_SIZE);
            dropZone.setRectangleDropZone(GRID_SIZE, GRID_SIZE);
            dropZone.setData('position', col);
            dropZone.setData('player', 'opponent');
            this.battleField.add(dropZone);
            this.dropZones.push(dropZone);
            
            // 添加赛博朋克风格柱位标签
            const label = this.add.text(x, y + 70, PILLAR_NAMES[col], {
                fontSize: '14px',
                color: '#ff00ff',
                fontFamily: 'monospace',
                align: 'center'
            });
            label.setOrigin(0.5);
            this.battleField.add(label);
            
            // 添加对手柱位五行信息
            const opponentPillar = this.getOpponentPillarByIndex(col);
            const opponentPillarInfo = getBaZiPillarInfo(opponentPillar.gan, opponentPillar.zhi);
            
            const opponentElementText = this.add.text(x, y + 50, opponentPillarInfo.displayText, {
                fontSize: '10px',
                color: '#ff00ff',
                fontFamily: 'monospace',
                align: 'center'
            });
            opponentElementText.setOrigin(0.5);
            this.battleField.add(opponentElementText);
            
            // 添加对手五行能量指示器
            const opponentIndicators = this.createPillarElementIndicators(x, y - 20, opponentPillarInfo, 'opponent');
            this.battleField.add(opponentIndicators);
            
            // 添加数字化标识
            const digitalId = this.add.text(x - 35, y - 35, `[${col}]`, {
                fontSize: '10px',
                color: '#00ffff',
                fontFamily: 'monospace'
            });
            digitalId.setOrigin(0.5);
            this.battleField.add(digitalId);
        }
        
        // 玩家4个位置（下方）
        for (let col = 0; col < 4; col++) {
            const x = (col - 1.5) * GRID_SPACING;
            const y = GRID_SPACING / 2;
            
            // 创建赛博朋克风格格子背景
            const gridCell = this.add.rectangle(x, y, GRID_SIZE, GRID_SIZE, 0x0f0f23, 0.8);
            gridCell.setStrokeStyle(4, 0x00ffff); // 霓虹青色边框表示玩家
            this.battleField.add(gridCell);
            this.gridCells.push(gridCell); // 存储格子引用
            
            // 添加霓虹发光效果
            const glowCell = this.add.rectangle(x, y, GRID_SIZE + 4, GRID_SIZE + 4, 0x00ffff, 0.2);
            this.battleField.add(glowCell);
            
            // 创建投放区域
            const dropZone = this.add.zone(x, y, GRID_SIZE, GRID_SIZE);
            dropZone.setRectangleDropZone(GRID_SIZE, GRID_SIZE);
            dropZone.setData('position', col + 4); // 玩家位置从4开始
            dropZone.setData('player', 'player');
            this.battleField.add(dropZone);
            this.dropZones.push(dropZone);
            
            // 添加赛博朋克风格柱位标签
            const label = this.add.text(x, y - 70, PILLAR_NAMES[col], {
                fontSize: '14px',
                color: '#00ffff',
                fontFamily: 'monospace',
                align: 'center'
            });
            label.setOrigin(0.5);
            this.battleField.add(label);
            
            // 添加玩家柱位五行信息
            const playerPillar = this.getPlayerPillarByIndex(col);
            const playerPillarInfo = getBaZiPillarInfo(playerPillar.gan, playerPillar.zhi);
            
            const playerElementText = this.add.text(x, y - 50, playerPillarInfo.displayText, {
                fontSize: '10px',
                color: '#00ffff',
                fontFamily: 'monospace',
                align: 'center'
            });
            playerElementText.setOrigin(0.5);
            this.battleField.add(playerElementText);
            
            // 添加玩家五行能量指示器
            const playerIndicators = this.createPillarElementIndicators(x, y + 20, playerPillarInfo, 'player');
            this.battleField.add(playerIndicators);
            
            // 添加数字化标识
            const digitalId = this.add.text(x - 35, y + 35, `[${col + 4}]`, {
                fontSize: '10px',
                color: '#00ffff',
                fontFamily: 'monospace'
            });
            digitalId.setOrigin(0.5);
            this.battleField.add(digitalId);
        }
    }

    /**
     * 创建玩家手牌区域 - 赛博朋克风格，适应全屏布局，优化卡牌展示
     */
    private createPlayerHandArea() {
        const { width, height } = this.scale;
        this.playerHand = this.add.group();
        
        // 手牌区域位置 - 精确优化为能展示99%卡面
        const leftPanelWidth = 340;
        const rightPanelWidth = 220;
        const handAreaWidth = width - leftPanelWidth - rightPanelWidth;
        // 卡牌高度180px，99%显示需要178px，加上边距和标签，总高度198px
        const handAreaHeight = 198;
        const handAreaX = leftPanelWidth;
        const handAreaY = height - handAreaHeight - 18; // 精确间距，确保99%显示
        
        // 创建赛博朋克风格手牌区域 - 极度透明，几乎不遮挡卡牌
        this.createCyberpunkPanel(handAreaX, handAreaY, handAreaWidth, handAreaHeight, 0x00ffff, 0.08);
        
        // 添加手牌区域标签 - 精简版，放在最顶部
        const handLabel = this.add.text(handAreaX + handAreaWidth / 2, handAreaY + 12, '>>> 手牌区域 <<<', {
            fontSize: '14px',
            color: '#00ffff',
            fontFamily: 'monospace'
        });
        handLabel.setOrigin(0.5);
        handLabel.setAlpha(0.7); // 降低透明度，减少视觉干扰
        
        // 添加连接线装饰 - 放在顶部，极简化
        this.createHandAreaDecorations(handAreaX + 20, handAreaY + 25, handAreaWidth - 40, 0x00ffff);
    }

    /**
     * 创建对手手牌区域 - 赛博朋克风格，适应全屏布局
     */
    private createOpponentHandArea() {
        const { width, height } = this.scale;
        this.opponentHand = this.add.group();
        
        // 对手手牌区域位置 - 顶部，React UI状态栏不遮挡
        const leftPanelWidth = 340;
        const rightPanelWidth = 220;
        const handAreaWidth = width - leftPanelWidth - rightPanelWidth;
        const handAreaHeight = 140;
        const handAreaX = leftPanelWidth;
        const handAreaY = 20; // 减少顶部间距，React UI状态栏很小
        
        // 创建赛博朋克风格对手手牌区域
        this.createCyberpunkPanel(handAreaX, handAreaY, handAreaWidth, handAreaHeight, 0xff00ff, 0.3);
        
        // 添加对手手牌区域标签 - 数字化效果
        const opponentLabel = this.add.text(handAreaX + handAreaWidth / 2, handAreaY + 20, '>>> 对手手牌区域 <<<', {
            fontSize: '18px',
            color: '#ff00ff',
            fontFamily: 'monospace'
        });
        opponentLabel.setOrigin(0.5);
        
        // 添加连接线装饰
        this.createHandAreaDecorations(handAreaX + 20, handAreaY + 35, handAreaWidth - 40, 0xff00ff);
    }

    /**
     * 创建手牌区域装饰
     */
    private createHandAreaDecorations(x: number, y: number, width: number, color: number) {
        const decorGraphics = this.add.graphics();
        decorGraphics.lineStyle(1, color, 0.3); // 降低线条透明度
        
        // 绘制连接线网格 - 减少数量
        const lineCount = 3; // 从5减少到3
        const spacing = width / lineCount;
        
        for (let i = 0; i <= lineCount; i++) {
            const lineX = x + i * spacing;
            decorGraphics.moveTo(lineX, y);
            decorGraphics.lineTo(lineX, y + 8); // 缩短线条长度
            
            // 每隔一条线添加节点 - 更小更透明
            if (i % 2 === 0) {
                decorGraphics.fillStyle(color, 0.4); // 降低节点透明度
                decorGraphics.fillCircle(lineX, y + 4, 1.5); // 缩小节点大小
            }
        }
        
        decorGraphics.strokePath();
        decorGraphics.setAlpha(0.6); // 整体装饰透明度
        
        // 添加数据流动画 - 更轻微
        this.createDataFlowAnimation(x, y + 4, width, color);
    }

    /**
     * 创建数据流动画
     */
    private createDataFlowAnimation(x: number, y: number, width: number, color: number) {
        const dataParticle = this.add.circle(x, y, 0.8, color, 0.4); // 更小，更透明
        
        this.tweens.add({
            targets: dataParticle,
            x: x + width,
            duration: 3000, // 更慢的动画，减少干扰
            ease: 'Linear',
            repeat: -1,
            onRepeat: () => {
                dataParticle.x = x;
                dataParticle.setAlpha(0.4);
            },
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                // 创建尾迹效果 - 更轻微
                const progress = tween.progress;
                dataParticle.setAlpha(0.4 * (1 - progress * 0.7)); // 更快淡出
            }
        });
    }

    /**
     * 设置拖拽系统
     */
    private setupDragAndDrop() {
        // 拖拽开始
        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container) => {
            if (gameObject.getData('placed') || gameObject.getData('opponent')) {
                return;
            }
            
            this.draggedCard = gameObject;
            gameObject.setAlpha(0.8);
            gameObject.setScale(1.1);
            
            // 高亮可放置区域
            this.highlightDropZones(true);
        });

        // 拖拽中
        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container, dragX: number, dragY: number) => {
            if (!gameObject.getData('placed') && !gameObject.getData('opponent')) {
                gameObject.setPosition(dragX, dragY);
            }
        });

        // 拖拽结束
        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container) => {
            if (gameObject.getData('placed') || gameObject.getData('opponent')) {
                return;
            }
            
            this.draggedCard = null;
            gameObject.setAlpha(1);
            gameObject.setScale(1);
            
            // 取消高亮
            this.highlightDropZones(false);
        });

        // 放置到区域 - 即时系统版本
        this.input.on('drop', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container, dropZone: Phaser.GameObjects.Zone) => {
            if (gameObject.getData('placed') || gameObject.getData('opponent')) {
                return;
            }
            
            // 检查是否可以使用卡牌（冷却检查）
            if (!this.gameState.canPlayerUseCards) {
                this.showMessage('🚫 冷却中，无法使用卡牌！', 'warning');
                return;
            }
            
            const position = dropZone.getData('position');
            const player = dropZone.getData('player');
            
            // 检查是否为玩家区域 (位置4-7)
            if (player === 'player' && position >= 4 && position <= 7) {
                // 检查位置是否已被占用
                if (this.gameState.battleFieldPositions[position]) {
                    this.showMessage('该位置已被占用！', 'warning');
                    return;
                }
                
                // 🎯 获得优先权 - 先打出卡牌获得使用神煞的权利
                if (this.gameState.priorityHolder === 'none') {
                    this.gameState.priorityHolder = 'player';
                    this.gameState.activePlayer = 'player';
                    this.showMessage('🏆 获得优先权！你可以使用神煞能力！', 'success');
                }
                
                // 计算世界坐标
                const worldPos = this.battleField.getWorldTransformMatrix().transformPoint(
                    dropZone.x, dropZone.y
                );
                
                // 放置卡牌
                gameObject.setPosition(worldPos.x, worldPos.y);
                gameObject.setData('placed', true);
                gameObject.setData('position', position);
                
                // 禁用拖拽
                gameObject.removeInteractive();
                
                // 更新游戏状态
                this.gameState.battleFieldPositions[position] = gameObject.getData('cardData');
                this.placedCards.push(gameObject);
                
                // 从手牌组中移除
                this.playerHand.remove(gameObject);
                
                const cardData = gameObject.getData('cardData');
                this.showMessage(`✨ 已放置 ${cardData.name} 到 ${this.getPillarName(position)}`, 'success');
                
                // 检查凶神自动上场
                if (cardData.type === 'inauspicious') {
                    this.triggerAutoPlace(gameObject);
                }
            }
        });
    }
    
    /**
     * 高亮可放置区域
     */
    private highlightDropZones(highlight: boolean) {
        this.gridCells.forEach((cell, index) => {
            if (index >= 4 && index <= 7) { // 只高亮玩家区域
                if (highlight) {
                    cell.setFillStyle(0x52c41a, 0.3);
                } else {
                    cell.setFillStyle(0x2c3e50, 0.7);
                }
            }
        });
    }
    
    /**
     * 获取柱位名称
     */
    private getPillarName(position: number): string {
        const names = ['年柱', '月柱', '日柱', '时柱'];
        return names[position % 4];
    }
    
    /**
     * 显示消息
     */
    private showMessage(text: string, type: 'success' | 'warning' | 'error' = 'success') {
        const { width, height } = this.scale;
        
        const colors = {
            success: 0x52c41a,
            warning: 0xfa8c16,
            error: 0xff4d4f
        };
        
        // 创建消息框
        const messageBox = this.add.rectangle(width / 2, height / 2 - 100, 400, 60, colors[type], 0.9);
        messageBox.setStrokeStyle(2, 0xffffff);
        
        const messageText = this.add.text(width / 2, height / 2 - 100, text, {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'monospace',
            align: 'center'
        });
        messageText.setOrigin(0.5);
        
        // 自动消失动画
        this.tweens.add({
            targets: [messageBox, messageText],
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                messageBox.destroy();
                messageText.destroy();
            }
        });
    }
    
    /**
     * 触发凶神自动上场
     */
    private triggerAutoPlace(cardContainer: Phaser.GameObjects.Container) {
        const cardData = cardContainer.getData('cardData');
        
        // 创建强制上场特效
        this.createForceEffect(cardContainer);
        
        // 立即造成伤害
        const damage = Math.floor(cardData.power / 2);
        this.showMessage(`凶神${cardData.name}强制上场！造成${damage}点伤害！`, 'warning');
        
        // 标记为已自动触发
        cardContainer.setData('autoTriggered', true);
    }
    
    /**
     * 创建强制上场特效
     */
    private createForceEffect(target: Phaser.GameObjects.Container) {
        // 红色能量轨迹
        const energyTrail = this.add.graphics();
        energyTrail.lineStyle(4, 0xff4d4f, 0.8);
        
        // 创建围绕卡牌的能量圈
        const circle = new Phaser.Geom.Circle(target.x, target.y, 60);
        energyTrail.strokeCircleShape(circle);
        
        // 脉动动画
        this.tweens.add({
            targets: energyTrail,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => energyTrail.destroy()
        });
    }

    /**
     * 创建全屏优化的赛博朋克风格游戏UI
     */
    private createGameUI() {
        const { width, height } = this.scale;
        
        // 移除重复的顶部状态栏，使用React UI替代
        // this.createTopStatusBar(width, height);
        
        // 左侧信息面板 - 垂直布局，显示八字和五行
        this.createLeftInfoPanel(width, height);
        
        // 右侧操作面板 - 垂直布局，显示操作按钮
        this.createRightActionPanel(width, height);
        
        // 底部指南栏 - 简化显示，不遮挡手牌
        this.createBottomGuideBar(width, height);
    }

    // createTopStatusBar方法已被移除，使用React UI替代

    /**
     * 创建左侧信息面板
     */
    private createLeftInfoPanel(width: number, height: number) {
        const panelWidth = 320;
        const panelHeight = height * 0.6; // 占屏幕高度60%
        const panelY = (height - panelHeight) / 2; // 垂直居中
        
        // 左侧信息面板 - 半透明
        this.createCyberpunkPanel(10, panelY, panelWidth, panelHeight, 0x00ffff, 0.25);
        
        const startY = panelY + 30;
        
        // 玩家信息区域
        this.add.text(20, startY, '>>> 玩家信息 <<<', {
            fontSize: '14px',
            color: '#00ffff',
            fontFamily: 'monospace'
        });
        
        // 玩家八字显示 - 分行显示更清晰
        const playerBaZiText = getFullBaZiText(this.gameState.playerBazi);
        this.uiTexts.playerLifeText = this.add.text(20, startY + 25, `⚡八字: ${playerBaZiText}`, {
            fontSize: '11px',
            color: '#00ffff',
            fontFamily: 'monospace',
            wordWrap: { width: panelWidth - 40 }
        });
        
        // 对手信息区域
        this.add.text(20, startY + 80, '>>> 对手信息 <<<', {
            fontSize: '14px',
            color: '#ff00ff',
            fontFamily: 'monospace'
        });
        
        // 对手八字显示
        const opponentBaZiText = getFullBaZiText(this.gameState.opponentBazi);
        this.uiTexts.opponentLifeText = this.add.text(20, startY + 105, `❌八字: ${opponentBaZiText}`, {
            fontSize: '11px',
            color: '#ff00ff',
            fontFamily: 'monospace',
            wordWrap: { width: panelWidth - 40 }
        });
        
        // 五行能量对比
        this.add.text(20, startY + 160, '>>> 五行能量对比 <<<', {
            fontSize: '14px',
            color: '#ffff00',
            fontFamily: 'monospace'
        });
        
        this.createElementEnergyDisplay(30, startY + 190);
        
        // 添加状态指示器
        this.createStatusDecorations(30, startY + 280);
    }

    /**
     * 创建右侧操作面板
     */
    private createRightActionPanel(width: number, height: number) {
        const panelWidth = 200;
        const panelHeight = height * 0.5; // 占屏幕高度50%
        const panelX = width - panelWidth - 10;
        const panelY = (height - panelHeight) / 2; // 垂直居中
        
        // 右侧操作面板 - 半透明
        this.createCyberpunkPanel(panelX, panelY, panelWidth, panelHeight, 0xff00ff, 0.25);
        
        const centerX = panelX + panelWidth / 2;
        const startY = panelY + 40;
        
        // 操作面板标题
        this.add.text(centerX, panelY + 20, '>>> 操作面板 <<<', {
            fontSize: '14px',
            color: '#ff00ff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // 即时系统操作按钮
        this.createCyberpunkButton(centerX, startY + 30, '手动抽牌', 0x0099ff, () => this.drawCard());
        this.createCyberpunkButton(centerX, startY + 80, '使用神煞', 0x9900ff, () => this.useSpecialAbility());
        this.createCyberpunkButton(centerX, startY + 130, '释放优先权', 0x00ff00, () => this.endTurn());
        
        // 即时系统快捷键
        this.add.text(centerX, startY + 180, '即时操作:', {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.add.text(centerX, startY + 200, 'D - 手动抽牌', {
            fontSize: '10px',
            color: '#00ff41',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.add.text(centerX, startY + 215, 'S - 使用神煞', {
            fontSize: '10px',
            color: '#00ff41',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.add.text(centerX, startY + 230, 'E - 释放优先权', {
            fontSize: '10px',
            color: '#00ff41',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
    }

    /**
     * 创建底部指南栏 - 极简化设计，确保99%手牌显示
     */
    private createBottomGuideBar(width: number, height: number) {
        const barHeight = 18;
        const barY = height - barHeight;
        
        // 底部指南栏 - 极度透明，最小高度
        this.createCyberpunkPanel(0, barY, width, barHeight, 0x9900ff, 0.05);
        
        // 操作指南 - 即时系统版本
        const guides = [
            '🏆抢先打出获得优先权',
            '⚡冷却期无法操作', 
            '🔄释放优先权重竞争',
            '⏰每10s一个周期'
        ];
        
        const spacing = (width - 30) / guides.length;
        guides.forEach((guide, index) => {
            const guideText = this.add.text(15 + index * spacing, barY + 9, guide, {
                fontSize: '9px',
                color: '#00ff41',
                fontFamily: 'monospace'
            });
            guideText.setOrigin(0, 0.5);
            guideText.setAlpha(0.8); // 设置透明度
        });
    }

    /**
     * 创建赛博朋克风格面板
     */
    private createCyberpunkPanel(x: number, y: number, width: number, height: number, accentColor: number, alpha: number = 0.85) {
        const panel = this.add.graphics();
        
        // 主体背景 - 深色半透明，使用传入的透明度
        panel.fillStyle(0x0f0f23, alpha);
        panel.fillRoundedRect(x, y, width, height, 8);
        
        // 多层霓虹边框
        panel.lineStyle(3, accentColor, 0.3);
        panel.strokeRoundedRect(x, y, width, height, 8);
        
        panel.lineStyle(2, 0x00ffff, 0.5);
        panel.strokeRoundedRect(x + 1, y + 1, width - 2, height - 2, 8);
        
        panel.lineStyle(1, 0xffffff, 0.8);
        panel.strokeRoundedRect(x + 2, y + 2, width - 4, height - 4, 8);
        
        // 角落装饰
        this.createCornerDecorations(panel, x, y, width, height, accentColor);
    }

    /**
     * 创建角落装饰
     */
    private createCornerDecorations(graphics: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number, color: number) {
        graphics.fillStyle(color, 0.6);
        
        // 左上角
        graphics.fillTriangle(x + 5, y + 5, x + 15, y + 5, x + 5, y + 15);
        
        // 右上角
        graphics.fillTriangle(x + width - 5, y + 5, x + width - 15, y + 5, x + width - 5, y + 15);
        
        // 左下角
        graphics.fillTriangle(x + 5, y + height - 5, x + 15, y + height - 5, x + 5, y + height - 15);
        
        // 右下角
        graphics.fillTriangle(x + width - 5, y + height - 5, x + width - 15, y + height - 5, x + width - 5, y + height - 15);
    }

    /**
     * 创建状态面板装饰
     */
    private createStatusDecorations(x: number, y: number) {
        // 添加闪烁的状态指示器
        const indicators = [
            { color: 0x00ff00, label: 'SYS' },
            { color: 0xffff00, label: 'NET' },
            { color: 0xff0000, label: 'WAR' }
        ];
        
        indicators.forEach((indicator, index) => {
            const dot = this.add.circle(x + index * 40, y, 4, indicator.color);
            const label = this.add.text(x + index * 40 + 10, y - 4, indicator.label, {
                fontSize: '8px',
                color: '#ffffff',
                fontFamily: 'monospace'
            });
            
            // 状态指示器闪烁
            this.tweens.add({
                targets: dot,
                alpha: 0.3,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                delay: index * 300
            });
        });
    }

    /**
     * 创建赛博朋克风格按钮
     */
    private createCyberpunkButton(x: number, y: number, text: string, color: number, onClick: () => void) {
        // 按钮背景
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x0f0f23, 0.8);
        buttonBg.fillRoundedRect(x - 40, y - 15, 80, 30, 6);
        
        // 霓虹边框
        buttonBg.lineStyle(2, color, 0.8);
        buttonBg.strokeRoundedRect(x - 40, y - 15, 80, 30, 6);
        
        // 按钮文字
        const buttonText = this.add.text(x, y, text, {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'monospace'
        });
        buttonText.setOrigin(0.5);
        
        // 创建交互区域
        const button = this.add.rectangle(x, y, 80, 30, 0x000000, 0);
        button.setInteractive({ useHandCursor: true });
        
        // 悬浮发光效果
        button.on('pointerover', () => {
            buttonBg.lineStyle(3, color, 1.0);
            buttonBg.strokeRoundedRect(x - 40, y - 15, 80, 30, 6);
            buttonText.setColor('#' + color.toString(16).padStart(6, '0'));
        });
        
        button.on('pointerout', () => {
            buttonBg.lineStyle(2, color, 0.8);
            buttonBg.strokeRoundedRect(x - 40, y - 15, 80, 30, 6);
            buttonText.setColor('#ffffff');
        });
        
        button.on('pointerdown', onClick);
    }

    /**
     * 创建五行能量显示
     */
    private createElementEnergyDisplay(x: number, y: number) {
        // 统计玩家和对手的五行分布
        const playerElements = this.countBaZiElements(this.gameState.playerBazi);
        const opponentElements = this.countBaZiElements(this.gameState.opponentBazi);
        
        const elements = ['木', '火', '土', '金', '水'];
        const elementColors = ['#00ff41', '#ff0040', '#ffaa00', '#ffffff', '#00ffff'];
        
        elements.forEach((element, index) => {
            const elementX = x + index * 45;
            
            // 五行名称
            const elementLabel = this.add.text(elementX, y, element, {
                fontSize: '10px',
                color: elementColors[index],
                fontFamily: 'monospace'
            });
            elementLabel.setOrigin(0.5);
            
            // 玩家能量条
            const playerCount = playerElements[element] || 0;
            this.createEnergyBar(elementX, y + 12, playerCount, elementColors[index], 'player');
            
            // 对手能量条
            const opponentCount = opponentElements[element] || 0;
            this.createEnergyBar(elementX, y + 18, opponentCount, elementColors[index], 'opponent');
        });
        
        // 添加图例
        this.add.text(x - 20, y + 30, 'P:', {
            fontSize: '8px',
            color: '#00ffff',
            fontFamily: 'monospace'
        });
        
        this.add.text(x - 20, y + 38, 'O:', {
            fontSize: '8px',
            color: '#ff00ff',
            fontFamily: 'monospace'
        });
    }

    /**
     * 统计八字的五行分布
     */
    private countBaZiElements(baZi: any): { [element: string]: number } {
        const elementCount: { [element: string]: number } = {};
        
        // 统计四柱的天干地支五行
        const pillars = [baZi.year, baZi.month, baZi.day, baZi.hour];
        
        pillars.forEach(pillar => {
            const ganInfo = getBaZiPillarInfo(pillar.gan, pillar.zhi);
            
            // 统计天干五行
            elementCount[ganInfo.ganElement] = (elementCount[ganInfo.ganElement] || 0) + 1;
            
            // 统计地支五行
            elementCount[ganInfo.zhiElement] = (elementCount[ganInfo.zhiElement] || 0) + 1;
        });
        
        return elementCount;
    }

    /**
     * 创建能量条
     */
    private createEnergyBar(x: number, y: number, count: number, color: string, type: 'player' | 'opponent') {
        const maxWidth = 30;
        const maxCount = 4; // 最大可能的单一五行数量
        const width = Math.min((count / maxCount) * maxWidth, maxWidth);
        
        if (count > 0) {
            const bar = this.add.graphics();
            bar.fillStyle(parseInt(color.replace('#', '0x'), 16), type === 'player' ? 0.7 : 0.5);
            bar.fillRect(x - 15, y, width, 4);
            
            // 边框
            bar.lineStyle(1, parseInt(color.replace('#', '0x'), 16), 0.8);
            bar.strokeRect(x - 15, y, maxWidth, 4);
            
            // 显示数量
            if (count > 0) {
                const countText = this.add.text(x + 18, y + 2, count.toString(), {
                    fontSize: '6px',
                    color: color,
                    fontFamily: 'monospace'
                });
                countText.setOrigin(0.5);
            }
        }
    }

    /**
     * 根据索引获取玩家柱位信息
     */
    private getPlayerPillarByIndex(index: number): { gan: string; zhi: string } {
        const pillars = [
            this.gameState.playerBazi.year,
            this.gameState.playerBazi.month,
            this.gameState.playerBazi.day,
            this.gameState.playerBazi.hour
        ];
        return pillars[index] || { gan: '甲', zhi: '子' };
    }

    /**
     * 根据索引获取对手柱位信息
     */
    private getOpponentPillarByIndex(index: number): { gan: string; zhi: string } {
        const pillars = [
            this.gameState.opponentBazi.year,
            this.gameState.opponentBazi.month,
            this.gameState.opponentBazi.day,
            this.gameState.opponentBazi.hour
        ];
        return pillars[index] || { gan: '戊', zhi: '辰' };
    }

    /**
     * 创建柱位五行指示器
     */
    private createPillarElementIndicators(x: number, y: number, pillarInfo: any, type: 'player' | 'opponent'): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);
        
        // 天干五行指示器
        const ganColor = parseInt(pillarInfo.ganColor.replace('#', '0x'), 16);
        const ganIndicator = this.add.circle(-8, 0, 4, ganColor, 0.8);
        container.add(ganIndicator);
        
        // 地支五行指示器
        const zhiColor = parseInt(pillarInfo.zhiColor.replace('#', '0x'), 16);
        const zhiIndicator = this.add.circle(8, 0, 4, zhiColor, 0.8);
        container.add(zhiIndicator);
        
        // 连接线
        const connection = this.add.graphics();
        connection.lineStyle(1, type === 'player' ? 0x00ffff : 0xff00ff, 0.5);
        connection.moveTo(-4, 0);
        connection.lineTo(4, 0);
        connection.strokePath();
        container.add(connection);
        
        // 添加脉动动画
        this.tweens.add({
            targets: [ganIndicator, zhiIndicator],
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        return container;
    }

    /**
     * 创建粒子效果
     */
    private createParticleEffects() {
        const { width, height } = this.scale;
        
        // 创建简单的背景魔法粒子效果
        const magicParticles = this.add.particles(width / 2, height / 2, 'particle', {
            scale: { start: 0.2, end: 0 },
            speed: { min: 20, max: 50 },
            lifespan: 3000,
            quantity: 1,
            frequency: 500,
            tint: [0x3498db, 0x9b59b6, 0xf39c12],
            blendMode: 'ADD'
        });
        
        this.particles.push(magicParticles);
        
        // 创建战场能量场效果
        const battleFieldEnergy = this.add.particles(width / 2, height / 2, 'particle', {
            scale: { start: 0.1, end: 0 },
            speed: 30,
            lifespan: 2000,
            quantity: 2,
            frequency: 300,
            tint: 0x52c41a,
            alpha: 0.6
        });
        
        this.particles.push(battleFieldEnergy);
    }

    /**
     * 发初始手牌 - 适应全屏布局
     */
    private dealInitialCards() {
        const { INITIAL_HAND_SIZE } = GAME_CONFIG;
        const { width, height } = this.scale;
        
        // 计算手牌区域位置
        const leftPanelWidth = 340;
        const rightPanelWidth = 220;
        const handAreaWidth = width - leftPanelWidth - rightPanelWidth;
        const handAreaX = leftPanelWidth;
        
        // 玩家手牌位置 - 优化显示99%卡面
        const playerHandY = height - 108; // 精确调整让卡牌99%可见（卡牌高180px，只遮挡1.8px）
        const cardSpacing = Math.min(110, (handAreaWidth - 40) / INITIAL_HAND_SIZE); // 自适应卡牌间距
        const startX = handAreaX + (handAreaWidth - (INITIAL_HAND_SIZE - 1) * cardSpacing) / 2;
        
        // 为玩家发初始手牌
        for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
            const randomCard = this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)];
            const cardCopy = { ...randomCard, id: `${randomCard.id}_${Date.now()}_${i}` };
            
            const cardContainer = this.createCard(cardCopy, 
                startX + i * cardSpacing, 
                playerHandY
            );
            
            this.playerHand.add(cardContainer);
        }
        
        // 对手手牌位置 - 匹配新的对手手牌区域
        const opponentHandY = 90; // 在对手手牌区域中央，与新区域匹配
        
        // 为对手发初始手牌（背面朝上）
        for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
            const randomCard = this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)];
            const cardCopy = { ...randomCard, id: `opponent_${randomCard.id}_${Date.now()}_${i}` };
            this.opponentCards.push(cardCopy);
            
            const cardContainer = this.createOpponentCard(cardCopy, 
                startX + i * cardSpacing, 
                opponentHandY
            );
            
            this.opponentHand.add(cardContainer);
        }
        
        // 更新UI状态
        this.updateGameStateUI();
    }
    
    /**
     * 创建玩家卡牌 - 赛博朋克风格
     */
    private createCard(cardData: LZoreCard, x: number, y: number): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);
        
        // 创建赛博朋克风格卡牌背景
        const cardBg = this.add.rectangle(0, 0, GAME_CONFIG.CARD_WIDTH, GAME_CONFIG.CARD_HEIGHT, 0x0f0f23, 0.9);
        
        // 根据卡牌类型设置霓虹边框
        const borderColor = this.getCyberpunkCardColor(cardData.type);
        cardBg.setStrokeStyle(3, borderColor);
        container.add(cardBg);
        
        // 添加内层发光边框
        const innerGlow = this.add.rectangle(0, 0, GAME_CONFIG.CARD_WIDTH - 4, GAME_CONFIG.CARD_HEIGHT - 4, 0x000000, 0);
        innerGlow.setStrokeStyle(1, 0xffffff, 0.6);
        container.add(innerGlow);
        
        // 卡牌名称 - 霓虹效果
        const nameText = this.add.text(0, -30, cardData.name, {
            fontSize: '12px',
            color: '#' + borderColor.toString(16).padStart(6, '0'),
            fontFamily: 'monospace',
            align: 'center'
        });
        nameText.setOrigin(0.5);
        container.add(nameText);
        
        // 威力值 - 数字化显示
        const powerText = this.add.text(-25, 15, `PWR: ${cardData.power}`, {
            fontSize: '10px',
            color: '#00ff41',
            fontFamily: 'monospace'
        });
        container.add(powerText);
        
        // 五行属性 - 霓虹色彩
        const elementText = this.add.text(0, 30, getElementText(cardData.element), {
            fontSize: '10px',
            color: '#ffff00',
            fontFamily: 'monospace',
            align: 'center'
        });
        elementText.setOrigin(0.5);
        container.add(elementText);
        
        // 稀有度指示器
        const rarityDot = this.add.circle(30, -30, 3, this.getRarityColor(cardData.rarity));
        container.add(rarityDot);
        
        // 添加卡牌发光效果
        this.addCardGlowEffect(container, borderColor);
        
        // 存储卡牌数据
        container.setData('cardData', cardData);
        container.setData('placed', false);
        
        // 设置交互
        container.setSize(GAME_CONFIG.CARD_WIDTH, GAME_CONFIG.CARD_HEIGHT);
        container.setInteractive({ useHandCursor: true });
        this.input.setDraggable(container);
        
        return container;
    }

    /**
     * 获取赛博朋克卡牌颜色
     */
    private getCyberpunkCardColor(type: string): number {
        switch (type) {
            case 'auspicious': return 0x00ffff;   // 霓虹青色
            case 'inauspicious': return 0xff00ff; // 霓虹粉色
            case 'special': return 0x9900ff;      // 霓虹紫色
            default: return 0x0099ff;             // 霓虹蓝色
        }
    }

    /**
     * 获取稀有度颜色
     */
    private getRarityColor(rarity: string): number {
        switch (rarity.toLowerCase()) {
            case 'common': return 0x808080;    // 灰色
            case 'rare': return 0x0099ff;      // 蓝色
            case 'epic': return 0x9900ff;      // 紫色
            case 'legendary': return 0xffaa00; // 橙色
            default: return 0xffffff;          // 白色
        }
    }

    /**
     * 添加卡牌发光效果
     */
    private addCardGlowEffect(container: Phaser.GameObjects.Container, color: number) {
        // 创建发光动画
        this.tweens.add({
            targets: container,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // 添加边框脉动效果
        const glowTween = this.tweens.add({
            targets: container.list[0], // 卡牌背景
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Power2'
        });
    }
    
    /**
     * 创建对手卡牌（背面朝上）- 赛博朋克风格
     */
    private createOpponentCard(cardData: LZoreCard, x: number, y: number): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);
        
        // 创建赛博朋克风格卡牌背面
        const cardBg = this.add.rectangle(0, 0, GAME_CONFIG.CARD_WIDTH, GAME_CONFIG.CARD_HEIGHT, 0x0f0f23, 0.9);
        cardBg.setStrokeStyle(3, 0xff00ff); // 霓虹粉色边框表示对手
        container.add(cardBg);
        
        // 添加内层发光边框
        const innerGlow = this.add.rectangle(0, 0, GAME_CONFIG.CARD_WIDTH - 4, GAME_CONFIG.CARD_HEIGHT - 4, 0x000000, 0);
        innerGlow.setStrokeStyle(1, 0xff00ff, 0.4);
        container.add(innerGlow);
        
        // 背面装饰 - 数字化风格
        const backText = this.add.text(0, 0, '>>> 神煞 <<<\n[CLASSIFIED]', {
            fontSize: '12px',
            color: '#ff00ff',
            fontFamily: 'monospace',
            align: 'center'
        });
        backText.setOrigin(0.5);
        container.add(backText);
        
        // 添加安全标识
        const securityIcon = this.add.text(-30, -25, '🔒', {
            fontSize: '12px',
            color: '#ff0000'
        });
        container.add(securityIcon);
        
        // 添加数据流动画
        this.createOpponentCardEffects(container);
        
        // 存储卡牌数据
        container.setData('cardData', cardData);
        container.setData('opponent', true);
        
        return container;
    }

    /**
     * 创建对手卡牌特效
     */
    private createOpponentCardEffects(container: Phaser.GameObjects.Container) {
        // 神秘脉动效果
        this.tweens.add({
            targets: container,
            alpha: 0.8,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Power2'
        });
        
        // 轻微的旋转效果
        this.tweens.add({
            targets: container,
            rotation: 0.02,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * 启动全局位置监控系统
     */
    private startGlobalPositionMonitor() {
        // 监控所有已放置的卡牌，添加悬浮激活功能
        this.time.addEvent({
            delay: 100,
            callback: this.updateCardHoverEffects,
            callbackScope: this,
            loop: true
        });
    }
    
    /**
     * 更新卡牌悬浮效果
     */
    private updateCardHoverEffects() {
        this.placedCards.forEach(cardContainer => {
            if (!cardContainer.getData('hoverSetup')) {
                this.setupCardHoverEffects(cardContainer);
                cardContainer.setData('hoverSetup', true);
            }
        });
    }
    
    /**
     * 设置卡牌悬浮效果
     */
    private setupCardHoverEffects(cardContainer: Phaser.GameObjects.Container) {
        const hoverZone = this.add.zone(cardContainer.x, cardContainer.y, 
            GAME_CONFIG.CARD_WIDTH, GAME_CONFIG.CARD_HEIGHT);
        hoverZone.setInteractive();
        
        let activateIcon: Phaser.GameObjects.Container | null = null;
        
        hoverZone.on('pointerover', () => {
            // 创建发动图标
            activateIcon = this.add.container(cardContainer.x + 30, cardContainer.y - 30);
            
            const iconBg = this.add.circle(0, 0, 15, 0xfa8c16, 0.9);
            const iconText = this.add.text(0, 0, '⚡', {
                fontSize: '16px',
                color: '#ffffff'
            });
            iconText.setOrigin(0.5);
            
            activateIcon.add([iconBg, iconText]);
            
            // 脉动动画
            this.tweens.add({
                targets: activateIcon,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Power2'
            });
            
            // 卡牌高亮
            cardContainer.setScale(1.05);
            
            // 点击发动
            iconBg.setInteractive();
            iconBg.on('pointerdown', () => {
                this.activateCardAbility(cardContainer);
                if (activateIcon) {
                    activateIcon.destroy();
                    activateIcon = null;
                }
            });
        });
        
        hoverZone.on('pointerout', () => {
            if (activateIcon) {
                activateIcon.destroy();
                activateIcon = null;
            }
            cardContainer.setScale(1);
        });
    }
    
    /**
     * 激活卡牌能力 - 即时系统版本
     */
    private activateCardAbility(cardContainer: Phaser.GameObjects.Container) {
        // 再次检查权限
        if (!this.gameState.canPlayerUseCards || this.gameState.activePlayer !== 'player') {
            this.showMessage('❌ 无权限使用神煞能力！', 'warning');
            return;
        }
        
        const cardData = cardContainer.getData('cardData');
        this.showMessage(`⚡ 激活 ${cardData.name} 的神煞能力！`, 'success');
        
        // 进入冷却期
        this.startPlayerCooldown();
        
        // 打开神煞效果选择界面
        this.openEffectPanel(cardData, cardContainer);
    }
    
    /**
     * 开始玩家冷却期
     */
    private startPlayerCooldown() {
        this.gameState.playerCooldownRemaining = GAME_CONFIG.COOLDOWN_DURATION;
        this.gameState.canPlayerUseCards = false;
        this.gameState.activePlayer = 'none';
        this.gameState.priorityHolder = 'none';
        
        this.showMessage(`🕐 进入${GAME_CONFIG.COOLDOWN_DURATION}秒冷却期，无法使用卡牌！`, 'warning');
    }
    
    /**
     * 打开神煞效果面板
     */
    private openEffectPanel(cardData: LZoreCard, sourceCard: Phaser.GameObjects.Container) {
        if (this.isEffectPanelOpen) return;
        
        this.isEffectPanelOpen = true;
        
        // 发送事件给React UI显示效果面板
        this.events.emit('effectPanelOpen', {
            cardData: cardData,
            sourceCard: sourceCard
        });
        const { width, height } = this.scale;
        
        // 创建面板背景
        const panelBg = this.add.rectangle(width / 2, height / 2, 600, 400, 0x2c3e50, 0.95);
        panelBg.setStrokeStyle(3, 0xf39c12);
        panelBg.setInteractive();
        
        // 面板标题
        const title = this.add.text(width / 2, height / 2 - 160, `${cardData.name} - 神煞效果选择`, {
            fontSize: '20px',
            color: '#f39c12',
            fontFamily: 'monospace'
        });
        title.setOrigin(0.5);
        
        // 创建容器
        this.effectPanel = this.add.container(0, 0);
        this.effectPanel.add([panelBg, title]);
        
        // 关闭按钮
        const closeButton = this.add.rectangle(width / 2 + 270, height / 2 - 170, 40, 40, 0xe74c3c);
        const closeText = this.add.text(width / 2 + 270, height / 2 - 170, '✕', {
            fontSize: '20px',
            color: '#ffffff'
        });
        closeText.setOrigin(0.5);
        
        closeButton.setInteractive();
        closeButton.on('pointerdown', () => {
            this.closeEffectPanel();
        });
        
        this.effectPanel.add([closeButton, closeText]);
        
        // 根据卡牌类型显示不同选项
        this.createEffectOptions(cardData, sourceCard);
        
        // 点击背景关闭
        panelBg.on('pointerdown', () => {
            this.closeEffectPanel();
        });
    }
    
    /**
     * 创建效果选项
     */
    private createEffectOptions(cardData: LZoreCard, sourceCard: Phaser.GameObjects.Container) {
        const { width, height } = this.scale;
        
        if (cardData.type === 'auspicious') {
            // 吉神 - 选择己方柱位进行增益
            this.add.text(width / 2, height / 2 - 100, '选择要增益的柱位:', {
                fontSize: '16px',
                color: '#27ae60',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            this.createTargetButtons(4, 7, '增益', 0x27ae60, (position) => {
                this.applyEffect(cardData, 'buff', position);
                this.closeEffectPanel();
            });
            
        } else if (cardData.type === 'inauspicious') {
            // 凶神 - 选择对手柱位进行伤害
            this.add.text(width / 2, height / 2 - 100, '选择要攻击的对手柱位:', {
                fontSize: '16px',
                color: '#e74c3c',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            this.createTargetButtons(0, 3, '攻击', 0xe74c3c, (position) => {
                this.applyEffect(cardData, 'damage', position);
                this.closeEffectPanel();
            });
            
        } else {
            // 特殊神煞 - 多种效果选择
            this.add.text(width / 2, height / 2 - 100, '选择特殊效果:', {
                fontSize: '16px',
                color: '#9b59b6',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            this.createSpecialEffectButtons(cardData);
        }
    }
    
    /**
     * 创建目标按钮
     */
    private createTargetButtons(startPos: number, endPos: number, actionText: string, color: number, callback: (position: number) => void) {
        const { width, height } = this.scale;
        const buttonWidth = 100;
        const spacing = 120;
        const startX = width / 2 - (endPos - startPos) * spacing / 2;
        
        for (let i = startPos; i <= endPos; i++) {
            const x = startX + (i - startPos) * spacing;
            const y = height / 2 - 20;
            
            const button = this.add.rectangle(x, y, buttonWidth, 40, color);
            button.setInteractive();
            
            const buttonText = this.add.text(x, y, `${actionText}\n${this.getPillarName(i)}`, {
                fontSize: '12px',
                color: '#ffffff',
                fontFamily: 'monospace',
                align: 'center'
            });
            buttonText.setOrigin(0.5);
            
            if (this.effectPanel) {
                this.effectPanel.add([button, buttonText]);
            }
            
            button.on('pointerdown', () => {
                callback(i);
            });
        }
    }
    
    /**
     * 创建特殊效果按钮
     */
    private createSpecialEffectButtons(cardData: LZoreCard) {
        // 实现特殊效果选项
        const { width, height } = this.scale;
        
        const effects = [
            { name: '全体增益', color: 0x27ae60, action: () => this.applySpecialEffect('全体增益') },
            { name: '全体伤害', color: 0xe74c3c, action: () => this.applySpecialEffect('全体伤害') },
            { name: '中和效果', color: 0x3498db, action: () => this.applySpecialEffect('中和效果') }
        ];
        
        effects.forEach((effect, index) => {
            const x = width / 2 + (index - 1) * 150;
            const y = height / 2 - 20;
            
            const button = this.add.rectangle(x, y, 120, 40, effect.color);
            button.setInteractive();
            
            const buttonText = this.add.text(x, y, effect.name, {
                fontSize: '12px',
                color: '#ffffff',
                fontFamily: 'monospace'
            });
            buttonText.setOrigin(0.5);
            
            if (this.effectPanel) {
                this.effectPanel.add([button, buttonText]);
            }
            
            button.on('pointerdown', () => {
                effect.action();
                this.closeEffectPanel();
            });
        });
    }
    
    /**
     * 应用效果
     */
    private applyEffect(cardData: LZoreCard, type: 'damage' | 'buff', targetPosition: number) {
        if (type === 'damage') {
            this.showMessage(`对${this.getPillarName(targetPosition)}造成${cardData.power}点伤害！`, 'error');
            // 实际的伤害逻辑
        } else if (type === 'buff') {
            this.showMessage(`为${this.getPillarName(targetPosition)}提供${cardData.power}点增益！`, 'success');
            // 实际的增益逻辑
        }
    }
    
    /**
     * 应用特殊效果
     */
    private applySpecialEffect(effectName: string) {
        this.showMessage(`施展特殊效果：${effectName}！`, 'warning');
        // 实际的特殊效果逻辑
    }
    
    /**
     * 关闭效果面板
     */
    private closeEffectPanel() {
        if (this.effectPanel) {
            this.effectPanel.destroy();
            this.effectPanel = null;
        }
        this.isEffectPanelOpen = false;
        
        // 发送关闭事件给React UI
        this.events.emit('effectPanelClose');
    }

    /**
     * 释放优先权 - 即时系统中替代结束回合
     */
    public endTurn() {
        if (!this.gameState.canPlayerUseCards) {
            this.showMessage('冷却中，无法操作！', 'warning');
            return;
        }
        
        // 释放优先权
        this.gameState.activePlayer = 'none';
        this.gameState.priorityHolder = 'none';
        
        // 更新React UI状态
        this.updateGameStateUI();
        
        this.showMessage('🔄 已释放优先权，双方可以重新竞争！', 'success');
    }
    
    /**
     * 执行对手回合
     */
    private executeOpponentTurn() {
        const actions: OpponentAction[] = [
            { type: 'draw', priority: 1 },
            { type: 'place', cardIndex: 0, position: 0, priority: 2 },
            { type: 'activate', cardIndex: 0, priority: 3 }
        ];
        
        // 按优先级执行行动
        actions.sort((a, b) => a.priority - b.priority);
        
        let actionIndex = 0;
        const executeNextAction = () => {
            if (actionIndex < actions.length) {
                const action = actions[actionIndex];
                this.executeOpponentAction(action);
                actionIndex++;
                this.time.delayedCall(1500, executeNextAction);
            } else {
                // 对手动作完成，释放优先权
                this.gameState.activePlayer = 'none';
                this.gameState.priorityHolder = 'none';
                
                // 更新React UI状态
                this.updateGameStateUI();
                
                this.showMessage('对手完成动作，优先权重置', 'success');
            }
        };
        
        executeNextAction();
    }
    
    /**
     * 执行对手行动
     */
    private executeOpponentAction(action: OpponentAction) {
        switch (action.type) {
            case 'draw':
                this.showMessage('对手抽取了一张卡牌', 'warning');
                break;
                
            case 'place':
                if (action.position !== undefined && action.cardIndex !== undefined) {
                    this.showMessage(`对手在${this.getPillarName(action.position)}放置了卡牌`, 'warning');
                }
                break;
                
            case 'activate':
                this.showMessage('对手激活了神煞能力', 'error');
                break;
        }
    }

    /**
     * 使用特殊能力 - 即时系统版本
     */
    public useSpecialAbility() {
        // 检查是否可以使用神煞（冷却和优先权检查）
        if (!this.gameState.canPlayerUseCards) {
            this.showMessage('🚫 冷却中，无法使用神煞能力！', 'warning');
            return;
        }
        
        if (this.gameState.activePlayer !== 'player') {
            this.showMessage('❌ 没有优先权，无法使用神煞！先打出卡牌获得优先权！', 'warning');
            return;
        }
        
        if (this.placedCards.length === 0) {
            this.showMessage('场上没有可激活的神煞卡牌！', 'warning');
            return;
        }
        
        this.showMessage('⚡ 请悬浮卡牌并点击激活图标来发动神煞能力', 'success');
    }

    /**
     * 抽取卡牌 - 适应全屏布局
     */
    public drawCard(): Phaser.GameObjects.Container | null {
        if (this.playerHand.children.entries.length >= 7) {
            this.showMessage('手牌已满，无法抽取更多卡牌！', 'warning');
            return null;
        }
        
        const { width, height } = this.scale;
        const randomCard = this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)];
        const cardCopy = { ...randomCard, id: `${randomCard.id}_${Date.now()}_draw` };
        
        // 计算新卡牌的位置 - 适应全屏布局，优化卡牌显示
        const leftPanelWidth = 340;
        const rightPanelWidth = 220;
        const handAreaWidth = width - leftPanelWidth - rightPanelWidth;
        const handAreaX = leftPanelWidth;
        const playerHandY = height - 108; // 与dealInitialCards保持一致，99%卡面显示
        
        const currentCardCount = this.playerHand.children.entries.length;
        const cardSpacing = Math.min(110, (handAreaWidth - 40) / (currentCardCount + 1));
        const newX = handAreaX + (currentCardCount * cardSpacing) + (handAreaWidth - currentCardCount * cardSpacing) / 2;
        
        const cardContainer = this.createCard(cardCopy, newX, playerHandY);
        
        this.playerHand.add(cardContainer);
        this.showMessage(`抽取了 ${cardCopy.name}！`, 'success');
        
        // 更新React UI状态
        this.updateGameStateUI();
        
        return cardContainer;
    }
    
    /**
     * 对手抽取卡牌 - 即时系统
     */
    private drawOpponentCard(): Phaser.GameObjects.Container | null {
        if (this.opponentHand.children.entries.length >= 7) {
            return null;
        }
        
        const { width, height } = this.scale;
        const randomCard = this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)];
        const cardCopy = { ...randomCard, id: `opponent_${randomCard.id}_${Date.now()}_draw` };
        this.opponentCards.push(cardCopy);
        
        // 计算对手新卡牌位置
        const leftPanelWidth = 340;
        const rightPanelWidth = 220;
        const handAreaWidth = width - leftPanelWidth - rightPanelWidth;
        const handAreaX = leftPanelWidth;
        const opponentHandY = 90;
        
        const currentCardCount = this.opponentHand.children.entries.length;
        const cardSpacing = Math.min(110, (handAreaWidth - 40) / (currentCardCount + 1));
        const newX = handAreaX + (currentCardCount * cardSpacing) + (handAreaWidth - currentCardCount * cardSpacing) / 2;
        
        const cardContainer = this.createOpponentCard(cardCopy, newX, opponentHandY);
        this.opponentHand.add(cardContainer);
        
        return cardContainer;
    }

    /**
     * 设置键盘快捷键控制
     */
    private setupKeyboardControls() {
        // 创建键盘输入
        const keyD = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const keyS = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const keyE = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        const keyESC = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        // D键 - 抽取卡牌
        keyD?.on('down', () => {
            if (!this.isOpponentTurn && !this.isEffectPanelOpen) {
                this.drawCard();
                this.showMessage('快捷键: D - 抽取卡牌', 'success');
            }
        });
        
        // S键 - 使用神煞
        keyS?.on('down', () => {
            if (!this.isOpponentTurn && !this.isEffectPanelOpen) {
                this.useSpecialAbility();
                this.showMessage('快捷键: S - 使用神煞', 'success');
            }
        });
        
        // E键 - 结束回合
        keyE?.on('down', () => {
            if (!this.isOpponentTurn && !this.isEffectPanelOpen) {
                this.endTurn();
                this.showMessage('快捷键: E - 结束回合', 'success');
            }
        });
        
        // ESC键 - 关闭面板
        keyESC?.on('down', () => {
            if (this.isEffectPanelOpen) {
                this.closeEffectPanel();
                this.showMessage('已关闭效果面板', 'warning');
            }
        });
        
        // 显示即时系统帮助
        this.time.delayedCall(3000, () => {
            this.showMessage('💡 即时系统: D手动抽牌 | S使用神煞 | E释放优先权 | 拖拽卡牌抢优先权', 'success');
        });
    }
} 