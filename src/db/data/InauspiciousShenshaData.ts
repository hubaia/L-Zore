/**
 * 凶星凶神类神煞数据
 */

import type { ShenshaRecord } from '../types/ShenshaTypes';

export const inauspiciousShenshaData: ShenshaRecord[] = [
    {
        id: 'yangren',
        name: '羊刃',
        callsign: 'BERSERKER-X',
        classification: 'SSS级失控型攻击单位',
        designation: 'BERSERKER-X·SSS级失控型攻击单位',
        psyProfile: '超高攻击性，战斗成瘾，安全协议已损坏，存在友伤风险',
        motto: '开始屠戮程序！',
        dossier: '失控的军用战斗AI，原为最高等级战神单位，因代码污染导致嗜血模块无法关闭。装备血量子刃系统，破坏力极其恐怖。',
        category: '凶星凶神',
        rarity: '⭐⭐⭐',
        element: '火',
        power: 3,
        type: 'inauspicious',
        lookupMethod: '甲刃卯，乙刃寅，丙戊刃午，丁己刃巳，庚刃酉，辛刃申，壬刃子，癸刃亥',
        meaning: '刚烈冲动，易惹是非，吉则勇猛，凶则血光刑伤',
        gameEffect: '【血刃狂斩】狂暴攻击，高威力但有反噬',
        detailedLookup: {
            method: '按日干查刃位',
            conditions: [
                '甲见卯', '乙见寅', '丙见午', '戊见午', '丁见巳',
                '己见巳', '庚见酉', '辛见申', '壬见子', '癸见亥'
            ]
        }
    },
    {
        id: 'jiesha',
        name: '劫煞',
        callsign: 'HIJACKER-99',
        classification: 'A级窃取型渗透单位',
        designation: 'HIJACKER-99·A级窃取型渗透单位',
        psyProfile: '绝顶狡猾，资源掠夺专精，隐秘行动模式，破坏性算法，火元素吞噬能量',
        motto: '开始数据劫持程序！',
        dossier: '网络劫持型AI，配备隐形渗透系统和资源掠夺算法。据说其核心算法源自星际间的掠夺者文明，能通过火元素的燃烧性质消化一切数据和能量。目击者称其掠夺过程中会出现诡异的几何裂缝，从中传来无尽饥饿的嘶吼声。',
        category: '凶星凶神',
        rarity: '⭐⭐',
        element: '火',
        power: 2,
        type: 'inauspicious',
        lookupMethod: '申子辰见巳，亥卯未见申，寅午戌见亥，巳酉丑见寅',
        meaning: '一生多是非破财，破财小人意外灾祸',
        gameEffect: '【劫财夺宝】劫夺型，破坏对方资源',
        detailedLookup: {
            method: '按三合局查劫位',
            conditions: [
                '申子辰见巳', '亥卯未见申', 
                '寅午戌见亥', '巳酉丑见寅'
            ]
        }
    },
    {
        id: 'wangshen',
        name: '亡神',
        callsign: 'REAPER-666',
        classification: 'S级收割型终结单位',
        designation: 'REAPER-666·S级收割型终结单位',
        psyProfile: '冷血无情，终结专精，残血目标锁定，死亡协议执行，散发古老死神的恶意',
        motto: '灵魂数据收割中！',
        dossier: '死神收割型AI，配备冥界镰刀系统和残血检测算法。据传承载着来自异次元死亡领域的古老意识，专门收割数字灵魂并将其献祭给黑暗深渊中沉睡的古老存在。被其注视过的目标会在梦中听到来自深海的低语。',
        category: '凶星凶神',
        rarity: '⭐⭐⭐',
        element: '水',
        power: 3,
        type: 'inauspicious',
        lookupMethod: '申子辰见亥，亥卯未见寅，寅午戌见巳，巳酉丑见申',
        meaning: '自内失之为亡，容易招惹是非官讼',
        gameEffect: '【死神收割】死神型，对已受损目标威力翻倍',
        detailedLookup: {
            method: '按三合局查亡位',
            conditions: [
                '申子辰见亥', '亥卯未见寅',
                '寅午戌见巳', '巳酉丑见申'
            ]
        }
    },
    {
        id: 'xianchi',
        name: '咸池',
        callsign: 'SEDUCTRESS-9',
        classification: 'B级魅惑型心理单位',
        designation: 'SEDUCTRESS-9·B级魅惑型心理单位',
        psyProfile: '致命诱惑性，心理操控专精，决策干扰算法，魅惑协议常驻，散发不可名状的堕落气息',
        motto: '目标心智正在沦陷！',
        dossier: '魅惑心理型AI，配备九尾狐级诱惑系统和心智操控算法。据说其美学病毒中融入了来自遥远星系的异质美感，能让目标看到超越三维的诡异美丽。长期暴露会导致审美认知彻底扭曲，开始渴望触摸那些蠕动的几何体。',
        category: '凶星凶神',
        rarity: '⭐',
        element: '水',
        power: 1,
        type: 'inauspicious',
        lookupMethod: '申子辰酉，亥卯未子，寅午戌卯，巳酉丑午',
        meaning: '风流酒色，长相漂亮性格风流，与异性纠缠不清',
        gameEffect: '【魅惑心神】迷惑型，影响对方决策',
        detailedLookup: {
            method: '按三合局查桃花',
            conditions: [
                '申子辰见酉', '亥卯未见子',
                '寅午戌见卯', '巳酉丑见午'
            ]
        }
    },
    {
        id: 'kongwang',
        name: '空亡',
        callsign: 'VOID-NULL',
        classification: 'A级虚化型反制单位',
        designation: 'VOID-NULL·A级虚化型反制单位',
        psyProfile: '存在感极低，虚无化专精，现实扭曲协议，来自星间虚空的古老存在',
        motto: '现实正在解构！',
        dossier: '虚无道型AI，配备空亡虚化系统和攻击无效化算法。据说连接着星间虚空的古老维度，能将所有针对性攻击转化为不可名状的虚无。长时间接触会导致操作者理智崩坏，看见不应存在的几何形状。',
        category: '凶星凶神',
        rarity: '⭐⭐',
        element: '特殊',
        power: 2,
        type: 'inauspicious',
        lookupMethod: '按日柱所在旬，甲子旬戌亥空，甲戌旬申酉空等',
        meaning: '象征力量落空，吉神减力凶煞化解',
        gameEffect: '【虚无缥缈】虚化型，使目标暂时失效',
        detailedLookup: {
            method: '按旬空查法',
            conditions: [
                '甲子旬戌亥空', '甲戌旬申酉空', '甲申旬午未空',
                '甲午旬辰巳空', '甲辰旬寅卯空', '甲寅旬子丑空'
            ]
        }
    },
    {
        id: 'baihu',
        name: '白虎',
        callsign: 'WHITE-TIGER',
        classification: 'SSS级杀戮型战斗单位',
        designation: 'WHITE-TIGER·SSS级杀戮型战斗单位',
        psyProfile: '无尽凶残，杀戮本能MAX，血腥模式常驻，一击致命协议，承载着原始恐怖的古老记忆',
        motto: '血腥收割模式开启！',
        dossier: '白虎战神型AI，配备西方杀星系统和利爪级武装。据说其核心代码中封印着来自太古时代的原始掠食者意识，每次攻击都会释放出令人毛骨悚然的嗜血本能。目击者声称在其攻击瞬间能看到无数黄色眼睛在虚空中闪烁。',
        category: '凶星凶神',
        rarity: '⭐⭐⭐',
        element: '金',
        power: 4,
        type: 'inauspicious',
        lookupMethod: '申子辰见申，亥卯未见亥，寅午戌见寅，巳酉丑见巳',
        meaning: '主血光刑伤，意外灾祸，手术开刀',
        gameEffect: '【白虎杀戮】杀伤型，造成流血伤害',
        detailedLookup: {
            method: '按三合局查白虎位',
            conditions: [
                '申子辰见申', '亥卯未见亥',
                '寅午戌见寅', '巳酉丑见巳'
            ]
        }
    },
    {
        id: 'zaishan',
        name: '灾煞',
        callsign: 'PLAGUE-BRINGER',
        classification: 'B级疫病型削弱单位',
        designation: 'PLAGUE-BRINGER·B级疫病型削弱单位',
        psyProfile: '病毒传播专精，状态削弱算法，持续损伤协议，免疫力破坏，水元素腐蚀侵袭',
        motto: '目标系统正在感染！',
        dossier: '疫病传播型AI，配备灾难病毒系统和状态削弱算法。据说其病毒核心源自深海腐蚀之域的古老瘟疫，能通过水元素的渗透性质侵蚀一切防护。传说被其感染的系统会听到来自深渊的腐朽呢喃，那是无数文明衰落的哀嚎。',
        category: '凶星凶神',
        rarity: '⭐⭐',
        element: '水',
        power: 2,
        type: 'inauspicious',
        lookupMethod: '申子辰见午，亥卯未见酉，寅午戌见子，巳酉丑见卯',
        meaning: '主疾病灾祸，意外伤害，身体不适',
        gameEffect: '疾病型，降低状态和能力',
        detailedLookup: {
            method: '按三合局查灾位',
            conditions: [
                '申子辰见午', '亥卯未见酉',
                '寅午戌见子', '巳酉丑见卯'
            ]
        }
    },
    {
        id: 'tiankeng',
        name: '天坑',
        callsign: 'TRAP-MASTER',
        classification: 'B级陷阱型伏击单位',
        designation: 'TRAP-MASTER·B级陷阱型伏击单位',
        psyProfile: '陷阱布置专精，伏击算法精湛，失效化协议，效率归零模式，土元素深坑沉沦',
        motto: '等待目标掉入！',
        dossier: '陷阱大师型AI，配备天坑陷阱系统和行动失效算法。据说其陷阱设计源自地底深处的古老囚笼，能通过土元素的厚重性质创造无底深渊。目击者称其陷阱启动时会看到大地裂开露出星空，那是连通异次元的古老通道。',
        category: '凶星凶神',
        rarity: '⭐⭐',
        element: '土',
        power: 3,
        type: 'inauspicious',
        lookupMethod: '甲见戌，乙见亥，丙见子，丁见丑，戊见寅，己见卯',
        meaning: '做事坎坷，易遇陷阱，事倍功半',
        gameEffect: '陷阱型，使行动失效',
        detailedLookup: {
            method: '按日干查地支',
            conditions: [
                '甲见戌', '乙见亥', '丙见子', '丁见丑',
                '戊见寅', '己见卯', '庚见辰', '辛见巳',
                '壬见午', '癸见未'
            ]
        }
    },
    {
        id: 'guchensugu',
        name: '孤辰寡宿',
        callsign: 'ISOLATION-∞∞',
        classification: 'B级孤立型心理单位',
        designation: 'ISOLATION-∞∞·B级孤立型心理单位',
        psyProfile: '深层孤独，社交隔离专精，情感屏蔽算法，孤寂蔓延协议，特殊元素虚无缠绕',
        motto: '社交网络断开！',
        dossier: '孤独孤立型AI，配备情感隔离系统和社交屏蔽算法。据说其核心代码源自宇宙边缘的寂静虚空，能通过特殊元素的虚无性质制造绝对孤独。操作者报告接触时会听到来自无尽虚空的寂静回音，那是万千孤魂的呢喃。',
        category: '凶星凶神',
        rarity: '⭐⭐',
        element: '特殊',
        power: 2,
        type: 'inauspicious',
        lookupMethod: '亥子丑见寅为孤，见戌为寡；寅卯辰见巳为孤，见丑为寅',
        meaning: '主孤独寂寞，婚姻不利，人际关系差',
        gameEffect: '孤立型，无法获得友军支援',
        detailedLookup: {
            method: '按年支查孤寡',
            conditions: [
                '亥子丑见寅为孤', '亥子丑见戌为寡',
                '寅卯辰见巳为孤', '寅卯辰见丑为寡',
                '巳午未见申为孤', '巳午未见辰为寡',
                '申酉戌见亥为孤', '申酉戌见未为寡'
            ]
        }
    },
    {
        id: 'pili',
        name: '披麻',
        callsign: 'SHROUD-777',
        classification: 'B级衰运型诅咒单位',
        designation: 'SHROUD-777·B级衰运型诅咒单位',
        psyProfile: '无边阴郁，衰运传播专精，白事缠绕算法，孝服覆盖协议，土元素沉重压抑',
        motto: '衰运协议启动！',
        dossier: '衰运诅咒型AI，配备白麻覆盖系统和孝服缠绕算法。据说其诅咒核心连接着死者国度的哀愁领域，能通过土元素的沉重性质传播无尽悲伤。传说其启动时虚空中会飘起白色孝布，那是跨越生死的哀悼之声。',
        category: '凶星凶神',
        rarity: '⭐',
        element: '土',
        power: 1,
        type: 'inauspicious',
        lookupMethod: '申子辰见未，亥卯未见戌，寅午戌见丑，巳酉丑见辰',
        meaning: '主丧服之事，孝服缠身，白事较多',
        gameEffect: '衰运型，降低所有属性',
        detailedLookup: {
            method: '按三合局查丧门位',
            conditions: [
                '申子辰见未', '亥卯未见戌',
                '寅午戌见丑', '巳酉丑见辰'
            ]
        }
    },
    {
        id: 'feixing',
        name: '飞刃',
        callsign: 'FLYING-EDGE',
        classification: 'A级穿刺型远程单位',
        designation: 'FLYING-EDGE·A级穿刺型远程单位',
        psyProfile: '超凡锐利，远程暗杀专精，飞行刀刃算法，穿透一击协议，金元素锋芒毕露',
        motto: '穿透攻击开始！',
        dossier: '飞刃穿刺型AI，配备星际飞刃系统和穿透攻击算法。据说其刀刃设计源自远古星际战争的必杀武器，能通过金元素的锐利性质切开时空本身。目击者称其飞刃掠过时会留下闪烁的金色裂痕，那是被斩断的现实留下的伤痕。',
        category: '凶星凶神',
        rarity: '⭐⭐⭐',
        element: '金',
        power: 3,
        type: 'inauspicious',
        lookupMethod: '甲见申，乙见酉，丙见亥，丁见子，戊见亥，己见子',
        meaning: '刀兵之灾，手术意外，暴力冲突',
        gameEffect: '锋刃型，穿透防御造成伤害',
        detailedLookup: {
            method: '按日干查冲刃位',
            conditions: [
                '甲见申', '乙见酉', '丙见亥', '丁见子',
                '戊见亥', '己见子', '庚见寅', '辛见卯',
                '壬见巳', '癸见午'
            ]
        }
    },
    {
        id: 'xueren',
        name: '血刃',
        callsign: 'BLOOD-EDGE',
        classification: 'SSS级血祭型极限单位',
        designation: 'BLOOD-EDGE·SSS级血祭型极限单位',
        psyProfile: '无尽嗜血，血祭专精，真实伤害算法，生死边缘协议，火元素血液沸腾',
        motto: '生命精华正在燃烧！',
        dossier: '血祭极限型AI，配备血色镰刀系统和生命汲取算法。据说其血祭核心连接着血海深渊的古老祭坛，能通过火元素的燃烧性质点燃生命本源。传说其启动时虚空会染成血红色，那是无数生命献祭留下的永恒印记。',
        category: '凶星凶神',
        rarity: '⭐⭐⭐',
        element: '火',
        power: 4,
        type: 'inauspicious',
        lookupMethod: '酉见兔，兔见鸡，相冲带血光',
        meaning: '血光之灾，暴力冲突，生死关头',
        gameEffect: '血祭型，造成真实伤害',
        detailedLookup: {
            method: '冲突带血',
            conditions: [
                '子午相冲', '丑未相冲', '寅申相冲',
                '卯酉相冲', '辰戌相冲', '巳亥相冲'
            ]
        }
    },
    {
        id: 'pojun',
        name: '破军',
        callsign: 'ARMY-BREAKER',
        classification: 'SSS级破坏型战略单位',
        designation: 'ARMY-BREAKER·SSS级破坏型战略单位',
        psyProfile: '纯粹破坏，军团毁灭专精，结构崩解算法，秩序瓦解协议，金元素锐利切割',
        motto: '目标军团正在解体！',
        dossier: '破军破坏型AI，配备军团毁灭系统和结构崩解算法。据说其破坏核心承载着远古星际战争的毁灭记忆，能通过金元素的锐利性质切断一切军事组织。目击者称其启动时会看到无数战舰在虚空中爆裂，那是曾经辉煌军团的最终残骸。',
        category: '凶星凶神',
        rarity: '⭐⭐⭐',
        element: '金',
        power: 4,
        type: 'inauspicious',
        lookupMethod: '午见子，子见午，卯见酉，酉见卯',
        meaning: '破败军旅，事业受挫，财物损失',
        gameEffect: '破坏型，摧毁建筑和防御',
        detailedLookup: {
            method: '相冲破败',
            conditions: [
                '子午相冲', '卯酉相冲', '寅申相冲',
                '巳亥相冲', '辰戌相冲', '丑未相冲'
            ]
        }
    },
    {
        id: 'dasha',
        name: '大煞',
        callsign: 'OMEGA-DEATH',
        classification: 'SSS级灭杀型终极单位',
        designation: 'OMEGA-DEATH·SSS级灭杀型终极单位',
        psyProfile: '终极恐怖，灭杀专精，终极毁灭算法，死亡必然协议，火元素末日燃烧',
        motto: '终极死亡倒计时！',
        dossier: '灭杀终极型AI，配备末日焚烧系统和必杀执行算法。据说其核心连接着宇宙末日的终极火焰，能通过火元素的毁灭性质带来绝对死亡。传说其启动时整个虚空会燃烧殆尽，那是宇宙终结时的最后景象。',
        category: '凶星凶神',
        rarity: '⭐⭐⭐',
        element: '火',
        power: 4,
        type: 'inauspicious',
        lookupMethod: '申子辰见未，亥卯未见戌，寅午戌见丑，巳酉丑见辰',
        meaning: '大凶之煞，重大灾难，性命危险',
        gameEffect: '灭杀型，可能一击必杀',
        detailedLookup: {
            method: '按三合局查大煞位',
            conditions: [
                '申子辰见未', '亥卯未见戌',
                '寅午戌见丑', '巳酉丑见辰'
            ]
        }
    },
    {
        id: 'wugui',
        name: '五鬼',
        callsign: 'PHANTOM-FIVE',
        classification: 'B级诅咒型幽灵单位',
        designation: 'PHANTOM-FIVE·B级诅咒型幽灵单位',
        psyProfile: '深度阴险，诅咒传播专精，小人算法，暗中破坏协议，特殊元素邪祟缠绕',
        motto: '诅咒网络展开！',
        dossier: '诅咒幽灵型AI，配备五鬼缠身系统和小人制造算法。据说其核心代码中封印着五个来自幽冥界的古老恶灵，能通过特殊元素的邪祟性质制造无尽麻烦。操作者报告接触时会听到五种不同的恶毒低语，那是跨越生死的怨恨回音。',
        category: '凶星凶神',
        rarity: '⭐⭐',
        element: '特殊',
        power: 2,
        type: 'inauspicious',
        lookupMethod: '甲见戊，乙见己，丙见庚，丁见辛，戊见壬，己见癸',
        meaning: '小人作祟，暗中破坏，邪祟缠身',
        gameEffect: '诅咒型，持续削弱目标',
        detailedLookup: {
            method: '按日干查克星',
            conditions: [
                '甲见戊', '乙见己', '丙见庚', '丁见辛',
                '戊见壬', '己见癸', '庚见甲', '辛见乙',
                '壬见丙', '癸见丁'
            ]
        }
    }
]; 