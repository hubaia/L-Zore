import type { LZoreCard } from '../types/gameTypes';

/**
 * 元素中和管理器 - 处理元素中和机制相关功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class NeutralizationManager {
    private scene: Phaser.Scene;
    private showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void;
    private discardPile: LZoreCard[] = [];
    
    constructor(
        scene: Phaser.Scene, 
        showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void
    ) {
        this.scene = scene;
        this.showMessage = showMessage;
    }
    
    /**
     * 检查元素中和机制
     */
    checkElementNeutralization(
        placedCards: Phaser.GameObjects.Container[],
        callbacks: {
            moveToDiscardPile: (card: Phaser.GameObjects.Container) => void;
        }
    ): void {
        // 这里实现复杂的元素中和逻辑
        // 暂时简化为随机触发，实际应该基于五行相克规则
        if (Math.random() < 0.3) { // 30%概率触发中和
            // 寻找可以中和的卡牌
            const neutralizableCards = placedCards.filter(card => {
                const cardData = card.getData('cardData');
                return cardData && !card.getData('neutralized');
            });
            
            if (neutralizableCards.length > 0) {
                const targetCard = neutralizableCards[Math.floor(Math.random() * neutralizableCards.length)];
                const cardData = targetCard.getData('cardData');
                
                // 标记为已中和
                targetCard.setData('neutralized', true);
                
                // 视觉效果：卡牌变灰
                this.applyNeutralizationVisualEffects(targetCard);
                
                this.showMessage(`⚖️ 元素中和！${cardData.name} 被中和，即将进入弃牌堆！`, 'warning');
                
                // 延迟后移入弃牌堆
                this.scene.time.delayedCall(2000, () => {
                    callbacks.moveToDiscardPile(targetCard);
                });
            }
        }
    }
    
    /**
     * 强制触发元素中和
     */
    forceElementNeutralization(
        placedCards: Phaser.GameObjects.Container[],
        callbacks: {
            moveToDiscardPile: (card: Phaser.GameObjects.Container) => void;
        }
    ): void {
        const neutralizableCards = placedCards.filter(card => {
            const cardData = card.getData('cardData');
            return cardData && !card.getData('neutralized');
        });
        
        if (neutralizableCards.length > 0) {
            const targetCard = neutralizableCards[0]; // 选择第一张卡
            const cardData = targetCard.getData('cardData');
            
            // 标记为已中和
            targetCard.setData('neutralized', true);
            
            // 视觉效果：卡牌变灰
            this.applyNeutralizationVisualEffects(targetCard);
            
            this.showMessage(`⚖️ 强制中和！${cardData.name} 被中和，即将进入弃牌堆！`, 'warning');
            
            // 延迟后移入弃牌堆
            this.scene.time.delayedCall(2000, () => {
                callbacks.moveToDiscardPile(targetCard);
            });
        }
    }
    
    /**
     * 应用中和视觉效果
     */
    private applyNeutralizationVisualEffects(targetCard: Phaser.GameObjects.Container): void {
        // 视觉效果：卡牌变灰
        targetCard.setAlpha(0.5);
        // 对容器中的所有子对象进行着色
        targetCard.list.forEach((child: any) => {
            if (child.setTint) {
                child.setTint(0x666666);
            }
        });
        
        // 添加中和特效
        this.createNeutralizationEffect(targetCard);
    }
    
    /**
     * 创建中和特效
     */
    private createNeutralizationEffect(card: Phaser.GameObjects.Container): void {
        // 创建粒子爆炸效果（如果有粒子纹理）
        try {
            const particles = this.scene.add.particles(card.x, card.y, 'particle', {
                speed: { min: 50, max: 150 },
                scale: { start: 0.5, end: 0 },
                blendMode: 'ADD',
                lifespan: 300
            });
            
            // 300ms后销毁粒子系统
            this.scene.time.delayedCall(300, () => {
                particles.destroy();
            });
        } catch (error) {
            // 如果粒子纹理不可用，使用简单的闪烁效果
            console.log('粒子效果不可用，使用简单闪烁效果');
        }
        
        // 卡牌震动效果
        this.scene.tweens.add({
            targets: card,
            x: card.x + 5,
            duration: 50,
            yoyo: true,
            repeat: 3,
            ease: 'Power2'
        });
        
        // 创建中和标识
        const neutralizeIcon = this.scene.add.text(card.x, card.y - 100, '⚖️', {
            fontSize: '24px',
            color: '#ffaa00'
        });
        neutralizeIcon.setOrigin(0.5);
        neutralizeIcon.setDepth(1000);
        
        // 图标上浮并消失
        this.scene.tweens.add({
            targets: neutralizeIcon,
            y: neutralizeIcon.y - 30,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                neutralizeIcon.destroy();
            }
        });
    }
    
    /**
     * 将卡牌移入弃牌堆
     */
    moveToDiscardPile(
        cardContainer: Phaser.GameObjects.Container,
        placedCards: Phaser.GameObjects.Container[],
        callbacks: {
            clearBattlefieldPosition: (position: number) => void;
            resetGridCellVisual: (position: number) => void;
            updateGameStateUI: () => void;
        }
    ): Phaser.GameObjects.Container[] {
        const cardData = cardContainer.getData('cardData');
        const position = cardContainer.getData('position');
        
        // 添加到弃牌堆
        this.discardPile.push(cardData);
        
        // 从战场移除
        const updatedPlacedCards = placedCards.filter(card => card !== cardContainer);
        
        // 清空战场位置状态
        if (position !== undefined && position !== null) {
            callbacks.clearBattlefieldPosition(position);
            callbacks.resetGridCellVisual(position);
        }
        
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
                this.showMessage(`${cardData.name} 已进入弃牌堆`, 'success');
                
                // 更新UI状态
                callbacks.updateGameStateUI();
            }
        });
        
        return updatedPlacedCards;
    }
    
    /**
     * 基于五行相克的中和检查（高级版本）
     */
    checkWuXingNeutralization(
        placedCards: Phaser.GameObjects.Container[],
        callbacks: {
            moveToDiscardPile: (card: Phaser.GameObjects.Container) => void;
        }
    ): void {
        // 五行相克关系：金克木，木克土，土克水，水克火，火克金
        const wuxingCounteracts: { [key: string]: string } = {
            '金': '木',
            '木': '土',
            '土': '水',
            '水': '火',
            '火': '金'
        };
        
        // 按元素分组场上的卡牌
        const cardsByElement: { [element: string]: Phaser.GameObjects.Container[] } = {};
        
        placedCards.forEach(card => {
            const cardData = card.getData('cardData');
            if (cardData && !card.getData('neutralized') && cardData.element) {
                if (!cardsByElement[cardData.element]) {
                    cardsByElement[cardData.element] = [];
                }
                cardsByElement[cardData.element].push(card);
            }
        });
        
        // 检查是否有相克关系
        Object.entries(wuxingCounteracts).forEach(([element, counterElement]) => {
            const attackingCards = cardsByElement[element];
            const defendingCards = cardsByElement[counterElement];
            
            if (attackingCards && defendingCards && attackingCards.length > 0 && defendingCards.length > 0) {
                // 发生相克，选择一张被克制的卡牌进行中和
                const targetCard = defendingCards[0];
                const cardData = targetCard.getData('cardData');
                
                // 标记为已中和
                targetCard.setData('neutralized', true);
                
                // 视觉效果
                this.applyNeutralizationVisualEffects(targetCard);
                
                this.showMessage(`⚖️ 五行相克！${element}克${counterElement}，${cardData.name} 被中和！`, 'warning');
                
                // 延迟后移入弃牌堆
                this.scene.time.delayedCall(2000, () => {
                    callbacks.moveToDiscardPile(targetCard);
                });
            }
        });
    }
    
    /**
     * 获取弃牌堆状态
     */
    getDiscardPileCount(): number {
        return this.discardPile.length;
    }
    
    /**
     * 清空弃牌堆
     */
    clearDiscardPile(): void {
        this.discardPile = [];
    }
    
    /**
     * 获取弃牌堆内容
     */
    getDiscardPileContents(): LZoreCard[] {
        return [...this.discardPile];
    }
} 