import Phaser from 'phaser';
import type { GameState } from '../types/gameTypes';
import { GAME_CONFIG } from '../constants/gameData';

/**
 * 即时系统管理器
 * 负责实时计时、冷却、优先权管理
 */
export class RealtimeSystemManager {
    private scene: Phaser.Scene;
    private gameState: GameState;
    private messageCallback: (text: string, type: 'success' | 'warning' | 'error') => void;
    private updateUICallback: () => void;
    private autoDrawCallback: () => void;

    constructor(
        scene: Phaser.Scene, 
        gameState: GameState,
        messageCallback: (text: string, type: 'success' | 'warning' | 'error') => void,
        updateUICallback: () => void,
        autoDrawCallback: () => void
    ) {
        this.scene = scene;
        this.gameState = gameState;
        this.messageCallback = messageCallback;
        this.updateUICallback = updateUICallback;
        this.autoDrawCallback = autoDrawCallback;
    }

    /**
     * 启动实时系统
     */
    startRealtimeSystem() {
        // 游戏主计时器 - 每100ms更新一次
        this.scene.time.addEvent({
            delay: 100,
            callback: this.updateRealtimeSystem,
            callbackScope: this,
            loop: true
        });
        
        // 自动抽卡计时器 - 每3秒自动抽卡
        this.scene.time.addEvent({
            delay: GAME_CONFIG.AUTO_DRAW_INTERVAL * 1000,
            callback: this.autoDrawCards,
            callbackScope: this,
            loop: true
        });
        
        this.messageCallback('🚀 即时卡牌系统启动！双方同时进行，抢先打出获得优先权！', 'success');
    }
    
    /**
     * 更新实时系统
     */
    private updateRealtimeSystem() {
        if (this.gameState.gamePhase !== 'realtime') return;
        
        // 时停检查：如果游戏暂停则跳过更新
        if (this.gameState.isPaused) return;
        
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
        this.updateUICallback();
    }
    
    /**
     * 新周期开始
     */
    private onNewCycle() {
        this.messageCallback(`🔄 第${this.gameState.currentCycle}周期开始！公共卡池更新`, 'warning');
        // 这里可以添加公共卡池更新逻辑
    }
    
    /**
     * 自动抽卡系统
     */
    private autoDrawCards() {
        if (this.gameState.gamePhase !== 'realtime') return;
        
        // 时停检查：如果游戏暂停则跳过自动抽卡
        if (this.gameState.isPaused) return;
        
        this.autoDrawCallback();
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
     * 开始玩家冷却期
     */
    startPlayerCooldown() {
        this.gameState.playerCooldownRemaining = GAME_CONFIG.COOLDOWN_DURATION;
        this.gameState.canPlayerUseCards = false;
        this.gameState.activePlayer = 'none';
        this.gameState.priorityHolder = 'none';
        
        this.messageCallback(`🕐 进入${GAME_CONFIG.COOLDOWN_DURATION}秒冷却期，无法使用卡牌！`, 'warning');
    }

    /**
     * 获得优先权
     */
    gainPriority(player: 'player' | 'opponent') {
        if (this.gameState.priorityHolder === 'none') {
            this.gameState.priorityHolder = player;
            this.gameState.activePlayer = player;
            
            if (player === 'player') {
                this.messageCallback('🏆 获得优先权！你可以使用神煞能力！', 'success');
            }
        }
    }

    /**
     * 释放优先权
     */
    releasePriority() {
        this.gameState.activePlayer = 'none';
        this.gameState.priorityHolder = 'none';
        this.messageCallback('🔄 已释放优先权，双方可以重新竞争！', 'success');
    }
}