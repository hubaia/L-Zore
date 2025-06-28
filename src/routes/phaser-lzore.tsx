import React, { useCallback } from 'react';
import { LZorePhaserGame } from '../components/LZorePhaserGame';

/**
 * Phaser优化版L-Zore神煞卡牌游戏页面
 */
export default function PhaserLZorePage() {
    console.log('📄 PhaserLZorePage 组件渲染');
    
    // 使用useCallback稳定回调函数引用，避免重复创建游戏实例
    const handleGameStateChange = useCallback((state: any) => {
        console.log('游戏状态变化:', state);
    }, []);

    const handleCardPlayed = useCallback((card: any, position: number) => {
        console.log('卡牌放置:', card.name, '位置:', position);
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
            {/* 移除重复的页面标题栏，使用React UI组件的状态栏 */}
            
            {/* 主体布局：左侧面板信息 + 中间游戏界面 + 右侧操作指南 */}
            <div className="flex h-screen">
                {/* 左侧面板信息 */}
                <div className="w-80 bg-black bg-opacity-60 p-4 overflow-y-auto">
                    <div className="text-white">
                        <h3 className="text-xl font-bold mb-4 text-center text-cyan-400">
                            📊 游戏面板
                        </h3>
                        
                        {/* 即时系统状态 */}
                        <div className="mb-6">
                            <h4 className="font-bold text-green-400 mb-3 text-lg">即时系统状态</h4>
                            <div className="space-y-2 text-sm bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">游戏时间:</span>
                                    <span className="text-yellow-400 font-bold">0s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">当前周期:</span>
                                    <span className="text-cyan-400 font-bold">1</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">优先权:</span>
                                    <span className="text-gray-400 font-bold">无</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">冷却状态:</span>
                                    <span className="text-green-400 font-bold">可操作</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">手牌数量:</span>
                                    <span className="text-purple-400 font-bold">5</span>
                                </div>
                            </div>
                        </div>

                        {/* 战场信息 */}
                        <div className="mb-6">
                            <h4 className="font-bold text-orange-400 mb-3 text-lg">战场信息</h4>
                            <div className="space-y-2 text-sm bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">已部署神煞:</span>
                                    <span className="text-green-400 font-bold">0/8</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">吉神数量:</span>
                                    <span className="text-green-400 font-bold">0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">凶神数量:</span>
                                    <span className="text-red-400 font-bold">0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">特殊神煞:</span>
                                    <span className="text-purple-400 font-bold">0</span>
                                </div>
                            </div>
                        </div>

                        {/* 战斗统计 */}
                        <div className="mb-6">
                            <h4 className="font-bold text-red-400 mb-3 text-lg">战斗统计</h4>
                            <div className="space-y-2 text-sm bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">总胜利:</span>
                                    <span className="text-green-400 font-bold">0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">总失败:</span>
                                    <span className="text-red-400 font-bold">0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">胜率:</span>
                                    <span className="text-yellow-400 font-bold">0%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">连胜:</span>
                                    <span className="text-blue-400 font-bold">0</span>
                                </div>
                            </div>
                        </div>

                        {/* 当前神煞效果 */}
                        <div className="mb-6">
                            <h4 className="font-bold text-pink-400 mb-3 text-lg">当前效果</h4>
                            <div className="space-y-2 text-sm bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                                <div className="text-gray-400 text-center py-2">
                                    暂无激活的神煞效果
                                </div>
                            </div>
                        </div>

                        {/* 游戏操作 */}
                        <div>
                            <h4 className="font-bold text-indigo-400 mb-3 text-lg">游戏操作</h4>
                            <div className="space-y-3">
                                <button 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                                    onClick={() => {
                                        // 触发游戏中的抽卡功能
                                        const gameCanvas = document.querySelector('canvas');
                                        if (gameCanvas) {
                                            const keyEvent = new KeyboardEvent('keydown', { key: 'd', code: 'KeyD' });
                                            gameCanvas.dispatchEvent(keyEvent);
                                        }
                                    }}
                                >
                                    🎲 手动抽牌 (D键)
                                </button>
                                
                                <button 
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                                    onClick={() => {
                                        const gameCanvas = document.querySelector('canvas');
                                        if (gameCanvas) {
                                            const keyEvent = new KeyboardEvent('keydown', { key: 's', code: 'KeyS' });
                                            gameCanvas.dispatchEvent(keyEvent);
                                        }
                                    }}
                                >
                                    ⚡ 使用神煞 (S键)
                                </button>
                                
                                <button 
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                                    onClick={() => {
                                        const gameCanvas = document.querySelector('canvas');
                                        if (gameCanvas) {
                                            const keyEvent = new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' });
                                            gameCanvas.dispatchEvent(keyEvent);
                                        }
                                    }}
                                >
                                    🔄 释放优先权 (E键)
                                </button>

                                <div className="mt-4 text-xs text-gray-400 bg-gray-800 bg-opacity-50 p-2 rounded">
                                    <div className="font-semibold mb-1">即时系统快捷键:</div>
                                    <div>D - 手动抽牌 | S - 使用神煞</div>
                                    <div>E - 释放优先权 | ESC - 关闭面板</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 中间游戏界面 */}
                <div className="flex-1 px-4 py-2">
                    <div className="h-full bg-black rounded-xl shadow-2xl overflow-hidden">
                        <LZorePhaserGame
                            onGameStateChange={handleGameStateChange}
                            onCardPlayed={handleCardPlayed}
                        />
                    </div>
                </div>

                {/* 右侧操作指南面板 */}
                <div className="w-80 bg-black bg-opacity-60 p-4 overflow-y-auto">
                    <div className="text-white">
                        <h3 className="text-xl font-bold mb-4 text-center text-yellow-400">
                            🎯 操作指南
                        </h3>
                        
                        {/* 即时系统操作 */}
                        <div className="mb-6">
                            <h4 className="font-bold text-blue-400 mb-3 text-lg">即时系统操作</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="text-green-400 mt-0.5">🏆</span>
                                    <div>
                                        <div className="font-semibold text-green-400">抢夺优先权</div>
                                        <div className="text-gray-300">先拖拽卡牌到战场即可获得优先权</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">⚡</span>
                                    <div>
                                        <div className="font-semibold text-red-400">使用神煞能力</div>
                                        <div className="text-gray-300">拥有优先权时才能使用神煞能力</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-0.5">🕐</span>
                                    <div>
                                        <div className="font-semibold text-orange-400">冷却系统</div>
                                        <div className="text-gray-300">使用神煞后进入5秒冷却期</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-0.5">🔄</span>
                                    <div>
                                        <div className="font-semibold text-blue-400">释放优先权</div>
                                        <div className="text-gray-300">主动释放优先权，重新竞争</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                    <span className="text-purple-400 mt-0.5">⏰</span>
                                    <div>
                                        <div className="font-semibold text-purple-400">周期系统</div>
                                        <div className="text-gray-300">每10秒一个周期，自动抽牌</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 高级特性 */}
                        <div className="mb-6">
                            <h4 className="font-bold text-red-400 mb-3 text-lg">高级特性</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="text-yellow-400 mt-0.5">💎</span>
                                    <div>
                                        <div className="font-semibold text-yellow-400">粒子特效</div>
                                        <div className="text-gray-300">神煞激活时的华丽效果</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-0.5">🌟</span>
                                    <div>
                                        <div className="font-semibold text-cyan-400">星空背景</div>
                                        <div className="text-gray-300">动态星空营造氛围</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                    <span className="text-pink-400 mt-0.5">📱</span>
                                    <div>
                                        <div className="font-semibold text-pink-400">响应式设计</div>
                                        <div className="text-gray-300">完美适配各种设备</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                    <span className="text-indigo-400 mt-0.5">🚀</span>
                                    <div>
                                        <div className="font-semibold text-indigo-400">高性能渲染</div>
                                        <div className="text-gray-300">60FPS流畅游戏体验</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 即时系统策略 */}
                        <div>
                            <h4 className="font-bold text-purple-400 mb-3 text-lg">即时系统策略</h4>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div>• 抢夺优先权：先出手获得主动权</div>
                                <div>• 冷却管理：合理安排神煞使用时机</div>
                                <div>• 观察对手：预判对方行动节奏</div>
                                <div>• 时机把握：在关键时刻使用神煞</div>
                                <div>• 优先权释放：适时让出重新竞争</div>
                                <div>• 周期规划：每10秒的节奏掌控</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 