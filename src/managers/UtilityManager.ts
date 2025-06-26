/**
 * 工具管理器 - 处理各种工具方法和辅助功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class UtilityManager {
    private scene: Phaser.Scene;
    private backgroundManager: any; // BackgroundRenderManager引用
    private showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void;
    
    constructor(
        scene: Phaser.Scene,
        showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void
    ) {
        this.scene = scene;
        this.showMessage = showMessage;
    }
    
    /**
     * 设置背景管理器引用
     */
    setBackgroundManager(manager: any): void {
        this.backgroundManager = manager;
    }
    
    /**
     * 显示消息（备用方法）
     */
    displayMessage(text: string, type: 'success' | 'warning' | 'error' = 'success'): void {
        const colors = {
            success: '#00ff88',
            warning: '#ffaa00',
            error: '#ff4444'
        };
        
        const color = colors[type];
        const messageText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 100,
            text,
            {
                fontSize: '18px',
                color: color,
                fontStyle: 'bold',
                align: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: { x: 20, y: 10 }
            }
        );
        
        messageText.setOrigin(0.5);
        messageText.setDepth(1000);
        
        // 动画效果
        messageText.setAlpha(0);
        this.scene.tweens.add({
            targets: messageText,
            alpha: 1,
            y: messageText.y - 50,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                // 2秒后淡出
                this.scene.tweens.add({
                    targets: messageText,
                    alpha: 0,
                    y: messageText.y - 30,
                    duration: 500,
                    delay: 2000,
                    ease: 'Power2',
                    onComplete: () => {
                        messageText.destroy();
                    }
                });
            }
        });
    }
    
    /**
     * 触发自动放置效果
     */
    triggerAutoPlace(cardContainer: Phaser.GameObjects.Container): void {
        // 创建放置特效
        if (this.backgroundManager && this.backgroundManager.createForceEffect) {
            this.backgroundManager.createForceEffect(cardContainer);
        }
        
        this.showMessage('🎯 卡牌已放置！获得优先权！', 'success');
    }
    
    /**
     * 启动全局位置监控系统
     */
    startGlobalPositionMonitor(updateCallback: () => void): void {
        this.scene.time.addEvent({
            delay: 16, // 60 FPS
            callback: updateCallback,
            callbackScope: this.scene,
            loop: true
        });
    }
    
    /**
     * 创建加载进度条
     */
    createLoadingProgressBar(): {
        progressBar: Phaser.GameObjects.Graphics;
        progressText: Phaser.GameObjects.Text;
        updateProgress: (progress: number, text?: string) => void;
        destroy: () => void;
    } {
        const { width, height } = this.scene.cameras.main;
        
        // 创建进度条背景
        const progressBg = this.scene.add.graphics();
        progressBg.fillStyle(0x000000, 0.8);
        progressBg.fillRect(width * 0.2, height * 0.8, width * 0.6, 30);
        progressBg.setDepth(1000);
        
        // 创建进度条
        const progressBar = this.scene.add.graphics();
        progressBar.setDepth(1001);
        
        // 创建进度文本
        const progressText = this.scene.add.text(width * 0.5, height * 0.8 + 45, '加载中...', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        progressText.setOrigin(0.5);
        progressText.setDepth(1002);
        
        const updateProgress = (progress: number, text?: string) => {
            // 更新进度条
            progressBar.clear();
            progressBar.fillStyle(0x00ff88);
            progressBar.fillRect(width * 0.2, height * 0.8, (width * 0.6) * (progress / 100), 30);
            
            // 更新文本
            if (text) {
                progressText.setText(`${text} (${progress}%)`);
            } else {
                progressText.setText(`${progress}%`);
            }
        };
        
        const destroy = () => {
            progressBg.destroy();
            progressBar.destroy();
            progressText.destroy();
        };
        
        return {
            progressBar,
            progressText,
            updateProgress,
            destroy
        };
    }
    
    /**
     * 创建确认对话框
     */
    createConfirmDialog(
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel?: () => void
    ): void {
        const { width, height } = this.scene.cameras.main;
        
        // 创建遮罩
        const overlay = this.scene.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, width, height);
        overlay.setInteractive();
        overlay.setDepth(2000);
        
        // 创建对话框背景
        const dialogBg = this.scene.add.graphics();
        dialogBg.fillStyle(0x1a1a2e);
        dialogBg.lineStyle(2, 0x00ffff);
        dialogBg.fillRect(width * 0.25, height * 0.35, width * 0.5, height * 0.3);
        dialogBg.strokeRect(width * 0.25, height * 0.35, width * 0.5, height * 0.3);
        dialogBg.setDepth(2001);
        
        // 创建标题
        const titleText = this.scene.add.text(width * 0.5, height * 0.4, title, {
            fontSize: '20px',
            color: '#00ffff',
            fontStyle: 'bold'
        });
        titleText.setOrigin(0.5);
        titleText.setDepth(2002);
        
        // 创建消息
        const messageText = this.scene.add.text(width * 0.5, height * 0.47, message, {
            fontSize: '14px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: width * 0.4 }
        });
        messageText.setOrigin(0.5);
        messageText.setDepth(2002);
        
        // 创建确认按钮
        const confirmBtn = this.scene.add.text(width * 0.4, height * 0.57, '确认', {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#00aa00',
            padding: { x: 20, y: 10 }
        });
        confirmBtn.setOrigin(0.5);
        confirmBtn.setInteractive();
        confirmBtn.setDepth(2002);
        
        // 创建取消按钮
        const cancelBtn = this.scene.add.text(width * 0.6, height * 0.57, '取消', {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#aa0000',
            padding: { x: 20, y: 10 }
        });
        cancelBtn.setOrigin(0.5);
        cancelBtn.setInteractive();
        cancelBtn.setDepth(2002);
        
        // 清理函数
        const cleanup = () => {
            overlay.destroy();
            dialogBg.destroy();
            titleText.destroy();
            messageText.destroy();
            confirmBtn.destroy();
            cancelBtn.destroy();
        };
        
        // 按钮事件
        confirmBtn.on('pointerdown', () => {
            cleanup();
            onConfirm();
        });
        
        confirmBtn.on('pointerover', () => {
            confirmBtn.setStyle({ backgroundColor: '#00ff00' });
        });
        
        confirmBtn.on('pointerout', () => {
            confirmBtn.setStyle({ backgroundColor: '#00aa00' });
        });
        
        cancelBtn.on('pointerdown', () => {
            cleanup();
            if (onCancel) onCancel();
        });
        
        cancelBtn.on('pointerover', () => {
            cancelBtn.setStyle({ backgroundColor: '#ff0000' });
        });
        
        cancelBtn.on('pointerout', () => {
            cancelBtn.setStyle({ backgroundColor: '#aa0000' });
        });
    }
    
    /**
     * 格式化时间显示
     */
    formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * 生成随机ID
     */
    generateRandomId(length: number = 8): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    /**
     * 深拷贝对象
     */
    deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
        if (obj instanceof Array) return obj.map(item => this.deepClone(item)) as unknown as T;
        if (typeof obj === 'object') {
            const clonedObj: any = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
        return obj;
    }
    
    /**
     * 等待指定时间
     */
    async wait(milliseconds: number): Promise<void> {
        return new Promise(resolve => {
            this.scene.time.delayedCall(milliseconds, resolve);
        });
    }
    
    /**
     * 创建闪烁效果
     */
    createBlinkEffect(
        target: Phaser.GameObjects.GameObject,
        duration: number = 1000,
        blinkCount: number = 3
    ): void {
        const blinkInterval = duration / (blinkCount * 2);
        
        for (let i = 0; i < blinkCount; i++) {
            this.scene.time.delayedCall(i * blinkInterval * 2, () => {
                if (target && 'setAlpha' in target) {
                    (target as any).setAlpha(0.3);
                }
            });
            
            this.scene.time.delayedCall(i * blinkInterval * 2 + blinkInterval, () => {
                if (target && 'setAlpha' in target) {
                    (target as any).setAlpha(1);
                }
            });
        }
    }
    
    /**
     * 检查是否为移动设备
     */
    isMobileDevice(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * 获取设备信息
     */
    getDeviceInfo(): {
        isMobile: boolean;
        screenWidth: number;
        screenHeight: number;
        pixelRatio: number;
    } {
        return {
            isMobile: this.isMobileDevice(),
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1
        };
    }
} 