/**
 * 特殊神煞检查器 - 特殊神煞类检查方法
 */

import type { BaziInput } from '../types/ShenshaTypes';

export class SpecialShenshaChecker {
    /**
     * 检查华盖
     */
    static checkHuagai(allZhi: string[]): boolean {
        // 三合局见墓库
        const sanHeKu = [
            { sanhe: ['申', '子', '辰'], ku: '辰' },
            { sanhe: ['亥', '卯', '未'], ku: '未' },
            { sanhe: ['寅', '午', '戌'], ku: '戌' },
            { sanhe: ['巳', '酉', '丑'], ku: '丑' }
        ];
        
        for (const { sanhe, ku } of sanHeKu) {
            if (sanhe.some(zhi => allZhi.includes(zhi)) && allZhi.includes(ku)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查驿马
     */
    static checkYima(allZhi: string[]): boolean {
        // 三合局对冲为驿马
        const yiMa = [
            { sanHe: ['申', '子', '辰'], ma: '寅' },
            { sanHe: ['寅', '午', '戌'], ma: '申' },
            { sanHe: ['巳', '酉', '丑'], ma: '亥' },
            { sanHe: ['亥', '卯', '未'], ma: '巳' }
        ];
        
        for (const { sanHe, ma } of yiMa) {
            if (sanHe.some(zhi => allZhi.includes(zhi)) && allZhi.includes(ma)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查将星
     */
    static checkJiangxing(allZhi: string[]): boolean {
        // 三合局旺位
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
    static checkKuigang(day: { gan: string, zhi: string }): boolean {
        const kuiGang = ['庚戌', '庚辰', '戊戌', '壬辰'];
        return kuiGang.includes(day.gan + day.zhi);
    }

    /**
     * 检查天涯
     */
    static checkTianya(allZhi: string[]): boolean {
        const tianYa = [
            { sanHe: ['寅', '午', '戌'], ya: '亥' },
            { sanHe: ['申', '子', '辰'], ya: '巳' },
            { sanHe: ['巳', '酉', '丑'], ya: '寅' },
            { sanHe: ['亥', '卯', '未'], ya: '申' }
        ];
        
        for (const { sanHe, ya } of tianYa) {
            if (sanHe.some(zhi => allZhi.includes(zhi)) && allZhi.includes(ya)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查地网
     */
    static checkDiwan(allZhi: string[]): boolean {
        return allZhi.includes('辰') || allZhi.includes('戌');
    }

    /**
     * 检查天罗
     */
    static checkTianluo(allZhi: string[]): boolean {
        return allZhi.includes('戌') || allZhi.includes('亥');
    }

    /**
     * 检查孤鸾
     */
    static checkGuluan(day: { gan: string, zhi: string }): boolean {
        const guLuan = [
            '乙巳', '丁巳', '辛亥', '戊申',
            '甲寅', '戊午', '壬子', '丙午'
        ];
        return guLuan.includes(day.gan + day.zhi);
    }

    /**
     * 检查阴阳差错
     */
    static checkYinyangerror(day: { gan: string, zhi: string }): boolean {
        const yinYangError = [
            '丙子', '丁丑', '戊寅', '辛卯',
            '壬辰', '癸巳', '丙午', '丁未',
            '戊申', '辛酉', '壬戌', '癸亥'
        ];
        return yinYangError.includes(day.gan + day.zhi);
    }

    /**
     * 检查剑锋
     */
    static checkJianfeng(day: { gan: string, zhi: string }): boolean {
        const jianFeng = ['壬申', '癸酉'];
        return jianFeng.includes(day.gan + day.zhi);
    }

    /**
     * 检查天机
     */
    static checkTianji(dayGan: string, allZhi: string[]): boolean {
        const conditions: { [key: string]: string[] } = {
            '甲': ['子'], '戊': ['子'], '庚': ['子'],
            '乙': ['酉'], '己': ['酉'], '辛': ['酉'],
            '丙': ['卯'], '壬': ['卯'],
            '丁': ['午'], '癸': ['午']
        };
        const requiredZhi = conditions[dayGan];
        return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
    }

    /**
     * 检查天医
     */
    static checkTianyi(monthZhi: string, allZhi: string[]): boolean {
        const tianYi = [
            '丑', '寅', '卯', '辰', '巳', '午',
            '未', '申', '酉', '戌', '亥', '子'
        ];
        const monthIndex = tianYi.indexOf(monthZhi);
        if (monthIndex === -1) return false;
        
        const yiZhi = tianYi[monthIndex]; // 简化处理
        return allZhi.includes(yiZhi);
    }

    /**
     * 检查天赦
     */
    static checkTianshen(day: { gan: string, zhi: string }, month: { zhi: string }): boolean {
        const tianShen: { [key: string]: string } = {
            '寅': '戊寅', '卯': '戊寅', '辰': '戊寅', // 春季
            '巳': '甲午', '午': '甲午', '未': '甲午', // 夏季
            '申': '戊申', '酉': '戊申', '戌': '戊申', // 秋季
            '亥': '甲子', '子': '甲子', '丑': '甲子'  // 冬季
        };
        const requiredDay = tianShen[month.zhi];
        return requiredDay === (day.gan + day.zhi);
    }

    /**
     * 检查六甲
     */
    static checkLiujia(day: { gan: string, zhi: string }): boolean {
        const liuJia = ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'];
        return liuJia.includes(day.gan + day.zhi);
    }

    /**
     * 检查六乙
     */
    static checkLiuyi(day: { gan: string, zhi: string }): boolean {
        const liuYi = ['乙丑', '乙亥', '乙酉', '乙未', '乙巳', '乙卯'];
        return liuYi.includes(day.gan + day.zhi);
    }
} 