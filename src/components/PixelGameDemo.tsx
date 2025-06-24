import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

/**
 * 像素风游戏场景
 * 演示 Phaser 的像素艺术能力
 */
class PixelArtScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private enemies!: Phaser.GameObjects.Group;

    constructor() {
        super({ key: 'PixelArtScene' });
    }

    preload() {
        // 创建像素风精灵图
        this.createPixelAssets();
    }

    create() {
        // 创建像素风背景
        this.createPixelBackground();
        
        // 创建玩家角色
        this.player = this.add.sprite(100, 150, 'player')
            .setScale(3) // 放大保持像素清晰
            .setTint(0x00ff00);
        
        // 创建敌人群组
        this.enemies = this.add.group();
        this.createEnemies();
        
        // 设置键盘控制
        this.cursors = this.input.keyboard!.createCursorKeys();
        
        // 添加像素风UI文本
        this.add.text(16, 16, '像素风游戏演示', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'monospace', // 等宽字体增强像素感
        });
        
        // 添加控制说明
        this.add.text(16, 40, '方向键移动', {
            fontSize: '12px',
            color: '#cccccc',
            fontFamily: 'monospace',
        });
    }

    update() {
        // 玩家移动控制
        const speed = 2; // 使用整数速度保持像素完美
        
        if (this.cursors.left.isDown) {
            this.player.x -= speed;
        } else if (this.cursors.right.isDown) {
            this.player.x += speed;
        }
        
        if (this.cursors.up.isDown) {
            this.player.y -= speed;
        } else if (this.cursors.down.isDown) {
            this.player.y += speed;
        }
        
        // 确保玩家不离开屏幕
        this.player.x = Phaser.Math.Clamp(this.player.x, 16, 304);
        this.player.y = Phaser.Math.Clamp(this.player.y, 16, 224);
        
        // 敌人简单AI移动
        this.enemies.children.entries.forEach((enemy: any) => {
            enemy.x += Math.cos(enemy.rotation) * 1;
            enemy.y += Math.sin(enemy.rotation) * 1;
            
            // 边界反弹
            if (enemy.x <= 16 || enemy.x >= 304) enemy.rotation += Math.PI;
            if (enemy.y <= 16 || enemy.y >= 224) enemy.rotation += Math.PI;
        });
    }

    /**
     * 创建像素风资源
     */
    createPixelAssets() {
        // 创建 8x8 像素的玩家角色
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x00ff00);
        playerGraphics.fillRect(0, 0, 8, 8);
        playerGraphics.fillStyle(0x008800);
        playerGraphics.fillRect(2, 2, 4, 4);
        playerGraphics.generateTexture('player', 8, 8);
        playerGraphics.destroy();

        // 创建 6x6 像素的敌人
        const enemyGraphics = this.add.graphics();
        enemyGraphics.fillStyle(0xff0000);
        enemyGraphics.fillRect(0, 0, 6, 6);
        enemyGraphics.fillStyle(0xaa0000);
        enemyGraphics.fillRect(1, 1, 4, 4);
        enemyGraphics.generateTexture('enemy', 6, 6);
        enemyGraphics.destroy();

        // 创建像素风瓦片
        const tileGraphics = this.add.graphics();
        tileGraphics.fillStyle(0x333333);
        tileGraphics.fillRect(0, 0, 16, 16);
        tileGraphics.fillStyle(0x555555);
        tileGraphics.fillRect(2, 2, 12, 12);
        tileGraphics.generateTexture('tile', 16, 16);
        tileGraphics.destroy();
    }

    /**
     * 创建像素风背景
     */
    createPixelBackground() {
        // 使用瓦片创建网格背景
        for (let x = 0; x < 320; x += 16) {
            for (let y = 0; y < 240; y += 16) {
                this.add.image(x, y, 'tile')
                    .setOrigin(0)
                    .setAlpha(0.3);
            }
        }
    }

    /**
     * 创建敌人
     */
    createEnemies() {
        for (let i = 0; i < 5; i++) {
            const enemy = this.add.sprite(
                200 + i * 20,
                100 + i * 10,
                'enemy'
            )
                .setScale(2)
                .setTint(Phaser.Math.Between(0xff0000, 0xff8888));
            
            enemy.rotation = Math.random() * Math.PI * 2;
            this.enemies.add(enemy);
        }
    }
}

/**
 * 像素风游戏组件
 */
export const PixelGameDemo: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const phaserGameRef = useRef<Phaser.Game | null>(null);
    const [gameReady, setGameReady] = useState(false);

    useEffect(() => {
        if (!gameRef.current) return;

        // 像素风游戏的关键配置
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 320,          // 经典低分辨率
            height: 240,         // 4:3 比例
            parent: gameRef.current,
            backgroundColor: '#2c3e50',
            scene: PixelArtScene,
            
            // 🎨 像素风关键配置
            render: {
                antialias: false,           // 关闭抗锯齿！
                pixelArt: true,            // 启用像素艺术模式
                roundPixels: true,         // 像素对齐到整数坐标
            },
            
            // 缩放配置
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                min: {
                    width: 320,
                    height: 240
                },
                max: {
                    width: 1280,  // 4倍放大
                    height: 960
                }
            },
            
            // 物理引擎配置
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: false
                }
            }
        };

        phaserGameRef.current = new Phaser.Game(config);

        phaserGameRef.current.events.once('ready', () => {
            setGameReady(true);
            console.log('🎮 像素风游戏准备就绪！');
        });

        return () => {
            if (phaserGameRef.current) {
                phaserGameRef.current.destroy(true);
                phaserGameRef.current = null;
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                    🎮 Phaser 像素风游戏演示
                </h2>
                <p className="text-gray-300">
                    经典8-bit风格游戏体验
                </p>
            </div>
            
            {/* 游戏容器 */}
            <div 
                ref={gameRef} 
                className="border-4 border-gray-600 rounded-lg shadow-2xl bg-black"
                style={{
                    imageRendering: 'pixelated' as any,    // CSS 像素化渲染
                } as React.CSSProperties}
            />
            
            {!gameReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="text-white text-xl font-mono animate-pulse">
                        LOADING...
                    </div>
                </div>
            )}
            
            {/* 技术说明 */}
            <div className="mt-8 max-w-2xl bg-gray-800 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 text-center">
                    🎨 像素风技术特性
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-green-400 mb-2">渲染优化</h4>
                        <ul className="space-y-1 text-gray-300">
                            <li>• antialias: false</li>
                            <li>• pixelArt: true</li>
                            <li>• roundPixels: true</li>
                            <li>• 低分辨率 (320x240)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-400 mb-2">像素艺术</h4>
                        <ul className="space-y-1 text-gray-300">
                            <li>• 8x8 像素精灵</li>
                            <li>• 整数坐标移动</li>
                            <li>• 16色调色板风格</li>
                            <li>• 瓦片地图背景</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}; 