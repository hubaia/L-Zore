import Phaser from 'phaser';
import { Interface } from 'phaser-react-ui';
import type { LZoreCard, GameState } from '../types/gameTypes';
import { CARD_DATABASE, INITIAL_GAME_STATE, GAME_CONFIG } from '../constants/gameData';
import { LZoreGameUI } from '../components/LZoreGameUI';
import { RealtimeSystemManager } from '../managers/RealtimeSystemManager';
import { BackgroundRenderManager } from '../managers/BackgroundRenderManager';
import { UIManager } from '../managers/UIManager';
import { BattlefieldManager } from '../managers/BattlefieldManager';
import { AudioManager } from '../managers/AudioManager';
import { EffectPanelManager } from '../managers/EffectPanelManager';
import { SettlementManager } from '../managers/SettlementManager';
import { EventBridgeManager } from '../managers/EventBridgeManager';
import { BaziCalculationManager } from '../managers/BaziCalculationManager';
import { TargetManager } from '../managers/TargetManager';
import { CardManager } from '../managers/CardManager';
import { GameStateManager } from '../managers/GameStateManager';
import { NeutralizationManager } from '../managers/NeutralizationManager';
import { OpponentAIManager } from '../managers/OpponentAIManager';
import { KeyboardManager } from '../managers/KeyboardManager';
import { AssetManager } from '../managers/AssetManager';
import { ReactEventManager } from '../managers/ReactEventManager';
import { UtilityManager } from '../managers/UtilityManager';
import { LifeElementManager } from '../managers/LifeElementManager';
import { CardHistoryManager } from '../managers/CardHistoryManager';

/**
 * L-Zore神煞卡牌游戏场景 - 重构版本
 * 使用管理器架构，将大型场景拆分为多个专业化管理器
 */
export class LZoreGameScene extends Phaser.Scene {
    // 核心游戏状态
    private gameState!: GameState;
    private cardDatabase!: LZoreCard[];
    
    // 游戏对象
    private playerHand!: Phaser.GameObjects.Group;
    private opponentHand!: Phaser.GameObjects.Group;
    private placedCards: Phaser.GameObjects.Container[] = [];
    
    // 弃牌堆系统（暂时保留，将逐步迁移到管理器）
    private discardPile: LZoreCard[] = [];
    private opponentDiscardPile: LZoreCard[] = [];
    
    // 效果面板系统
    private isEffectPanelOpen: boolean = false;
    private effectPanelTimeoutId: Phaser.Time.TimerEvent | null = null;
    
    // AI对手系统（暂时保留，将逐步迁移到管理器）
    private opponentCards: LZoreCard[] = [];
    
    // 管理器系统
    private realtimeManager!: RealtimeSystemManager;
    private backgroundManager!: BackgroundRenderManager;
    private uiManager!: UIManager;
    private battlefieldManager!: BattlefieldManager;
    private audioManager!: AudioManager;
    private effectPanelManager!: EffectPanelManager;
    private settlementManager!: SettlementManager;
    private eventBridgeManager!: EventBridgeManager;
    private baziCalculationManager!: BaziCalculationManager;
    private targetManager!: TargetManager;
    private cardManager!: CardManager;
    private gameStateManager!: GameStateManager;
    private neutralizationManager!: NeutralizationManager;
    private opponentAIManager!: OpponentAIManager;
    private keyboardManager!: KeyboardManager;
    private assetManager!: AssetManager;
    private reactEventManager!: ReactEventManager;
    private utilityManager!: UtilityManager;
    private lifeElementManager!: LifeElementManager;
    private cardHistoryManager!: CardHistoryManager;
    
    // phaser-react-ui 接口
    private ui!: Interface;
    
    // Web Audio API 音频系统（保留引用，主要功能已移至AudioManager）
    private audioContext: AudioContext | null = null;
    private audioBuffer: AudioBuffer | null = null;

    constructor() {
        super({ key: 'LZoreGameScene' });
    }

    preload() {
        console.log('🔄 开始preload过程');
        
        // 延迟发射事件，确保React组件的事件监听器已设置
        this.time.delayedCall(100, () => {
            console.log('📊 发射30%进度事件');
            this.events.emit('loadingProgress', 30, '正在生成游戏纹理...');
            
            // 创建资源管理器并生成游戏纹理（临时创建，稍后会在管理器初始化时正式创建）
            const tempAssetManager = new AssetManager(this);
            tempAssetManager.createAllGameTextures();
        });
        
        this.time.delayedCall(500, () => {
            console.log('📊 发射50%进度事件');
            this.events.emit('loadingProgress', 50, '正在准备音频资源...');
            
            // 音频资源将在AudioManager中处理
            console.log('🎵 音频资源将在管理器初始化时加载');
        });
        
        this.time.delayedCall(1000, () => {
            console.log('📊 发射70%进度事件');
            this.events.emit('loadingProgress', 70, '正在初始化游戏系统...');
        });
        
        this.time.delayedCall(1500, () => {
            console.log('📊 发射85%进度事件');
            this.events.emit('loadingProgress', 85, '资源加载完成，正在初始化...');
        });
    }

