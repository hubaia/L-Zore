import type { LZoreCard, GameState } from '../types/gameTypes';
import { INITIAL_GAME_STATE } from '../constants/gameData';

/**
 * 游戏状态管理器 - 处理游戏状态相关功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class GameStateManager {
    private scene: Phaser.Scene;
    private gameState: GameState;
    private showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void;
    private baziCalculationManager: any; // BaziCalculationManager引用
    
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
     * 设置八字计算管理器引用
     */
    setBaziCalculationManager(manager: any): void {
        this.baziCalculationManager = manager;
    }
    
    /**
     * 更新游戏状态UI
     */
    updateGameStateUI(callbacks: {
        getPlayerHandCount: () => number;
        getPlacedCardsCount: () => number;
        getDiscardPileStatus: () => { playerDiscardCount: number; opponentDiscardCount: number };
    }): void {
        // 更新React UI数据
        const gameStateData = {
            playerHealth: this.gameState.playerRemainingElements,  // 玩家剩余元素（8枚）
            opponentHealth: this.gameState.opponentRemainingElements,  // 对手剩余元素（8枚）
            playerEnergy: this.calculatePlayerEnergy(),  // 根据八字计算能量
            currentTurn: this.gameState.currentCycle,
            playerHandCount: callbacks.getPlayerHandCount(),
            isPlayerTurn: this.gameState.canPlayerUseCards,
            battlefieldCards: callbacks.getPlacedCardsCount(),
            gameTime: this.gameState.gameTime,
            playerCooldown: this.gameState.playerCooldownRemaining,
            opponentCooldown: this.gameState.opponentCooldownRemaining,
            activePlayer: this.gameState.activePlayer,
            priorityHolder: this.gameState.priorityHolder,
            
            // 八字信息
            playerBazi: this.gameState.playerBazi,
            opponentBazi: this.gameState.opponentBazi,
            playerRemainingElements: this.gameState.playerRemainingElements,
            opponentRemainingElements: this.gameState.opponentRemainingElements,
            
            // 时停系统状态
            isPaused: this.gameState.isPaused,
            pauseReason: this.gameState.pauseReason,
            
            // 弃牌堆状态
            ...callbacks.getDiscardPileStatus()
        };

        // 发送状态更新事件给React UI
        this.scene.events.emit('gameStateUpdate', gameStateData);
    }
    
    /**
     * 检查游戏结束条件
     */
    checkGameEndConditions(): boolean {
        if (this.gameState.playerRemainingElements <= 0) {
            this.onGameEnd('opponent');
            return true;
        }
        
        if (this.gameState.opponentRemainingElements <= 0) {
            this.onGameEnd('player');
            return true;
        }
        
        return false;
    }
    
    /**
     * 游戏结束处理
     */
    onGameEnd(winner: 'player' | 'opponent'): void {
        this.gameState.gamePhase = 'ended';
        this.gameState.isPaused = true;
        this.gameState.pauseReason = '游戏结束';
        
        const winnerText = winner === 'player' ? '玩家胜利！' : '对手胜利！';
        const message = winner === 'player' 
            ? '🎉 恭喜！你成功消耗了对手的所有元素！' 
            : '💀 失败！你的元素已被全部消耗！';
            
        this.showMessage(`${winnerText} ${message}`, winner === 'player' ? 'success' : 'error');
        
        // 3秒后显示重新开始选项
        this.scene.time.delayedCall(3000, () => {
            this.showMessage('按R键重新开始游戏', 'success');
        });
    }
    
    /**
     * 重新开始游戏
     */
    restartGame(callbacks: {
        clearPlacedCards: () => void;
        clearDiscardPiles: () => void;
        clearHandCards: () => void;
        dealInitialCards: () => void;
        startRealtimeSystem: () => void;
    }): void {
        // 重置游戏状态
        Object.assign(this.gameState, INITIAL_GAME_STATE);
        this.gameState.gamePhase = 'realtime';
        this.gameState.playerRemainingElements = 8;
        this.gameState.opponentRemainingElements = 8;
        
        // 清理场景
        callbacks.clearPlacedCards();
        callbacks.clearDiscardPiles();
        callbacks.clearHandCards();
        
        // 重新发牌
        callbacks.dealInitialCards();
        
        // 重启实时系统
        callbacks.startRealtimeSystem();
        
        this.showMessage('🔄 游戏重新开始！', 'success');
    }
    
    /**
     * 进入下一阶段
     */
    proceedToNextPhase(
        cardData: LZoreCard,
        callbacks: {
            removeUsedCard: (cardData: LZoreCard) => void;
            triggerOpponentTurn: () => void;
            updateGameStateUI: () => void;
        }
    ): void {
        // 如果游戏已结束，不继续
        if (this.gameState.gamePhase === 'ended') {
            return;
        }
        
        this.showMessage(`🔄 ${cardData.name} 效果结算完毕，游戏继续`, 'success');
        
        // 移除使用过的卡牌（如果需要）
        callbacks.removeUsedCard(cardData);
        
        // 触发对手回合（如果是对战模式）
        callbacks.triggerOpponentTurn();
        
        // 更新游戏状态
        callbacks.updateGameStateUI();
    }
    
    /**
     * 应用效果到游戏状态
     */
    applyEffect(
        cardData: LZoreCard, 
        type: 'damage' | 'buff', 
        targetPosition: number,
        getPillarName: (position: number) => string
    ): boolean {
        if (type === 'damage') {
            // 对对手造成伤害 - 减少对手的剩余元素
            const damage = Math.min(cardData.power, this.gameState.opponentRemainingElements);
            this.gameState.opponentRemainingElements -= damage;
            
            this.showMessage(`对${getPillarName(targetPosition)}造成${damage}点元素伤害！对手剩余${this.gameState.opponentRemainingElements}枚元素`, 'error');
            
            // 检查对手是否败北
            if (this.gameState.opponentRemainingElements <= 0) {
                this.onGameEnd('player');
                return true; // 游戏结束
            }
            
        } else if (type === 'buff') {
            // 为己方增益 - 恢复玩家的剩余元素（不超过8枚）
            const heal = Math.min(cardData.power, 8 - this.gameState.playerRemainingElements);
            this.gameState.playerRemainingElements += heal;
            
            this.showMessage(`为${getPillarName(targetPosition)}提供${heal}点元素增益！玩家剩余${this.gameState.playerRemainingElements}枚元素`, 'success');
        }
        
        return false; // 游戏继续
    }
    
    /**
     * 应用特殊效果
     */
    applySpecialEffect(effectName: string): boolean {
        this.showMessage(`施展特殊效果：${effectName}！`, 'warning');
        
        // 根据特殊效果名称执行不同逻辑
        switch (effectName) {
            case '全体增益':
                const playerHeal = Math.min(2, 8 - this.gameState.playerRemainingElements);
                this.gameState.playerRemainingElements += playerHeal;
                this.showMessage(`全体增益：恢复${playerHeal}枚元素！`, 'success');
                break;
                
            case '全体伤害':
                const opponentDamage = Math.min(2, this.gameState.opponentRemainingElements);
                this.gameState.opponentRemainingElements -= opponentDamage;
                this.showMessage(`全体伤害：对手失去${opponentDamage}枚元素！`, 'error');
                
                if (this.gameState.opponentRemainingElements <= 0) {
                    this.onGameEnd('player');
                    return true; // 游戏结束
                }
                break;
                
            case '中和效果':
                this.showMessage('强制触发元素中和！', 'warning');
                // 这里需要调用NeutralizationManager的强制中和功能
                break;
        }
        
        return false; // 游戏继续
    }
    
    /**
     * 根据八字计算玩家能量
     */
    private calculatePlayerEnergy(): number {
        if (this.baziCalculationManager) {
            return this.baziCalculationManager.calculatePlayerEnergy(this.gameState.playerBazi);
        }
        
        // 如果管理器未设置，返回默认值
        return 50;
    }
    
    /**
     * 获取游戏状态信息
     */
    getGameStateInfo(): {
        phase: string;
        isPaused: boolean;
        pauseReason: string;
        playerElements: number;
        opponentElements: number;
    } {
        return {
            phase: this.gameState.gamePhase,
            isPaused: this.gameState.isPaused,
            pauseReason: this.gameState.pauseReason,
            playerElements: this.gameState.playerRemainingElements,
            opponentElements: this.gameState.opponentRemainingElements
        };
    }
    
    /**
     * 设置游戏暂停状态
     */
    setPausedState(isPaused: boolean, reason: string = ''): void {
        this.gameState.isPaused = isPaused;
        this.gameState.pauseReason = reason;
    }
} 