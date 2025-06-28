/**
 * 语音合成管理器 - 使用Web Speech API实现文本转语音功能
 * 支持神煞卡牌描述朗读、游戏提示语音播报等功能
 */

export interface VoiceConfig {
    voice?: SpeechSynthesisVoice | null;
    rate: number;          // 语速 (0.1 - 10)
    pitch: number;         // 音调 (0 - 2)
    volume: number;        // 音量 (0 - 1)
    lang: string;          // 语言代码
}

export interface SpeechOptions {
    interrupt?: boolean;    // 是否中断当前语音
    callback?: () => void;  // 语音完成回调
    priority?: 'low' | 'normal' | 'high'; // 优先级
}

export class SpeechSynthesisManager {
    private scene: Phaser.Scene;
    private isSupported: boolean = false;
    private isEnabled: boolean = true;
    private currentUtterance: SpeechSynthesisUtterance | null = null;
    private voiceQueue: Array<{ text: string; options: SpeechOptions; config: VoiceConfig }> = [];
    private isPlaying: boolean = false;
    private defaultConfig: VoiceConfig;
    private maleVoices: SpeechSynthesisVoice[] = [];
    private femaleVoices: SpeechSynthesisVoice[] = [];
    
    // 不同类型内容的语音配置
    private voiceConfigs: Record<string, Partial<VoiceConfig>> = {
        shensha: {
            rate: 0.9,
            pitch: 1.2,
            volume: 1.0, // 提升到最大音量确保清晰
            lang: 'zh-CN'
        },
        system: {
            rate: 1.0,
            pitch: 1.0,
            volume: 0.9, // 大幅提升系统语音音量
            lang: 'zh-CN'
        },
        battle: {
            rate: 1.1,
            pitch: 1.3,
            volume: 1.0, // 提升到最大音量确保突出
            lang: 'zh-CN'
        },
        narrative: {
            rate: 0.8,
            pitch: 1.0,
            volume: 0.95, // 提升叙述音量
            lang: 'zh-CN'
        },
        entrance: {
            rate: 0.8,
            pitch: 1.3,
            volume: 1.0, // 保持最大音量，确保戏剧效果突出
            lang: 'zh-CN'
        }
    };
    
