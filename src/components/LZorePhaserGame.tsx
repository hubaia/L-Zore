import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import type { LZoreCard, GameState, LZorePhaserGameProps } from '../types/gameTypes';
import { INITIAL_GAME_STATE } from '../constants/gameData';
import { LZoreGameScene } from '../scenes/LZoreGameScene';

/**
 * L-Zore Phaser游戏React组件
 * 集成Phaser游戏引擎与React UI系统
 */
export const LZorePhaserGame: React.FC<LZorePhaserGameProps> = ({ 
    onGameStateChange, 
    onCardPlayed 
}) => {
    const gameRef = useRef<HTMLDivElement>(null);
    const phaserGameRef = useRef<Phaser.Game | null>(null);
    const [gameReady, setGameReady] = useState(false);
    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

    useEffect(() => {
        if (!gameRef.current) return;

        // Phaser游戏配置
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 1200,
            height: 800,
            parent: gameRef.current,
            backgroundColor: '#1a1a2e',
            scene: LZoreGameScene,
            
            // 音频配置 - 禁用音频以避免AudioContext错误
            audio: {
                disableWebAudio: true,
                noAudio: true
            },
            
            // 物理引擎配置
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: false
                }
            },
            
            // 输入配置
            input: {
                activePointers: 3 // 支持多点触控
            },
            
            // 缩放配置
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                min: {
                    width: 800,
                    height: 600
                },
                max: {
                    width: 1600,
                    height: 1200
                }
            },
            
            // 渲染配置 - 像素风格
            render: {
                antialias: false,
                pixelArt: true,
                roundPixels: true
            }
        };

        // 创建游戏实例
        try {
            phaserGameRef.current = new Phaser.Game(config);

            // 监听游戏事件
            phaserGameRef.current.events.once('ready', () => {
                setGameReady(true);
                
                const scene = phaserGameRef.current?.scene.getScene('LZoreGameScene') as LZoreGameScene;
                if (scene) {
                    // 监听游戏状态变化
                    scene.events.on('gameStateChanged', (newState: GameState) => {
                        setGameState(newState);
                        onGameStateChange?.(newState);
                    });
                    
                    // 监听卡牌放置事件
                    scene.events.on('cardPlaced', (data: { card: LZoreCard, position: number }) => {
                        onCardPlayed?.(data.card, data.position);
                    });
                }
            });
        } catch (error) {
            console.error('创建Phaser游戏实例失败:', error);
        }

        // 清理函数
        return () => {
            try {
                if (phaserGameRef.current) {
                    // 停止所有场景
                    phaserGameRef.current.scene.scenes.forEach(scene => {
                        if (scene.scene.isActive()) {
                            scene.scene.stop();
                        }
                    });
                    
                    // 销毁游戏实例
                    phaserGameRef.current.destroy(true, false);
                    phaserGameRef.current = null;
                }
            } catch (error) {
                console.warn('销毁Phaser游戏实例时出现警告:', error);
                // 忽略销毁时的AudioContext错误
            }
        };
    }, [onGameStateChange, onCardPlayed]);

    return (
        <div className="relative w-full h-full bg-gray-900">
            {/* Phaser游戏容器 */}
            <div 
                ref={gameRef} 
                className="w-full h-full rounded-lg overflow-hidden shadow-2xl"
            />
            
            {/* 加载状态 */}
            {!gameReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        <div className="text-white text-xl font-bold">
                            🌟 L-Zore神煞系统启动中...
                        </div>
                        <div className="text-gray-300 text-sm mt-2">
                            正在初始化赛博朋克命理战斗引擎
                        </div>
                    </div>
                </div>
            )}
            
            {/* React UI覆盖层 */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
                <div className="text-sm space-y-2">
                    <div>🎮 回合: {gameState.currentTurn}</div>
                    <div>🎭 玩家八字: {gameState.playerBazi.year.gan}{gameState.playerBazi.year.zhi} {gameState.playerBazi.month.gan}{gameState.playerBazi.month.zhi} {gameState.playerBazi.day.gan}{gameState.playerBazi.day.zhi} {gameState.playerBazi.hour.gan}{gameState.playerBazi.hour.zhi}</div>
                    <div>❤️ 剩余元素: {gameState.playerRemainingElements}/8</div>
                    <div>⚔️ 对手元素: {gameState.opponentRemainingElements}/8</div>
                    <div>🎯 阶段: {gameState.gamePhase}</div>
                </div>
            </div>
            
            {/* 游戏控制按钮 */}
            <div className="absolute bottom-4 left-4 flex gap-2">
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => {
                        const scene = phaserGameRef.current?.scene.getScene('LZoreGameScene') as LZoreGameScene;
                        scene?.endTurn?.();
                    }}
                >
                    结束回合
                </button>
                
                <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => {
                        const scene = phaserGameRef.current?.scene.getScene('LZoreGameScene') as LZoreGameScene;
                        scene?.useSpecialAbility?.();
                    }}
                >
                    使用神煞
                </button>
                
                <button 
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => {
                        const scene = phaserGameRef.current?.scene.getScene('LZoreGameScene') as LZoreGameScene;
                        scene?.drawCard?.();
                    }}
                >
                    抽取卡牌
                </button>
            </div>
        </div>
    );
}; 