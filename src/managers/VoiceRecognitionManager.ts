/**
 * 语音识别管理器
 * 使用PocketSphinx.js库来为L-Zore游戏添加语音控制功能
 * 配合SpeechSynthesisManager实现完整的语音交互系统
 */

export interface VoiceCommand {
    command: string;           // 语音命令文本
    keywords: string[];        // 关键词列表
    action: () => void;        // 执行的动作
    description: string;       // 命令描述
    category: string;          // 命令分类
}

export interface RecognitionConfig {
    language: string;          // 识别语言
    continuous: boolean;       // 连续识别
    interimResults: boolean;   // 中间结果
    maxAlternatives: number;   // 最大候选数
    sensitivity: number;       // 灵敏度 (0-1)
}

export interface VoiceRecognitionEvents {
    onCommandRecognized?: (command: string, confidence: number) => void;
    onSpeechStart?: () => void;
    onSpeechEnd?: () => void;
    onError?: (error: any) => void;
    onResult?: (result: string, confidence: number) => void;
}

export class VoiceRecognitionManager {
    private scene: Phaser.Scene;
    private isSupported: boolean = false;
    private isEnabled: boolean = false;
    private isListening: boolean = false;
    private recognition: any = null;
    private pocketSphinx: any = null;
    
    // 语音命令注册表
    private commands: Map<string, VoiceCommand> = new Map();
    private keywordMap: Map<string, string[]> = new Map();
    
    // 神煞名称映射
    private shenshaNames: Map<string, string[]> = new Map();
    
    // 配置
    private config: RecognitionConfig = {
        language: 'zh-CN',
        continuous: true,
        interimResults: true,
        maxAlternatives: 3,
        sensitivity: 0.7
    };
    
    // 事件回调
    private events: VoiceRecognitionEvents = {};
    
    // 识别状态
    private lastRecognitionTime: number = 0;
    private recognitionTimeout: number = 5000; // 5秒超时
    
    constructor(scene: Phaser.Scene, events?: VoiceRecognitionEvents) {
        this.scene = scene;
        this.events = { ...this.events, ...events };
        
        this.initialize();
        this.setupGameCommands();
        this.setupShenshaNames();
    }
    
    /**
     * 初始化语音识别系统
     */
    private async initialize(): Promise<void> {
        console.log('🎤 初始化语音识别系统...');
        
        try {
            // 检查浏览器支持
            this.checkBrowserSupport();
            
            // 初始化Web Speech API
            if (this.isSupported) {
                await this.initializeWebSpeechAPI();
            }
            
            // 尝试初始化PocketSphinx.js (作为备选)
            await this.initializePocketSphinx();
            
            console.log('✅ 语音识别系统初始化完成');
            
        } catch (error) {
            console.error('❌ 语音识别系统初始化失败:', error);
            this.handleError(error);
        }
    }
    
    /**
     * 检查浏览器支持情况
     */
    private checkBrowserSupport(): void {
        // 检查Web Speech API支持
        const webSpeechSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        
        // 检查麦克风权限
        const mediaSupport = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
        
        this.isSupported = webSpeechSupport && mediaSupport;
        
        console.log(`🔍 浏览器支持检查:`);
        console.log(`  Web Speech API: ${webSpeechSupport ? '✅' : '❌'}`);
        console.log(`  麦克风访问: ${mediaSupport ? '✅' : '❌'}`);
        console.log(`  整体支持: ${this.isSupported ? '✅' : '❌'}`);
    }
    
    /**
     * 初始化Web Speech API
     */
    private async initializeWebSpeechAPI(): Promise<void> {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        
        if (!SpeechRecognition) {
            throw new Error('浏览器不支持Web Speech API');
        }
        
        this.recognition = new SpeechRecognition();
        
        // 基础配置
        this.recognition.lang = this.config.language;
        this.recognition.continuous = this.config.continuous;
        this.recognition.interimResults = this.config.interimResults;
        this.recognition.maxAlternatives = this.config.maxAlternatives;
        
        // 事件绑定
        this.setupRecognitionEvents();
        
        console.log('✅ Web Speech API 初始化完成');
    }
    
