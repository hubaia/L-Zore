import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { Interface } from 'phaser-react-ui';
import { GameUI } from './GameUI';

/**
 * 21点游戏场景类
 * 
 * 这个类负责处理所有游戏逻辑，包括：
 * - 牌组管理和洗牌
 * - 发牌动画和游戏流程
 * - 分数计算和游戏结果判定
 * - 与React UI层的事件通信
 */
class ViteBlackjackScene extends Phaser.Scene {
    // 游戏数据定义
    /** 主牌组，包含52张标准扑克牌 */
    private deck: Array<{ suit: string; value: string; textureKey: string }> = [];
    
    /** 玩家手牌数组 */
    private playerHand: Array<{ suit: string; value: string; textureKey: string }> = [];
    
    /** 庄家手牌数组 */
    private dealerHand: Array<{ suit: string; value: string; textureKey: string }> = [];
    
    // 游戏状态标志
    /** 游戏是否结束 */
    private gameOver: boolean = false;
    
    /** 游戏是否已开始（已发牌） */
    private gameStarted: boolean = false;
    
    // 统计数据
    /** 玩家胜利次数 */
    private wins: number = 0;
    
    /** 玩家失败次数 */
    private losses: number = 0;
    
    /** phaser-react-ui接口实例 */
    private ui!: Interface;
    
    /**
     * 构造函数 - 初始化场景
     */
    constructor() {
        super({ key: 'ViteBlackjackScene' });
    }
    
    /**
     * Phaser生命周期 - 预加载阶段
     * 在这里创建所有游戏资源
     */
    preload() {
        this.createCardAssets();
    }
    
    /**
     * 创建卡牌纹理资源
     * 
     * 功能：
     * 1. 生成卡背纹理
     * 2. 为每张卡牌生成独特的纹理
     * 3. 使用Phaser Graphics API动态绘制
     */
    createCardAssets() {
        // 创建卡背纹理 - 蓝色背景，白色边框
        this.add.graphics()
            .fillStyle(0x1a47a0)                    // 深蓝色填充
            .fillRoundedRect(0, 0, 100, 140, 12)    // 圆角矩形
            .lineStyle(4, 0xffffff)                 // 白色边框
            .strokeRoundedRect(0, 0, 100, 140, 12)  // 圆角边框
            .generateTexture('cardBack', 100, 140); // 生成纹理
            
        // 创建所有卡牌的纹理
        const suits = ['♠', '♥', '♦', '♣'];        // 四种花色：黑桃、红心、方块、梅花
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']; // 13种点数
        
        // 为每种花色和点数组合创建纹理
        suits.forEach(suit => {
            values.forEach(value => {
                const graphics = this.add.graphics();
                graphics.fillStyle(0xffffff)                    // 白色卡牌背景
                    .fillRoundedRect(0, 0, 100, 140, 12)        // 圆角矩形
                    .lineStyle(4, 0x333333)                     // 深灰色边框
                    .strokeRoundedRect(0, 0, 100, 140, 12);     // 圆角边框
                
                // 生成纹理并销毁临时图形对象
                graphics.generateTexture(`card_${suit}_${value}`, 100, 140);
                graphics.destroy(); // 释放内存
            });
        });
    }
    
    /**
     * Phaser生命周期 - 场景创建阶段
     * 初始化游戏场景的所有元素
     */
    create() {
        // 设置游戏背景 - 绿色渐变效果，模拟赌桌
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x1a5a1a, 0x1a5a1a, 0x0f3f0f, 0x0f3f0f); // 绿色渐变
        graphics.fillRect(0, 0, 800, 600); // 填充整个画布
        
        // 添加装饰圆圈 - 营造赌场氛围
        for (let i = 0; i < 20; i++) {
            const circle = this.add.circle(
                Phaser.Math.Between(0, 800),      // 随机X坐标
                Phaser.Math.Between(0, 600),      // 随机Y坐标
                Phaser.Math.Between(3, 8),        // 随机半径
                0xffffff,                         // 白色
                0.1                               // 低透明度
            );
        }
        
        // 创建游戏标题
        this.add.text(400, 50, '🎮 Vite + Phaser 21点游戏', {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5); // 居中对齐
        
        // 创建React UI接口 - 连接Phaser和React
        this.ui = new Interface(this);
        this.ui.render(GameUI, {
            scene: this,                          // 传递场景引用
            onDeal: () => this.dealCards(),       // 发牌回调
            onHit: () => this.hit(),              // 要牌回调
            onStand: () => this.stand(),          // 停牌回调
            onNewGame: () => this.newGame()       // 新游戏回调
        });
        
        // 初始化游戏数据
        this.initializeDeck();  // 创建并洗牌
        this.updateGameState(); // 更新UI状态
        
        // 调试信息
        console.log('🚀 Vite 21点游戏启动成功！');
        console.log('📦 牌组初始化完成，共', this.deck.length, '张牌');
    }
    
