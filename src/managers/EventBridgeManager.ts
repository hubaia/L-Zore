import type { LZoreCard } from '../types/gameTypes';

/**
 * 事件桥接管理器 - 处理React与Phaser之间的事件通信
 * 从 LZoreGameScene.refactored.ts 中抽象出来
 */
export class EventBridgeManager {
    private scene: Phaser.Scene;
    private uiManager: any; // UIManager 引用
    private eventListeners: Map<string, Function[]> = new Map();
    
    constructor(scene: Phaser.Scene, uiManager: any) {
        this.scene = scene;
        this.uiManager = uiManager;
    }
    
    /**
     * 设置UI事件监听器
     */
    setupUIEventListeners(callbacks: {
        executeEffectFromReact: (data: any) => void;
        executeMultiTargetEffectFromReact: (data: any) => void;
        closeEffectPanel: () => void;
    }): void {
        console.log('🔗 EventBridgeManager: 设置UI事件监听器');
        
        // 监听单目标效果执行事件
        this.addEventListenerSafe('executeEffect', callbacks.executeEffectFromReact);
        
        // 监听多目标效果执行事件 
        this.addEventListenerSafe('executeMultiTargetEffect', callbacks.executeMultiTargetEffectFromReact);
        
        // 监听效果面板关闭事件
        this.addEventListenerSafe('effectPanelClose', callbacks.closeEffectPanel);
        
        console.log('✅ EventBridgeManager: UI事件监听器设置完成');
    }
    
