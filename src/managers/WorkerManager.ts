/**
 * Web Worker管理器
 * 统一管理多个Worker，提供Promise API，性能监控和错误处理
 */

import type { BaziInput } from '../db/ShenshaDatabase';

interface WorkerTask {
    id: string;
    type: string;
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    startTime: number;
}

interface WorkerPerformanceStats {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    averageExecutionTime: number;
    totalExecutionTime: number;
    lastTaskTime?: number;
}

export class WorkerManager {
    private baziWorker: Worker | null = null;
    private pendingTasks: Map<string, WorkerTask> = new Map();
    private performanceStats: WorkerPerformanceStats = {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        averageExecutionTime: 0,
        totalExecutionTime: 0
    };
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;

    constructor() {
        this.initializeWorkers();
    }

    /**
     * 初始化Workers
     */
    private async initializeWorkers(): Promise<void> {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise((resolve, reject) => {
            try {
                // 创建八字计算Worker
                this.baziWorker = new Worker(
                    new URL('../workers/BaziCalculationWorker.ts', import.meta.url),
                    { type: 'module' }
                );

                // 设置Worker消息监听
                this.baziWorker.onmessage = (e) => this.handleWorkerMessage(e);
                this.baziWorker.onerror = (e) => this.handleWorkerError(e);

                // 监听Worker初始化完成
                const initHandler = (e: MessageEvent) => {
                    if (e.data.type === 'ready') {
                        this.isInitialized = true;
                        console.log('🚀 WorkerManager: 八字计算Worker初始化完成');
                        resolve();
                    }
                };

                this.baziWorker.addEventListener('message', initHandler, { once: true });

                // 设置超时
                setTimeout(() => {
                    if (!this.isInitialized) {
                        reject(new Error('Worker初始化超时'));
                    }
                }, 5000);

            } catch (error) {
                console.error('❌ WorkerManager: 初始化失败', error);
                reject(error);
            }
        });

        return this.initPromise;
    }

    /**
     * 处理Worker消息
     */
    private handleWorkerMessage(e: MessageEvent): void {
        const { id, type, success, data, error, performance } = e.data;

        if (type === 'ready') {
            return; // 初始化消息已在initializeWorkers中处理
        }

        const task = this.pendingTasks.get(id);
        if (!task) {
            console.warn(`⚠️ WorkerManager: 收到未知任务的响应: ${id}`);
            return;
        }

        // 更新性能统计
        if (performance) {
            this.updatePerformanceStats(performance.duration, success);
        }

        // 处理任务结果
        this.pendingTasks.delete(id);

        if (success) {
            console.log(`✅ WorkerManager: 任务完成 ${type} (${performance?.duration.toFixed(2)}ms)`);
            task.resolve(data);
        } else {
            console.error(`❌ WorkerManager: 任务失败 ${type}:`, error);
            task.reject(new Error(error || '未知错误'));
        }
    }

    /**
     * 处理Worker错误
     */
    private handleWorkerError(e: ErrorEvent): void {
        console.error('❌ WorkerManager: Worker错误', e);
        
        // 清理所有待处理任务
        this.pendingTasks.forEach(task => {
            task.reject(new Error(`Worker错误: ${e.message}`));
        });
        this.pendingTasks.clear();
        
        // 重新初始化Worker
        this.isInitialized = false;
        this.initPromise = null;
        this.initializeWorkers();
    }

    /**
     * 更新性能统计
     */
    private updatePerformanceStats(duration: number, success: boolean): void {
        this.performanceStats.totalTasks++;
        this.performanceStats.totalExecutionTime += duration;
        this.performanceStats.lastTaskTime = duration;

        if (success) {
            this.performanceStats.completedTasks++;
        } else {
            this.performanceStats.failedTasks++;
        }

        this.performanceStats.averageExecutionTime = 
            this.performanceStats.totalExecutionTime / this.performanceStats.totalTasks;
    }

    /**
     * 发送任务到Worker
     */
    private async sendTask(type: string, data: any): Promise<any> {
        if (!this.isInitialized) {
            await this.initializeWorkers();
        }

        if (!this.baziWorker) {
            throw new Error('Worker未初始化');
        }

        return new Promise((resolve, reject) => {
            const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const task: WorkerTask = {
                id,
                type,
                resolve,
                reject,
                startTime: performance.now()
            };

            this.pendingTasks.set(id, task);

            // 设置任务超时（30秒）
            setTimeout(() => {
                if (this.pendingTasks.has(id)) {
                    this.pendingTasks.delete(id);
                    reject(new Error(`任务超时: ${type}`));
                }
            }, 30000);

            // 发送任务到Worker
            this.baziWorker!.postMessage({ id, type, data });
        });
    }

    /**
     * 计算八字强弱
     */
    async calculateBaziStrength(bazi: BaziInput): Promise<{
        totalStrength: number;
        elementStrengths: { [element: string]: number };
        dominantElement: string;
        analysis: string;
    }> {
        return this.sendTask('calculateStrength', { bazi });
    }

    /**
     * 神煞匹配
     */
    async matchShensha(bazi: BaziInput): Promise<Array<{
        id: string;
        name: string;
        isActive: boolean;
        element?: string;
        power?: number;
    }>> {
        return this.sendTask('matchShensha', { bazi });
    }

    /**
     * 生成八字组合（批量计算）
     */
    async generateBaziCombinations(count: number = 1000): Promise<BaziInput[]> {
        return this.sendTask('generateBaziCombinations', { count });
    }

    /**
     * 批量八字分析（适用于构筑器的大量计算）
     */
    async batchAnalyzeBazi(bazis: BaziInput[]): Promise<Array<{
        bazi: BaziInput;
        strength: any;
        shensha: any[];
    }>> {
        const results = [];
        
        // 并行处理多个八字（分批处理以避免过载）
        const batchSize = 10;
        for (let i = 0; i < bazis.length; i += batchSize) {
            const batch = bazis.slice(i, i + batchSize);
            const batchPromises = batch.map(async (bazi) => {
                const [strength, shensha] = await Promise.all([
                    this.calculateBaziStrength(bazi),
                    this.matchShensha(bazi)
                ]);
                return { bazi, strength, shensha };
            });
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }
        
        return results;
    }

    /**
     * 获取性能统计
     */
    getPerformanceStats(): WorkerPerformanceStats {
        return { ...this.performanceStats };
    }

    /**
     * 重置性能统计
     */
    resetPerformanceStats(): void {
        this.performanceStats = {
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            averageExecutionTime: 0,
            totalExecutionTime: 0
        };
    }

    /**
     * 获取Worker状态
     */
    getWorkerStatus(): {
        isInitialized: boolean;
        pendingTasksCount: number;
        performanceStats: WorkerPerformanceStats;
    } {
        return {
            isInitialized: this.isInitialized,
            pendingTasksCount: this.pendingTasks.size,
            performanceStats: this.getPerformanceStats()
        };
    }

    /**
     * 销毁Manager和所有Workers
     */
    destroy(): void {
        console.log('🔄 WorkerManager: 正在销毁...');
        
        // 清理待处理任务
        this.pendingTasks.forEach(task => {
            task.reject(new Error('WorkerManager已销毁'));
        });
        this.pendingTasks.clear();

        // 终止Worker
        if (this.baziWorker) {
            this.baziWorker.terminate();
            this.baziWorker = null;
        }

        // 重置状态
        this.isInitialized = false;
        this.initPromise = null;
        this.resetPerformanceStats();

        console.log('✅ WorkerManager: 销毁完成');
    }
}

// 单例实例
export const workerManager = new WorkerManager(); 