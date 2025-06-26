import type { GameState } from '../types/gameTypes';

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
    
    constructor(
        scene: Phaser.Scene, 
        gameState: GameState, 
        showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void
    ) {
        this.scene = scene;
        this.gameState = gameState;
        this.showMessage = showMessage;
    }
    
    /**
     * 设置键盘控制
     */
    setupKeyboardControls(callbacks: {
        toggleAudio: () => void;
        restartGame: () => void;
        useSpecialAbility: () => void;
        drawCard: () => void;
        pauseGame: () => void;
    }): void {
        if (!this.scene.input.keyboard) return;
        
        // 创建方向键
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
        // 创建字母键
        this.keys.M = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.keys.R = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keys.SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keys.ESC = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keys.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.P = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.keys.H = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        
        // 数字键（1-8用于快速选择格子）
        this.keys.NUM_1 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.keys.NUM_2 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.keys.NUM_3 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.keys.NUM_4 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.keys.NUM_5 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        this.keys.NUM_6 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        this.keys.NUM_7 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
        this.keys.NUM_8 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);
        
        // 设置按键事件监听
        this.setupKeyEvents(callbacks);
        
        this.showMessage('⌨️ 键盘控制已启用：M-音乐 | R-重启 | 空格-特殊技能 | D-抽卡 | P-暂停', 'success');
    }
    
    /**
     * 设置按键事件
     */
    private setupKeyEvents(callbacks: {
        toggleAudio: () => void;
        restartGame: () => void;
        useSpecialAbility: () => void;
        drawCard: () => void;
        pauseGame: () => void;
    }): void {
        // M键 - 切换音乐
        this.keys.M.on('down', () => {
            callbacks.toggleAudio();
            this.showMessage('🎵 音乐切换', 'success');
        });
        
        // R键 - 重新开始游戏（仅在游戏结束时）
        this.keys.R.on('down', () => {
            if (this.gameState.gamePhase === 'ended') {
                callbacks.restartGame();
            } else {
                this.showMessage('⚠️ 只能在游戏结束时重新开始', 'warning');
            }
        });
        
        // 空格键 - 使用特殊能力
        this.keys.SPACE.on('down', () => {
            if (!this.gameState.isPaused) {
                callbacks.useSpecialAbility();
            }
        });
        
        // D键 - 抽卡
        this.keys.D.on('down', () => {
            if (!this.gameState.isPaused && this.gameState.canPlayerUseCards) {
                callbacks.drawCard();
            } else {
                this.showMessage('⚠️ 当前无法抽卡', 'warning');
            }
        });
        
        // P键或ESC键 - 暂停/继续游戏
        this.keys.P.on('down', () => {
            callbacks.pauseGame();
        });
        
        this.keys.ESC.on('down', () => {
            callbacks.pauseGame();
        });
        
        // H键 - 显示帮助
        this.keys.H.on('down', () => {
            this.showHelpInfo();
        });
        
        // 数字键快速选择格子
        this.keys.NUM_1.on('down', () => this.selectBattlefieldPosition(0));
        this.keys.NUM_2.on('down', () => this.selectBattlefieldPosition(1));
        this.keys.NUM_3.on('down', () => this.selectBattlefieldPosition(2));
        this.keys.NUM_4.on('down', () => this.selectBattlefieldPosition(3));
        this.keys.NUM_5.on('down', () => this.selectBattlefieldPosition(4));
        this.keys.NUM_6.on('down', () => this.selectBattlefieldPosition(5));
        this.keys.NUM_7.on('down', () => this.selectBattlefieldPosition(6));
        this.keys.NUM_8.on('down', () => this.selectBattlefieldPosition(7));
    }
    
    /**
     * 使用特殊能力
     */
    useSpecialAbility(callbacks: {
        applySpecialEffect: (effectName: string) => void;
        updateGameStateUI: () => void;
        checkElementNeutralization: () => void;
    }): void {
        if (this.gameState.isPaused) {
            this.showMessage('⚠️ 游戏暂停中，无法使用特殊能力', 'warning');
            return;
        }
        
        if (!this.gameState.canPlayerUseCards) {
            this.showMessage('⚠️ 当前不是玩家回合，无法使用特殊能力', 'warning');
            return;
        }
        
        // 根据玩家八字决定特殊能力类型
        const abilityType = this.determineSpecialAbility();
        
        this.showMessage(`🌟 发动特殊能力：${abilityType}！`, 'warning');
        
        // 执行特殊效果
        callbacks.applySpecialEffect(abilityType);
        
        // 更新UI显示最新状态
        callbacks.updateGameStateUI();
        
        // 检查是否触发元素中和
        callbacks.checkElementNeutralization();
        
        // 冷却时间
        this.gameState.playerCooldownRemaining = 5; // 5秒冷却
    }
    
    /**
     * 确定特殊能力类型
     */
    private determineSpecialAbility(): string {
        // 基于玩家八字的五行属性决定特殊能力
        // 这里可以实现复杂的八字分析逻辑
        const abilities = ['全体增益', '全体伤害', '中和效果', '时间加速', '元素转换'];
        
        // 简化版本：根据当前游戏状态选择
        if (this.gameState.playerRemainingElements <= 3) {
            return '全体增益'; // 血量低时优选治疗
        } else if (this.gameState.opponentRemainingElements <= 3) {
            return '全体伤害'; // 对手血量低时优选攻击
        } else {
            return abilities[Math.floor(Math.random() * abilities.length)];
        }
    }
    
    /**
     * 选择战场位置
     */
    private selectBattlefieldPosition(position: number): void {
        if (this.gameState.isPaused) return;
        
        this.showMessage(`🎯 选择战场位置 ${position + 1}`, 'success');
        
        // 发射事件给战场管理器
        this.scene.events.emit('battlefieldPositionSelected', position);
    }
    
    /**
     * 暂停/继续游戏
     */
    pauseGame(): void {
        if (this.gameState.gamePhase === 'ended') {
            this.showMessage('⚠️ 游戏已结束，无法暂停', 'warning');
            return;
        }
        
        this.gameState.isPaused = !this.gameState.isPaused;
        
        if (this.gameState.isPaused) {
            this.gameState.pauseReason = '玩家手动暂停';
            this.showMessage('⏸️ 游戏已暂停，按P或ESC继续', 'warning');
        } else {
            this.gameState.pauseReason = '';
            this.showMessage('▶️ 游戏继续！', 'success');
        }
        
        // 发射暂停状态变化事件
        this.scene.events.emit('gamePauseStateChanged', this.gameState.isPaused);
    }
    
    /**
     * 显示帮助信息
     */
    private showHelpInfo(): void {
        const helpText = [
            '🎮 L-Zore神煞卡牌游戏 - 键盘操作指南',
            '',
            '⌨️ 基础操作：',
            'M键 - 切换背景音乐',
            'D键 - 抽取卡牌',
            '空格键 - 使用特殊能力',
            'P键/ESC键 - 暂停/继续游戏',
            'R键 - 重新开始游戏（游戏结束时）',
            'H键 - 显示此帮助信息',
            '',
            '🎯 战场操作：',
            '1-8数字键 - 快速选择战场位置',
            '鼠标拖拽 - 放置卡牌到战场',
            '双击卡牌 - 自动放置到最佳位置',
            '',
            '⚡ 游戏机制：',
            '• 消耗对手的8枚元素获胜',
            '• 神煞卡牌具有特殊效果',
            '• 五行相克会触发元素中和',
            '• 即时战斗系统，抢夺优先权',
            '',
            '🔮 特殊能力基于你的八字属性！'
        ];
        
        // 显示帮助文本（可以创建一个模态框）
        console.log(helpText.join('\n'));
        this.showMessage('💡 帮助信息已显示在控制台中！', 'success');
        
        // 也可以发射事件给UI显示帮助面板
        this.scene.events.emit('showHelpPanel', helpText);
    }
    
    /**
     * 检查按键状态
     */
    update(): void {
        if (!this.cursors) return;
        
        // 方向键可以用来快速浏览手牌或战场
        if (this.cursors.left?.isDown) {
            this.scene.events.emit('navigateLeft');
        }
        
        if (this.cursors.right?.isDown) {
            this.scene.events.emit('navigateRight');
        }
        
        if (this.cursors.up?.isDown) {
            this.scene.events.emit('navigateUp');
        }
        
        if (this.cursors.down?.isDown) {
            this.scene.events.emit('navigateDown');
        }
    }
    
    /**
     * 启用/禁用键盘输入
     */
    setEnabled(enabled: boolean): void {
        if (!this.scene.input.keyboard) return;
        
        this.scene.input.keyboard.enabled = enabled;
        
        if (enabled) {
            this.showMessage('⌨️ 键盘控制已启用', 'success');
        } else {
            this.showMessage('⌨️ 键盘控制已禁用', 'warning');
        }
    }
    
    /**
     * 清理资源
     */
    dispose(): void {
        Object.values(this.keys).forEach(key => {
            if (key) {
                key.removeAllListeners();
            }
        });
        
        this.keys = {};
    }
} 