/**
 * L-Zore神煞系统类型定义
 */

export interface ShenshaRecord {
    id: string;
    name: string;
    category: '吉星吉神' | '凶星凶神' | '特殊神煞';
    rarity: '⭐' | '⭐⭐' | '⭐⭐⭐';
    element: '火' | '水' | '木' | '金' | '土' | '特殊';
    power: number; // 威力值
    lookupMethod: string; // 查法
    meaning: string; // 含义
    gameEffect: string; // 游戏效果
    type: 'auspicious' | 'inauspicious' | 'special';
    detailedLookup: {
        method: string;
        conditions: string[];
        examples?: string[];
    };
}

export interface BaziInput {
    year: { gan: string, zhi: string };
    month: { gan: string, zhi: string };
    day: { gan: string, zhi: string };
    hour: { gan: string, zhi: string };
}

export interface DatabaseStatistics {
    total: number;
    byCategory: { [key: string]: number };
    byRarity: { [key: string]: number };
    byElement: { [key: string]: number };
}

export type ShenshaCategory = '吉星吉神' | '凶星凶神' | '特殊神煞';
export type ShenshaRarity = '⭐' | '⭐⭐' | '⭐⭐⭐';
export type ShenshaElement = '火' | '水' | '木' | '金' | '土' | '特殊';
export type ShenshaType = 'auspicious' | 'inauspicious' | 'special';

export interface ShenshaChecker {
    checkCondition(shensha: ShenshaRecord, bazi: BaziInput): boolean;
} 