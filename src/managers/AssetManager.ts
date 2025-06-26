import { GAME_CONFIG } from '../constants/gameData';

/**
 * 资源管理器 - 处理所有资源加载和纹理创建功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class AssetManager {
    private scene: Phaser.Scene;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
    
    /**
     * 加载粒子效果资源
     */
    loadParticleAssets(): void {
        // 创建粒子纹理
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(0, 0, 8);
        graphics.generateTexture('particle', 16, 16);
        graphics.destroy();
    }
    
    /**
     * 加载卡牌资源
     */
    loadCardAssets(): void {
        // 创建程序化生成的卡牌纹理
        this.createCardTextures();
    }
    
    /**
     * 创建卡牌纹理
     */
    createCardTextures(): void {
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
    private createCyberpunkCard(key: string, width: number, height: number, mainColor: number, borderColor: number): void {
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
        
        // 根据纹理类型添加装饰
        this.addCyberpunkDecoration(graphics, width, height, mainColor, key);
        
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }
    
    /**
     * 添加赛博朋克装饰
     */
    private addCyberpunkDecoration(graphics: Phaser.GameObjects.Graphics, width: number, height: number, color: number, textureKey: string): void {
        graphics.fillStyle(color, 0.8);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        switch (textureKey) {
            case 'card-auspicious':
                // 吉神 - 数字化十字
                this.drawDigitalCross(graphics, centerX, centerY, 15, color);
                this.drawCornerCircuits(graphics, width, height, color);
                break;
                
            case 'card-inauspicious':
                // 凶神 - 数字化X
                this.drawDigitalX(graphics, centerX, centerY, 15, color);
                this.drawGlitchLines(graphics, width, height, color);
                break;
                
            case 'card-special':
                // 特殊 - 六边形网格
                this.drawHexGrid(graphics, centerX, centerY, 12, color);
                break;
                
            case 'card-back':
                // 卡背 - 数字雨图案
                this.drawDigitalRainPattern(graphics, width, height, color);
                break;
        }
    }
    
    /**
     * 绘制数字化十字
     */
    private drawDigitalCross(graphics: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number): void {
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
    private drawDigitalX(graphics: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number): void {
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
     * 绘制角落电路图案
     */
    private drawCornerCircuits(graphics: Phaser.GameObjects.Graphics, width: number, height: number, color: number): void {
        graphics.lineStyle(1, color, 0.6);
        
        const corners = [
            { x: 8, y: 8 },
            { x: width - 8, y: 8 },
            { x: 8, y: height - 8 },
            { x: width - 8, y: height - 8 }
        ];
        
        corners.forEach(corner => {
            // 绘制小型电路
            graphics.moveTo(corner.x - 4, corner.y);
            graphics.lineTo(corner.x + 4, corner.y);
            graphics.moveTo(corner.x, corner.y - 4);
            graphics.lineTo(corner.x, corner.y + 4);
        });
        
        graphics.strokePath();
        
        // 中心点
        graphics.fillStyle(color, 0.8);
        corners.forEach(corner => {
            graphics.fillRect(corner.x - 1, corner.y - 1, 2, 2);
        });
    }
    
    /**
     * 绘制故障线条
     */
    private drawGlitchLines(graphics: Phaser.GameObjects.Graphics, width: number, height: number, color: number): void {
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
    private drawHexGrid(graphics: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number): void {
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
    private drawDigitalRainPattern(graphics: Phaser.GameObjects.Graphics, width: number, height: number, color: number): void {
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
     * 创建发光效果纹理
     */
    createGlowEffects(): void {
        // 创建各种发光效果纹理
        this.createGlowTexture('glow-blue', 0x00aaff);
        this.createGlowTexture('glow-red', 0xff4444);
        this.createGlowTexture('glow-green', 0x44ff44);
        this.createGlowTexture('glow-purple', 0x9944ff);
        this.createGlowTexture('glow-gold', 0xffaa00);
    }
    
    /**
     * 创建发光纹理
     */
    private createGlowTexture(key: string, color: number): void {
        const size = 64;
        const graphics = this.scene.add.graphics();
        
        // 创建径向渐变发光效果
        for (let r = size / 2; r > 0; r -= 2) {
            const alpha = (size / 2 - r) / (size / 2) * 0.8;
            graphics.fillStyle(color, alpha);
            graphics.fillCircle(size / 2, size / 2, r);
        }
        
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }
    
    /**
     * 创建UI元素纹理
     */
    createUITextures(): void {
        // 创建按钮纹理
        this.createButtonTexture('button-normal', 0x333333, 0x666666);
        this.createButtonTexture('button-hover', 0x444444, 0x888888);
        this.createButtonTexture('button-pressed', 0x222222, 0x444444);
        
        // 创建面板纹理
        this.createPanelTexture('panel-bg', 0x000000, 0x333333);
        this.createPanelTexture('panel-modal', 0x111111, 0x444444);
    }
    
    /**
     * 创建按钮纹理
     */
    private createButtonTexture(key: string, fillColor: number, borderColor: number): void {
        const width = 200;
        const height = 50;
        const graphics = this.scene.add.graphics();
        
        // 背景
        graphics.fillStyle(fillColor, 0.8);
        graphics.fillRoundedRect(0, 0, width, height, 10);
        
        // 边框
        graphics.lineStyle(2, borderColor, 1);
        graphics.strokeRoundedRect(0, 0, width, height, 10);
        
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }
    
    /**
     * 创建面板纹理
     */
    private createPanelTexture(key: string, fillColor: number, borderColor: number): void {
        const width = 400;
        const height = 300;
        const graphics = this.scene.add.graphics();
        
        // 背景
        graphics.fillStyle(fillColor, 0.9);
        graphics.fillRoundedRect(0, 0, width, height, 15);
        
        // 边框
        graphics.lineStyle(3, borderColor, 0.8);
        graphics.strokeRoundedRect(0, 0, width, height, 15);
        
        // 内部装饰线条
        graphics.lineStyle(1, borderColor, 0.4);
        graphics.strokeRoundedRect(5, 5, width - 10, height - 10, 10);
        
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }
    
    /**
     * 预加载音频资源
     */
    loadAudioAssets(): void {
        console.log('🎵 准备音频管理器，将在管理器初始化时加载音频');
        
        // 音频加载已移至AudioManager，在管理器初始化时处理
        
        // TODO: 等待音效文件创建后再添加
        // this.scene.load.audio('card_place', 'src/asset/audio/SFX/Card/card_place.wav');
        // this.scene.load.audio('card_draw', 'src/asset/audio/SFX/Card/card_draw.wav');
        // this.scene.load.audio('neutralize', 'src/asset/audio/SFX/Shensha/neutralize.wav');
    }
    
    /**
     * 获取赛博朋克卡牌纹理键
     */
    getCyberpunkCardTexture(type: string): string {
        switch(type) {
            case 'auspicious': return 'card-auspicious';
            case 'inauspicious': return 'card-inauspicious';
            case 'special': return 'card-special';
            default: return 'card-auspicious';
        }
    }
    
    /**
     * 创建所有游戏纹理
     */
    createAllGameTextures(): void {
        console.log('🎨 开始创建游戏纹理...');
        
        this.createCardTextures();
        this.createGlowEffects();
        this.createUITextures();
        this.loadParticleAssets();
        
        console.log('✅ 游戏纹理创建完成');
    }
    
    /**
     * 清理资源
     */
    dispose(): void {
        // 清理动态创建的纹理
        const textureKeys = [
            'card-auspicious', 'card-inauspicious', 'card-special', 'card-back',
            'particle',
            'glow-blue', 'glow-red', 'glow-green', 'glow-purple', 'glow-gold',
            'button-normal', 'button-hover', 'button-pressed',
            'panel-bg', 'panel-modal'
        ];
        
        textureKeys.forEach(key => {
            if (this.scene.textures.exists(key)) {
                this.scene.textures.remove(key);
            }
        });
        
        console.log('🧹 AssetManager: 资源清理完成');
    }
} 