import type { LZoreCard, GameState, ShenshaCondition, LifeElementGeneration } from '../types/gameTypes';
import { BaziCalculationManager } from './BaziCalculationManager';

/**
 * 生命元素管理器 - 处理神煞卡牌的生命元素生成和管理
 * 神煞卡牌会根据自己的出现条件自动生成生命元素
 */
export class LifeElementManager {
    private scene: Phaser.Scene;
    private gameState: GameState;
    private baziCalculationManager: BaziCalculationManager;
    private showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void;
    
    constructor(
        scene: Phaser.Scene,
        gameState: GameState,
        baziCalculationManager: BaziCalculationManager,
        showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void
    ) {
        this.scene = scene;
        this.gameState = gameState;
        this.baziCalculationManager = baziCalculationManager;
        this.showMessage = showMessage;
    }
    
    /**
     * 检查并生成卡牌的生命元素（卡牌放置时触发）
     */
    generateLifeElementsOnPlacement(cardData: LZoreCard, ownerType: 'player' | 'opponent'): number {
        if (!cardData.appearConditions || !cardData.lifeElementGeneration) {
            return 0;
        }
        
        const generation = cardData.lifeElementGeneration;
        let elementsGenerated = 0;
        
        if (generation.generationTrigger === 'placement') {
            // 检查神煞出现条件
            const bazi = ownerType === 'player' ? this.gameState.playerBazi : this.gameState.opponentBazi;
            const conditionsMet = this.checkShenshaConditions(cardData.appearConditions, bazi);
            
            if (conditionsMet.length > 0) {
                // 条件满足，初始生命元素等于上限（天干地支数量）
                elementsGenerated = cardData.maxLifeElements || 0;
                
                this.showMessage(
                    `✨ ${cardData.name} 出现条件满足！生成${elementsGenerated}枚${this.getElementName(generation.elementType)}生命元素`,
                    'success'
                );
                console.log(`🌟 ${cardData.name} 生成了${elementsGenerated}枚生命元素`);
                console.log(`📊 满足的条件:`, conditionsMet);
            } else {
                // 条件不满足，不生成生命元素
                console.log(`❌ ${cardData.name} 出现条件不满足，无法生成生命元素`);
                return 0;
            }
            
            // 更新卡牌的当前生命元素
            if (cardData.currentLifeElements !== undefined) {
                cardData.currentLifeElements += elementsGenerated;
            }
        }
        
        return elementsGenerated;
    }
    
    /**
     * 每轮生成生命元素（游戏轮次更新时触发）
     */
    generateLifeElementsPerTurn(placedCards: Phaser.GameObjects.Container[]): void {
        placedCards.forEach(cardContainer => {
            const cardData = cardContainer.getData('cardData') as LZoreCard;
            if (!cardData || !cardData.lifeElementGeneration || !cardData.appearConditions) return;
            
            const generation = cardData.lifeElementGeneration;
            if (generation.generationTrigger !== 'turn') return;
            
            // 检查神煞出现条件
            const isPlayerCard = cardContainer.y > this.scene.cameras.main.height / 2;
            const bazi = isPlayerCard ? this.gameState.playerBazi : this.gameState.opponentBazi;
            const conditionsMet = this.checkShenshaConditions(cardData.appearConditions, bazi);
            
            if (conditionsMet.length === 0) return; // 条件不满足，不生成
            
            // 条件满足，但每轮生成有限制，避免重复满额生成
            const currentElements = cardData.currentLifeElements || 0;
            const maxElements = cardData.maxLifeElements || 0;
            
            // 如果已经满额，不再生成
            if (currentElements >= maxElements) return;
            
            // 每轮最多生成到上限
            let elementsGenerated = Math.min(generation.maxPerTurn, maxElements - currentElements);
            
            if (elementsGenerated > 0) {
                cardData.currentLifeElements = currentElements + elementsGenerated;
                
                // 更新卡牌视觉效果
                this.updateCardVisualElements(cardContainer, cardData);
                
                this.showMessage(
                    `🔄 ${cardData.name} 每轮生成${elementsGenerated}枚${this.getElementName(generation.elementType)}元素`,
                    'success'
                );
            }
        });
    }
    