    /**
     * 初始化牌组
     * 创建一副标准的52张扑克牌并进行洗牌
     */
    initializeDeck() {
        this.deck = []; // 清空牌组
        
        // 定义扑克牌的花色和点数
        const suits = ['♠', '♥', '♦', '♣'];        // 黑桃、红心、方块、梅花
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        // 生成52张牌（4种花色 × 13种点数）
        suits.forEach(suit => {
            values.forEach(value => {
                const card = { 
                    suit,                               // 花色符号
                    value,                              // 点数
                    textureKey: `card_${suit}_${value}` // 对应的纹理键名
                };
                this.deck.push(card);
                console.log('🃏 添加卡牌:', card); // 调试用：显示每张牌的创建
            });
        });
        
        // 洗牌
        this.shuffleDeck();
    }
    
    /**
     * 洗牌算法 - Fisher-Yates洗牌
     * 将牌组随机排列，确保每局游戏的随机性
     */
    shuffleDeck() {
        // 从最后一张牌开始，与前面的随机位置交换
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));  // 生成0到i之间的随机数
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]; // 交换位置
        }
    }
    
    /**
     * 发牌函数 - 开始新一轮游戏
     * 
     * 流程：
     * 1. 检查游戏状态和牌组数量
     * 2. 重置游戏状态
     * 3. 按顺序发4张牌（玩家2张，庄家2张）
     * 4. 使用延时创建发牌动画效果
     * 5. 检查是否有黑杰克（21点）
     */
    dealCards() {
        // 防止重复发牌
        if (this.gameStarted) return;
        
        // 确保牌组有足够的牌（至少需要4张）
        if (this.deck.length < 4) {
            console.log('🔄 牌组不足，重新初始化');
            this.initializeDeck();
        }
        
        // 设置游戏状态
        this.gameStarted = true;  // 标记游戏开始
        this.gameOver = false;    // 确保游戏未结束
        this.playerHand = [];     // 清空玩家手牌
        this.dealerHand = [];     // 清空庄家手牌
        
        // 发牌动画序列 - 模拟真实发牌的节奏
        // 第1张牌：给玩家（300ms后）
        this.time.delayedCall(300, () => {
            const card = this.deck.pop();
            if (card) {
                this.playerHand.push(card);
                this.updateDisplay();
                console.log('🎴 玩家第1张牌:', card);
            }
        });
        
        // 第2张牌：给庄家（600ms后）
        this.time.delayedCall(600, () => {
            const card = this.deck.pop();
            if (card) {
                this.dealerHand.push(card);
                this.updateDisplay();
                console.log('🎴 庄家第1张牌:', card);
            }
        });
        
        // 第3张牌：给玩家（900ms后）
        this.time.delayedCall(900, () => {
            const card = this.deck.pop();
            if (card) {
                this.playerHand.push(card);
                this.updateDisplay();
                console.log('🎴 玩家第2张牌:', card);
            }
        });
        
        // 第4张牌：给庄家（1200ms后）
        this.time.delayedCall(1200, () => {
            const card = this.deck.pop();
            if (card) {
                this.dealerHand.push(card);
                this.updateDisplay();
                console.log('🎴 庄家第2张牌:', card);
                
                // 检查玩家是否有黑杰克（21点）
                if (this.calculateScore(this.playerHand) === 21) {
                    console.log('🎉 玩家黑杰克！自动停牌');
                    this.time.delayedCall(1000, () => this.stand());
                }
            }
        });
        
        // 更新UI状态
        this.updateGameState();
    }
    
    hit() {
        if (this.gameOver || !this.gameStarted) return;
        
        // 确保还有牌可以发
        if (this.deck.length === 0) {
            this.initializeDeck();
        }
        
        const card = this.deck.pop();
        if (card) {
            this.playerHand.push(card);
            this.updateDisplay();
            
            const score = this.calculateScore(this.playerHand);
            if (score > 21) {
                this.endGame('玩家爆牌！庄家获胜！', false);
            } else if (score === 21) {
                this.time.delayedCall(500, () => this.stand());
            }
        }
        
        this.updateGameState();
    }
    
    stand() {
        if (this.gameOver || !this.gameStarted) return;
        
        const dealerDraw = () => {
            if (this.calculateScore(this.dealerHand) < 17) {
                // 确保还有牌可以发
                if (this.deck.length === 0) {
                    this.initializeDeck();
                }
                
                const card = this.deck.pop();
                if (card) {
                    this.dealerHand.push(card);
                    this.updateDisplay();
                    this.time.delayedCall(1000, dealerDraw);
                } else {
                    this.resolveGame();
                }
            } else {
                this.resolveGame();
            }
        };
        
        dealerDraw();
    }
    
    resolveGame() {
        const playerScore = this.calculateScore(this.playerHand);
        const dealerScore = this.calculateScore(this.dealerHand);
        
        let result: string;
        let playerWins = false;
        
        if (dealerScore > 21) {
            result = '庄家爆牌！玩家获胜！';
            playerWins = true;
        } else if (playerScore > dealerScore) {
            result = '玩家获胜！';
            playerWins = true;
        } else if (dealerScore > playerScore) {
            result = '庄家获胜！';
        } else {
            result = '平局！';
        }
        
        this.endGame(result, playerWins);
    }
    
    endGame(result: string, playerWins: boolean | null) {
        this.gameOver = true;
        this.gameStarted = false;
        
        if (playerWins === true) {
            this.wins++;
        } else if (playerWins === false) {
            this.losses++;
        }
        
        this.updateDisplay();
        this.updateGameState();
        
        this.events.emit('gameEnd', {
            result,
            playerWins,
            wins: this.wins,
            losses: this.losses
        });
    }
    
    newGame() {
        this.wins = 0;
        this.losses = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.playerHand = [];
        this.dealerHand = [];
        
        this.initializeDeck();
        this.clearCardDisplay();
        this.updateGameState();
        
        this.events.emit('newGame');
    }
    
    /**
     * 计算手牌分数 - 21点游戏的核心算法
     * 
     * 计分规则：
     * - A：可以是1点或11点（自动选择最优值）
     * - J、Q、K：都是10点
     * - 其他牌：按面值计分
     * 
     * A牌处理逻辑：
     * 1. 初始将所有A当作11点计算
     * 2. 如果总分超过21点，依次将A从11点变为1点
     * 3. 直到总分不超过21点或所有A都变为1点
     * 
     * @param hand 要计算的手牌数组
     * @returns 手牌的最优总分
     */
    calculateScore(hand: Array<{ value: string }>) {
        let score = 0;    // 总分
        let aces = 0;     // A牌数量
        
        // 第一轮：按最大值计算所有牌
        hand.forEach(card => {
            if (card.value === 'A') {
                aces++;           // 记录A牌数量
                score += 11;      // A初始按11点计算
            } else if (['J', 'Q', 'K'].includes(card.value)) {
                score += 10;      // 人头牌都是10点
            } else {
                score += parseInt(card.value); // 数字牌按面值
            }
        });
        
        // 第二轮：优化A牌的值
        // 如果总分超过21点且有A牌，将A从11点变为1点
        while (score > 21 && aces > 0) {
            score -= 10;  // 将一个A从11点变为1点（减去10）
            aces--;       // 减少可变A的数量
        }
        
        return score;
    }
    
    updateDisplay() {
        this.clearCardDisplay();
        
        // 显示玩家手牌
        this.playerHand.forEach((card, index) => {
            const x = 200 + index * 110;
            const y = 450;
            
            const cardSprite = this.add.image(x, y, card.textureKey)
                .setScale(0.8)
                .setAlpha(0);
            
            const fontSize = card.value === '10' ? '12px' : '16px';
            const textColor = (card.suit === '♥' || card.suit === '♦') ? '#ff0000' : '#000000';
            const cardText = this.add.text(x, y, `${card.value}\n${card.suit}`, {
                fontSize: fontSize,
                color: textColor,
                fontFamily: 'Arial',
                align: 'center'
            }).setOrigin(0.5).setScale(0.8).setAlpha(0);
            
            this.tweens.add({
                targets: [cardSprite, cardText],
                alpha: 1,
                duration: 400,
                delay: index * 150,
                ease: 'Back.easeOut'
            });
            
            cardSprite.setName('playerCard');
            cardText.setName('playerCard');
        });
        
        // 显示庄家手牌
        this.dealerHand.forEach((card, index) => {
            const x = 200 + index * 110;
            const y = 200;
            let cardSprite: Phaser.GameObjects.Image;
            let cardText: Phaser.GameObjects.Text | null = null;
            
            if (index === 0 && !this.gameOver) {
                cardSprite = this.add.image(x, y, 'cardBack')
                    .setScale(0.8)
                    .setAlpha(0);
            } else {
                cardSprite = this.add.image(x, y, card.textureKey)
                    .setScale(0.8)
                    .setAlpha(0);
                
                const fontSize = card.value === '10' ? '12px' : '16px';
                const textColor = (card.suit === '♥' || card.suit === '♦') ? '#ff0000' : '#000000';
                cardText = this.add.text(x, y, `${card.value}\n${card.suit}`, {
                    fontSize: fontSize,
                    color: textColor,
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScale(0.8).setAlpha(0);
                cardText.setName('dealerCard');
            }
            
            const animTargets = cardText ? [cardSprite, cardText] : [cardSprite];
            this.tweens.add({
                targets: animTargets,
                alpha: 1,
                duration: 400,
                delay: index * 150,
                ease: 'Back.easeOut'
            });
            
            cardSprite.setName('dealerCard');
        });
    }
    
    clearCardDisplay() {
        this.children.list.filter(child => 
            (child as any).name === 'playerCard' || (child as any).name === 'dealerCard'
        ).forEach(card => {
            card.destroy();
        });
    }
    
    updateGameState() {
        const playerScore = this.calculateScore(this.playerHand);
        const dealerScore = this.gameOver ? this.calculateScore(this.dealerHand) : 0;
        
        this.events.emit('stateUpdate', {
            playerScore,
            dealerScore: this.gameOver ? dealerScore : '?',
            gameStarted: this.gameStarted,
            gameOver: this.gameOver,
            wins: this.wins,
            losses: this.losses
        });
    }
    
    getGameState() {
        return {
            playerScore: this.calculateScore(this.playerHand),
            dealerScore: this.gameOver ? this.calculateScore(this.dealerHand) : '?',
            gameStarted: this.gameStarted,
            gameOver: this.gameOver,
            wins: this.wins,
            losses: this.losses
        };
    }
}

/**
 * ViteCardGame React组件
 * 
 * 这是主要的React组件，负责：
 * 1. 创建和管理Phaser游戏实例
 * 2. 提供游戏容器和加载界面
 * 3. 展示项目的技术特色和功能说明
 * 
 * 技术架构：
 * - React负责UI层和生命周期管理
 * - Phaser负责游戏逻辑和渲染
 * - phaser-react-ui负责两者之间的桥接
 */
export const ViteCardGame: React.FC = () => {
    // React Refs - 用于直接访问DOM元素和Phaser实例
    /** 游戏容器的DOM引用 */
    const gameRef = useRef<HTMLDivElement>(null);
    
    /** Phaser游戏实例引用 */
    const phaserGameRef = useRef<Phaser.Game | null>(null);
    
    // React状态
    /** 游戏是否已准备就绪 */
    const [gameReady, setGameReady] = useState(false);
    
    // 游戏初始化副作用
    useEffect(() => {
        // Phaser游戏配置对象
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,              // 自动选择WebGL或Canvas渲染器
            width: 800,                     // 游戏画布宽度
            height: 600,                    // 游戏画布高度
            parent: gameRef.current!,       // 挂载到指定DOM元素
            backgroundColor: '#1a5a1a',     // 背景色（深绿色，模拟赌桌）
            scene: ViteBlackjackScene,      // 使用的游戏场景类
            physics: {
                default: 'arcade',          // 使用Arcade物理引擎
                arcade: {
                    gravity: { x: 0, y: 0 }, // 无重力（卡牌游戏不需要重力）
                    debug: false            // 关闭物理调试显示
                }
            },
            scale: {
                mode: Phaser.Scale.FIT,                    // 适配模式：保持比例缩放
                autoCenter: Phaser.Scale.CENTER_BOTH       // 自动居中
            }
        };
        
        // 创建Phaser游戏实例
        phaserGameRef.current = new Phaser.Game(config);
        
        // 监听游戏准备就绪事件
        phaserGameRef.current.events.once('ready', () => {
            setGameReady(true);
            console.log('🎮 Vite + Phaser游戏准备就绪！');
        });
        
        // 清理函数 - 组件卸载时销毁Phaser实例
        return () => {
            if (phaserGameRef.current) {
                phaserGameRef.current.destroy(true);  // 完全销毁游戏实例
                phaserGameRef.current = null;         // 清空引用
            }
        };
    }, []); // 空依赖数组，仅在组件挂载时执行一次
    
    return (
        <div className="flex flex-col items-center p-8 bg-gradient-to-br from-green-100 to-blue-100 min-h-screen">
            <div className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-green-800 mb-2">
                    ⚡ Vite + Phaser + React UI
                </h1>
                <p className="text-green-600 text-lg">
                    高性能21点卡牌游戏
                </p>
            </div>
            
            <div 
                ref={gameRef} 
                className="border-4 border-green-600 rounded-2xl shadow-2xl overflow-hidden bg-white"
            />
            
            {!gameReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-2xl font-bold animate-pulse">
                        🎮 游戏加载中...
                    </div>
                </div>
            )}
            
            <div className="mt-8 max-w-4xl bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">
                    🚀 技术特色
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-green-700">⚡ Vite优势</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 极速热重载 (HMR)</li>
                            <li>• TypeScript原生支持</li>
                            <li>• 现代ES模块</li>
                            <li>• 优化的构建过程</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-green-700">🎮 游戏特性</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• React + Phaser集成</li>
                            <li>• 响应式缩放</li>
                            <li>• 流畅动画效果</li>
                            <li>• 事件驱动架构</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}; 