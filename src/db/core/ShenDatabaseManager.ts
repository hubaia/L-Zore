/**
 * L-Zore神煞数据库管理器 - 拆分重构后的核心类
 */

import type { 
    ShenshaRecord, 
    BaziInput, 
    DatabaseStatistics,
    ShenshaCategory,
    ShenshaRarity,
    ShenshaElement
} from '../types/ShenshaTypes';

import { auspiciousShenshaData } from '../data/AuspiciousShenshaData';
import { inauspiciousShenshaData } from '../data/InauspiciousShenshaData';
import { specialShenshaData } from '../data/SpecialShenshaData';

import { BaseShenshaChecker } from '../checkers/BaseShenshaChecker';
import { InauspiciousShenshaChecker } from '../checkers/InauspiciousShenshaChecker';
import { SpecialShenshaChecker } from '../checkers/SpecialShenshaChecker';

export class ShenDatabaseManager {
    private dbName = 'L-Zore-Shensha-DB';
    private version = 2; // 升级版本以支持50种神煞
    private db: IDBDatabase | null = null;

    /**
     * 获取完整的50种神煞数据
     */
    private getCompleteShenshaData(): ShenshaRecord[] {
        return [
            ...auspiciousShenshaData,    // 14种吉星吉神
            ...inauspiciousShenshaData,  // 15种凶星凶神
            ...specialShenshaData        // 15种特殊神煞
        ];
    }

    /**
     * 检查数据库是否已初始化
     */
    private async isDatabaseInitialized(): Promise<boolean> {
        if (!this.db) return false;
        
        try {
            const count = await this.getRecordCount();
            return count > 0;
        } catch (error) {
            console.warn('Failed to check database initialization status:', error);
            return false;
        }
    }