    /**
     * 战斗时生成生命元素（战斗发生时触发）
     */
    generateLifeElementsOnCombat(cardData: LZoreCard, ownerType: 'player' | 'opponent'): number {
        if (!cardData.lifeElementGeneration || !cardData.appearConditions || 
            cardData.lifeElementGeneration.generationTrigger !== 'combat') {
            return 0;
        }
        
        // 检查神煞出现条件
        const bazi = ownerType === 'player' ? this.gameState.playerBazi : this.gameState.opponentBazi;
        const conditionsMet = this.checkShenshaConditions(cardData.appearConditions, bazi);
        
        if (conditionsMet.length === 0) return 0; // 条件不满足，不生成
        
        // 条件满足，战斗时生成有限制
        const generation = cardData.lifeElementGeneration;
        const currentElements = cardData.currentLifeElements || 0;
        const maxElements = cardData.maxLifeElements || 0;
        
        // 如果已经满额，不再生成
        if (currentElements >= maxElements) return 0;
        
        // 战斗时最多生成到上限
        let elementsGenerated = Math.min(generation.maxPerTurn, maxElements - currentElements);
        
        if (elementsGenerated > 0) {
            cardData.currentLifeElements = currentElements + elementsGenerated;
            
            this.showMessage(
                `⚔️ ${cardData.name} 战斗中生成${elementsGenerated}枚${this.getElementName(generation.elementType)}元素！`,
                'warning'
            );
        }
        
        return elementsGenerated;
    }
    
    /**
     * 检查神煞出现条件
     */
    private checkShenshaConditions(conditions: ShenshaCondition[], bazi: any): ShenshaCondition[] {
        const satisfiedConditions: ShenshaCondition[] = [];
        
        conditions.forEach(condition => {
            let isSatisfied = false;
            
            switch (condition.type) {
                case 'bazi':
                    isSatisfied = this.checkBaziCondition(condition.requirement, bazi);
                    break;
                case 'season':
                    isSatisfied = this.checkSeasonCondition(condition.requirement, bazi);
                    break;
                case 'element':
                    isSatisfied = this.checkElementCondition(condition.requirement, bazi);
                    break;
                case 'combination':
                    isSatisfied = this.checkCombinationCondition(condition.requirement, bazi);
                    break;
            }
            
            if (isSatisfied) {
                satisfiedConditions.push(condition);
            }
        });
        
        return satisfiedConditions;
    }
    
    /**
     * 检查八字条件
     */
    private checkBaziCondition(requirement: string, bazi: any): boolean {
        // 天乙贵人：甲戊日见丑未，乙己日见子申
        if (requirement.includes('甲戊日见丑未')) {
            const dayGan = bazi.day.gan;
            if (dayGan === '甲' || dayGan === '戊') {
                return this.hasBranch(bazi, ['丑', '未']);
            }
        }
        
        if (requirement.includes('乙己日见子申')) {
            const dayGan = bazi.day.gan;
            if (dayGan === '乙' || dayGan === '己') {
                return this.hasBranch(bazi, ['子', '申']);
            }
        }
        
        // 文昌贵人：甲乙日见巳午
        if (requirement.includes('甲乙日见巳午')) {
            const dayGan = bazi.day.gan;
            if (dayGan === '甲' || dayGan === '乙') {
                return this.hasBranch(bazi, ['巳', '午']);
            }
        }
        
        // 羊刃：甲见未，乙见申，丙戊见辰
        if (requirement.includes('甲见未')) {
            return bazi.day.gan === '甲' && this.hasBranch(bazi, ['未']);
        }
        if (requirement.includes('乙见申')) {
            return bazi.day.gan === '乙' && this.hasBranch(bazi, ['申']);
        }
        if (requirement.includes('丙戊见辰')) {
            const dayGan = bazi.day.gan;
            return (dayGan === '丙' || dayGan === '戊') && this.hasBranch(bazi, ['辰']);
        }
        
        return false;
    }
    
    /**
     * 检查季节条件
     */
    private checkSeasonCondition(requirement: string, bazi: any): boolean {
        const monthBranch = bazi.month.zhi;
        
        // 春季：寅卯辰，夏季：巳午未，秋季：申酉戌，冬季：亥子丑
        if (requirement.includes('春季')) {
            return ['寅', '卯', '辰'].includes(monthBranch);
        }
        if (requirement.includes('夏季')) {
            return ['巳', '午', '未'].includes(monthBranch);
        }
        if (requirement.includes('秋季')) {
            return ['申', '酉', '戌'].includes(monthBranch);
        }
        if (requirement.includes('冬季')) {
            return ['亥', '子', '丑'].includes(monthBranch);
        }
        
        return false;
    }
    
    /**
     * 检查元素条件
     */
    private checkElementCondition(requirement: string, bazi: any): boolean {
        const elements = this.baziCalculationManager.countBaZiElements(bazi);
        
        // 例如：金元素 >= 3
        if (requirement.includes('金元素')) {
            const count = parseInt(requirement.match(/(\d+)/)?.[1] || '0');
            return elements['金'] >= count;
        }
        
        return false;
    }
    
