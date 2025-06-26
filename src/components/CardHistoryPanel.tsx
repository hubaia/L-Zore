import React, { useState, useEffect } from 'react';
import type { 
    CardUsageRecord, 
    GameSession, 
    UsageStatistics, 
    LZoreCard 
} from '../types/gameTypes';

interface CardHistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    historyManager: any; // CardHistoryManager实例
}

/**
 * 卡牌历史记录面板组件
 */
export const CardHistoryPanel: React.FC<CardHistoryPanelProps> = ({
    isOpen,
    onClose,
    historyManager
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'sessions' | 'stats'>('overview');
    const [records, setRecords] = useState<CardUsageRecord[]>([]);
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [statistics, setStatistics] = useState<UsageStatistics | null>(null);
    const [loading, setLoading] = useState(false);
    const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // 加载数据
    useEffect(() => {
        if (isOpen && historyManager) {
            loadAllData();
        }
    }, [isOpen, historyManager, timeFilter]);

    // 添加ESC键关闭功能
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                console.log('🔄 ESC键关闭历史记录面板');
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            // 阻止页面滚动
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            // 恢复页面滚动
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [recordsData, sessionsData, statisticsData] = await Promise.all([
                historyManager.getAllCardUsageRecords(),
                historyManager.getAllGameSessions(),
                historyManager.getUsageStatistics(timeFilter)
            ]);
            
            setRecords(recordsData || []);
            setSessions(sessionsData || []);
            setStatistics(statisticsData);
        } catch (error) {
            console.error('❌ 加载历史数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 背景点击关闭处理
    const handleBackgroundClick = (e: React.MouseEvent) => {
        // 只有点击背景时才关闭，点击内容区域不关闭
        if (e.target === e.currentTarget) {
            console.log('🔄 背景点击关闭历史记录面板');
            onClose();
        }
    };

    // 过滤记录
    const filteredRecords = records.filter(record => {
        const matchesSearch = searchTerm === '' || 
            record.card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.actionType.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSession = !selectedSession || record.sessionId === selectedSession;
        
        return matchesSearch && matchesSession;
    });

    // 格式化时间
    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('zh-CN');
    };

    // 格式化持续时间
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}分${remainingSeconds}秒`;
    };

    // 导出历史记录
    const handleExport = async () => {
        try {
            const jsonData = await historyManager.exportHistory();
            if (jsonData) {
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `lzore-history-${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log('📤 历史记录导出成功');
            }
        } catch (error) {
            console.error('❌ 导出历史记录失败:', error);
        }
    };

    // 清除历史记录
    const handleClearHistory = async () => {
        const confirmed = window.confirm('确定要清除所有历史记录吗？此操作无法撤销。');
        if (confirmed) {
            try {
                const success = await historyManager.clearHistory(() => true);
                if (success) {
                    loadAllData();
                    console.log('🗑️ 历史记录清除成功');
                }
            } catch (error) {
                console.error('❌ 清除历史记录失败:', error);
            }
        }
    };

    if (!isOpen) return null;

    console.log('🔄 CardHistoryPanel 渲染中，isOpen:', isOpen);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] animate-in fade-in duration-300"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-panel-title"
            style={{ zIndex: 9999 }} // 强制设置最高层级
        >
            <div 
                className="bg-gray-900 rounded-xl shadow-2xl w-11/12 h-5/6 max-w-6xl border border-purple-500/30 overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-500"
                onClick={(e) => e.stopPropagation()} // 阻止内容区域点击冒泡
            >
                {/* 头部 */}
                <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 border-b border-purple-500/30">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 id="history-panel-title" className="text-2xl font-bold text-white mb-1">📚 卡牌使用历史记录</h2>
                            <p className="text-purple-200 text-sm">查看您的神煞卡牌使用历史与统计分析 (ESC 或点击背景关闭)</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('🔄 点击×按钮关闭历史记录面板');
                                onClose();
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="group text-white hover:text-red-400 transition-all duration-300 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400/50 relative z-10 cursor-pointer"
                            aria-label="关闭历史记录面板"
                            type="button"
                        >
                            <span className="group-hover:rotate-90 transition-transform duration-300 pointer-events-none select-none">✕</span>
                        </button>
                    </div>
                </div>

                {/* 标签导航 */}
                <div className="bg-gray-800 border-b border-gray-700">
                    <div className="flex">
                        {[
                            { key: 'overview', label: '📊 总览', icon: '📊' },
                            { key: 'records', label: '📝 使用记录', icon: '📝' },
                            { key: 'sessions', label: '🎮 游戏会话', icon: '🎮' },
                            { key: 'stats', label: '📈 统计分析', icon: '📈' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                                    activeTab === tab.key
                                        ? 'text-purple-400 border-purple-400 bg-gray-700'
                                        : 'text-gray-300 border-transparent hover:text-white hover:border-gray-600'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                                <p className="text-gray-300">加载历史数据中...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto p-6">
                            {/* 总览标签 */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* 快速统计卡片 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-500/30">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">📝</span>
                                                <div>
                                                    <p className="text-blue-200 text-sm">总使用次数</p>
                                                    <p className="text-white text-2xl font-bold">{statistics?.totalUsages || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-500/30">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">🎮</span>
                                                <div>
                                                    <p className="text-green-200 text-sm">游戏会话数</p>
                                                    <p className="text-white text-2xl font-bold">{statistics?.totalSessions || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-4 border border-yellow-500/30">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">🏆</span>
                                                <div>
                                                    <p className="text-yellow-200 text-sm">胜率</p>
                                                    <p className="text-white text-2xl font-bold">{statistics?.winRate || 0}%</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-500/30">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">📊</span>
                                                <div>
                                                    <p className="text-purple-200 text-sm">平均每局卡牌</p>
                                                    <p className="text-white text-2xl font-bold">{statistics?.avgCardsPerSession || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 最常使用的卡牌 */}
                                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                        <h3 className="text-xl font-bold text-white mb-4">🌟 最常使用的神煞</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {statistics?.mostUsedCards?.slice(0, 6).map((item, index) => (
                                                <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-white font-semibold">{item.card.name}</p>
                                                            <p className="text-gray-300 text-sm">{item.card.type === 'auspicious' ? '🌟 吉神' : '⚡ 凶神'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-purple-400 text-xl font-bold">{item.count}</p>
                                                            <p className="text-gray-400 text-xs">次</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) || []}
                                        </div>
                                    </div>

                                    {/* 记录分布 */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                            <h3 className="text-xl font-bold text-white mb-4">🎯 按行动类型</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-red-400">⚔️ 伤害类</span>
                                                    <span className="text-white font-bold">{statistics?.byCardType.inauspicious || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-green-400">✨ 增益类</span>
                                                    <span className="text-white font-bold">{statistics?.byCardType.auspicious || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-purple-400">🔮 特殊类</span>
                                                    <span className="text-white font-bold">{statistics?.byCardType.special || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                            <h3 className="text-xl font-bold text-white mb-4">📅 按时间段</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-blue-400">🕐 今天</span>
                                                    <span className="text-white font-bold">{statistics?.byTimePeriod.today || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-cyan-400">📅 本周</span>
                                                    <span className="text-white font-bold">{statistics?.byTimePeriod.thisWeek || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-purple-400">📅 本月</span>
                                                    <span className="text-white font-bold">{statistics?.byTimePeriod.thisMonth || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-yellow-400">🌟 总计</span>
                                                    <span className="text-white font-bold">{statistics?.byTimePeriod.allTime || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 使用记录标签 */}
                            {activeTab === 'records' && (
                                <div className="space-y-4">
                                    {/* 筛选控件 */}
                                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                        <div className="flex flex-wrap gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-1">时间范围</label>
                                                <select
                                                    value={timeFilter}
                                                    onChange={(e) => setTimeFilter(e.target.value as any)}
                                                    className="bg-gray-700 text-white rounded px-3 py-1 border border-gray-600"
                                                >
                                                    <option value="all">全部时间</option>
                                                    <option value="today">今天</option>
                                                    <option value="week">本周</option>
                                                    <option value="month">本月</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-1">游戏会话</label>
                                                <select
                                                    value={selectedSession || ''}
                                                    onChange={(e) => setSelectedSession(e.target.value || null)}
                                                    className="bg-gray-700 text-white rounded px-3 py-1 border border-gray-600"
                                                >
                                                    <option value="">全部会话</option>
                                                    {sessions.map(session => (
                                                        <option key={session.id} value={session.id}>
                                                            {formatTime(session.startTime)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <label className="block text-sm text-gray-300 mb-1">搜索</label>
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="搜索卡牌名称或行动类型..."
                                                    className="w-full bg-gray-700 text-white rounded px-3 py-1 border border-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 记录列表 */}
                                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                                        <div className="max-h-96 overflow-y-auto">
                                            {filteredRecords.length > 0 ? (
                                                <div className="space-y-2 p-4">
                                                    {filteredRecords.map(record => (
                                                        <div key={record.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-lg">
                                                                            {record.card.type === 'auspicious' ? '🌟' : '⚡'}
                                                                        </span>
                                                                        <h4 className="text-white font-bold">{record.card.name}</h4>
                                                                        <span className={`px-2 py-1 rounded text-xs ${
                                                                            record.actionType === 'damage' ? 'bg-red-900 text-red-200' :
                                                                            record.actionType === 'buff' ? 'bg-green-900 text-green-200' :
                                                                            'bg-purple-900 text-purple-200'
                                                                        }`}>
                                                                            {record.actionType === 'damage' ? '伤害' : 
                                                                             record.actionType === 'buff' ? '增益' : '特殊'}
                                                                        </span>
                                                                        <span className={`px-2 py-1 rounded text-xs ${
                                                                            record.user === 'player' ? 'bg-blue-900 text-blue-200' : 'bg-orange-900 text-orange-200'
                                                                        }`}>
                                                                            {record.user === 'player' ? '玩家' : '对手'}
                                                                        </span>
                                                                    </div>
                                                                    
                                                                    <div className="text-sm text-gray-300 space-y-1">
                                                                        <p>⏰ 时间: {record.usageTime}</p>
                                                                        <p>🎯 目标: {record.targets.length}个 | 总数值: {record.totalValue}</p>
                                                                        <p>⚡ 元素: {record.lifeElementStatus.current}/{record.lifeElementStatus.max} ({record.lifeElementStatus.elementType})</p>
                                                                        {record.specialEffect && (
                                                                            <p>🔮 特效: {record.specialEffect}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="text-right text-sm">
                                                                    <div className={`font-bold ${
                                                                        record.result.success ? 'text-green-400' : 'text-red-400'
                                                                    }`}>
                                                                        {record.result.success ? '✅ 成功' : '❌ 失败'}
                                                                    </div>
                                                                    <p className="text-gray-400">
                                                                        玩家: {record.result.playerElementsAfter}
                                                                    </p>
                                                                    <p className="text-gray-400">
                                                                        对手: {record.result.opponentElementsAfter}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <span className="text-6xl mb-4 block">📝</span>
                                                    <p className="text-gray-400">没有找到匹配的使用记录</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 游戏会话标签 */}
                            {activeTab === 'sessions' && (
                                <div className="space-y-4">
                                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                                        <div className="max-h-96 overflow-y-auto p-4">
                                            {sessions.length > 0 ? (
                                                <div className="space-y-4">
                                                    {sessions.map(session => (
                                                        <div key={session.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <h4 className="text-white font-bold text-lg">
                                                                        🎮 游戏会话 #{session.id.slice(-8)}
                                                                    </h4>
                                                                    <p className="text-gray-300 text-sm">
                                                                        {formatTime(session.startTime)}
                                                                        {session.endTime && (
                                                                            <> - {formatTime(session.endTime)}</>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className={`px-3 py-1 rounded text-sm font-bold ${
                                                                        session.result === 'player_win' ? 'bg-green-900 text-green-200' :
                                                                        session.result === 'opponent_win' ? 'bg-red-900 text-red-200' :
                                                                        'bg-yellow-900 text-yellow-200'
                                                                    }`}>
                                                                        {session.result === 'player_win' ? '🏆 胜利' :
                                                                         session.result === 'opponent_win' ? '💀 失败' :
                                                                         '⏳ 进行中'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-gray-400">持续时间</p>
                                                                    <p className="text-white font-bold">
                                                                        {session.duration ? formatDuration(session.duration) : '进行中'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-400">总卡牌数</p>
                                                                    <p className="text-white font-bold">{session.totalCardsUsed}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-400">玩家使用</p>
                                                                    <p className="text-blue-400 font-bold">{session.playerCardsUsed}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-400">对手使用</p>
                                                                    <p className="text-orange-400 font-bold">{session.opponentCardsUsed}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            {session.notes && (
                                                                <div className="mt-3 pt-3 border-t border-gray-600">
                                                                    <p className="text-gray-300 text-sm">{session.notes}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <span className="text-6xl mb-4 block">🎮</span>
                                                    <p className="text-gray-400">暂无游戏会话记录</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 统计分析标签 */}
                            {activeTab === 'stats' && statistics && (
                                <div className="space-y-6">
                                    {/* 记录排行榜 */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                            <h3 className="text-xl font-bold text-white mb-4">🏆 最高伤害记录</h3>
                                            {statistics.highestDamage.record && (
                                                <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-2xl">⚔️</span>
                                                        <div>
                                                            <h4 className="text-white font-bold">{statistics.highestDamage.record.card?.name}</h4>
                                                            <p className="text-red-200 text-sm">{statistics.highestDamage.record.usageTime}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-red-400 text-2xl font-bold">
                                                        {statistics.highestDamage.value} 炁克
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                            <h3 className="text-xl font-bold text-white mb-4">✨ 最高增益记录</h3>
                                            {statistics.highestBuff.record && (
                                                <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-2xl">✨</span>
                                                        <div>
                                                            <h4 className="text-white font-bold">{statistics.highestBuff.record.card?.name}</h4>
                                                            <p className="text-green-200 text-sm">{statistics.highestBuff.record.usageTime}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-green-400 text-2xl font-bold">
                                                        {statistics.highestBuff.value} 炁克
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 详细统计表格 */}
                                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                        <h3 className="text-xl font-bold text-white mb-4">📊 详细统计信息</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                            <div>
                                                <h4 className="text-purple-400 font-bold mb-2">⚔️ 战斗统计</h4>
                                                <div className="space-y-1">
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-300">胜利场次:</span>
                                                        <span className="text-green-400 font-bold">{statistics.totalWins}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-300">失败场次:</span>
                                                        <span className="text-red-400 font-bold">{statistics.totalLosses}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-300">胜率:</span>
                                                        <span className="text-yellow-400 font-bold">{statistics.winRate}%</span>
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-purple-400 font-bold mb-2">🎴 卡牌统计</h4>
                                                <div className="space-y-1">
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-300">总使用次数:</span>
                                                        <span className="text-white font-bold">{statistics.totalUsages}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-300">平均每局:</span>
                                                        <span className="text-cyan-400 font-bold">{statistics.avgCardsPerSession}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-300">游戏会话:</span>
                                                        <span className="text-blue-400 font-bold">{statistics.totalSessions}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-purple-400 font-bold mb-2">🕐 时间统计</h4>
                                                <div className="space-y-1">
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-300">今日:</span>
                                                        <span className="text-blue-400 font-bold">{statistics.byTimePeriod.today}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-300">本周:</span>
                                                        <span className="text-cyan-400 font-bold">{statistics.byTimePeriod.thisWeek}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-300">本月:</span>
                                                        <span className="text-purple-400 font-bold">{statistics.byTimePeriod.thisMonth}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 底部操作栏 */}
                <div className="bg-gray-800 border-t border-gray-700 p-4">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                            {loading ? '加载中...' : `共 ${records.length} 条记录，${sessions.length} 个会话`}
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={loadAllData}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                🔄 刷新
                            </button>
                            
                            <button
                                onClick={handleExport}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                📤 导出
                            </button>
                            
                            <button
                                onClick={handleClearHistory}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                🗑️ 清除
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 