    /**
     * 获取数据库记录数量
     */
    private async getRecordCount(): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['shensha'], 'readonly');
            const store = transaction.objectStore('shensha');
            const request = store.count();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 初始化数据库
     */
    async initialize(): Promise<void> {
        // 如果数据库已经初始化且有数据，直接返回
        if (this.db) {
            const isInitialized = await this.isDatabaseInitialized();
            if (isInitialized) {
                console.log('🗄️ 神煞数据库已初始化');
                return;
            }
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = async () => {
                this.db = request.result;
                
                // 检查是否需要填充数据（用于版本升级后的情况）
                const isInitialized = await this.isDatabaseInitialized();
                if (!isInitialized) {
                    console.log('🗄️ 数据库已打开但为空，将在升级处理程序中填充数据');
                } else {
                    console.log('🗄️ 数据库已打开且包含数据');
                }
                
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = (event.target as IDBOpenDBRequest).transaction!;
                
                // 创建神煞表
                let store: IDBObjectStore;
                if (!db.objectStoreNames.contains('shensha')) {
                    store = db.createObjectStore('shensha', { keyPath: 'id' });
                    store.createIndex('category', 'category', { unique: false });
                    store.createIndex('rarity', 'rarity', { unique: false });
                    store.createIndex('element', 'element', { unique: false });
                    store.createIndex('type', 'type', { unique: false });
                    store.createIndex('power', 'power', { unique: false });
                    
                    // 使用现有的版本更改事务来初始化数据
                    this.populateInitialData(transaction);
                } else {
                    // 如果表已存在，检查是否需要填充数据
                    store = transaction.objectStore('shensha');
                    const countRequest = store.count();
                    countRequest.onsuccess = () => {
                        if (countRequest.result === 0) {
                            // 数据库为空，填充初始数据
                            this.populateInitialData(transaction);
                        }
                    };
                }
            };
        });
    }

    /**
     * 填充初始神煞数据
     */
    private populateInitialData(transaction: IDBTransaction): void {
        const store = transaction.objectStore('shensha');

        // 获取完整神煞数据
        const shenshaData = this.getCompleteShenshaData();

        // 批量插入数据
        shenshaData.forEach(shensha => {
            const request = store.add(shensha);
            request.onerror = () => {
                console.warn(`⚠️ 添加神煞失败: ${shensha.name}`, request.error);
            };
        });

        // 添加事务完成的日志
        transaction.oncomplete = () => {
            console.log(`✅ 成功初始化 ${shenshaData.length} 种神煞记录`);
        };

        transaction.onerror = () => {
            console.error('❌ 数据填充事务失败:', transaction.error);
        };
    }

    /**
     * 获取所有神煞
     */
    async getAllShensha(): Promise<ShenshaRecord[]> {
        if (!this.db) throw new Error('Database not initialized');
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['shensha'], 'readonly');
            const store = transaction.objectStore('shensha');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 按分类获取神煞
     */
    async getShenshaByCategory(category: ShenshaCategory): Promise<ShenshaRecord[]> {
        if (!this.db) throw new Error('Database not initialized');
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['shensha'], 'readonly');
            const store = transaction.objectStore('shensha');
            const index = store.index('category');
            const request = index.getAll(category);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 按稀有度获取神煞
     */
    async getShenshaByRarity(rarity: ShenshaRarity): Promise<ShenshaRecord[]> {
        if (!this.db) throw new Error('Database not initialized');
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['shensha'], 'readonly');
            const store = transaction.objectStore('shensha');
            const index = store.index('rarity');
            const request = index.getAll(rarity);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 按五行获取神煞
     */
    async getShenshaByElement(element: ShenshaElement): Promise<ShenshaRecord[]> {
        if (!this.db) throw new Error('Database not initialized');
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['shensha'], 'readonly');
            const store = transaction.objectStore('shensha');
            const index = store.index('element');
            const request = index.getAll(element);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 根据八字查找符合条件的神煞
     */
    async findShenshaForBazi(bazi: BaziInput): Promise<ShenshaRecord[]> {
        const allShensha = await this.getAllShensha();
        const matchingShensha: ShenshaRecord[] = [];

        for (const shensha of allShensha) {
            if (this.checkShenshaCondition(shensha, bazi)) {
                matchingShensha.push(shensha);
            }
        }

        return matchingShensha;
    }

    /**
     * 检查神煞是否满足条件 - 使用拆分的检查器
     */
    private checkShenshaCondition(shensha: ShenshaRecord, bazi: BaziInput): boolean {
        const dayGan = bazi.day.gan;
        const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
        const allGan = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan];

        // 根据不同神煞的查法进行检查，使用拆分的检查器
        switch (shensha.id) {
            // 🌟 吉星吉神类 - 使用BaseShenshaChecker
            case 'tianyiguiren':
                return BaseShenshaChecker.checkTianyiGuiren(dayGan, allZhi);
            case 'wenchang':
                return BaseShenshaChecker.checkWenchang(dayGan, allZhi);
            case 'lushen':
                return BaseShenshaChecker.checkLushen(dayGan, allZhi);
            case 'taijiguiren':
                return BaseShenshaChecker.checkTaiji(dayGan, allZhi);
            case 'sanqiguiren':
                return BaseShenshaChecker.checkSanqi(allGan);
            case 'fudelaimaguiren':
                return BaseShenshaChecker.checkFudelaima(dayGan, allZhi);
            case 'yuedeguiren':
                return BaseShenshaChecker.checkYuede(bazi.month, allGan);
            case 'tiandeguiren':
                return BaseShenshaChecker.checkTiande(bazi.month, allGan, allZhi);
            case 'xuetang':
                return BaseShenshaChecker.checkXuetang(dayGan, allZhi);
            case 'guirenxiang':
                return BaseShenshaChecker.checkGuirenxiang(bazi);
            case 'jinyu':
                return BaseShenshaChecker.checkJinyu(dayGan, allZhi);
            case 'tianxi':
                return BaseShenshaChecker.checkTianxi(bazi.day.zhi, allZhi);
            case 'hongluan':
                return BaseShenshaChecker.checkHongluan(bazi.year.zhi, allZhi);
            case 'tianchu':
                return BaseShenshaChecker.checkTianchu(dayGan, allZhi);

            // ⚡ 凶星凶神类 - 使用InauspiciousShenshaChecker
            case 'yangren':
                return InauspiciousShenshaChecker.checkYangren(dayGan, allZhi);
            case 'jiesha':
                return InauspiciousShenshaChecker.checkJiesha(allZhi);
            case 'wangshen':
                return InauspiciousShenshaChecker.checkWangshen(allZhi);
            case 'xianchi':
                return InauspiciousShenshaChecker.checkXianchi(allZhi);
            case 'kongwang':
                return InauspiciousShenshaChecker.checkKongwang(bazi.day);
            case 'baihu':
                return InauspiciousShenshaChecker.checkBaihu(allZhi);
            case 'zaishan':
                return InauspiciousShenshaChecker.checkZaishan(allZhi);
            case 'tiankeng':
                return InauspiciousShenshaChecker.checkTiankeng(dayGan, allZhi);
            case 'guchensugu':
                return InauspiciousShenshaChecker.checkGuchensugu(bazi.year.zhi, allZhi);
            case 'pili':
                return InauspiciousShenshaChecker.checkPili(allZhi);
            case 'feixing':
                return InauspiciousShenshaChecker.checkFeixing(dayGan, allZhi);
            case 'xueren':
                return InauspiciousShenshaChecker.checkXueren(allZhi);
            case 'pojun':
                return InauspiciousShenshaChecker.checkPojun(allZhi);
            case 'dasha':
                return InauspiciousShenshaChecker.checkDasha(allZhi);
            case 'wugui':
                return InauspiciousShenshaChecker.checkWugui(dayGan, allGan);

            // 🔮 特殊神煞类 - 使用SpecialShenshaChecker
            case 'huagai':
                return SpecialShenshaChecker.checkHuagai(allZhi);
            case 'yima':
                return SpecialShenshaChecker.checkYima(allZhi);
            case 'jiangxing':
                return SpecialShenshaChecker.checkJiangxing(allZhi);
            case 'kuigang':
                return SpecialShenshaChecker.checkKuigang(bazi.day);
            case 'tianya':
                return SpecialShenshaChecker.checkTianya(allZhi);
            case 'diwan':
                return SpecialShenshaChecker.checkDiwan(allZhi);
            case 'tianluo':
                return SpecialShenshaChecker.checkTianluo(allZhi);
            case 'guluan':
                return SpecialShenshaChecker.checkGuluan(bazi.day);
            case 'yinyangerror':
                return SpecialShenshaChecker.checkYinyangerror(bazi.day);
            case 'jianfeng':
                return SpecialShenshaChecker.checkJianfeng(bazi.day);
            case 'tianji':
                return SpecialShenshaChecker.checkTianji(dayGan, allZhi);
            case 'tianyi':
                return SpecialShenshaChecker.checkTianyi(bazi.month.zhi, allZhi);
            case 'tianshen':
                return SpecialShenshaChecker.checkTianshen(bazi.day, bazi.month);
            case 'liujia':
                return SpecialShenshaChecker.checkLiujia(bazi.day);
            case 'liuyi':
                return SpecialShenshaChecker.checkLiuyi(bazi.day);

            default:
                console.warn(`⚠️ 未识别的神煞ID: ${shensha.id}`);
                return false;
        }
    }

    /**
     * 获取数据库统计信息
     */
    async getStatistics(): Promise<DatabaseStatistics> {
        const allShensha = await this.getAllShensha();
        
        const stats: DatabaseStatistics = {
            total: allShensha.length,
            byCategory: {},
            byRarity: {},
            byElement: {}
        };

        allShensha.forEach(shensha => {
            stats.byCategory[shensha.category] = (stats.byCategory[shensha.category] || 0) + 1;
            stats.byRarity[shensha.rarity] = (stats.byRarity[shensha.rarity] || 0) + 1;
            stats.byElement[shensha.element] = (stats.byElement[shensha.element] || 0) + 1;
        });

        return stats;
    }

    /**
     * 关闭数据库连接
     */
    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
            console.log('🗄️ 神煞数据库连接已关闭');
        }
    }
} 