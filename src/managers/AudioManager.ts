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
    
    // 音效系统
    private sfxEnabled: boolean = true;
    private sfxVolume: number = 0.8;
    private sfxBuffers: Map<string, AudioBuffer> = new Map();
    
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
                
                            // 初始化音效系统
            await this.initSFXSystem();
            
            console.log('🎵 AudioManager: 初始化完成，BGM将在loading完成后播放');
                
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
     * 初始化音效系统
     */
    private async initSFXSystem(): Promise<void> {
        console.log('🔊 AudioManager: 初始化音效系统...');
        
        if (!this.audioContext) {
            console.warn('⚠️ AudioManager: AudioContext 未初始化，无法创建音效');
            return;
        }
        
        try {
            // 使用 Web Audio API 生成基础音效
            await this.generateBasicSFX();
            console.log('✅ AudioManager: 音效系统初始化完成');
        } catch (error) {
            console.error('❌ AudioManager: 音效系统初始化失败:', error);
        }
    }
    
    /**
     * 生成基础音效（使用Web Audio API合成）
     */
    private async generateBasicSFX(): Promise<void> {
        if (!this.audioContext) return;
        
        const sampleRate = this.audioContext.sampleRate;
        
        // 🃏 卡牌音效
        this.sfxBuffers.set('card_draw', this.generateCardDrawSFX(sampleRate));
        this.sfxBuffers.set('card_place', this.generateCardPlaceSFX(sampleRate));
        this.sfxBuffers.set('card_hover', this.generateCardHoverSFX(sampleRate));
        this.sfxBuffers.set('card_select', this.generateCardSelectSFX(sampleRate));
        this.sfxBuffers.set('card_flip', this.generateCardFlipSFX(sampleRate));
        this.sfxBuffers.set('card_shuffle', this.generateCardShuffleSFX(sampleRate));
        this.sfxBuffers.set('card_activate', this.generateCardActivateSFX(sampleRate));
        
        // 🎮 UI音效
        this.sfxBuffers.set('ui_button_click', this.generateButtonClickSFX(sampleRate));
        this.sfxBuffers.set('ui_button_hover', this.generateButtonHoverSFX(sampleRate));
        this.sfxBuffers.set('ui_confirm', this.generateConfirmSFX(sampleRate));
        this.sfxBuffers.set('ui_cancel', this.generateCancelSFX(sampleRate));
        this.sfxBuffers.set('ui_error', this.generateErrorSFX(sampleRate));
        this.sfxBuffers.set('ui_success', this.generateSuccessSFX(sampleRate));
        
        // ⚔️ 战斗音效
        this.sfxBuffers.set('battle_attack', this.generateAttackSFX(sampleRate));
        this.sfxBuffers.set('battle_damage', this.generateDamageSFX(sampleRate));
        this.sfxBuffers.set('battle_neutralize', this.generateNeutralizeSFX(sampleRate));
        this.sfxBuffers.set('battle_victory', this.generateVictorySFX(sampleRate));
        this.sfxBuffers.set('battle_defeat', this.generateDefeatSFX(sampleRate));
        
        // ⚡ 神煞音效
        this.sfxBuffers.set('shensha_activate', this.generateShenshaActivateSFX(sampleRate));
        this.sfxBuffers.set('shensha_auspicious', this.generateAuspiciousSFX(sampleRate));
        this.sfxBuffers.set('shensha_inauspicious', this.generateInauspiciousSFX(sampleRate));
        this.sfxBuffers.set('shensha_special', this.generateSpecialSFX(sampleRate));
        
        // 🔄 系统音效
        this.sfxBuffers.set('system_turn_start', this.generateTurnStartSFX(sampleRate));
        this.sfxBuffers.set('system_turn_end', this.generateTurnEndSFX(sampleRate));
        this.sfxBuffers.set('system_game_start', this.generateGameStartSFX(sampleRate));
        this.sfxBuffers.set('system_game_end', this.generateGameEndSFX(sampleRate));
        
        console.log(`🔊 AudioManager: 已生成 ${this.sfxBuffers.size} 个音效`);
    }
    
    // 🃏 卡牌音效生成方法
    private generateCardDrawSFX(sampleRate: number): AudioBuffer {
        const duration = 0.3;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 纸张摩擦声 + 清脆的刷刷声
            const noise = (Math.random() - 0.5) * 0.3;
            const envelope = Math.exp(-t * 8);
            const sweep = Math.sin(2 * Math.PI * (800 + t * 400) * t);
            data[i] = (noise + sweep * 0.2) * envelope * 0.4;
        }
        
        return buffer;
    }
    
    private generateCardPlaceSFX(sampleRate: number): AudioBuffer {
        const duration = 0.2;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 卡牌放置的"啪"声
            const impact = Math.sin(2 * Math.PI * 150 * t) * Math.exp(-t * 15);
            const click = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 25);
            data[i] = (impact + click * 0.3) * 0.5;
        }
        
        return buffer;
    }
    
    private generateCardHoverSFX(sampleRate: number): AudioBuffer {
        const duration = 0.1;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 轻柔的悬停声
            const hover = Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 20);
            data[i] = hover * 0.2;
        }
        
        return buffer;
    }
    
    private generateCardSelectSFX(sampleRate: number): AudioBuffer {
        const duration = 0.15;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 选择确认声
            const select = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 12);
            const harmonic = Math.sin(2 * Math.PI * 1500 * t) * Math.exp(-t * 18);
            data[i] = (select + harmonic * 0.3) * 0.3;
        }
        
        return buffer;
    }
    
    private generateCardFlipSFX(sampleRate: number): AudioBuffer {
        const duration = 0.25;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 翻转声
            const flip = Math.sin(2 * Math.PI * (400 + t * 800) * t) * Math.exp(-t * 10);
            const rustle = (Math.random() - 0.5) * 0.1 * Math.exp(-t * 5);
            data[i] = (flip + rustle) * 0.4;
        }
        
        return buffer;
    }
    
    private generateCardShuffleSFX(sampleRate: number): AudioBuffer {
        const duration = 0.8;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 洗牌声
            const shuffle = (Math.random() - 0.5) * 0.5;
            const envelope = Math.sin(t * 10) * Math.exp(-t * 2);
            const rustle = Math.sin(2 * Math.PI * (200 + Math.random() * 400) * t);
            data[i] = (shuffle + rustle * 0.2) * envelope * 0.3;
        }
        
        return buffer;
    }
    
    private generateCardActivateSFX(sampleRate: number): AudioBuffer {
        const duration = 0.5;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 激活能量声
            const energy = Math.sin(2 * Math.PI * (600 + t * 300) * t) * Math.exp(-t * 3);
            const sparkle = Math.sin(2 * Math.PI * 2000 * t) * Math.exp(-t * 8) * 0.3;
            const pulse = Math.sin(2 * Math.PI * 50 * t) * 0.1;
            data[i] = (energy + sparkle + pulse) * 0.4;
        }
        
        return buffer;
    }
    
    // 🎮 UI音效生成方法
    private generateButtonClickSFX(sampleRate: number): AudioBuffer {
        const duration = 0.1;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const click = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 20);
            data[i] = click * 0.3;
        }
        
        return buffer;
    }
    
    private generateButtonHoverSFX(sampleRate: number): AudioBuffer {
        const duration = 0.08;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const hover = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 25);
            data[i] = hover * 0.15;
        }
        
        return buffer;
    }
    
    private generateConfirmSFX(sampleRate: number): AudioBuffer {
        const duration = 0.3;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 确认音：上升的音调
            const confirm = Math.sin(2 * Math.PI * (600 + t * 400) * t) * Math.exp(-t * 8);
            data[i] = confirm * 0.4;
        }
        
        return buffer;
    }
    
    private generateCancelSFX(sampleRate: number): AudioBuffer {
        const duration = 0.2;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 取消音：下降的音调
            const cancel = Math.sin(2 * Math.PI * (800 - t * 300) * t) * Math.exp(-t * 12);
            data[i] = cancel * 0.3;
        }
        
        return buffer;
    }
    
    private generateErrorSFX(sampleRate: number): AudioBuffer {
        const duration = 0.4;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 错误音：不和谐的双音
            const error1 = Math.sin(2 * Math.PI * 300 * t) * Math.exp(-t * 5);
            const error2 = Math.sin(2 * Math.PI * 317 * t) * Math.exp(-t * 5); // 略微失谐
            data[i] = (error1 + error2) * 0.2;
        }
        
        return buffer;
    }
    
    private generateSuccessSFX(sampleRate: number): AudioBuffer {
        const duration = 0.5;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 成功音：和谐的三和弦琶音
            const note1 = Math.sin(2 * Math.PI * 523 * t) * Math.exp(-t * 4); // C
            const note2 = Math.sin(2 * Math.PI * 659 * t) * Math.exp(-(t-0.1) * 4) * (t > 0.1 ? 1 : 0); // E
            const note3 = Math.sin(2 * Math.PI * 784 * t) * Math.exp(-(t-0.2) * 4) * (t > 0.2 ? 1 : 0); // G
            data[i] = (note1 + note2 + note3) * 0.3;
        }
        
        return buffer;
    }
    
    // ⚔️ 战斗音效生成方法
    private generateAttackSFX(sampleRate: number): AudioBuffer {
        const duration = 0.3;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 攻击音：爆发性的冲击
            const impact = Math.sin(2 * Math.PI * 80 * t) * Math.exp(-t * 8);
            const slice = Math.sin(2 * Math.PI * 1500 * t) * Math.exp(-t * 15);
            data[i] = (impact + slice * 0.4) * 0.5;
        }
        
        return buffer;
    }
    
    private generateDamageSFX(sampleRate: number): AudioBuffer {
        const duration = 0.4;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 伤害音：痛苦的颤音
            const damage = Math.sin(2 * Math.PI * (200 + Math.sin(t * 30) * 50) * t) * Math.exp(-t * 6);
            data[i] = damage * 0.4;
        }
        
        return buffer;
    }
    
    private generateNeutralizeSFX(sampleRate: number): AudioBuffer {
        const duration = 0.6;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 中和音：消散的能量
            const neutralize = Math.sin(2 * Math.PI * (400 - t * 200) * t) * Math.exp(-t * 3);
            const echo = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 8) * 0.3;
            data[i] = (neutralize + echo) * 0.4;
        }
        
        return buffer;
    }
    
    private generateVictorySFX(sampleRate: number): AudioBuffer {
        const duration = 1.0;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 胜利音：欢乐的进行曲
            const melody = Math.sin(2 * Math.PI * 523 * t) * Math.exp(-t * 2) * (t < 0.3 ? 1 : 0) +
                          Math.sin(2 * Math.PI * 659 * t) * Math.exp(-(t-0.3) * 2) * (t >= 0.3 && t < 0.6 ? 1 : 0) +
                          Math.sin(2 * Math.PI * 784 * t) * Math.exp(-(t-0.6) * 2) * (t >= 0.6 ? 1 : 0);
            data[i] = melody * 0.4;
        }
        
        return buffer;
    }
    
    private generateDefeatSFX(sampleRate: number): AudioBuffer {
        const duration = 0.8;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 失败音：下降的叹息
            const defeat = Math.sin(2 * Math.PI * (400 - t * 300) * t) * Math.exp(-t * 3);
            data[i] = defeat * 0.3;
        }
        
        return buffer;
    }
    
    // ⚡ 神煞音效生成方法
    private generateShenshaActivateSFX(sampleRate: number): AudioBuffer {
        const duration = 0.7;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 神煞激活：神秘的共鸣
            const mystical = Math.sin(2 * Math.PI * (300 + t * 200) * t) * Math.exp(-t * 2);
            const harmony = Math.sin(2 * Math.PI * 450 * t) * Math.exp(-t * 3) * 0.5;
            const shimmer = Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 8) * 0.2;
            data[i] = (mystical + harmony + shimmer) * 0.5;
        }
        
        return buffer;
    }
    
    private generateAuspiciousSFX(sampleRate: number): AudioBuffer {
        const duration = 0.5;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 吉神音：温暖上升的和弦
            const blessing = Math.sin(2 * Math.PI * (440 + t * 110) * t) * Math.exp(-t * 4);
            const sparkle = Math.sin(2 * Math.PI * 1760 * t) * Math.exp(-t * 10) * 0.3;
            data[i] = (blessing + sparkle) * 0.4;
        }
        
        return buffer;
    }
    
    private generateInauspiciousSFX(sampleRate: number): AudioBuffer {
        const duration = 0.5;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 凶神音：低沉威胁的音调
            const ominous = Math.sin(2 * Math.PI * (150 - t * 50) * t) * Math.exp(-t * 3);
            const distortion = Math.sin(2 * Math.PI * 300 * t) * Math.exp(-t * 8) * 0.2;
            data[i] = (ominous + distortion) * 0.4;
        }
        
        return buffer;
    }
    
    private generateSpecialSFX(sampleRate: number): AudioBuffer {
        const duration = 0.6;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 特殊神煞：复杂的变化音
            const special = Math.sin(2 * Math.PI * (500 + Math.sin(t * 10) * 100) * t) * Math.exp(-t * 3);
            const flutter = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 12) * 0.2;
            data[i] = (special + flutter) * 0.4;
        }
        
        return buffer;
    }
    
    // 🔄 系统音效生成方法
    private generateTurnStartSFX(sampleRate: number): AudioBuffer {
        const duration = 0.4;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 回合开始：明亮的钟声
            const chime = Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t * 6);
            const echo = Math.sin(2 * Math.PI * 1760 * t) * Math.exp(-t * 12) * 0.3;
            data[i] = (chime + echo) * 0.3;
        }
        
        return buffer;
    }
    
    private generateTurnEndSFX(sampleRate: number): AudioBuffer {
        const duration = 0.3;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 回合结束：柔和的结束音
            const end = Math.sin(2 * Math.PI * (660 - t * 100) * t) * Math.exp(-t * 8);
            data[i] = end * 0.3;
        }
        
        return buffer;
    }
    
    private generateGameStartSFX(sampleRate: number): AudioBuffer {
        const duration = 1.2;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 游戏开始：华丽的开场
            const fanfare = Math.sin(2 * Math.PI * 523 * t) * Math.exp(-t * 2) * (t < 0.4 ? 1 : 0) +
                           Math.sin(2 * Math.PI * 659 * t) * Math.exp(-(t-0.4) * 2) * (t >= 0.4 && t < 0.8 ? 1 : 0) +
                           Math.sin(2 * Math.PI * 784 * t) * Math.exp(-(t-0.8) * 2) * (t >= 0.8 ? 1 : 0);
            data[i] = fanfare * 0.4;
        }
        
        return buffer;
    }
    
    private generateGameEndSFX(sampleRate: number): AudioBuffer {
        const duration = 1.0;
        const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 游戏结束：庄严的尾声
            const ending = Math.sin(2 * Math.PI * (440 - t * 110) * t) * Math.exp(-t * 1.5);
            data[i] = ending * 0.4;
        }
        
        return buffer;
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
            
            // 创建音量控制节点，大幅降低背景音乐音量
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0.1; // 降低到10%音量，为语音台词留出更多空间，确保台词完全清晰
            
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
    
    /**
     * 播放音效
     */
    public playSFX(sfxName: string, volume: number = 1.0, pitch: number = 1.0): void {
        if (!this.sfxEnabled || !this.audioContext) {
            return;
        }
        
        const buffer = this.sfxBuffers.get(sfxName);
        if (!buffer) {
            console.warn(`⚠️ AudioManager: 音效 "${sfxName}" 不存在`);
            return;
        }
        
        try {
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            
            // 音量控制
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = volume * this.sfxVolume;
            
            // 音调控制
            source.playbackRate.value = pitch;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start();
            
            console.log(`🔊 AudioManager: 播放音效 "${sfxName}" (音量: ${volume}, 音调: ${pitch})`);
            
        } catch (error) {
            console.error(`❌ AudioManager: 播放音效 "${sfxName}" 失败:`, error);
        }
    }
    
    /**
     * 播放卡牌动作音效
     */
    public playCardSFX(action: 'draw' | 'place' | 'hover' | 'select' | 'flip' | 'shuffle' | 'activate'): void {
        this.playSFX(`card_${action}`);
    }
    
    /**
     * 播放UI音效
     */
    public playUISFX(action: 'button_click' | 'button_hover' | 'confirm' | 'cancel' | 'error' | 'success'): void {
        this.playSFX(`ui_${action}`);
    }
    
    /**
     * 播放战斗音效
     */
    public playBattleSFX(action: 'attack' | 'damage' | 'neutralize' | 'victory' | 'defeat'): void {
        this.playSFX(`battle_${action}`);
    }
    
    /**
     * 播放神煞音效
     */
    public playShenshaSFX(type: 'activate' | 'auspicious' | 'inauspicious' | 'special'): void {
        this.playSFX(`shensha_${type}`);
    }
    
    /**
     * 播放系统音效
     */
    public playSystemSFX(action: 'turn_start' | 'turn_end' | 'game_start' | 'game_end'): void {
        this.playSFX(`system_${action}`);
    }
    
    /**
     * 设置音效音量
     */
    public setSFXVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 AudioManager: 音效音量设置为 ${this.sfxVolume * 100}%`);
    }
    
    /**
     * 切换音效开关
     */
    public toggleSFX(): boolean {
        this.sfxEnabled = !this.sfxEnabled;
        console.log(this.sfxEnabled ? '🔊 AudioManager: 音效已开启' : '🔇 AudioManager: 音效已关闭');
        return this.sfxEnabled;
    }
    
    /**
     * 获取可用音效列表
     */
    public getAvailableSFX(): string[] {
        return Array.from(this.sfxBuffers.keys());
    }
} 