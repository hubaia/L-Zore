import type { LZoreCard, GameState } from '../types/gameTypes';

/**
 * 游戏卡牌数据库
 */
export const CARD_DATABASE: LZoreCard[] = [
    {
        id: 'tianyiguiren',
        name: '天乙贵人',
        type: 'auspicious',
        element: 'metal',
        power: 4,
        rarity: '⭐⭐⭐',
        description: '最高吉星，避免厄运，遇事有人帮',
        effect: '保护己方4枚元素不被中和'
    },
    {
        id: 'wenchang',
        name: '文昌贵人',
        type: 'auspicious',
        element: 'water',
        power: 2,
        rarity: '⭐⭐',
        description: '聪明擅艺，主聪明过人，利考试学术',
        effect: '中和对方2枚元素，智慧加成'
    },
    {
        id: 'yangren',
        name: '羊刃',
        type: 'inauspicious',
        element: 'fire',
        power: 3,
        rarity: '⭐⭐⭐',
        description: '刚烈冲动，易惹是非，吉则勇猛',
        effect: '中和对方3枚元素，可能反噬'
    },
    {
        id: 'huagai',
        name: '华盖',
        type: 'special',
        element: 'earth',
        power: 1,
        rarity: '⭐',
        description: '性情恬淡资质聪颖，易倾向宗教艺术',
        effect: '隐藏战术意图，属性转换'
    },
    {
        id: 'yima',
        name: '驿马',
        type: 'special',
        element: 'fire',
        power: 2,
        rarity: '⭐⭐',
        description: '主奔波变动异地发展，吉则升迁远行',
        effect: '增加行动次数，快速移动'
    }
];

/**
 * 初始游戏状态 - 即时卡牌系统
 */
export const INITIAL_GAME_STATE: GameState = {
    // 实时系统
    gameTime: 0,
    currentCycle: 1,
    
    // 冷却系统
    playerCooldownRemaining: 0,
    opponentCooldownRemaining: 0,
    
    // 优先权系统
    activePlayer: 'none',
    priorityHolder: 'none',
    
    // 原有系统
    playerBazi: {
        year: { gan: '甲', zhi: '子' },
        month: { gan: '乙', zhi: '丑' },
        day: { gan: '丙', zhi: '寅' },
        hour: { gan: '丁', zhi: '卯' }
    },
    opponentBazi: {
        year: { gan: '戊', zhi: '辰' },
        month: { gan: '己', zhi: '巳' },
        day: { gan: '庚', zhi: '午' },
        hour: { gan: '辛', zhi: '未' }
    },
    playerRemainingElements: 8,
    opponentRemainingElements: 8,
    gamePhase: 'preparation',
    battleFieldPositions: new Array(8).fill(null), // 8个位置，初始为空
    
    // 实时状态
    canPlayerUseCards: true,
    canOpponentUseCards: true,
    
    // 时停系统
    isPaused: false,
    pauseReason: ''
};

/**
 * 游戏配置常量
 */
export const GAME_CONFIG = {
    CARD_WIDTH: 120,
    CARD_HEIGHT: 180,
    GRID_SIZE: 180,
    GRID_SPACING: 200,
    INITIAL_HAND_SIZE: 5,
    MAX_ELEMENTS: 8,
    PILLAR_NAMES: ['年柱', '月柱', '日柱', '时柱'],
    
    // 即时系统配置
    CYCLE_DURATION: 10, // 每个周期10秒
    COOLDOWN_DURATION: 10, // 冷却时间10秒
    AUTO_DRAW_INTERVAL: 3, // 每3秒自动抽卡
    PRIORITY_TIMEOUT: 15 // 优先权超时时间15秒
};

/**
 * 五行属性映射
 */
export const ELEMENT_MAP: { [key: string]: string } = {
    'metal': '金',
    'wood': '木', 
    'water': '水',
    'fire': '火',
    'earth': '土',
    'special': '特'
};

/**
 * 卡牌类型颜色映射
 */
export const CARD_TYPE_COLORS: { [key: string]: number } = {
    'auspicious': 0x2ecc71, // 绿色 - 吉神
    'inauspicious': 0xe74c3c, // 红色 - 凶神
    'neutral': 0x3498db, // 蓝色 - 中性
    'special': 0xf39c12, // 黄色 - 特殊
    'default': 0x95a5a6 // 灰色 - 默认
}; 