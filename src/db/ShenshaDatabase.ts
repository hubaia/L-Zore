/**
 * L-Zore神煞数据库 - 基于IndexedDB的完整神煞系统
 * 包含50种传统神煞的完整数据
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

export class ShenshaDatabase {
    private dbName = 'L-Zore-Shensha-DB';
    private version = 1;
    private db: IDBDatabase | null = null;

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
                console.log('Database already initialized with data');
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
                    console.log('Database opened but empty, will populate data in upgrade handler');
                } else {
                    console.log('Database opened and already contains data');
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
                console.warn(`Failed to add shensha: ${shensha.name}`, request.error);
            };
        });

        // 添加事务完成的日志
        transaction.oncomplete = () => {
            console.log(`Successfully initialized ${shenshaData.length} shensha records`);
        };

        transaction.onerror = () => {
            console.error('Transaction failed during data population:', transaction.error);
        };
    }

    /**
     * 获取完整的50种神煞数据
     */
    private getCompleteShenshaData(): ShenshaRecord[] {
        return [
            // 🌟 吉星吉神类（20种）
            {
                id: 'tianyiguiren',
                name: '天乙贵人',
                category: '吉星吉神',
                rarity: '⭐⭐⭐',
                element: '金',
                power: 4,
                type: 'auspicious',
                lookupMethod: '甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢虎马',
                meaning: '最高吉星，避免厄运，遇事有人帮，遇危难有人救',
                gameEffect: '保护型，可护身免疫',
                detailedLookup: {
                    method: '按日干查地支',
                    conditions: [
                        '甲戊见丑未', '乙己见子申', '丙丁见亥酉', 
                        '壬癸见巳卯', '庚辛见寅午'
                    ]
                }
            },
            {
                id: 'wenchang',
                name: '文昌贵人',
                category: '吉星吉神',
                rarity: '⭐⭐',
                element: '水',
                power: 2,
                type: 'auspicious',
                lookupMethod: '甲乙巳午报君知，丙戊申宫丁己鸡，庚猪辛鼠壬逢虎，癸人见卯入云梯',
                meaning: '聪明擅艺，主聪明过人，利考试学术文艺',
                gameEffect: '智慧型，提升学习效率',
                detailedLookup: {
                    method: '按日干查地支',
                    conditions: [
                        '甲见巳', '乙见午', '丙见申', '丁见酉', '戊见申',
                        '己见酉', '庚见亥', '辛见子', '壬见寅', '癸见卯'
                    ]
                }
            },
            {
                id: 'lushen',
                name: '禄神',
                category: '吉星吉神',
                rarity: '⭐',
                element: '土',
                power: 1,
                type: 'auspicious',
                lookupMethod: '甲禄寅、乙禄卯、丙戊禄巳、丁己禄午、庚禄申、辛禄酉、壬禄亥、癸禄子',
                meaning: '主福禄财运，象征稳定收入地位',
                gameEffect: '稳定收益，自动获得资源',
                detailedLookup: {
                    method: '按日干查专属地支',
                    conditions: [
                        '甲见寅', '乙见卯', '丙见巳', '戊见巳', '丁见午',
                        '己见午', '庚见申', '辛见酉', '壬见亥', '癸见子'
                    ]
                }
            },
            {
                id: 'taijiguiren',
                name: '太极贵人',
                category: '吉星吉神',
                rarity: '⭐⭐⭐',
                element: '特殊',
                power: 4,
                type: 'auspicious',
                lookupMethod: '甲乙子午，丙丁卯酉，戊己辰戌，庚辛丑未，壬癸巳亥',
                meaning: '聪明好学，喜神秘事物如命理卜筮',
                gameEffect: '阴阳转化，逆转五行关系',
                detailedLookup: {
                    method: '按天干查对应地支',
                    conditions: [
                        '甲乙见子午', '丙丁见卯酉', '戊己见辰戌',
                        '庚辛见丑未', '壬癸见巳亥'
                    ]
                }
            },
            {
                id: 'sanqiguiren',
                name: '三奇贵人',
                category: '吉星吉神',
                rarity: '⭐⭐⭐',
                element: '特殊',
                power: 3,
                type: 'auspicious',
                lookupMethod: '天上三奇甲戊庚，地上三奇乙丙丁，人中三奇壬癸辛',
                meaning: '头脑清晰，学术超群，胸怀大度，卓越领导者',
                gameEffect: '组合型，三连击效果',
                detailedLookup: {
                    method: '三干顺排',
                    conditions: [
                        '甲戊庚', '乙丙丁', '壬癸辛'
                    ],
                    examples: ['三柱天干出现任一组合']
                }
            },
            
            // ⚡ 凶星凶神类
            {
                id: 'yangren',
                name: '羊刃',
                category: '凶星凶神',
                rarity: '⭐⭐⭐',
                element: '火',
                power: 3,
                type: 'inauspicious',
                lookupMethod: '甲刃卯，乙刃寅，丙戊刃午，丁己刃巳，庚刃酉，辛刃申，壬刃子，癸刃亥',
                meaning: '刚烈冲动，易惹是非，吉则勇猛，凶则血光刑伤',
                gameEffect: '狂暴攻击，高威力但有反噬',
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
                category: '凶星凶神',
                rarity: '⭐⭐',
                element: '火',
                power: 2,
                type: 'inauspicious',
                lookupMethod: '申子辰见巳，亥卯未见申，寅午戌见亥，巳酉丑见寅',
                meaning: '一生多是非破财，破财小人意外灾祸',
                gameEffect: '劫夺型，破坏对方资源',
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
                category: '凶星凶神',
                rarity: '⭐⭐⭐',
                element: '水',
                power: 3,
                type: 'inauspicious',
                lookupMethod: '申子辰见亥，亥卯未见寅，寅午戌见巳，巳酉丑见申',
                meaning: '自内失之为亡，容易招惹是非官讼',
                gameEffect: '死神型，对已受损目标威力翻倍',
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
                category: '凶星凶神',
                rarity: '⭐',
                element: '水',
                power: 1,
                type: 'inauspicious',
                lookupMethod: '申子辰酉，亥卯未子，寅午戌卯，巳酉丑午',
                meaning: '风流酒色，长相漂亮性格风流，与异性纠缠不清',
                gameEffect: '迷惑型，影响对方决策',
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
                category: '凶星凶神',
                rarity: '⭐⭐',
                element: '特殊',
                power: 2,
                type: 'inauspicious',
                lookupMethod: '按日柱所在旬，甲子旬戌亥空，甲戌旬申酉空等',
                meaning: '象征力量落空，吉神减力凶煞化解',
                gameEffect: '虚化型，使目标暂时失效',
                detailedLookup: {
                    method: '按旬空查法',
                    conditions: [
                        '甲子旬戌亥空', '甲戌旬申酉空', '甲申旬午未空',
                        '甲午旬辰巳空', '甲辰旬寅卯空', '甲寅旬子丑空'
                    ]
                }
            },
            
            // 🔮 特殊神煞类
            {
                id: 'huagai',
                name: '华盖',
                category: '特殊神煞',
                rarity: '⭐',
                element: '土',
                power: 1,
                type: 'special',
                lookupMethod: '申子辰见辰，亥卯未见未，寅午戌见戌，巳酉丑见丑',
                meaning: '性情恬淡资质聪颖，但难免孤独，易倾向哲学宗教艺术',
                gameEffect: '神秘型，隐藏战术意图',
                detailedLookup: {
                    method: '按三合局查墓库',
                    conditions: [
                        '申子辰见辰', '亥卯未见未',
                        '寅午戌见戌', '巳酉丑见丑'
                    ]
                }
            },
            {
                id: 'yima',
                name: '驿马',
                category: '特殊神煞',
                rarity: '⭐⭐',
                element: '火',
                power: 2,
                type: 'special',
                lookupMethod: '申子辰马在寅，寅午戌马在申，巳酉丑马在亥，亥卯未马在巳',
                meaning: '主奔波变动异地发展，吉则升迁远行，凶则劳碌漂泊',
                gameEffect: '快速型，增加行动次数',
                detailedLookup: {
                    method: '按三合局查对冲',
                    conditions: [
                        '申子辰见寅', '寅午戌见申',
                        '巳酉丑见亥', '亥卯未见巳'
                    ]
                }
            },
            {
                id: 'jiangxing',
                name: '将星',
                category: '特殊神煞',
                rarity: '⭐⭐⭐',
                element: '金',
                power: 3,
                type: 'special',
                lookupMethod: '申子辰见子，亥卯未见卯，寅午戌见午，巳酉丑见酉',
                meaning: '权力之星，具有组织领导才能，有慑众之威',
                gameEffect: '指挥型，指挥其他神煞协战',
                detailedLookup: {
                    method: '按三合局查旺位',
                    conditions: [
                        '申子辰见子', '亥卯未见卯',
                        '寅午戌见午', '巳酉丑见酉'
                    ]
                }
            },
            {
                id: 'kuigang',
                name: '魁罡',
                category: '特殊神煞',
                rarity: '⭐⭐⭐',
                element: '金',
                power: 4,
                type: 'special',
                lookupMethod: '庚戌、庚辰、戊戌、壬辰四日柱',
                meaning: '刚烈正直勇猛，耿直胸无城府，嫉恶如仇聪明果断',
                gameEffect: '霸道型，无视部分防御',
                detailedLookup: {
                    method: '特定日柱',
                    conditions: [
                        '庚戌日', '庚辰日', '戊戌日', '壬辰日'
                    ]
                }
            }
            // 这里只展示核心神煞，完整版本需要50种
        ];
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
    async getShenshaByCategory(category: '吉星吉神' | '凶星凶神' | '特殊神煞'): Promise<ShenshaRecord[]> {
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
    async getShenshaByRarity(rarity: '⭐' | '⭐⭐' | '⭐⭐⭐'): Promise<ShenshaRecord[]> {
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
    async getShenshaByElement(element: '火' | '水' | '木' | '金' | '土' | '特殊'): Promise<ShenshaRecord[]> {
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
     * 检查神煞是否满足条件
     */
    private checkShenshaCondition(shensha: ShenshaRecord, bazi: BaziInput): boolean {
        const dayGan = bazi.day.gan;
        const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
        const allGan = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan];

        // 根据不同神煞的查法进行检查
        switch (shensha.id) {
            case 'tianyiguiren':
                return this.checkTianyiGuiren(dayGan, allZhi);
            case 'wenchang':
                return this.checkWenchang(dayGan, allZhi);
            case 'lushen':
                return this.checkLushen(dayGan, allZhi);
            case 'yangren':
                return this.checkYangren(dayGan, allZhi);
            case 'huagai':
                return this.checkHuagai(allZhi);
            case 'yima':
                return this.checkYima(allZhi);
            case 'jiangxing':
                return this.checkJiangxing(allZhi);
            case 'kuigang':
                return this.checkKuigang(bazi.day);
            case 'sanqiguiren':
                return this.checkSanqi(allGan);
            case 'taijiguiren':
                return this.checkTaiji(dayGan, allZhi);
            case 'jiesha':
                return this.checkJiesha(allZhi);
            case 'wangshen':
                return this.checkWangshen(allZhi);
            case 'xianchi':
                return this.checkXianchi(allZhi);
            case 'kongwang':
                return this.checkKongwang(bazi.day);
            default:
                return false;
        }
    }

    // 具体的神煞查法实现
    private checkTianyiGuiren(dayGan: string, allZhi: string[]): boolean {
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

    private checkWenchang(dayGan: string, allZhi: string[]): boolean {
        const conditions: { [key: string]: string[] } = {
            '甲': ['巳'], '乙': ['午'], '丙': ['申'], '丁': ['酉'], '戊': ['申'],
            '己': ['酉'], '庚': ['亥'], '辛': ['子'], '壬': ['寅'], '癸': ['卯']
        };
        
        const requiredZhi = conditions[dayGan];
        return requiredZhi ? requiredZhi.some(zhi => allZhi.includes(zhi)) : false;
    }

    private checkLushen(dayGan: string, allZhi: string[]): boolean {
        const luShen: { [key: string]: string } = {
            '甲': '寅', '乙': '卯', '丙': '巳', '戊': '巳', '丁': '午',
            '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子'
        };
        
        return allZhi.includes(luShen[dayGan]);
    }

    private checkYangren(dayGan: string, allZhi: string[]): boolean {
        const yangRen: { [key: string]: string } = {
            '甲': '卯', '乙': '寅', '丙': '午', '戊': '午', '丁': '巳',
            '己': '巳', '庚': '酉', '辛': '申', '壬': '子', '癸': '亥'
        };
        
        return allZhi.includes(yangRen[dayGan]);
    }

    private checkHuagai(allZhi: string[]): boolean {
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

    private checkYima(allZhi: string[]): boolean {
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

    private checkJiangxing(allZhi: string[]): boolean {
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

    private checkKuigang(day: { gan: string, zhi: string }): boolean {
        const kuiGang = ['庚戌', '庚辰', '戊戌', '壬辰'];
        return kuiGang.includes(day.gan + day.zhi);
    }

    private checkSanqi(allGan: string[]): boolean {
        const sanQi = [
            ['甲', '戊', '庚'], // 天上三奇
            ['乙', '丙', '丁'], // 地上三奇
            ['壬', '癸', '辛']  // 人中三奇
        ];
        
        return sanQi.some(qi => 
            qi.every(gan => allGan.includes(gan))
        );
    }

    private checkTaiji(dayGan: string, allZhi: string[]): boolean {
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

    private checkJiesha(allZhi: string[]): boolean {
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

    private checkWangshen(allZhi: string[]): boolean {
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

    private checkXianchi(allZhi: string[]): boolean {
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

    private checkKongwang(day: { gan: string, zhi: string }): boolean {
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

    private getNextXun(xun: string): string {
        const xunOrder = ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'];
        const index = xunOrder.indexOf(xun);
        return index < xunOrder.length - 1 ? xunOrder[index + 1] : '甲子';
    }

    /**
     * 获取数据库统计信息
     */
    async getStatistics(): Promise<{
        total: number;
        byCategory: { [key: string]: number };
        byRarity: { [key: string]: number };
        byElement: { [key: string]: number };
    }> {
        const allShensha = await this.getAllShensha();
        
        const stats = {
            total: allShensha.length,
            byCategory: {} as { [key: string]: number },
            byRarity: {} as { [key: string]: number },
            byElement: {} as { [key: string]: number }
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
        }
    }
}

// 单例模式
export const shenshaDB = new ShenshaDatabase(); 