    /**
     * 检查组合条件
     */
    private checkCombinationCondition(requirement: string, bazi: any): boolean {
        // 三合局见库位：寅午戌见戌，亥卯未见未
        if (requirement.includes('三合局见库位')) {
            const branches = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
            
            // 火局：寅午戌见戌
            if (branches.includes('寅') && branches.includes('午') && branches.includes('戌')) {
                return true;
            }
            // 木局：亥卯未见未
            if (branches.includes('亥') && branches.includes('卯') && branches.includes('未')) {
                return true;
            }
        }
        
        // 三合局对冲：申子辰马在寅，寅午戌马在申
        if (requirement.includes('三合局对冲')) {
            const branches = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
            
            // 水局配火位
            if ((branches.includes('申') || branches.includes('子') || branches.includes('辰')) && branches.includes('寅')) {
                return true;
            }
            // 火局配水位
            if ((branches.includes('寅') || branches.includes('午') || branches.includes('戌')) && branches.includes('申')) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 检查八字中是否包含特定地支
     */
    private hasBranch(bazi: any, branches: string[]): boolean {
        const allBranches = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
        return branches.some(branch => allBranches.includes(branch));
    }
    
    /**
     * 更新卡牌视觉效果，显示生命元素
     */
    private updateCardVisualElements(cardContainer: Phaser.GameObjects.Container, cardData: LZoreCard): void {
        // 查找或创建生命元素显示
        let lifeElementText = cardContainer.list.find(child => 
            child.getData && child.getData('lifeElementDisplay')
        ) as Phaser.GameObjects.Text;
        
        if (!lifeElementText) {
            lifeElementText = this.scene.add.text(0, 60, '', {
                fontSize: '12px',
                color: '#ffff00',
                fontStyle: 'bold',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: { x: 4, y: 2 }
            });
            lifeElementText.setOrigin(0.5);
            lifeElementText.setData('lifeElementDisplay', true);
            cardContainer.add(lifeElementText);
        }
        
        const current = cardData.currentLifeElements || 0;
        const max = cardData.maxLifeElements || 0;
        const elementType = cardData.lifeElementGeneration?.elementType || 'special';
        
        lifeElementText.setText(`💎${current}/${max} ${this.getElementName(elementType)}`);
        
        // 添加生命元素光效
        if (current > 0) {
            this.createLifeElementGlow(cardContainer, elementType);
        }
    }
    
    /**
     * 创建生命元素光效
     */
    private createLifeElementGlow(cardContainer: Phaser.GameObjects.Container, elementType: string): void {
        const colors = {
            'metal': 0xffd700,
            'wood': 0x00ff00,
            'water': 0x0088ff,
            'fire': 0xff4400,
            'earth': 0xffaa00
        };
        
        const color = colors[elementType as keyof typeof colors] || 0xffffff;
        
        // 创建光效
        const glow = this.scene.add.graphics();
        glow.lineStyle(2, color, 0.8);
        glow.strokeRect(-62, -92, 124, 184);
        glow.setDepth(98);
        cardContainer.add(glow);
        
        // 闪烁动画
        this.scene.tweens.add({
            targets: glow,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // 3秒后移除光效
        this.scene.time.delayedCall(3000, () => {
            if (glow && glow.active) {
                glow.destroy();
            }
        });
    }
    
    /**
     * 获取元素中文名称
     */
    private getElementName(element: string): string {
        const names = {
            'metal': '金',
            'wood': '木',
            'water': '水',
            'fire': '火',
            'earth': '土'
        };
        return names[element as keyof typeof names] || '特';
    }
    
    /**
     * 消耗生命元素（用于特殊效果）
     */
    consumeLifeElements(cardData: LZoreCard, amount: number): boolean {
        const current = cardData.currentLifeElements || 0;
        if (current >= amount) {
            cardData.currentLifeElements = current - amount;
            return true;
        }
        return false;
    }
    
    /**
     * 获取卡牌生命元素信息
     */
    getLifeElementInfo(cardData: LZoreCard): {
        current: number;
        max: number;
        elementType: string;
        canGenerate: boolean;
    } {
        return {
            current: cardData.currentLifeElements || 0,
            max: cardData.maxLifeElements || 0,
            elementType: cardData.lifeElementGeneration?.elementType || 'special',
            canGenerate: !!(cardData.appearConditions && cardData.lifeElementGeneration)
        };
    }
} 