/**
 * 语音交互演示组件
 * 展示语音识别和语音合成的完整功能
 */

import React, { useState, useEffect, useRef } from 'react';
import { VoiceRecognitionManager, type VoiceCommand } from './VoiceRecognitionManager';
import { SpeechSynthesisManager } from './SpeechSynthesisManager';

interface VoiceInteractionDemoProps {
    className?: string;
}

interface RecognitionResult {
    text: string;
    confidence: number;
    timestamp: number;
    command?: string;
}

export const VoiceInteractionDemo: React.FC<VoiceInteractionDemoProps> = ({
    className = ''
}) => {
    // 状态管理
    const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
    const [isRecognitionEnabled, setIsRecognitionEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognitionResults, setRecognitionResults] = useState<RecognitionResult[]>([]);
    const [commands, setCommands] = useState<VoiceCommand[]>([]);
    const [currentResult, setCurrentResult] = useState<string>('');
    
    // 管理器引用
    const recognitionManagerRef = useRef<VoiceRecognitionManager | null>(null);
    const speechManagerRef = useRef<SpeechSynthesisManager | null>(null);
    
    // 模拟Phaser场景对象
    const mockScene = useRef({
        events: {
            emit: (event: string, data?: any) => {
                console.log(`🎮 游戏事件: ${event}`, data);
                addLogMessage(`游戏事件: ${event}`, 'game');
            }
        }
    });
    
    /**
     * 初始化语音系统
     */
    useEffect(() => {
        const initializeVoiceSystems = async () => {
            try {
                console.log('🚀 初始化语音交互系统...');
                
                // 初始化语音合成管理器
                speechManagerRef.current = new SpeechSynthesisManager(mockScene.current as any);
                
                // 初始化语音识别管理器
                recognitionManagerRef.current = new VoiceRecognitionManager(
                    mockScene.current as any,
                    {
                        onCommandRecognized: (command: string, confidence: number) => {
                            addRecognitionResult('', confidence, command);
                            addLogMessage(`识别到命令: ${command}`, 'success');
                            
                            // 语音反馈
                            speechManagerRef.current?.speak(`执行命令：${command}`, 'system');
                        },
                        onResult: (result: string, confidence: number) => {
                            setCurrentResult(result);
                            addRecognitionResult(result, confidence);
                        },
                        onSpeechStart: () => {
                            setIsListening(true);
                            addLogMessage('开始语音识别', 'info');
                        },
                        onSpeechEnd: () => {
                            setIsListening(false);
                            addLogMessage('语音识别结束', 'info');
                        },
                        onError: (error: any) => {
                            addLogMessage(`识别错误: ${error}`, 'error');
                        }
                    }
                );
                
                // 获取系统状态
                const status = recognitionManagerRef.current.getStatus();
                setIsRecognitionSupported(status.isSupported);
                
                // 获取注册的命令
                const registeredCommands = recognitionManagerRef.current.getCommands();
                setCommands(registeredCommands);
                
                console.log('✅ 语音交互系统初始化完成');
                addLogMessage('语音交互系统初始化完成', 'success');
                
            } catch (error) {
                console.error('❌ 语音系统初始化失败:', error);
                addLogMessage(`初始化失败: ${error}`, 'error');
            }
        };
        
        initializeVoiceSystems();
        
        // 清理函数
        return () => {
            recognitionManagerRef.current?.dispose();
            speechManagerRef.current?.dispose();
        };
    }, []);
    
    /**
     * 添加识别结果
     */
    const addRecognitionResult = (text: string, confidence: number, command?: string) => {
        const result: RecognitionResult = {
            text,
            confidence,
            timestamp: Date.now(),
            command
        };
        
        setRecognitionResults(prev => [result, ...prev.slice(0, 19)]); // 保持最新20条
    };
    
    /**
     * 添加日志消息
     */
    const addLogMessage = (message: string, type: 'info' | 'success' | 'error' | 'game') => {
        console.log(`📝 [${type.toUpperCase()}] ${message}`);
    };
    
    /**
     * 切换语音识别
     */
    const toggleRecognition = async () => {
        if (!recognitionManagerRef.current) return;
        
        try {
            if (isRecognitionEnabled) {
                recognitionManagerRef.current.stopListening();
                setIsRecognitionEnabled(false);
                addLogMessage('语音识别已停止', 'info');
            } else {
                await recognitionManagerRef.current.startListening();
                setIsRecognitionEnabled(true);
                addLogMessage('语音识别已启动', 'success');
            }
        } catch (error) {
            addLogMessage(`操作失败: ${error}`, 'error');
        }
    };
    
    /**
     * 测试语音命令
     */
    const testVoiceCommand = (command: VoiceCommand) => {
        addLogMessage(`测试命令: ${command.command}`, 'info');
        speechManagerRef.current?.speak(`正在测试命令：${command.command}`, 'system');
        
        // 模拟命令执行
        setTimeout(() => {
            try {
                command.action();
                addLogMessage(`命令执行成功: ${command.description}`, 'success');
            } catch (error) {
                addLogMessage(`命令执行失败: ${error}`, 'error');
            }
        }, 1000);
    };
    
    /**
     * 测试神煞语音识别
     */
    const testShenshaRecognition = () => {
        const testShensha = ['天乙贵人', '羊刃', '文昌', '驿马'];
        const randomShensha = testShensha[Math.floor(Math.random() * testShensha.length)];
        
        addLogMessage(`模拟识别神煞: ${randomShensha}`, 'info');
        speechManagerRef.current?.speak(`模拟语音输入：${randomShensha}`, 'system');
        
        // 模拟识别结果
        setTimeout(() => {
            addRecognitionResult(randomShensha, 0.95, `选择神煞: ${randomShensha}`);
        }, 2000);
    };
    
    /**
     * 清空结果
     */
    const clearResults = () => {
        setRecognitionResults([]);
        setCurrentResult('');
        addLogMessage('已清空识别结果', 'info');
    };
    
    /**
     * 格式化时间
     */
    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    };
    
    /**
     * 获取命令分类
     */
    const getCommandsByCategory = (category: string) => {
        return commands.filter(cmd => cmd.category === category);
    };
    
    return (
        <div className={`voice-interaction-demo ${className}`}>
            <div className="demo-header">
                <h1>🎤 L-Zore语音交互系统演示</h1>
                <p>语音识别 + 语音合成 完整交互体验</p>
            </div>
            
            {/* 系统状态面板 */}
            <div className="status-panel">
                <h2>📊 系统状态</h2>
                <div className="status-grid">
                    <div className="status-item">
                        <span className="label">识别支持:</span>
                        <span className={`value ${isRecognitionSupported ? 'success' : 'error'}`}>
                            {isRecognitionSupported ? '✅ 支持' : '❌ 不支持'}
                        </span>
                    </div>
                    <div className="status-item">
                        <span className="label">识别状态:</span>
                        <span className={`value ${isRecognitionEnabled ? 'success' : 'warning'}`}>
                            {isRecognitionEnabled ? '🟢 启用' : '🔴 停用'}
                        </span>
                    </div>
                    <div className="status-item">
                        <span className="label">监听状态:</span>
                        <span className={`value ${isListening ? 'active' : 'inactive'}`}>
                            {isListening ? '🎤 监听中' : '🔇 待机'}
                        </span>
                    </div>
                    <div className="status-item">
                        <span className="label">注册命令:</span>
                        <span className="value">{commands.length} 个</span>
                    </div>
                </div>
            </div>
            
            {/* 控制面板 */}
            <div className="control-panel">
                <h2>🎛️ 控制面板</h2>
                <div className="control-buttons">
                    <button 
                        onClick={toggleRecognition}
                        className={`btn ${isRecognitionEnabled ? 'btn-danger' : 'btn-primary'}`}
                        disabled={!isRecognitionSupported}
                    >
                        {isRecognitionEnabled ? '🛑 停止识别' : '🎤 开始识别'}
                    </button>
                    
                    <button 
                        onClick={testShenshaRecognition}
                        className="btn btn-secondary"
                    >
                        🎴 测试神煞识别
                    </button>
                    
                    <button 
                        onClick={clearResults}
                        className="btn btn-outline"
                    >
                        🗑️ 清空结果
                    </button>
                </div>
                
                {/* 当前识别结果 */}
                {currentResult && (
                    <div className="current-result">
                        <h3>🗣️ 当前识别:</h3>
                        <div className="result-text">{currentResult}</div>
                    </div>
                )}
            </div>
            
            {/* 语音命令面板 */}
            <div className="commands-panel">
                <h2>📋 语音命令列表</h2>
                
                {['game', 'battle', 'system', 'voice'].map(category => {
                    const categoryCommands = getCommandsByCategory(category);
                    if (categoryCommands.length === 0) return null;
                    
                    const categoryNames = {
                        game: '🎮 游戏命令',
                        battle: '⚔️ 战斗命令', 
                        system: '🖥️ 系统命令',
                        voice: '🎤 语音命令'
                    };
                    
                    return (
                        <div key={category} className="command-category">
                            <h3>{categoryNames[category as keyof typeof categoryNames]}</h3>
                            <div className="command-grid">
                                {categoryCommands.map((command, index) => (
                                    <div key={index} className="command-card">
                                        <div className="command-header">
                                            <span className="command-name">{command.command}</span>
                                            <button 
                                                onClick={() => testVoiceCommand(command)}
                                                className="btn-test"
                                            >
                                                测试
                                            </button>
                                        </div>
                                        <div className="command-description">{command.description}</div>
                                        <div className="command-keywords">
                                            关键词: {command.keywords.join(', ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* 识别结果面板 */}
            <div className="results-panel">
                <h2>🎯 识别结果 ({recognitionResults.length})</h2>
                <div className="results-list">
                    {recognitionResults.length === 0 ? (
                        <div className="empty-state">
                            暂无识别结果，请开始语音识别...
                        </div>
                    ) : (
                        recognitionResults.map((result, index) => (
                            <div key={index} className="result-item">
                                <div className="result-header">
                                    <span className="result-time">{formatTime(result.timestamp)}</span>
                                    <span className="result-confidence">
                                        置信度: {(result.confidence * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="result-content">
                                    {result.command ? (
                                        <div className="command-result">
                                            <span className="command-label">命令:</span>
                                            <span className="command-text">{result.command}</span>
                                        </div>
                                    ) : (
                                        <div className="speech-result">
                                            <span className="speech-label">语音:</span>
                                            <span className="speech-text">{result.text}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <style jsx>{`
                .voice-interaction-demo {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .demo-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .demo-header h1 {
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                
                .demo-header p {
                    color: #7f8c8d;
                    font-size: 16px;
                }
                
                .status-panel, .control-panel, .commands-panel, .results-panel {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .status-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }
                
                .status-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 6px;
                }
                
                .status-item .label {
                    font-weight: 500;
                    color: #495057;
                }
                
                .status-item .value {
                    font-weight: bold;
                }
                
                .status-item .value.success { color: #28a745; }
                .status-item .value.error { color: #dc3545; }
                .status-item .value.warning { color: #ffc107; }
                .status-item .value.active { color: #17a2b8; }
                .status-item .value.inactive { color: #6c757d; }
                
                .control-buttons {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .btn-primary {
                    background: #007bff;
                    color: white;
                }
                
                .btn-primary:hover:not(:disabled) {
                    background: #0056b3;
                }
                
                .btn-danger {
                    background: #dc3545;
                    color: white;
                }
                
                .btn-danger:hover:not(:disabled) {
                    background: #c82333;
                }
                
                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }
                
                .btn-secondary:hover:not(:disabled) {
                    background: #545b62;
                }
                
                .btn-outline {
                    background: transparent;
                    color: #007bff;
                    border: 1px solid #007bff;
                }
                
                .btn-outline:hover:not(:disabled) {
                    background: #007bff;
                    color: white;
                }
                
                .current-result {
                    background: #e3f2fd;
                    border-left: 4px solid #2196f3;
                    padding: 15px;
                    border-radius: 6px;
                }
                
                .current-result h3 {
                    margin: 0 0 10px 0;
                    color: #1976d2;
                }
                
                .result-text {
                    font-size: 16px;
                    font-weight: 500;
                    color: #333;
                }
                
                .command-category {
                    margin-bottom: 25px;
                }
                
                .command-category h3 {
                    margin-bottom: 15px;
                    color: #495057;
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 8px;
                }
                
                .command-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 15px;
                }
                
                .command-card {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    padding: 15px;
                    transition: all 0.2s;
                }
                
                .command-card:hover {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transform: translateY(-1px);
                }
                
                .command-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .command-name {
                    font-weight: 600;
                    color: #495057;
                }
                
                .btn-test {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                }
                
                .btn-test:hover {
                    background: #218838;
                }
                
                .command-description {
                    color: #6c757d;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                
                .command-keywords {
                    font-size: 12px;
                    color: #868e96;
                    font-style: italic;
                }
                
                .results-list {
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .empty-state {
                    text-align: center;
                    color: #6c757d;
                    padding: 40px;
                    font-style: italic;
                }
                
                .result-item {
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    padding: 15px;
                    margin-bottom: 10px;
                    background: white;
                }
                
                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 12px;
                    color: #6c757d;
                }
                
                .result-confidence {
                    font-weight: 500;
                }
                
                .result-content {
                    font-size: 14px;
                }
                
                .command-result {
                    background: #d4edda;
                    border-left: 4px solid #28a745;
                    padding: 8px 12px;
                    border-radius: 4px;
                }
                
                .speech-result {
                    background: #cce5ff;
                    border-left: 4px solid #007bff;
                    padding: 8px 12px;
                    border-radius: 4px;
                }
                
                .command-label, .speech-label {
                    font-weight: 600;
                    margin-right: 8px;
                }
                
                .command-text, .speech-text {
                    color: #495057;
                }
            `}</style>
        </div>
    );
}; 