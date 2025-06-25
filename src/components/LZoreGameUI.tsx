import React, { useState } from 'react';
import { useCurrentScene, useEvent, useRelativeScale } from 'phaser-react-ui';

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
        priorityHolder: 'none' as 'player' | 'opponent' | 'none'
    });

    // 效果面板状态
    const [effectPanel, setEffectPanel] = useState({
        isOpen: false,
        cardData: null as any,
        sourceCard: null as any
    });

    // 游戏统计
    const [gameStats, setGameStats] = useState({
        wins: 0,
        losses: 0,
        totalGames: 0,
        currentStreak: 0
    });

    // 监听游戏状态更新
    useEvent(scene.events, 'gameStateUpdate', (newState: any) => {
        setGameState(prev => ({ ...prev, ...newState }));
    }, []);

    // 监听效果面板事件
    useEvent(scene.events, 'effectPanelOpen', (data: any) => {
        setEffectPanel({
            isOpen: true,
            cardData: data.cardData,
            sourceCard: data.sourceCard
        });
    }, []);

    useEvent(scene.events, 'effectPanelClose', () => {
        setEffectPanel(prev => ({ ...prev, isOpen: false }));
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

    return (
        <div ref={ref} className="fixed inset-0 pointer-events-none z-50 font-mono">
            {/* 即时系统状态信息 */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/90 border border-cyan-400/50 rounded-full px-6 py-3 pointer-events-auto">
                <div className="text-cyan-400 text-sm">
                    生命: <span className="text-green-400 font-bold">{gameState.playerHealth}</span>
                </div>
                
                <div className="text-white text-sm">
                    周期 <span className="font-bold">{gameState.currentTurn}</span>
                </div>
                
                <div className="text-yellow-400 text-sm">
                    时间: <span className="font-bold">{Math.floor(gameState.gameTime || 0)}s</span>
                </div>
                
                {/* 优先权显示 */}
                <div className={`text-sm font-bold ${
                    gameState.priorityHolder === 'player' ? 'text-green-400' : 
                    gameState.priorityHolder === 'opponent' ? 'text-red-400' : 'text-gray-400'
                }`}>
                    {gameState.priorityHolder === 'player' ? '🏆 你有优先权' : 
                     gameState.priorityHolder === 'opponent' ? '❌ 对手优先权' : '⚡ 无优先权'}
                </div>
                
                {/* 冷却显示 */}
                {gameState.playerCooldown > 0 && (
                    <div className="text-red-400 text-sm">
                        冷却: <span className="font-bold">{Math.ceil(gameState.playerCooldown)}s</span>
                    </div>
                )}
                
                <div className="text-cyan-400 text-sm">
                    对手: <span className="text-red-400 font-bold">{gameState.opponentHealth}</span>
                </div>
            </div>

            {/* 效果面板 */}
            {effectPanel.isOpen && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto z-50">
                    <div className="bg-gray-900/95 border-2 border-purple-500 rounded-lg p-6 max-w-lg w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-purple-400 text-xl font-bold">神煞效果</h3>
                            <button 
                                className="text-red-400 hover:text-red-300 text-xl"
                                onClick={() => setEffectPanel(prev => ({ ...prev, isOpen: false }))}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <h4 className="text-cyan-400 font-bold mb-2">{effectPanel.cardData?.name}</h4>
                            <p className="text-gray-300 text-sm">{effectPanel.cardData?.description}</p>
                        </div>
                        
                        <div>
                            <h4 className="text-yellow-400 font-bold mb-2">选择目标位置</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {[0, 1, 2, 3, 4, 5, 6, 7].map(position => (
                                    <button
                                        key={position}
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded font-bold transition-all"
                                        onClick={() => {
                                            scene.events.emit('effectTarget', position);
                                            setEffectPanel(prev => ({ ...prev, isOpen: false }));
                                        }}
                                    >
                                        {position + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 