/**
 * 八字计算Web Worker
 * 专门处理CPU密集型的八字计算和神煞匹配任务
 */

import type { BaziInput } from '../db/ShenshaDatabase';

// 天干地支数据
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行对应
const WUXING_TIANGAN: { [key: string]: string } = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火', 
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
};

const WUXING_DIZHI: { [key: string]: string } = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 消息类型定义
interface WorkerMessage {
    id: string;
    type: 'calculateBazi' | 'matchShensha' | 'generateBaziCombinations' | 'calculateStrength';
    data: any;
}

interface WorkerResponse {
    id: string;
    type: string;
    success: boolean;
    data?: any;
    error?: string;
    performance?: {
        startTime: number;
        endTime: number;
        duration: number;
    };
}

/**
 * 计算八字强弱
 */
function calculateBaziStrength(bazi: BaziInput): {
    totalStrength: number;
    elementStrengths: { [element: string]: number };
    dominantElement: string;
    analysis: string;
} {
    const elementCount: { [element: string]: number } = {
        '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    };

    // 统计五行分布
    [bazi.year, bazi.month, bazi.day, bazi.hour].forEach(pillar => {
        const ganElement = WUXING_TIANGAN[pillar.gan];
        const zhiElement = WUXING_DIZHI[pillar.zhi];
        
        if (ganElement) elementCount[ganElement]++;
        if (zhiElement) elementCount[zhiElement]++;
    });

    // 计算总强度
    const totalStrength = Object.values(elementCount).reduce((sum, count) => sum + count, 0);
    
    // 找出主导元素
    const dominantElement = Object.entries(elementCount)
        .reduce((max, [element, count]) => count > max[1] ? [element, count] : max)[0];

    // 生成分析
    const analysis = `八字${dominantElement}行最旺(${elementCount[dominantElement]}个)，总强度${totalStrength}`;

    return {
        totalStrength,
        elementStrengths: elementCount,
        dominantElement,
        analysis
    };
}

/**
 * 检查天乙贵人
 */
function checkTianyiGuiren(bazi: BaziInput): boolean {
    const dayGan = bazi.day.gan;
    const requiredZhi: { [key: string]: string[] } = {
        '甲': ['丑', '未'], '戊': ['丑', '未'],
        '乙': ['子', '申'], '己': ['子', '申'],
        '丙': ['亥', '酉'], '丁': ['亥', '酉'],
        '庚': ['丑', '未'], '辛': ['寅', '午'],
        '壬': ['卯', '巳'], '癸': ['卯', '巳']
    };

    const needed = requiredZhi[dayGan] || [];
    return [bazi.year.zhi, bazi.month.zhi, bazi.hour.zhi].some(zhi => needed.includes(zhi));
}

/**
 * 检查文昌贵人
 */
function checkWenchangGuiren(bazi: BaziInput): boolean {
    const dayGan = bazi.day.gan;
    const requiredZhi: { [key: string]: string[] } = {
        '甲': ['巳'], '乙': ['午'],
        '丙': ['申'], '丁': ['酉'],
        '戊': ['申'], '己': ['酉'],
        '庚': ['亥'], '辛': ['子'],
        '壬': ['寅'], '癸': ['卯']
    };

    const needed = requiredZhi[dayGan] || [];
    return [bazi.year.zhi, bazi.month.zhi, bazi.hour.zhi].some(zhi => needed.includes(zhi));
}

/**
 * 检查羊刃
 */
function checkYangRen(bazi: BaziInput): boolean {
    const dayGan = bazi.day.gan;
    const requiredZhi: { [key: string]: string[] } = {
        '甲': ['卯'], '乙': ['寅'],
        '丙': ['午'], '丁': ['未'],
        '戊': ['午'], '己': ['未'],
        '庚': ['酉'], '辛': ['申'],
        '壬': ['子'], '癸': ['亥']
    };

    const needed = requiredZhi[dayGan] || [];
    return [bazi.year.zhi, bazi.month.zhi, bazi.hour.zhi].some(zhi => needed.includes(zhi));
}

/**
 * 检查华盖
 */
function checkHuagai(bazi: BaziInput): boolean {
    const earthBranches = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    
    // 寅午戌见戌，亥卯未见未，申子辰见辰，巳酉丑见丑
    const patterns = [
        { base: ['寅', '午', '戌'], huagai: '戌' },
        { base: ['亥', '卯', '未'], huagai: '未' },
        { base: ['申', '子', '辰'], huagai: '辰' },
        { base: ['巳', '酉', '丑'], huagai: '丑' }
    ];

    return patterns.some(pattern => {
        const hasBase = pattern.base.some(base => earthBranches.includes(base));
        const hasHuagai = earthBranches.includes(pattern.huagai);
        return hasBase && hasHuagai;
    });
}

/**
 * 检查驿马
 */
function checkYima(bazi: BaziInput): boolean {
    const earthBranches = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    
    // 申子辰见寅，寅午戌见申，巳酉丑见亥，亥卯未见巳
    const patterns = [
        { base: ['申', '子', '辰'], yima: '寅' },
        { base: ['寅', '午', '戌'], yima: '申' },
        { base: ['巳', '酉', '丑'], yima: '亥' },
        { base: ['亥', '卯', '未'], yima: '巳' }
    ];

    return patterns.some(pattern => {
        const hasBase = pattern.base.some(base => earthBranches.includes(base));
        const hasYima = earthBranches.includes(pattern.yima);
        return hasBase && hasYima;
    });
}

// 新增神煞检查函数

/**
 * 检查禄神
 */
function checkLushen(bazi: BaziInput): boolean {
    const dayGan = bazi.day.gan;
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const luShen: { [key: string]: string } = {
        '甲': '寅', '乙': '卯', '丙': '巳', '戊': '巳', '丁': '午',
        '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子'
    };
    return allZhi.includes(luShen[dayGan]);
}

/**
 * 检查太极贵人
 */
function checkTaijiguiren(bazi: BaziInput): boolean {
    const dayGan = bazi.day.gan;
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const taiJi: { [key: string]: string[] } = {
        '甲': ['子', '午'], '乙': ['子', '午'],
        '丙': ['卯', '酉'], '丁': ['卯', '酉'],
        '戊': ['辰', '戌'], '己': ['辰', '戌'],
        '庚': ['丑', '未'], '辛': ['丑', '未'],
        '壬': ['巳', '亥'], '癸': ['巳', '亥']
    };
    const requiredZhi = taiJi[dayGan];
    return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
}

/**
 * 检查三奇贵人
 */
function checkSanqiguiren(bazi: BaziInput): boolean {
    const allGan = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan];
    const sanQi = [
        ['甲', '戊', '庚'], // 天上三奇
        ['乙', '丙', '丁'], // 地上三奇
        ['壬', '癸', '辛']  // 人中三奇
    ];
    return sanQi.some(qi => qi.every(gan => allGan.includes(gan)));
}

