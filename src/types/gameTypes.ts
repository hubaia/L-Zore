/**
 * L-Zore神煞卡牌游戏类型定义
 */

/**
 * L-Zore神煞卡牌数据结构
 */
export interface LZoreCard {
    id: string;
    name: string;
    type: 'auspicious' | 'inauspicious' | 'special';
    element: 'metal' | 'wood' | 'water' | 'fire' | 'earth' | 'special';
    power: number;
    rarity: string;
    description: string;
    effect: string;
}

/**
 * 八字结构
 */
export interface BaZi {
    year: { gan: string; zhi: string };
    month: { gan: string; zhi: string };
    day: { gan: string; zhi: string };
    hour: { gan: string; zhi: string };
}

/**
 * 游戏状态接口 - 添加回合状态 
 */
export interface GameState {
    currentTurn: number;
    currentPlayer: 'player' | 'opponent'; // 当前行动方
    playerBazi: BaZi;
    opponentBazi: BaZi;
    playerRemainingElements: number;
    opponentRemainingElements: number;
    gamePhase: 'preparation' | 'battle' | 'ended';
    battleFieldPositions: (LZoreCard | null)[]; // 战场位置状态
}

/**
 * AI对手行动接口
 */
export interface OpponentAction {
    type: 'draw' | 'place' | 'activate';
    cardIndex?: number;
    position?: number;
    priority: number;
}

/**
 * React UI组件接口
 */
export interface LZorePhaserGameProps {
    onGameStateChange?: (state: GameState) => void;
    onCardPlayed?: (cardData: LZoreCard, position: number) => void;
} 