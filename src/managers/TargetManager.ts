/**
 * 目标管理器 - 处理所有目标收集和管理相关功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class TargetManager {
    private scene: Phaser.Scene;
    private placedCards: Phaser.GameObjects.Container[] = [];
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
    
    /**
     * 设置已放置的卡牌数组（依赖注入）
     */
    setPlacedCards(placedCards: Phaser.GameObjects.Container[]): void {
        this.placedCards = placedCards;
    }
    
    /**
     * 收集所有可能的目标
     */
    collectAllTargets(actionType: 'damage' | 'buff'): Array<{
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
        
        // 收集场上的神煞卡
        this.collectFieldCardTargets(actionType, targets);
        
        // 收集本命八字目标
        this.collectBaziTargets(actionType, targets);
        
        console.log(`🎯 TargetManager: 收集到${targets.length}个${actionType}目标`);
        return targets;
    }

    /**
     * 收集所有可能的目标（扩展版 - 支持更灵活的目标选择）
     */
    collectAllTargetsExtended(): Array<{
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
        
        // 收集所有场上的神煞卡（不限制己方/对手）
        this.collectAllFieldCardTargets(targets);
        
        // 收集所有八字目标（己方+对手）
        this.collectAllBaziTargets(targets);
        
        console.log(`🎯 TargetManager: 收集到${targets.length}个扩展目标`);
        return targets;
    }
    
    /**
     * 收集场上卡牌目标
     */
    private collectFieldCardTargets(
        actionType: 'damage' | 'buff', 
        targets: Array<{
            id: string,
            name: string,
            type: 'fieldCard' | 'bazi',
            owner: 'player' | 'opponent',
            data: any
        }>
    ): void {
        this.placedCards.forEach((card, index) => {
            const cardData = card.getData('cardData');
            const isPlayerCard = card.y > this.scene.cameras.main.height / 2; // 根据位置判断归属
            
            // 根据行动类型过滤目标
            if (actionType === 'damage' && isPlayerCard) return; // 伤害不能针对己方卡牌
            if (actionType === 'buff' && !isPlayerCard) return; // 增益不能针对敌方卡牌
            
            if (cardData && !card.getData('neutralized')) {
                targets.push({
                    id: `field_${index}`,
                    name: cardData.name,
                    type: 'fieldCard',
                    owner: isPlayerCard ? 'player' : 'opponent',
                    data: { card, cardData, index }
                });
            }
        });
    }

    /**
     * 收集所有场上卡牌目标（不限制行动类型）
     */
    private collectAllFieldCardTargets(
        targets: Array<{
            id: string,
            name: string,
            type: 'fieldCard' | 'bazi',
            owner: 'player' | 'opponent',
            data: any
        }>
    ): void {
        this.placedCards.forEach((card, index) => {
            const cardData = card.getData('cardData');
            const isPlayerCard = card.y > this.scene.cameras.main.height / 2; // 根据位置判断归属
            
            if (cardData && !card.getData('neutralized')) {
                targets.push({
                    id: `field_${index}`,
                    name: `${isPlayerCard ? '己方' : '对手'}${cardData.name}`,
                    type: 'fieldCard',
                    owner: isPlayerCard ? 'player' : 'opponent',
                    data: { card, cardData, index }
                });
            }
        });
    }
    
    /**
     * 收集八字目标
     */
    private collectBaziTargets(
        actionType: 'damage' | 'buff',
        targets: Array<{
            id: string,
            name: string,
            type: 'fieldCard' | 'bazi',
            owner: 'player' | 'opponent',
            data: any
        }>
    ): void {
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
    }

    /**
     * 收集所有八字目标（己方+对手）
     */
    private collectAllBaziTargets(
        targets: Array<{
            id: string,
            name: string,
            type: 'fieldCard' | 'bazi',
            owner: 'player' | 'opponent',
            data: any
        }>
    ): void {
        const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
        
        // 收集对手八字目标
        pillarNames.forEach((pillarName, index) => {
            targets.push({
                id: `opponent_bazi_${index}`,
                name: `对手${pillarName}`,
                type: 'bazi',
                owner: 'opponent',
                data: { pillarIndex: index, pillarName }
            });
        });

        // 收集己方八字目标
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
    
    /**
     * 根据目标类型收集目标
     */
    collectTargetsByType(targetType: 'fieldCard' | 'bazi' | 'all'): Array<{
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
        
        if (targetType === 'fieldCard' || targetType === 'all') {
            this.collectFieldCardTargets('damage', targets); // 收集所有场上卡牌
            this.collectFieldCardTargets('buff', targets);
        }
        
        if (targetType === 'bazi' || targetType === 'all') {
            this.collectBaziTargets('damage', targets); // 收集所有八字目标
            this.collectBaziTargets('buff', targets);
        }
        
        return targets;
    }
    
    /**
     * 根据拥有者收集目标
     */
    collectTargetsByOwner(owner: 'player' | 'opponent'): Array<{
        id: string,
        name: string,
        type: 'fieldCard' | 'bazi',
        owner: 'player' | 'opponent',
        data: any
    }> {
        const allTargets = this.collectAllTargets(owner === 'player' ? 'buff' : 'damage');
        return allTargets.filter(target => target.owner === owner);
    }
    
    /**
     * 验证目标是否有效
     */
    validateTarget(targetId: string, actionType: 'damage' | 'buff'): {
        isValid: boolean;
        target?: any;
        reason?: string;
    } {
        const allTargets = this.collectAllTargets(actionType);
        const target = allTargets.find(t => t.id === targetId);
        
        if (!target) {
            return {
                isValid: false,
                reason: '目标不存在'
            };
        }
        
        // 检查目标是否已被中和（对于场上卡牌）
        if (target.type === 'fieldCard' && target.data.card?.getData('neutralized')) {
            return {
                isValid: false,
                reason: '目标已被中和'
            };
        }
        
        // 检查行动类型是否匹配
        if (actionType === 'damage' && target.owner === 'player') {
            return {
                isValid: false,
                reason: '不能对己方目标造成伤害'
            };
        }
        
        if (actionType === 'buff' && target.owner === 'opponent') {
            return {
                isValid: false,
                reason: '不能对敌方目标进行增益'
            };
        }
        
        return {
            isValid: true,
            target
        };
    }

    /**
     * 验证目标是否有效（扩展版 - 支持更灵活的目标选择）
     */
    validateTargetExtended(targetId: string): {
        isValid: boolean;
        target?: any;
        reason?: string;
    } {
        const allTargets = this.collectAllTargetsExtended();
        const target = allTargets.find(t => t.id === targetId);
        
        if (!target) {
            return {
                isValid: false,
                reason: '目标不存在'
            };
        }
        
        // 检查目标是否已被中和（对于场上卡牌）
        if (target.type === 'fieldCard' && target.data.card?.getData('neutralized')) {
            return {
                isValid: false,
                reason: '目标已被中和'
            };
        }
        
        // 扩展版允许对任何有效目标进行操作
        return {
            isValid: true,
            target
        };
    }
    
    /**
     * 根据距离排序目标
     */
    sortTargetsByDistance(
        targets: any[], 
        sourceX: number, 
        sourceY: number
    ): any[] {
        return targets.sort((a, b) => {
            const distanceA = this.calculateDistance(sourceX, sourceY, a);
            const distanceB = this.calculateDistance(sourceX, sourceY, b);
            return distanceA - distanceB;
        });
    }
    
    /**
     * 计算到目标的距离
     */
    private calculateDistance(sourceX: number, sourceY: number, target: any): number {
        let targetX = 0;
        let targetY = 0;
        
        if (target.type === 'fieldCard' && target.data.card) {
            targetX = target.data.card.x;
            targetY = target.data.card.y;
        } else if (target.type === 'bazi') {
            // 八字目标使用固定位置
            const pillarIndex = target.data.pillarIndex;
            targetX = 200 + pillarIndex * 100;
            targetY = target.owner === 'player' ? 500 : 100;
        }
        
        return Math.sqrt(Math.pow(sourceX - targetX, 2) + Math.pow(sourceY - targetY, 2));
    }
    
    /**
     * 获取目标的视觉位置
     */
    getTargetPosition(target: any): { x: number, y: number } {
        if (target.type === 'fieldCard' && target.data.card) {
            return {
                x: target.data.card.x,
                y: target.data.card.y
            };
        } else if (target.type === 'bazi') {
            const pillarIndex = target.data.pillarIndex;
            return {
                x: 200 + pillarIndex * 100,
                y: target.owner === 'player' ? 500 : 100
            };
        }
        
        return { x: 0, y: 0 };
    }
    
    /**
     * 获取有效目标数量
     */
    getValidTargetCount(actionType: 'damage' | 'buff'): number {
        const targets = this.collectAllTargets(actionType);
        return targets.filter(target => this.validateTarget(target.id, actionType).isValid).length;
    }
    
    /**
     * 检查是否有可用目标
     */
    hasValidTargets(actionType: 'damage' | 'buff'): boolean {
        return this.getValidTargetCount(actionType) > 0;
    }
    
    /**
     * 获取最近的目标
     */
    getClosestTarget(
        sourceX: number, 
        sourceY: number, 
        actionType: 'damage' | 'buff'
    ): any | null {
        const targets = this.collectAllTargets(actionType);
        const validTargets = targets.filter(target => 
            this.validateTarget(target.id, actionType).isValid
        );
        
        if (validTargets.length === 0) return null;
        
        const sortedTargets = this.sortTargetsByDistance(validTargets, sourceX, sourceY);
        return sortedTargets[0];
    }
    
    /**
     * 批量验证目标分配
     */
    validateTargetAllocations(
        allocations: Record<string, number>,
        actionType: 'damage' | 'buff'
    ): {
        isValid: boolean;
        errors: string[];
        validAllocations: Record<string, number>;
    } {
        const errors: string[] = [];
        const validAllocations: Record<string, number> = {};
        
        Object.entries(allocations).forEach(([targetId, value]) => {
            if (value <= 0) {
                errors.push(`目标 ${targetId} 的分配值必须大于0`);
                return;
            }
            
            const validation = this.validateTarget(targetId, actionType);
            if (!validation.isValid) {
                errors.push(`目标 ${targetId} 无效: ${validation.reason}`);
                return;
            }
            
            validAllocations[targetId] = value;
        });
        
        return {
            isValid: errors.length === 0,
            errors,
            validAllocations
        };
    }
    
    /**
     * 自动分配数值到目标
     */
    autoAllocateToTargets(
        totalValue: number,
        actionType: 'damage' | 'buff',
        strategy: 'even' | 'priority' | 'random' = 'even'
    ): Record<string, number> {
        const targets = this.collectAllTargets(actionType);
        const validTargets = targets.filter(target => 
            this.validateTarget(target.id, actionType).isValid
        );
        
        if (validTargets.length === 0) return {};
        
        const allocations: Record<string, number> = {};
        
        switch (strategy) {
            case 'even':
                const evenValue = Math.floor(totalValue / validTargets.length);
                const remainder = totalValue % validTargets.length;
                
                validTargets.forEach((target, index) => {
                    allocations[target.id] = evenValue + (index < remainder ? 1 : 0);
                });
                break;
                
            case 'priority':
                // 优先分配给八字目标
                const baziTargets = validTargets.filter(t => t.type === 'bazi');
                const fieldTargets = validTargets.filter(t => t.type === 'fieldCard');
                
                let remaining = totalValue;
                [...baziTargets, ...fieldTargets].forEach(target => {
                    if (remaining > 0) {
                        const allocation = Math.min(remaining, 2);
                        allocations[target.id] = allocation;
                        remaining -= allocation;
                    }
                });
                break;
                
            case 'random':
                let randomRemaining = totalValue;
                const shuffledTargets = [...validTargets].sort(() => Math.random() - 0.5);
                
                shuffledTargets.forEach((target, index) => {
                    if (randomRemaining > 0) {
                        const maxAllocation = Math.min(randomRemaining, Math.ceil(randomRemaining / (shuffledTargets.length - index)));
                        const allocation = Math.floor(Math.random() * maxAllocation) + 1;
                        allocations[target.id] = allocation;
                        randomRemaining -= allocation;
                    }
                });
                break;
        }
        
        return allocations;
    }
} 