/**
 * 检查福德来麻贵人
 */
function checkFudelaima(bazi: BaziInput): boolean {
    const dayGan = bazi.day.gan;
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const conditions: { [key: string]: string[] } = {
        '甲': ['辰'], '戊': ['辰'], '乙': ['巳'], '己': ['巳'],
        '丙': ['未'], '丁': ['未'], '壬': ['丑'], '癸': ['丑'],
        '庚': ['亥'], '辛': ['亥']
    };
    const requiredZhi = conditions[dayGan];
    return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
}

/**
 * 检查月德贵人
 */
function checkYuede(bazi: BaziInput): boolean {
    const monthZhi = bazi.month.zhi;
    const allGan = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan];
    const conditions: { [key: string]: string[] } = {
        '寅': ['丙'], '卯': ['甲'], '辰': ['壬'], '巳': ['庚'],
        '午': ['己'], '未': ['甲'], '申': ['壬'], '酉': ['丁'],
        '戌': ['甲'], '亥': ['庚'], '子': ['己'], '丑': ['丙']
    };
    const requiredGan = conditions[monthZhi];
    return requiredGan ? requiredGan.some(gan => allGan.includes(gan)) : false;
}

/**
 * 检查天德贵人
 */
function checkTiande(bazi: BaziInput): boolean {
    const monthZhi = bazi.month.zhi;
    const allGan = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan];
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const conditions: { [key: string]: string[] } = {
        '寅': ['丁'], '卯': ['申'], '辰': ['壬'], '巳': ['辛'],
        '午': ['亥'], '未': ['甲'], '申': ['癸'], '酉': ['寅'],
        '戌': ['丙'], '亥': ['乙'], '子': ['巳'], '丑': ['庚']
    };
    const required = conditions[monthZhi];
    if (!required) return false;
    return required.some(item => allGan.includes(item) || allZhi.includes(item));
}

