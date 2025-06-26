/**
 * L-Zore神煞数据库系统 - 统一导出
 * 重构后的模块化架构
 */

// 类型定义
export type {
    ShenshaRecord,
    BaziInput,
    DatabaseStatistics,
    ShenshaCategory,
    ShenshaRarity,
    ShenshaElement,
    ShenshaType,
    ShenshaChecker
} from './types/ShenshaTypes';

// 神煞数据
export { auspiciousShenshaData } from './data/AuspiciousShenshaData';
export { inauspiciousShenshaData } from './data/InauspiciousShenshaData';
export { specialShenshaData } from './data/SpecialShenshaData';

// 检查器
export { BaseShenshaChecker } from './checkers/BaseShenshaChecker';
export { InauspiciousShenshaChecker } from './checkers/InauspiciousShenshaChecker';
export { SpecialShenshaChecker } from './checkers/SpecialShenshaChecker';

// 核心数据库类（保持原有接口兼容性）
export { ShenshaDatabase } from './ShenshaDatabase';

// 数据库单例实例
export { shenshaDB } from './ShenshaDatabase';