         /**
      * 初始化PocketSphinx.js (备选方案)
      */
     private async initializePocketSphinx(): Promise<void> {
         try {
             // 动态导入PocketSphinx.js
             const PocketSphinx: any = (await import('pocketsphinx.js' as any)).default || await import('pocketsphinx.js' as any);
            
            this.pocketSphinx = new PocketSphinx({
                // 基础配置
                hmm: '/assets/voice/models/hmm',      // 声学模型
                dict: '/assets/voice/models/dict',    // 字典文件
                lm: '/assets/voice/models/lm',        // 语言模型
                
                // 中文配置
                samprate: 16000,
                nfft: 512,
                nfilt: 25,
                
                // 识别配置
                beam: 1e-20,
                pbeam: 1e-20,
                wbeam: 1e-20,
                
                // 关键词配置
                kws_threshold: this.config.sensitivity
            });
            
            console.log('✅ PocketSphinx.js 初始化完成');
            
        } catch (error) {
            console.warn('⚠️ PocketSphinx.js 初始化失败，使用Web Speech API:', error);
        }
    }
    
    /**
     * 设置语音识别事件
     */
    private setupRecognitionEvents(): void {
        if (!this.recognition) return;
        
        // 开始识别
        this.recognition.onstart = () => {
            this.isListening = true;
            this.lastRecognitionTime = Date.now();
            console.log('🎤 开始语音识别');
            
            if (this.events.onSpeechStart) {
                this.events.onSpeechStart();
            }
        };
        
        // 识别结果
        this.recognition.onresult = (event: any) => {
            this.handleRecognitionResult(event);
        };
        
        // 识别结束
        this.recognition.onend = () => {
            this.isListening = false;
            console.log('🛑 语音识别结束');
            
            if (this.events.onSpeechEnd) {
                this.events.onSpeechEnd();
            }
            
            // 自动重启连续识别
            if (this.isEnabled && this.config.continuous) {
                setTimeout(() => this.startListening(), 100);
            }
        };
        
        // 识别错误
        this.recognition.onerror = (event: any) => {
            console.error('❌ 语音识别错误:', event.error);
            this.handleError(event.error);
        };
        
        // 无语音输入
        this.recognition.onnomatch = () => {
            console.log('🔇 未识别到有效语音');
        };
        
        // 语音开始
        this.recognition.onspeechstart = () => {
            console.log('🗣️ 检测到语音输入');
        };
        
        // 语音结束
        this.recognition.onspeechend = () => {
            console.log('🤐 语音输入结束');
        };
    }
    
