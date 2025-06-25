import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { LZoreGameScene } from '../scenes/LZoreGameScene';

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

    useEffect(() => {
        if (!gameRef.current) return;

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
            phaserGameRef.current = new Phaser.Game(config);
            
            // 监听场景事件
            if (phaserGameRef.current.scene && onGameStateChange && onCardPlayed) {
                const scene = phaserGameRef.current.scene.getScene('LZoreGameScene');
                if (scene) {
                    scene.events.on('gameStateChanged', onGameStateChange);
                    scene.events.on('cardPlayed', onCardPlayed);
                }
            }
        } catch (error) {
            console.error('Phaser游戏初始化失败:', error);
        }

        return () => {
            if (phaserGameRef.current) {
                try {
                    phaserGameRef.current.destroy(true);
                    phaserGameRef.current = null;
                } catch (error) {
                    console.warn('Phaser游戏清理警告:', error);
                }
            }
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