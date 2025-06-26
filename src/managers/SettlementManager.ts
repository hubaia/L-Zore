import type { LZoreCard } from '../types/gameTypes';

/**
 * 结算管理器 - 处理所有伤害结算流程相关功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class SettlementManager {
    private scene: Phaser.Scene;
    private uiManager: any; // UIManager 引用
    
    constructor(scene: Phaser.Scene, uiManager: any) {
        this.scene = scene;
        this.uiManager = uiManager;
    }
    
    /**
     * 开始伤害结算流程 - 快速版本
     */
    startDamageSettlement(
        cardData: LZoreCard, 
        actionType: 'damage' | 'buff', 
        targetCount: number, 
        totalValue: number,
        gameState: any,
        callbacks: {
            checkGameEndConditions: () => boolean;
            proceedToNextPhase: (cardData: LZoreCard) => void;
        }
    ): void {
        console.log(`🎯 SettlementManager: 开始${actionType === 'damage' ? '伤害' : '增益'}结算流程`);
        
        // 显示结算开始消息
        this.uiManager.showMessage(`⚖️ ${actionType === 'damage' ? '伤害' : '增益'}结算完成！`, 'warning');
        
        // 立即开始结算特效（不延迟）
        this.playSettlementEffects(cardData, actionType, targetCount, totalValue);
        
        // 短暂延迟后检查游戏胜负
        this.scene.time.delayedCall(200, () => {
            if (!callbacks.checkGameEndConditions()) {
                // 如果游戏没有结束，快速进入下一阶段
                callbacks.proceedToNextPhase(cardData);
            }
        });
    }
    
    /**
     * 播放结算特效 - 快速版本
     */
    private playSettlementEffects(
        cardData: LZoreCard, 
        actionType: 'damage' | 'buff', 
        targetCount: number, 
        totalValue: number
    ): void {
        // 简化的结算特效，只显示消息
        const effectText = `${actionType === 'damage' ? '⚔️' : '✨'} ${totalValue}炁克 → ${targetCount}个目标`;
        this.uiManager.showMessage(effectText, actionType === 'damage' ? 'error' : 'success');
        
        // 可选：简单的屏幕闪烁效果
        const flash = this.scene.add.rectangle(
            this.scene.cameras.main.centerX, 
            this.scene.cameras.main.centerY, 
            this.scene.cameras.main.width, 
            this.scene.cameras.main.height, 
            actionType === 'damage' ? 0xff4444 : 0x44ff44, 
            0.3
        );
        flash.setDepth(999);
        
        // 快速闪烁动画
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                flash.destroy();
            }
        });
        
        console.log(`🎬 SettlementManager: 快速结算特效：${effectText}`);
    }
    
    /**
     * 检查游戏结束条件
     */
    checkGameEndConditions(gameState: any): boolean {
        if (gameState.playerRemainingElements <= 0) {
            this.onGameEnd('opponent', gameState);
            return true;
        }
        
        if (gameState.opponentRemainingElements <= 0) {
            this.onGameEnd('player', gameState);
            return true;
        }
        
        return false;
    }
    
    /**
     * 进入下一阶段
     */
    proceedToNextPhase(
        cardData: LZoreCard,
        gameState: any,
        callbacks: {
            removeUsedCard: (cardData: LZoreCard) => void;
            triggerOpponentTurn: () => void;
            updateGameStateUI: () => void;
        }
    ): void {
        // 如果游戏已结束，不继续
        if (gameState.gamePhase === 'ended') {
            return;
        }
        
        this.uiManager.showMessage(`🔄 ${cardData.name} 效果结算完毕，游戏继续`, 'success');
        
        // 移除使用过的卡牌（如果需要）
        callbacks.removeUsedCard(cardData);
        
        // 触发对手回合（如果是对战模式）
        callbacks.triggerOpponentTurn();
        
        // 更新游戏状态
        callbacks.updateGameStateUI();
    }
    
    /**
     * 游戏结束处理
     */
    private onGameEnd(winner: 'player' | 'opponent', gameState: any): void {
        gameState.gamePhase = 'ended';
        gameState.isPaused = true;
        gameState.pauseReason = '游戏结束';
        
        const winnerText = winner === 'player' ? '玩家胜利！' : '对手胜利！';
        const message = winner === 'player' 
            ? '🎉 恭喜！你成功消耗了对手的所有元素！' 
            : '💀 失败！你的元素已被全部消耗！';
            
        this.uiManager.showMessage(`${winnerText} ${message}`, winner === 'player' ? 'success' : 'error');
        
        // 3秒后显示重新开始选项
        this.scene.time.delayedCall(3000, () => {
            this.uiManager.showMessage('按R键重新开始游戏', 'success');
            
            // 监听重新开始
            this.scene.input.keyboard?.once('keydown-R', () => {
                this.restartGame(gameState);
            });
        });
    }
    
    /**
     * 重新开始游戏
     */
    private restartGame(gameState: any): void {
        console.log('🔄 SettlementManager: 游戏重新开始');
        // 这里需要调用场景的重启逻辑
        // 实际实现时需要通过回调来处理
        this.uiManager.showMessage('🔄 游戏重新开始！', 'success');
    }
    
    /**
     * 创建伤害数值显示特效
     */
    createDamageNumbers(x: number, y: number, value: number, type: 'damage' | 'heal'): void {
        const color = type === 'damage' ? '#ff4444' : '#44ff44';
        const prefix = type === 'damage' ? '-' : '+';
        
        const text = this.scene.add.text(x, y, `${prefix}${value}`, {
            fontSize: '24px',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        
        text.setOrigin(0.5);
        text.setDepth(1000);
        
        // 数值上浮动画
        this.scene.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                text.destroy();
            }
        });
    }
    
    /**
     * 创建元素中和特效
     */
    createNeutralizationEffect(card: Phaser.GameObjects.Container): void {
        // 创建粒子爆炸效果
        const particles = this.scene.add.particles(card.x, card.y, 'spark', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 300
        });
        
        // 300ms后销毁粒子系统
        this.scene.time.delayedCall(300, () => {
            particles.destroy();
        });
        
        // 卡牌震动效果
        this.scene.tweens.add({
            targets: card,
            x: card.x + 5,
            duration: 50,
            yoyo: true,
            repeat: 3,
            ease: 'Power2'
        });
    }
    
    /**
     * 计算结算优先级
     */
    calculateSettlementPriority(effects: Array<{type: string, priority: number}>): Array<{type: string, priority: number}> {
        return effects.sort((a, b) => b.priority - a.priority);
    }
} 