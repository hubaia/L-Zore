import Phaser from 'phaser';
import type { GameState } from '../types/gameTypes';
import { AudioManager } from './AudioManager';

/**
 * 键盘管理器 - 处理键盘快捷键相关功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class KeyboardManager {
    private scene: Phaser.Scene;
    private gameState: GameState;
    private showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void;
    
    // 键盘对象
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys: { [key: string]: Phaser.Input.Keyboard.Key } = {};
    private helpText: Phaser.GameObjects.Text | null = null;
    private isHelpVisible: boolean = false;
    private audioManager: AudioManager | null = null;
    
    // 键盘回调函数接口
    private callbacks: {
        pauseGame: () => void;
        drawCard: () => void;
        toggleAudio: () => void;
        toggleVoice: () => void;
        autoDrawCards: () => void;
    } = {
        pauseGame: () => {},
        drawCard: () => {},
        toggleAudio: () => {},
        toggleVoice: () => {},
        autoDrawCards: () => {}
    };
    
    constructor(
        scene: Phaser.Scene, 
        gameState: GameState, 
        showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void,
        audioManager?: AudioManager
    ) {
        this.scene = scene;
        this.gameState = gameState;
        this.showMessage = showMessage;
        this.audioManager = audioManager || null;
        this.createKeys();
        this.setupKeyboardEvents();
    }
    
    /**
     * 创建键盘按键
     */
    private createKeys(): void {
        if (!this.scene.input.keyboard) {
            console.warn('❌ KeyboardManager: 键盘输入未启用');
            return;
        }
        
        // 主要功能键
        this.keys.ESC = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keys.SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keys.ENTER = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        // 游戏功能键
        this.keys.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.M = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.keys.V = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        
        // 音效控制键
        this.keys.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys.ONE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.keys.TWO = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.keys.THREE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.keys.FOUR = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.keys.FIVE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        
        // 帮助键
        this.keys.H = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.keys.F1 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F1);
        
        console.log('✅ KeyboardManager: 键盘按键创建完成');
    }
    
    /**
     * 设置键盘事件监听
     */
    private setupKeyboardEvents(): void {
        // ESC - 暂停/恢复游戏
        this.keys.ESC?.on('down', () => {
            this.audioManager?.playUISFX('button_click');
            this.callbacks.pauseGame();
        });
        
        // D - 抽卡
        this.keys.D?.on('down', () => {
            if (!this.gameState.isPaused && this.gameState.canPlayerUseCards) {
                this.audioManager?.playUISFX('button_click');
                this.callbacks.drawCard();
            } else {
                this.audioManager?.playUISFX('error');
            }
        });
        
        // A - 自动抽卡
        this.keys.A?.on('down', () => {
            this.audioManager?.playUISFX('button_click');
            this.callbacks.autoDrawCards();
        });
        
        // M - 切换背景音乐
        this.keys.M?.on('down', () => {
            this.audioManager?.playUISFX('button_click');
            this.callbacks.toggleAudio();
        });
        
        // V - 切换语音合成
        this.keys.V?.on('down', () => {
            this.audioManager?.playUISFX('button_click');
            this.callbacks.toggleVoice();
        });
        
        // S - 切换音效开关
        this.keys.S?.on('down', () => {
            if (this.audioManager) {
                const isEnabled = this.audioManager.toggleSFX();
                this.audioManager.playUISFX('button_click');
                this.showSFXMessage(`音效已${isEnabled ? '开启' : '关闭'}`);
            }
        });
        
        // 数字键1-5 - 音效音量调节
        this.keys.ONE?.on('down', () => this.setSFXVolume(0.2, '20%'));
        this.keys.TWO?.on('down', () => this.setSFXVolume(0.4, '40%'));
        this.keys.THREE?.on('down', () => this.setSFXVolume(0.6, '60%'));
        this.keys.FOUR?.on('down', () => this.setSFXVolume(0.8, '80%'));
        this.keys.FIVE?.on('down', () => this.setSFXVolume(1.0, '100%'));
        
        // H/F1 - 显示/隐藏帮助
        this.keys.H?.on('down', () => {
            this.audioManager?.playUISFX('button_click');
            this.toggleHelp();
        });
        this.keys.F1?.on('down', () => {
            this.audioManager?.playUISFX('button_click');
            this.toggleHelp();
        });
        
        console.log('✅ KeyboardManager: 键盘事件监听设置完成');
    }
    
    /**
     * 设置音效音量
     */
    private setSFXVolume(volume: number, description: string): void {
        if (this.audioManager) {
            this.audioManager.setSFXVolume(volume);
            this.audioManager.playUISFX('confirm');
            this.showSFXMessage(`音效音量设置为 ${description}`);
        }
    }
    
    /**
     * 显示音效相关消息
     */
    private showSFXMessage(message: string): void {
        // 创建临时消息显示
        const messageText = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height - 150,
            `🔊 ${message}`,
            {
                fontSize: '18px',
                color: '#00ff88',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: { x: 12, y: 8 }
            }
        );
        messageText.setOrigin(0.5);
        messageText.setDepth(1000);
        
        // 3秒后自动消失
        this.scene.time.delayedCall(3000, () => {
            if (messageText && messageText.active) {
                messageText.destroy();
            }
        });
    }
    
    /**
     * 切换帮助显示
     */
    private toggleHelp(): void {
        if (this.isHelpVisible) {
            this.hideHelp();
        } else {
            this.showHelp();
        }
    }
    
    /**
     * 显示帮助信息
     */
    private showHelp(): void {
        if (this.helpText) {
            this.helpText.destroy();
        }
        
        const helpContent = [
            '🎮 L-Zore 神煞卡牌游戏 - 快捷键说明',
            '',
            '⚡ 游戏控制:',
            '  ESC - 暂停/恢复游戏',
            '  D   - 抽取卡牌',
            '  A   - 自动抽卡',
            '',
            '🎵 音频控制:',
            '  M   - 切换背景音乐开关',
            '  V   - 切换语音合成开关',
            '  S   - 切换音效开关',
            '',
            '🔊 音效音量 (按数字键):',
            '  1   - 音效音量 20%',
            '  2   - 音效音量 40%',
            '  3   - 音效音量 60%',
            '  4   - 音效音量 80%',
            '  5   - 音效音量 100%',
            '',
            '💡 其他:',
            '  H/F1 - 显示/隐藏此帮助',
            '',
            '按任意键关闭帮助...'
        ].join('\n');
        
        this.helpText = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            helpContent,
            {
                fontSize: '14px',
                color: '#ffffff',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: { x: 20, y: 20 },
                align: 'left'
            }
        );
        this.helpText.setOrigin(0.5);
        this.helpText.setDepth(1001);
        
        this.isHelpVisible = true;
        
        // 监听任意键关闭帮助
        const closeHelp = () => {
            this.hideHelp();
            this.scene.input.keyboard?.off('keydown', closeHelp);
        };
        this.scene.input.keyboard?.once('keydown', closeHelp);
    }
    
    /**
     * 隐藏帮助信息
     */
    private hideHelp(): void {
        if (this.helpText) {
            this.helpText.destroy();
            this.helpText = null;
        }
        this.isHelpVisible = false;
    }
    
    /**
     * 注册回调函数
     */
    registerCallbacks(callbacks: {
        pauseGame: () => void;
        drawCard: () => void;
        toggleAudio: () => void;
        toggleVoice: () => void;
        autoDrawCards: () => void;
    }): void {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }
    
    /**
     * 获取键盘状态
     */
    getKeyboardState(): {
        canPlayerUseCards: boolean;
        isPaused: boolean;
        helpVisible: boolean;
    } {
        return {
            canPlayerUseCards: this.gameState.canPlayerUseCards,
            isPaused: this.gameState.isPaused,
            helpVisible: this.isHelpVisible
        };
    }
    
    /**
     * 清理资源
     */
    dispose(): void {
        // 移除所有按键监听
        Object.values(this.keys).forEach(key => {
            if (key) {
                key.removeAllListeners();
            }
        });
        
        // 清理帮助文本
        if (this.helpText) {
            this.helpText.destroy();
            this.helpText = null;
        }
        
        console.log('🧹 KeyboardManager: 资源清理完成');
    }
} 