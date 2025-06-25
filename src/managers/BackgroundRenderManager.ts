import Phaser from 'phaser';

/**
 * 背景渲染管理器
 * 负责背景、粒子效果、视觉特效
 */
export class BackgroundRenderManager {
    private scene: Phaser.Scene;
    private particles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * 创建游戏背景
     */
    createBackground() {
        const { width, height } = this.scene.cameras.main;
        
        // 1. 主背景 - 深色赛博朋克渐变
        const bgGraphics = this.scene.add.graphics();
        this.createCyberpunkGradient(width, height).forEach(color => {
            bgGraphics.fillStyle(color.color, color.alpha);
            bgGraphics.fillRect(0, color.y, width, color.height);
        });
        
        // 2. 网格背景层
        this.createCyberpunkGrid(width, height);
        
        // 3. 数字雨效果
        this.createDigitalRain(width, height);
        
        // 4. 扫描线效果
        this.createScanLines(width, height);
        
        // 5. 霓虹边框装饰
        this.createNeonBorders(width, height);
        
        // 6. 故障特效层
        this.createGlitchEffect(width, height);
    }

    /**
     * 创建赛博朋克渐变背景
     */
    private createCyberpunkGradient(width: number, height: number) {
        return [
            { color: 0x0a0a0f, alpha: 1.0, y: 0, height: height * 0.3 },
            { color: 0x0f0f1e, alpha: 0.9, y: height * 0.3, height: height * 0.4 },
            { color: 0x1a1a2e, alpha: 0.8, y: height * 0.7, height: height * 0.3 }
        ];
    }