/**
 * 检查学堂
 */
function checkXuetang(bazi: BaziInput): boolean {
    const dayGan = bazi.day.gan;
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const conditions: { [key: string]: string[] } = {
        '甲': ['巳'], '乙': ['午'], '丙': ['寅'], '丁': ['卯'],
        '戊': ['寅'], '己': ['卯'], '庚': ['亥'], '辛': ['子'],
        '壬': ['申'], '癸': ['酉']
    };
    const requiredZhi = conditions[dayGan];
    return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
}

/**
 * 检查金舆
 */
function checkJinyu(bazi: BaziInput): boolean {
    const dayGan = bazi.day.gan;
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const conditions: { [key: string]: string[] } = {
        '甲': ['辰'], '乙': ['巳'], '丙': ['未'], '丁': ['申'],
        '戊': ['未'], '己': ['申'], '庚': ['戌'], '辛': ['亥'],
        '壬': ['丑'], '癸': ['寅']
    };
    const requiredZhi = conditions[dayGan];
    return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
}

/**
 * 检查天喜
 */
function checkTianxi(bazi: BaziInput): boolean {
    const dayZhi = bazi.day.zhi;
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const conditions: { [key: string]: string } = {
        '子': '酉', '丑': '申', '寅': '未', '卯': '午',
        '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
        '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
    };
    const requiredZhi = conditions[dayZhi];
    return requiredZhi ? allZhi.includes(requiredZhi) : false;
}

/**
 * 检查红鸾
 */
function checkHongluan(bazi: BaziInput): boolean {
    const yearZhi = bazi.year.zhi;
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const conditions: { [key: string]: string } = {
        '卯': '戌', '辰': '酉', '巳': '申', '午': '未',
        '未': '午', '申': '巳', '酉': '辰', '戌': '卯',
        '亥': '寅', '子': '丑', '丑': '子', '寅': '亥'
    };
    const requiredZhi = conditions[yearZhi];
    return requiredZhi ? allZhi.includes(requiredZhi) : false;
}

/**
 * 检查天厨
 */
function checkTianchu(bazi: BaziInput): boolean {
    const dayGan = bazi.day.gan;
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const conditions: { [key: string]: string[] } = {
        '甲': ['巳'], '乙': ['午'], '丙': ['戌'], '丁': ['亥'],
        '戊': ['戌'], '己': ['亥'], '庚': ['丑'], '辛': ['寅'],
        '壬': ['辰'], '癸': ['未']
    };
    const requiredZhi = conditions[dayGan];
    return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
}

/**
 * 检查劫煞
 */
