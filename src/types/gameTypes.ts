/**
 * L-Zore神煞卡牌游戏类型定义
 */

/**
 * L-Zore神煞卡牌数据结构
 */
export interface LZoreCard {
    id: string;
    name: string;                          // 原神煞名称（保持兼容性）
    callsign?: string;                     // 呼号代码
    classification?: string;               // 分类等级
    designation?: string;                  // 完整指定代号 "callsign·classification"
    psyProfile?: string;                   // 心理档案
    motto?: string;                        // 作战座右铭
    dossier?: string;                      // 数据档案
    // 克苏鲁系扩展
    elderSign?: string;                    // 古老印记
    madnessLevel?: number;                 // 疯狂等级 (0-10)
    sanityDamage?: number;                 // 理智损伤值
    cosmicTruth?: string;                  // 宇宙真理碎片
    tentacleCount?: number;                // 触手数量
    type: 'auspicious' | 'inauspicious' | 'special';
    element: 'metal' | 'wood' | 'water' | 'fire' | 'earth' | 'special';
    power: number;
    rarity: string;
    description: string;
    effect: string;
    // 新增：神煞出现条件和生命元素系统
    appearConditions?: ShenshaCondition[]; // 神煞出现条件
    lifeElementGeneration?: LifeElementGeneration; // 生命元素生成规则
    currentLifeElements?: number; // 当前生命元素数量
    maxLifeElements?: number; // 最大生命元素容量
}

/**
 * 神煞出现条件
 */
export interface ShenshaCondition {
    type: 'bazi' | 'season' | 'element' | 'combination'; // 条件类型
    requirement: string; // 具体要求
    description: string; // 条件描述
}

/**
 * 生命元素生成规则
 */
export interface LifeElementGeneration {
    baseGeneration: number; // 基础生成量（条件满足时生成）
    elementType: 'metal' | 'wood' | 'water' | 'fire' | 'earth'; // 生成元素类型
    generationTrigger: 'turn' | 'condition' | 'placement' | 'combat'; // 生成触发条件
    maxPerTurn: number; // 每轮最大生成量
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

/**
 * 卡牌使用记录接口
 */
export interface CardUsageRecord {
    /** 记录唯一ID */
    id: string;
    /** 游戏会话ID */
    sessionId: string;
    /** 使用的卡牌信息 */
    card: LZoreCard;
    /** 使用时间戳 */
    timestamp: number;
    /** 使用时间（可读格式） */
    usageTime: string;
    /** 使用者（玩家/对手） */
    user: 'player' | 'opponent';
    /** 行动类型（伤害/增益） */
    actionType: 'damage' | 'buff' | 'special';
    /** 目标列表 */
    targets: CardUsageTarget[];
    /** 总分配数值 */
    totalValue: number;
    /** 游戏阶段 */
    gamePhase: 'preparation' | 'battle' | 'realtime' | 'ended';
    /** 玩家八字（使用时） */
    playerBazi: any;
    /** 卡牌生命元素状态 */
    lifeElementStatus: {
        current: number;
        max: number;
        elementType: string;
    };
    /** 使用结果 */
    result: {
        success: boolean;
        playerElementsAfter: number;
        opponentElementsAfter: number;
        gameEndTriggered: boolean;
        winner?: 'player' | 'opponent';
    };
    /** 特殊效果名称（如果有） */
    specialEffect?: string;
    /** 额外备注 */
    notes?: string;
}

/**
 * 卡牌使用目标接口
 */
export interface CardUsageTarget {
    /** 目标ID */
    id: string;
    /** 目标名称 */
    name: string;
    /** 目标类型 */
    type: 'fieldCard' | 'bazi' | 'pillar';
    /** 目标所有者 */
    owner: 'player' | 'opponent';
    /** 分配的数值 */
    allocatedValue: number;
    /** 目标位置（如果适用） */
    position?: number;
    /** 目标详细数据 */
    targetData?: any;
}

/**
 * 游戏会话接口
 */
export interface GameSession {
    /** 会话ID */
    id: string;
    /** 开始时间 */
    startTime: number;
    /** 结束时间 */
    endTime?: number;
    /** 持续时间（秒） */
    duration?: number;
    /** 游戏结果 */
    result?: 'player_win' | 'opponent_win' | 'ongoing';
    /** 使用的卡牌总数 */
    totalCardsUsed: number;
    /** 玩家使用的卡牌数 */
    playerCardsUsed: number;
    /** 对手使用的卡牌数 */
    opponentCardsUsed: number;
    /** 玩家初始八字 */
    playerBazi: any;
    /** 对手初始八字 */
    opponentBazi: any;
    /** 构筑数据（如果来自构筑器） */
    deckData?: LZoreCard[];
    /** 会话备注 */
    notes?: string;
}

/**
 * 历史记录统计接口
 */
export interface UsageStatistics {
    /** 总使用次数 */
    totalUsages: number;
    /** 总游戏会话数 */
    totalSessions: number;
    /** 总胜利数 */
    totalWins: number;
    /** 总失败数 */
    totalLosses: number;
    /** 胜率 */
    winRate: number;
    /** 平均每局使用卡牌数 */
    avgCardsPerSession: number;
    /** 最常使用的卡牌 */
    mostUsedCards: { card: LZoreCard; count: number }[];
    /** 最高伤害记录 */
    highestDamage: { value: number; record: CardUsageRecord };
    /** 最高增益记录 */
    highestBuff: { value: number; record: CardUsageRecord };
    /** 按卡牌类型统计 */
    byCardType: {
        auspicious: number;
        inauspicious: number;
        special: number;
    };
    /** 按时间段统计 */
    byTimePeriod: {
        today: number;
        thisWeek: number;
        thisMonth: number;
        allTime: number;
    };
} 