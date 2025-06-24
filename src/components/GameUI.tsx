import React, { useEffect, useState } from 'react';

/**
 * 游戏状态接口定义
 * 描述游戏的实时状态数据
 */
interface GameState {
    /** 玩家当前分数 */
    playerScore: number;
    /** 庄家分数（游戏进行中显示为'?'） */
    dealerScore: number | string;
    /** 游戏是否已开始 */
    gameStarted: boolean;
    /** 游戏是否已结束 */
    gameOver: boolean;
    /** 玩家胜利次数 */
    wins: number;
    /** 玩家失败次数 */
    losses: number;
}

/**
 * GameUI组件属性接口
 * 定义从Phaser场景传递过来的数据和回调函数
 */
interface GameUIProps {
    /** Phaser场景实例 */
    scene: Phaser.Scene;
    /** 发牌按钮回调 */
    onDeal: () => void;
    /** 要牌按钮回调 */
    onHit: () => void;
    /** 停牌按钮回调 */
    onStand: () => void;
    /** 新游戏按钮回调 */
    onNewGame: () => void;
}

/**
 * 游戏UI组件
 * 
 * 功能：
 * - 显示游戏状态信息（分数、胜负统计）
 * - 提供游戏控制按钮
 * - 显示游戏结果弹窗
 * - 提供游戏规则说明
 * 
 * 技术特点：
 * - 使用React Hooks管理状态
 * - 通过Phaser事件系统与游戏逻辑通信
 * - 使用Tailwind CSS进行样式设计
 * - 响应式布局适配不同屏幕
 */
