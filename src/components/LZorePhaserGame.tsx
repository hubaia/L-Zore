import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { LZoreGameScene } from '../scenes/LZoreGameScene.refactored';

interface LZorePhaserGameProps {
    onGameStateChange?: (state: any) => void;
    onCardPlayed?: (cardData: any, position: number) => void;
}

/**
 * L-Zore Phaser游戏React组件
 * 集成Phaser游戏引擎与React UI系统，包含资源加载状态管理
 */
export const LZorePhaserGame: React.FC<LZorePhaserGameProps> = ({ 
    onGameStateChange, 
    onCardPlayed 
}) => {
    const gameRef = useRef<HTMLDivElement>(null);
    const phaserGameRef = useRef<Phaser.Game | null>(null);
    
    // Loading状态管理
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('正在初始化游戏引擎...');
    
    console.log('🎮 LZorePhaserGame 组件渲染');

    // 连接场景事件的函数
    const connectSceneEvents = () => {
        try {
            console.log('🔗 开始连接场景事件...');
            
            if (!phaserGameRef.current?.scene) {
                console.warn('⚠️ Phaser场景管理器不存在');
                return false;
            }
            
            const scene = phaserGameRef.current.scene.getScene('LZoreGameScene');
            if (!scene) {
                console.warn('⚠️ LZoreGameScene场景不存在');
                return false;
            }
            
            console.log('✅ 找到LZoreGameScene，设置事件监听器...');
            
            // 清理旧的事件监听器
            scene.events.off('gameStateChanged');
            scene.events.off('cardPlayed');
            scene.events.off('loadingProgress');
            scene.events.off('gameReady');
            
            // 添加新的事件监听器
            if (onGameStateChange) {
                scene.events.on('gameStateChanged', onGameStateChange);
            }
            if (onCardPlayed) {
                scene.events.on('cardPlayed', onCardPlayed);
            }
            
            // 监听加载进度事件
            scene.events.on('loadingProgress', (progress: number, text: string) => {
                console.log(`📊 加载进度: ${progress}% - ${text}`);
                setLoadingProgress(progress);
                setLoadingText(text);
            });
            
            // 监听游戏准备完成事件
            scene.events.on('gameReady', () => {
                console.log('🎮 游戏资源加载完成，准备开始游戏');
                setLoadingText('游戏准备完成！');
                setLoadingProgress(100);
                
                // 延迟隐藏loading界面，让用户看到100%完成状态
                setTimeout(() => {
                    setIsLoading(false);
                    
                    // loading完成后开始播放BGM
                    console.log('🎵 Loading完成，开始播放背景音乐');
                    try {
                        const audioManager = (scene as any).audioManager;
                        if (audioManager && audioManager.autoStartBackgroundMusic) {
                            audioManager.autoStartBackgroundMusic();
                            console.log('✅ BGM已在loading完成后启动');
                        } else {
                            console.warn('⚠️ AudioManager或autoStartBackgroundMusic方法不存在');
                        }
                    } catch (error) {
                        console.error('❌ BGM启动失败:', error);
                    }
                }, 500);
            });
            
            console.log('✅ 场景事件监听器设置完成');
            return true;
            
        } catch (error) {
            console.error('❌ 连接场景事件失败:', error);
            return false;
        }
    };

    useEffect(() => {
        console.log('🔄 LZorePhaserGame useEffect 触发');
        
        if (!gameRef.current) {
            console.log('❌ gameRef.current 不存在');
            return;
        }
        
        // 防止重复创建游戏实例
        if (phaserGameRef.current) {
            console.warn('⚠️ 游戏实例已存在，跳过创建。实例ID:', phaserGameRef.current.config);
            return;
        }

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: '100%',
            height: '100%',
            parent: gameRef.current,
            backgroundColor: '#0f0f23',
            scene: LZoreGameScene,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0, x: 0 },
                    debug: false
                }
            },
            render: {
                pixelArt: true,
                antialias: false,
                roundPixels: true
            },
            audio: {
                disableWebAudio: false,
                noAudio: false
            },
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: '100%',
                height: '100%'
            }
        };

        try {
            console.log('🎮 创建新的Phaser游戏实例');
            setLoadingText('正在创建游戏实例...');
            setLoadingProgress(10);
            
            phaserGameRef.current = new Phaser.Game(config);
            
            // 监听游戏场景的加载事件
            phaserGameRef.current.events.on('ready', () => {
                console.log('🎮 Phaser游戏引擎已准备就绪');
                setLoadingText('游戏引擎已就绪，正在加载资源...');
                setLoadingProgress(20);
                
                // 延迟连接场景事件，确保场景完全初始化
                setTimeout(() => {
                    console.log('🔗 尝试连接场景事件...');
                    connectSceneEvents();
                }, 500);
            });
            
            // 设置超时处理，避免无限等待
            setTimeout(() => {
                if (loadingProgress <= 20) {
                    console.warn('⚠️ 加载超时，尝试强制继续...');
                    setLoadingProgress(25);
                    setLoadingText('检测到加载延迟，正在重试...');
                    connectSceneEvents();
                }
            }, 5000);
            
        } catch (error) {
            console.error('Phaser游戏初始化失败:', error);
            setLoadingText('游戏初始化失败');
        }

        return () => {
            if (phaserGameRef.current) {
                try {
                    console.log('🧹 清理Phaser游戏实例');
                    phaserGameRef.current.destroy(true);
                    phaserGameRef.current = null;
                } catch (error) {
                    console.warn('Phaser游戏清理警告:', error);
                }
            }
        };
    }, []); // 移除依赖，只在组件挂载时创建一次

    // 当回调函数更新时重新连接事件
    useEffect(() => {
        console.log('🔄 回调函数更新，尝试重新连接场景事件...');
        
        // 延迟连接，确保场景已经初始化
        const timer = setTimeout(() => {
            connectSceneEvents();
        }, 100);
        
        return () => {
            clearTimeout(timer);
            // 清理事件监听器
            try {
                const scene = phaserGameRef.current?.scene?.getScene('LZoreGameScene');
                if (scene) {
                    scene.events.off('gameStateChanged');
                    scene.events.off('cardPlayed');
                    scene.events.off('loadingProgress');
                    scene.events.off('gameReady');
                }
            } catch (error) {
                console.warn('清理事件监听器时出错:', error);
            }
        };
    }, [onGameStateChange, onCardPlayed]);

    // Loading组件
    const LoadingScreen = () => (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 z-50">
            {/* 背景星空效果 */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-16 right-16 w-1 h-1 bg-pink-400 rounded-full animate-pulse animation-delay-500"></div>
                <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse animation-delay-1500"></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-3000"></div>
            </div>
            
            {/* 主要内容 */}
            <div className="relative z-10 text-center max-w-md px-6">
                {/* Logo区域 */}
                <div className="mb-8">
                    <div className="text-6xl mb-4 animate-pulse">🎴</div>
                    <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        L-Zore
                    </h1>
                    <p className="text-purple-200 text-lg">神煞卡牌战斗系统</p>
                </div>
                
                {/* 进度条 */}
                <div className="mb-6">
                    <div className="w-full bg-gray-800 rounded-full h-3 mb-3 overflow-hidden border border-purple-500/30">
                        <div 
                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full transition-all duration-300 ease-out relative"
                            style={{ width: `${loadingProgress}%` }}
                        >
                            {/* 闪光效果 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-purple-300">{loadingProgress}%</span>
                        <span className="text-cyan-300">{loadingProgress < 100 ? '加载中...' : '完成！'}</span>
                    </div>
                </div>
                
                {/* 状态文本 */}
                <div className="mb-6">
                    <p className="text-white text-base font-medium mb-2">{loadingText}</p>
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-200"></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce animation-delay-400"></div>
                    </div>
                </div>
                
                {/* 加载提示 */}
                <div className="text-purple-300 text-sm space-y-1">
                    <p>🎵 准备背景音乐</p>
                    <p>🎨 加载神煞卡牌</p>
                    <p>⚡ 初始化战斗系统</p>
                </div>
                
                {/* 调试按钮 - 仅在卡住时显示 */}
                {loadingProgress <= 20 && (
                    <div className="mt-6">
                        <button 
                            onClick={() => {
                                console.log('🔧 手动跳过加载过程');
                                setLoadingProgress(100);
                                setLoadingText('手动跳过加载');
                                setTimeout(() => setIsLoading(false), 1000);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            🔧 跳过加载 (调试)
                        </button>
                        <p className="text-yellow-300 text-xs mt-2">
                            如果长时间卡在此处，可点击跳过
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div 
            className="game-container relative"
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
            }}
        >
            {/* Loading遮罩层 */}
            {isLoading && <LoadingScreen />}
            
            {/* 游戏容器 */}
            <div 
                ref={gameRef}
                className="w-full h-full"
                style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}
            />
        </div>
    );
}; 