import type { LZoreCard } from '../types/gameTypes';

/**
 * React事件管理器 - 处理React UI与Phaser之间的事件通信
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class ReactEventManager {
    private scene: Phaser.Scene;
    private showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void;
    private updateGameStateUI: () => void;
    private checkElementNeutralization: () => void;
    private moveToDiscardPile: (card: Phaser.GameObjects.Container) => void;
    private closeEffectPanel: () => void;
    private startDamageSettlement: (cardData: LZoreCard, actionType: 'damage' | 'buff', targetCount: number, totalValue: number) => void;
    private onGameEnd: (winner: 'player' | 'opponent') => void;
    private gameState: any;
    private isEffectPanelOpen: boolean = false;
    private getEffectPanelStatus: () => boolean;
    private setEffectPanelStatus: (status: boolean) => void;
    
    // 添加执行锁，防止重复执行
    private isExecutingEffect: boolean = false;
    
    constructor(
        scene: Phaser.Scene,
        callbacks: {
            showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void;
            updateGameStateUI: () => void;
            checkElementNeutralization: () => void;
            moveToDiscardPile: (card: Phaser.GameObjects.Container) => void;
            closeEffectPanel: () => void;
            startDamageSettlement: (cardData: LZoreCard, actionType: 'damage' | 'buff', targetCount: number, totalValue: number) => void;
            onGameEnd: (winner: 'player' | 'opponent') => void;
            getGameState: () => any;
            getEffectPanelStatus: () => boolean;
            setEffectPanelStatus: (status: boolean) => void;
        }
    ) {
        this.scene = scene;
        this.showMessage = callbacks.showMessage;
        this.updateGameStateUI = callbacks.updateGameStateUI;
        this.checkElementNeutralization = callbacks.checkElementNeutralization;
        this.moveToDiscardPile = callbacks.moveToDiscardPile;
        this.closeEffectPanel = callbacks.closeEffectPanel;
        this.startDamageSettlement = callbacks.startDamageSettlement;
        this.onGameEnd = callbacks.onGameEnd;
        this.gameState = callbacks.getGameState();
        
        // 获取效果面板状态的引用 - 改为实时获取
        this.getEffectPanelStatus = callbacks.getEffectPanelStatus;
        this.setEffectPanelStatus = callbacks.setEffectPanelStatus;
    }
    
    /**
     * 设置UI事件监听器
     */
    setupUIEventListeners(callbacks: {
        drawCard: () => void;
        useSpecialAbility: () => void;
        releasePriority: () => void;
    }): void {
        // 监听来自React UI的事件
        this.scene.events.on('drawCard', () => {
            callbacks.drawCard();
        });

        this.scene.events.on('useSpecialAbility', () => {
            callbacks.useSpecialAbility();
        });

        this.scene.events.on('releasePriority', () => {
            callbacks.releasePriority();
        });

        // 监听React发送的执行效果事件 - 使用phaser-react-ui事件系统
        this.scene.events.on('executeEffect', (data: {
            cardData: LZoreCard,
            actionType: 'damage' | 'buff',
            target: any,
            value: number
        }) => {
            this.executeEffectFromReact(data);
        });

        // 监听React发送的关闭面板事件 - 改为仅更新状态，避免双重关闭
        this.scene.events.on('effectPanelClose', () => {
            console.log('🔄 React事件管理器: 收到effectPanelClose事件，仅更新状态');
            // 不再调用closeEffectPanel，避免双重关闭
            // 只在这里同步状态即可
        });

        // 监听React发送的多目标执行效果事件 - phaser-react-ui事件处理
        this.scene.events.on('executeMultiTargetEffect', (data: {
            cardData: LZoreCard,
            actionType: 'damage' | 'buff',
            allocations: Record<string, number>,
            targets: any[]
        }) => {
            this.executeMultiTargetEffectFromReact(data);
        });
        
        // 监听主场景请求当前分配状态的事件（用于超时处理）
        this.scene.events.on('requestCurrentAllocations', (data: {
            cardData: LZoreCard,
            actionType: 'damage' | 'buff',
            targets: any[]
        }) => {
            console.log('📝 收到请求当前分配状态的事件，转发给React UI');
            // 将请求转发给React UI组件
            this.scene.events.emit('requestCurrentAllocationsFromUI', data);
        });
    }
    
    /**
     * 执行来自React的单目标效果
     */
    private executeEffectFromReact(data: {
        cardData: LZoreCard,
        actionType: 'damage' | 'buff',
        target: any,
        value: number
    }): void {
        const { cardData, actionType, target, value } = data;
        
        if (target.type === 'fieldCard') {
            // 对场上神煞卡的效果
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
                
                this.showMessage(`${cardData.name} 以${value}炁克元素中和了 ${targetCardData.name}！`, 'success');
                
                // 延迟后移入弃牌堆
                this.scene.time.delayedCall(1500, () => {
                    this.moveToDiscardPile(card);
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
                
                this.showMessage(`${cardData.name} 以${value}炁克元素强化了 ${targetCardData.name}！`, 'success');
                
                // 移除发光效果
                this.scene.time.delayedCall(3000, () => {
                    glowEffect.destroy();
                });
            }
        } else if (target.type === 'bazi') {
            // 对本命八字的效果
            const { pillarIndex, pillarName } = target.data;
            
            if (actionType === 'damage') {
                // 对对手本命八字造成伤害
                const actualDamage = Math.min(value, this.gameState.opponentRemainingElements);
                this.gameState.opponentRemainingElements -= actualDamage;
                
                this.showMessage(`${cardData.name} 以${actualDamage}炁克元素攻击了${pillarName}！对手剩余${this.gameState.opponentRemainingElements}枚元素`, 'error');
                
                if (this.gameState.opponentRemainingElements <= 0) {
                    this.onGameEnd('player');
                    return;
                }
            } else {
                // 对己方本命八字增益
                const actualHeal = Math.min(value, 8 - this.gameState.playerRemainingElements);
                this.gameState.playerRemainingElements += actualHeal;
                
                this.showMessage(`${cardData.name} 以${actualHeal}炁克元素增益了${pillarName}！玩家剩余${this.gameState.playerRemainingElements}枚元素`, 'success');
            }
        }
        
        // 更新UI状态
        this.updateGameStateUI();
        
        // 检查是否触发元素中和
        this.checkElementNeutralization();
    }
    
    /**
     * 执行来自React的多目标效果
     */
    private executeMultiTargetEffectFromReact(data: {
        cardData: LZoreCard,
        actionType: 'damage' | 'buff',
        allocations: Record<string, number>,
        targets: any[]
    }): void {
        // 防止重复执行
        if (this.isExecutingEffect) {
            console.log('⚠️ React事件管理器: 效果正在执行中，忽略重复请求');
            return;
        }
        
        this.isExecutingEffect = true;
        
        // 🔥 关键：用户执行操作，取消15秒超时计时器
        console.log('✅ 用户执行操作，通知主场景取消超时计时器');
        this.scene.events.emit('cancelEffectPanelTimeout');
        
        const { cardData, actionType, allocations, targets } = data;
        
        console.log(`🎯 执行多目标${actionType === 'damage' ? '伤害' : '增益'}:`, allocations);
        
        // 设置一个变量来追踪是否应该进行结算流程
        let shouldProceedToSettlement = true;
        
        // 检查面板状态
        const currentPanelStatus = this.getEffectPanelStatus();
        console.log(`📊 当前面板状态: ${currentPanelStatus ? '开启' : '关闭'}`);
        
        // 延长超时保护时间，只在真正需要时触发
        const timeoutId = this.scene.time.delayedCall(3000, () => {
            if (this.getEffectPanelStatus()) {
                console.log('⏰ React事件管理器: 超时保护 - 强制关闭效果面板');
                this.closeEffectPanel();
            }
        });
        
        // 遍历所有分配，对每个目标应用效果
        Object.entries(allocations).forEach(([targetId, value]) => {
            // 根据targetId找到对应的目标
            const target = targets.find(t => t.id === targetId);
            if (!target || value <= 0) return;
            
            if (target.type === 'fieldCard') {
                // 对场上神煞卡的效果
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
                    
                    this.showMessage(`${cardData.name} 以${value}炁克元素中和了 ${targetCardData.name}！`, 'success');
                    
                    // 延迟后移入弃牌堆
                    this.scene.time.delayedCall(1500, () => {
                        this.moveToDiscardPile(card);
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
                    
                    this.showMessage(`${cardData.name} 以${value}炁克元素强化了 ${targetCardData.name}！`, 'success');
                    
                    // 移除发光效果
                    this.scene.time.delayedCall(3000, () => {
                        glowEffect.destroy();
                    });
                }
            } else if (target.type === 'bazi') {
                // 对本命八字的效果
                const { pillarIndex, pillarName } = target.data;
                
                if (actionType === 'damage') {
                    // 对对手本命八字造成伤害
                    const actualDamage = Math.min(value, this.gameState.opponentRemainingElements);
                    this.gameState.opponentRemainingElements -= actualDamage;
                    
                    this.showMessage(`${cardData.name} 以${actualDamage}炁克元素攻击了${pillarName}！对手剩余${this.gameState.opponentRemainingElements}枚元素`, 'error');
                    
                    if (this.gameState.opponentRemainingElements <= 0) {
                        shouldProceedToSettlement = false;
                        // 快速关闭面板后结束游戏
                        this.scene.time.delayedCall(200, () => {
                            this.closeEffectPanel();
                            this.scene.time.delayedCall(100, () => {
                                this.onGameEnd('player');
                            });
                        });
                        return;
                    }
                } else {
                    // 对己方本命八字增益
                    const actualHeal = Math.min(value, 8 - this.gameState.playerRemainingElements);
                    this.gameState.playerRemainingElements += actualHeal;
                    
                    this.showMessage(`${cardData.name} 以${actualHeal}炁克元素增益了${pillarName}！玩家剩余${this.gameState.playerRemainingElements}枚元素`, 'success');
                }
            }
        });
        
        // 显示多目标执行完成消息
        const targetCount = Object.keys(allocations).length;
        const totalValue = Object.values(allocations).reduce((sum, val) => sum + val, 0);
        this.showMessage(`🎯 多目标${actionType === 'damage' ? '攻击' : '增益'}完成！影响${targetCount}个目标，总计${totalValue}炁克`, 'warning');
        
        // 立即进入结算流程，避免延迟导致的重复点击问题
        if (shouldProceedToSettlement) {
            console.log('🚀 立即开始结算流程');
            
            // 取消超时保护
            timeoutId.destroy();
            
            // 立即关闭效果面板并恢复游戏状态
            this.closeEffectPanel();
            
            // 短暂延迟后进入伤害结算流程，确保面板关闭完成
            this.scene.time.delayedCall(100, () => {
                this.startDamageSettlement(cardData, actionType, targetCount, totalValue);
                
                // 结算完成后重置执行锁
                this.scene.time.delayedCall(300, () => {
                    this.isExecutingEffect = false;
                    console.log('🔓 React事件管理器: 效果执行锁已重置');
                });
            });
        } else {
            // 如果不进入结算流程，立即重置执行锁
            this.scene.time.delayedCall(100, () => {
                this.isExecutingEffect = false;
                console.log('🔓 React事件管理器: 执行锁已重置（无结算流程）');
            });
        }
        
        // 更新UI状态
        this.updateGameStateUI();
        
        // 检查是否触发元素中和
        this.checkElementNeutralization();
    }
    
    /**
     * 清理事件监听器
     */
    destroy(): void {
        this.scene.events.off('drawCard');
        this.scene.events.off('useSpecialAbility');
        this.scene.events.off('releasePriority');
        this.scene.events.off('executeEffect');
        this.scene.events.off('effectPanelClose');
        this.scene.events.off('executeMultiTargetEffect');
        this.scene.events.off('requestCurrentAllocations');
    }
} 