    /**
     * 创建赛博朋克网格背景
     */
    private createCyberpunkGrid(width: number, height: number) {
        const gridGraphics = this.scene.add.graphics();
        
        // 网格设置
        const gridSize = 40;
        const gridOpacity = 0.15;
        const gridColor = 0x00ffff;
        
        gridGraphics.lineStyle(1, gridColor, gridOpacity);
        
        // 绘制垂直线
        for (let x = 0; x <= width; x += gridSize) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, height);
        }
        
        // 绘制水平线
        for (let y = 0; y <= height; y += gridSize) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(width, y);
        }
        
        gridGraphics.strokePath();
        
        // 添加关键节点
        this.addGridNodes(width, height, gridSize, gridGraphics);
    }

    /**
     * 添加网格节点
     */
    private addGridNodes(width: number, height: number, gridSize: number, graphics: Phaser.GameObjects.Graphics) {
        graphics.fillStyle(0x00ffff, 0.3);
        
        for (let x = 0; x <= width; x += gridSize) {
            for (let y = 0; y <= height; y += gridSize) {
                if (Math.random() < 0.05) { // 5%概率显示节点
                    graphics.fillCircle(x, y, 2);
                }
            }
        }
    }

    /**
     * 创建数字雨效果
     */
    private createDigitalRain(width: number, height: number) {
        const rainContainer = this.scene.add.container(0, 0);
        
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const rainStream = this.createRainStream(x, height);
            rainContainer.add(rainStream);
        }
        
        rainContainer.setDepth(-50);
    }

    /**
     * 创建单个数字雨流
     */
    private createRainStream(x: number, height: number) {
        const stream = this.scene.add.container(x, -50);
        const chars = ['0', '1', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        
        for (let i = 0; i < 20; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const text = this.scene.add.text(0, i * 20, char, {
                fontSize: '12px',
                color: '#00ff88'
            });
            text.setAlpha(Math.max(0.1, 1 - i * 0.05));
            stream.add(text);
        }
        
        // 动画
        this.scene.tweens.add({
            targets: stream,
            y: height + 100,
            duration: 3000 + Math.random() * 2000,
            ease: 'Linear',
            repeat: -1,
            delay: Math.random() * 2000
        });
        
        return stream;
    }

    /**
     * 创建扫描线效果
     */
    private createScanLines(width: number, height: number) {
        const scanGraphics = this.scene.add.graphics();
        scanGraphics.lineStyle(1, 0x00ffff, 0.1);
        
        // 创建水平扫描线
        for (let y = 0; y < height; y += 4) {
            scanGraphics.moveTo(0, y);
            scanGraphics.lineTo(width, y);
        }
        scanGraphics.strokePath();
        
        // 添加移动扫描线
        this.createMovingScanLine(width, height);
    }

    /**
     * 创建移动扫描线
     */
    private createMovingScanLine(width: number, height: number) {
        const scanLine = this.scene.add.graphics();
        scanLine.lineStyle(2, 0x00ffff, 0.6);
        scanLine.moveTo(0, 0);
        scanLine.lineTo(width, 0);
        scanLine.strokePath();
        
        // 添加发光效果
        scanLine.setBlendMode(Phaser.BlendModes.ADD);
        
        // 扫描动画
        this.scene.tweens.add({
            targets: scanLine,
            y: height,
            duration: 4000,
            ease: 'Linear',
            repeat: -1,
            yoyo: true
        });
    }

    /**
     * 创建霓虹边框装饰
     */
    private createNeonBorders(width: number, height: number) {
        const borderGraphics = this.scene.add.graphics();
        
        // 顶部装饰线
        this.createNeonLine(borderGraphics, 0, 20, width, 20, 0x00ffff, 0.8);
        
        // 底部装饰线
        this.createNeonLine(borderGraphics, 0, height - 20, width, height - 20, 0x00ffff, 0.8);
        
        // 角落装饰
        this.createNeonCornerDecorations(borderGraphics, width, height);
    }

    /**
     * 创建霓虹线条
     */
    private createNeonLine(graphics: Phaser.GameObjects.Graphics, x1: number, y1: number, x2: number, y2: number, color: number, alpha: number) {
        // 外层发光
        graphics.lineStyle(4, color, alpha * 0.3);
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        graphics.strokePath();
        
        // 内层亮线
        graphics.lineStyle(2, color, alpha * 0.8);
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        graphics.strokePath();
        
        // 核心亮线
        graphics.lineStyle(1, 0xffffff, alpha);
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        graphics.strokePath();
    }

    /**
     * 创建霓虹角落装饰
     */
    private createNeonCornerDecorations(graphics: Phaser.GameObjects.Graphics, width: number, height: number) {
        const cornerSize = 30;
        const positions = [
            { x: 0, y: 0 }, // 左上
            { x: width, y: 0 }, // 右上
            { x: 0, y: height }, // 左下
            { x: width, y: height } // 右下
        ];
        
        positions.forEach((pos, index) => {
            const xDir = index % 2 === 0 ? 1 : -1;
            const yDir = index < 2 ? 1 : -1;
            
            graphics.lineStyle(2, 0x00ffff, 0.8);
            
            // L形装饰
            graphics.moveTo(pos.x, pos.y);
            graphics.lineTo(pos.x + (cornerSize * xDir), pos.y);
            graphics.moveTo(pos.x, pos.y);
            graphics.lineTo(pos.x, pos.y + (cornerSize * yDir));
            
            graphics.strokePath();
        });
    }

    /**
     * 创建故障特效
     */
    private createGlitchEffect(width: number, height: number) {
        // 每隔一段时间触发故障效果
        this.scene.time.addEvent({
            delay: 5000 + Math.random() * 5000,
            callback: () => this.triggerGlitch(width, height),
            callbackScope: this,
            loop: true
        });
    }

    /**
     * 触发故障效果
     */
    private triggerGlitch(width: number, height: number) {
        const glitchGraphics = this.scene.add.graphics();
        
        // 随机故障条纹
        for (let i = 0; i < 5; i++) {
            const y = Math.random() * height;
            const h = 2 + Math.random() * 8;
            
            glitchGraphics.fillStyle(0xff00ff, 0.3);
            glitchGraphics.fillRect(0, y, width, h);
        }
        
        // 故障效果持续时间很短
        this.scene.time.delayedCall(100, () => {
            glitchGraphics.destroy();
        });
    }

    /**
     * 创建粒子效果系统
     */
    createParticleEffects() {
        // 创建数字粒子发射器
        const digitalParticles = this.scene.add.particles(0, 0, 'particle', {
            x: { min: 0, max: this.scene.cameras.main.width },
            y: -10,
            speedY: { min: 20, max: 50 },
            scale: { start: 0.3, end: 0 },
            tint: [0x00ffff, 0x00ff88, 0x88ffff],
            alpha: { start: 0.6, end: 0 },
            lifespan: 4000,
            frequency: 200
        });
        
        digitalParticles.setDepth(-30);
        this.particles.push(digitalParticles);
        
        // 环境能量粒子
        const energyParticles = this.scene.add.particles(0, 0, 'particle', {
            x: { min: 0, max: this.scene.cameras.main.width },
            y: { min: 0, max: this.scene.cameras.main.height },
            speedX: { min: -10, max: 10 },
            speedY: { min: -10, max: 10 },
            scale: { start: 0.1, end: 0 },
            tint: 0x6666ff,
            alpha: { start: 0.3, end: 0 },
            lifespan: 6000,
            frequency: 500
        });
        
        energyParticles.setDepth(-40);
        this.particles.push(energyParticles);
    }

    /**
     * 创建特效动画
     */
    createForceEffect(target: Phaser.GameObjects.Container) {
        // 吸引力场效果
        const forceField = this.scene.add.graphics();
        forceField.lineStyle(2, 0x00ffff, 0.6);
        
        const centerX = target.x;
        const centerY = target.y;
        
        // 绘制力场圆环
        for (let r = 20; r <= 100; r += 20) {
            forceField.strokeCircle(centerX, centerY, r);
        }
        
        // 力场动画
        this.scene.tweens.add({
            targets: forceField,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => forceField.destroy()
        });
        
        // 粒子爆发
        const burstParticles = this.scene.add.particles(centerX, centerY, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            tint: [0x00ffff, 0x0088ff, 0x88ffff],
            alpha: { start: 0.8, end: 0 },
            lifespan: 1000,
            quantity: 20
        });
        
        this.scene.time.delayedCall(1000, () => {
            burstParticles.destroy();
        });
    }

    /**
     * 销毁所有粒子效果
     */
    destroy() {
        this.particles.forEach(particle => {
            if (particle && particle.active) {
                particle.destroy();
            }
        });
        this.particles = [];
    }
} 