    create() {
        console.log('🎮 开始create过程');
        
        // 延迟执行，确保preload阶段完成
        this.time.delayedCall(2000, () => {
            console.log('📊 发射87%进度事件');
            this.events.emit('loadingProgress', 87, '正在初始化游戏系统...');
            
            // 初始化音频系统
            this.initializeAudio();
            
            // 初始化游戏状态
            this.initializeGameState();
            
            // 初始化管理器系统
            this.initializeManagers();
            
            this.time.delayedCall(500, () => {
                console.log('📊 发射90%进度事件');
                this.events.emit('loadingProgress', 90, '正在创建游戏背景...');
                
                // 创建游戏背景
                this.backgroundManager.createBackground();
                
                // 创建战场布局
                this.battlefieldManager.createBattleField();
                
                                    this.time.delayedCall(300, () => {
                        console.log('📊 发射92%进度事件');
                        this.events.emit('loadingProgress', 92, '正在准备卡牌系统...');
                        
                        // 创建卡牌数据库
                        this.createCardDatabase();
                        
                        // 创建玩家手牌区域
                        this.createPlayerHandArea();
                        
                        // 创建对手手牌区域
                        this.createOpponentHandArea();
                        
                        // 设置管理器之间的依赖关系（在hand groups创建之后）
                        this.setupManagerDependencies();
                        
                        // 设置拖拽系统
                        this.battlefieldManager.setupDragAndDrop();
                        
                        this.time.delayedCall(300, () => {
                            console.log('📊 发射95%进度事件');
                            this.events.emit('loadingProgress', 95, '正在初始化UI界面...');
                            
                            // 创建UI界面
                            this.uiManager.createGameUI();
                            
                            // 创建粒子系统
                            this.backgroundManager.createParticleEffects();
                            
                            this.time.delayedCall(300, () => {
                                console.log('📊 发射97%进度事件');
                                this.events.emit('loadingProgress', 97, '正在发放初始手牌...');
                                
                                // 发初始手牌 - 使用CardManager
                                this.cardManager.dealInitialCards();
                                
                                // 启动全局位置监控系统
                                this.utilityManager.startGlobalPositionMonitor(() => this.updateCardHoverEffects());
                                
                                // 添加键盘快捷键支持 - 使用KeyboardManager
                                this.keyboardManager.setupKeyboardControls({
                                    toggleAudio: () => this.audioManager.toggleAudio(),
                                    restartGame: () => this.restartGame(),
                                    useSpecialAbility: () => this.useSpecialAbility(),
                                    drawCard: () => this.drawCard(),
                                    pauseGame: () => this.keyboardManager.pauseGame()
                                });
                            
                            this.time.delayedCall(300, () => {
                                console.log('📊 发射99%进度事件');
                                this.events.emit('loadingProgress', 99, '正在启动游戏系统...');
                                
                                // 初始化phaser-react-ui接口
                                this.initializeUI();
                                
                                // 延迟发送游戏就绪事件，确保所有资源完全加载
                                this.time.delayedCall(500, () => {
                                    console.log('🎮 发射gameReady事件');
                                    this.events.emit('gameReady');
                                    
                                    // 延迟自动尝试播放背景音乐
                                    this.time.delayedCall(1500, async () => {
                                        await this.audioManager.initWebAudioAPI();
                                        this.audioManager.autoStartBackgroundMusic();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    // 资源加载方法已移至AssetManager

    /**
     * 初始化Web Audio API
     */
    private async initWebAudioAPI() {
        try {
            console.log('🎵 创建AudioContext...');
            // 创建AudioContext
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            console.log('✅ AudioContext创建成功');
            
            // 异步加载音频文件
            const audioUrl = '/Audio/BGM/Battle/虚拟人格对抗 (1).mp3';
            console.log(`🎵 开始获取音频文件: ${audioUrl}`);
            
            // 设置fetch超时
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
            
            const response = await fetch(audioUrl, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            console.log('✅ 音频文件获取成功，开始解码...');
            const arrayBuffer = await response.arrayBuffer();
            console.log(`📊 音频文件大小: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
            
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            console.log('✅ Web Audio API初始化成功，音频已解码');
            
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.error('❌ 音频加载超时（10秒）');
            } else {
                console.error('❌ Web Audio API初始化失败:', error);
            }
            // 不阻塞游戏继续运行
        }
    }

    /**
     * 初始化音频系统 - 使用AudioManager
     */
    private initializeAudio() {
        console.log('🎵 音频系统已准备完毕，将在游戏加载完成后自动尝试播放');
        // 音频初始化已移至AudioManager
    }



    /**
     * 初始化游戏状态 - 即时系统
     */
    private initializeGameState() {
        this.gameState = { ...INITIAL_GAME_STATE };
        this.gameState.gamePhase = 'realtime'; // 直接进入实时模式
        
        // 尝试从localStorage读取构筑数据
        this.loadDeckBuilderData();
        
        // 确保元素数量正确初始化为8枚
        this.gameState.playerRemainingElements = 8;
        this.gameState.opponentRemainingElements = 8;
        
        console.log('🎲 游戏初始化完成');
        console.log(`玩家八字: ${this.getBaZiDisplayText(this.gameState.playerBazi)}`);
        console.log(`对手八字: ${this.getBaZiDisplayText(this.gameState.opponentBazi)}`);
        console.log(`玩家元素: ${this.gameState.playerRemainingElements}/8 枚`);
        console.log(`对手元素: ${this.gameState.opponentRemainingElements}/8 枚`);
    }

    /**
     * 从localStorage加载构筑数据
     */
    private loadDeckBuilderData() {
        try {
            // 读取玩家八字
            const savedBazi = localStorage.getItem('playerBazi');
            if (savedBazi) {
                const parsedBazi = JSON.parse(savedBazi);
                this.gameState.playerBazi = parsedBazi;
                console.log('🔮 已加载构筑的玩家八字:', this.getBaZiDisplayText(parsedBazi));
            } else {
                console.log('📝 未找到构筑八字，使用默认八字');
            }
            
            // 读取构筑的卡组数据
            const savedDeck = localStorage.getItem('builtDeck');
            if (savedDeck) {
                const parsedDeck = JSON.parse(savedDeck) as LZoreCard[];
                
                // 更新卡牌数据库，使用构筑时计算好的生命元素
                this.cardDatabase = parsedDeck;
                console.log('🎴 已加载构筑的卡组数据');
                
                // 统计构筑结果
                const cardsWithElements = parsedDeck.filter(card => 
                    (card.currentLifeElements || 0) > 0
                ).length;
                console.log(`📊 构筑统计: ${cardsWithElements}/${parsedDeck.length} 张卡牌满足条件`);
                
                // 显示构筑的神煞状态
                parsedDeck.forEach(card => {
                    if ((card.currentLifeElements || 0) > 0) {
                        const elementType = card.lifeElementGeneration?.elementType || '未知';
                        console.log(`⭐ ${card.name}: ${card.currentLifeElements}/${card.maxLifeElements} ${elementType}元素`);
                    }
                });
            } else {
                console.log('📝 未找到构筑卡组，使用默认卡组');
                this.cardDatabase = [...CARD_DATABASE];
            }
        } catch (error) {
            console.error('❌ 加载构筑数据失败:', error);
            console.log('📝 使用默认游戏配置');
            this.cardDatabase = [...CARD_DATABASE];
        }
    }

    /**
     * 获取八字显示文本
     */
    private getBaZiDisplayText(bazi: any): string {
        return `${bazi.year.gan}${bazi.year.zhi} ${bazi.month.gan}${bazi.month.zhi} ${bazi.day.gan}${bazi.day.zhi} ${bazi.hour.gan}${bazi.hour.zhi}`;
    }

    /**
     * 初始化管理器系统
     */
    private initializeManagers() {
        console.log('🔧 开始初始化管理器系统...');
        
        // 初始化UI管理器
        this.uiManager = new UIManager(this, this.gameState);
        
        // 初始化音频管理器
        this.audioManager = new AudioManager(this);
        
        // 初始化资源管理器
        this.assetManager = new AssetManager(this);
        
        // 初始化游戏状态管理器
        this.gameStateManager = new GameStateManager(
            this,
            this.gameState,
            (text, type) => this.uiManager.showMessage(text, type)
        );
        
        // 初始化卡牌管理器
        this.cardManager = new CardManager(
            this,
            this.gameState,
            (text, type) => this.uiManager.showMessage(text, type)
        );
        
        // 初始化元素中和管理器
        this.neutralizationManager = new NeutralizationManager(
            this,
            (text, type) => this.uiManager.showMessage(text, type)
        );
        
        // 初始化对手AI管理器
        this.opponentAIManager = new OpponentAIManager(
            this,
            this.gameState,
            (text, type) => this.uiManager.showMessage(text, type)
        );
        
        // 初始化键盘管理器
        this.keyboardManager = new KeyboardManager(
            this,
            this.gameState,
            (text, type) => this.uiManager.showMessage(text, type)
        );
        
        // 初始化工具管理器
        this.utilityManager = new UtilityManager(
            this,
            (text, type) => this.uiManager.showMessage(text, type)
        );
        
        // 初始化生命元素管理器
        this.lifeElementManager = new LifeElementManager(
            this,
            this.gameState,
            this.baziCalculationManager,
            (text, type) => this.uiManager.showMessage(text, type)
        );
        
        // 初始化历史记录管理器
        this.cardHistoryManager = new CardHistoryManager(
            this,
            (text, type) => this.uiManager.showMessage(text, type)
        );
        
        // 初始化React事件管理器
        this.reactEventManager = new ReactEventManager(
            this,
            {
                showMessage: (text, type) => this.uiManager.showMessage(text, type),
                updateGameStateUI: () => this.updateGameStateUI(),
                checkElementNeutralization: () => this.checkElementNeutralization(),
                moveToDiscardPile: (card) => this.moveToDiscardPile(card),
                closeEffectPanel: () => this.closeEffectPanel(),
                startDamageSettlement: (cardData, actionType, targetCount, totalValue) => 
                    this.startDamageSettlement(cardData, actionType, targetCount, totalValue),
                onGameEnd: (winner) => this.gameStateManager.onGameEnd(winner),
                getGameState: () => this.gameState,
                getEffectPanelStatus: () => this.isEffectPanelOpen,
                setEffectPanelStatus: (status) => { this.isEffectPanelOpen = status; },
                getLifeElementManager: () => this.lifeElementManager // 🔥 新增：传递生命元素管理器引用
            }
        );
        
        // 初始化事件桥接管理器
        this.eventBridgeManager = new EventBridgeManager(this, this.uiManager);
        
        // 初始化八字计算管理器
        this.baziCalculationManager = new BaziCalculationManager(this);
        
        // 初始化目标管理器
        this.targetManager = new TargetManager(this);
        this.targetManager.setPlacedCards(this.placedCards);
        
        // 初始化效果面板管理器
        this.effectPanelManager = new EffectPanelManager(this, this.uiManager);
        this.effectPanelManager.setTargetCollector((actionType) => this.targetManager.collectAllTargets(actionType));
        
        // 初始化结算管理器
        this.settlementManager = new SettlementManager(this, this.uiManager);
        
        // 初始化即时系统管理器
        this.realtimeManager = new RealtimeSystemManager(
            this,
            this.gameState,
            (text, type) => this.uiManager.showMessage(text, type),
            () => this.updateGameStateUI(),
            () => this.autoDrawCards(),
            () => this.generateLifeElementsPerTurn()
        );
        
        // 初始化背景渲染管理器
        this.backgroundManager = new BackgroundRenderManager(this);
        
        // 初始化战场管理器
        this.battlefieldManager = new BattlefieldManager(
            this,
            this.gameState,
            (text, type) => this.uiManager.showMessage(text, type),
            (card, position) => this.onCardPlaced(card, position)
        );
        
        // 启动实时系统
        this.realtimeManager.startRealtimeSystem();
        
        // 开始新的游戏会话记录
        const deckData = this.gameState ? this.cardDatabase : undefined;
        this.cardHistoryManager.startGameSession(this.gameState, deckData);
        
        console.log('✅ 管理器系统初始化完成');
    }

    /**
     * 设置管理器之间的依赖关系
     */
    private setupManagerDependencies() {
        // 设置卡牌管理器的手牌组引用
        this.cardManager.setHandGroups(this.playerHand, this.opponentHand);
        
        // 设置游戏状态管理器的八字计算管理器引用
        this.gameStateManager.setBaziCalculationManager(this.baziCalculationManager);
        
        // 设置对手AI管理器的引用
        this.opponentAIManager.setOpponentHand(this.opponentHand);
        this.opponentAIManager.setPlacedCards(this.placedCards);
        this.opponentAIManager.setOpponentCards(this.opponentCards);
        
        // 设置工具管理器的背景管理器引用
        this.utilityManager.setBackgroundManager(this.backgroundManager);
        
        console.log('🔗 管理器依赖关系设置完成');
    }

    /**
     * 卡牌放置处理
     */
    private onCardPlaced(card: Phaser.GameObjects.Container, position: number) {
        const cardData = card.getData('cardData');
        
        console.log(`处理卡牌放置: ${cardData.name} 到位置 ${position}`);
        console.log('放置前手牌数量:', this.playerHand.children.entries.length);
        console.log('放置前场上卡牌数量:', this.placedCards.length);
        
        // TODO: 等待音效文件创建后再启用
        // 播放卡牌放置音效
        // try {
        //     this.sound.play('card_place', { volume: 0.5 });
        // } catch (error) {
        //     // 音效播放失败不影响游戏
        // }
        
        // 从手牌中移除
        this.playerHand.remove(card);
        this.placedCards.push(card);
        
        console.log('放置后手牌数量:', this.playerHand.children.entries.length);
        console.log('放置后场上卡牌数量:', this.placedCards.length);
        
        // 检查神煞出现条件并生成生命元素
        const generatedElements = this.lifeElementManager.generateLifeElementsOnPlacement(cardData, 'player');
        if (generatedElements > 0) {
            console.log(`🌟 ${cardData.name} 生成了 ${generatedElements} 枚生命元素`);
            
            // 更新卡牌视觉显示（在CardManager中处理）
            this.cardManager.updateCardLifeElements(card, cardData);
        }
        
        // 获得优先权
        this.realtimeManager.gainPriority('player');
        
        // 更新UI状态
        this.updateGameStateUI();
        
        // 所有卡牌放置后都弹出效果面板
        this.openEffectPanel(cardData, card);
    }

    /**
     * 自动抽卡回调
     */
    private autoDrawCards() {
        // 时停检查：如果游戏暂停则跳过自动抽卡
        if (this.gameState.isPaused) return;
        
        // 双方同时自动抽卡 - 使用CardManager
        if (this.playerHand.children.entries.length < 7) {
            this.cardManager.drawCard();
        }
        
        if (this.opponentHand.children.entries.length < 7) {
            this.cardManager.drawOpponentCard();
        }
    }

    /**
     * 创建卡牌数据库
     */
    private createCardDatabase() {
        // 如果已经在loadDeckBuilderData中设置了cardDatabase，则无需重新设置
        if (!this.cardDatabase) {
            this.cardDatabase = [...CARD_DATABASE];
            console.log('📝 使用默认卡牌数据库');
        } else {
            console.log('✅ 卡牌数据库已初始化（来自构筑数据或默认设置）');
        }
    }

    /**
     * 创建玩家手牌区域
     */
    private createPlayerHandArea() {
        const { width, height } = this.cameras.main;
        
        // 创建手牌组
        this.playerHand = this.add.group();
        
        // 创建手牌区域背景 - 极简设计
        const handAreaBg = this.add.graphics();
        handAreaBg.fillStyle(0x000000, 0.08); // 几乎透明
        handAreaBg.fillRect(0, height - 198, width, 198); // 99%显示的高度
        handAreaBg.setDepth(-1);
    }

    /**
     * 创建对手手牌区域
     */
    private createOpponentHandArea() {
        const { width } = this.cameras.main;
        
        // 创建对手手牌组
        this.opponentHand = this.add.group();
        
        // 创建对手手牌区域背景
        const opponentHandBg = this.add.graphics();
        opponentHandBg.fillStyle(0x660000, 0.1);
        opponentHandBg.fillRect(0, 0, width, 120);
        opponentHandBg.setDepth(-1);
    }

    // dealInitialCards已移至CardManager

    /**
     * 抽牌
     */
    drawCard(): Phaser.GameObjects.Container | null {
        if (this.gameState.isPaused) {
            this.uiManager.showMessage('⏸️ 时空暂停中，无法抽牌！', 'warning');
            return null;
        }
        
        // 使用CardManager处理抽卡
        return this.cardManager.drawCard();
    }

    /**
     * 对手抽牌
     */
    // drawOpponentCard已移至CardManager

    /**
     * 执行对手攻击
     */
    private executeOpponentAttack() {
        // 使用OpponentAIManager处理对手攻击
        this.opponentAIManager.executeOpponentAttack({
            updateGameStateUI: () => this.updateGameStateUI(),
            onGameEnd: (winner) => this.gameStateManager.onGameEnd(winner)
        });
    }

    // 卡牌创建和相关方法已移至CardManager
    // 工具方法已移至UtilityManager

    /**
     * 更新卡牌悬停效果
     */
    private updateCardHoverEffects() {
        // 监控卡牌位置和状态
        // 这里可以添加更多的动态效果
    }

    // 键盘控制已移至KeyboardManager

    /**
     * 使用特殊能力
     */
    useSpecialAbility() {
        // 使用KeyboardManager处理特殊能力
        this.keyboardManager.useSpecialAbility({
            applySpecialEffect: (effectName) => this.gameStateManager.applySpecialEffect(effectName),
            updateGameStateUI: () => this.updateGameStateUI(),
            checkElementNeutralization: () => this.checkElementNeutralization()
        });
    }

    // 音频控制方法已移至AudioManager

    /**
     * 初始化phaser-react-ui接口
     */
    private initializeUI() {
        try {
            this.ui = new Interface(this);
            this.ui.render(LZoreGameUI);
            
            // 设置UI事件监听器
            this.setupUIEventListeners();
            
            console.log('🎮 phaser-react-ui 初始化成功');
        } catch (error) {
            console.error('❌ phaser-react-ui 初始化失败:', error);
        }
    }

    /**
     * 设置UI事件监听器
     */
    private setupUIEventListeners() {
        // 使用ReactEventManager处理UI事件
        this.reactEventManager.setupUIEventListeners({
            drawCard: () => this.drawCard(),
            useSpecialAbility: () => this.useSpecialAbility(),
            releasePriority: () => this.realtimeManager.releasePriority()
        });
        
        // 监听取消效果面板超时事件
        this.events.on('cancelEffectPanelTimeout', () => {
            if (this.effectPanelTimeoutId) {
                this.effectPanelTimeoutId.destroy();
                this.effectPanelTimeoutId = null;
                console.log('✅ 用户执行操作，已取消15秒超时计时器');
                this.uiManager.showMessage('✅ 操作确认，超时计时器已取消', 'success');
            }
        });
        
        // 监听React UI发送的当前分配状态（用于超时处理）
        this.events.on('currentAllocationsResponse', (data: {
            cardData: LZoreCard,
            actionType: 'damage' | 'buff',
            allocations: Record<string, number>,
            targets: any[]
        }) => {
            console.log('⏰ 收到当前分配状态，执行超时结算:', data.allocations);
            
            // 使用当前分配执行效果
            this.events.emit('executeMultiTargetEffect', data);
        });
    }

    // React事件处理方法已移至ReactEventManager

    // 八字计算方法已移至BaziCalculationManager

    /**
     * 更新游戏状态UI
     */
    private updateGameStateUI() {
        // 更新本地UI
        this.uiManager.updateUI();
        
        // 使用GameStateManager更新UI状态
        this.gameStateManager.updateGameStateUI({
            getPlayerHandCount: () => this.cardManager.getHandCounts().playerHandCount,
            getPlacedCardsCount: () => this.placedCards.length,
            getDiscardPileStatus: () => this.cardManager.getDiscardPileStatus(),
            getHandCounts: () => this.cardManager.getHandCounts(),
            getDeckCounts: () => ({ playerDeckCount: 25, opponentDeckCount: 25 }) // 临时硬编码
        });
    }

    /**
     * 显示消息（备用方法）
     */
    private showMessage(text: string, type: 'success' | 'warning' | 'error' = 'success') {
        const colors = {
            success: '#00ff88',
            warning: '#ffaa00',
            error: '#ff4444'
        };
        
        const message = this.add.text(this.cameras.main.centerX, 100, text, {
            fontSize: '16px',
            color: colors[type],
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: {
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
            }
        });
        
        message.setOrigin(0.5);
        message.setDepth(1000);
        
        // 自动消失
        this.time.delayedCall(3000, () => {
            message.destroy();
        });
    }

    /**
     * 打开神煞效果面板 - 使用phaser-react-ui事件系统
     */
    private openEffectPanel(cardData: LZoreCard, sourceCard: Phaser.GameObjects.Container) {
        if (this.isEffectPanelOpen) return;
        
        this.isEffectPanelOpen = true;
        
        // ⏸️ 时停：暂停游戏时间
        this.gameState.isPaused = true;
        this.gameState.pauseReason = `正在使用 ${cardData.name} 的神煞能力`;
        
        this.uiManager.showMessage('⏸️ 时空暂停！选择神煞效果...', 'warning');
        
        // 收集目标数据 - 使用扩展的目标收集功能
        const actionType = cardData.type === 'auspicious' ? 'buff' : 'damage';
        const targets = this.targetManager.collectAllTargetsExtended();
        
        console.log(`🎯 神煞效果面板打开：${cardData.name}，操作类型：${actionType}，目标数：${targets.length}`);
        console.log('🎯 目标详情：', targets.map(t => `${t.name}(${t.type}:${t.owner})`).join(', '));
        
        // 设置15秒超时机制
        this.effectPanelTimeoutId = this.time.delayedCall(15000, () => {
            console.log('⏰ 效果面板15秒超时，自动执行结算');
            this.handleEffectPanelTimeout(cardData, actionType, targets);
        });
        
        // 显示超时提示
        this.uiManager.showMessage('⏰ 15秒后将自动执行已分配的伤害分配！', 'warning');
        
        // 发送事件到React UI - 使用phaser-react-ui事件系统
        this.events.emit('effectPanelOpen', {
            cardData: cardData,
            sourceCard: sourceCard,
            targets: targets,
            timeoutDuration: 15000 // 传递超时时间给React UI
        });
    }

    /**
     * 应用效果
     */
    private applyEffect(cardData: LZoreCard, type: 'damage' | 'buff', targetPosition: number) {
        // 收集目标信息用于历史记录
        const targets = [{
            id: `position_${targetPosition}`,
            name: this.getPillarName(targetPosition),
            type: 'pillar' as const,
            owner: type === 'damage' ? 'opponent' as const : 'player' as const,
            allocatedValue: cardData.power,
            position: targetPosition
        }];
        
        if (type === 'damage') {
            // 对对手造成伤害 - 减少对手的剩余元素
            const damage = Math.min(cardData.power, this.gameState.opponentRemainingElements);
            this.gameState.opponentRemainingElements -= damage;
            
            this.uiManager.showMessage(`对${this.getPillarName(targetPosition)}造成${damage}点元素伤害！对手剩余${this.gameState.opponentRemainingElements}枚元素`, 'error');
            
            // 战斗中生成生命元素
            const combatElements = this.lifeElementManager.generateLifeElementsOnCombat(cardData, 'player');
            if (combatElements > 0) {
                console.log(`⚔️ ${cardData.name} 战斗中生成了 ${combatElements} 枚生命元素`);
            }
            
            // 记录卡牌使用历史（伤害类型）
            this.cardHistoryManager.recordCardUsage(
                cardData,
                'player',
                'damage',
                targets,
                damage,
                this.gameState,
                undefined,
                `对${this.getPillarName(targetPosition)}造成${damage}点伤害`
            );
            
            // 检查对手是否败北
            if (this.gameState.opponentRemainingElements <= 0) {
                this.onGameEnd('player');
                return;
            }
            
        } else if (type === 'buff') {
            // 为己方增益 - 恢复玩家的剩余元素（不超过8枚）
            const heal = Math.min(cardData.power, 8 - this.gameState.playerRemainingElements);
            this.gameState.playerRemainingElements += heal;
            
            this.uiManager.showMessage(`为${this.getPillarName(targetPosition)}提供${heal}点元素增益！玩家剩余${this.gameState.playerRemainingElements}枚元素`, 'success');
            
            // 记录卡牌使用历史（增益类型）
            this.cardHistoryManager.recordCardUsage(
                cardData,
                'player',
                'buff',
                targets,
                heal,
                this.gameState,
                undefined,
                `为${this.getPillarName(targetPosition)}提供${heal}点增益`
            );
        }
        
        // 卡牌使用效果后保留在格子中，等待元素中和
        this.uiManager.showMessage(`${cardData.name} 已使用效果，等待元素中和...`, 'success');
        
        // 更新UI显示最新的元素数量
        this.updateGameStateUI();
        
        // 检查是否触发元素中和
        this.checkElementNeutralization();
    }

    /**
     * 应用特殊效果
     */
    private applySpecialEffect(effectName: string) {
        this.uiManager.showMessage(`施展特殊效果：${effectName}！`, 'warning');
        
        // 创建一个临时的卡牌数据用于记录特殊效果
        const specialCard: LZoreCard = {
            id: `special_${Date.now()}`,
            name: effectName,
            type: 'special' as any,
            element: 'special',
            rarity: 'special',
            power: 0,
            description: `特殊效果：${effectName}`,
            effect: `施展特殊效果：${effectName}`,
            appearConditions: [],
            lifeElementGeneration: undefined
        };
        
        let totalValue = 0;
        let targets: any[] = [];
        
        // 根据特殊效果名称执行不同逻辑
        switch (effectName) {
            case '全体增益':
                const playerHeal = Math.min(2, 8 - this.gameState.playerRemainingElements);
                this.gameState.playerRemainingElements += playerHeal;
                this.uiManager.showMessage(`全体增益：恢复${playerHeal}枚元素！`, 'success');
                
                totalValue = playerHeal;
                targets = [{
                    id: 'all_player_pillars',
                    name: '全体己方',
                    type: 'bazi',
                    owner: 'player',
                    allocatedValue: playerHeal
                }];
                specialCard.power = playerHeal;
                break;
                
            case '全体伤害':
                const opponentDamage = Math.min(2, this.gameState.opponentRemainingElements);
                this.gameState.opponentRemainingElements -= opponentDamage;
                this.uiManager.showMessage(`全体伤害：对手失去${opponentDamage}枚元素！`, 'error');
                
                totalValue = opponentDamage;
                targets = [{
                    id: 'all_opponent_pillars',
                    name: '全体对手',
                    type: 'bazi',
                    owner: 'opponent',
                    allocatedValue: opponentDamage
                }];
                specialCard.power = opponentDamage;
                
                if (this.gameState.opponentRemainingElements <= 0) {
                    this.onGameEnd('player');
                    return;
                }
                break;
                
            case '中和效果':
                this.uiManager.showMessage('强制触发元素中和！', 'warning');
                // 强制触发一次元素中和
                this.forceElementNeutralization();
                
                totalValue = 1;
                targets = [{
                    id: 'neutralization_effect',
                    name: '元素中和',
                    type: 'fieldCard',
                    owner: 'player',
                    allocatedValue: 1
                }];
                break;
        }
        
        // 记录特殊效果使用历史
        this.cardHistoryManager.recordCardUsage(
            specialCard,
            'player',
            'special',
            targets,
            totalValue,
            this.gameState,
            effectName,
            `使用特殊效果：${effectName}，影响${targets.length}个目标`
        );
        
        // 更新UI显示最新的元素数量
        this.updateGameStateUI();
        
        // 检查是否触发元素中和
        this.checkElementNeutralization();
    }

    /**
     * 强制触发元素中和
     */
    private forceElementNeutralization() {
        const neutralizableCards = this.placedCards.filter(card => {
            const cardData = card.getData('cardData');
            return cardData && !card.getData('neutralized');
        });
        
        if (neutralizableCards.length > 0) {
            const targetCard = neutralizableCards[0]; // 选择第一张卡
            const cardData = targetCard.getData('cardData');
            
            // 标记为已中和
            targetCard.setData('neutralized', true);
            
            // 视觉效果：卡牌变灰
            targetCard.setAlpha(0.5);
            targetCard.list.forEach((child: any) => {
                if (child.setTint) {
                    child.setTint(0x666666);
                }
            });
            
            this.uiManager.showMessage(`⚖️ 强制中和！${cardData.name} 被中和，即将进入弃牌堆！`, 'warning');
            
            // 延迟后移入弃牌堆
            this.time.delayedCall(2000, () => {
                this.moveToDiscardPile(targetCard);
            });
        }
    }

    /**
     * 游戏结束处理
     */
    private onGameEnd(winner: 'player' | 'opponent') {
        // 结束游戏会话记录
        this.cardHistoryManager.endGameSession(
            winner === 'player' ? 'player_win' : 'opponent_win'
        );
        
        // 使用GameStateManager处理游戏结束
        this.gameStateManager.onGameEnd(winner);
        
        // 3秒后监听重新开始
        this.time.delayedCall(3000, () => {
            this.input.keyboard!.once('keydown-R', () => {
                this.restartGame();
            });
        });
    }

    /**
     * 重新开始游戏
     */
    private restartGame() {
        // 使用GameStateManager处理游戏重启
        this.gameStateManager.restartGame({
            clearPlacedCards: () => {
                this.placedCards.forEach(card => card.destroy());
                this.placedCards = [];
            },
            clearDiscardPiles: () => {
                this.discardPile = [];
                this.opponentDiscardPile = [];
                this.neutralizationManager.clearDiscardPile();
            },
            clearHandCards: () => {
                this.playerHand.clear(true);
                this.opponentHand.clear(true);
            },
            dealInitialCards: () => this.cardManager.dealInitialCards(),
            startRealtimeSystem: () => this.realtimeManager.startRealtimeSystem()
        });
    }

    /**
     * 检查元素中和机制
     */
    private checkElementNeutralization() {
        // 使用NeutralizationManager处理元素中和
        this.neutralizationManager.checkElementNeutralization(this.placedCards, {
            moveToDiscardPile: (card) => this.moveToDiscardPile(card)
        });
    }

    /**
     * 将卡牌移入弃牌堆
     */
    private moveToDiscardPile(cardContainer: Phaser.GameObjects.Container) {
        const cardData = cardContainer.getData('cardData');
        const position = cardContainer.getData('position');
        
        // 添加到弃牌堆
        this.discardPile.push(cardData);
        
        // 从战场移除
        this.placedCards = this.placedCards.filter(card => card !== cardContainer);
        
        // 清空战场位置状态
        if (position !== undefined && position !== null) {
            this.battlefieldManager.clearPosition(position);
            // 重置格子的视觉状态
            this.battlefieldManager?.getGridCells()?.[position]?.setFillStyle(0x0066ff, 0.1);
        }
        
        // 创建移入弃牌堆的动画效果
        this.tweens.add({
            targets: cardContainer,
            x: 100, // 弃牌堆位置
            y: 100,
            scaleX: 0.3,
            scaleY: 0.3,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                cardContainer.destroy();
                this.uiManager.showMessage(`${cardData.name} 已进入弃牌堆`, 'success');
                
                // 更新UI状态
                this.updateGameStateUI();
            }
        });
    }

    /**
     * 关闭效果面板 - 使用phaser-react-ui事件系统
     */
    private closeEffectPanel() {
        console.log('🔄 Phaser: 开始关闭效果面板');
        
        // 防止重复关闭
        if (!this.isEffectPanelOpen) {
            console.log('🔄 Phaser: 面板已经关闭，跳过');
            return;
        }
        
        this.isEffectPanelOpen = false;
        
        // 取消超时计时器
        if (this.effectPanelTimeoutId) {
            this.effectPanelTimeoutId.destroy();
            this.effectPanelTimeoutId = null;
            console.log('⏰ 取消效果面板超时计时器');
        }
        
        // ▶️ 恢复游戏时间
        this.gameState.isPaused = false;
        this.gameState.pauseReason = '';
        
        this.uiManager.showMessage('▶️ 时空恢复！游戏继续...', 'success');
        
        // 只通知React UI关闭面板，不要再次调用自己
        console.log('🔄 Phaser: 发送effectPanelClose事件到React');
        this.events.emit('effectPanelClose');
        
        console.log('🔄 Phaser: 效果面板关闭完成');
    }

    /**
     * 开始伤害结算流程 - 快速版本
     */
    private startDamageSettlement(cardData: LZoreCard, actionType: 'damage' | 'buff', targetCount: number, totalValue: number) {
        console.log(`🎯 开始${actionType === 'damage' ? '伤害' : '增益'}结算流程`);
        
        // 显示结算开始消息
        this.uiManager.showMessage(`⚖️ ${actionType === 'damage' ? '伤害' : '增益'}结算完成！`, 'warning');
        
        // 立即开始结算特效（不延迟）
        this.playSettlementEffects(cardData, actionType, targetCount, totalValue);
        
        // 短暂延迟后检查游戏胜负
        this.time.delayedCall(200, () => {
            if (!this.checkGameEndConditions()) {
                // 如果游戏没有结束，快速进入下一阶段
                this.proceedToNextPhase(cardData);
            }
        });
    }

    /**
     * 播放结算特效 - 快速版本
     */
    private playSettlementEffects(cardData: LZoreCard, actionType: 'damage' | 'buff', targetCount: number, totalValue: number) {
        // 简化的结算特效，只显示消息
        const effectText = `${actionType === 'damage' ? '⚔️' : '✨'} ${totalValue}炁克 → ${targetCount}个目标`;
        this.uiManager.showMessage(effectText, actionType === 'damage' ? 'error' : 'success');
        
        // 可选：简单的屏幕闪烁效果
        const flash = this.add.rectangle(
            this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            this.cameras.main.width, 
            this.cameras.main.height, 
            actionType === 'damage' ? 0xff4444 : 0x44ff44, 
            0.3
        );
        flash.setDepth(999);
        
        // 快速闪烁动画
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                flash.destroy();
            }
        });
        
        console.log(`🎬 快速结算特效：${effectText}`);
    }

    /**
     * 检查游戏结束条件
     */
    private checkGameEndConditions() {
        return this.gameStateManager.checkGameEndConditions();
    }

    /**
     * 进入下一阶段
     */
    private proceedToNextPhase(cardData: LZoreCard) {
        // 如果游戏已结束，不继续
        if (this.gameState.gamePhase === 'ended') {
            return;
        }
        
        this.uiManager.showMessage(`🔄 ${cardData.name} 效果结算完毕，游戏继续`, 'success');
        
        // 移除使用过的卡牌（如果需要）
        this.removeUsedCard(cardData);
        
        // 触发对手回合（如果是对战模式）
        this.triggerOpponentTurn();
        
        // 更新游戏状态
        this.updateGameStateUI();
    }

    /**
     * 移除使用过的卡牌
     */
    private removeUsedCard(cardData: LZoreCard) {
        // 使用CardManager处理卡牌移除
        this.cardManager.removeUsedCard(cardData);
    }

    /**
     * 触发对手回合
     */
    private triggerOpponentTurn() {
        // 如果是即时战斗系统，不需要切换回合
        if (this.gameState.gamePhase === 'realtime') {
            // 给对手一个反应的机会
            this.time.delayedCall(2000, () => {
                if (Math.random() < 0.4) { // 40%概率对手立即反击
                    this.executeOpponentAttack();
                }
            });
        }
        
        // 释放优先权
        this.realtimeManager.releasePriority();
    }

    /**
     * 收集所有可能的目标 - 仍需要在Phaser中使用
     */
    private collectAllTargets(actionType: 'damage' | 'buff'): Array<{
        id: string,
        name: string,
        type: 'fieldCard' | 'bazi',
        owner: 'player' | 'opponent',
        data: any
    }> {
        const targets: Array<{
            id: string,
            name: string,
            type: 'fieldCard' | 'bazi',
            owner: 'player' | 'opponent',
            data: any
        }> = [];
        
        // 收集场上的神煞卡
        this.placedCards.forEach((card, index) => {
            const cardData = card.getData('cardData');
            const isPlayerCard = card.y > this.cameras.main.height / 2; // 根据位置判断归属
            
            // 根据行动类型过滤目标
            if (actionType === 'damage' && isPlayerCard) return; // 伤害不能针对己方卡牌
            if (actionType === 'buff' && !isPlayerCard) return; // 增益不能针对敌方卡牌
            
            if (cardData && !card.getData('neutralized')) {
                targets.push({
                    id: `field_${index}`,
                    name: cardData.name,
                    type: 'fieldCard',
                    owner: isPlayerCard ? 'player' : 'opponent',
                    data: { card, cardData, index }
                });
            }
        });
        
        // 收集本命八字目标
        const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
        
        if (actionType === 'damage') {
            // 伤害：针对对手八字
            pillarNames.forEach((pillarName, index) => {
                targets.push({
                    id: `opponent_bazi_${index}`,
                    name: `对手${pillarName}`,
                    type: 'bazi',
                    owner: 'opponent',
                    data: { pillarIndex: index, pillarName }
                });
            });
        } else {
            // 增益：针对己方八字
            pillarNames.forEach((pillarName, index) => {
                targets.push({
                    id: `player_bazi_${index}`,
                    name: `己方${pillarName}`,
                    type: 'bazi',
                    owner: 'player',
                    data: { pillarIndex: index, pillarName }
                });
            });
        }
        
        return targets;
    }

    /**
     * 获取柱位名称 - 仍需要在其他地方使用
     */
    private getPillarName(position: number): string {
        const names = ['年柱', '月柱', '日柱', '时柱'];
        return names[position % 4];
    }
    
    /**
     * 每轮生成生命元素（由RealtimeSystemManager的每轮回调触发）
     */
    private generateLifeElementsPerTurn(): void {
        if (!this.lifeElementManager) {
            return;
        }
        
        // 为场上所有卡牌生成生命元素
        this.lifeElementManager.generateLifeElementsPerTurn(this.placedCards);
        
        // 🔥 新增：检查生命元素耗尽的卡牌
        const removedCards = this.lifeElementManager.checkLifeElementDepletion(this.placedCards, {
            moveToDiscardPile: (card) => this.moveToDiscardPile(card)
        });
        
        // 从placedCards中移除已经标记为移除的卡牌
        if (removedCards.length > 0) {
            removedCards.forEach(removedCard => {
                const index = this.placedCards.indexOf(removedCard);
                if (index > -1) {
                    this.placedCards.splice(index, 1);
                }
            });
            
            console.log(`💀 检查完成：${removedCards.length}张卡牌因生命元素耗尽被移除`);
        }
        
        // 更新UI状态
        this.updateGameStateUI();
    }
    
    /**
     * 处理效果面板15秒超时
     */
    private handleEffectPanelTimeout(cardData: LZoreCard, actionType: 'damage' | 'buff', targets: any[]): void {
        if (!this.isEffectPanelOpen) {
            console.log('⏰ 面板已关闭，取消超时处理');
            return;
        }
        
        console.log('⏰ 效果面板15秒超时，执行自动结算');
        
        this.uiManager.showMessage('⏰ 超时！按照当前分配自动执行效果', 'warning');
        
        // 发送事件请求当前的分配状态
        this.events.emit('requestCurrentAllocations', {
            cardData: cardData,
            actionType: actionType,
            targets: targets
        });
        
        // 设置一个短暂的延迟来等待React UI响应
        // 如果React UI没有在100ms内响应，就使用默认分配策略
        let hasReceivedResponse = false;
        
        // 临时监听React UI的响应
        const responseHandler = () => {
            hasReceivedResponse = true;
        };
        
        this.events.once('currentAllocationsResponse', responseHandler);
        
        this.time.delayedCall(100, () => {
            if (!hasReceivedResponse) {
                console.log('⏰ 未收到React UI响应，使用默认分配策略');
                // 移除监听器
                this.events.off('currentAllocationsResponse', responseHandler);
                // 执行默认分配
                this.executeDefaultAllocation(cardData, actionType, targets);
            }
        });
    }
    
    /**
     * 执行默认分配策略（超时时的备用方案）
     */
    private executeDefaultAllocation(cardData: LZoreCard, actionType: 'damage' | 'buff', targets: any[]): void {
        if (targets.length === 0) {
            console.log('⚠️ 没有可用目标，关闭面板');
            this.closeEffectPanel();
            return;
        }
        
        const totalPower = cardData.power;
        let defaultAllocations: Record<string, number> = {};
        
        // 🔥 凶神规则处理：凶神伤害时必须至少分配1点给己方目标
        if (cardData.type === 'inauspicious' && actionType === 'damage') {
            console.log('💀 凶神默认分配：遵循凶神规则');
            
            // 分离己方和敌方目标
            const playerTargets = targets.filter(target => target.owner === 'player');
            const opponentTargets = targets.filter(target => target.owner === 'opponent');
            
            if (playerTargets.length > 0 && opponentTargets.length > 0) {
                // 凶神规则：至少1点给己方，其余给敌方
                const playerAllocation = 1;
                const opponentAllocation = totalPower - playerAllocation;
                
                if (opponentAllocation > 0) {
                    defaultAllocations[playerTargets[0].id] = playerAllocation;
                    defaultAllocations[opponentTargets[0].id] = opponentAllocation;
                    console.log(`💀 凶神分配：${playerAllocation}炁克→己方，${opponentAllocation}炁克→敌方`);
                } else {
                    // 如果总威力只有1点，全部分配给己方（凶神自噬）
                    defaultAllocations[playerTargets[0].id] = totalPower;
                    console.log(`💀 凶神自噬：${totalPower}炁克→己方`);
                }
            } else if (playerTargets.length > 0) {
                // 只有己方目标，全部分配给己方（凶神自噬）
                defaultAllocations[playerTargets[0].id] = totalPower;
                console.log(`💀 凶神自噬：${totalPower}炁克→己方（无敌方目标）`);
            } else if (opponentTargets.length > 0) {
                // 只有敌方目标，违反凶神规则，但作为兜底策略分配给敌方
                defaultAllocations[opponentTargets[0].id] = totalPower;
                console.log(`⚠️ 凶神异常：${totalPower}炁克→敌方（无己方目标，违反规则）`);
            }
        } else {
            // 🔥 非凶神或非伤害：使用原来的默认分配策略
            const firstTarget = targets[0];
            defaultAllocations = {
                [firstTarget.id]: totalPower
            };
            console.log(`⏰ 常规分配：${totalPower}炁克→${firstTarget.name}`);
        }
        
        console.log('⏰ 使用默认分配策略:', defaultAllocations);
        
        // 使用ReactEventManager的多目标执行逻辑
        this.events.emit('executeMultiTargetEffect', {
            cardData: cardData,
            actionType: actionType,
            allocations: defaultAllocations,
            targets: targets
        });
    }
} 