    /**
     * 处理识别结果
     */
    private handleRecognitionResult(event: any): void {
        const results = event.results;
        const lastResult = results[results.length - 1];
        
        if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript.trim();
            const confidence = lastResult[0].confidence;
            
            console.log(`🎯 识别结果: "${transcript}" (置信度: ${confidence.toFixed(2)})`);
            
            // 触发结果事件
            if (this.events.onResult) {
                this.events.onResult(transcript, confidence);
            }
            
            // 处理命令
            this.processVoiceCommand(transcript, confidence);
            
        } else {
            // 中间结果
            const transcript = lastResult[0].transcript.trim();
            console.log(`📝 中间结果: "${transcript}"`);
        }
    }
    
    /**
     * 处理语音命令
     */
    private processVoiceCommand(transcript: string, confidence: number): void {
        const normalizedText = transcript.toLowerCase().replace(/[，。！？\s]/g, '');
        
        console.log(`🔍 处理语音命令: "${normalizedText}"`);
        
        // 遍历注册的命令
        for (const [commandId, command] of this.commands) {
            if (this.matchCommand(normalizedText, command)) {
                console.log(`✅ 匹配命令: ${command.command} (${command.description})`);
                
                // 触发命令识别事件
                if (this.events.onCommandRecognized) {
                    this.events.onCommandRecognized(command.command, confidence);
                }
                
                // 执行命令动作
                try {
                    command.action();
                } catch (error) {
                    console.error(`❌ 执行命令失败: ${command.command}`, error);
                }
                
                return; // 找到匹配命令后停止搜索
            }
        }
        
        // 检查神煞名称
        const shenshaMatch = this.matchShenshaName(normalizedText);
        if (shenshaMatch) {
            console.log(`🎴 识别到神煞: ${shenshaMatch}`);
            this.handleShenshaSelection(shenshaMatch);
            return;
        }
        
        console.log(`❓ 未识别的语音命令: "${transcript}"`);
    }
    
    /**
     * 匹配语音命令
     */
    private matchCommand(text: string, command: VoiceCommand): boolean {
        // 检查关键词匹配
        for (const keyword of command.keywords) {
            if (text.includes(keyword.toLowerCase())) {
                return true;
            }
        }
        
        // 检查完整命令匹配
        const normalizedCommand = command.command.toLowerCase().replace(/[，。！？\s]/g, '');
        return text.includes(normalizedCommand);
    }
    
    /**
     * 匹配神煞名称
     */
    private matchShenshaName(text: string): string | null {
        for (const [key, variants] of this.shenshaNames) {
            for (const variant of variants) {
                if (text.includes(variant.toLowerCase())) {
                    return key;
                }
            }
        }
        return null;
    }
    
    /**
     * 设置游戏命令
     */
    private setupGameCommands(): void {
        // 基础游戏命令
        this.registerCommand('place_card', {
            command: '放置卡牌',
            keywords: ['放置', '出牌', '下牌', '使用'],
            action: () => this.executeGameAction('place_card'),
            description: '放置选中的卡牌',
            category: 'game'
        });
        
        this.registerCommand('end_turn', {
            command: '结束回合',
            keywords: ['结束', '回合结束', '下一回合'],
            action: () => this.executeGameAction('end_turn'),
            description: '结束当前回合',
            category: 'game'
        });
        
        this.registerCommand('draw_card', {
            command: '抽取卡牌',
            keywords: ['抽牌', '抽卡', '摸牌'],
            action: () => this.executeGameAction('draw_card'),
            description: '从卡堆抽取卡牌',
            category: 'game'
        });
        
        // 战斗命令
        this.registerCommand('attack', {
            command: '攻击',
            keywords: ['攻击', '进攻', '战斗'],
            action: () => this.executeGameAction('attack'),
            description: '发起攻击',
            category: 'battle'
        });
        
        this.registerCommand('defend', {
            command: '防御',
            keywords: ['防御', '防守', '格挡'],
            action: () => this.executeGameAction('defend'),
            description: '进入防御状态',
            category: 'battle'
        });
        
        // 系统命令
        this.registerCommand('pause_game', {
            command: '暂停游戏',
            keywords: ['暂停', '停止', '等等'],
            action: () => this.executeGameAction('pause'),
            description: '暂停游戏',
            category: 'system'
        });
        
        this.registerCommand('show_hand', {
            command: '显示手牌',
            keywords: ['手牌', '看牌', '显示'],
            action: () => this.executeGameAction('show_hand'),
            description: '显示当前手牌',
            category: 'system'
        });
        
        // 语音控制命令
        this.registerCommand('mute_voice', {
            command: '关闭语音',
            keywords: ['静音', '关闭语音', '安静'],
            action: () => this.executeGameAction('mute_voice'),
            description: '关闭语音播放',
            category: 'voice'
        });
        
        this.registerCommand('enable_voice', {
            command: '开启语音',
            keywords: ['开启语音', '语音', '播放'],
            action: () => this.executeGameAction('enable_voice'),
            description: '开启语音播放',
            category: 'voice'
        });
        
        console.log(`✅ 注册了 ${this.commands.size} 个游戏语音命令`);
    }
    
    /**
     * 设置神煞名称映射
     */
    private setupShenshaNames(): void {
        // 吉神
        this.shenshaNames.set('tianyiguiren', ['天乙贵人', '贵人', '天乙']);
        this.shenshaNames.set('wenchang', ['文昌', '文昌贵人', '文星']);
        this.shenshaNames.set('lushen', ['禄神', '禄星', '天禄']);
        this.shenshaNames.set('yima', ['驿马', '马星', '奔马']);
        this.shenshaNames.set('huagai', ['华盖', '盖星', '华星']);
        
        // 凶神
        this.shenshaNames.set('yangren', ['羊刃', '刃星', '飞刃']);
        this.shenshaNames.set('jiesha', ['劫煞', '劫星', '劫财']);
        this.shenshaNames.set('wangshen', ['亡神', '死神', '亡星']);
        this.shenshaNames.set('xianchi', ['咸池', '桃花', '红鸾']);
        this.shenshaNames.set('kongwang', ['空亡', '空星', '虚空']);
        this.shenshaNames.set('baihu', ['白虎', '虎星', '杀星']);
        this.shenshaNames.set('zaishan', ['灾煞', '灾星', '病星']);
        
        console.log(`✅ 注册了 ${this.shenshaNames.size} 个神煞语音识别`);
    }
    
    /**
     * 注册语音命令
     */
    public registerCommand(id: string, command: VoiceCommand): void {
        this.commands.set(id, command);
        
        // 构建关键词映射
        for (const keyword of command.keywords) {
            if (!this.keywordMap.has(keyword)) {
                this.keywordMap.set(keyword, []);
            }
            this.keywordMap.get(keyword)!.push(id);
        }
    }
    
    /**
     * 移除语音命令
     */
    public unregisterCommand(id: string): void {
        const command = this.commands.get(id);
        if (command) {
            // 清理关键词映射
            for (const keyword of command.keywords) {
                const commandIds = this.keywordMap.get(keyword);
                if (commandIds) {
                    const index = commandIds.indexOf(id);
                    if (index > -1) {
                        commandIds.splice(index, 1);
                    }
                    if (commandIds.length === 0) {
                        this.keywordMap.delete(keyword);
                    }
                }
            }
            
            this.commands.delete(id);
        }
    }
    
    /**
     * 执行游戏动作
     */
    private executeGameAction(action: string): void {
        console.log(`🎮 执行游戏动作: ${action}`);
        
        // 通过Phaser事件系统发送动作
        this.scene.events.emit('voice-command', action);
        
        // 也可以直接调用游戏管理器的方法
        // 这里需要根据具体的游戏架构来实现
    }
    
    /**
     * 处理神煞选择
     */
    private handleShenshaSelection(shenshaId: string): void {
        console.log(`🎴 选择神煞: ${shenshaId}`);
        
        // 发送神煞选择事件
        this.scene.events.emit('voice-shensha-select', shenshaId);
    }
    
    /**
     * 开始语音识别
     */
    public async startListening(): Promise<void> {
        if (!this.isSupported || this.isListening) {
            return;
        }
        
        try {
            // 请求麦克风权限
            await navigator.mediaDevices.getUserMedia({ audio: true });
            
            this.isEnabled = true;
            
            if (this.recognition) {
                this.recognition.start();
            }
            
            console.log('🎤 开始语音识别监听');
            
        } catch (error) {
            console.error('❌ 启动语音识别失败:', error);
            this.handleError(error);
        }
    }
    
    /**
     * 停止语音识别
     */
    public stopListening(): void {
        this.isEnabled = false;
        
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
        
        console.log('🛑 停止语音识别监听');
    }
    
    /**
     * 切换语音识别状态
     */
    public toggle(): boolean {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
        
        return this.isListening;
    }
    
    /**
     * 设置识别配置
     */
    public setConfig(config: Partial<RecognitionConfig>): void {
        this.config = { ...this.config, ...config };
        
        // 更新识别器配置
        if (this.recognition) {
            this.recognition.lang = this.config.language;
            this.recognition.continuous = this.config.continuous;
            this.recognition.interimResults = this.config.interimResults;
            this.recognition.maxAlternatives = this.config.maxAlternatives;
        }
        
        console.log('🔧 语音识别配置已更新:', this.config);
    }
    
    /**
     * 获取所有注册的命令
     */
    public getCommands(): VoiceCommand[] {
        return Array.from(this.commands.values());
    }
    
    /**
     * 获取指定分类的命令
     */
    public getCommandsByCategory(category: string): VoiceCommand[] {
        return Array.from(this.commands.values()).filter(cmd => cmd.category === category);
    }
    
    /**
     * 处理错误
     */
    private handleError(error: any): void {
        console.error('❌ 语音识别错误:', error);
        
        if (this.events.onError) {
            this.events.onError(error);
        }
        
        // 根据错误类型进行相应处理
        switch (error) {
            case 'not-allowed':
                console.error('❌ 麦克风权限被拒绝');
                break;
            case 'no-speech':
                console.warn('⚠️ 未检测到语音输入');
                break;
            case 'audio-capture':
                console.error('❌ 音频捕获失败');
                break;
            case 'network':
                console.error('❌ 网络错误');
                break;
            default:
                console.error('❌ 未知错误:', error);
        }
    }
    
    /**
     * 获取状态信息
     */
    public getStatus(): {
        isSupported: boolean;
        isEnabled: boolean;
        isListening: boolean;
        commandCount: number;
        shenshaCount: number;
    } {
        return {
            isSupported: this.isSupported,
            isEnabled: this.isEnabled,
            isListening: this.isListening,
            commandCount: this.commands.size,
            shenshaCount: this.shenshaNames.size
        };
    }
    
    /**
     * 销毁管理器
     */
    public dispose(): void {
        this.stopListening();
        
        if (this.recognition) {
            this.recognition = null;
        }
        
        if (this.pocketSphinx) {
            this.pocketSphinx = null;
        }
        
        this.commands.clear();
        this.keywordMap.clear();
        this.shenshaNames.clear();
        
        console.log('🗑️ 语音识别管理器已销毁');
    }
} 