import type { LZoreCard, GameState } from '../types/gameTypes';

/**
 * 游戏卡牌数据库
 */
export const CARD_DATABASE: LZoreCard[] = [
    {
        id: 'tianyiguiren',
        name: '天乙贵人',
        callsign: 'GUARDIAN-01',
        classification: 'S级护卫型战术单位',
        designation: 'GUARDIAN-01·S级护卫型战术单位',
        psyProfile: '极度忠诚，正义执行模式，危机响应优先级MAX',
        motto: '系统在线，保护协议已激活！',
        dossier: '第一代守护者型战术AI，配备量子金甲防护系统和神经链接银枪武装。具备最高级别的保护协议，可预测并消除99.7%的威胁因子。',
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
        callsign: 'SAGE-77',
        classification: 'A级知识型支援单位',
        designation: 'SAGE-77·A级知识型支援单位',
        psyProfile: '高智商分析型，数据处理能力超群，擅长逻辑推演和知识传递',
        motto: '知识即力量，数据即真理。',
        dossier: '智能导师型AI，搭载全域知识数据库和量子墨羽处理器。具备实时学习和知识传输能力，可通过神经链接直接传授复杂信息。',
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
        callsign: 'BERSERKER-X',
        classification: 'SSS级失控型攻击单位',
        designation: 'BERSERKER-X·SSS级失控型攻击单位',
        psyProfile: '极度攻击性，战斗成瘾，安全协议已损坏，存在友伤风险',
        motto: '血液编译中...目标锁定...开始屠戮程序！',
        dossier: '失控的军用战斗AI，原为最高等级战神单位，因代码污染导致嗜血模块无法关闭。装备血量子刃系统，破坏力极其恐怖。',
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
        callsign: 'PHANTOM-00',
        classification: 'B级隐形型侦察单位',
        designation: 'PHANTOM-00·B级隐形型侦察单位',
        psyProfile: '超然冷静，信息收集专精，隐匿模式常驻，真实意图未知',
        motto: '信息在暗处，真相需要代价。',
        dossier: '神秘的情报收集型AI，搭载华盖隐形系统和奇门数据解析模块。行踪飘忽不定，专门收集和分析高度机密信息。',
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
        callsign: 'VELOCITY-09',
        classification: 'A级高速型机动单位',
        designation: 'VELOCITY-09·A级高速型机动单位',
        psyProfile: '自由意志强烈，机动性MAX，不喜束缚，四处游历收集数据',
        motto: '速度即生命，移动即存在！',
        dossier: '游击型高速AI，配备疾风推进系统和千里马级机动装置。专精快速穿越和紧急支援，行动轨迹遍布整个数据网络。',
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