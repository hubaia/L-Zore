import type { LZoreCard, GameState } from '../types/gameTypes';

/**
 * 游戏卡牌数据库
 */
export const CARD_DATABASE: LZoreCard[] = [
    {
        id: 'tianyiguiren',
        name: '天乙贵人',
        personalName: '司天',
        title: '金甲元帅',
        fullName: '司天·金甲元帅',
        personality: '正义凛然，护主忠诚，遇难必救',
        catchphrase: '有本将在，主公无忧！',
        biography: '天庭第一武将，金甲银枪，威震三界。身披不坏金甲，手持诛邪银枪，是天帝座下最可信赖的护卫统领。',
        type: 'auspicious',
        element: 'metal',
        power: 4,
        rarity: '⭐⭐⭐',
        description: '最高吉星，避免厄运，遇事有人帮',
        effect: '【金甲护主】保护己方4枚元素不被中和',
        // 天乙贵人出现条件：甲戊见牛羊，乙己鼠猴乡
        // 涉及天干：甲、戊、乙、己 (4个) + 地支：丑、未、子、申 (4个) = 8个天干地支
        appearConditions: [
            {
                type: 'bazi',
                requirement: '甲戊日见丑未，乙己日见子申',
                description: '甲戊见牛羊，乙己鼠猴乡'
            }
        ],
        lifeElementGeneration: {
            baseGeneration: 8,          // 初始生命元素等于天干地支数量
            elementType: 'metal',
            generationTrigger: 'placement',
            maxPerTurn: 3
        },
        currentLifeElements: 0,
        maxLifeElements: 8          // 上限等于天干地支数量
    },
    {
        id: 'wenchang',
        name: '文昌贵人',
        personalName: '文渊',
        title: '墨羽书生',
        fullName: '文渊·墨羽书生',
        personality: '温文尔雅，博学多才，点化众生',
        catchphrase: '文以载道，智者无敌。',
        biography: '文曲星转世，手持墨羽笔，才华横溢。通晓天下文章，精通诗词歌赋，能以笔墨点化万物，启发智慧。',
        type: 'auspicious',
        element: 'water',
        power: 2,
        rarity: '⭐⭐',
        description: '聪明擅艺，主聪明过人，利考试学术',
        effect: '【墨羽点化】中和对方2枚元素，智慧加成',
        // 文昌贵人出现条件：甲乙巳午报君知
        // 涉及天干：甲、乙 (2个) + 地支：巳、午 (2个) = 4个天干地支
        appearConditions: [
            {
                type: 'bazi',
                requirement: '甲乙日见巳午',
                description: '甲乙巳午报君知'
            }
        ],
        lifeElementGeneration: {
            baseGeneration: 4,          // 初始生命元素等于天干地支数量
            elementType: 'water',
            generationTrigger: 'turn',
            maxPerTurn: 2
        },
        currentLifeElements: 0,
        maxLifeElements: 4          // 上限等于天干地支数量
    },
    {
        id: 'yangren',
        name: '羊刃',
        personalName: '血刃',
        title: '狂战魔王',
        fullName: '血刃·狂战魔王',
        personality: '嗜血好战，狂暴无双，伤敌伤己',
        catchphrase: '血刃所指，万物皆斩！',
        biography: '上古战神堕落而成，手持血色巨刃。曾是天庭战神，因嗜血成性被贬下界，但战斗力依然恐怖至极。',
        type: 'inauspicious',
        element: 'fire',
        power: 3,
        rarity: '⭐⭐⭐',
        description: '刚烈冲动，易惹是非，吉则勇猛',
        effect: '【血刃狂斩】中和对方3枚元素，可能反噬',
        // 羊刃出现条件：甲羊乙猴丙戊龙
        // 涉及天干：甲、乙、丙、戊 (4个) + 地支：未、申、辰 (3个) = 7个天干地支
        appearConditions: [
            {
                type: 'bazi',
                requirement: '甲见未，乙见申，丙戊见辰',
                description: '甲羊乙猴丙戊龙'
            }
        ],
        lifeElementGeneration: {
            baseGeneration: 7,          // 初始生命元素等于天干地支数量
            elementType: 'fire',
            generationTrigger: 'combat',
            maxPerTurn: 4
        },
        currentLifeElements: 0,
        maxLifeElements: 7          // 上限等于天干地支数量
    },
    {
        id: 'huagai',
        name: '华盖',
        personalName: '隐玄',
        title: '华盖隐士',
        fullName: '隐玄·华盖隐士',
        personality: '超脱世俗，神秘莫测，隐藏意图',
        catchphrase: '大隐隐于市，真相藏于心。',
        biography: '世外高人，精通奇门遁甲。居住在云雾缭绕的华盖山中，洞察天机而不言，知晓真相而隐匿。',
        type: 'special',
        element: 'earth',
        power: 1,
        rarity: '⭐',
        description: '性情恬淡资质聪颖，易倾向宗教艺术',
        effect: '【华盖遁术】隐藏战术意图，属性转换',
        // 华盖出现条件：寅午戌见戌，亥卯未见未
        // 涉及地支：寅、午、戌 或 亥、卯、未 (3个) = 3个天干地支
        appearConditions: [
            {
                type: 'combination',
                requirement: '三合局见库位',
                description: '寅午戌见戌，亥卯未见未'
            }
        ],
        lifeElementGeneration: {
            baseGeneration: 3,          // 初始生命元素等于天干地支数量
            elementType: 'earth',
            generationTrigger: 'condition',
            maxPerTurn: 2
        },
        currentLifeElements: 0,
        maxLifeElements: 3          // 上限等于天干地支数量
    },
    {
        id: 'yima',
        name: '驿马',
        personalName: '疾风',
        title: '游侠行者',
        fullName: '疾风·游侠行者',
        personality: '来去如风，行动迅捷，四海为家',
        catchphrase: '风来了，我也来了！',
        biography: '江湖游侠，骑着神骏千里马。仗剑走天涯，行侠仗义，踪迹遍及九州大地，行动迅捷如风。',
        type: 'special',
        element: 'fire',
        power: 2,
        rarity: '⭐⭐',
        description: '主奔波变动异地发展，吉则升迁远行',
        effect: '【疾风千里】增加行动次数，快速移动',
        // 驿马出现条件：申子辰马在寅，寅午戌马在申
        // 涉及地支：申、子、辰、寅 或 寅、午、戌、申 (4个) = 4个天干地支
        appearConditions: [
            {
                type: 'combination',
                requirement: '三合局对冲',
                description: '申子辰马在寅，寅午戌马在申'
            }
        ],
        lifeElementGeneration: {
            baseGeneration: 4,          // 初始生命元素等于天干地支数量
            elementType: 'fire',
            generationTrigger: 'turn',
            maxPerTurn: 3
        },
        currentLifeElements: 0,
        maxLifeElements: 4          // 上限等于天干地支数量
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
    COOLDOWN_DURATION: 5, // 冷却时间5秒
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