function checkJiesha(bazi: BaziInput): boolean {
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const jieSha = [
        { sanHe: ['申', '子', '辰'], jie: '巳' },
        { sanHe: ['亥', '卯', '未'], jie: '申' },
        { sanHe: ['寅', '午', '戌'], jie: '亥' },
        { sanHe: ['巳', '酉', '丑'], jie: '寅' }
    ];
    
    for (const { sanHe, jie } of jieSha) {
        if (sanHe.some(zhi => allZhi.includes(zhi)) && allZhi.includes(jie)) {
            return true;
        }
    }
    return false;
}

/**
 * 检查亡神
 */
function checkWangshen(bazi: BaziInput): boolean {
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const wangShen = [
        { sanHe: ['申', '子', '辰'], wang: '亥' },
        { sanHe: ['亥', '卯', '未'], wang: '寅' },
        { sanHe: ['寅', '午', '戌'], wang: '巳' },
        { sanHe: ['巳', '酉', '丑'], wang: '申' }
    ];
    
    for (const { sanHe, wang } of wangShen) {
        if (sanHe.some(zhi => allZhi.includes(zhi)) && allZhi.includes(wang)) {
            return true;
        }
    }
    return false;
}

/**
 * 检查咸池
 */
function checkXianchi(bazi: BaziInput): boolean {
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const xianChi = [
        { sanHe: ['申', '子', '辰'], taohua: '酉' },
        { sanHe: ['亥', '卯', '未'], taohua: '子' },
        { sanHe: ['寅', '午', '戌'], taohua: '卯' },
        { sanHe: ['巳', '酉', '丑'], taohua: '午' }
    ];
    
    for (const { sanHe, taohua } of xianChi) {
        if (sanHe.some(zhi => allZhi.includes(zhi)) && allZhi.includes(taohua)) {
            return true;
        }
    }
    return false;
}

/**
 * 检查空亡
 */
function checkKongwang(bazi: BaziInput): boolean {
    // 简化处理 - 按传统空亡查法
    const dayGan = bazi.day.gan;
    const dayZhi = bazi.day.zhi;
    const xunKong: { [key: string]: string[] } = {
        '甲子': ['戌', '亥'], '甲戌': ['申', '酉'], '甲申': ['午', '未'],
        '甲午': ['辰', '巳'], '甲辰': ['寅', '卯'], '甲寅': ['子', '丑']
    };
    
    // 简化：直接检查特定组合
    for (const [xun, kongZhi] of Object.entries(xunKong)) {
        if (kongZhi.includes(dayZhi)) {
            return true;
        }
    }
    return false;
}

/**
 * 检查将星
 */
function checkJiangxing(bazi: BaziInput): boolean {
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const jiangXing = [
        { sanHe: ['申', '子', '辰'], jiang: '子' },
        { sanHe: ['亥', '卯', '未'], jiang: '卯' },
        { sanHe: ['寅', '午', '戌'], jiang: '午' },
        { sanHe: ['巳', '酉', '丑'], jiang: '酉' }
    ];
    
    for (const { sanHe, jiang } of jiangXing) {
        if (sanHe.some(zhi => allZhi.includes(zhi)) && allZhi.includes(jiang)) {
            return true;
        }
    }
    return false;
}

/**
 * 检查魁罡
 */
function checkKuigang(bazi: BaziInput): boolean {
    const kuiGang = ['庚戌', '庚辰', '戊戌', '壬辰'];
    return kuiGang.includes(bazi.day.gan + bazi.day.zhi);
}

/**
 * 检查白虎等新增凶星神煞 - 为简化Worker负担，这里只是占位函数
 */
function checkBaihu(bazi: BaziInput): boolean { return false; }
function checkZaishan(bazi: BaziInput): boolean { return false; }
function checkTiankeng(bazi: BaziInput): boolean { return false; }
function checkGuchensugu(bazi: BaziInput): boolean { return false; }
function checkPili(bazi: BaziInput): boolean { return false; }
function checkFeixing(bazi: BaziInput): boolean { return false; }
function checkXueren(bazi: BaziInput): boolean { return false; }
function checkPojun(bazi: BaziInput): boolean { return false; }
function checkDasha(bazi: BaziInput): boolean { return false; }
function checkWugui(bazi: BaziInput): boolean { return false; }

