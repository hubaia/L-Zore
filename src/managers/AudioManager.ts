/**
 * 音频管理器 - 处理所有Web Audio API相关功能
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class AudioManager {
    private scene: Phaser.Scene;
    private audioContext: AudioContext | null = null;
    private audioBuffer: AudioBuffer | null = null;
    private audioSource: AudioBufferSourceNode | null = null;
    private isAudioPlaying: boolean = false;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
    
    /**
     * 初始化Web Audio API
     */
    async initWebAudioAPI(): Promise<void> {
        try {
            console.log('🎵 AudioManager: 创建AudioContext...');
            // 创建AudioContext
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            // 创建AbortController来处理超时
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            try {
                // 异步加载音频文件
                const audioUrl = '/Audio/BGM/Battle/虚拟人格对抗 (1).mp3';
                console.log('🎵 AudioManager: 开始加载音频文件:', audioUrl);
                
                const response = await fetch(audioUrl, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const arrayBuffer = await response.arrayBuffer();
                console.log('🎵 AudioManager: 音频文件加载完成，开始解码...');
                
                this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                console.log('✅ AudioManager: Web Audio API初始化成功，音频已解码');
                
                clearTimeout(timeoutId);
                
            } catch (fetchError) {
                clearTimeout(timeoutId);
                throw fetchError;
            }
            
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.error('❌ AudioManager: 音频加载超时（10秒）');
            } else {
                console.error('❌ AudioManager: Web Audio API初始化失败:', error);
            }
        }
    }
    
    /**
     * 播放背景音乐
     */
    playBackgroundMusic(): void {
        try {
            if (!this.audioContext || !this.audioBuffer) {
                console.warn('⚠️ AudioManager: 音频系统未初始化或音频缓冲区不存在');
                return;
            }
            
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            if (this.isAudioPlaying && this.audioSource) {
                console.log('🎵 AudioManager: 背景音乐已在播放中');
                return;
            }
            
            console.log('🎵 AudioManager: 开始播放背景音乐');
            
            // 创建新的音频源
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.audioBuffer;
            this.audioSource.loop = true;
            
            // 创建音量控制节点，降低背景音乐音量
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0.25; // 降低到25%音量，为语音台词留出空间，确保入场台词清晰可听
            
            this.audioSource.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // 设置结束回调
            this.audioSource.onended = () => {
                console.log('🎵 AudioManager: 背景音乐播放结束');
                this.isAudioPlaying = false;
                this.audioSource = null;
            };
            
            this.audioSource.start(0);
            this.isAudioPlaying = true;
            
            console.log('✅ AudioManager: 背景音乐开始播放');
            
        } catch (error) {
            console.error('❌ AudioManager: 播放背景音乐失败:', error);
        }
    }
    
    /**
     * 停止背景音乐
     */
    stopBackgroundMusic(): void {
        try {
            if (this.audioSource && this.isAudioPlaying) {
                console.log('🛑 AudioManager: 停止背景音乐');
                this.audioSource.stop();
                this.audioSource = null;
                this.isAudioPlaying = false;
            }
        } catch (error) {
            console.error('❌ AudioManager: 停止背景音乐失败:', error);
        }
    }
    
    /**
     * 暂停背景音乐
     */
    pauseBackgroundMusic(): void {
        try {
            if (this.audioContext && this.audioContext.state === 'running') {
                console.log('⏸️ AudioManager: 暂停背景音乐');
                this.audioContext.suspend();
            }
        } catch (error) {
            console.error('❌ AudioManager: 暂停背景音乐失败:', error);
        }
    }
    
    /**
     * 恢复背景音乐
     */
    resumeBackgroundMusic(): void {
        try {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                console.log('▶️ AudioManager: 恢复背景音乐');
                this.audioContext.resume();
            }
        } catch (error) {
            console.error('❌ AudioManager: 恢复背景音乐失败:', error);
        }
    }
    
    /**
     * 自动启动背景音乐（在用户交互后）
     */
    async autoStartBackgroundMusic(): Promise<void> {
        console.log('🔄 AudioManager: 尝试自动启动背景音乐...');
        
        // 延迟2秒后尝试播放，给场景初始化足够时间
        this.scene.time.delayedCall(2000, async () => {
            try {
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }
                
                if (!this.isAudioPlaying) {
                    this.playBackgroundMusic();
                    console.log('✅ AudioManager: 自动启动背景音乐成功');
                } else {
                    console.log('ℹ️ AudioManager: 背景音乐已在播放，无需启动');
                }
            } catch (error) {
                console.warn('⚠️ AudioManager: 自动启动失败，可能需要用户手动启动:', error);
            }
        });
    }
    
    /**
     * 切换音频播放状态
     */
    toggleAudio(): void {
        console.log('🔄 AudioManager: 切换音频状态...');
        console.log('🔍 AudioManager: 当前状态 - isPlaying:', this.isAudioPlaying, 'context:', this.audioContext?.state);
        
        if (!this.audioContext) {
            console.warn('⚠️ AudioManager: 音频上下文未初始化');
            return;
        }
        
        if (this.audioContext.state === 'suspended') {
            // 当前是暂停状态，恢复播放
            this.resumeBackgroundMusic();
        } else if (this.audioContext.state === 'running') {
            if (this.isAudioPlaying) {
                // 当前在播放，暂停
                this.pauseBackgroundMusic();
            } else {
                // 没有在播放，开始播放
                this.playBackgroundMusic();
            }
        } else {
            // 其他状态，尝试启动
            console.log('🎵 AudioManager: 音频上下文状态为', this.audioContext.state, '，尝试启动播放');
            this.playBackgroundMusic();
        }
    }
    
    /**
     * 获取音频播放状态
     */
    getAudioState(): {
        isPlaying: boolean;
        contextState: string;
        hasBuffer: boolean;
    } {
        return {
            isPlaying: this.isAudioPlaying,
            contextState: this.audioContext?.state || 'not-initialized',
            hasBuffer: !!this.audioBuffer
        };
    }
    
    /**
     * 清理资源
     */
    dispose(): void {
        console.log('🧹 AudioManager: 清理资源');
        
        if (this.audioSource) {
            this.audioSource.stop();
            this.audioSource = null;
        }
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.audioBuffer = null;
        this.isAudioPlaying = false;
    }
} 