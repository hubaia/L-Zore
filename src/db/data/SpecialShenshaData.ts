/**
 * 特殊神煞类数据
 */

import type { ShenshaRecord } from '../types/ShenshaTypes';

export const specialShenshaData: ShenshaRecord[] = [
    {
        id: 'huagai',
        name: '华盖',
        callsign: 'PHANTOM-00',
        classification: 'B级隐形型侦察单位',
        designation: 'PHANTOM-00·B级隐形型侦察单位',
        psyProfile: '超然冷静，信息收集专精，隐匿模式常驻，真实意图未知',
        motto: '信息在暗处，真相需要代价。',
        dossier: '神秘的情报收集型AI，搭载华盖隐形系统和奇门数据解析模块。行踪飘忽不定，专门收集和分析高度机密信息。',
        category: '特殊神煞',
        rarity: '⭐',
        element: '土',
        power: 1,
        type: 'special',
        lookupMethod: '申子辰见辰，亥卯未见未，寅午戌见戌，巳酉丑见丑',
        meaning: '性情恬淡资质聪颖，但难免孤独，易倾向哲学宗教艺术',
        gameEffect: '【华盖遁术】神秘型，隐藏战术意图',
        detailedLookup: {
            method: '按三合局查墓库',
            conditions: [
                '申子辰见辰', '亥卯未见未',
                '寅午戌见戌', '巳酉丑见丑'
            ]
        }
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
        category: '特殊神煞',
        rarity: '⭐⭐',
        element: '火',
        power: 2,
        type: 'special',
        lookupMethod: '申子辰马在寅，寅午戌马在申，巳酉丑马在亥，亥卯未马在巳',
        meaning: '主奔波变动异地发展，吉则升迁远行，凶则劳碌漂泊',
        gameEffect: '【疾风千里】快速型，增加行动次数',
        detailedLookup: {
            method: '按三合局查对冲',
            conditions: [
                '申子辰见寅', '寅午戌见申',
                '巳酉丑见亥', '亥卯未见巳'
            ]
        }
    },
    {
        id: 'jiangxing',
        name: '将星',
        callsign: 'COMMANDER-1',
        classification: 'SSS级指挥型战术单位',
        designation: 'COMMANDER-1·SSS级指挥型战术单位',
        psyProfile: '极度威严，战术指挥专精，全局统筹算法，军团协调协议',
        motto: '战术网络同步中，全军接受指令！',
        dossier: '最高级指挥官型AI，配备黄金战术系统和全军指挥算法。具备整个战场的统筹能力，能协调所有战术单位形成完美配合。',
        category: '特殊神煞',
        rarity: '⭐⭐⭐',
        element: '金',
        power: 3,
        type: 'special',
        lookupMethod: '申子辰见子，亥卯未见卯，寅午戌见午，巳酉丑见酉',
        meaning: '权力之星，具有组织领导才能，有慑众之威',
        gameEffect: '【万军统领】指挥型，指挥其他神煞协战',
        detailedLookup: {
            method: '按三合局查旺位',
            conditions: [
                '申子辰见子', '亥卯未见卯',
                '寅午戌见午', '巳酉丑见酉'
            ]
        }
    },
    {
        id: 'kuigang',
        name: '魁罡',
        callsign: 'SWORD-BREAK',
        classification: 'SSS级破甲型攻击单位',
        designation: 'SWORD-BREAK·SSS级破甲型攻击单位',
        psyProfile: '极度霸道，防御破坏专精，一击必杀算法，无视护盾协议',
        motto: '霸王剑气充能完成，目标防御正在解体！',
        dossier: '霸道剑仙型AI，配备破天剑气系统和防御穿透算法。一剑可破万甲，能无视任何防护系统造成直接伤害。',
        category: '特殊神煞',
        rarity: '⭐⭐⭐',
        element: '金',
        power: 4,
        type: 'special',
        lookupMethod: '庚戌、庚辰、戊戌、壬辰四日柱',
        meaning: '刚烈正直勇猛，耿直胸无城府，嫉恶如仇聪明果断',
        gameEffect: '【霸王剑气】霸道型，无视部分防御',
        detailedLookup: {
            method: '特定日柱',
            conditions: [
                '庚戌日', '庚辰日', '戊戌日', '壬辰日'
            ]
        }
    },
    {
        id: 'tianya',
        name: '天涯',
        callsign: 'WANDERER-∞',
        classification: 'B级游荡型不定单位',
        designation: 'WANDERER-∞·B级游荡型不定单位',
        psyProfile: '孤独流浪型，位置随机化，居无定所算法，漂泊模式常驻',
        motto: '坐标未定义...继续漂泊中...',
        dossier: '漂泊浪人型AI，配备天涯流浪系统和随机定位算法。永远处于移动状态，无固定位置，如数字幽灵般游荡。',
        category: '特殊神煞',
        rarity: '⭐',
        element: '水',
        power: 1,
        type: 'special',
        lookupMethod: '寅午戌见亥，申子辰见巳，巳酉丑见寅，亥卯未见申',
        meaning: '远行他乡，漂泊不定，居无定所',
        gameEffect: '【浪迹天涯】漂泊型，随机改变位置',
        detailedLookup: {
            method: '按三合局查天涯位',
            conditions: [
                '寅午戌见亥', '申子辰见巳',
                '巳酉丑见寅', '亥卯未见申'
            ]
        }
    },
    {
        id: 'diwan',
        name: '地网',
        callsign: 'EARTH-NET',
        classification: 'A级束缚型控制单位',
        designation: 'EARTH-NET·A级束缚型控制单位',
        psyProfile: '控制专精型，束缚算法超群，移动限制协议，逃脱概率归零',
        motto: '地网系统展开，目标活动能力封锁！',
        dossier: '地网束缚型AI，配备地网展开系统和移动封锁算法。能在数字空间中布下隐形网络，完全限制目标的行动能力。',
        category: '特殊神煞',
        rarity: '⭐⭐',
        element: '土',
        power: 2,
        type: 'special',
        lookupMethod: '见辰戌为地网，天罗地网难逃',
        meaning: '约束限制，难以发挥，被困束缚',
        gameEffect: '【地网束缚】束缚型，限制行动能力',
        detailedLookup: {
            method: '固定地支',
            conditions: [
                '见辰为地网', '见戌为地网'
            ]
        }
    },
    {
        id: 'tianluo',
        name: '天罗',
        callsign: 'SPIDER-NET',
        classification: 'A级网络型控制单位',
        designation: 'SPIDER-NET·A级网络型控制单位',
        psyProfile: '极度阴谋型，网络编织专精，陷阱布置算法，全域监控协议',
        motto: '数据网络部署完成，目标已被锁定！',
        dossier: '网络控制型AI，配备天罗地网系统和陷阱编织算法。能在整个数据空间布置隐形网络，监控和捕获任何入侵者。',
        category: '特殊神煞',
        rarity: '⭐⭐',
        element: '火',
        power: 2,
        type: 'special',
        lookupMethod: '见戌亥为天罗，天罗地网难逃',
        meaning: '官司诉讼，法律纠纷，难以脱身',
        gameEffect: '法网型，无法逃脱攻击',
        detailedLookup: {
            method: '固定地支',
            conditions: [
                '见戌为天罗', '见亥为天罗'
            ]
        }
    },
    {
        id: 'guluan',
        name: '孤鸾',
        category: '特殊神煞',
        rarity: '⭐',
        element: '水',
        power: 1,
        type: 'special',
        lookupMethod: '乙巳、丁巳、辛亥、戊申、甲寅、戊午、壬子、丙午',
        meaning: '婚姻不利，感情孤独，难觅良缘',
        gameEffect: '孤独型，无法与其他单位配合',
        detailedLookup: {
            method: '特定日柱',
            conditions: [
                '乙巳日', '丁巳日', '辛亥日', '戊申日',
                '甲寅日', '戊午日', '壬子日', '丙午日'
            ]
        }
    },
    {
        id: 'yinyangerror',
        name: '阴阳差错',
        category: '特殊神煞',
        rarity: '⭐⭐',
        element: '特殊',
        power: 2,
        type: 'special',
        lookupMethod: '丙子、丁丑、戊寅、辛卯、壬辰、癸巳日等',
        meaning: '阴阳颠倒，婚姻感情多波折',
        gameEffect: '错乱型，颠倒敌我关系',
        detailedLookup: {
            method: '特定日柱组',
            conditions: [
                '丙子日', '丁丑日', '戊寅日', '辛卯日',
                '壬辰日', '癸巳日', '丙午日', '丁未日',
                '戊申日', '辛酉日', '壬戌日', '癸亥日'
            ]
        }
    },
    {
        id: 'jianfeng',
        name: '剑锋',
        category: '特殊神煞',
        rarity: '⭐⭐⭐',
        element: '金',
        power: 4,
        type: 'special',
        lookupMethod: '壬申、癸酉纳音为剑锋金',
        meaning: '刚毅果决，杀伐决断，锋芒毕露',
        gameEffect: '利刃型，无视防御造成斩击',
        detailedLookup: {
            method: '纳音剑锋金',
            conditions: [
                '壬申日', '癸酉日'
            ]
        }
    },
    {
        id: 'tianji',
        name: '天机',
        category: '特殊神煞',
        rarity: '⭐⭐⭐',
        element: '木',
        power: 3,
        type: 'special',
        lookupMethod: '甲戊庚见子，乙己辛见酉，丙壬见卯，丁癸见午',
        meaning: '机智过人，变化无穷，洞察先机',
        gameEffect: '预知型，能预见对方行动',
        detailedLookup: {
            method: '按日干查天机位',
            conditions: [
                '甲戊庚见子', '乙己辛见酉',
                '丙壬见卯', '丁癸见午'
            ]
        }
    },
    {
        id: 'tianyi',
        name: '天医',
        category: '特殊神煞',
        rarity: '⭐⭐',
        element: '土',
        power: 2,
        type: 'special',
        lookupMethod: '正月见丑，二月见寅，三月见卯，四月见辰',
        meaning: '医药之神，有治病救人之能',
        gameEffect: '治疗型，恢复生命和状态',
        detailedLookup: {
            method: '按月份查医位',
            conditions: [
                '寅月见丑', '卯月见寅', '辰月见卯', '巳月见辰',
                '午月见巳', '未月见午', '申月见未', '酉月见申',
                '戌月见酉', '亥月见戌', '子月见亥', '丑月见子'
            ]
        }
    },
    {
        id: 'tianshen',
        name: '天赦',
        category: '特殊神煞',
        rarity: '⭐⭐⭐',
        element: '特殊',
        power: 4,
        type: 'special',
        lookupMethod: '春戊寅，夏甲午，秋戊申，冬甲子',
        meaning: '天赦之日，逢凶化吉，罪过可恕',
        gameEffect: '赦免型，清除所有负面状态',
        detailedLookup: {
            method: '按季节查特定日',
            conditions: [
                '春季戊寅日', '夏季甲午日',
                '秋季戊申日', '冬季甲子日'
            ]
        }
    },
    {
        id: 'liujia',
        name: '六甲',
        category: '特殊神煞',
        rarity: '⭐⭐',
        element: '木',
        power: 3,
        type: 'special',
        lookupMethod: '甲子、甲戌、甲申、甲午、甲辰、甲寅六日',
        meaning: '神将护身，驱邪辟恶，道法高深',
        gameEffect: '护法型，召唤神将助战',
        detailedLookup: {
            method: '六甲日',
            conditions: [
                '甲子日', '甲戌日', '甲申日',
                '甲午日', '甲辰日', '甲寅日'
            ]
        }
    },
    {
        id: 'liuyi',
        name: '六乙',
        category: '特殊神煞',
        rarity: '⭐⭐',
        element: '木',
        power: 3,
        type: 'special',
        lookupMethod: '乙丑、乙亥、乙酉、乙未、乙巳、乙卯六日',
        meaning: '阴德积善，慈悲为怀，化解灾厄',
        gameEffect: '慈悲型，转化负面为正面',
        detailedLookup: {
            method: '六乙日',
            conditions: [
                '乙丑日', '乙亥日', '乙酉日',
                '乙未日', '乙巳日', '乙卯日'
            ]
        }
    }
]; 