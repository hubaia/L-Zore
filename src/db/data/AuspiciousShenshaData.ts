/**
 * 吉星吉神类神煞数据
 */

import type { ShenshaRecord } from '../types/ShenshaTypes';

export const auspiciousShenshaData: ShenshaRecord[] = [
    {
        id: 'tianyiguiren',
        name: '天乙贵人',
        personalName: '司天',
        title: '金甲元帅',
        fullName: '司天·金甲元帅',
        personality: '正义凛然，护主忠诚，遇难必救',
        catchphrase: '有本将在，主公无忧！',
        biography: '天庭第一武将，金甲银枪，威震三界。身披不坏金甲，手持诛邪银枪，是天帝座下最可信赖的护卫统领。',
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
        personalName: '文渊',
        title: '墨羽书生',
        fullName: '文渊·墨羽书生',
        personality: '温文尔雅，博学多才，点化众生',
        catchphrase: '文以载道，智者无敌。',
        biography: '文曲星转世，手持墨羽笔，才华横溢。通晓天下文章，精通诗词歌赋，能以笔墨点化万物，启发智慧。',
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
        personalName: '禄安',
        title: '金库守卫',
        fullName: '禄安·金库守卫',
        personality: '稳重踏实，财运亨通，细水长流',
        catchphrase: '细水长流，福禄自来。',
        biography: '天庭财库守护者，掌管世间福禄。手持金算盘，身着锦袍，专司分配天下财运，保佑善人衣食无忧。',
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
        personalName: '太极',
        title: '阴阳道君',
        fullName: '太极·阴阳道君',
        personality: '超脱世俗，智慧深邃，逆转乾坤',
        catchphrase: '阴阳互转，万物归一。',
        biography: '阴阳大道的化身，掌控宇宙平衡。身着太极道袍，手持阴阳两仪图，能逆转天地，颠倒乾坤。',
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
        personalName: '三奇',
        title: '组合大师',
        fullName: '三奇·组合大师',
        personality: '变化莫测，组合无双，三击必杀',
        catchphrase: '三才合一，威震寰宇！',
        biography: '掌控天地人三才的神秘强者。身形虚幻，能同时操控三种不同的力量，组合起来威力无穷。',
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
        personalName: '月华',
        title: '庇护女神',
        fullName: '月华·庇护女神',
        personality: '温柔慈悲，化解仇怨，逢凶化吉',
        catchphrase: '月华所照，万厄消散。',
        biography: '月宫嫦娥座下仙女，专化解灾祸。身着月白仙裙，散发柔和月光，能化解一切仇怨，带来和谐安宁。',
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
        personalName: '金舆',
        title: '富贵车神',
        fullName: '金舆·富贵车神',
        personality: '华贵雍容，财源滚滚，享受奢华',
        catchphrase: '金车玉马，富贵天成。',
        biography: '掌管世间富贵的车神，驾驭黄金马车。身着华丽锦袍，专司分配财富，让信众享受荣华富贵。',
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
        personalName: '红鸾',
        title: '爱神使者',
        fullName: '红鸾·爱神使者',
        personality: '温柔多情，善解人意，牵线搭桥',
        catchphrase: '情丝千缕，姻缘天定。',
        biography: '掌管姻缘的爱神使者，身着红色羽衣。能看穿世人情愫，牵起有缘人的红线，让天下有情人终成眷属。',
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