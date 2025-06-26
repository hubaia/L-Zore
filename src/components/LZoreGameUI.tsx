import React, { useState } from 'react';
import { useCurrentScene, useEvent, useRelativeScale } from 'phaser-react-ui';
import { CardHistoryPanel } from './CardHistoryPanel';

/**
 * L-Zore游戏UI组件
 * 使用phaser-react-ui管理游戏内UI
 */
export const LZoreGameUI: React.FC = () => {
    const scene = useCurrentScene();
    const ref = useRelativeScale<HTMLDivElement>({
        target: 1920,
        min: 0.5,
        max: 1.5
    });

    // 游戏状态 - 即时系统
    const [gameState, setGameState] = useState({
        playerHealth: 100,
        opponentHealth: 100,
        playerEnergy: 50,
        currentTurn: 1,
        playerHandCount: 5,
        isPlayerTurn: true,
        battlefieldCards: 0,
        
        // 即时系统状态
        gameTime: 0,
        playerCooldown: 0,
        opponentCooldown: 0,
        activePlayer: 'none' as 'player' | 'opponent' | 'none',
        priorityHolder: 'none' as 'player' | 'opponent' | 'none',
        
        // 八字信息
        playerBazi: {
            year: { gan: '甲', zhi: '子' },
            month: { gan: '乙', zhi: '丑' },
            day: { gan: '丙', zhi: '寅' },
            hour: { gan: '丁', zhi: '卯' }
        },
        opponentBazi: {
            year: { gan: '戊', zhi: '辰' },
            month: { gan: '己', zhi: '巳' },
            day: { gan: '庚', zhi: '午' },
            hour: { gan: '辛', zhi: '未' }
        },
        playerRemainingElements: 8,
        opponentRemainingElements: 8,
        
        // 卡组和弃牌堆信息
        playerDiscardCount: 0,
        opponentDiscardCount: 0,
        playerDeckCount: 25, // 预设初始卡组数量
        opponentDeckCount: 25,
        opponentHandCount: 5
    });

    // 效果面板状态 - 多目标分配版
    const [effectPanel, setEffectPanel] = useState({
        isOpen: false,
        cardData: null as any,
        sourceCard: null as any,
        actionType: 'damage' as 'damage' | 'buff',
        targets: [] as any[],
        selectedTarget: null as any,
        currentValue: 1,
        maxValue: 8,
        // 多目标分配状态
        targetAllocations: {} as Record<string, number>, // 每个目标的分配数值
        totalAllocated: 0, // 已分配的总数值
        remainingValue: 0, // 剩余可分配数值
        isExecuting: false // 是否正在执行中
    });

    // 游戏统计
    const [gameStats, setGameStats] = useState({
        wins: 0,
        losses: 0,
        totalGames: 0,
        currentStreak: 0
    });

    // 历史记录面板状态
    const [historyPanel, setHistoryPanel] = useState({
        isOpen: false
    });

    // 监听游戏状态更新
    useEvent(scene.events, 'gameStateUpdate', (newState: any) => {
        setGameState(prev => ({ ...prev, ...newState }));
    }, []);

    // 监听效果面板事件 - 使用phaser-react-ui事件系统
    useEvent(scene.events, 'effectPanelOpen', (data: any) => {
        const actionType = data.cardData.type === 'auspicious' ? 'buff' : 'damage';
        const maxValue = actionType === 'damage' 
            ? gameState.opponentRemainingElements 
            : (8 - gameState.playerRemainingElements);
        const totalPower = data.cardData.power || 1;

        setEffectPanel({
            isOpen: true,
            cardData: data.cardData,
            sourceCard: data.sourceCard,
            actionType: actionType,
            targets: data.targets || [],
            selectedTarget: null,
            currentValue: totalPower,
            maxValue: maxValue,
            // 初始化多目标分配状态
            targetAllocations: {},
            totalAllocated: 0,
            remainingValue: totalPower,
            isExecuting: false
        });
    }, [gameState.opponentRemainingElements, gameState.playerRemainingElements]);

    useEvent(scene.events, 'effectPanelClose', () => {
        console.log('🔄 React UI: 收到effectPanelClose事件，关闭面板');
        console.log('🔍 React UI: 当前面板状态 - isOpen:', effectPanel.isOpen, 'isExecuting:', effectPanel.isExecuting);
        setEffectPanel(prev => {
            console.log('🔄 React UI: 设置面板为关闭状态');
            return {
                ...prev, 
                isOpen: false,
                selectedTarget: null,
                targetAllocations: {},
                totalAllocated: 0,
                remainingValue: prev.currentValue,
                isExecuting: false
            };
        });
    }, []);

    // 监听目标数据更新
    useEvent(scene.events, 'targetsUpdate', (targets: any[]) => {
        setEffectPanel(prev => ({ ...prev, targets }));
    }, []);

    // 监听游戏统计更新 (移除，因为暂时不需要)
    // useEvent(scene.events, 'gameStatsUpdate', (stats: any) => {
    //     setGameStats(prev => ({ ...prev, ...stats }));
    // }, []);

    // 游戏操作函数
    const handleDrawCard = () => {
        scene.events.emit('drawCard');
    };

    const handleEndTurn = () => {
        scene.events.emit('endTurn');
    };

    const handleUseSpecialAbility = () => {
        scene.events.emit('useSpecialAbility');
    };

    // 历史记录面板处理函数
    const handleOpenHistory = () => {
        console.log('🔄 LZoreGameUI: 打开历史记录面板');
        setHistoryPanel({ isOpen: true });
    };

    const handleCloseHistory = () => {
        console.log('🔄 LZoreGameUI: 关闭历史记录面板');
        setHistoryPanel({ isOpen: false });
    };

    // 获取历史记录管理器
    const getHistoryManager = () => {
        // 通过scene获取历史记录管理器
        const gameScene = scene as any;
        return gameScene.cardHistoryManager || null;
    };

    // 移除已废弃的单目标处理函数，现在使用多目标分配系统

    const handleEffectCancel = () => {
        console.log('🔄 React UI: 手动取消，发送effectPanelClose事件');
        scene.events.emit('effectPanelClose');
        setEffectPanel(prev => ({ 
            ...prev, 
            isOpen: false, 
            selectedTarget: null,
            targetAllocations: {},
            totalAllocated: 0,
            remainingValue: prev.currentValue,
            isExecuting: false
        }));
    };

    // 多目标分配处理函数
    const handleTargetAllocation = (targetId: string, value: number) => {
        setEffectPanel(prev => {
            const newAllocations = { ...prev.targetAllocations };
            const oldValue = newAllocations[targetId] || 0;
            const newValue = Math.max(0, Math.min(value, prev.remainingValue + oldValue));
            
            // 更新分配值
            if (newValue === 0) {
                delete newAllocations[targetId];
            } else {
                newAllocations[targetId] = newValue;
            }
            
            // 计算新的总分配值和剩余值
            const newTotalAllocated = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
            const newRemainingValue = prev.currentValue - newTotalAllocated;
            
            return {
                ...prev,
                targetAllocations: newAllocations,
                totalAllocated: newTotalAllocated,
                remainingValue: newRemainingValue
            };
        });
    };

    const handleMultiTargetExecute = () => {
        const hasAllocations = Object.keys(effectPanel.targetAllocations).length > 0;
        if (!hasAllocations) {
            alert('⚠️ 请先分配元素到目标！');
            return;
        }

        // 🔥 凶神分配验证：凶神伤害时必须至少分配1点给己方
        if (effectPanel.cardData?.type === 'inauspicious' && effectPanel.actionType === 'damage') {
            // 计算分配给己方目标的总数值
            const playerAllocations = Object.entries(effectPanel.targetAllocations).reduce((total, [targetId, value]) => {
                const target = effectPanel.targets.find(t => t.id === targetId);
                return target?.owner === 'player' ? total + value : total;
            }, 0);
            
            if (playerAllocations === 0) {
                // 显示错误提示
                alert('⚠️ 凶神规则：使用凶神分配伤害时，至少需要分配1炁克给己方目标！');
                return;
            }
            
            console.log(`💀 凶神验证通过：已分配${playerAllocations}炁克给己方目标`);
        }

        console.log('🎯 React UI: 发送多目标执行事件到Phaser');

        // 发送多目标执行效果事件到Phaser
        scene.events.emit('executeMultiTargetEffect', {
            cardData: effectPanel.cardData,
            actionType: effectPanel.actionType,
            allocations: effectPanel.targetAllocations,
            targets: effectPanel.targets
        });

        // 显示执行中状态
        setEffectPanel(prev => ({ 
            ...prev, 
            isExecuting: true
        }));

        // 设置超时保护机制，1.5秒后强制关闭（快速响应）
        const timeoutId = setTimeout(() => {
            console.log('⏰ React UI: 执行超时，检查当前状态...');
            setEffectPanel(prev => {
                console.log('⏰ React UI: 超时检查 - isOpen:', prev.isOpen, 'isExecuting:', prev.isExecuting);
                if (prev.isOpen && prev.isExecuting) {
                    console.log('⏰ React UI: 状态异常，强制关闭面板');
                    // 直接在React端关闭，不依赖Phaser事件
                    return { 
                        ...prev, 
                        isOpen: false, 
                        isExecuting: false,
                        selectedTarget: null,
                        targetAllocations: {},
                        totalAllocated: 0,
                        remainingValue: prev.currentValue
                    };
                } else {
                    console.log('⏰ React UI: 面板状态正常，无需强制关闭');
                }
                return prev;
            });
        }, 1500);
        
        // 如果组件卸载，清理超时
        return () => clearTimeout(timeoutId);
    };

    // 获取卡牌类型文本
    const getCardTypeText = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'auspicious': '吉神',
            'inauspicious': '凶神',
            'special': '特殊神煞',
            'neutral': '中性'
        };
        return typeMap[type] || '未知';
    };

    // 格式化八字显示
    const formatBaZi = (bazi: any) => {
        if (!bazi) return '未知八字';
        return `${bazi.year.gan}${bazi.year.zhi} ${bazi.month.gan}${bazi.month.zhi} ${bazi.day.gan}${bazi.day.zhi} ${bazi.hour.gan}${bazi.hour.zhi}`;
    };

    // 获取元素颜色
    const getElementColor = (count: number, total: number = 8) => {
        const percentage = count / total;
        if (percentage > 0.7) return 'text-green-400';
        if (percentage > 0.4) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div ref={ref} className="fixed inset-0 pointer-events-none z-50 font-mono">
            
            {/* 左下角 - 玩家本命八字及元素 */}
            <div className="absolute bottom-4 left-4 pointer-events-auto">
                <div className="bg-blue-900/90 border-2 border-cyan-400 rounded-lg p-4 backdrop-blur-sm mb-3">
                    <div className="text-cyan-300 text-xs font-bold mb-2">我方本命</div>
                    <div className="text-cyan-100 text-sm mb-3 tracking-wider">
                        {formatBaZi(gameState.playerBazi)}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-cyan-300 text-xs">元素:</span>
                        <div className="flex items-center space-x-2">
                            <div className={`text-lg font-bold ${getElementColor(gameState.playerRemainingElements)}`}>
                                {gameState.playerRemainingElements}
                            </div>
                            <span className="text-cyan-400 text-sm">/8枚</span>
                        </div>
                    </div>
                    {/* 元素状态条 */}
                    <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(gameState.playerRemainingElements / 8) * 100}%` }}
                        ></div>
                    </div>
                </div>
                
                {/* 历史记录按钮 */}
                <button
                    onClick={handleOpenHistory}
                    className="group w-full bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border-2 border-purple-400/60 rounded-lg p-3 backdrop-blur-sm hover:border-purple-300/80 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                >
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl group-hover:animate-bounce">📚</span>
                        <div className="text-center">
                            <div className="text-purple-300 text-xs font-bold">历史记录</div>
                            <div className="text-purple-200 text-xs opacity-80">查看卡牌使用</div>
                        </div>
                    </div>
                    
                    {/* 发光效果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>

            {/* 右上角 - 对手本命八字及元素 */}
            <div className="absolute top-4 right-4 pointer-events-auto">
                <div className="bg-red-900/90 border-2 border-red-400 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-red-300 text-xs font-bold mb-2">对方本命</div>
                    <div className="text-red-100 text-sm mb-3 tracking-wider">
                        {formatBaZi(gameState.opponentBazi)}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-red-300 text-xs">元素:</span>
                        <div className="flex items-center space-x-2">
                            <div className={`text-lg font-bold ${getElementColor(gameState.opponentRemainingElements).replace('green', 'red').replace('yellow', 'orange')}`}>
                                {gameState.opponentRemainingElements}
                            </div>
                            <span className="text-red-400 text-sm">/8枚</span>
                        </div>
                    </div>
                    {/* 元素状态条 */}
                    <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(gameState.opponentRemainingElements / 8) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* 顶部中央 - 对手卡组和弃牌区信息 */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <div className="flex items-center gap-4">
                    {/* 对手卡组 */}
                    <div className="bg-red-900/80 border-2 border-red-500/60 rounded-xl p-3 backdrop-blur-sm group hover:border-red-400/80 transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <span className="text-xl">🃞</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                                    {gameState.opponentDeckCount}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-red-300 text-xs font-bold">对手牌库</div>
                                <div className="text-red-200 text-xs opacity-80">剩余卡牌</div>
                            </div>
                        </div>
                    </div>

                    {/* 对手手牌 */}
                    <div className="bg-red-800/80 border-2 border-red-600/60 rounded-xl p-3 backdrop-blur-sm group hover:border-red-500/80 transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <span className="text-xl">🃏</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                                    {gameState.opponentHandCount}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-red-300 text-xs font-bold">对手手牌</div>
                                <div className="text-red-200 text-xs opacity-80">当前持有</div>
                            </div>
                        </div>
                    </div>

                    {/* 对手弃牌堆 */}
                    <div className="bg-red-700/80 border-2 border-gray-500/60 rounded-xl p-3 backdrop-blur-sm group hover:border-gray-400/80 transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <span className="text-xl">🗑️</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                                    {gameState.opponentDiscardCount}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-300 text-xs font-bold">对手弃牌</div>
                                <div className="text-gray-200 text-xs opacity-80">已废弃</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 底部中央 - 玩家卡组和弃牌区信息 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <div className="flex items-center gap-4">
                    {/* 玩家弃牌堆 */}
                    <div className="bg-blue-700/80 border-2 border-gray-500/60 rounded-xl p-3 backdrop-blur-sm group hover:border-gray-400/80 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <span className="text-xl">🗑️</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                                    {gameState.playerDiscardCount}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-300 text-xs font-bold">我方弃牌</div>
                                <div className="text-gray-200 text-xs opacity-80">已废弃</div>
                            </div>
                        </div>
                    </div>

                    {/* 玩家手牌 */}
                    <div className="bg-cyan-800/80 border-2 border-cyan-600/60 rounded-xl p-3 backdrop-blur-sm group hover:border-cyan-500/80 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <span className="text-xl">🃏</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                                    {gameState.playerHandCount}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-cyan-300 text-xs font-bold">我方手牌</div>
                                <div className="text-cyan-200 text-xs opacity-80">当前持有</div>
                            </div>
                        </div>
                    </div>

                    {/* 玩家卡组 */}
                    <div className="bg-blue-900/80 border-2 border-blue-500/60 rounded-xl p-3 backdrop-blur-sm group hover:border-blue-400/80 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <span className="text-xl">🃞</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                                    {gameState.playerDeckCount}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-blue-300 text-xs font-bold">我方牌库</div>
                                <div className="text-blue-200 text-xs opacity-80">剩余卡牌</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🎨 极致优化的神煞效果面板 - phaser-react-ui + React */}
            {effectPanel.isOpen && (
                <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-purple-900/20 to-black/95 flex items-center justify-center pointer-events-auto z-[1000] backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 border-2 border-purple-500/80 rounded-3xl p-12 max-w-7xl w-full mx-8 sm:mx-12 lg:mx-16 xl:mx-20 shadow-[0_0_50px_rgba(147,51,234,0.3)] backdrop-blur-sm animate-in slide-in-from-bottom-4 zoom-in-95 duration-500"
                         style={{
                             boxShadow: '0 0 50px rgba(147, 51, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                         }}>
                        
                        {/* 🌟 霓虹标题栏 */}
                        <div className="flex justify-between items-center mb-12 relative">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 text-3xl font-black tracking-wide flex items-center gap-3">
                                        <span className="animate-pulse text-4xl">⏸️</span>
                                        时空暂停
                                    </h2>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 animate-pulse"></div>
                                </div>
                                <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full">
                                    <span className="text-purple-300 text-sm font-medium">神煞能力激活</span>
                                </div>
                            </div>
                            <button 
                                className="group relative text-red-400 hover:text-red-300 text-2xl w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500/10 to-red-600/20 border border-red-400/30 hover:border-red-300/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                onClick={handleEffectCancel}
                            >
                                <span className="group-hover:rotate-90 transition-transform duration-300">✕</span>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/0 to-red-600/0 group-hover:from-red-500/20 group-hover:to-red-600/30 transition-all duration-300"></div>
                            </button>
                        </div>

                        {/* 🃏 赛博朋克卡牌信息面板 */}
                        <div className="relative bg-gradient-to-br from-slate-800/90 via-cyan-900/20 to-slate-800/90 border-2 border-cyan-400/60 rounded-xl p-8 mb-12 overflow-hidden group hover:border-cyan-300/80 transition-all duration-300">
                            {/* 动态背景装饰 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 animate-pulse"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-full blur-xl"></div>
                            
                            <div className="relative">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                            <span className="text-2xl filter drop-shadow-lg">🃏</span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg blur opacity-30 animate-pulse"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 text-2xl font-black tracking-wide">
                                            {effectPanel.cardData?.name}
                                        </h3>
                                        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-1"></div>
                                    </div>
                                </div>
                                
                                {/* 属性网格 */}
                                <div className="grid grid-cols-3 gap-6 mb-6">
                                    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg p-3 text-center">
                                        <div className="text-orange-400 text-xs font-bold mb-1">元素</div>
                                        <div className="text-white text-xl font-black">{effectPanel.cardData?.power}炁克</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-3 text-center">
                                        <div className="text-purple-400 text-xs font-bold mb-1">类型</div>
                                        <div className="text-white text-sm font-semibold">{getCardTypeText(effectPanel.cardData?.type)}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-3 text-center">
                                        <div className="text-yellow-400 text-xs font-bold mb-1">稀有度</div>
                                        <div className="text-white text-sm font-semibold">{effectPanel.cardData?.rarity || '普通'}</div>
                                    </div>
                                </div>
                                
                                {/* 效果描述 */}
                                <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/30 rounded-lg p-5 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-orange-400 text-sm font-bold">✨ 神煞效果</span>
                                    </div>
                                    <div className="text-orange-100 text-sm leading-relaxed">
                                        {effectPanel.cardData?.effect || effectPanel.cardData?.description || '暂无描述'}
                                    </div>
                                </div>
                                
                                {/* 操作类型指示器 */}
                                <div className="text-center">
                                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-lg border-2 ${
                                        effectPanel.actionType === 'damage' 
                                            ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/50 text-red-300' 
                                            : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 text-green-300'
                                    } shadow-lg animate-pulse`}>
                                        <span className="text-2xl">
                                            {effectPanel.actionType === 'damage' ? '⚔️' : '🌟'}
                                        </span>
                                        {effectPanel.actionType === 'damage' ? '分配伤害' : '分配增益'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ⚡ 多目标分配控制台 */}
                        <div className="relative bg-gradient-to-br from-orange-900/40 via-yellow-800/30 to-orange-900/40 border-2 border-orange-400/60 rounded-xl p-8 mb-12 overflow-hidden group">
                            {/* 能量波动背景 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-yellow-500/10 to-orange-500/5 animate-pulse"></div>
                            <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-xl animate-ping"></div>
                            
                            <div className="relative">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/40 rounded-full">
                                        <span className="text-orange-400 font-bold text-sm">
                                            ⚡ {effectPanel.actionType === 'damage' ? '多目标伤害分配' : '多目标增益分配'}
                                        </span>
                                    </div>
                                </div>

                                {/* 分配统计显示 */}
                                <div className="grid grid-cols-3 gap-6">
                                                                    {/* 总元素 */}
                                <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 border-2 border-blue-400/60 rounded-xl p-4 text-center shadow-lg">
                                    <div className="text-blue-400 text-xs font-bold mb-1">总元素</div>
                                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 text-2xl font-black">
                                            {effectPanel.currentValue}炁克
                                        </div>
                                    </div>
                                    
                                    {/* 已分配 */}
                                    <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 border-2 border-green-400/60 rounded-xl p-4 text-center shadow-lg">
                                        <div className="text-green-400 text-xs font-bold mb-1">已分配</div>
                                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-green-300 text-2xl font-black">
                                            {effectPanel.totalAllocated}
                                        </div>
                                    </div>
                                    
                                    {/* 剩余 */}
                                    <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 border-2 border-orange-400/60 rounded-xl p-4 text-center shadow-lg">
                                        <div className="text-orange-400 text-xs font-bold mb-1">剩余</div>
                                        <div className={`text-2xl font-black ${
                                            effectPanel.remainingValue > 0 
                                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300' 
                                                : 'text-gray-400'
                                        }`}>
                                            {effectPanel.remainingValue}
                                        </div>
                                        {effectPanel.remainingValue > 0 && (
                                            <div className="text-orange-300 text-xs mt-1">
                                                可选择分配
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 分配进度条 */}
                                <div className="mt-6">
                                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                            style={{ width: `${(effectPanel.totalAllocated / effectPanel.currentValue) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                                        <span>分配进度</span>
                                        <span>{Math.round((effectPanel.totalAllocated / effectPanel.currentValue) * 100)}%</span>
                                    </div>
                                </div>

                                {/* 🔥 凶神规则警告 */}
                                {effectPanel.cardData?.type === 'inauspicious' && effectPanel.actionType === 'damage' && (
                                    <div className="mt-6 bg-gradient-to-r from-red-900/50 via-orange-900/50 to-red-900/50 border-2 border-red-500/60 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl animate-pulse">💀</span>
                                            <h4 className="text-red-300 font-bold text-sm">凶神规则</h4>
                                        </div>
                                        <div className="text-red-200 text-xs leading-relaxed">
                                            使用凶神分配伤害时，<span className="text-yellow-300 font-bold">至少需要分配1炁克给己方目标</span>，
                                            体现凶神会对使用者造成负面影响的传统命理概念。
                                        </div>
                                        
                                        {/* 实时验证状态 */}
                                        {(() => {
                                            const playerAllocations = Object.entries(effectPanel.targetAllocations).reduce((total, [targetId, value]) => {
                                                const target = effectPanel.targets.find(t => t.id === targetId);
                                                return target?.owner === 'player' ? total + value : total;
                                            }, 0);
                                            
                                            return (
                                                <div className="mt-3 flex items-center gap-2">
                                                    {playerAllocations > 0 ? (
                                                        <div className="flex items-center gap-2 text-green-300">
                                                            <span className="text-lg">✅</span>
                                                            <span className="text-xs">已分配{playerAllocations}炁克给己方，满足凶神规则</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-red-300">
                                                            <span className="text-lg animate-bounce">⚠️</span>
                                                            <span className="text-xs">未满足凶神规则：需要至少分配1炁克给己方目标</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 🎯 高科技目标选择系统 */}
                        <div className="relative bg-gradient-to-br from-purple-900/40 via-indigo-800/30 to-purple-900/40 border-2 border-purple-400/60 rounded-xl p-8 mb-12 overflow-hidden">
                            {/* 扫描动效背景 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/10 to-purple-500/5 animate-pulse"></div>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
                            
                            <div className="relative">
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/40 rounded-full">
                                        <span className="text-2xl animate-spin">🎯</span>
                                        <span className="text-purple-300 font-bold text-lg">目标锁定系统</span>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                
                                                                {effectPanel.targets.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {effectPanel.targets.map((target, index) => {
                                            const currentAllocation = effectPanel.targetAllocations[target.id] || 0;
                                            let bgGradient = 'from-gray-600 to-gray-700';
                                            let borderColor = 'border-gray-500/50';
                                            let icon = '📦';
                                            
                                            if (target.type === 'fieldCard') {
                                                if (target.owner === 'player') {
                                                    bgGradient = 'from-blue-500 to-cyan-600';
                                                    borderColor = 'border-blue-400/60';
                                                    icon = '🛡️';
                                                } else {
                                                    bgGradient = 'from-red-500 to-pink-600';
                                                    borderColor = 'border-red-400/60';
                                                    icon = '⚔️';
                                                }
                                            } else {
                                                if (target.owner === 'player') {
                                                    bgGradient = 'from-green-500 to-emerald-600';
                                                    borderColor = 'border-green-400/60';
                                                    icon = '🌟';
                                                } else {
                                                    bgGradient = 'from-orange-500 to-amber-600';
                                                    borderColor = 'border-orange-400/60';
                                                    icon = '💀';
                                                }
                                            }

                                            return (
                                                <div
                                                    key={target.id}
                                                    className={`
                                                        relative bg-gradient-to-br ${bgGradient} text-white rounded-xl border-2 
                                                        ${currentAllocation > 0 
                                                            ? 'border-yellow-400 ring-2 ring-yellow-400/40 shadow-[0_0_25px_rgba(251,191,36,0.4)]' 
                                                            : borderColor
                                                        }
                                                        transition-all duration-300 overflow-hidden
                                                    `}
                                                >
                                                    {/* 分配值指示器 */}
                                                    {currentAllocation > 0 && (
                                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black text-sm font-bold animate-pulse z-10">
                                                            {currentAllocation}
                                                        </div>
                                                    )}
                                                    
                                                    {/* 目标信息区域 */}
                                                    <div className="p-4 pb-2">
                                                        <div className="text-center mb-3">
                                                            <span className="text-3xl mb-2 block">
                                                                {icon}
                                                            </span>
                                                            <div className="text-sm font-bold leading-tight">
                                                                {target.name}
                                                            </div>
                                                            <span className="inline-block mt-1 px-2 py-1 bg-black/30 rounded-full text-xs font-semibold">
                                                                {target.type === 'fieldCard' ? '神煞卡' : '本命'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* 分配输入区域 */}
                                                    <div className="p-4 pt-0">
                                                        <div className="bg-black/40 border border-white/20 rounded-lg p-3">
                                                            <div className="text-center mb-2">
                                                                <span className="text-xs text-gray-300">分配数值</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button 
                                                                    className="w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-sm font-bold transition-all disabled:opacity-50"
                                                                    onClick={() => handleTargetAllocation(target.id, currentAllocation - 1)}
                                                                    disabled={currentAllocation <= 0}
                                                                >
                                                                    −
                                                                </button>
                                                                <div className="flex-1 bg-slate-700 border border-slate-500 rounded px-3 py-2 text-center font-bold">
                                                                    {currentAllocation}
                                                                </div>
                                                                <button 
                                                                    className="w-8 h-8 bg-green-500/80 hover:bg-green-500 rounded-full flex items-center justify-center text-sm font-bold transition-all disabled:opacity-50"
                                                                    onClick={() => handleTargetAllocation(target.id, currentAllocation + 1)}
                                                                    disabled={effectPanel.remainingValue <= 0}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            
                                                            {/* 快速分配按钮 */}
                                                            <div className="flex gap-1 mt-2">
                                                                <button 
                                                                    className="flex-1 bg-slate-600/50 hover:bg-slate-600 rounded text-xs py-1 transition-all"
                                                                    onClick={() => handleTargetAllocation(target.id, 0)}
                                                                >
                                                                    清零
                                                                </button>
                                                                <button 
                                                                    className="flex-1 bg-blue-600/50 hover:bg-blue-600 rounded text-xs py-1 transition-all disabled:opacity-50"
                                                                    onClick={() => handleTargetAllocation(target.id, Math.min(effectPanel.remainingValue + currentAllocation, 5))}
                                                                    disabled={effectPanel.remainingValue <= 0}
                                                                >
                                                                    满5
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-6xl mb-4 opacity-50">🔍</div>
                                        <div className="text-gray-400 text-lg font-semibold">未检测到可用目标</div>
                                        <div className="text-gray-500 text-sm mt-2">系统扫描中...</div>
                                    </div>
                                )}

                                {/* 目标统计 */}
                                {effectPanel.targets.length > 0 && (
                                    <div className="mt-8 flex justify-center gap-6">
                                        <div className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-full text-xs">
                                            <span className="text-gray-400">总计目标:</span>
                                            <span className="text-white font-bold ml-2">{effectPanel.targets.length}</span>
                                        </div>
                                        {effectPanel.selectedTarget && (
                                            <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/40 rounded-full text-xs">
                                                <span className="text-yellow-400">已选择:</span>
                                                <span className="text-white font-bold ml-2">{effectPanel.selectedTarget.name}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 🚀 终极操作控制台 */}
                        <div className="flex justify-center gap-8 pt-6">
                            {/* 执行中状态指示器 */}
                            {effectPanel.isExecuting && (
                                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1100] backdrop-blur-sm">
                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/80 rounded-2xl p-8 text-center">
                                        <div className="animate-spin text-6xl mb-4">⚔️</div>
                                        <h3 className="text-2xl font-bold text-white mb-2">执行中...</h3>
                                
                                {/* 添加手动关闭按钮，3秒后显示 */}
                                <div className="mt-4 text-center">
                                    <button 
                                        className="text-sm bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        onClick={() => {
                                            console.log('🔧 用户手动强制关闭执行中面板');
                                            setEffectPanel(prev => ({
                                                ...prev,
                                                isOpen: false,
                                                isExecuting: false,
                                                selectedTarget: null,
                                                targetAllocations: {},
                                                totalAllocated: 0,
                                                remainingValue: prev.currentValue
                                            }));
                                        }}
                                    >
                                        强制关闭
                                    </button>
                                </div>
                                        <p className="text-purple-300">神煞能力正在生效，请稍候</p>
                                        <div className="mt-4 flex justify-center gap-2">
                                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                                            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce animation-delay-200"></div>
                                            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce animation-delay-400"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* 多目标执行按钮 */}
                            <button 
                                className={`
                                    group relative px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 transform
                                    ${(() => {
                                        const hasAllocations = Object.keys(effectPanel.targetAllocations).length > 0;
                                        
                                        // 凶神规则验证
                                        let meetsInauspiciousRule = true;
                                        if (effectPanel.cardData?.type === 'inauspicious' && effectPanel.actionType === 'damage') {
                                            const playerAllocations = Object.entries(effectPanel.targetAllocations).reduce((total, [targetId, value]) => {
                                                const target = effectPanel.targets.find(t => t.id === targetId);
                                                return target?.owner === 'player' ? total + value : total;
                                            }, 0);
                                            meetsInauspiciousRule = playerAllocations > 0;
                                        }
                                        
                                        const canExecute = hasAllocations && meetsInauspiciousRule && !effectPanel.isExecuting;
                                        
                                        if (canExecute) {
                                            return effectPanel.actionType === 'damage' 
                                                ? 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] hover:scale-110 active:scale-95 border-2 border-red-400/60 hover:border-opacity-100'
                                                : 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:shadow-[0_0_50px_rgba(34,197,94,0.8)] hover:scale-110 active:scale-95 border-2 border-green-400/60 hover:border-opacity-100';
                                        } else {
                                            return 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed border-2 border-gray-500/50';
                                        }
                                    })()}
                                `}
                                onClick={handleMultiTargetExecute}
                                disabled={(() => {
                                    const hasAllocations = Object.keys(effectPanel.targetAllocations).length > 0;
                                    
                                    // 凶神规则验证
                                    let meetsInauspiciousRule = true;
                                    if (effectPanel.cardData?.type === 'inauspicious' && effectPanel.actionType === 'damage') {
                                        const playerAllocations = Object.entries(effectPanel.targetAllocations).reduce((total, [targetId, value]) => {
                                            const target = effectPanel.targets.find(t => t.id === targetId);
                                            return target?.owner === 'player' ? total + value : total;
                                        }, 0);
                                        meetsInauspiciousRule = playerAllocations > 0;
                                    }
                                    
                                    return !hasAllocations || !meetsInauspiciousRule || effectPanel.isExecuting;
                                })()}
                            >
                                {/* 按钮内部发光效果 */}
                                {Object.keys(effectPanel.targetAllocations).length > 0 && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                                
                                {/* 能量脉冲环 */}
                                {Object.keys(effectPanel.targetAllocations).length > 0 && (
                                    <div className="absolute inset-0 rounded-xl border-2 border-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"></div>
                                )}
                                
                                <div className="relative flex items-center gap-3">
                                    <span className={`text-3xl ${effectPanel.isExecuting ? 'animate-spin' : (Object.keys(effectPanel.targetAllocations).length > 0 ? 'group-hover:animate-bounce' : '')}`}>
                                        {effectPanel.isExecuting ? '⏳' : (effectPanel.actionType === 'damage' ? '💥' : '✨')}
                                    </span>
                                    <span className="tracking-wide">
                                        {(() => {
                                            if (effectPanel.isExecuting) {
                                                return '正在执行中...';
                                            }
                                            
                                            // 检查是否有任何分配
                                            if (Object.keys(effectPanel.targetAllocations).length === 0) {
                                                return '请选择目标分配';
                                            }
                                            
                                            // 检查凶神规则
                                            if (effectPanel.cardData?.type === 'inauspicious' && effectPanel.actionType === 'damage') {
                                                const playerAllocations = Object.entries(effectPanel.targetAllocations).reduce((total, [targetId, value]) => {
                                                    const target = effectPanel.targets.find(t => t.id === targetId);
                                                    return target?.owner === 'player' ? total + value : total;
                                                }, 0);
                                                
                                                if (playerAllocations === 0) {
                                                    return '需要分配给己方';
                                                }
                                            }
                                            
                                            return effectPanel.actionType === 'damage' ? '执行多目标攻击' : '执行多目标增益';
                                        })()}
                                    </span>
                                    {!effectPanel.isExecuting && Object.keys(effectPanel.targetAllocations).length > 0 && (
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    )}
                                </div>
                                
                                {/* 目标数量指示器 */}
                                {Object.keys(effectPanel.targetAllocations).length > 0 && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-black text-xs font-bold">
                                        {Object.keys(effectPanel.targetAllocations).length}
                                    </div>
                                )}
                            </button>
                            
                            {/* 取消按钮 */}
                            <button 
                                className={`group relative bg-gradient-to-r from-slate-600 via-slate-700 to-slate-600 hover:from-slate-700 hover:via-slate-800 hover:to-slate-700 text-white px-8 py-4 rounded-xl font-black text-lg border-2 border-slate-500/60 hover:border-slate-400/80 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(71,85,105,0.4)] hover:shadow-[0_0_30px_rgba(71,85,105,0.6)] ${effectPanel.isExecuting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleEffectCancel}
                                disabled={effectPanel.isExecuting}
                            >
                                {/* 扫描线效果 */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-xl"></div>
                                
                                <div className="relative flex items-center gap-3">
                                    <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">❌</span>
                                    <span className="tracking-wide">取消操作</span>
                                </div>
                            </button>
                        </div>

                        {/* 底部状态栏 */}
                        <div className="mt-8 pt-6 border-t border-slate-600/30">
                            <div className="flex justify-between items-center text-xs text-gray-400">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span>系统就绪</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span>目标数: {Object.keys(effectPanel.targetAllocations).length}</span>
                                    <span>已分配: {effectPanel.totalAllocated}/{effectPanel.currentValue}</span>
                                    <span>剩余: {effectPanel.remainingValue}</span>
                                    <span className={`px-3 py-1.5 rounded ${effectPanel.actionType === 'damage' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                        {effectPanel.actionType === 'damage' ? 'MULTI-ATTACK' : 'MULTI-BOOST'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 历史记录面板 */}
            <CardHistoryPanel 
                isOpen={historyPanel.isOpen}
                onClose={handleCloseHistory}
                historyManager={getHistoryManager()}
            />
        </div>
    );
}; 