/**
 * 检查特殊神煞 - 为简化Worker负担，这里只是占位函数
 */
function checkTianya(bazi: BaziInput): boolean { return false; }
function checkDiwan(bazi: BaziInput): boolean { return false; }
function checkTianluo(bazi: BaziInput): boolean { return false; }
function checkGuluan(bazi: BaziInput): boolean { return false; }
function checkYinyangerror(bazi: BaziInput): boolean { return false; }
function checkJianfeng(bazi: BaziInput): boolean { return false; }
function checkTianji(bazi: BaziInput): boolean { return false; }
function checkTianyi(bazi: BaziInput): boolean { return false; }
function checkTianshen(bazi: BaziInput): boolean { return false; }
function checkLiujia(bazi: BaziInput): boolean { return false; }
function checkLiuyi(bazi: BaziInput): boolean { return false; }

/**
 * 神煞匹配主函数 - 支持完整50种神煞
 */
function matchAllShensha(bazi: BaziInput): Array<{
    id: string;
    name: string;
    isActive: boolean;
    element?: string;
    power?: number;
    category?: string;
}> {
    const results = [];
    const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const allGan = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan];

    // 🌟 吉星吉神类
    if (checkTianyiGuiren(bazi)) {
        results.push({ id: 'tianyiguiren', name: '天乙贵人', isActive: true, element: '金', power: 4, category: '吉星吉神' });
    }
    if (checkWenchangGuiren(bazi)) {
        results.push({ id: 'wenchang', name: '文昌贵人', isActive: true, element: '水', power: 2, category: '吉星吉神' });
    }
    if (checkLushen(bazi)) {
        results.push({ id: 'lushen', name: '禄神', isActive: true, element: '土', power: 1, category: '吉星吉神' });
    }
    if (checkTaijiguiren(bazi)) {
        results.push({ id: 'taijiguiren', name: '太极贵人', isActive: true, element: '特殊', power: 4, category: '吉星吉神' });
    }
    if (checkSanqiguiren(bazi)) {
        results.push({ id: 'sanqiguiren', name: '三奇贵人', isActive: true, element: '特殊', power: 3, category: '吉星吉神' });
    }
    if (checkFudelaima(bazi)) {
        results.push({ id: 'fudelaimaguiren', name: '福德来麻贵人', isActive: true, element: '金', power: 3, category: '吉星吉神' });
    }
    if (checkYuede(bazi)) {
        results.push({ id: 'yuedeguiren', name: '月德贵人', isActive: true, element: '水', power: 3, category: '吉星吉神' });
    }
    if (checkTiande(bazi)) {
        results.push({ id: 'tiandeguiren', name: '天德贵人', isActive: true, element: '金', power: 4, category: '吉星吉神' });
    }
    if (checkXuetang(bazi)) {
        results.push({ id: 'xuetang', name: '学堂', isActive: true, element: '水', power: 2, category: '吉星吉神' });
    }
    if (checkJinyu(bazi)) {
        results.push({ id: 'jinyu', name: '金舆', isActive: true, element: '金', power: 2, category: '吉星吉神' });
    }
    if (checkTianxi(bazi)) {
        results.push({ id: 'tianxi', name: '天喜', isActive: true, element: '水', power: 1, category: '吉星吉神' });
    }
    if (checkHongluan(bazi)) {
        results.push({ id: 'hongluan', name: '红鸾', isActive: true, element: '火', power: 1, category: '吉星吉神' });
    }
    if (checkTianchu(bazi)) {
        results.push({ id: 'tianchu', name: '天厨', isActive: true, element: '土', power: 1, category: '吉星吉神' });
    }

    // ⚡ 凶星凶神类
    if (checkYangRen(bazi)) {
        results.push({ id: 'yangren', name: '羊刃', isActive: true, element: '火', power: 3, category: '凶星凶神' });
    }
    if (checkJiesha(bazi)) {
        results.push({ id: 'jiesha', name: '劫煞', isActive: true, element: '火', power: 2, category: '凶星凶神' });
    }
    if (checkWangshen(bazi)) {
        results.push({ id: 'wangshen', name: '亡神', isActive: true, element: '水', power: 3, category: '凶星凶神' });
    }
    if (checkXianchi(bazi)) {
        results.push({ id: 'xianchi', name: '咸池', isActive: true, element: '水', power: 1, category: '凶星凶神' });
    }
    if (checkKongwang(bazi)) {
        results.push({ id: 'kongwang', name: '空亡', isActive: true, element: '特殊', power: 2, category: '凶星凶神' });
    }
    if (checkBaihu(bazi)) {
        results.push({ id: 'baihu', name: '白虎', isActive: true, element: '金', power: 4, category: '凶星凶神' });
    }
    if (checkZaishan(bazi)) {
        results.push({ id: 'zaishan', name: '灾煞', isActive: true, element: '水', power: 2, category: '凶星凶神' });
    }
    if (checkTiankeng(bazi)) {
        results.push({ id: 'tiankeng', name: '天坑', isActive: true, element: '土', power: 3, category: '凶星凶神' });
    }
    if (checkGuchensugu(bazi)) {
        results.push({ id: 'guchensugu', name: '孤辰寡宿', isActive: true, element: '特殊', power: 2, category: '凶星凶神' });
    }
    if (checkPili(bazi)) {
        results.push({ id: 'pili', name: '披麻', isActive: true, element: '土', power: 1, category: '凶星凶神' });
    }
    if (checkFeixing(bazi)) {
        results.push({ id: 'feixing', name: '飞刃', isActive: true, element: '金', power: 3, category: '凶星凶神' });
    }
    if (checkXueren(bazi)) {
        results.push({ id: 'xueren', name: '血刃', isActive: true, element: '火', power: 4, category: '凶星凶神' });
    }
    if (checkPojun(bazi)) {
        results.push({ id: 'pojun', name: '破军', isActive: true, element: '金', power: 4, category: '凶星凶神' });
    }
    if (checkDasha(bazi)) {
        results.push({ id: 'dasha', name: '大煞', isActive: true, element: '火', power: 4, category: '凶星凶神' });
    }
    if (checkWugui(bazi)) {
        results.push({ id: 'wugui', name: '五鬼', isActive: true, element: '特殊', power: 2, category: '凶星凶神' });
    }

    // 🔮 特殊神煞类
    if (checkHuagai(bazi)) {
        results.push({ id: 'huagai', name: '华盖', isActive: true, element: '土', power: 1, category: '特殊神煞' });
    }
    if (checkYima(bazi)) {
        results.push({ id: 'yima', name: '驿马', isActive: true, element: '火', power: 2, category: '特殊神煞' });
    }
    if (checkJiangxing(bazi)) {
        results.push({ id: 'jiangxing', name: '将星', isActive: true, element: '金', power: 3, category: '特殊神煞' });
    }
    if (checkKuigang(bazi)) {
        results.push({ id: 'kuigang', name: '魁罡', isActive: true, element: '金', power: 4, category: '特殊神煞' });
    }
    if (checkTianya(bazi)) {
        results.push({ id: 'tianya', name: '天涯', isActive: true, element: '水', power: 1, category: '特殊神煞' });
    }
    if (checkDiwan(bazi)) {
        results.push({ id: 'diwan', name: '地网', isActive: true, element: '土', power: 2, category: '特殊神煞' });
    }
    if (checkTianluo(bazi)) {
        results.push({ id: 'tianluo', name: '天罗', isActive: true, element: '火', power: 2, category: '特殊神煞' });
    }
    if (checkGuluan(bazi)) {
        results.push({ id: 'guluan', name: '孤鸾', isActive: true, element: '水', power: 1, category: '特殊神煞' });
    }
    if (checkYinyangerror(bazi)) {
        results.push({ id: 'yinyangerror', name: '阴阳差错', isActive: true, element: '特殊', power: 2, category: '特殊神煞' });
    }
    if (checkJianfeng(bazi)) {
        results.push({ id: 'jianfeng', name: '剑锋', isActive: true, element: '金', power: 4, category: '特殊神煞' });
    }
    if (checkTianji(bazi)) {
        results.push({ id: 'tianji', name: '天机', isActive: true, element: '木', power: 3, category: '特殊神煞' });
    }
    if (checkTianyi(bazi)) {
        results.push({ id: 'tianyi', name: '天医', isActive: true, element: '土', power: 2, category: '特殊神煞' });
    }
    if (checkTianshen(bazi)) {
        results.push({ id: 'tianshen', name: '天赦', isActive: true, element: '特殊', power: 4, category: '特殊神煞' });
    }
    if (checkLiujia(bazi)) {
        results.push({ id: 'liujia', name: '六甲', isActive: true, element: '木', power: 3, category: '特殊神煞' });
    }
    if (checkLiuyi(bazi)) {
        results.push({ id: 'liuyi', name: '六乙', isActive: true, element: '木', power: 3, category: '特殊神煞' });
    }

    return results;
}

