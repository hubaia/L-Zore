import Phaser from 'phaser';
import type { GameState } from '../types/gameTypes';
import { getElementText, getPillarName, getBaZiPillarInfo, getFullBaZiText } from '../utils/gameUtils';

/**
 * UI管理器
 * 负责所有UI创建和管理
 */
export class UIManager {
    private scene: Phaser.Scene;
    private gameState: GameState;
    private uiTexts: { [key: string]: Phaser.GameObjects.Text } = {};

    constructor(scene: Phaser.Scene, gameState: GameState) {
        this.scene = scene;
        this.gameState = gameState;
    }

    /**
     * 创建游戏UI界面
     */
    createGameUI() {
        const { width, height } = this.scene.cameras.main;
        
        // 创建左侧信息面板
        this.createLeftInfoPanel(width, height);
        
        // 创建右侧操作面板
        this.createRightActionPanel(width, height);
        
        // 创建底部指南栏
        this.createBottomGuideBar(width, height);
    }

    /**
     * 创建左侧信息面板
     */
    private createLeftInfoPanel(width: number, height: number) {
        const panelWidth = 320;
        const panelHeight = height - 40;
        const panelX = 10;
        const panelY = 20;
        
        // 创建面板背景
        const panel = this.createCyberpunkPanel(panelX, panelY, panelWidth, panelHeight, 0x0066ff, 0.08);
        
        // 面板标题
        const title = this.scene.add.text(panelX + 20, panelY + 20, '🎮 即时系统状态', {
            fontSize: '18px',
            color: '#00ffff',
            fontStyle: 'bold'
        });
        
        // 游戏状态区域
        let yOffset = 60;
        this.createStatusSection(panelX, panelY, yOffset, '⚡ 实时状态');
        
        // 实时状态文本
        yOffset += 40;
        this.uiTexts.gameTime = this.scene.add.text(panelX + 20, panelY + yOffset, '游戏时间: 0.0s', {
            fontSize: '14px',
            color: '#ffffff'
        });
        
        yOffset += 25;
        this.uiTexts.currentCycle = this.scene.add.text(panelX + 20, panelY + yOffset, '当前周期: 1', {
            fontSize: '14px',
            color: '#ffffff'
        });
        
        yOffset += 25;
        this.uiTexts.activePlayer = this.scene.add.text(panelX + 20, panelY + yOffset, '活跃玩家: 无', {
            fontSize: '14px',
            color: '#ffffff'
        });
        
        yOffset += 25;
        this.uiTexts.priorityHolder = this.scene.add.text(panelX + 20, panelY + yOffset, '优先权: 无', {
            fontSize: '14px',
            color: '#ffffff'
        });
        
        // 冷却状态
        yOffset += 40;
        this.createStatusSection(panelX, panelY, yOffset, '❄️ 冷却状态');
        
        yOffset += 40;
        this.uiTexts.playerCooldown = this.scene.add.text(panelX + 20, panelY + yOffset, '玩家冷却: 0.0s', {
            fontSize: '14px',
            color: '#ffffff'
        });
        
        yOffset += 25;
        this.uiTexts.opponentCooldown = this.scene.add.text(panelX + 20, panelY + yOffset, '对手冷却: 0.0s', {
            fontSize: '14px',
            color: '#ffffff'
        });
        
        // 战场信息
        yOffset += 40;
        this.createStatusSection(panelX, panelY, yOffset, '⚔️ 战场信息');
        
        yOffset += 40;
        this.uiTexts.playerHandCount = this.scene.add.text(panelX + 20, panelY + yOffset, '手牌数量: 0', {
            fontSize: '14px',
            color: '#ffffff'
        });
        
        yOffset += 25;
        this.uiTexts.battlefieldCards = this.scene.add.text(panelX + 20, panelY + yOffset, '场上卡牌: 0', {
            fontSize: '14px',
            color: '#ffffff'
        });
        
        // 操作按钮区域
        yOffset += 80;
        this.createActionButtons(panelX, panelY, yOffset);
        
        // 键盘快捷键说明
        yOffset += 120;
        this.createKeyboardShortcuts(panelX, panelY, yOffset);
    }

