import type { 
    CardUsageRecord, 
    CardUsageTarget, 
    GameSession, 
    UsageStatistics, 
    LZoreCard,
    GameState 
} from '../types/gameTypes';

/**
 * 卡牌历史记录管理器
 * 负责记录、存储和分析玩家的卡牌使用历史
 */
export class CardHistoryManager {
    private scene: Phaser.Scene;
    private db: IDBDatabase | null = null;
    private currentSessionId: string | null = null;
    private currentSession: GameSession | null = null;
    private showMessage: (text: string, type: 'success' | 'warning' | 'error') => void;

    constructor(
        scene: Phaser.Scene,
        showMessage: (text: string, type: 'success' | 'warning' | 'error') => void
    ) {
        this.scene = scene;
        this.showMessage = showMessage;
        this.initializeDatabase();
    }

    /**
     * 初始化IndexedDB数据库
     */
    private async initializeDatabase(): Promise<void> {
        try {
            console.log('📚 初始化卡牌历史记录数据库...');
            
            const request = indexedDB.open('LZoreCardHistory', 1);
            
            request.onerror = () => {
                console.error('❌ 历史记录数据库打开失败:', request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ 历史记录数据库初始化成功');
            };
            
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                
                // 创建卡牌使用记录表
                if (!db.objectStoreNames.contains('cardUsageRecords')) {
                    const usageStore = db.createObjectStore('cardUsageRecords', { keyPath: 'id' });
                    usageStore.createIndex('sessionId', 'sessionId', { unique: false });
                    usageStore.createIndex('timestamp', 'timestamp', { unique: false });
                    usageStore.createIndex('cardName', 'card.name', { unique: false });
                    usageStore.createIndex('user', 'user', { unique: false });
                    usageStore.createIndex('actionType', 'actionType', { unique: false });
                    console.log('✅ 创建卡牌使用记录表');
                }
                
                // 创建游戏会话表
                if (!db.objectStoreNames.contains('gameSessions')) {
                    const sessionStore = db.createObjectStore('gameSessions', { keyPath: 'id' });
                    sessionStore.createIndex('startTime', 'startTime', { unique: false });
                    sessionStore.createIndex('result', 'result', { unique: false });
                    console.log('✅ 创建游戏会话表');
                }
                
                console.log('🔄 数据库结构升级完成');
            };
        } catch (error) {
            console.error('❌ 初始化历史记录数据库失败:', error);
        }
    }

    /**
     * 开始新的游戏会话
     */
    public startGameSession(gameState: GameState, deckData?: LZoreCard[]): string {
        this.currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.currentSession = {
            id: this.currentSessionId,
            startTime: Date.now(),
            result: 'ongoing',
            totalCardsUsed: 0,
            playerCardsUsed: 0,
            opponentCardsUsed: 0,
            playerBazi: gameState.playerBazi,
            opponentBazi: gameState.opponentBazi,
            deckData: deckData,
            notes: `游戏开始 - ${new Date().toLocaleString()}`
        };
        
        console.log(`🎮 开始新游戏会话: ${this.currentSessionId}`);
        this.saveGameSession(this.currentSession);
        
        return this.currentSessionId;
    }

    /**
     * 结束当前游戏会话
     */
    public endGameSession(result: 'player_win' | 'opponent_win'): void {
        if (this.currentSession) {
            this.currentSession.endTime = Date.now();
            this.currentSession.duration = Math.floor((this.currentSession.endTime - this.currentSession.startTime) / 1000);
            this.currentSession.result = result;
            
            console.log(`🏁 游戏会话结束: ${result} (持续${this.currentSession.duration}秒)`);
            this.saveGameSession(this.currentSession);
            
            // 显示会话总结
            this.showMessage(
                `🎮 游戏结束！使用了${this.currentSession.totalCardsUsed}张卡牌，持续${this.currentSession.duration}秒`,
                result.startsWith('player') ? 'success' : 'warning'
            );
            
            this.currentSession = null;
            this.currentSessionId = null;
        }
    }

