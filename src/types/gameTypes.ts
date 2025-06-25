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
 * 游戏状态接口 - 即时卡牌系统
 */
export interface GameState {
    // 实时系统相关
    gameTime: number; // 游戏总时间（秒）
    currentCycle: number; // 当前周期（每10秒一个周期）
    
    // 冷却系统
    playerCooldownRemaining: number; // 玩家冷却剩余时间（秒）
    opponentCooldownRemaining: number; // 对手冷却剩余时间（秒）
    
    // 优先权系统
    activePlayer: 'player' | 'opponent' | 'none'; // 当前拥有使用神煞权限的玩家
    priorityHolder: 'player' | 'opponent' | 'none'; // 优先权持有者（先打出卡牌的玩家）
    
    // 原有系统
    playerBazi: BaZi;
    opponentBazi: BaZi;
    playerRemainingElements: number;
    opponentRemainingElements: number;
    gamePhase: 'preparation' | 'realtime' | 'ended';
    battleFieldPositions: (LZoreCard | null)[]; // 战场位置状态
    battlefield?: { [position: number]: string }; // 战场占用状态
    
    // 实时状态
    canPlayerUseCards: boolean; // 玩家是否可以使用卡牌
    canOpponentUseCards: boolean; // 对手是否可以使用卡牌
    
    // 时停系统
    isPaused: boolean; // 游戏是否暂停（效果面板打开时时停）
    pauseReason: string; // 暂停原因
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