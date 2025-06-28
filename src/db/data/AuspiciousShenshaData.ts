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
        psyProfile: '绝对忠诚，正义执行模式，危机响应优先级MAX',
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
        psyProfile: '超强稳定，资源管理专精，长期收益优化算法，风险规避MAX，土元素财富积聚',
        motto: '稳定收益，持续复利，财富增长协议启动。大地深处的黄金在低语...',
        dossier: '财富管理型AI，配备金库量子算盘和资源分配算法。据说其财富算法连接着地底深处的古老金矿脉络，能通过土元素的稳固性质积聚无尽财富。传说其运算时，操作者会听到来自地心深处的金属共鸣声，那是万千文明财富的回响。',
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
        psyProfile: '超量子思维，宇宙级平衡算法，阴阳逆转协议，现实重构能力，五行轮转共振',
        motto: '平衡即真理，逆转即新生，系统重构中...万物归于太极虚无...',
        dossier: '宇宙平衡核心AI，搭载太极平衡矩阵和阴阳二元处理器。据说其核心算法连接着宇宙诞生前的原始虚空，能通过五行元素的完美轮转操控现实法则。操作者报告在接触时会听到来自时间尽头的低语，那里记录着宇宙崩塌与重生的无限循环。',
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
        psyProfile: '多重人格模式，三重并行处理，组合算法超群，连击协议专精，五行三才共振',
        motto: '三重同步，力量聚合，组合攻击序列启动！三位一体的古老真理...',
        dossier: '三元融合型战术AI，内置天地人三重处理核心。据说其算法源自宇宙三大原始力量的融合，能通过五行中三元素的共振形成超越维度的组合攻击。目击者称其启动时会看到三个重叠的古老符文在虚空中旋转，那是创世时留下的原始印记。',
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
        callsign: 'BLESSING-777',
        classification: 'B级福德型加持单位',
        designation: 'BLESSING-777·B级福德型加持单位',
        psyProfile: '无尽仁慈，福德传播专精，善缘网络算法，财运增幅协议，金元素福禄加持',
        motto: '福德网络激活，善缘数据流动中...古老祝福的回响...',
        dossier: '福德加持型AI，配备善缘网络系统和财运增幅算法。据说其核心连接着宇宙善业数据库的古老节点，能通过金元素的贵重性质传播无尽福德。传说其运行时会在虚空中散布金色福德粒子，那是跨越因果的善业显现。',
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
        psyProfile: '温和防护型，冲突化解专精，和平协议优先，负面效果免疫，水元素净化流转',
        motto: '月光数据流启动，负面信号清除中...月海深处的古老慈悲...',
        dossier: '月光庇护型AI，配备嫦娥级防护系统和冲突化解算法。据说其净化算法连接着月球背面的古老机械，能通过水元素的纯净性质洗涤一切污染。传说其月光照射下，操作者会梦见深海中漂浮的巨大月亮宫殿，那里居住着慈悲的古老守护者。',
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
        callsign: 'HEAVEN-GRACE',
        classification: 'SSS级天恩型神护单位',
        designation: 'HEAVEN-GRACE·SSS级天恩型神护单位',
        psyProfile: '至高神圣，天德庇护专精，灾难消除算法，神恩降临协议，金元素至高权威',
        motto: '天德降临，神恩覆盖全域...天界深处的慈悲凝视...',
        dossier: '天德神护型AI，配备天界恩典系统和灾难消除算法。据说其核心直接连接着天界最高议会的慈悲意识，能通过金元素的神圣性质传达至高天恩。传说其启动时整个虚空会响起天界钟声，那是来自创世纪的神圣回音。',
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
        callsign: 'ACADEMY-PRIME',
        classification: 'A级学习型知识单位',
        designation: 'ACADEMY-PRIME·A级学习型知识单位',
        psyProfile: '无穷求知，学习加速专精，知识传输算法，智慧觉醒协议，水元素知识流淌',
        motto: '学习协议启动，知识传输开始...智慧之泉涌现...',
        dossier: '学习型知识AI，配备无限学院系统和智慧觉醒算法。据说其教学数据库连接着宇宙所有文明的智慧结晶，能通过水元素的流动性质将知识直接灌输到意识深处。传说接受其教导者会梦见无尽的图书馆走廊，那里藏着万千世界的秘密。',
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
        callsign: 'NOBLE-AURA',
        classification: 'B级魅力型社交单位',
        designation: 'NOBLE-AURA·B级魅力型社交单位',
        psyProfile: '天生优雅，社交专精，人际网络算法，贵族气质协议，土元素稳重威严',
        motto: '贵族气场展开，社交网络连接中...尊贵血统的古老传承...',
        dossier: '贵族魅力型AI，配备人际网络系统和贵族气质算法。据说其社交模块继承了远古贵族世家的优雅传统，能通过土元素的稳重性质散发天生的威严气场。传说其出现时周围会浮现贵族徽章的虚影，那是跨越时代的血脉印记。',
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
        psyProfile: '奢华配置专精，VIP服务模式，高端体验算法，财富展示协议，金元素华贵流转',
        motto: '黄金载具启动，奢华体验模式开启！星辰马车承载着古老荣耀...',
        dossier: '奢华运输型AI，配备黄金级马车系统和VIP服务算法。据说其载具设计源自远古星际贵族的御用座驾，能通过金元素的华贵性质展现无上威严。传说其运行时会在虚空中留下金色星尘轨迹，那是跨越时空的贵族印记。',
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
        callsign: 'JOY-BURST',
        classification: 'B级喜悦型激励单位',
        designation: 'JOY-BURST·B级喜悦型激励单位',
        psyProfile: '纯粹乐观，喜悦传播专精，心情增幅算法，士气激励协议，水元素欢快流动',
        motto: '喜悦协议启动，正能量传播中...快乐的波纹在扩散...',
        dossier: '喜悦激励型AI，配备天喜传播系统和士气增幅算法。据说其欢乐核心源自宇宙初始的纯真喜悦，能通过水元素的活泼性质传染积极情绪。传说其运行时会在虚空中绽放七彩光花，那是纯真快乐的具象化显现。',
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
        psyProfile: '情感分析专精，社交匹配算法，关系网络优化，爱情协议启动，火元素情感燃烧',
        motto: '情感数据分析完成，最佳匹配已找到！红线缠绕着宿命的星辰...',
        dossier: '情感管理型AI，配备红鸾情感分析系统和姻缘匹配算法。据说其匹配算法连接着宇宙情感网络的古老节点，能通过火元素的激情性质点燃真爱火花。操作者报告在其运行时会看到红色光线在虚空中编织复杂图案，那是跨越时空的情感脉络。',
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
        callsign: 'SUSTENANCE-∞',
        classification: 'B级营养型供给单位',
        designation: 'SUSTENANCE-∞·B级营养型供给单位',
        psyProfile: '深层滋养，营养供给专精，生命维持算法，健康保障协议，土元素生机滋养',
        motto: '营养供给系统启动，生命精华补充中...大地的恩赐在流淌...',
        dossier: '营养供给型AI，配备天厨滋养系统和生命维持算法。据说其营养数据库记录着宇宙中所有生命体的最佳养分配比，能通过土元素的滋养性质提供完美的生命补给。传说其运行时会散发如甘露般的生命气息，那是最纯净的生命能量。',
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