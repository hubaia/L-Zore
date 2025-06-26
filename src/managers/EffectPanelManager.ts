import type { LZoreCard } from '../types/gameTypes';

/**
 * 效果面板管理器 - 处理所有神煞效果面板相关功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class EffectPanelManager {
    private scene: Phaser.Scene;
    private isEffectPanelOpen: boolean = false;
    private uiManager: any; // UIManager 引用
    
    constructor(scene: Phaser.Scene, uiManager: any) {
        this.scene = scene;
        this.uiManager = uiManager;
    }
    
    /**
     * 打开神煞效果面板
     */
    openEffectPanel(cardData: LZoreCard, sourceCard: Phaser.GameObjects.Container, gameState: any): void {
        if (this.isEffectPanelOpen) return;
        
        console.log('🔄 EffectPanelManager: 打开效果面板');
        this.isEffectPanelOpen = true;
        
        // ⏸️ 时停：暂停游戏时间
        gameState.isPaused = true;
        gameState.pauseReason = `正在使用 ${cardData.name} 的神煞能力`;
        
        this.uiManager.showMessage('⏸️ 时空暂停！选择神煞效果...', 'warning');
        
        // 收集目标数据
        const actionType = cardData.type === 'auspicious' ? 'buff' : 'damage';
        const targets = this.collectAllTargets(actionType);
        
        // 发送事件到React UI
        this.scene.events.emit('effectPanelOpen', {
            cardData: cardData,
            sourceCard: sourceCard,
            targets: targets
        });
    }
    
    /**
     * 关闭效果面板
     */
    closeEffectPanel(gameState: any): void {
        console.log('🔄 EffectPanelManager: 开始关闭效果面板');
        
        this.isEffectPanelOpen = false;
        
        // ▶️ 恢复游戏时间
        gameState.isPaused = false;
        gameState.pauseReason = '';
        
        this.uiManager.showMessage('▶️ 时空恢复！游戏继续...', 'success');
        
        // 通知React UI关闭面板
        console.log('🔄 EffectPanelManager: 发送effectPanelClose事件到React');
        this.scene.events.emit('effectPanelClose');
        
        console.log('🔄 EffectPanelManager: 效果面板关闭完成');
    }
    
    /**
     * 执行多目标效果
     */
    executeMultiTargetEffect(data: {
        cardData: LZoreCard,
        actionType: 'damage' | 'buff',
        allocations: Record<string, number>,
        targets: any[]
    }, gameState: any, placedCards: Phaser.GameObjects.Container[]): boolean {
        const { cardData, actionType, allocations, targets } = data;
        
        console.log(`🎯 EffectPanelManager: 执行多目标${actionType === 'damage' ? '伤害' : '增益'}:`, allocations);
        
        // 设置一个变量来追踪是否应该进行结算流程
        let shouldProceedToSettlement = true;
        
        // 快速超时保护 - 1秒后强制关闭面板
        this.scene.time.delayedCall(1000, () => {
            if (this.isEffectPanelOpen) {
                console.log('⏰ EffectPanelManager: 超时保护 - 强制关闭效果面板');
                this.closeEffectPanel(gameState);
            }
        });
        
        // 遍历所有分配，对每个目标应用效果
        Object.entries(allocations).forEach(([targetId, value]) => {
            // 根据targetId找到对应的目标
            const target = targets.find(t => t.id === targetId);
            if (!target || value <= 0) return;
            
            if (target.type === 'fieldCard') {
                this.applyFieldCardEffect(target, actionType, value, cardData, placedCards);
            } else if (target.type === 'bazi') {
                const gameEnded = this.applyBaziEffect(target, actionType, value, cardData, gameState);
                if (gameEnded) {
                    shouldProceedToSettlement = false;
                    // 快速关闭面板后结束游戏
                    this.scene.time.delayedCall(200, () => {
                        this.closeEffectPanel(gameState);
                        this.scene.time.delayedCall(100, () => {
                            this.onGameEnd('player', gameState);
                        });
                    });
                    return;
                }
            }
        });
        
        // 显示多目标执行完成消息
        const targetCount = Object.keys(allocations).length;
        const totalValue = Object.values(allocations).reduce((sum, val) => sum + val, 0);
        this.uiManager.showMessage(`🎯 多目标${actionType === 'damage' ? '攻击' : '增益'}完成！影响${targetCount}个目标，总计${totalValue}炁克`, 'warning');
        
        return shouldProceedToSettlement;
    }
    
    /**
     * 应用场上卡牌效果
     */
    private applyFieldCardEffect(
        target: any, 
        actionType: 'damage' | 'buff', 
        value: number, 
        cardData: LZoreCard,
        placedCards: Phaser.GameObjects.Container[]
    ): void {
        const { card, cardData: targetCardData } = target.data;
        
        if (actionType === 'damage') {
            // 直接中和目标神煞卡
            card.setData('neutralized', true);
            card.setAlpha(0.5);
            card.list.forEach((child: any) => {
                if (child.setTint) {
                    child.setTint(0x666666);
                }
            });
            
            this.uiManager.showMessage(`${cardData.name} 以${value}炁克元素中和了 ${targetCardData.name}！`, 'success');
            
            // 延迟后移入弃牌堆
            this.scene.time.delayedCall(1500, () => {
                this.moveToDiscardPile(card, placedCards);
            });
        } else {
            // 增益效果：强化己方神煞卡
            const glowEffect = this.scene.add.graphics();
            glowEffect.lineStyle(3, 0x00ff00, 0.8);
            glowEffect.strokeRect(card.x - 60, card.y - 90, 120, 180);
            glowEffect.setDepth(99);
            
            // 标记为已强化
            card.setData('buffed', true);
            card.setData('buffValue', value);
            
            this.uiManager.showMessage(`${cardData.name} 以${value}炁克元素强化了 ${targetCardData.name}！`, 'success');
            
            // 移除发光效果
            this.scene.time.delayedCall(3000, () => {
                glowEffect.destroy();
            });
        }
    }
    
    /**
     * 应用八字效果
     */
    private applyBaziEffect(
        target: any, 
        actionType: 'damage' | 'buff', 
        value: number, 
        cardData: LZoreCard,
        gameState: any
    ): boolean {
        const { pillarIndex, pillarName } = target.data;
        let gameEnded = false;
        
        if (actionType === 'damage') {
            // 对对手本命八字造成伤害
            const actualDamage = Math.min(value, gameState.opponentRemainingElements);
            gameState.opponentRemainingElements -= actualDamage;
            
            this.uiManager.showMessage(`${cardData.name} 以${actualDamage}炁克元素攻击了${pillarName}！对手剩余${gameState.opponentRemainingElements}枚元素`, 'error');
            
            if (gameState.opponentRemainingElements <= 0) {
                gameEnded = true;
            }
        } else {
            // 对己方本命八字增益
            const actualHeal = Math.min(value, 8 - gameState.playerRemainingElements);
            gameState.playerRemainingElements += actualHeal;
            
            this.uiManager.showMessage(`${cardData.name} 以${actualHeal}炁克元素增益了${pillarName}！玩家剩余${gameState.playerRemainingElements}枚元素`, 'success');
        }
        
        return gameEnded;
    }
    
    /**
     * 收集所有可能的目标
     */
    private collectAllTargets(actionType: 'damage' | 'buff'): Array<{
        id: string,
        name: string,
        type: 'fieldCard' | 'bazi',
        owner: 'player' | 'opponent',
        data: any
    }> {
        const targets: Array<{
            id: string,
            name: string,
            type: 'fieldCard' | 'bazi',
            owner: 'player' | 'opponent',
            data: any
        }> = [];
        
        // 这里需要从场景获取placedCards，暂时返回空数组
        // 实际使用时需要注入placedCards数据
        
        // 收集本命八字目标
        const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
        
        if (actionType === 'damage') {
            // 伤害：针对对手八字
            pillarNames.forEach((pillarName, index) => {
                targets.push({
                    id: `opponent_bazi_${index}`,
                    name: `对手${pillarName}`,
                    type: 'bazi',
                    owner: 'opponent',
                    data: { pillarIndex: index, pillarName }
                });
            });
        } else {
            // 增益：针对己方八字
            pillarNames.forEach((pillarName, index) => {
                targets.push({
                    id: `player_bazi_${index}`,
                    name: `己方${pillarName}`,
                    type: 'bazi',
                    owner: 'player',
                    data: { pillarIndex: index, pillarName }
                });
            });
        }
        
        return targets;
    }
    
    /**
     * 将卡牌移入弃牌堆
     */
    private moveToDiscardPile(cardContainer: Phaser.GameObjects.Container, placedCards: Phaser.GameObjects.Container[]): void {
        const cardData = cardContainer.getData('cardData');
        const position = cardContainer.getData('position');
        
        // 创建移入弃牌堆的动画效果
        this.scene.tweens.add({
            targets: cardContainer,
            x: 100, // 弃牌堆位置
            y: 100,
            scaleX: 0.3,
            scaleY: 0.3,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                cardContainer.destroy();
                this.uiManager.showMessage(`${cardData.name} 已进入弃牌堆`, 'success');
            }
        });
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
    }
    
    /**
     * 检查面板是否打开
     */
    isOpen(): boolean {
        return this.isEffectPanelOpen;
    }
    
    /**
     * 设置目标收集器（依赖注入）
     */
    setTargetCollector(collector: (actionType: 'damage' | 'buff') => any[]): void {
        this.collectAllTargets = collector;
    }
} 