    /**
     * 记录卡牌使用
     */
    public recordCardUsage(
        card: LZoreCard,
        user: 'player' | 'opponent',
        actionType: 'damage' | 'buff' | 'special',
        targets: CardUsageTarget[],
        totalValue: number,
        gameState: GameState,
        specialEffect?: string,
        notes?: string
    ): string {
        if (!this.currentSessionId) {
            console.warn('⚠️ 没有活动的游戏会话，无法记录卡牌使用');
            return '';
        }

        const recordId = `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = Date.now();
        
        const record: CardUsageRecord = {
            id: recordId,
            sessionId: this.currentSessionId,
            card: { ...card },
            timestamp: timestamp,
            usageTime: new Date(timestamp).toLocaleString(),
            user: user,
            actionType: actionType,
            targets: [...targets],
            totalValue: totalValue,
            gamePhase: gameState.gamePhase,
            playerBazi: gameState.playerBazi,
            lifeElementStatus: {
                current: card.currentLifeElements || 0,
                max: card.maxLifeElements || 0,
                elementType: card.lifeElementGeneration?.elementType || '无'
            },
            result: {
                success: true,
                playerElementsAfter: gameState.playerRemainingElements,
                opponentElementsAfter: gameState.opponentRemainingElements,
                gameEndTriggered: gameState.gamePhase === 'ended',
                winner: gameState.gamePhase === 'ended' ? 
                    (gameState.playerRemainingElements > 0 ? 'player' : 'opponent') : undefined
            },
            specialEffect: specialEffect,
            notes: notes
        };

        // 更新当前会话统计
        if (this.currentSession) {
            this.currentSession.totalCardsUsed++;
            if (user === 'player') {
                this.currentSession.playerCardsUsed++;
            } else {
                this.currentSession.opponentCardsUsed++;
            }
        }

        console.log(`📝 记录卡牌使用: ${user} 使用 ${card.name} (${actionType})`);
        this.saveCardUsageRecord(record);
        
        // 显示记录成功消息
        this.showMessage(
            `📝 ${card.name} 使用记录已保存 (${actionType})`,
            'success'
        );

        return recordId;
    }

    /**
     * 保存卡牌使用记录到数据库
     */
    private async saveCardUsageRecord(record: CardUsageRecord): Promise<void> {
        if (!this.db) {
            console.warn('⚠️ 数据库未初始化，无法保存记录');
            return;
        }

        try {
            const transaction = this.db.transaction(['cardUsageRecords'], 'readwrite');
            const store = transaction.objectStore('cardUsageRecords');
            
            await new Promise<void>((resolve, reject) => {
                const request = store.add(record);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
            
            console.log(`✅ 卡牌使用记录已保存: ${record.id}`);
        } catch (error) {
            console.error('❌ 保存卡牌使用记录失败:', error);
        }
    }

    /**
     * 保存游戏会话到数据库
     */
    private async saveGameSession(session: GameSession): Promise<void> {
        if (!this.db) {
            console.warn('⚠️ 数据库未初始化，无法保存会话');
            return;
        }

        try {
            const transaction = this.db.transaction(['gameSessions'], 'readwrite');
            const store = transaction.objectStore('gameSessions');
            
            await new Promise<void>((resolve, reject) => {
                const request = store.put(session); // 使用put而不是add以支持更新
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
            
            console.log(`✅ 游戏会话已保存: ${session.id}`);
        } catch (error) {
            console.error('❌ 保存游戏会话失败:', error);
        }
    }

    /**
     * 获取历史记录统计
     */
    public async getUsageStatistics(timeRange?: 'today' | 'week' | 'month' | 'all'): Promise<UsageStatistics | null> {
        if (!this.db) {
            console.warn('⚠️ 数据库未初始化');
            return null;
        }

        try {
            const records = await this.getAllCardUsageRecords();
            const sessions = await this.getAllGameSessions();
            
            // 根据时间范围过滤记录
            const now = Date.now();
            const filteredRecords = timeRange ? records.filter(record => {
                const dayMs = 24 * 60 * 60 * 1000;
                switch (timeRange) {
                    case 'today':
                        return now - record.timestamp < dayMs;
                    case 'week':
                        return now - record.timestamp < 7 * dayMs;
                    case 'month':
                        return now - record.timestamp < 30 * dayMs;
                    default:
                        return true;
                }
            }) : records;

            // 计算统计数据
            const totalUsages = filteredRecords.length;
            const totalSessions = sessions.length;
            const totalWins = sessions.filter(s => s.result === 'player_win').length;
            const totalLosses = sessions.filter(s => s.result === 'opponent_win').length;
            const winRate = totalSessions > 0 ? (totalWins / totalSessions) * 100 : 0;
            
            // 计算最常使用的卡牌
            const cardUsageMap = new Map<string, { card: LZoreCard; count: number }>();
            filteredRecords.forEach(record => {
                const cardName = record.card.name;
                if (cardUsageMap.has(cardName)) {
                    cardUsageMap.get(cardName)!.count++;
                } else {
                    cardUsageMap.set(cardName, { card: record.card, count: 1 });
                }
            });
            
            const mostUsedCards = Array.from(cardUsageMap.values())
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            // 计算最高伤害和增益记录
            const damageRecords = filteredRecords.filter(r => r.actionType === 'damage');
            const buffRecords = filteredRecords.filter(r => r.actionType === 'buff');
            
            const highestDamage = damageRecords.length > 0 
                ? damageRecords.reduce((max, record) => 
                    record.totalValue > max.value ? { value: record.totalValue, record } : max,
                    { value: 0, record: damageRecords[0] })
                : { value: 0, record: filteredRecords[0] || {} as CardUsageRecord };
                
            const highestBuff = buffRecords.length > 0
                ? buffRecords.reduce((max, record) => 
                    record.totalValue > max.value ? { value: record.totalValue, record } : max,
                    { value: 0, record: buffRecords[0] })
                : { value: 0, record: filteredRecords[0] || {} as CardUsageRecord };

            // 按卡牌类型统计
            const byCardType = {
                auspicious: filteredRecords.filter(r => r.card.type === 'auspicious').length,
                inauspicious: filteredRecords.filter(r => r.card.type === 'inauspicious').length,
                special: filteredRecords.filter(r => r.actionType === 'special').length
            };

            // 按时间段统计
            const byTimePeriod = {
                today: records.filter(r => now - r.timestamp < 24 * 60 * 60 * 1000).length,
                thisWeek: records.filter(r => now - r.timestamp < 7 * 24 * 60 * 60 * 1000).length,
                thisMonth: records.filter(r => now - r.timestamp < 30 * 24 * 60 * 60 * 1000).length,
                allTime: records.length
            };

            const statistics: UsageStatistics = {
                totalUsages,
                totalSessions,
                totalWins,
                totalLosses,
                winRate: Math.round(winRate * 100) / 100,
                avgCardsPerSession: totalSessions > 0 ? Math.round((totalUsages / totalSessions) * 100) / 100 : 0,
                mostUsedCards,
                highestDamage,
                highestBuff,
                byCardType,
                byTimePeriod
            };

            console.log('📊 历史记录统计计算完成:', statistics);
            return statistics;
            
        } catch (error) {
            console.error('❌ 获取历史记录统计失败:', error);
            return null;
        }
    }

    /**
     * 获取所有卡牌使用记录
     */
    public async getAllCardUsageRecords(): Promise<CardUsageRecord[]> {
        if (!this.db) return [];

        try {
            const transaction = this.db.transaction(['cardUsageRecords'], 'readonly');
            const store = transaction.objectStore('cardUsageRecords');
            
            return new Promise<CardUsageRecord[]>((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('❌ 获取卡牌使用记录失败:', error);
            return [];
        }
    }

    /**
     * 获取所有游戏会话
     */
    public async getAllGameSessions(): Promise<GameSession[]> {
        if (!this.db) return [];

        try {
            const transaction = this.db.transaction(['gameSessions'], 'readonly');
            const store = transaction.objectStore('gameSessions');
            
            return new Promise<GameSession[]>((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('❌ 获取游戏会话失败:', error);
            return [];
        }
    }

    /**
     * 根据会话ID获取使用记录
     */
    public async getRecordsBySession(sessionId: string): Promise<CardUsageRecord[]> {
        if (!this.db) return [];

        try {
            const transaction = this.db.transaction(['cardUsageRecords'], 'readonly');
            const store = transaction.objectStore('cardUsageRecords');
            const index = store.index('sessionId');
            
            return new Promise<CardUsageRecord[]>((resolve, reject) => {
                const request = index.getAll(sessionId);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('❌ 获取会话记录失败:', error);
            return [];
        }
    }

    /**
     * 清除历史记录
     */
    public async clearHistory(confirmCallback?: () => boolean): Promise<boolean> {
        if (confirmCallback && !confirmCallback()) {
            return false;
        }

        if (!this.db) {
            console.warn('⚠️ 数据库未初始化');
            return false;
        }

        try {
            const transaction = this.db.transaction(['cardUsageRecords', 'gameSessions'], 'readwrite');
            
            await Promise.all([
                new Promise<void>((resolve, reject) => {
                    const request = transaction.objectStore('cardUsageRecords').clear();
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                }),
                new Promise<void>((resolve, reject) => {
                    const request = transaction.objectStore('gameSessions').clear();
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                })
            ]);

            console.log('🗑️ 历史记录已清除');
            this.showMessage('🗑️ 历史记录已清除', 'success');
            return true;
            
        } catch (error) {
            console.error('❌ 清除历史记录失败:', error);
            this.showMessage('❌ 清除历史记录失败', 'error');
            return false;
        }
    }

    /**
     * 导出历史记录为JSON
     */
    public async exportHistory(): Promise<string | null> {
        try {
            const records = await this.getAllCardUsageRecords();
            const sessions = await this.getAllGameSessions();
            const statistics = await this.getUsageStatistics();
            
            const exportData = {
                exportTime: new Date().toISOString(),
                version: '1.0',
                records,
                sessions,
                statistics
            };
            
            const jsonString = JSON.stringify(exportData, null, 2);
            console.log('📤 历史记录已导出为JSON');
            this.showMessage('📤 历史记录导出成功', 'success');
            
            return jsonString;
            
        } catch (error) {
            console.error('❌ 导出历史记录失败:', error);
            this.showMessage('❌ 导出历史记录失败', 'error');
            return null;
        }
    }

    /**
     * 获取当前会话ID
     */
    public getCurrentSessionId(): string | null {
        return this.currentSessionId;
    }

    /**
     * 获取当前会话信息
     */
    public getCurrentSession(): GameSession | null {
        return this.currentSession;
    }
} 