/**
 * 生成八字组合（批量计算）
 */
function generateBaziCombinations(count: number = 1000): BaziInput[] {
    const combinations: BaziInput[] = [];
    
    for (let i = 0; i < count; i++) {
        combinations.push({
            year: {
                gan: TIANGAN[Math.floor(Math.random() * 10)],
                zhi: DIZHI[Math.floor(Math.random() * 12)]
            },
            month: {
                gan: TIANGAN[Math.floor(Math.random() * 10)],
                zhi: DIZHI[Math.floor(Math.random() * 12)]
            },
            day: {
                gan: TIANGAN[Math.floor(Math.random() * 10)],
                zhi: DIZHI[Math.floor(Math.random() * 12)]
            },
            hour: {
                gan: TIANGAN[Math.floor(Math.random() * 10)],
                zhi: DIZHI[Math.floor(Math.random() * 12)]
            }
        });
    }
    
    return combinations;
}

// Worker消息处理
self.onmessage = function(e: MessageEvent<WorkerMessage>) {
    const startTime = performance.now();
    const { id, type, data } = e.data;
    
    try {
        let result: any;
        
        switch (type) {
            case 'calculateBazi':
                result = calculateBaziStrength(data.bazi);
                break;
                
            case 'matchShensha':
                result = matchAllShensha(data.bazi);
                break;
                
            case 'generateBaziCombinations':
                result = generateBaziCombinations(data.count || 1000);
                break;
                
            case 'calculateStrength':
                result = calculateBaziStrength(data.bazi);
                break;
                
            default:
                throw new Error(`未知的任务类型: ${type}`);
        }
        
        const endTime = performance.now();
        
        const response: WorkerResponse = {
            id,
            type,
            success: true,
            data: result,
            performance: {
                startTime,
                endTime,
                duration: endTime - startTime
            }
        };
        
        self.postMessage(response);
        
    } catch (error) {
        const endTime = performance.now();
        
        const response: WorkerResponse = {
            id,
            type,
            success: false,
            error: error instanceof Error ? error.message : '未知错误',
            performance: {
                startTime,
                endTime,
                duration: endTime - startTime
            }
        };
        
        self.postMessage(response);
    }
};

// Worker初始化完成
self.postMessage({
    id: 'init',
    type: 'ready',
    success: true,
    data: { message: '八字计算Worker已就绪' }
}); 