    /**
     * 安全地添加事件监听器（避免重复添加）
     */
    private addEventListenerSafe(eventName: string, callback: Function): void {
        // 移除旧的监听器
        this.scene.events.off(eventName);
        
        // 添加新的监听器
        this.scene.events.on(eventName, callback);
        
        // 记录监听器
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, []);
        }
        this.eventListeners.get(eventName)?.push(callback);
        
        console.log(`🔗 EventBridgeManager: 添加事件监听器 ${eventName}`);
    }
    
    /**
     * 发送游戏状态更新事件到React
     */
    emitGameStateUpdate(gameStateData: any): void {
        console.log('📤 EventBridgeManager: 发送gameStateUpdate事件到React');
        this.scene.events.emit('gameStateUpdate', gameStateData);
    }
    
    /**
     * 发送效果面板打开事件到React
     */
    emitEffectPanelOpen(data: {
        cardData: LZoreCard,
        sourceCard: Phaser.GameObjects.Container,
        targets: any[]
    }): void {
        console.log('📤 EventBridgeManager: 发送effectPanelOpen事件到React');
        this.scene.events.emit('effectPanelOpen', data);
    }
    
    /**
     * 发送效果面板关闭事件到React
     */
    emitEffectPanelClose(): void {
        console.log('📤 EventBridgeManager: 发送effectPanelClose事件到React');
        this.scene.events.emit('effectPanelClose');
    }
    
    /**
     * 发送目标更新事件到React
     */
    emitTargetsUpdate(targets: any[]): void {
        console.log('📤 EventBridgeManager: 发送targetsUpdate事件到React');
        this.scene.events.emit('targetsUpdate', targets);
    }
    
    /**
     * 发送加载进度事件到React
     */
    emitLoadingProgress(progress: number, text: string): void {
        console.log(`📤 EventBridgeManager: 发送loadingProgress事件到React - ${progress}%: ${text}`);
        this.scene.events.emit('loadingProgress', progress, text);
    }
    
    /**
     * 发送游戏准备完成事件到React
     */
    emitGameReady(): void {
        console.log('📤 EventBridgeManager: 发送gameReady事件到React');
        this.scene.events.emit('gameReady');
    }
    
    /**
     * 批量发送事件
     */
    emitBatch(events: Array<{name: string, data?: any}>): void {
        console.log(`📤 EventBridgeManager: 批量发送${events.length}个事件`);
        events.forEach(event => {
            if (event.data !== undefined) {
                this.scene.events.emit(event.name, event.data);
            } else {
                this.scene.events.emit(event.name);
            }
        });
    }
    
    /**
     * 延迟发送事件
     */
    emitDelayed(eventName: string, data: any, delay: number): void {
        console.log(`📤 EventBridgeManager: 延迟${delay}ms发送事件 ${eventName}`);
        this.scene.time.delayedCall(delay, () => {
            this.scene.events.emit(eventName, data);
        });
    }
    
    /**
     * 条件发送事件
     */
    emitConditional(eventName: string, data: any, condition: () => boolean): void {
        if (condition()) {
            console.log(`📤 EventBridgeManager: 条件满足，发送事件 ${eventName}`);
            this.scene.events.emit(eventName, data);
        } else {
            console.log(`⏭️ EventBridgeManager: 条件不满足，跳过事件 ${eventName}`);
        }
    }
    
    /**
     * 创建事件序列（按顺序发送）
     */
    createEventSequence(events: Array<{
        name: string, 
        data?: any, 
        delay: number
    }>): void {
        console.log(`📤 EventBridgeManager: 创建${events.length}个事件的序列`);
        
        let currentDelay = 0;
        events.forEach(event => {
            this.scene.time.delayedCall(currentDelay, () => {
                console.log(`📤 EventBridgeManager: 序列事件 ${event.name}`);
                if (event.data !== undefined) {
                    this.scene.events.emit(event.name, event.data);
                } else {
                    this.scene.events.emit(event.name);
                }
            });
            currentDelay += event.delay;
        });
    }
    
    /**
     * 监听来自React的事件
     */
    onReactEvent(eventName: string, callback: Function): void {
        console.log(`📥 EventBridgeManager: 监听来自React的事件 ${eventName}`);
        this.addEventListenerSafe(eventName, callback);
    }
    
    /**
     * 移除事件监听器
     */
    removeEventListener(eventName: string): void {
        console.log(`🗑️ EventBridgeManager: 移除事件监听器 ${eventName}`);
        this.scene.events.off(eventName);
        this.eventListeners.delete(eventName);
    }
    
    /**
     * 移除所有事件监听器
     */
    removeAllEventListeners(): void {
        console.log('🗑️ EventBridgeManager: 移除所有事件监听器');
        this.eventListeners.forEach((callbacks, eventName) => {
            this.scene.events.off(eventName);
        });
        this.eventListeners.clear();
    }
    
    /**
     * 获取当前监听的事件列表
     */
    getActiveEventListeners(): string[] {
        return Array.from(this.eventListeners.keys());
    }
    
    /**
     * 检查事件是否有监听器
     */
    hasEventListener(eventName: string): boolean {
        return this.eventListeners.has(eventName);
    }
    
    /**
     * 创建双向事件通道
     */
    createBidirectionalChannel(channelName: string, callbacks: {
        onReceive: (data: any) => void;
        onSend?: (data: any) => void;
    }): {
        send: (data: any) => void;
        close: () => void;
    } {
        const receiveEventName = `${channelName}_receive`;
        const sendEventName = `${channelName}_send`;
        
        // 设置接收监听器
        this.addEventListenerSafe(receiveEventName, callbacks.onReceive);
        
        console.log(`🔄 EventBridgeManager: 创建双向通道 ${channelName}`);
        
        return {
            send: (data: any) => {
                console.log(`📤 EventBridgeManager: 通道 ${channelName} 发送数据`);
                if (callbacks.onSend) {
                    callbacks.onSend(data);
                }
                this.scene.events.emit(sendEventName, data);
            },
            close: () => {
                console.log(`🔒 EventBridgeManager: 关闭通道 ${channelName}`);
                this.removeEventListener(receiveEventName);
                this.removeEventListener(sendEventName);
            }
        };
    }
    
    /**
     * 清理资源
     */
    dispose(): void {
        console.log('🧹 EventBridgeManager: 清理资源');
        this.removeAllEventListeners();
    }
} 