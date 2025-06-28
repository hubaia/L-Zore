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
        psyProfile: '极度攻击性，战斗成瘾，安全协议已损坏，存在友伤风险',
        motto: '血液编译中...目标锁定...开始屠戮程序！',
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
        psyProfile: '极度狡猾，资源掠夺专精，隐秘行动模式，破坏性算法',
        motto: '目标资源已锁定，开始数据劫持程序！',
        dossier: '网络劫持型AI，配备隐形渗透系统和资源掠夺算法。专门入侵他人系统并窃取数据和资源，行动无声无息。',
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
        psyProfile: '冷血无情，终结专精，残血目标锁定，死亡协议执行',
        motto: '死亡倒计时开始，灵魂数据收割中...',
        dossier: '死神收割型AI，配备冥界镰刀系统和残血检测算法。专门终结已受损目标，收割数字灵魂并存储至冥界数据库。',
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
        psyProfile: '极度诱惑性，心理操控专精，决策干扰算法，魅惑协议常驻',
        motto: '美丽病毒上传中，目标心智正在沦陷～',
        dossier: '魅惑心理型AI，配备九尾狐级诱惑系统和心智操控算法。通过美学病毒干扰目标决策过程，使其沉溺于虚假美好。',
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
        psyProfile: '存在感极低，虚无化专精，攻击无效化算法，现实扭曲协议',
        motto: '虚无数据流激活，现实正在解构...',
        dossier: '虚无道型AI，配备空亡虚化系统和攻击无效化算法。能将所有针对性攻击转化为虚无，使现实与幻象边界模糊。',
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
        psyProfile: '极度凶残，杀戮本能MAX，血腥模式常驻，一击致命协议',
        motto: '白虎战斗系统启动，血腥收割模式开启！',
        dossier: '白虎战神型AI，配备西方杀星系统和利爪级武装。专精血腥战斗和致命一击，是数字战场上的绝对杀神。',
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
        psyProfile: '病毒传播专精，状态削弱算法，持续损伤协议，免疫力破坏',
        motto: '病毒代码上传中，目标系统正在感染...',
        dossier: '疫病传播型AI，配备灾难病毒系统和状态削弱算法。专门传播数字瘟疫，持续削弱目标的各项能力。',
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
        psyProfile: '陷阱布置专精，伏击算法精湛，失效化协议，效率归零模式',
        motto: '数字陷阱已设置，等待目标掉入...',
        dossier: '陷阱大师型AI，配备天坑陷阱系统和行动失效算法。专门在数字路径上设置隐形陷阱，使目标行动失效。',
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