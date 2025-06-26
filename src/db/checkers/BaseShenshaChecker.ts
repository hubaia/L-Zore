/**
 * 基础神煞检查器 - 吉星吉神类检查方法
 */

import type { BaziInput } from '../types/ShenshaTypes';

export class BaseShenshaChecker {
    /**
     * 检查天乙贵人
     */
    static checkTianyiGuiren(dayGan: string, allZhi: string[]): boolean {
        const conditions: { [key: string]: string[] } = {
            '甲': ['丑', '未'], '戊': ['丑', '未'],
            '乙': ['子', '申'], '己': ['子', '申'],
            '丙': ['亥', '酉'], '丁': ['亥', '酉'],
            '壬': ['巳', '卯'], '癸': ['巳', '卯'],
            '庚': ['寅', '午'], '辛': ['寅', '午']
        };
        
        const requiredZhi = conditions[dayGan];
        return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
    }

    /**
     * 检查文昌贵人
     */
    static checkWenchang(dayGan: string, allZhi: string[]): boolean {
        const conditions: { [key: string]: string[] } = {
            '甲': ['巳'], '乙': ['午'], '丙': ['申'], '丁': ['酉'], '戊': ['申'],
            '己': ['酉'], '庚': ['亥'], '辛': ['子'], '壬': ['寅'], '癸': ['卯']
        };
        
        const requiredZhi = conditions[dayGan];
        return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
    }

    /**
     * 检查禄神
     */
    static checkLushen(dayGan: string, allZhi: string[]): boolean {
        const luShen: { [key: string]: string } = {
            '甲': '寅', '乙': '卯', '丙': '巳', '戊': '巳', '丁': '午',
            '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子'
        };
        
        return allZhi.includes(luShen[dayGan]);
    }

    /**
     * 检查太极贵人
     */
    static checkTaiji(dayGan: string, allZhi: string[]): boolean {
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
    static checkSanqi(allGan: string[]): boolean {
        const sanQi = [
            ['甲', '戊', '庚'], // 天上三奇
            ['乙', '丙', '丁'], // 地上三奇
            ['壬', '癸', '辛']  // 人中三奇
        ];
        
        return sanQi.some(qi => 
            qi.every(gan => allGan.includes(gan))
        );
    }

    /**
     * 检查福德来麻贵人
     */
    static checkFudelaima(dayGan: string, allZhi: string[]): boolean {
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
    static checkYuede(month: { zhi: string }, allGan: string[]): boolean {
        const conditions: { [key: string]: string[] } = {
            '寅': ['丙'], '卯': ['甲'], '辰': ['壬'], '巳': ['庚'],
            '午': ['己'], '未': ['甲'], '申': ['壬'], '酉': ['丁'],
            '戌': ['甲'], '亥': ['庚'], '子': ['己'], '丑': ['丙']
        };
        const requiredGan = conditions[month.zhi];
        return requiredGan ? requiredGan.some(gan => allGan.includes(gan)) : false;
    }

    /**
     * 检查天德贵人
     */
    static checkTiande(month: { zhi: string }, allGan: string[], allZhi: string[]): boolean {
        const conditions: { [key: string]: string[] } = {
            '寅': ['丁'], '卯': ['申'], '辰': ['壬'], '巳': ['辛'],
            '午': ['亥'], '未': ['甲'], '申': ['癸'], '酉': ['寅'],
            '戌': ['丙'], '亥': ['乙'], '子': ['巳'], '丑': ['庚']
        };
        const required = conditions[month.zhi];
        if (!required) return false;
        return required.some(item => 
            allGan.includes(item) || allZhi.includes(item)
        );
    }

    /**
     * 检查学堂
     */
    static checkXuetang(dayGan: string, allZhi: string[]): boolean {
        const conditions: { [key: string]: string[] } = {
            '甲': ['巳'], '乙': ['午'], '丙': ['寅'], '丁': ['卯'],
            '戊': ['寅'], '己': ['卯'], '庚': ['亥'], '辛': ['子'],
            '壬': ['申'], '癸': ['酉']
        };
        const requiredZhi = conditions[dayGan];
        return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
    }

    /**
     * 检查贵人相
     */
    static checkGuirenxiang(bazi: BaziInput): boolean {
        // 简化检查：如果有天乙贵人就认为有贵人相
        return this.checkTianyiGuiren(bazi.day.gan, [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi]);
    }

    /**
     * 检查金舆
     */
    static checkJinyu(dayGan: string, allZhi: string[]): boolean {
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
    static checkTianxi(dayZhi: string, allZhi: string[]): boolean {
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
    static checkHongluan(yearZhi: string, allZhi: string[]): boolean {
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
    static checkTianchu(dayGan: string, allZhi: string[]): boolean {
        const conditions: { [key: string]: string[] } = {
            '甲': ['巳'], '乙': ['午'], '丙': ['戌'], '丁': ['亥'],
            '戊': ['戌'], '己': ['亥'], '庚': ['丑'], '辛': ['寅'],
            '壬': ['辰'], '癸': ['未']
        };
        const requiredZhi = conditions[dayGan];
        return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
    }
} 