    /**
     * 创建状态区域标题
     */
    private createStatusSection(panelX: number, panelY: number, yOffset: number, title: string) {
        this.scene.add.text(panelX + 20, panelY + yOffset, title, {
            fontSize: '16px',
            color: '#00ffff',
            fontStyle: 'bold'
        });
        
        // 分隔线
        const line = this.scene.add.graphics();
        line.lineStyle(1, 0x00ffff, 0.5);
        line.moveTo(panelX + 20, panelY + yOffset + 25);
        line.lineTo(panelX + 280, panelY + yOffset + 25);
        line.strokePath();
    }

    /**
     * 创建操作按钮
     */
    private createActionButtons(panelX: number, panelY: number, yOffset: number) {
        // 手动抽牌按钮
        this.createCyberpunkButton(panelX + 20, panelY + yOffset, '手动抽牌', 0x00ff88, () => {
            this.scene.events.emit('drawCard');
        });
        
        // 使用神煞按钮
        this.createCyberpunkButton(panelX + 170, panelY + yOffset, '使用神煞', 0xff6600, () => {
            this.scene.events.emit('useSpecialAbility');
        });
        
        // 释放优先权按钮
        this.createCyberpunkButton(panelX + 20, panelY + yOffset + 40, '释放优先权', 0x6600ff, () => {
            this.scene.events.emit('releasePriority');
        });
    }

    /**
     * 创建键盘快捷键说明
     */
    private createKeyboardShortcuts(panelX: number, panelY: number, yOffset: number) {
        this.scene.add.text(panelX + 20, panelY + yOffset, '⌨️ 键盘快捷键', {
            fontSize: '16px',
            color: '#00ffff',
            fontStyle: 'bold'
        });
        
        const shortcuts = [
            'D - 手动抽牌',
            'S - 使用神煞',
            'R - 释放优先权',
            'ESC - 关闭面板'
        ];
        
        shortcuts.forEach((shortcut, index) => {
            this.scene.add.text(panelX + 20, panelY + yOffset + 30 + index * 20, shortcut, {
                fontSize: '12px',
                color: '#cccccc'
            });
        });
    }

    /**
     * 创建右侧操作面板
     */
    private createRightActionPanel(width: number, height: number) {
        const panelWidth = 320;
        const panelHeight = height - 40;
        const panelX = width - panelWidth - 10;
        const panelY = 20;
        
        // 创建面板背景
        const panel = this.createCyberpunkPanel(panelX, panelY, panelWidth, panelHeight, 0xff6600, 0.08);
        
        // 面板标题
        const title = this.scene.add.text(panelX + 20, panelY + 20, '📖 即时系统操作指南', {
            fontSize: '18px',
            color: '#ff8800',
            fontStyle: 'bold'
        });
        
        // 基础操作
        let yOffset = 60;
        this.createGuideSection(panelX, panelY, yOffset, '🎯 基础操作');
        
        yOffset += 40;
        const basicOperations = [
            '• 双方同时进行抽卡和出牌',
            '• 先打出卡牌的玩家获得优先权',
            '• 拥有优先权时可使用神煞能力',
            '• 使用神煞后进入5秒冷却期'
        ];
        
        basicOperations.forEach((operation, index) => {
            this.scene.add.text(panelX + 20, panelY + yOffset + index * 20, operation, {
                fontSize: '12px',
                color: '#ffffff'
            });
        });
        
        // 高级特性
        yOffset += 120;
        this.createGuideSection(panelX, panelY, yOffset, '⚡ 高级特性');
        
        yOffset += 40;
        const advancedFeatures = [
            '• 每3秒自动抽卡',
            '• 每10秒为一个周期',
            '• 公共卡池定期更新',
            '• 实时竞争优先权系统'
        ];
        
        advancedFeatures.forEach((feature, index) => {
            this.scene.add.text(panelX + 20, panelY + yOffset + index * 20, feature, {
                fontSize: '12px',
                color: '#ffffff'
            });
        });
        
        // 策略提示
        yOffset += 120;
        this.createGuideSection(panelX, panelY, yOffset, '🧠 即时策略');
        
        yOffset += 40;
        const strategies = [
            '• 时机很重要：抢先出牌获得主动权',
            '• 冷却期管理：合理使用神煞能力',
            '• 手牌管理：保持足够的选择余地',
            '• 观察对手：预判对手行动时机'
        ];
        
        strategies.forEach((strategy, index) => {
            this.scene.add.text(panelX + 20, panelY + yOffset + index * 20, strategy, {
                fontSize: '11px',
                color: '#cccccc'
            });
        });
    }

