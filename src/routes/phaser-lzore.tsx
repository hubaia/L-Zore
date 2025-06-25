import React from 'react';
import { LZorePhaserGame } from '../components/LZorePhaserGame';

/**
 * Phaser优化版L-Zore神煞卡牌游戏页面
 */
export default function PhaserLZorePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
            {/* 页面标题 */}
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            🚀 L-Zore 神煞卡牌战斗系统
                        </h1>
                        <h2 className="text-xl text-blue-300 mb-4">
                            Phaser 3 引擎优化版本
                        </h2>
                        <div className="flex justify-center gap-4 text-sm text-gray-300">
                            <span className="bg-green-600 px-3 py-1 rounded-full">✨ GPU加速渲染</span>
                            <span className="bg-blue-600 px-3 py-1 rounded-full">🎮 专业游戏引擎</span>
                            <span className="bg-purple-600 px-3 py-1 rounded-full">💫 华丽粒子特效</span>
                            <span className="bg-orange-600 px-3 py-1 rounded-full">📱 多点触控支持</span>
                        </div>
                    </div>

                    {/* 游戏容器 */}
                    <div className="w-full max-w-6xl mx-auto">
                        <div className="bg-black rounded-xl shadow-2xl overflow-hidden">
                            <LZorePhaserGame
                                onGameStateChange={(state) => {
                                    console.log('游戏状态变化:', state);
                                }}
                                onCardPlayed={(card, position) => {
                                    console.log('卡牌放置:', card.name, '位置:', position);
                                }}
                            />
                        </div>
                    </div>

                    {/* 技术特性介绍 */}
                    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                        <div className="bg-black bg-opacity-50 rounded-lg p-6 text-white">
                            <div className="text-2xl mb-3">🚀</div>
                            <h3 className="text-lg font-bold mb-2">性能优化</h3>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>• WebGL硬件加速</li>
                                <li>• 对象池管理</li>
                                <li>• 批量渲染</li>
                                <li>• 内存优化</li>
                            </ul>
                        </div>

                        <div className="bg-black bg-opacity-50 rounded-lg p-6 text-white">
                            <div className="text-2xl mb-3">✨</div>
                            <h3 className="text-lg font-bold mb-2">视觉效果</h3>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>• 粒子系统特效</li>
                                <li>• 缓动动画</li>
                                <li>• 动态光影</li>
                                <li>• 着色器效果</li>
                            </ul>
                        </div>

                        <div className="bg-black bg-opacity-50 rounded-lg p-6 text-white">
                            <div className="text-2xl mb-3">🎮</div>
                            <h3 className="text-lg font-bold mb-2">交互体验</h3>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>• 多点触控支持</li>
                                <li>• 手势识别</li>
                                <li>• 物理引擎</li>
                                <li>• 精确碰撞检测</li>
                            </ul>
                        </div>

                        <div className="bg-black bg-opacity-50 rounded-lg p-6 text-white">
                            <div className="text-2xl mb-3">🏗️</div>
                            <h3 className="text-lg font-bold mb-2">架构优势</h3>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>• React集成</li>
                                <li>• 模块化设计</li>
                                <li>• 事件驱动</li>
                                <li>• 易于扩展</li>
                            </ul>
                        </div>
                    </div>

                    {/* 操作说明 */}
                    <div className="mt-8 bg-black bg-opacity-50 rounded-lg p-6 text-white w-full max-w-6xl">
                        <h3 className="text-xl font-bold mb-4 text-center">🎯 操作指南</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-blue-400 mb-3">基础操作</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li><span className="text-green-400">🖱️ 拖拽卡牌</span> - 吉神和特殊神煞拖拽到战场格子</li>
                                    <li><span className="text-red-400">⚡ 凶神自动上场</span> - 凶神卡牌抽到后强制上场并立即造成伤害</li>
                                    <li><span className="text-blue-400">💫 悬停效果</span> - 鼠标悬停查看卡牌详情</li>
                                    <li><span className="text-purple-400">🎭 神煞激活</span> - 点击"使用神煞"选择目标释放效果</li>
                                    <li><span className="text-orange-400">🎲 抽取卡牌</span> - 点击"抽取卡牌"获得新的神煞</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-400 mb-3">高级特性</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li><span className="text-yellow-400">💎 粒子特效</span> - 神煞激活时的华丽效果</li>
                                    <li><span className="text-red-400">⚡ 强制机制</span> - 凶神自动上场，无法控制</li>
                                    <li><span className="text-cyan-400">🌟 星空背景</span> - 动态星空营造氛围</li>
                                    <li><span className="text-pink-400">📱 响应式</span> - 完美适配各种设备</li>
                                    <li><span className="text-indigo-400">🚀 高性能</span> - 60FPS流畅体验</li>
                                    <li><span className="text-purple-400">🎯 策略深度</span> - 凶神自动触发改变战局</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 版本对比 */}
                    <div className="mt-8 bg-black bg-opacity-50 rounded-lg p-6 text-white w-full max-w-6xl">
                        <h3 className="text-xl font-bold mb-4 text-center">⚖️ 版本对比</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="text-left py-3 px-4">特性</th>
                                        <th className="text-center py-3 px-4 text-orange-400">原版 (HTML5)</th>
                                        <th className="text-center py-3 px-4 text-green-400">Phaser版</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300">
                                    <tr className="border-b border-gray-700">
                                        <td className="py-3 px-4">渲染性能</td>
                                        <td className="text-center py-3 px-4">DOM操作</td>
                                        <td className="text-center py-3 px-4">WebGL硬件加速</td>
                                    </tr>
                                    <tr className="border-b border-gray-700">
                                        <td className="py-3 px-4">动画效果</td>
                                        <td className="text-center py-3 px-4">CSS过渡</td>
                                        <td className="text-center py-3 px-4">专业游戏动画</td>
                                    </tr>
                                    <tr className="border-b border-gray-700">
                                        <td className="py-3 px-4">特效系统</td>
                                        <td className="text-center py-3 px-4">基础CSS效果</td>
                                        <td className="text-center py-3 px-4">粒子+着色器</td>
                                    </tr>
                                    <tr className="border-b border-gray-700">
                                        <td className="py-3 px-4">触控支持</td>
                                        <td className="text-center py-3 px-4">单点触控</td>
                                        <td className="text-center py-3 px-4">多点触控</td>
                                    </tr>
                                    <tr className="border-b border-gray-700">
                                        <td className="py-3 px-4">内存管理</td>
                                        <td className="text-center py-3 px-4">手动管理</td>
                                        <td className="text-center py-3 px-4">自动对象池</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4">扩展性</td>
                                        <td className="text-center py-3 px-4">中等</td>
                                        <td className="text-center py-3 px-4">极强</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 