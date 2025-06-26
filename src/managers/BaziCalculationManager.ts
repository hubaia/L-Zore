/**
 * 八字计算管理器 - 处理所有八字相关的计算逻辑
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class BaziCalculationManager {
    private scene: Phaser.Scene;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
    
    /**
     * 根据八字计算玩家能量
     */
    calculatePlayerEnergy(playerBazi: any): number {
        // 统计玩家八字中的五行分布
        const elements = this.countBaZiElements(playerBazi);
        // 计算能量：五行平衡度越高，能量越强
        const totalElements = Object.values(elements).reduce((sum, count) => sum + count, 0);
        const balance = this.calculateElementBalance(elements);
        return Math.floor((totalElements + balance) * 5); // 基础能量计算
    }
    
    /**
     * 计算五行平衡度
     */
    calculateElementBalance(elements: { [element: string]: number }): number {
        const values = Object.values(elements);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
        return Math.max(0, 10 - variance); // 方差越小，平衡度越高
    }
    
    /**
     * 统计八字的五行分布
     */
    countBaZiElements(baZi: any): { [element: string]: number } {
        const elementCount: { [element: string]: number } = {
            '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
        };
        
        // 统计四柱的天干地支五行
        const pillars = [baZi.year, baZi.month, baZi.day, baZi.hour];
        
        pillars.forEach(pillar => {
            // 统计天干和地支的五行
            const ganElement = this.getGanElement(pillar.gan);
            const zhiElement = this.getZhiElement(pillar.zhi);
            
            elementCount[ganElement] = (elementCount[ganElement] || 0) + 1;
            elementCount[zhiElement] = (elementCount[zhiElement] || 0) + 1;
        });
        
        return elementCount;
    }
    
    /**
     * 获取天干对应五行
     */
    getGanElement(gan: string): string {
        const ganElements: { [key: string]: string } = {
            '甲': '木', '乙': '木',
            '丙': '火', '丁': '火', 
            '戊': '土', '己': '土',
            '庚': '金', '辛': '金',
            '壬': '水', '癸': '水'
        };
        return ganElements[gan] || '土';
    }
    
    /**
     * 获取地支对应五行
     */
    getZhiElement(zhi: string): string {
        const zhiElements: { [key: string]: string } = {
            '子': '水', '丑': '土', '寅': '木', '卯': '木',
            '辰': '土', '巳': '火', '午': '火', '未': '土',
            '申': '金', '酉': '金', '戌': '土', '亥': '水'
        };
        return zhiElements[zhi] || '土';
    }
    
    /**
     * 获取八字显示文本
     */
    getBaZiDisplayText(bazi: any): string {
        if (!bazi || !bazi.year || !bazi.month || !bazi.day || !bazi.hour) {
            return '八字未设置';
        }
        
        return `${bazi.year.gan}${bazi.year.zhi} ${bazi.month.gan}${bazi.month.zhi} ${bazi.day.gan}${bazi.day.zhi} ${bazi.hour.gan}${bazi.hour.zhi}`;
    }
    
    /**
     * 获取柱位名称
     */
    getPillarName(position: number): string {
        const names = ['年柱', '月柱', '日柱', '时柱'];
        return names[position % 4];
    }
    
    /**
     * 计算五行相生相克关系
     */
    calculateElementRelation(element1: string, element2: string): 'generate' | 'overcome' | 'neutral' {
        // 相生关系：木生火，火生土，土生金，金生水，水生木
        const generateRelations: { [key: string]: string } = {
            '木': '火',
            '火': '土',
            '土': '金',
            '金': '水',
            '水': '木'
        };
        
        // 相克关系：木克土，土克水，水克火，火克金，金克木
        const overcomeRelations: { [key: string]: string } = {
            '木': '土',
            '土': '水',
            '水': '火',
            '火': '金',
            '金': '木'
        };
        
        if (generateRelations[element1] === element2) {
            return 'generate';
        } else if (overcomeRelations[element1] === element2) {
            return 'overcome';
        } else {
            return 'neutral';
        }
    }
    
    /**
     * 计算八字强弱
     */
    calculateBaziStrength(bazi: any): {
        dayMasterElement: string;
        strength: 'strong' | 'medium' | 'weak';
        supportElements: string[];
        drainElements: string[];
    } {
        // 日主（日柱天干）
        const dayMaster = bazi.day.gan;
        const dayMasterElement = this.getGanElement(dayMaster);
        
        // 统计五行分布
        const elements = this.countBaZiElements(bazi);
        
        // 计算日主得生得助的力量
        let supportPower = elements[dayMasterElement] || 0;
        
        // 相生的元素
        const supportElements: string[] = [];
        Object.keys(elements).forEach(element => {
            const relation = this.calculateElementRelation(element, dayMasterElement);
            if (relation === 'generate') {
                supportPower += elements[element];
                supportElements.push(element);
            }
        });
        
        // 相克的元素
        const drainElements: string[] = [];
        Object.keys(elements).forEach(element => {
            const relation = this.calculateElementRelation(dayMasterElement, element);
            if (relation === 'overcome') {
                drainElements.push(element);
            }
        });
        
        // 判断强弱
        let strength: 'strong' | 'medium' | 'weak';
        if (supportPower >= 6) {
            strength = 'strong';
        } else if (supportPower >= 3) {
            strength = 'medium';
        } else {
            strength = 'weak';
        }
        
        return {
            dayMasterElement,
            strength,
            supportElements,
            drainElements
        };
    }
    
    /**
     * 计算八字喜用神
     */
    calculateUsefulGods(bazi: any): {
        favorableElements: string[];
        unfavorableElements: string[];
    } {
        const strength = this.calculateBaziStrength(bazi);
        
        let favorableElements: string[] = [];
        let unfavorableElements: string[] = [];
        
        if (strength.strength === 'strong') {
            // 身强用官杀、食伤、财星
            favorableElements = strength.drainElements;
            unfavorableElements = strength.supportElements;
        } else if (strength.strength === 'weak') {
            // 身弱用印比
            favorableElements = strength.supportElements;
            unfavorableElements = strength.drainElements;
        } else {
            // 中和，平衡使用
            favorableElements = [...strength.supportElements, ...strength.drainElements];
        }
        
        return {
            favorableElements,
            unfavorableElements
        };
    }
    
    /**
     * 计算八字月份藏干
     */
    getMonthlyHiddenStems(monthZhi: string): string[] {
        const hiddenStems: { [key: string]: string[] } = {
            '子': ['癸'],
            '丑': ['己', '癸', '辛'],
            '寅': ['甲', '丙', '戊'],
            '卯': ['乙'],
            '辰': ['戊', '乙', '癸'],
            '巳': ['丙', '庚', '戊'],
            '午': ['丁', '己'],
            '未': ['己', '丁', '乙'],
            '申': ['庚', '壬', '戊'],
            '酉': ['辛'],
            '戌': ['戊', '辛', '丁'],
            '亥': ['壬', '甲']
        };
        
        return hiddenStems[monthZhi] || [];
    }
    
    /**
     * 计算神煞
     */
    calculateShensha(bazi: any): Array<{
        name: string;
        type: 'auspicious' | 'inauspicious';
        description: string;
        pillar: string;
    }> {
        const shensha: Array<{
            name: string;
            type: 'auspicious' | 'inauspicious';
            description: string;
            pillar: string;
        }> = [];
        
        // 这里实现具体的神煞推算逻辑
        // 暂时返回一些示例神煞
        
        const dayGan = bazi.day.gan;
        const yearZhi = bazi.year.zhi;
        
        // 天乙贵人（简化版）
        const tianyi: { [key: string]: string[] } = {
            '甲': ['丑', '未'],
            '乙': ['子', '申'],
            '丙': ['亥', '酉'],
            '丁': ['亥', '酉'],
            '戊': ['丑', '未'],
            '己': ['子', '申'],
            '庚': ['丑', '未'],
            '辛': ['午', '寅'],
            '壬': ['卯', '巳'],
            '癸': ['卯', '巳']
        };
        
        if (tianyi[dayGan]?.includes(yearZhi)) {
            shensha.push({
                name: '天乙贵人',
                type: 'auspicious',
                description: '得贵人相助，逢凶化吉',
                pillar: '年柱'
            });
        }
        
        return shensha;
    }
    
    /**
     * 验证八字数据完整性
     */
    validateBazi(bazi: any): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];
        
        if (!bazi) {
            errors.push('八字数据不存在');
            return { isValid: false, errors };
        }
        
        const requiredPillars = ['year', 'month', 'day', 'hour'];
        requiredPillars.forEach(pillar => {
            if (!bazi[pillar]) {
                errors.push(`缺少${pillar}柱数据`);
            } else {
                if (!bazi[pillar].gan) {
                    errors.push(`${pillar}柱缺少天干`);
                }
                if (!bazi[pillar].zhi) {
                    errors.push(`${pillar}柱缺少地支`);
                }
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
} 