    /**
     * 创建指南区域标题
     */
    private createGuideSection(panelX: number, panelY: number, yOffset: number, title: string) {
        this.scene.add.text(panelX + 20, panelY + yOffset, title, {
            fontSize: '16px',
            color: '#ff8800',
            fontStyle: 'bold'
        });
        
        // 分隔线
        const line = this.scene.add.graphics();
        line.lineStyle(1, 0xff8800, 0.5);
        line.moveTo(panelX + 20, panelY + yOffset + 25);
        line.lineTo(panelX + 280, panelY + yOffset + 25);
        line.strokePath();
    }

    /**
     * 创建底部指南栏
     */
    private createBottomGuideBar(width: number, height: number) {
        const barHeight = 18;
        const barY = height - barHeight;
        
        // 背景
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.3);
        bg.fillRect(0, barY, width, barHeight);
        
        // 指南文本
        const guideText = this.scene.add.text(width / 2, barY + barHeight / 2, 
            '💡 提示：这是即时卡牌系统，双方同时操作！先出牌者获得优先权 | 使用神煞后有5秒冷却期', {
            fontSize: '11px',
            color: '#88ffff'
        });
        guideText.setOrigin(0.5);
    }

    /**
     * 创建赛博朋克面板
     */
    private createCyberpunkPanel(x: number, y: number, width: number, height: number, accentColor: number, alpha: number = 0.85) {
        const panel = this.scene.add.graphics();
        
        // 主面板背景
        panel.fillStyle(0x0a0a0f, alpha);
        panel.fillRect(x, y, width, height);
        
        // 渐变边框效果
        panel.lineStyle(2, accentColor, 0.3);
        panel.strokeRect(x, y, width, height);
        
        panel.lineStyle(1, accentColor, 0.6);
        panel.strokeRect(x + 1, y + 1, width - 2, height - 2);
        
        // 角落装饰
        this.createCornerDecorations(panel, x, y, width, height, accentColor);
        
        return panel;
    }

    /**
     * 创建角落装饰
     */
    private createCornerDecorations(graphics: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number, color: number) {
        const cornerSize = 15;
        
        graphics.lineStyle(2, color, 0.8);
        
        // 四个角的L型装饰
        const corners = [
            { x: x, y: y, xDir: 1, yDir: 1 },           // 左上
            { x: x + width, y: y, xDir: -1, yDir: 1 },   // 右上
            { x: x, y: y + height, xDir: 1, yDir: -1 },  // 左下
            { x: x + width, y: y + height, xDir: -1, yDir: -1 } // 右下
        ];
        
        corners.forEach(corner => {
            graphics.moveTo(corner.x, corner.y);
            graphics.lineTo(corner.x + cornerSize * corner.xDir, corner.y);
            graphics.moveTo(corner.x, corner.y);
            graphics.lineTo(corner.x, corner.y + cornerSize * corner.yDir);
        });
        
        graphics.strokePath();
    }

    /**
     * 创建赛博朋克按钮
     */
    private createCyberpunkButton(x: number, y: number, text: string, color: number, onClick: () => void) {
        const buttonWidth = 120;
        const buttonHeight = 30;
        
        // 按钮背景
        const buttonBg = this.scene.add.graphics();
        buttonBg.fillStyle(color, 0.2);
        buttonBg.fillRect(x, y, buttonWidth, buttonHeight);
        
        buttonBg.lineStyle(2, color, 0.8);
        buttonBg.strokeRect(x, y, buttonWidth, buttonHeight);
        
        // 按钮文本
        const buttonText = this.scene.add.text(x + buttonWidth / 2, y + buttonHeight / 2, text, {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5);
        
        // 创建交互区域
        const buttonZone = this.scene.add.zone(x + buttonWidth / 2, y + buttonHeight / 2, buttonWidth, buttonHeight);
        buttonZone.setInteractive();
        
        // 悬停效果
        buttonZone.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(color, 0.4);
            buttonBg.fillRect(x, y, buttonWidth, buttonHeight);
            buttonBg.lineStyle(2, color, 1.0);
            buttonBg.strokeRect(x, y, buttonWidth, buttonHeight);
        });
        
        buttonZone.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(color, 0.2);
            buttonBg.fillRect(x, y, buttonWidth, buttonHeight);
            buttonBg.lineStyle(2, color, 0.8);
            buttonBg.strokeRect(x, y, buttonWidth, buttonHeight);
        });
        
        // 点击事件
        buttonZone.on('pointerdown', onClick);
        
        return { bg: buttonBg, text: buttonText, zone: buttonZone };
    }

    /**
     * 更新UI状态
     */
    updateUI() {
        // 更新实时状态
        if (this.uiTexts.gameTime) {
            this.uiTexts.gameTime.setText(`游戏时间: ${this.gameState.gameTime.toFixed(1)}s`);
        }
        
        if (this.uiTexts.currentCycle) {
            this.uiTexts.currentCycle.setText(`当前周期: ${this.gameState.currentCycle}`);
        }
        
        if (this.uiTexts.activePlayer) {
            const activeText = this.gameState.activePlayer === 'none' ? '无' : 
                             this.gameState.activePlayer === 'player' ? '玩家' : '对手';
            this.uiTexts.activePlayer.setText(`活跃玩家: ${activeText}`);
        }
        
        if (this.uiTexts.priorityHolder) {
            const priorityText = this.gameState.priorityHolder === 'none' ? '无' : 
                                this.gameState.priorityHolder === 'player' ? '玩家' : '对手';
            this.uiTexts.priorityHolder.setText(`优先权: ${priorityText}`);
        }
        
        // 更新冷却状态
        if (this.uiTexts.playerCooldown) {
            this.uiTexts.playerCooldown.setText(`玩家冷却: ${this.gameState.playerCooldownRemaining.toFixed(1)}s`);
        }
        
        if (this.uiTexts.opponentCooldown) {
            this.uiTexts.opponentCooldown.setText(`对手冷却: ${this.gameState.opponentCooldownRemaining.toFixed(1)}s`);
        }
    }

    /**
     * 显示消息
     */
    showMessage(text: string, type: 'success' | 'warning' | 'error' = 'success') {
        const colors = {
            success: '#00ff88',
            warning: '#ffaa00',
            error: '#ff4444'
        };
        
        const message = this.scene.add.text(this.scene.cameras.main.centerX, 100, text, {
            fontSize: '16px',
            color: colors[type],
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: {
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
            },
            align: 'center'
        });
        
        message.setOrigin(0.5);
        message.setDepth(1000); // 最高层级
        
        // 消息动画
        message.setAlpha(0);
        this.scene.tweens.add({
            targets: message,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // 自动消失
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: message,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => message.destroy()
            });
        });
    }
}