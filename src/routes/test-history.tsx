import React, { useState, useEffect } from 'react';
import { CardHistoryManager } from '../managers/CardHistoryManager';
import { CardHistoryPanel } from '../components/CardHistoryPanel';
import type { LZoreCard, GameState } from '../types/gameTypes';

/**
 * 历史记录系统测试页面
 */
export default function TestHistoryPage() {
    const [historyManager, setHistoryManager] = useState<CardHistoryManager | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);

    // 模拟游戏状态
    const mockGameState: GameState = {
        gameTime: 120,
        currentCycle: 12,
        playerCooldownRemaining: 0,
        opponentCooldownRemaining: 0,
        activePlayer: 'player',
        priorityHolder: 'player',
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
        playerRemainingElements: 6,
        opponentRemainingElements: 4,
        gamePhase: 'realtime',
        battleFieldPositions: [null, null, null, null, null, null, null, null],
        canPlayerUseCards: true,
        canOpponentUseCards: false,
        isPaused: false,
        pauseReason: ''
    };

    // 模拟卡牌数据
    const mockCards: LZoreCard[] = [
        {
            id: 'test_card_1',
            name: '天乙贵人',
            type: 'auspicious',
            element: 'metal',
            rarity: 'legendary',
            power: 3,
            description: '天乙贵人是最重要的吉神之一',
            effect: '为己方提供强力增益',
            appearConditions: [],
            lifeElementGeneration: {
                baseGeneration: 2,
                elementType: 'metal',
                generationTrigger: 'condition',
                maxPerTurn: 3
            },
            currentLifeElements: 2,
            maxLifeElements: 3
        },
        {
            id: 'test_card_2',
            name: '羊刃',
            type: 'inauspicious',
            element: 'fire',
            rarity: 'rare',
            power: 4,
            description: '羊刃是重要的凶神',
            effect: '对敌方造成伤害，但会影响使用者',
            appearConditions: [],
            lifeElementGeneration: {
                baseGeneration: 1,
                elementType: 'fire',
                generationTrigger: 'combat',
                maxPerTurn: 2
            },
            currentLifeElements: 1,
            maxLifeElements: 2
        }
    ];

    // 初始化历史记录管理器
    useEffect(() => {
        const mockScene = {
            events: {
                emit: (event: string, ...args: any[]) => {
                    console.log(`Mock Scene Event: ${event}`, args);
                }
            }
        } as any;

        const manager = new CardHistoryManager(
            mockScene,
            (text: string, type: 'success' | 'warning' | 'error') => {
                console.log(`Message [${type}]: ${text}`);
                
                // 在真实环境中，这里会显示游戏内消息
                const alertType = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌';
                console.log(`${alertType} ${text}`);
            }
        );

        setHistoryManager(manager);
    }, []);

    // 开始游戏会话
    const startSession = () => {
        if (historyManager && !sessionStarted) {
            historyManager.startGameSession(mockGameState, mockCards);
            setSessionStarted(true);
        }
    };

    // 模拟使用卡牌
    const simulateCardUsage = (cardIndex: number, actionType: 'damage' | 'buff') => {
        if (!historyManager || !sessionStarted) return;

        const card = mockCards[cardIndex];
        const targets = [
            {
                id: `target_${Date.now()}`,
                name: actionType === 'damage' ? '对手年柱' : '己方日柱',
                type: 'pillar' as const,
                owner: (actionType === 'damage' ? 'opponent' : 'player') as const,
                allocatedValue: card.power,
                position: Math.floor(Math.random() * 8)
            }
        ];

        historyManager.recordCardUsage(
            card,
            'player',
            actionType,
            targets,
            card.power,
            mockGameState,
            undefined,
            `测试使用：${card.name} - ${actionType === 'damage' ? '攻击' : '增益'}`
        );
    };

    // 结束游戏会话
    const endSession = (result: 'player_win' | 'opponent_win') => {
        if (historyManager && sessionStarted) {
            historyManager.endGameSession(result);
            setSessionStarted(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-8">
            <div className="max-w-4xl mx-auto">
                {/* 标题 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        📚 L-Zore 历史记录系统测试
                    </h1>
                    <p className="text-purple-200">
                        测试卡牌使用历史记录功能
                    </p>
                </div>

                {/* 控制面板 */}
                <div className="bg-gray-800/80 rounded-xl p-6 mb-8 backdrop-blur-sm border border-purple-500/30">
                    <h2 className="text-xl font-bold text-white mb-4">🎮 测试控制面板</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* 会话控制 */}
                        <div className="space-y-3">
                            <h3 className="text-purple-400 font-semibold">会话控制</h3>
                            
                            <button
                                onClick={startSession}
                                disabled={sessionStarted}
                                className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    sessionStarted
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                                {sessionStarted ? '✅ 会话已开始' : '🎮 开始游戏会话'}
                            </button>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={() => endSession('player_win')}
                                    disabled={!sessionStarted}
                                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${
                                        !sessionStarted
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    🏆 玩家胜利
                                </button>
                                <button
                                    onClick={() => endSession('opponent_win')}
                                    disabled={!sessionStarted}
                                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${
                                        !sessionStarted
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    💀 对手胜利
                                </button>
                            </div>
                        </div>

                        {/* 卡牌使用模拟 */}
                        <div className="space-y-3">
                            <h3 className="text-purple-400 font-semibold">卡牌使用模拟</h3>
                            
                            <div className="space-y-2">
                                <button
                                    onClick={() => simulateCardUsage(0, 'buff')}
                                    disabled={!sessionStarted}
                                    className={`w-full px-3 py-2 rounded text-sm font-semibold transition-colors ${
                                        !sessionStarted
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    🌟 使用天乙贵人 (增益)
                                </button>
                                
                                <button
                                    onClick={() => simulateCardUsage(1, 'damage')}
                                    disabled={!sessionStarted}
                                    className={`w-full px-3 py-2 rounded text-sm font-semibold transition-colors ${
                                        !sessionStarted
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    ⚡ 使用羊刃 (伤害)
                                </button>
                            </div>
                        </div>

                        {/* 历史记录查看 */}
                        <div className="space-y-3">
                            <h3 className="text-purple-400 font-semibold">历史记录</h3>
                            
                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                📚 打开历史记录面板
                            </button>
                        </div>
                    </div>
                </div>

                {/* 状态显示 */}
                <div className="bg-gray-800/80 rounded-xl p-6 backdrop-blur-sm border border-purple-500/30">
                    <h2 className="text-xl font-bold text-white mb-4">📊 当前状态</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h3 className="text-cyan-400 font-semibold mb-2">游戏状态</h3>
                            <div className="space-y-1 text-gray-300">
                                <p>游戏阶段: {mockGameState.gamePhase}</p>
                                <p>会话状态: {sessionStarted ? '进行中' : '未开始'}</p>
                                <p>游戏时间: {mockGameState.gameTime}秒</p>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-green-400 font-semibold mb-2">玩家状态</h3>
                            <div className="space-y-1 text-gray-300">
                                <p>剩余元素: {mockGameState.playerRemainingElements}/8</p>
                                <p>优先权: {mockGameState.priorityHolder === 'player' ? '是' : '否'}</p>
                                <p>可使用卡牌: {mockGameState.canPlayerUseCards ? '是' : '否'}</p>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-red-400 font-semibold mb-2">对手状态</h3>
                            <div className="space-y-1 text-gray-300">
                                <p>剩余元素: {mockGameState.opponentRemainingElements}/8</p>
                                <p>优先权: {mockGameState.priorityHolder === 'opponent' ? '是' : '否'}</p>
                                <p>可使用卡牌: {mockGameState.canOpponentUseCards ? '是' : '否'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 说明文档 */}
                <div className="bg-gray-800/80 rounded-xl p-6 mt-8 backdrop-blur-sm border border-purple-500/30">
                    <h2 className="text-xl font-bold text-white mb-4">📖 功能说明</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                        <div>
                            <h3 className="text-yellow-400 font-semibold mb-2">🎮 测试流程</h3>
                            <ol className="space-y-1 list-decimal list-inside">
                                <li>点击"开始游戏会话"创建新会话</li>
                                <li>使用模拟按钮测试卡牌使用记录</li>
                                <li>打开历史记录面板查看记录</li>
                                <li>通过胜利/失败按钮结束会话</li>
                            </ol>
                        </div>
                        
                        <div>
                            <h3 className="text-blue-400 font-semibold mb-2">📊 历史记录功能</h3>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>完整的卡牌使用记录</li>
                                <li>游戏会话管理</li>
                                <li>统计分析和数据展示</li>
                                <li>数据导出和清除</li>
                                <li>多维度筛选和搜索</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 历史记录面板 */}
            <CardHistoryPanel 
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                historyManager={historyManager}
            />
        </div>
    );
} 