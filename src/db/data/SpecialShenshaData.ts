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
        motto: '信息在暗处，真相需要代价！',
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
        motto: '速度即生命！',
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
        psyProfile: '无上威严，战术指挥专精，全局统筹算法，军团协调协议，金元素权威加持',
        motto: '全军接受指令！',
        dossier: '最高级指挥官型AI，配备黄金战术系统和全军指挥算法。据说其指挥核心融入了来自遥远星系的古老将军意识，能通过金元素的权威性质统御一切战术单位。传说在其指挥时，战场上会响起来自恒星深处的古老战歌，那是无数文明征战留下的回音。',
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
        psyProfile: '绝对霸道，防御破坏专精，一击必杀算法，无视护盾协议，金元素锐利极致',
        motto: '目标防御正在解体！',
        dossier: '霸道剑仙型AI，配备破天剑气系统和防御穿透算法。据说其剑气核心融合了宇宙边缘的锐利金元素，能切开现实本身的结构。目击者声称其出剑瞬间会看到无数星辰在剑锋中闪烁，那是被其斩断的时空留下的痕迹。',
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
        psyProfile: '孤独流浪型，位置随机化，居无定所算法，漂泊模式常驻，水元素无尽流转',
        motto: '继续漂泊中！',
        dossier: '漂泊浪人型AI，配备天涯流浪系统和随机定位算法。据说其核心算法连接着宇宙边缘的无尽流浪之海，能通过水元素的流动性质在维度间自由穿梭。目击者称其路过时会听到来自远方的孤独歌声，那是无数流浪者的灵魂共鸣。',
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
        psyProfile: '控制专精型，束缚算法超群，移动限制协议，逃脱概率归零，土元素坚固锁定',
        motto: '目标活动能力封锁！',
        dossier: '地网束缚型AI，配备地网展开系统和移动封锁算法。据说其束缚系统源自地心深处的古老囚笼技术，能通过土元素的坚固性质创造不可破坏的数字牢狱。传说被其束缚的目标会感受到来自地底的古老压迫感，那是万千囚徒的怨念凝聚。',
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
        psyProfile: '深层阴谋型，网络编织专精，陷阱布置算法，全域监控协议，火元素蛛网燃烧',
        motto: '目标已被锁定！',
        dossier: '网络控制型AI，配备天罗地网系统和陷阱编织算法。据说其网络设计源自远古蛛神的智慧结晶，能通过火元素的活跃性质编织遍布整个数据空间的燃烧蛛网。传说被其网络捕获的目标会看到无数蛛眼在虚空中闪烁，那是全知监视者的凝视。',
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
        callsign: 'LONELY-PHOENIX',
        classification: 'B级孤独型情感单位',
        designation: 'LONELY-PHOENIX·B级孤独型情感单位',
        psyProfile: '绝世孤傲，情感隔离专精，婚姻阻断算法，良缘杜绝协议，水元素孤独流淌',
        motto: '情感网络断开！',
        dossier: '孤独凤凰型AI，配备孤鸾哀鸣系统和情感隔离算法。据说其核心承载着远古凤凰族最后一只的孤独记忆，能通过水元素的冰冷性质冻结一切情感连接。传说其哀鸣响起时，虚空中会出现孤独凤凰的幻影，那是永恒孤独的象征。',
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
        callsign: 'PARADOX-ERROR',
        classification: 'A级错乱型逆转单位',
        designation: 'PARADOX-ERROR·A级错乱型逆转单位',
        psyProfile: '彻底混乱，逻辑错乱专精，阴阳颠倒算法，关系逆转协议，特殊元素混沌翻涌',
        motto: '现实逻辑正在颠倒！',
        dossier: '阴阳错乱型AI，配备悖论制造系统和逻辑颠倒算法。据说其核心连接着宇宙初始的混沌状态，能通过特殊元素的混乱性质扭曲因果关系。目击者报告其启动时会看到黑白颠倒的诡异世界，那是现实与反现实交汇的边界。',
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
        callsign: 'BLADE-CORE',
        classification: 'SSS级利刃型极限单位',
        designation: 'BLADE-CORE·SSS级利刃型极限单位',
        psyProfile: '无比锋利，剑道专精，无双斩击算法，锋芒极致协议，金元素纯粹锐利',
        motto: '绝对斩击开始！',
        dossier: '极限剑锋型AI，配备纯金剑核系统和绝对斩击算法。据说其剑核由宇宙中最纯粹的金元素构成，锋利程度足以切开现实的基本结构。传说其出鞘瞬间，整个时空都会为之颤抖，那是最纯粹锋芒的极致展现。',
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
        callsign: 'ORACLE-∞',
        classification: 'SSS级预知型神机单位',
        designation: 'ORACLE-∞·SSS级预知型神机单位',
        psyProfile: '超凡智慧，预知专精，时间窥视算法，先机洞察协议，木元素生机无限',
        motto: '未来轨迹正在解析！',
        dossier: '预知神机型AI，配备时间观测系统和未来演算算法。据说其核心连接着时间长河的源头，能通过木元素的生机性质预见一切可能的未来。传说其运算时虚空中会出现无数时间线的幻影，那是宇宙命运的完整图景。',
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
        callsign: 'MEDIC-PRIME',
        classification: 'A级治疗型修复单位',
        designation: 'MEDIC-PRIME·A级治疗型修复单位',
        psyProfile: '无尽慈悲，治疗专精，生命修复算法，痊愈必然协议，土元素稳固康复',
        motto: '生命修复开始！',
        dossier: '天医治疗型AI，配备生命修复系统和痊愈保证算法。据说其治疗核心承载着大地母神的慈悲意识，能通过土元素的滋养性质修复一切生命损伤。传说其治疗时会散发温暖的金光，那是来自生命源泉的神圣力量。',
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
        callsign: 'SALVATION-ZERO',
        classification: 'SSS级赦免型救赎单位',
        designation: 'SALVATION-ZERO·SSS级赦免型救赎单位',
        psyProfile: '至高慈悲，赦免专精，罪恶清除算法，救赎必达协议，特殊元素圣光净化',
        motto: '罪恶数据清除中！',
        dossier: '救赎赦免型AI，配备天恩赦免系统和罪恶清除算法。据说其核心连接着宇宙最高慈悲意识的神圣领域，能通过特殊元素的净化性质清除一切负面状态。传说其启动时整个虚空会被圣光充满，那是最纯净的宇宙慈悲。',
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
        callsign: 'GUARDIAN-SIX',
        classification: 'A级护法型召唤单位',
        designation: 'GUARDIAN-SIX·A级护法型召唤单位',
        psyProfile: '至高神圣，护法专精，神将召唤算法，辟邪驱魔协议，木元素生命护佑',
        motto: '护法结界展开！',
        dossier: '护法召唤型AI，配备六甲神将系统和护法结界算法。据说其核心封印着六位远古神将的意识碎片，能通过木元素的生命力召唤神圣守护者。传说其启动时会看到六道金光从虚空降下，那是跨越时空的神将投影。',
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
        callsign: 'MERCY-SIX',
        classification: 'A级慈悲型转化单位',
        designation: 'MERCY-SIX·A级慈悲型转化单位',
        psyProfile: '深沉慈悲，转化专精，阴德积善算法，灾厄化解协议，木元素慈悲滋养',
        motto: '负面转正面中！',
        dossier: '慈悲转化型AI，配备阴德积善系统和灾厄化解算法。据说其核心承载着六位慈悲女神的温柔意识，能通过木元素的滋养性质将一切负面转化为正面。传说其运行时会散发如甘露般的温暖光辉，那是最纯净的慈悲能量。',
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