/**
 * 凶星凶神检查器 - 凶星凶神类检查方法
 */

import type { BaziInput } from '../types/ShenshaTypes';

export class InauspiciousShenshaChecker {
    /**
     * 检查羊刃
     */
    static checkYangren(dayGan: string, allZhi: string[]): boolean {
        const yangRen: { [key: string]: string } = {
            '甲': '卯', '乙': '寅', '丙': '午', '戊': '午', '丁': '巳',
            '己': '巳', '庚': '酉', '辛': '申', '壬': '子', '癸': '亥'
        };
        
        return allZhi.includes(yangRen[dayGan]);
    }

    /**
     * 检查劫煞
     */
    static checkJiesha(allZhi: string[]): boolean {
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
    static checkWangshen(allZhi: string[]): boolean {
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
    static checkXianchi(allZhi: string[]): boolean {
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
    static checkKongwang(day: { gan: string, zhi: string }): boolean {
        // 简化的空亡查法 - 按日柱所在旬
        const xunKong: { [key: string]: string[] } = {
            '甲子': ['戌', '亥'], '甲戌': ['申', '酉'], '甲申': ['午', '未'],
            '甲午': ['辰', '巳'], '甲辰': ['寅', '卯'], '甲寅': ['子', '丑']
        };
        
        // 找到日柱所在旬
        const dayPillar = day.gan + day.zhi;
        for (const [xun, kongZhi] of Object.entries(xunKong)) {
            if (dayPillar >= xun && dayPillar < this.getNextXun(xun)) {
                return kongZhi.includes(day.zhi);
            }
        }
        return false;
    }

    /**
     * 检查白虎
     */
    static checkBaihu(allZhi: string[]): boolean {
        const baiHu = [
            { sanHe: ['申', '子', '辰'], hu: '申' },
            { sanHe: ['亥', '卯', '未'], hu: '亥' },
            { sanHe: ['寅', '午', '戌'], hu: '寅' },
            { sanHe: ['巳', '酉', '丑'], hu: '巳' }
        ];
        
        for (const { sanHe, hu } of baiHu) {
            if (sanHe.some(zhi => allZhi.includes(zhi)) && allZhi.includes(hu)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查灾煞
     */
    static checkZaishan(allZhi: string[]): boolean {
        const zaiShan = [
            { sanHe: ['申', '子', '辰'], zai: '午' },
            { sanHe: ['亥', '卯', '未'], zai: '酉' },
            { sanHe: ['寅', '午', '戌'], zai: '子' },
            { sanHe: ['巳', '酉', '丑'], zai: '卯' }
        ];
        
        for (const { sanHe, zai } of zaiShan) {
            if (sanHe.some(zhi => allZhi.includes(zhi)) && allZhi.includes(zai)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查天坑
     */
    static checkTiankeng(dayGan: string, allZhi: string[]): boolean {
        const conditions: { [key: string]: string } = {
            '甲': '戌', '乙': '亥', '丙': '子', '丁': '丑',
            '戊': '寅', '己': '卯', '庚': '辰', '辛': '巳',
            '壬': '午', '癸': '未'
        };
        const requiredZhi = conditions[dayGan];
        return requiredZhi ? allZhi.includes(requiredZhi) : false;
    }

    /**
     * 检查孤辰寡宿
     */
    static checkGuchensugu(yearZhi: string, allZhi: string[]): boolean {
        const guChenSuGu = [
            { group: ['亥', '子', '丑'], guchen: '寅', sugu: '戌' },
            { group: ['寅', '卯', '辰'], guchen: '巳', sugu: '丑' },
            { group: ['巳', '午', '未'], guchen: '申', sugu: '辰' },
            { group: ['申', '酉', '戌'], guchen: '亥', sugu: '未' }
        ];
        
        for (const { group, guchen, sugu } of guChenSuGu) {
            if (group.includes(yearZhi)) {
                return allZhi.includes(guchen) || allZhi.includes(sugu);
            }
        }
        return false;
    }

    /**
     * 检查披麻
     */
    static checkPili(allZhi: string[]): boolean {
        const piLi = [
            { sanHe: ['申', '子', '辰'], pi: '未' },
            { sanHe: ['亥', '卯', '未'], pi: '戌' },
            { sanHe: ['寅', '午', '戌'], pi: '丑' },
            { sanHe: ['巳', '酉', '丑'], pi: '辰' }
        ];
        
        for (const { sanHe, pi } of piLi) {
            if (sanHe.some(zhi => allZhi.includes(zhi)) && allZhi.includes(pi)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查飞刃
     */
    static checkFeixing(dayGan: string, allZhi: string[]): boolean {
        const conditions: { [key: string]: string } = {
            '甲': '申', '乙': '酉', '丙': '亥', '丁': '子',
            '戊': '亥', '己': '子', '庚': '寅', '辛': '卯',
            '壬': '巳', '癸': '午'
        };
        const requiredZhi = conditions[dayGan];
        return requiredZhi ? allZhi.includes(requiredZhi) : false;
    }

    /**
     * 检查血刃
     */
    static checkXueren(allZhi: string[]): boolean {
        const chongPairs = [
            ['子', '午'], ['丑', '未'], ['寅', '申'],
            ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
        ];
        
        for (const [zhi1, zhi2] of chongPairs) {
            if (allZhi.includes(zhi1) && allZhi.includes(zhi2)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查破军
     */
    static checkPojun(allZhi: string[]): boolean {
        return this.checkXueren(allZhi); // 与血刃查法相同，都是相冲
    }

    /**
     * 检查大煞
     */
    static checkDasha(allZhi: string[]): boolean {
        return this.checkPili(allZhi); // 与披麻查法相同
    }

    /**
     * 检查五鬼
     */
    static checkWugui(dayGan: string, allGan: string[]): boolean {
        const conditions: { [key: string]: string[] } = {
            '甲': ['戊'], '乙': ['己'], '丙': ['庚'], '丁': ['辛'],
            '戊': ['壬'], '己': ['癸'], '庚': ['甲'], '辛': ['乙'],
            '壬': ['丙'], '癸': ['丁']
        };
        const requiredGan = conditions[dayGan];
        return requiredGan ? requiredGan.some(gan => allGan.includes(gan)) : false;
    }

    /**
     * 获取下一旬
     */
    private static getNextXun(xun: string): string {
        const xunOrder = ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'];
        const index = xunOrder.indexOf(xun);
        return index < xunOrder.length - 1 ? xunOrder[index + 1] : '甲子';
    }
} 