    private availableVoices: SpeechSynthesisVoice[] = [];
    private preferredVoice: SpeechSynthesisVoice | null = null;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.defaultConfig = {
            voice: null,
            rate: 0.9,
            pitch: 1.2,
            volume: 1.0, // 默认音量提升到最大
            lang: 'zh-CN'
        };
        this.initialize();
    }
    
    /**
     * 初始化语音合成系统
     */
    private initialize(): void {
        console.log('🎤 SpeechSynthesisManager: 初始化中...');
        
        if (typeof speechSynthesis === 'undefined') {
            console.warn('❌ SpeechSynthesisManager: 当前环境不支持语音合成');
            return;
        }
        
        this.isSupported = true;
        
        // 等待语音列表加载
        const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            
            if (voices.length > 0) {
                console.log(`🔊 SpeechSynthesisManager: 发现 ${voices.length} 个语音`);
                
                // 分类中文语音（男女声）
                this.categorizeChineseVoices(voices);
                
                // 设置默认语音（优先女声）
                const defaultVoice = this.femaleVoices[0] || this.maleVoices[0] || voices.find(voice => 
                    voice.lang.startsWith('zh') || 
                    voice.name.includes('Chinese') ||
                    voice.name.includes('中文')) || voices[0] || null;
                
                if (defaultVoice) {
                    this.defaultConfig.voice = defaultVoice;
                    console.log(`✅ SpeechSynthesisManager: 已选择默认语音: ${defaultVoice.name}`);
                } else {
                    console.log('⚠️ SpeechSynthesisManager: 未找到中文语音，使用系统默认语音');
                }
                
                // 输出分类结果
                console.log(`👩 女性语音: ${this.femaleVoices.length} 个`);
                this.femaleVoices.forEach(voice => console.log(`   • ${voice.name} (${voice.lang})`));
                console.log(`👨 男性语音: ${this.maleVoices.length} 个`);
                this.maleVoices.forEach(voice => console.log(`   • ${voice.name} (${voice.lang})`));
            } else {
                console.log('⏳ SpeechSynthesisManager: 语音列表加载中...');
            }
        };
        
        // 立即尝试加载
        loadVoices();
        
        // 设置语音变化监听器
        speechSynthesis.onvoiceschanged = loadVoices;
        
        console.log('✅ SpeechSynthesisManager: 初始化完成');
    }
    
    /**
     * 分类中文语音（男女声）- 优先中文语音
     */
    private categorizeChineseVoices(voices: SpeechSynthesisVoice[]): void {
        this.maleVoices = [];
        this.femaleVoices = [];
        
        console.log('🔍 开始分类语音，总数:', voices.length);
        
        // 首先过滤出中文语音
        const chineseVoices = voices.filter(voice => {
            const lang = voice.lang.toLowerCase();
            const name = voice.name.toLowerCase();
            
            const isChinese = lang.includes('zh-cn') || 
                             lang.includes('zh_cn') || 
                             lang.includes('cmn-cn') ||
                             lang === 'zh' ||
                             lang.startsWith('zh-') ||
                             name.includes('chinese') ||
                             name.includes('mandarin') ||
                             name.includes('普通话') ||
                             name.includes('中文');
            
            if (isChinese) {
                console.log(`🀄 发现中文语音: ${voice.name} (${voice.lang})`);
            }
            
            return isChinese;
        });
        
        console.log(`🀄 筛选出${chineseVoices.length}个中文语音`);
        
        // 对中文语音进行男女分类
        chineseVoices.forEach(voice => {
            const name = voice.name.toLowerCase();
            
            // 中文男性语音识别关键词（大幅扩展）
            const chineseMaleKeywords = [
                'male', 'man', 'boy', '男', '男性', 'kangkang', 'yunxi', 'xiaobei', 
                'yunyang', 'xiaowei', 'xiaolin', 'xiaotian', 'xiaoming', 'xiaojun',
                'xiaohao', 'xiaoyang', 'xiaofeng', 'xiaolong', 'xiaolei',
                'daming', 'daqiang', 'xiaoming', 'xiaoliang', 'xiaogang',
                'zhonghua', 'xiaocheng', 'xiaodong', 'xiaohua', 'xiaobin',
                'yunfeng', 'yunlong', 'yunhao', 'yuntao', 'yunbin',
                'kangkang', 'kangwei', 'kanghua', 'kangming', 'kangtao'
            ];
            
            // 中文女性语音识别关键词（大幅扩展）
            const chineseFemaleKeywords = [
                'female', 'woman', 'girl', '女', '女性', 'xiaoxiao', 'xiaoyi', 'xiaomo', 
                'ruoxi', 'xiaochen', 'xiaoxuan', 'xiaohan', 'xiaorui', 'xiaoli',
                'xiaofang', 'xiaomei', 'xiaoyu', 'xiaoyun', 'xiaoling',
                'daiyu', 'mengjie', 'yuting', 'shuwen', 'meili',
                'xiaojing', 'xiaolan', 'xiaohong', 'xiaofei', 'xiaoxia',
                'yunfei', 'yunmei', 'yunhua', 'yunxia', 'yunting',
                'ruoyun', 'ruoxue', 'ruomei', 'ruofei', 'ruohan'
            ];
            
            let isAssigned = false;
            
            // 详细检查每个关键词匹配情况
            const matchedMaleKeywords = chineseMaleKeywords.filter(keyword => name.includes(keyword));
            const matchedFemaleKeywords = chineseFemaleKeywords.filter(keyword => name.includes(keyword));
            
            console.log(`🔍 检查语音: ${voice.name}`);
            console.log(`👨 匹配男性关键词: [${matchedMaleKeywords.join(', ')}]`);
            console.log(`👩 匹配女性关键词: [${matchedFemaleKeywords.join(', ')}]`);
            
            if (matchedMaleKeywords.length > 0) {
                this.maleVoices.push(voice);
                console.log(`👨 ✅ 中文男性语音: ${voice.name} (${voice.lang}) - 匹配关键词: ${matchedMaleKeywords.join(', ')}`);
                isAssigned = true;
            } else if (matchedFemaleKeywords.length > 0) {
                this.femaleVoices.push(voice);
                console.log(`👩 ✅ 中文女性语音: ${voice.name} (${voice.lang}) - 匹配关键词: ${matchedFemaleKeywords.join(', ')}`);
                isAssigned = true;
            }
            
            // 如果没有明确匹配，使用智能分配
            if (!isAssigned) {
                if (this.maleVoices.length <= this.femaleVoices.length) {
                    this.maleVoices.push(voice);
                    console.log(`👨 智能分配为中文男性语音: ${voice.name} (${voice.lang})`);
                } else {
                    this.femaleVoices.push(voice);
                    console.log(`👩 智能分配为中文女性语音: ${voice.name} (${voice.lang})`);
                }
            }
        });
        
        // 如果没有找到中文语音，则处理所有语音但发出警告
        if (chineseVoices.length === 0) {
            console.warn('⚠️ 未找到中文语音，将处理所有语音');
            
            voices.forEach(voice => {
                const name = voice.name.toLowerCase();
                
                // 通用男性语音识别关键词
                const maleKeywords = [
                    'male', 'man', 'boy', 'david', 'mark', 'daniel', 'james'
                ];
                
                // 通用女性语音识别关键词
                const femaleKeywords = [
                    'female', 'woman', 'girl', 'susan', 'helen', 'catherine', 'maria'
                ];
                
                if (maleKeywords.some(keyword => name.includes(keyword))) {
                    this.maleVoices.push(voice);
                    console.log(`👨 通用男性语音: ${voice.name} (${voice.lang})`);
                } else if (femaleKeywords.some(keyword => name.includes(keyword))) {
                    this.femaleVoices.push(voice);
                    console.log(`👩 通用女性语音: ${voice.name} (${voice.lang})`);
                } else {
                    // 默认分配给女性语音
                    this.femaleVoices.push(voice);
                    console.log(`👩 默认分配为女性语音: ${voice.name} (${voice.lang})`);
                }
            });
        }
        
        console.log(`✅ 语音分类完成: 中文男性${this.maleVoices.length}个，中文女性${this.femaleVoices.length}个`);
        
        // 显示最终分类结果
        console.log(`👨 男性语音列表:`);
        this.maleVoices.forEach((voice, idx) => {
            console.log(`  ${idx}: ${voice.name} (${voice.lang})`);
        });
        console.log(`👩 女性语音列表:`);
        this.femaleVoices.forEach((voice, idx) => {
            console.log(`  ${idx}: ${voice.name} (${voice.lang})`);
        });
        
        // 强化男性语音备用机制
        if (this.maleVoices.length === 0 && this.femaleVoices.length > 0) {
            console.warn(`⚠️ 没有识别到男性语音！当前女性语音数量: ${this.femaleVoices.length}`);
            
            // 尝试手动查找可能的男性语音
            const potentialMaleVoice = chineseVoices.find(voice => {
                const name = voice.name.toLowerCase();
                const uri = voice.voiceURI.toLowerCase();
                
                // 更宽泛的男性特征检查
                return name.includes('1') ||  // 有些系统用数字区分男女声，1通常是男声
                       name.includes('male') ||
                       name.includes('man') ||
                       name.includes('boy') ||
                       uri.includes('male') ||
                       name.includes('深') ||  // 深沉、深厚
                       name.includes('low') || // 低音
                       name.includes('bass'); // 低音
            });
            
            if (potentialMaleVoice) {
                this.maleVoices.push(potentialMaleVoice);
                console.log(`🎯 手动找到潜在男性语音: ${potentialMaleVoice.name} (${potentialMaleVoice.lang})`);
            } else {
                // 最后备用：使用女性语音但标记为男性使用
                const backupMaleVoice = this.femaleVoices[0];
                this.maleVoices.push(backupMaleVoice);
                console.log(`🔄 备用男性语音（实际为女声但调整参数）: ${backupMaleVoice.name} (${backupMaleVoice.lang})`);
            }
        }
    }
    
    /**
     * 朗读文本
     */
    public speak(text: string, type: string = 'system', options: SpeechOptions = {}): void {
        if (!this.isSupported || !this.isEnabled || !text.trim()) {
            return;
        }
        
        try {
            // 如果需要中断当前语音
            if (options.interrupt && this.isPlaying) {
                this.stop();
            }
            
            // 合并配置
            const config = this.mergeConfig(type);
            
            // 根据优先级处理队列
            if (this.isPlaying && options.priority !== 'high') {
                this.addToQueue(text, options, config);
                return;
            }
            
            this.speakImmediate(text, config, options.callback);
            
        } catch (error) {
            console.error('❌ SpeechSynthesisManager: 语音播放失败:', error);
        }
    }
    
    /**
     * 立即播放语音
     */
    private speakImmediate(text: string, config: VoiceConfig, callback?: () => void): void {
        console.log(`🎵 立即播放语音: "${text.substring(0, 50)}..."`);
        console.log(`🎛️ 播放配置: 语音=${config.voice?.name || '默认'}, 语速=${config.rate}, 音调=${config.pitch}, 音量=${config.volume}`);
        
        // 如果指定了语音，先预热该语音引擎
        if (config.voice) {
            this.preWarmVoice(config.voice).then(() => {
                this.playWithVoice(text, config, callback);
            }).catch((error) => {
                console.warn('⚠️ 语音预热失败，使用备用方案:', error);
                this.playWithVoice(text, config, callback);
            });
        } else {
            this.playWithVoice(text, config, callback);
        }
    }
    
    /**
     * 预热指定语音（解决男声播放问题）
     */
    private async preWarmVoice(voice: SpeechSynthesisVoice): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log(`🔥 预热语音: ${voice.name}`);
            
            // 创建一个静音的预热语音
            const warmUpUtterance = new SpeechSynthesisUtterance(' ');
            warmUpUtterance.voice = voice;
            warmUpUtterance.volume = 0; // 静音播放
            warmUpUtterance.rate = 1.0;
            warmUpUtterance.pitch = 1.0;
            warmUpUtterance.lang = voice.lang || 'zh-CN';
            
            warmUpUtterance.onend = () => {
                console.log(`✅ 语音预热完成: ${voice.name}`);
                resolve();
            };
            
            warmUpUtterance.onerror = (event) => {
                console.error(`❌ 语音预热失败: ${voice.name}`, event);
                reject(event);
            };
            
            // 超时保护
            const timeout = setTimeout(() => {
                console.warn('⏰ 语音预热超时，继续播放');
                resolve();
            }, 1000);
            
            warmUpUtterance.onend = () => {
                clearTimeout(timeout);
                resolve();
            };
            
            speechSynthesis.speak(warmUpUtterance);
        });
    }
    
    /**
     * 使用指定语音播放
     */
    private playWithVoice(text: string, config: VoiceConfig, callback?: () => void): void {
        // 检查是否为SSML文本
        const isSSML = text.includes('<speak>');
        
        // 如果是SSML，先尝试处理，否则使用原文本
        const finalText = isSSML ? this.stripSSMLTags(text) : text;
        
        const utterance = new SpeechSynthesisUtterance(finalText);
        
        // 设置语音参数
        if (config.voice) {
            utterance.voice = config.voice;
            console.log(`🎤 使用预热后的语音: ${config.voice.name}`);
        } else {
            console.log(`🎤 使用默认语音`);
        }
        utterance.rate = config.rate;
        utterance.pitch = config.pitch;
        utterance.volume = config.volume;
        utterance.lang = config.lang;
        
        // 设置事件监听
        utterance.onstart = () => {
            this.isPlaying = true;
            console.log('🎤 开始语音播放:', text.substring(0, 20) + '...');
        };
        
        utterance.onend = () => {
            this.isPlaying = false;
            this.currentUtterance = null;
            console.log('🎤 语音播放完成');
            
            // 执行回调
            if (callback) {
                callback();
            }
            
            // 处理队列中的下一个语音
            this.processQueue();
        };
        
        utterance.onerror = (event) => {
            console.error('❌ 语音播放错误:', event.error);
            this.isPlaying = false;
            this.currentUtterance = null;
            this.processQueue();
        };
        
        this.currentUtterance = utterance;
        speechSynthesis.speak(utterance);
    }
    
    /**
     * 添加到语音队列
     */
    private addToQueue(text: string, options: SpeechOptions, config: VoiceConfig): void {
        this.voiceQueue.push({ text, options, config });
        console.log('🎤 语音已加入队列，当前队列长度:', this.voiceQueue.length);
    }
    
    /**
     * 处理语音队列
     */
    private processQueue(): void {
        if (this.voiceQueue.length > 0 && !this.isPlaying) {
            const { text, options, config } = this.voiceQueue.shift()!;
            this.speakImmediate(text, config, options.callback);
        }
    }
    
    /**
     * 合并语音配置
     */
    private mergeConfig(type: string): VoiceConfig {
        const typeConfig = this.voiceConfigs[type] || {};
        return {
            ...this.defaultConfig,
            ...typeConfig
        };
    }
    
    /**
     * 停止当前语音
     */
    public stop(): void {
        if (this.isSupported) {
            speechSynthesis.cancel();
            this.isPlaying = false;
            this.currentUtterance = null;
            console.log('🛑 语音播放已停止');
        }
    }
    
    /**
     * 暂停语音
     */
    public pause(): void {
        if (this.isSupported && this.isPlaying) {
            speechSynthesis.pause();
            console.log('⏸️ 语音播放已暂停');
        }
    }
    
    /**
     * 恢复语音
     */
    public resume(): void {
        if (this.isSupported) {
            speechSynthesis.resume();
            console.log('▶️ 语音播放已恢复');
        }
    }
    
    /**
     * 切换语音开关
     */
    public toggle(): boolean {
        this.isEnabled = !this.isEnabled;
        
        if (!this.isEnabled && this.isPlaying) {
            this.stop();
        }
        
        console.log(this.isEnabled ? '🎤 语音合成已开启' : '🔇 语音合成已关闭');
        return this.isEnabled;
    }
    
    /**
     * 清空语音队列
     */
    public clearQueue(): void {
        this.voiceQueue = [];
        console.log('🗑️ 语音队列已清空');
    }
    
    /**
     * 朗读神煞卡牌信息
     */
    public speakShenshaCard(cardData: any): void {
        if (!cardData) return;
        
        const text = this.formatShenshaText(cardData);
        this.speak(text, 'shensha', { priority: 'normal' });
    }
    
    /**
     * 朗读神煞入场台词（带情绪识别和性别语音）
     */
    public speakEntranceQuote(cardData: any): void {
        if (!cardData || !cardData.motto) {
            console.warn('⚠️ 神煞数据不完整，无法播放入场语音');
            return;
        }
        
        console.log(`🎭 开始处理神煞入场语音: ${cardData.name}`);
        
        // 1. 获取基础入场配置
        const baseConfig = this.mergeConfig('entrance');
        console.log(`📝 基础配置: 音调${baseConfig.pitch}, 语速${baseConfig.rate}, 音量${baseConfig.volume}`);
        
        // 2. 分析台词情绪并调整语音参数
        const emotionalConfig = this.analyzeEmotionalContent(cardData.motto);
        console.log(`🎭 情绪配置:`, emotionalConfig);
        
        // 3. 合并基础配置和情绪配置
        let mergedConfig = {
            ...baseConfig,
            ...emotionalConfig
        };
        console.log(`🔀 合并配置: 音调${mergedConfig.pitch}, 语速${mergedConfig.rate}, 音量${mergedConfig.volume}`);
        
        // 4. 根据神煞类型选择性别语音
        const finalConfig = this.applyGenderVoice(cardData, mergedConfig);
        
        // 5. 格式化入场文本
        const entranceText = this.formatEntranceText(cardData);
        
        console.log(`🎤 最终播放: "${entranceText}"`);
        console.log(`🔧 最终配置:`, finalConfig);
        
        // 6. 安全检查：如果是凶神且配置可能有问题，使用简化配置
        if ((cardData.type === 'inauspicious' || cardData.category === '凶星凶神') && 
            (finalConfig.pitch < 0.7 || finalConfig.rate < 0.7)) {
            console.log('⚠️ 凶神语音参数过低，使用安全配置');
            const safeConfig = {
                voice: finalConfig.voice,
                rate: 0.9,
                pitch: 0.9,
                volume: 1.0,
                lang: 'zh-CN'
            };
            this.speakWithCustomConfig(entranceText, safeConfig, { priority: 'high', interrupt: true });
        } else {
            // 7. 正常播放语音
            this.speakWithCustomConfig(entranceText, finalConfig, { priority: 'high', interrupt: true });
        }
    }
    
    /**
     * 根据神煞类型应用性别语音
     */
    private applyGenderVoice(cardData: any, config: VoiceConfig): VoiceConfig {
        const newConfig = { ...config };
        
        console.log(`🎭 处理神煞语音: ${cardData.name}, 类型: ${cardData.type}, 分类: ${cardData.category}`);
        console.log(`🎤 当前可用语音: 男性${this.maleVoices.length}个, 女性${this.femaleVoices.length}个`);
        console.log(`🔧 当前配置: 音调${newConfig.pitch}, 语速${newConfig.rate}, 音量${newConfig.volume}`);
        
        // 凶神使用男性语音
        if (cardData.type === 'inauspicious' || cardData.category === '凶星凶神') {
            console.log(`🔥 处理凶神: ${cardData.name}`);
            
            const allVoices = speechSynthesis.getVoices();
            console.log(`📋 系统可用语音总数: ${allVoices.length}`);
            console.log(`👨 已识别男性语音数: ${this.maleVoices.length}`);
            console.log(`👩 已识别女性语音数: ${this.femaleVoices.length}`);
            
            // 强制策略：优先使用明确识别的男性语音，并确保语音切换成功
            let selectedMaleVoice: SpeechSynthesisVoice | null = null;
            
            if (this.maleVoices.length > 0) {
                selectedMaleVoice = this.maleVoices[0];
                console.log(`✅ 找到已识别男性语音: ${selectedMaleVoice.name}`);
            } else {
                // 手动查找可能的中文男性语音
                console.log(`⚠️ 没有识别到男性语音，手动搜索中文男性语音...`);
                
                selectedMaleVoice = allVoices.find(voice => {
                    const name = voice.name.toLowerCase();
                    const uri = voice.voiceURI.toLowerCase();
                    const lang = voice.lang.toLowerCase();
                    
                    // 确保是中文语音
                    const isChinese = lang.includes('zh-cn') || 
                                     lang.includes('zh_cn') || 
                                     lang.includes('cmn-cn') ||
                                     lang === 'zh' ||
                                     lang.startsWith('zh-') ||
                                     name.includes('chinese') ||
                                     name.includes('mandarin');
                    
                    // 中文男性语音特征
                    const isMale = name.includes('male') || name.includes('男') || 
                                  name.includes('kangkang') || name.includes('yunxi') || 
                                  name.includes('xiaobei') || name.includes('yunyang') ||
                                  uri.includes('male');
                    
                    return isChinese && isMale;
                }) || null;
                
                if (selectedMaleVoice) {
                    console.log(`🎯 手动找到男性语音: ${selectedMaleVoice.name}`);
                } else {
                    console.warn(`⚠️ 未找到明确的男性语音，将尝试使用系统语音并调整参数`);
                }
            }
            
            if (selectedMaleVoice) {
                newConfig.voice = selectedMaleVoice;
                
                console.log(`🔄 选中男性语音: ${selectedMaleVoice.name} (${selectedMaleVoice.lang})`);
                console.log(`🔧 语音详情: URI=${selectedMaleVoice.voiceURI}, 本地=${selectedMaleVoice.localService}`);
                
                // 检查这个语音是否真的是男性语音（通过名称判断）
                const voiceName = selectedMaleVoice.name.toLowerCase();
                const isTrueMaleVoice = voiceName.includes('male') || 
                                       voiceName.includes('man') || 
                                       voiceName.includes('boy') ||
                                       voiceName.includes('康康') ||
                                       voiceName.includes('云扬');
                
                if (isTrueMaleVoice) {
                    console.log(`✅ 确认为真正的男性语音`);
                    // 男性语音参数优化
                    newConfig.pitch = Math.max(0.7, Math.min(0.9, newConfig.pitch || 1.0));
                    newConfig.rate = Math.max(0.8, Math.min(1.1, newConfig.rate || 1.0));
                    newConfig.volume = 1.0;
                } else {
                    console.log(`⚠️ 可能是女性语音冒充男性，大幅调整参数模拟男声`);
                    // 大幅度调整参数来模拟男声
                    newConfig.pitch = 0.6;  // 大幅降低音调
                    newConfig.rate = 0.8;   // 放慢语速
                    newConfig.volume = 1.0; // 保持最大音量
                }
                
            } else {
                // 最后手段：使用系统第一个语音，但大幅调整参数模拟男声
                if (allVoices.length > 0) {
                    newConfig.voice = allVoices[0];
                    newConfig.pitch = 0.6; // 大幅降低音调模拟男声
                    newConfig.rate = 0.8;  // 放慢语速
                    newConfig.volume = 1.0;
                    console.log(`🔧 使用系统第一个语音${allVoices[0].name}，大幅调整参数模拟男声`);
                } else {
                    console.error(`❌ 系统没有任何可用语音！`);
                    newConfig.voice = null;
                }
            }
            
            console.log(`👨 凶神${cardData.name}最终配置: 音调${newConfig.pitch}, 语速${newConfig.rate}, 音量${newConfig.volume}, 语音:${newConfig.voice?.name || '默认'}`);
        } 
        // 吉神和特殊神煞使用女性语音
        else {
            if (this.femaleVoices.length > 0) {
                const selectedVoice = this.femaleVoices[0];
                newConfig.voice = selectedVoice;
                console.log(`👩 吉神${cardData.name}使用女性语音: ${selectedVoice.name} (${selectedVoice.lang})`);
            } else {
                console.warn(`⚠️ 没有可用的女性语音，吉神${cardData.name}将使用默认语音`);
                
                // 尝试寻找中文女性语音
                const allVoices = speechSynthesis.getVoices();
                const chineseFemaleVoice = allVoices.find(voice => {
                    const lang = voice.lang.toLowerCase();
                    const name = voice.name.toLowerCase();
                    const isChinese = lang.includes('zh-cn') || lang.includes('zh_cn') || lang.startsWith('zh-');
                    const isFemale = name.includes('female') || name.includes('女') || 
                                    name.includes('xiaoxiao') || name.includes('xiaoyi');
                    return isChinese && isFemale;
                });
                
                if (chineseFemaleVoice) {
                    newConfig.voice = chineseFemaleVoice;
                    console.log(`🎯 找到中文女性语音: ${chineseFemaleVoice.name} (${chineseFemaleVoice.lang})`);
                }
            }
            
            console.log(`👩 吉神${cardData.name}最终配置: 音调${newConfig.pitch}, 语速${newConfig.rate}, 音量${newConfig.volume}, 语音:${newConfig.voice?.name || '默认'}`);
        }
        
        return newConfig;
    }
    
    /**
     * 分析台词情绪内容并返回相应的语音配置
     */
    private analyzeEmotionalContent(text: string): Partial<VoiceConfig> {
        const config: Partial<VoiceConfig> = {};
        
        // 威严/守护类型 (GUARDIAN-01)
        if (text.includes('系统') || text.includes('保护') || text.includes('守护') || text.includes('协议')) {
            return {
                rate: 0.7,    // 更慢，体现威严
                pitch: 1.1,   // 稍低，体现稳重
                volume: 1.0   // 最大音量
            };
        }
        
        // 狂暴/战斗类型 (BERSERKER-X) - 凶神特征
        if (text.includes('血液') || text.includes('屠戮') || text.includes('战斗') || text.includes('疯狂') || text.includes('咆哮')) {
            return {
                rate: 1.2,    // 快速，体现狂暴（男声调整）
                pitch: 1.2,   // 适中偏高，体现激动（男声调整）
                volume: 1.0   // 最大音量
            };
        }
        
        // 死亡/终结类型 - 凶神特征
        if (text.includes('死亡') || text.includes('收割') || text.includes('终结') || text.includes('灭杀') || text.includes('毁灭')) {
            return {
                rate: 0.6,    // 很慢，体现死神威严
                pitch: 0.8,   // 很低，体现恐怖
                volume: 1.0   // 最大音量
            };
        }
        
        // 诅咒/邪恶类型 - 凶神特征
        if (text.includes('诅咒') || text.includes('邪恶') || text.includes('阴险') || text.includes('破坏') || text.includes('虚无')) {
            return {
                rate: 0.8,    // 较慢，体现阴森
                pitch: 0.9,   // 较低，体现邪恶
                volume: 0.95  // 稍低，体现神秘
            };
        }
        
        // 神秘/预知类型 (ORACLE-∞)
        if (text.includes('天机') || text.includes('时间') || text.includes('未来') || text.includes('秘密') || text.includes('低语')) {
            return {
                rate: 0.6,    // 很慢，体现神秘
                pitch: 0.9,   // 较低，体现深邃
                volume: 0.9   // 稍低，体现神秘感
            };
        }
        
        // 科技/AI类型 
        if (text.includes('编译') || text.includes('算法') || text.includes('数据') || text.includes('矩阵') || text.includes('启动')) {
            return {
                rate: 1.1,    // 稍快，体现效率
                pitch: 1.2,   // 稍高，体现科技感
                volume: 0.95  // 清晰
            };
        }
        
        // 默认入场配置
        return {
            rate: 0.8,
            pitch: 1.3,
            volume: 1.0
        };
    }
    
    /**
     * 使用自定义配置播放语音（公开方法，供测试使用）
     */
    public speakWithCustomConfig(text: string, config: VoiceConfig, options: SpeechOptions = {}): void {
        if (!this.isSupported || !this.isEnabled || !text.trim()) {
            console.warn('⚠️ 语音播放被阻止: 不支持/未启用/文本为空');
            return;
        }
        
        console.log(`🎤 准备播放语音: "${text.substring(0, 30)}..."`);
        console.log(`🔧 使用配置:`, config);
        
        try {
            if (options.interrupt && this.isPlaying) {
                console.log('🛑 中断当前语音');
                this.stop();
            }
            
            if (this.isPlaying && options.priority !== 'high') {
                console.log('📋 添加到语音队列');
                this.voiceQueue.push({ text, options, config });
                return;
            }
            
            console.log('▶️ 立即播放语音');
            this.speakImmediate(text, config, options.callback);
            
        } catch (error) {
            console.error('❌ SpeechSynthesisManager: 自定义语音播放失败:', error);
            if (error instanceof Error) {
                console.error('❌ 错误详情:', error.stack);
            }
        }
    }
    
    /**
     * 格式化神煞卡牌文本
     */
    private formatShenshaText(cardData: any): string {
        const parts = [];
        
        if (cardData.designation) {
            parts.push(`神煞代号：${cardData.designation}`);
        }
        
        if (cardData.classification) {
            parts.push(`分类等级：${cardData.classification}`);
        }
        
        if (cardData.motto) {
            parts.push(`作战座右铭：${cardData.motto}`);
        }
        
        if (cardData.dossier) {
            parts.push(`数据档案：${cardData.dossier}`);
        }
        
        return parts.join('。');
    }
    
    /**
     * 格式化神煞入场台词（修复中英文混合问题）
     */
    private formatEntranceText(cardData: any): string {
        let entranceText = '';
        
        // 使用中文名称而不是英文呼号，避免语音识别问题
        if (cardData.name) {
            entranceText = `神煞${cardData.name}，入场！`;
        } else if (cardData.callsign) {
            // 将英文呼号转换为更容易朗读的格式
            const chineseName = this.convertCallsignToChinese(cardData.callsign);
            entranceText = `${chineseName}，入场！`;
        }
        
        // 添加入场台词（直接使用原文，不进行SSML处理避免语音中断）
        if (cardData.motto) {
            if (entranceText) {
                entranceText += ` ${cardData.motto}`;
            } else {
                entranceText = cardData.motto;
            }
        }
        
        console.log(`🎤 入场语音文本: "${entranceText}"`);
        return entranceText;
    }
    
    /**
     * 将英文呼号转换为中文朗读格式
     */
    private convertCallsignToChinese(callsign: string): string {
        const conversions: Record<string, string> = {
            'GUARDIAN-01': '守护者零一',
            'BERSERKER-X': '狂战士X',
            'REAPER-666': '收割者六六六',
            'ORACLE-∞': '神谕者无限',
            'SCHOLAR-007': '学者零零七',
            'WHITE-TIGER': '白虎战神',
            'SEDUCTRESS-9': '魅惑者九号',
            'VOID-NULL': '虚无空洞',
            'HIJACKER-99': '劫持者九九',
            'PLAGUE-BRINGER': '瘟疫使者',
            'TRAP-MASTER': '陷阱大师',
            'ISOLATION-∞∞': '孤立者双无限',
            'SHROUD-777': '裹尸布七七七',
            'FLYING-EDGE': '飞刃',
            'BLOOD-EDGE': '血刃',
            'ARMY-BREAKER': '破军者',
            'OMEGA-DEATH': '终极死神',
            'PHANTOM-FIVE': '五鬼魅影'
        };
        
        return conversions[callsign] || callsign.replace(/-/g, '').toLowerCase();
    }
    
    /**
     * 处理情绪化文本，添加停顿和重音效果
     */
    private processEmotionalText(text: string): string {
        // 识别不同情绪的关键词并添加SSML标记
        let processedText = text;
        
        // 威严/命令类词汇 - 降低语速，增加重音
        const commandWords = ['系统', '协议', '启动', '执行', '命令', '指令', '激活'];
        commandWords.forEach(word => {
            const regex = new RegExp(word, 'g');
            processedText = processedText.replace(regex, `<emphasis level="strong">${word}</emphasis>`);
        });
        
        // 战斗/攻击类词汇 - 加快语速，提高音调
        const battleWords = ['攻击', '战斗', '屠戮', '血液', '目标', '锁定', '开始', '毁灭', '燃烧'];
        battleWords.forEach(word => {
            const regex = new RegExp(word, 'g');
            processedText = processedText.replace(regex, `<prosody rate="fast" pitch="high">${word}</prosody>`);
        });
        
        // 神秘/古老类词汇 - 放慢语速，降低音调
        const mysticalWords = ['古老', '永恒', '誓言', '守护', '虚空', '时间', '秘密', '低语', '意识', '神圣'];
        mysticalWords.forEach(word => {
            const regex = new RegExp(word, 'g');
            processedText = processedText.replace(regex, `<prosody rate="slow" pitch="low">${word}</prosody>`);
        });
        
        // 感叹词和重要词汇 - 添加停顿
        const exclamations = ['！', '...', '。'];
        exclamations.forEach(punct => {
            const regex = new RegExp(`\\${punct}`, 'g');
            processedText = processedText.replace(regex, `${punct}<break time="500ms"/>`);
        });
        
        // 为整体文本包装SSML
        return `<speak>${processedText}</speak>`;
    }
    
    /**
     * 朗读战斗信息
     */
    public speakBattleInfo(message: string): void {
        this.speak(message, 'battle', { priority: 'high', interrupt: true });
    }
    
    /**
     * 朗读系统消息
     */
    public speakSystemMessage(message: string): void {
        this.speak(message, 'system', { priority: 'normal' });
    }
    
    /**
     * 朗读叙述文本
     */
    public speakNarrative(text: string, callback?: () => void): void {
        this.speak(text, 'narrative', { priority: 'low', callback });
    }
    
    /**
     * 朗读特殊入场效果（带音效提示）
     */
    public speakSpecialEntrance(cardData: any, specialEffect?: string): void {
        if (!cardData) return;
        
        let text = '';
        
        // 特殊效果前缀
        if (specialEffect) {
            text = `${specialEffect}！`;
        }
        
        // 神煞入场
        const entranceText = this.formatEntranceText(cardData);
        if (entranceText) {
            text = text ? `${text} ${entranceText}` : entranceText;
        }
        
        this.speak(text, 'entrance', { priority: 'high', interrupt: true });
    }
    
    /**
     * 设置语音配置
     */
    public setConfig(type: string, config: Partial<VoiceConfig>): void {
        this.voiceConfigs[type] = { ...this.voiceConfigs[type], ...config };
        console.log('🎤 语音配置已更新:', type, config);
    }
    
    /**
     * 获取可用语音列表
     */
    public getAvailableVoices(): SpeechSynthesisVoice[] {
        return this.availableVoices;
    }
    
    /**
     * 设置首选语音
     */
    public setPreferredVoice(voiceName: string): void {
        const voice = this.availableVoices.find(v => v.name === voiceName);
        if (voice) {
            this.preferredVoice = voice;
            this.defaultConfig.voice = voice;
            console.log('🎤 首选语音已设置:', voice.name);
        }
    }
    
    /**
     * 获取状态信息
     */
    public getStatus(): {
        isSupported: boolean;
        isEnabled: boolean;
        isPlaying: boolean;
        queueLength: number;
        currentVoice: string | null;
    } {
        return {
            isSupported: this.isSupported,
            isEnabled: this.isEnabled,
            isPlaying: this.isPlaying,
            queueLength: this.voiceQueue.length,
            currentVoice: this.preferredVoice?.name || null
        };
    }
    
    /**
     * 语音测试
     */
    public test(): void {
        const testText = "L-Zore神煞卡牌游戏语音合成系统测试。欢迎来到数据轮回的世界！";
        this.speak(testText, 'system', {
            interrupt: true,
            callback: () => console.log('🎤 语音测试完成')
        });
    }
    
    /**
     * 入场台词测试
     */
    public testEntrance(): void {
        const testCard = {
            callsign: 'GUARDIAN-01',
            motto: '系统在线，保护协议已激活！金之永恒守护着古老誓言...'
        };
        this.speakEntranceQuote(testCard);
    }
    
    /**
     * 移除SSML标签，保留文本内容
     */
    private stripSSMLTags(text: string): string {
        // 移除SSML标签但保留内容
        return text
            .replace(/<speak>/g, '')
            .replace(/<\/speak>/g, '')
            .replace(/<emphasis[^>]*>/g, '')
            .replace(/<\/emphasis>/g, '')
            .replace(/<prosody[^>]*>/g, '')
            .replace(/<\/prosody>/g, '')
            .replace(/<break[^>]*\/>/g, '... '); // 将停顿转换为省略号
    }
    
    /**
     * 根据神煞类型获取情绪语音预设
     */
    public getSpeechPresetForShensha(shenshaType: string, isInauspicious: boolean = false): Partial<VoiceConfig> {
        const malePresets: Record<string, Partial<VoiceConfig>> = {
            'guardian': { rate: 0.6, pitch: 0.9, volume: 1.0 }, // 威严守护（男声）
            'berserker': { rate: 1.2, pitch: 1.2, volume: 1.0 }, // 狂暴战士（男声）
            'reaper': { rate: 0.5, pitch: 0.7, volume: 1.0 },   // 死神收割（男声）
            'destroyer': { rate: 1.1, pitch: 1.0, volume: 1.0 }, // 毁灭力量（男声）
            'cursed': { rate: 0.8, pitch: 0.8, volume: 0.95 },  // 诅咒邪恶（男声）
        };
        
        const femalePresets: Record<string, Partial<VoiceConfig>> = {
            'guardian': { rate: 0.7, pitch: 1.1, volume: 1.0 }, // 威严守护（女声）
            'oracle': { rate: 0.6, pitch: 0.9, volume: 0.9 },   // 神秘预言（女声）
            'healer': { rate: 0.8, pitch: 1.0, volume: 0.9 },   // 温和治疗（女声）
            'mystic': { rate: 0.7, pitch: 1.2, volume: 0.9 },   // 神秘特殊（女声）
        };
        
        if (isInauspicious) {
            return malePresets[shenshaType] || malePresets['cursed'];
        } else {
            return femalePresets[shenshaType] || femalePresets['guardian'];
        }
    }
    
    /**
     * 获取可用的男性语音列表
     */
    public getMaleVoices(): SpeechSynthesisVoice[] {
        return [...this.maleVoices];
    }
    
    /**
     * 获取可用的女性语音列表
     */
    public getFemaleVoices(): SpeechSynthesisVoice[] {
        return [...this.femaleVoices];
    }
    
    /**
     * 测试不同性别和情绪的语音效果
     */
    public testEmotionalSpeech(): void {
        const testCases = [
            {
                type: '👩吉神威严守护',
                text: 'GUARDIAN-01，入场！系统在线，保护协议已激活！',
                cardData: { type: 'auspicious', name: '天乙贵人' }
            },
            {
                type: '👨凶神狂暴战斗', 
                text: 'BERSERKER-X，入场！血液编译中...开始屠戮程序！',
                cardData: { type: 'inauspicious', name: '羊刃' }
            },
            {
                type: '👨凶神死神收割',
                text: 'REAPER-666，入场！死亡倒计时开始，灵魂数据收割中...',
                cardData: { type: 'inauspicious', name: '亡神' }
            }
        ];
        
        testCases.forEach((testCase, index) => {
            setTimeout(() => {
                console.log(`🎤 测试${testCase.type}语音效果`);
                
                // 使用入场语音方法，自动应用性别和情绪配置
                if (testCase.cardData) {
                    // 临时添加台词用于测试
                    const testCardData = {
                        ...testCase.cardData,
                        motto: testCase.text.split('，入场！')[1] || testCase.text
                    };
                    this.speakEntranceQuote(testCardData);
                }
            }, index * 4000);
        });
    }
    
    /**
     * 测试男女语音对比
     */
    public testGenderVoiceComparison(): void {
        const comparisonCases = [
            {
                text: '吉神天乙贵人，系统在线，保护协议已激活！',
                genderType: 'female',
                cardData: { type: 'auspicious', name: '天乙贵人', motto: '系统在线，保护协议已激活！' }
            },
            {
                text: '凶神羊刃，血液编译中，开始屠戮程序！',
                genderType: 'male',
                cardData: { type: 'inauspicious', name: '羊刃', motto: '血液编译中...开始屠戮程序！' }
            }
        ];
        
        comparisonCases.forEach((testCase, index) => {
            setTimeout(() => {
                console.log(`🎭 性别语音对比: ${testCase.genderType === 'male' ? '👨男性' : '👩女性'}`);
                this.speakEntranceQuote(testCase.cardData);
            }, index * 5000);
        });
    }
    
    /**
     * 清理资源
     */
    public dispose(): void {
        console.log('🧹 SpeechSynthesisManager: 清理资源');
        
        this.stop();
        this.clearQueue();
        
        // 移除事件监听
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = null;
        }
    }
} 