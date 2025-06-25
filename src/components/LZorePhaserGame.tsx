import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { LZoreGameScene } from '../scenes/LZoreGameScene.refactored';

interface LZorePhaserGameProps {
    onGameStateChange?: (state: any) => void;
    onCardPlayed?: (cardData: any, position: number) => void;
}

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
    
    console.log('🎮 LZorePhaserGame 组件渲染');

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
                disableWebAudio: true,
                noAudio: true
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
            phaserGameRef.current = new Phaser.Game(config);
        } catch (error) {
            console.error('Phaser游戏初始化失败:', error);
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

    // 单独处理回调函数的更新
    useEffect(() => {
        if (!phaserGameRef.current?.scene) return;
        
        const scene = phaserGameRef.current.scene.getScene('LZoreGameScene');
        if (!scene) return;
        
        // 移除旧的事件监听器
        scene.events.off('gameStateChanged');
        scene.events.off('cardPlayed');
        
        // 添加新的事件监听器
        if (onGameStateChange) {
            scene.events.on('gameStateChanged', onGameStateChange);
        }
        if (onCardPlayed) {
            scene.events.on('cardPlayed', onCardPlayed);
        }
        
        return () => {
            // 清理事件监听器
            scene.events.off('gameStateChanged');
            scene.events.off('cardPlayed');
        };
    }, [onGameStateChange, onCardPlayed]);

    return (
        <div 
            ref={gameRef} 
            className="game-container"
            style={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
            }}
        />
    );
}; 