export const GameUI: React.FC<GameUIProps> = ({ scene, onDeal, onHit, onStand, onNewGame }) => {
    // React状态管理
    /** 游戏主状态 - 存储分数、胜负等核心数据 */
    const [gameState, setGameState] = useState<GameState>({
        playerScore: 0,        // 玩家分数初始为0
        dealerScore: '?',      // 庄家分数初始隐藏
        gameStarted: false,    // 游戏未开始
        gameOver: false,       // 游戏未结束
        wins: 0,               // 胜利次数为0
        losses: 0              // 失败次数为0
    });
    
    /** 游戏结果文本 */
    const [gameResult, setGameResult] = useState<string>('');
    
    /** 是否显示结果弹窗 */
    const [showResult, setShowResult] = useState(false);
    
    // 事件监听器设置 - 监听Phaser场景发出的事件
    useEffect(() => {
        /**
         * 处理游戏状态更新事件
         * 当Phaser场景中的游戏状态发生变化时调用
         */
        const handleStateUpdate = (state: GameState) => {
            setGameState(state);
        };
        
        /**
         * 处理游戏结束事件
         * 显示游戏结果并设置3秒后自动隐藏
         */
        const handleGameEnd = (data: { result: string; playerWins: boolean | null; wins: number; losses: number }) => {
            setGameResult(data.result);
            setShowResult(true);
            setTimeout(() => setShowResult(false), 3000); // 3秒后自动隐藏
        };
        
        /**
         * 处理新游戏事件
         * 重置UI状态
         */
        const handleNewGame = () => {
            setGameResult('');
            setShowResult(false);
        };
        
        // 注册事件监听器
        scene.events.on('stateUpdate', handleStateUpdate);
        scene.events.on('gameEnd', handleGameEnd);
        scene.events.on('newGame', handleNewGame);
        
        // 清理函数 - 组件卸载时移除事件监听器，防止内存泄漏
        return () => {
            scene.events.off('stateUpdate', handleStateUpdate);
            scene.events.off('gameEnd', handleGameEnd);
            scene.events.off('newGame', handleNewGame);
        };
    }, [scene]); // 依赖于scene，当scene变化时重新设置监听器
    
    // 计算胜率 - 避免除零错误
    const winRate = gameState.wins + gameState.losses > 0 
        ? Math.round((gameState.wins / (gameState.wins + gameState.losses)) * 100) 
        : 0;
    
    return (
        // 全屏覆盖层 - 不阻挡Phaser画布的交互
        <div className="fixed inset-0 pointer-events-none">
            {/* 游戏状态栏 - 左上角显示分数和统计 */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg pointer-events-auto">
                <div className="space-y-2 text-sm">
                    {/* 庄家分数显示 */}
                    <div className="flex justify-between gap-4">
                        <span>庄家分数:</span>
                        <span className="font-bold">{gameState.dealerScore}</span>
                    </div>
                    
                    {/* 玩家分数显示 */}
                    <div className="flex justify-between gap-4">
                        <span>玩家分数:</span>
                        <span className="font-bold">{gameState.playerScore}</span>
                    </div>
                    
                    {/* 胜负统计 - 仅在有游戏记录时显示 */}
                    {(gameState.wins > 0 || gameState.losses > 0) && (
                        <>
                            <hr className="border-gray-500" />
                            
                            {/* 胜利次数 */}
                            <div className="flex justify-between gap-4">
                                <span>胜利:</span>
                                <span className="text-green-400 font-bold">{gameState.wins}</span>
                            </div>
                            
                            {/* 失败次数 */}
                            <div className="flex justify-between gap-4">
                                <span>失败:</span>
                                <span className="text-red-400 font-bold">{gameState.losses}</span>
                            </div>
                            
                            {/* 胜率百分比 */}
                            <div className="flex justify-between gap-4">
                                <span>胜率:</span>
                                <span className="text-yellow-400 font-bold">{winRate}%</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {/* 游戏结果显示 */}
            {showResult && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-90 text-white p-6 rounded-xl text-center pointer-events-auto">
                    <div className="text-2xl font-bold mb-2">🎉</div>
                    <div className="text-lg font-bold">{gameResult}</div>
                </div>
            )}
            
            {/* 游戏控制按钮 - 底部居中的操作按钮组 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 pointer-events-auto">
                {/* 发牌按钮 - 仅在游戏未开始且未结束时显示 */}
                {!gameState.gameStarted && !gameState.gameOver && (
                    <button
                        onClick={onDeal}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        🎴 发牌
                    </button>
                )}
                
                {/* 游戏进行中的按钮 - 要牌和停牌 */}
                {gameState.gameStarted && !gameState.gameOver && (
                    <>
                        {/* 要牌按钮 - 继续抽取卡牌 */}
                        <button
                            onClick={onHit}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            🎯 要牌
                        </button>
                        
                        {/* 停牌按钮 - 结束玩家回合，让庄家开始 */}
                        <button
                            onClick={onStand}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            ✋ 停牌
                        </button>
                    </>
                )}
                
                {/* 游戏结束后的再来一局按钮 */}
                {gameState.gameOver && (
                    <button
                        onClick={onDeal}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        🔄 再来一局
                    </button>
                )}
                
                {/* 新游戏按钮 - 重置所有统计数据 */}
                <button
                    onClick={onNewGame}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                    🎮 新游戏
                </button>
            </div>
            
            {/* 游戏规则说明 - 右上角帮助面板 */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg pointer-events-auto max-w-sm">
                <h3 className="font-bold text-lg mb-2">🎯 游戏规则</h3>
                <ul className="text-sm space-y-1">
                    {/* 游戏目标 */}
                    <li>• 目标：让手牌总分接近21点</li>
                    
                    {/* A牌规则 */}
                    <li>• A可以是1点或11点</li>
                    
                    {/* 人头牌规则 */}
                    <li>• J、Q、K都是10点</li>
                    
                    {/* 爆牌规则 */}
                    <li>• 超过21点即爆牌</li>
                    
                    {/* 庄家规则 */}
                    <li>• 庄家17点以下必须要牌</li>
                </ul>
            </div>
        </div>
    );
}; 