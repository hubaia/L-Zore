/**
 * 凶星凶神类神煞数据
 */

import type { ShenshaRecord } from '../types/ShenshaTypes';

export const inauspiciousShenshaData: ShenshaRecord[] = [
    {
        id: 'yangren',
        name: '羊刃',
        personalName: '血刃',
        title: '狂战魔王',
        fullName: '血刃·狂战魔王',
        personality: '嗜血好战，狂暴无双，伤敌伤己',
        catchphrase: '血刃所指，万物皆斩！',
        biography: '上古战神堕落而成，手持血色巨刃。曾是天庭战神，因嗜血成性被贬下界，但战斗力依然恐怖至极。',
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
        personalName: '劫煞',
        title: '夺命盗圣',
        fullName: '劫煞·夺命盗圣',
        personality: '来去如风，劫财夺宝，破坏专家',
        catchphrase: '取之有道，劫之有术！',
        biography: '江湖第一大盗，专劫富济己。身着夜行衣，轻功绝顶，能无声无息地夺取他人财物和力量。',
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
        personalName: '亡灵',
        title: '死神使者',
        fullName: '亡灵·死神使者',
        personality: '阴冷无情，补刀专家，落井下石',
        catchphrase: '死神降临，收割开始。',
        biography: '冥界使者，专收残魂败魄。身披黑色斗篷，手持死神镰刀，专门收割那些已经受伤的灵魂。',
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
        personalName: '咸池',
        title: '魅惑妖姬',
        fullName: '咸池·魅惑妖姬',
        personality: '妖媚动人，迷惑人心，乱人心智',
        catchphrase: '红颜如毒，君心如醉～',
        biography: '九尾狐族后裔，美貌倾国倾城。精通魅惑之术，能乱人心智，让强者沉溺于美色而忘记正事。',
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
        personalName: '虚无',
        title: '空亡道人',
        fullName: '虚无·空亡道人',
        personality: '飘渺虚幻，化有为无，力量落空',
        catchphrase: '万法皆空，一切如梦。',
        biography: '修炼虚无大道的神秘道士。身形虚幻，若有若无，能让一切攻击落空，化实为虚。',
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
        personalName: '白虎',
        title: '杀星将军',
        fullName: '白虎·杀星将军',
        personality: '凶猛残暴，血光四溅，见血封喉',
        catchphrase: '虎啸山林，血洗天下！',
        biography: '西方白虎星君，掌管杀戮征战。化身白色巨虎，利爪如刀，一击必见血，是战场上的恐怖存在。',
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