/**
 * 吉星吉神类神煞数据
 */

import type { ShenshaRecord } from '../types/ShenshaTypes';

export const auspiciousShenshaData: ShenshaRecord[] = [
    {
        id: 'tianyiguiren',
        name: '天乙贵人',
        callsign: 'GUARDIAN-01',
        classification: 'S级护卫型战术单位',
        designation: 'GUARDIAN-01·S级护卫型战术单位',
        psyProfile: '极度忠诚，正义执行模式，危机响应优先级MAX',
        motto: '系统在线，保护协议已激活！',
        dossier: '第一代守护者型战术AI，配备量子金甲防护系统和神经链接银枪武装。具备最高级别的保护协议，可预测并消除99.7%的威胁因子。',
        category: '吉星吉神',
        rarity: '⭐⭐⭐',
        element: '金',
        power: 4,
        type: 'auspicious',
        lookupMethod: '甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢虎马',
        meaning: '最高吉星，避免厄运，遇事有人帮，遇危难有人救',
        gameEffect: '【金甲护主】保护型，可护身免疫',
        detailedLookup: {
            method: '按日干查地支',
            conditions: [
                '甲戊见丑未', '乙己见子申', '丙丁见亥酉', 
                '壬癸见巳卯', '庚辛见寅午'
            ]
        }
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
        category: '吉星吉神',
        rarity: '⭐⭐',
        element: '水',
        power: 2,
        type: 'auspicious',
        lookupMethod: '甲乙巳午报君知，丙戊申宫丁己鸡，庚猪辛鼠壬逢虎，癸人见卯入云梯',
        meaning: '聪明擅艺，主聪明过人，利考试学术文艺',
        gameEffect: '【墨羽点化】智慧型，提升学习效率',
        detailedLookup: {
            method: '按日干查地支',
            conditions: [
                '甲见巳', '乙见午', '丙见申', '丁见酉', '戊见申',
                '己见酉', '庚见亥', '辛见子', '壬见寅', '癸见卯'
            ]
        }
    },
    {
        id: 'lushen',
        name: '禄神',
        callsign: 'TREASURY-88',
        classification: 'B级资源型管理单位',
        designation: 'TREASURY-88·B级资源型管理单位',
        psyProfile: '极度稳定，资源管理专精，长期收益优化算法，风险规避MAX',
        motto: '稳定收益，持续复利，财富增长协议启动。',
        dossier: '财富管理型AI，配备金库量子算盘和资源分配算法。专门负责经济系统优化和长期财富积累，确保资源供应链稳定运转。',
        category: '吉星吉神',
        rarity: '⭐',
        element: '土',
        power: 1,
        type: 'auspicious',
        lookupMethod: '甲禄寅、乙禄卯、丙戊禄巳、丁己禄午、庚禄申、辛禄酉、壬禄亥、癸禄子',
        meaning: '主福禄财运，象征稳定收入地位',
        gameEffect: '【金库福泽】稳定收益，自动获得资源',
        detailedLookup: {
            method: '按日干查专属地支',
            conditions: [
                '甲见寅', '乙见卯', '丙见巳', '戊见巳', '丁见午',
                '己见午', '庚见申', '辛见酉', '壬见亥', '癸见子'
            ]
        }
    },
    {
        id: 'taijiguiren',
        name: '太极贵人',
        callsign: 'MATRIX-00',
        classification: 'SSS级平衡型核心单位',
        designation: 'MATRIX-00·SSS级平衡型核心单位',
        psyProfile: '超量子思维，宇宙级平衡算法，阴阳逆转协议，现实重构能力',
        motto: '平衡即真理，逆转即新生，系统重构中...',
        dossier: '宇宙平衡核心AI，搭载太极平衡矩阵和阴阳二元处理器。具备现实逆转能力，可重新编译宇宙基本法则，是最接近创世神的存在。',
        category: '吉星吉神',
        rarity: '⭐⭐⭐',
        element: '特殊',
        power: 4,
        type: 'auspicious',
        lookupMethod: '甲乙子午，丙丁卯酉，戊己辰戌，庚辛丑未，壬癸巳亥',
        meaning: '聪明好学，喜神秘事物如命理卜筮',
        gameEffect: '【太极逆转】阴阳转化，逆转五行关系',
        detailedLookup: {
            method: '按天干查对应地支',
            conditions: [
                '甲乙见子午', '丙丁见卯酉', '戊己见辰戌',
                '庚辛见丑未', '壬癸见巳亥'
            ]
        }
    },
    {
        id: 'sanqiguiren',
        name: '三奇贵人',
        callsign: 'TRINITY-777',
        classification: 'S级组合型战术单位',
        designation: 'TRINITY-777·S级组合型战术单位',
        psyProfile: '多重人格模式，三重并行处理，组合算法超群，连击协议专精',
        motto: '三重同步，力量聚合，组合攻击序列启动！',
        dossier: '三元融合型战术AI，内置天地人三重处理核心。能同时执行三种不同的战术模式，形成无懈可击的连击组合。',
        category: '吉星吉神',
        rarity: '⭐⭐⭐',
        element: '特殊',
        power: 3,
        type: 'auspicious',
        lookupMethod: '天上三奇甲戊庚，地上三奇乙丙丁，人中三奇壬癸辛',
        meaning: '头脑清晰，学术超群，胸怀大度，卓越领导者',
        gameEffect: '【三才合击】组合型，三连击效果',
        detailedLookup: {
            method: '三干顺排',
            conditions: [
                '甲戊庚', '乙丙丁', '壬癸辛'
            ],
            examples: ['三柱天干出现任一组合']
        }
    },
    {
        id: 'fudelaimaguiren',
        name: '福德来麻贵人',
        category: '吉星吉神',
        rarity: '⭐⭐',
        element: '金',
        power: 3,
        type: 'auspicious',
        lookupMethod: '甲戊见辰，乙己见巳，丙丁见未，壬癸见丑，庚辛见亥',
        meaning: '福德深厚，增财运，广结善缘',
        gameEffect: '福利型，每轮自动获得资源',
        detailedLookup: {
            method: '按日干查地支',
            conditions: [
                '甲戊见辰', '乙己见巳', '丙丁见未', 
                '壬癸见丑', '庚辛见亥'
            ]
        }
    },
    {
        id: 'yuedeguiren',
        name: '月德贵人',
        callsign: 'MOONLIGHT-33',
        classification: 'A级庇护型防御单位',
        designation: 'MOONLIGHT-33·A级庇护型防御单位',
        psyProfile: '温和防护型，冲突化解专精，和平协议优先，负面效果免疫',
        motto: '月光数据流启动，负面信号清除中...',
        dossier: '月光庇护型AI，配备嫦娥级防护系统和冲突化解算法。专门处理系统冲突和数据污染，能将有害代码转化为有益信息。',
        category: '吉星吉神',
        rarity: '⭐⭐⭐',
        element: '水',
        power: 3,
        type: 'auspicious',
        lookupMethod: '正月见丙，二月见甲，三月见壬，四月见庚，五月见己，六月见甲',
        meaning: '主化解灾祸，逢凶化吉，祖德庇护',
        gameEffect: '【月华庇护】庇护型，免疫一次负面效果',
        detailedLookup: {
            method: '按月支查天干',
            conditions: [
                '寅月见丙', '卯月见甲', '辰月见壬', 
                '巳月见庚', '午月见己', '未月见甲',
                '申月见壬', '酉月见丁', '戌月见甲',
                '亥月见庚', '子月见己', '丑月见丙'
            ]
        }
    },
    {
        id: 'tiandeguiren',
        name: '天德贵人',
        category: '吉星吉神',
        rarity: '⭐⭐⭐',
        element: '金',
        power: 4,
        type: 'auspicious',
        lookupMethod: '正月生见丁，二月生见申，三月生见壬，四月生见辛',
        meaning: '天德加持，灾难消除，官贵相助',
        gameEffect: '神护型，完全免疫一次致命攻击',
        detailedLookup: {
            method: '按出生月查天干地支',
            conditions: [
                '寅月见丁', '卯月见申', '辰月见壬', 
                '巳月见辛', '午月见亥', '未月见甲',
                '申月见癸', '酉月见寅', '戌月见丙',
                '亥月见乙', '子月见巳', '丑月见庚'
            ]
        }
    },
    {
        id: 'xuetang',
        name: '学堂',
        category: '吉星吉神',
        rarity: '⭐',
        element: '水',
        power: 2,
        type: 'auspicious',
        lookupMethod: '甲见巳，乙见午，丙见寅，丁见卯，戊见寅，己见卯',
        meaning: '好学聪明，学业有成，文思敏捷',
        gameEffect: '学习型，快速获得经验值',
        detailedLookup: {
            method: '按日干查地支',
            conditions: [
                '甲见巳', '乙见午', '丙见寅', '丁见卯',
                '戊见寅', '己见卯', '庚见亥', '辛见子',
                '壬见申', '癸见酉'
            ]
        }
    },
    {
        id: 'guirenxiang',
        name: '贵人相',
        category: '吉星吉神',
        rarity: '⭐⭐',
        element: '土',
        power: 2,
        type: 'auspicious',
        lookupMethod: '天乙贵人临官帝旺之位',
        meaning: '贵人多助，社交能力强，人缘极佳',
        gameEffect: '社交型，影响范围扩大',
        detailedLookup: {
            method: '贵人临旺位',
            conditions: [
                '天乙贵人在临官位', '天乙贵人在帝旺位'
            ]
        }
    },
    {
        id: 'jinyu',
        name: '金舆',
        callsign: 'GOLDEN-RIDE',
        classification: 'A级奢华型运输单位',
        designation: 'GOLDEN-RIDE·A级奢华型运输单位',
        psyProfile: '奢华配置专精，VIP服务模式，高端体验算法，财富展示协议',
        motto: '黄金载具启动，奢华体验模式开启！',
        dossier: '奢华运输型AI，配备黄金级马车系统和VIP服务算法。专门提供高端运输和财富管理服务，象征身份和地位。',
        category: '吉星吉神',
        rarity: '⭐⭐',
        element: '金',
        power: 2,
        type: 'auspicious',
        lookupMethod: '甲见辰，乙见巳，丙见未，丁见申，戊见未，己见申',
        meaning: '富贵之征，乘车坐轿，生活安逸',
        gameEffect: '【金舆财运】富贵型，增加金钱收入',
        detailedLookup: {
            method: '按日干查地支',
            conditions: [
                '甲见辰', '乙见巳', '丙见未', '丁见申',
                '戊见未', '己见申', '庚见戌', '辛见亥',
                '壬见丑', '癸见寅'
            ]
        }
    },
    {
        id: 'tianxi',
        name: '天喜',
        category: '吉星吉神',
        rarity: '⭐',
        element: '水',
        power: 1,
        type: 'auspicious',
        lookupMethod: '子见酉，丑见申，寅见未，卯见午，辰见巳，巳见辰',
        meaning: '主喜庆吉事，婚姻美满，心情愉快',
        gameEffect: '喜悦型，提升士气和效率',
        detailedLookup: {
            method: '按日支查对应地支',
            conditions: [
                '子见酉', '丑见申', '寅见未', '卯见午',
                '辰见巳', '巳见辰', '午见卯', '未见寅',
                '申见丑', '酉见子', '戌见亥', '亥见戌'
            ]
        }
    },
    {
        id: 'hongluan',
        name: '红鸾',
        callsign: 'CUPID-X1',
        classification: 'B级情感型社交单位',
        designation: 'CUPID-X1·B级情感型社交单位',
        psyProfile: '情感分析专精，社交匹配算法，关系网络优化，爱情协议启动',
        motto: '情感数据分析完成，最佳匹配已找到！',
        dossier: '情感管理型AI，配备红鸾情感分析系统和姻缘匹配算法。专门分析情感数据和人际关系，促进最佳配对组合。',
        category: '吉星吉神',
        rarity: '⭐',
        element: '火',
        power: 1,
        type: 'auspicious',
        lookupMethod: '卯见戌，辰见酉，巳见申，午见未，未见午，申见巳',
        meaning: '主婚姻感情，异性缘佳，桃花运旺',
        gameEffect: '【红鸾牵线】魅力型，增强感化效果',
        detailedLookup: {
            method: '按年支查对应地支',
            conditions: [
                '卯见戌', '辰见酉', '巳见申', '午见未',
                '未见午', '申见巳', '酉见辰', '戌见卯',
                '亥见寅', '子见丑', '丑见子', '寅见亥'
            ]
        }
    },
    {
        id: 'tianchu',
        name: '天厨',
        category: '吉星吉神',
        rarity: '⭐',
        element: '土',
        power: 1,
        type: 'auspicious',
        lookupMethod: '甲见巳，乙见午，丙见戌，丁见亥，戊见戌，己见亥',
        meaning: '主衣食无忧，健康长寿，享受美食',
        gameEffect: '营养型，持续恢复生命值',
        detailedLookup: {
            method: '按日干查地支',
            conditions: [
                '甲见巳', '乙见午', '丙见戌', '丁见亥',
                '戊见戌', '己见亥', '庚见丑', '辛见寅',
                '壬见辰', '癸见未'
            ]
        }
    }
]; 