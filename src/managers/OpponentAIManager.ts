import type { LZoreCard, GameState } from '../types/gameTypes';

/**
 * 对手AI管理器 - 处理对手AI相关功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class OpponentAIManager {
    private scene: Phaser.Scene;
    private gameState: GameState;
    private showMessage: (text: string, type?: 'success' | 'warning' | 'error') => void;
    private opponentCards: LZoreCard[] = [];
    private opponentHand!: Phaser.GameObjects.Group;
    private placedCards: Phaser.GameObjects.Container[] = [];
    
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
     * 设置对手手牌组引用
     */
    setOpponentHand(opponentHand: Phaser.GameObjects.Group): void {
        this.opponentHand = opponentHand;
    }
    
    /**
     * 设置对手卡牌数据
     */
    setOpponentCards(cards: LZoreCard[]): void {
        this.opponentCards = [...cards];
    }
    
    /**
     * 设置场上卡牌引用
     */
    setPlacedCards(placedCards: Phaser.GameObjects.Container[]): void {
        this.placedCards = placedCards;
    }
    
    /**
     * 执行对手攻击
     */
    executeOpponentAttack(callbacks: {
        updateGameStateUI: () => void;
        onGameEnd: (winner: 'player' | 'opponent') => void;
    }): void {
        if (this.gameState.gamePhase === 'ended') return;
        
        // 随机选择攻击策略
        const attackStrategy = this.selectAttackStrategy();
        
        switch (attackStrategy) {
            case 'direct_attack':
                this.executeDirectAttack(callbacks);
                break;
            case 'card_play':
                this.executeCardPlay(callbacks);
                break;
            case 'defensive':
                this.executeDefensiveMove();
                break;
            default:
                this.executeRandomAction(callbacks);
        }
    }
    
    /**
     * 选择攻击策略
     */
    private selectAttackStrategy(): string {
        const playerElements = this.gameState.playerRemainingElements;
        const opponentElements = this.gameState.opponentRemainingElements;
        
        // 如果对手血量很低，采用防守策略
        if (opponentElements <= 2) {
            return 'defensive';
        }
        
        // 如果玩家血量很低，采用直接攻击
        if (playerElements <= 3) {
            return 'direct_attack';
        }
        
        // 如果有手牌，尝试出牌
        if (this.opponentHand && this.opponentHand.children.entries.length > 0) {
            return Math.random() < 0.6 ? 'card_play' : 'direct_attack';
        }
        
        return 'direct_attack';
    }
    
    /**
     * 执行直接攻击
     */
    private executeDirectAttack(callbacks: {
        updateGameStateUI: () => void;
        onGameEnd: (winner: 'player' | 'opponent') => void;
    }): void {
        const damage = Math.floor(Math.random() * 2) + 1; // 1-2点伤害
        const actualDamage = Math.min(damage, this.gameState.playerRemainingElements);
        
        this.gameState.playerRemainingElements -= actualDamage;
        
        this.showMessage(`🔥 对手发起直接攻击！造成${actualDamage}点元素伤害！`, 'error');
        this.showMessage(`💔 玩家剩余${this.gameState.playerRemainingElements}枚元素`, 'warning');
        
        // 检查玩家是否败北
        if (this.gameState.playerRemainingElements <= 0) {
            callbacks.onGameEnd('opponent');
            return;
        }
        
        callbacks.updateGameStateUI();
    }
    
    /**
     * 执行卡牌出牌
     */
    private executeCardPlay(callbacks: {
        updateGameStateUI: () => void;
        onGameEnd: (winner: 'player' | 'opponent') => void;
    }): void {
        if (!this.opponentHand || this.opponentHand.children.entries.length === 0) {
            this.executeDirectAttack(callbacks);
            return;
        }
        
        // 随机选择一张手牌
        const handCards = this.opponentHand.children.entries as Phaser.GameObjects.Container[];
        const randomIndex = Math.floor(Math.random() * handCards.length);
        const selectedCard = handCards[randomIndex];
        const cardData = selectedCard.getData('cardData') as LZoreCard;
        
        if (!cardData) {
            this.executeDirectAttack(callbacks);
            return;
        }
        
        // 执行卡牌效果
        this.executeOpponentCardEffect(cardData, callbacks);
        
        // 从手牌移除
        this.opponentHand.remove(selectedCard);
        selectedCard.destroy();
        
        this.showMessage(`🤖 对手使用了 ${cardData.name}！`, 'warning');
    }
    
    /**
     * 执行对手卡牌效果
     */
    private executeOpponentCardEffect(
        cardData: LZoreCard,
        callbacks: {
            updateGameStateUI: () => void;
            onGameEnd: (winner: 'player' | 'opponent') => void;
        }
    ): void {
        if (cardData.type === 'inauspicious') {
            // 凶神卡 - 攻击玩家
            const damage = Math.min(cardData.power, this.gameState.playerRemainingElements);
            this.gameState.playerRemainingElements -= damage;
            
            this.showMessage(`⚔️ ${cardData.name} 对玩家造成${damage}点元素伤害！`, 'error');
            
            if (this.gameState.playerRemainingElements <= 0) {
                callbacks.onGameEnd('opponent');
                return;
            }
        } else if (cardData.type === 'auspicious') {
            // 吉神卡 - 治疗对手
            const heal = Math.min(cardData.power, 8 - this.gameState.opponentRemainingElements);
            this.gameState.opponentRemainingElements += heal;
            
            this.showMessage(`✨ ${cardData.name} 为对手恢复${heal}点元素！`, 'success');
        }
        
        callbacks.updateGameStateUI();
    }
    
    /**
     * 执行防守动作
     */
    private executeDefensiveMove(): void {
        // 防守回合 - 对手不攻击，尝试恢复
        const healChance = Math.random();
        
        if (healChance < 0.3) { // 30%概率恢复1点元素
            const heal = Math.min(1, 8 - this.gameState.opponentRemainingElements);
            this.gameState.opponentRemainingElements += heal;
            
            this.showMessage(`🛡️ 对手采取防守姿态，恢复${heal}点元素！`, 'warning');
        } else {
            this.showMessage(`🛡️ 对手采取防守姿态，跳过本回合！`, 'warning');
        }
    }
    
    /**
     * 执行随机动作
     */
    private executeRandomAction(callbacks: {
        updateGameStateUI: () => void;
        onGameEnd: (winner: 'player' | 'opponent') => void;
    }): void {
        const actions = ['wait', 'weak_attack', 'power_up'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        switch (randomAction) {
            case 'wait':
                this.showMessage(`⏳ 对手在观察局势...`, 'warning');
                break;
                
            case 'weak_attack':
                const damage = 1;
                const actualDamage = Math.min(damage, this.gameState.playerRemainingElements);
                this.gameState.playerRemainingElements -= actualDamage;
                
                this.showMessage(`👊 对手发起试探性攻击，造成${actualDamage}点伤害！`, 'error');
                
                if (this.gameState.playerRemainingElements <= 0) {
                    callbacks.onGameEnd('opponent');
                    return;
                }
                break;
                
            case 'power_up':
                this.showMessage(`💪 对手正在蓄力，下次攻击将更强！`, 'warning');
                // 可以设置一个蓄力状态，影响下次攻击
                break;
        }
        
        callbacks.updateGameStateUI();
    }
    
    /**
     * 触发对手回合
     */
    triggerOpponentTurn(callbacks: {
        executeOpponentAttack: () => void;
        releasePriority: () => void;
    }): void {
        // 如果是即时战斗系统，不需要切换回合
        if (this.gameState.gamePhase === 'realtime') {
            // 给对手一个反应的机会
            this.scene.time.delayedCall(2000, () => {
                if (Math.random() < 0.4) { // 40%概率对手立即反击
                    callbacks.executeOpponentAttack();
                }
            });
        }
        
        // 释放优先权
        callbacks.releasePriority();
    }
    
    /**
     * 计算对手AI难度调整
     */
    private calculateAIDifficulty(): number {
        // 基于游戏进行时间和玩家表现调整AI难度
        const gameTime = this.gameState.gameTime || 0;
        const playerHealth = this.gameState.playerRemainingElements;
        const opponentHealth = this.gameState.opponentRemainingElements;
        
        let difficulty = 0.5; // 基础难度
        
        // 游戏时间越长，AI越聪明
        difficulty += Math.min(gameTime / 300, 0.3); // 最多增加0.3
        
        // 玩家血量越高，AI越激进
        if (playerHealth > 6) {
            difficulty += 0.2;
        }
        
        // 对手血量越低，AI越保守
        if (opponentHealth <= 3) {
            difficulty -= 0.2;
        }
        
        return Math.max(0.1, Math.min(0.9, difficulty));
    }
    
    /**
     * 智能卡牌选择
     */
    private selectBestCard(): LZoreCard | null {
        if (this.opponentCards.length === 0) return null;
        
        const difficulty = this.calculateAIDifficulty();
        
        if (difficulty < 0.3) {
            // 简单难度 - 随机选择
            return this.opponentCards[Math.floor(Math.random() * this.opponentCards.length)];
        } else if (difficulty < 0.7) {
            // 中等难度 - 基于类型选择
            const playerHealth = this.gameState.playerRemainingElements;
            
            if (playerHealth <= 3) {
                // 玩家血少时，优先选择攻击卡
                const attackCards = this.opponentCards.filter(card => card.type === 'inauspicious');
                if (attackCards.length > 0) {
                    return attackCards[Math.floor(Math.random() * attackCards.length)];
                }
            }
            
            return this.opponentCards[Math.floor(Math.random() * this.opponentCards.length)];
        } else {
            // 困难难度 - 最优选择
            return this.selectOptimalCard();
        }
    }
    
    /**
     * 选择最优卡牌
     */
    private selectOptimalCard(): LZoreCard {
        const playerHealth = this.gameState.playerRemainingElements;
        const opponentHealth = this.gameState.opponentRemainingElements;
        
        // 评估每张卡的价值
        let bestCard = this.opponentCards[0];
        let bestScore = this.evaluateCardValue(bestCard);
        
        for (let i = 1; i < this.opponentCards.length; i++) {
            const card = this.opponentCards[i];
            const score = this.evaluateCardValue(card);
            
            if (score > bestScore) {
                bestCard = card;
                bestScore = score;
            }
        }
        
        return bestCard;
    }
    
    /**
     * 评估卡牌价值
     */
    private evaluateCardValue(card: LZoreCard): number {
        let score = 0;
        
        const playerHealth = this.gameState.playerRemainingElements;
        const opponentHealth = this.gameState.opponentRemainingElements;
        
        if (card.type === 'inauspicious') {
            // 攻击卡价值评估
            score += card.power * 2; // 基础攻击力价值
            
            // 如果能击杀玩家，价值极高
            if (card.power >= playerHealth) {
                score += 100;
            }
            
            // 玩家血量越少，攻击卡价值越高
            score += (8 - playerHealth) * 5;
        } else if (card.type === 'auspicious') {
            // 治疗卡价值评估
            const healAmount = Math.min(card.power, 8 - opponentHealth);
            score += healAmount * 3;
            
            // 自身血量越少，治疗卡价值越高
            score += (8 - opponentHealth) * 4;
        }
        
        return score;
    }
    
    /**
     * 获取对手状态信息
     */
    getOpponentStatus(): {
        handCount: number;
        health: number;
        difficulty: number;
    } {
        return {
            handCount: this.opponentHand ? this.opponentHand.children.entries.length : 0,
            health: this.gameState.opponentRemainingElements,
            difficulty: this.calculateAIDifficulty()
        };
    }
} 