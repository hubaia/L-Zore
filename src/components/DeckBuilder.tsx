import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CARD_DATABASE } from '../constants/gameData';
import type { BaZi, LZoreCard } from '../types/gameTypes';
import { shenshaDB } from '../db/ShenshaDatabase';
import type { ShenshaRecord, BaziInput } from '../db/ShenshaDatabase';

// 扩展神煞记录类型，添加游戏所需字段
interface GameShenshaRecord extends ShenshaRecord {
    currentLifeElements?: number;
    maxLifeElements?: number;
    effect?: string;
}

/**
 * 天干地支选项
 */
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 数据碎片卡类型
 */
interface DataFragment {
    id: string;
    name: string;
    type: 'tiangan' | 'dizhi' | 'boost';
    value: string;
    cost: number;
    description: string;
    rarity: '普通' | '稀有' | '史诗' | '传说';
}

/**
 * 可用的数据碎片卡
 */
const DATA_FRAGMENTS: DataFragment[] = [
    // 天干碎片
    { id: 'frag_jia', name: '甲木碎片', type: 'tiangan', value: '甲', cost: 1, description: '强化日柱天干为甲', rarity: '普通' },
    { id: 'frag_yi', name: '乙木碎片', type: 'tiangan', value: '乙', cost: 1, description: '强化日柱天干为乙', rarity: '普通' },
    { id: 'frag_bing', name: '丙火碎片', type: 'tiangan', value: '丙', cost: 2, description: '强化日柱天干为丙', rarity: '稀有' },
    { id: 'frag_wu', name: '戊土碎片', type: 'tiangan', value: '戊', cost: 2, description: '强化日柱天干为戊', rarity: '稀有' },
    
    // 地支碎片
    { id: 'frag_zi', name: '子水碎片', type: 'dizhi', value: '子', cost: 1, description: '强化地支为子', rarity: '普通' },
    { id: 'frag_chou', name: '丑土碎片', type: 'dizhi', value: '丑', cost: 1, description: '强化地支为丑', rarity: '普通' },
    { id: 'frag_wei', name: '未土碎片', type: 'dizhi', value: '未', cost: 2, description: '强化地支为未', rarity: '稀有' },
    { id: 'frag_shen', name: '申金碎片', type: 'dizhi', value: '申', cost: 2, description: '强化地支为申', rarity: '稀有' },
    
    // 增强碎片
    { id: 'frag_boost_metal', name: '金元素增幅器', type: 'boost', value: 'metal', cost: 3, description: '金系神煞生命元素+1', rarity: '史诗' },
    { id: 'frag_boost_fire', name: '火元素增幅器', type: 'boost', value: 'fire', cost: 3, description: '火系神煞生命元素+1', rarity: '史诗' },
];

/**
 * 卡组构筑界面
 */
export const DeckBuilder: React.FC = () => {
    // 主角八字（固定）
    const [protagonistBazi] = useState<BaziInput>({
        year: { gan: '甲', zhi: '子' },
        month: { gan: '乙', zhi: '丑' },
        day: { gan: '丙', zhi: '寅' },
        hour: { gan: '丁', zhi: '卯' }
    });

    // 构筑器八字（可配置）
    const [builderBazi, setBuilderBazi] = useState<BaziInput>({
        year: { gan: '甲', zhi: '子' },
        month: { gan: '乙', zhi: '丑' },
        day: { gan: '丙', zhi: '寅' },
        hour: { gan: '丁', zhi: '卯' }
    });

    // 当前时间八字
    const [timeBazi, setTimeBazi] = useState<BaziInput>({
        year: { gan: '甲', zhi: '子' },
        month: { gan: '乙', zhi: '丑' },
        day: { gan: '丙', zhi: '寅' },
        hour: { gan: '丁', zhi: '卯' }
    });

    // 玩家资源
    const [playerResources, setPlayerResources] = useState(10);
    
    // 已投入的数据碎片
    const [investedFragments, setInvestedFragments] = useState<DataFragment[]>([]);
    
    // 构筑结果 - 使用新的数据库记录类型
    const [protagonistDeck, setProtagonistDeck] = useState<GameShenshaRecord[]>([]);
    const [builderDeck, setBuilderDeck] = useState<GameShenshaRecord[]>([]);
    const [timeDeck, setTimeDeck] = useState<GameShenshaRecord[]>([]);
    
    // 是否已构筑
    const [isBuilt, setIsBuilt] = useState(false);
    
    // 数据库初始化状态
    const [dbInitialized, setDbInitialized] = useState(false);

    // 初始化神煞数据库
    useEffect(() => {
        const initializeDB = async () => {
            try {
                await shenshaDB.initialize();
                setDbInitialized(true);
                console.log('神煞数据库初始化完成');
            } catch (error) {
                console.error('神煞数据库初始化失败:', error);
            }
        };

        initializeDB();
    }, []);

    /**
     * 计算当前时间的八字
     */
    const calculateTimeBazi = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hour = now.getHours();

        // 简化的时间八字计算（实际应该更复杂）
        const yearGanIndex = (year - 1984) % 10; // 从甲子年开始
        const yearZhiIndex = (year - 1984) % 12;
        const monthGanIndex = (month - 1) % 10;
        const monthZhiIndex = (month - 1) % 12;
        const dayGanIndex = day % 10;
        const dayZhiIndex = day % 12;
        const hourGanIndex = Math.floor(hour / 2) % 10;
        const hourZhiIndex = Math.floor(hour / 2) % 12;

        return {
            year: { gan: TIANGAN[yearGanIndex], zhi: DIZHI[yearZhiIndex] },
            month: { gan: TIANGAN[monthGanIndex], zhi: DIZHI[monthZhiIndex] },
            day: { gan: TIANGAN[dayGanIndex], zhi: DIZHI[dayZhiIndex] },
            hour: { gan: TIANGAN[hourGanIndex], zhi: DIZHI[hourZhiIndex] }
        };
    };

    // 定时更新时间八字
    useEffect(() => {
        const updateTimeBazi = () => {
            setTimeBazi(calculateTimeBazi());
        };
        
        updateTimeBazi();
        const timer = setInterval(updateTimeBazi, 60000); // 每分钟更新一次

        return () => clearInterval(timer);
    }, []);

    /**
     * 更新构筑器八字
     */
    const updateBuilderBazi = (pillar: keyof BaziInput, type: 'gan' | 'zhi', value: string) => {
        setBuilderBazi(prev => ({
            ...prev,
            [pillar]: {
                ...prev[pillar],
                [type]: value
            }
        }));
        setIsBuilt(false);
    };

    /**
     * 投入数据碎片
     */
    const investFragment = (fragment: DataFragment) => {
        if (playerResources >= fragment.cost) {
            setPlayerResources(prev => prev - fragment.cost);
            setInvestedFragments(prev => [...prev, fragment]);
            setIsBuilt(false);
        }
    };

    /**
     * 移除数据碎片
     */
    const removeFragment = (fragmentId: string) => {
        const fragment = investedFragments.find(f => f.id === fragmentId);
        if (fragment) {
            setPlayerResources(prev => prev + fragment.cost);
            setInvestedFragments(prev => prev.filter(f => f.id !== fragmentId));
            setIsBuilt(false);
        }
    };

    /**
     * 应用数据碎片效果到八字
     */
    const applyFragmentEffects = (baseBazi: BaziInput): BaziInput => {
        let modifiedBazi = { ...baseBazi };

        investedFragments.forEach(fragment => {
            if (fragment.type === 'tiangan') {
                // 修改日柱天干
                modifiedBazi.day.gan = fragment.value;
            } else if (fragment.type === 'dizhi') {
                // 修改时柱地支（可以扩展为更复杂的逻辑）
                modifiedBazi.hour.zhi = fragment.value;
            }
        });

        return modifiedBazi;
    };

    /**
     * 计算神煞生命元素（使用新数据库）
     */
    const calculateLifeElements = async (bazi: BaziInput): Promise<GameShenshaRecord[]> => {
        if (!dbInitialized) {
            return [];
        }

        try {
            // 使用新数据库查询符合条件的神煞
            const matchingShensha = await shenshaDB.findShenshaForBazi(bazi);
            
            // 应用数据碎片增强效果
            const enhancedShensha: GameShenshaRecord[] = matchingShensha.map(shensha => {
                const hasBoost = investedFragments.some(f => 
                    f.type === 'boost' && f.value === shensha.element
                );
                
                return {
                    ...shensha,
                    // 增强效果：力量+1
                    power: hasBoost ? shensha.power + 1 : shensha.power,
                    // 添加游戏所需的生命元素字段
                    currentLifeElements: shensha.power,
                    maxLifeElements: shensha.power,
                    effect: shensha.gameEffect
                };
            });

            return enhancedShensha;
        } catch (error) {
            console.error('神煞查询失败:', error);
            return [];
        }
    };

    /**
     * 执行构筑
     */
    const handleBuild = async () => {
        if (!dbInitialized) {
            console.error('数据库未初始化');
            return;
        }

        try {
            // 应用数据碎片效果
            const enhancedBuilderBazi = applyFragmentEffects(builderBazi);
            
            // 使用新数据库计算三个来源的神煞卡
            const protagonistCards = await calculateLifeElements(protagonistBazi);
            const builderCards = await calculateLifeElements(enhancedBuilderBazi);
            const timeCards = await calculateLifeElements(timeBazi);
            
            setProtagonistDeck(protagonistCards);
            setBuilderDeck(builderCards);
            setTimeDeck(timeCards);
            setIsBuilt(true);
            
            // 保存最终构筑结果到localStorage
            localStorage.setItem('playerBazi', JSON.stringify(enhancedBuilderBazi));
            localStorage.setItem('builtDeck', JSON.stringify(builderCards));
            localStorage.setItem('protagonistDeck', JSON.stringify(protagonistCards));
            localStorage.setItem('timeDeck', JSON.stringify(timeCards));
            
            console.log('构筑完成', {
                主角神煞: protagonistCards.length,
                构筑神煞: builderCards.length,
                时间神煞: timeCards.length
            });
        } catch (error) {
            console.error('构筑失败:', error);
        }
    };

    /**
     * 获取元素图标
     */
    const getElementIcon = (elementType: string) => {
        const icons: { [key: string]: string } = {
            '金': '💎',
            '木': '🌲', 
            '水': '💧',
            '火': '🔥',
            '土': '🏔️',
            '特殊': '✨'
        };
        return icons[elementType] || '✨';
    };

    /**
     * 获取元素中文名
     */
    const getElementName = (elementType: string) => {
        return elementType || '特';
    };

    /**
     * 获取稀有度颜色
     */
    const getRarityColor = (rarity: string) => {
        const colors: { [key: string]: string } = {
            '普通': 'text-gray-300 border-gray-400',
            '稀有': 'text-blue-300 border-blue-400',
            '史诗': 'text-purple-300 border-purple-400',
            '传说': 'text-yellow-300 border-yellow-400'
        };
        return colors[rarity] || 'text-gray-300 border-gray-400';
    };

    /**
     * 渲染神煞卡列表
     */
    const renderCardList = (cards: GameShenshaRecord[], title: string, subtitle: string) => (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-h-96 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 text-center">{title}</h3>
            <p className="text-purple-200 text-sm mb-4 text-center">{subtitle}</p>
            
            <div className="flex-1 overflow-y-auto">
                <div className="grid gap-3">
                    {cards.map(card => {
                        const hasLifeElements = (card.currentLifeElements || 0) > 0;
                        const elementIcon = card.element ? getElementIcon(card.element) : '❌';
                        const elementName = card.element ? getElementName(card.element) : '无';
                        
                        return (
                            <div 
                                key={card.id}
                                className={`p-3 rounded-lg border transition-all duration-300 ${
                                    hasLifeElements 
                                        ? 'bg-green-600/20 border-green-400/60' 
                                        : 'bg-gray-600/20 border-gray-400/40'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{card.name}</h4>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-lg">{elementIcon}</span>
                                            <span className="text-white text-sm">
                                                {card.currentLifeElements || 0}/{card.maxLifeElements || 0} {elementName}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {hasLifeElements && (
                                        <div className="text-xs text-green-300 font-bold">
                                            ✅ 激活
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {cards.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-400 text-center">
                        <div>
                            <div className="text-4xl mb-2">🌙</div>
                            <div>暂无神煞激活</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex items-start justify-center">
            {/* 背景装饰元素 */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-60 right-32 w-32 h-32 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-32 left-32 w-36 h-36 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
                <div className="absolute bottom-60 right-60 w-44 h-44 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-3000"></div>
            </div>
            
            {/* 主容器 - 水平居中布局 */}
            <div className="w-full max-w-6xl mx-auto px-4 py-8 relative z-10">
                {/* 主要内容区域 */}
                <div className="w-full">
                    {/* 标题 */}
                    <div className="text-center mb-8">
                        <h1 className="text-m font-bold text-white mb-4">
                            🏗️ 神煞构筑中枢
                        </h1>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                            <div className="bg-yellow-600/20 border border-yellow-400/40 rounded-lg px-4 py-2">
                                <span className="text-yellow-300 font-bold">💰 数据碎片: {playerResources}</span>
                            </div>
                            <div className="bg-blue-600/20 border border-blue-400/40 rounded-lg px-4 py-2">
                                <span className="text-blue-300 font-bold">🕐 {new Date().toLocaleTimeString('zh-CN')}</span>
                            </div>
                        </div>
                    </div>

                    {/* 三列配置区域 - 响应式网格 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* 主角八字神煞卡 */}
                        <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm border border-purple-400/40 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 text-center">
                                👤 主角神煞
                            </h2>
                            <p className="text-purple-200 text-sm mb-4 text-center">
                                固定角色背景八字
                            </p>
                            
                            {/* 主角八字显示 */}
                            <div className="bg-purple-600/20 rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    <div>
                                        <div className="text-purple-200 text-xs">年柱</div>
                                        <div className="text-white font-bold">{protagonistBazi.year.gan}{protagonistBazi.year.zhi}</div>
                                    </div>
                                    <div>
                                        <div className="text-purple-200 text-xs">月柱</div>
                                        <div className="text-white font-bold">{protagonistBazi.month.gan}{protagonistBazi.month.zhi}</div>
                                    </div>
                                    <div>
                                        <div className="text-purple-200 text-xs">日柱</div>
                                        <div className="text-white font-bold">{protagonistBazi.day.gan}{protagonistBazi.day.zhi}</div>
                                    </div>
                                    <div>
                                        <div className="text-purple-200 text-xs">时柱</div>
                                        <div className="text-white font-bold">{protagonistBazi.hour.gan}{protagonistBazi.hour.zhi}</div>
                                    </div>
                                </div>
                            </div>

                            {/* 主角神煞卡预览 */}
                            {isBuilt && renderCardList(protagonistDeck, "", "角色专属神煞")}
                        </div>

                        {/* 构筑器区域 */}
                        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm border border-orange-400/40 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 text-center">
                                🔧 神煞构筑器
                            </h2>
                            <p className="text-orange-200 text-sm mb-4 text-center">
                                可配置八字 + 数据碎片投入
                            </p>

                            {/* 八字配置 */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white mb-3">八字配置</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['year', 'month', 'day', 'hour'] as const).map((pillar, index) => (
                                        <div key={pillar} className="text-center">
                                            <div className="text-orange-200 text-xs mb-1">
                                                {['年柱', '月柱', '日柱', '时柱'][index]}
                                            </div>
                                            <div className="flex gap-1">
                                                <select
                                                    value={builderBazi[pillar].gan}
                                                    onChange={(e) => updateBuilderBazi(pillar, 'gan', e.target.value)}
                                                    className="flex-1 bg-orange-600/30 border border-orange-400/40 rounded px-2 py-1 text-white text-xs"
                                                >
                                                    {TIANGAN.map(gan => (
                                                        <option key={gan} value={gan} className="bg-orange-800">
                                                            {gan}
                                                        </option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={builderBazi[pillar].zhi}
                                                    onChange={(e) => updateBuilderBazi(pillar, 'zhi', e.target.value)}
                                                    className="flex-1 bg-orange-600/30 border border-orange-400/40 rounded px-2 py-1 text-white text-xs"
                                                >
                                                    {DIZHI.map(zhi => (
                                                        <option key={zhi} value={zhi} className="bg-orange-800">
                                                            {zhi}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 数据碎片投入 */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white mb-3">数据碎片投入</h3>
                                
                                {/* 已投入的碎片 */}
                                {investedFragments.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-orange-200 text-sm mb-2">已投入碎片:</h4>
                                        <div className="space-y-2">
                                            {investedFragments.map(fragment => (
                                                <div key={fragment.id} className="flex items-center justify-between bg-orange-600/20 rounded p-2">
                                                    <div>
                                                        <span className="text-white text-sm font-bold">{fragment.name}</span>
                                                        <span className="text-orange-200 text-xs ml-2">({fragment.cost}💰)</span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFragment(fragment.id)}
                                                        className="text-red-400 hover:text-red-300 text-xs"
                                                    >
                                                        ❌
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 可用碎片 */}
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {DATA_FRAGMENTS.map(fragment => {
                                        const canAfford = playerResources >= fragment.cost;
                                        const alreadyInvested = investedFragments.some(f => f.id === fragment.id);
                                        
                                        return (
                                            <div 
                                                key={fragment.id}
                                                className={`p-2 rounded border text-xs ${getRarityColor(fragment.rarity)} ${
                                                    canAfford && !alreadyInvested 
                                                        ? 'hover:bg-white/10 cursor-pointer' 
                                                        : 'opacity-50'
                                                }`}
                                                onClick={() => canAfford && !alreadyInvested && investFragment(fragment)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="font-bold">{fragment.name}</div>
                                                        <div className="text-xs opacity-80">{fragment.description}</div>
                                                    </div>
                                                    <div className="text-yellow-300 font-bold">
                                                        {fragment.cost}💰
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 构筑神煞卡预览 */}
                            {isBuilt && renderCardList(builderDeck, "", "构筑神煞卡")}
                        </div>

                        {/* 时间神煞卡 */}
                        <div className="bg-gradient-to-br from-green-600/20 to-cyan-600/20 backdrop-blur-sm border border-green-400/40 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 text-center">
                                🕐 时间神煞
                            </h2>
                            <p className="text-green-200 text-sm mb-4 text-center">
                                当前时间自动生成八字
                            </p>

                            {/* 时间八字显示 */}
                            <div className="bg-green-600/20 rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    <div>
                                        <div className="text-green-200 text-xs">年柱</div>
                                        <div className="text-white font-bold">{timeBazi.year.gan}{timeBazi.year.zhi}</div>
                                    </div>
                                    <div>
                                        <div className="text-green-200 text-xs">月柱</div>
                                        <div className="text-white font-bold">{timeBazi.month.gan}{timeBazi.month.zhi}</div>
                                    </div>
                                    <div>
                                        <div className="text-green-200 text-xs">日柱</div>
                                        <div className="text-white font-bold">{timeBazi.day.gan}{timeBazi.day.zhi}</div>
                                    </div>
                                    <div>
                                        <div className="text-green-200 text-xs">时柱</div>
                                        <div className="text-white font-bold">{timeBazi.hour.gan}{timeBazi.hour.zhi}</div>
                                    </div>
                                </div>
                                <div className="text-center mt-2">
                                    <span className="text-green-200 text-xs">
                                        实时更新 | {new Date().toLocaleString('zh-CN')}
                                    </span>
                                </div>
                            </div>

                            {/* 时间神煞卡预览 */}
                            {isBuilt && renderCardList(timeDeck, "", "时空神煞卡")}
                        </div>
                    </div>

                    {/* 构筑按钮 */}
                    <div className="text-center mb-8">
                        <button
                            onClick={handleBuild}
                            disabled={!dbInitialized}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-8 lg:px-12 rounded-xl shadow-lg transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300 text-lg"
                        >
                            {dbInitialized ? '🔮 启动多源构筑' : '⏳ 数据库初始化中...'}
                        </button>
                    </div>

                    {/* 神煞卡池展示区域 */}
                    {isBuilt && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 lg:p-6 mb-8">
                            <h2 className="text-xl lg:text-2xl font-bold text-white mb-6 text-center">
                                🃏 神煞卡池详情
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
                                {/* 主角神煞卡池 */}
                                <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-xl p-4 max-h-80 flex flex-col">
                                    <h3 className="text-lg font-bold text-white mb-3 text-center flex items-center justify-center gap-2">
                                        <span className="text-2xl">👤</span>
                                        主角神煞卡池
                                    </h3>
                                    <div className="flex-1 overflow-y-auto">
                                        <div className="space-y-3">
                                            {protagonistDeck.map(card => (
                                                <div key={`protagonist-${card.id}`} className="bg-purple-600/30 border border-purple-400/50 rounded-lg p-3 transition-all duration-300">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                                            {card.name}
                                                            <span className="text-green-400 text-xs">✅</span>
                                                        </h4>
                                                        <span className="text-purple-200 text-xs bg-purple-600/40 px-2 py-1 rounded">
                                                            {card.rarity}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-lg">{getElementIcon(card.element || '')}</span>
                                                        <span className="text-white text-sm">
                                                            {card.currentLifeElements}/{card.maxLifeElements} {getElementName(card.element || '')}
                                                        </span>
                                                        <span className="text-green-300 text-xs bg-green-600/30 px-1 py-0.5 rounded">
                                                            已激活
                                                        </span>
                                                    </div>
                                                    <div className="text-purple-200 text-xs bg-purple-600/20 rounded px-2 py-1">
                                                        {card.effect}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {protagonistDeck.length === 0 && (
                                            <div className="flex items-center justify-center h-full text-purple-300 text-center text-sm">
                                                <div>
                                                    <div className="text-3xl mb-2">🌙</div>
                                                    <div>当前八字未激活主角神煞</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 构筑神煞卡池 */}
                                <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl p-4 max-h-80 flex flex-col">
                                    <h3 className="text-lg font-bold text-white mb-3 text-center flex items-center justify-center gap-2">
                                        <span className="text-2xl">🔧</span>
                                        构筑神煞卡池
                                    </h3>
                                    <div className="flex-1 overflow-y-auto">
                                        <div className="space-y-3">
                                            {builderDeck.map(card => {
                                                const hasBoost = investedFragments.some(f => f.type === 'boost' && f.value === card.element);
                                                return (
                                                    <div key={`builder-${card.id}`} className="bg-orange-600/30 border border-orange-400/50 rounded-lg p-3 transition-all duration-300">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                                                {card.name}
                                                                <span className="text-green-400 text-xs">✅</span>
                                                            </h4>
                                                            <span className="text-orange-200 text-xs bg-orange-600/40 px-2 py-1 rounded">
                                                                {card.rarity}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-lg">{getElementIcon(card.element || '')}</span>
                                                            <span className="text-white text-sm">
                                                                {card.currentLifeElements}/{card.maxLifeElements} {getElementName(card.element || '')}
                                                            </span>
                                                            <span className="text-green-300 text-xs bg-green-600/30 px-1 py-0.5 rounded">
                                                                已激活
                                                            </span>
                                                            {/* 显示增强效果 */}
                                                            {hasBoost && (
                                                                <span className="text-yellow-300 text-xs bg-yellow-600/30 px-1 py-0.5 rounded">
                                                                    +1🔥
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-orange-200 text-xs bg-orange-600/20 rounded px-2 py-1">
                                                            {card.effect}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        
                                        {builderDeck.length === 0 && (
                                            <div className="flex items-center justify-center h-full text-orange-300 text-center text-sm">
                                                <div>
                                                    <div className="text-3xl mb-2">⚙️</div>
                                                    <div>当前配置未激活构筑神煞</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 时间神煞卡池 */}
                                <div className="bg-gradient-to-br from-green-600/20 to-cyan-600/20 rounded-xl p-4 max-h-80 flex flex-col">
                                    <h3 className="text-lg font-bold text-white mb-3 text-center flex items-center justify-center gap-2">
                                        <span className="text-2xl">🕐</span>
                                        时间神煞卡池
                                    </h3>
                                    <div className="flex-1 overflow-y-auto">
                                        <div className="space-y-3">
                                            {timeDeck.map(card => (
                                                <div key={`time-${card.id}`} className="bg-green-600/30 border border-green-400/50 rounded-lg p-3 transition-all duration-300">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                                            {card.name}
                                                            <span className="text-green-400 text-xs">✅</span>
                                                        </h4>
                                                        <span className="text-green-200 text-xs bg-green-600/40 px-2 py-1 rounded">
                                                            {card.rarity}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-lg">{getElementIcon(card.element || '')}</span>
                                                        <span className="text-white text-sm">
                                                            {card.currentLifeElements}/{card.maxLifeElements} {getElementName(card.element || '')}
                                                        </span>
                                                        <span className="text-green-300 text-xs bg-green-600/30 px-1 py-0.5 rounded">
                                                            已激活
                                                        </span>
                                                        <span className="text-green-200 text-xs bg-green-600/30 px-1 py-0.5 rounded">
                                                            ⏰天时
                                                        </span>
                                                    </div>
                                                    <div className="text-green-200 text-xs bg-green-600/20 rounded px-2 py-1">
                                                        {card.effect}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {timeDeck.length === 0 && (
                                            <div className="flex items-center justify-center h-full text-green-300 text-center text-sm">
                                                <div>
                                                    <div className="text-3xl mb-2">⏰</div>
                                                    <div>当前时间未激活时间神煞</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* 卡池统计 */}
                            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl p-4 mb-6">
                                <h3 className="text-lg font-bold text-white mb-3 text-center">📊 神煞激活统计</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl mb-1">👤</div>
                                        <div className="text-white font-bold">{protagonistDeck.length}</div>
                                        <div className="text-purple-200 text-sm">主角神煞</div>
                                        <div className="text-purple-300 text-xs">已激活数量</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl mb-1">🔧</div>
                                        <div className="text-white font-bold">{builderDeck.length}</div>
                                        <div className="text-orange-200 text-sm">构筑神煞</div>
                                        <div className="text-orange-300 text-xs">已激活数量</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl mb-1">🕐</div>
                                        <div className="text-white font-bold">{timeDeck.length}</div>
                                        <div className="text-green-200 text-sm">时间神煞</div>
                                        <div className="text-green-300 text-xs">已激活数量</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl mb-1">🃏</div>
                                        <div className="text-white font-bold">
                                            {protagonistDeck.length + builderDeck.length + timeDeck.length}
                                        </div>
                                        <div className="text-cyan-200 text-sm">总神煞数</div>
                                        <div className="text-cyan-300 text-xs">已激活数量</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 操作按钮区域 */}
                    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl bg-gradient-to-t from-purple-900/95 via-purple-900/80 to-transparent py-6 px-4">
                        <div className="w-full">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                {/* 构筑完成后的操作 */}
                                {isBuilt && (
                                    <Link
                                        to="/phaser-lzore"
                                        className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 lg:px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-green-400/50 backdrop-blur-sm"
                                    >
                                        🎮 进入战斗
                                    </Link>
                                )}

                                {/* 返回首页 */}
                                <Link
                                    to="/"
                                    className="inline-block bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 border-2 border-gray-400/50 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg"
                                >
                                    🏠 返回首页
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 底部留白，避免内容被固定按钮遮挡 */}
                    <div className="h-24"></div>
                </div>

                {/* 总卡池区域 - 桌面端 */}
                {isBuilt && (
                    <div className="hidden lg:block bg-gradient-to-br from-yellow-600/20 to-amber-600/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-4 mb-8">
                        <h3 className="text-lg font-bold text-white mb-2 text-center flex items-center justify-center gap-2">
                            <span className="text-2xl">🎴</span>
                            总卡池
                        </h3>
                        <div className="text-center text-yellow-200 text-xs mb-3">
                            总计: {[...protagonistDeck, ...builderDeck, ...timeDeck].length} 张 
                            (👤{protagonistDeck.length} + 🔧{builderDeck.length} + 🕐{timeDeck.length})
                        </div>
                        
                        {/* 卡池内容 */}
                        <div className="max-h-96 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {[...protagonistDeck, ...builderDeck, ...timeDeck].map((card, index) => (
                                    <div key={`desktop-total-${card.id}-${index}`} className="bg-yellow-600/30 border border-yellow-400/50 rounded-lg p-3 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                                {card.name}
                                                <span className="text-green-400 text-xs">✅</span>
                                            </h4>
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-200 text-xs bg-yellow-600/40 px-2 py-1 rounded">
                                                    {card.rarity}
                                                </span>
                                                {protagonistDeck.includes(card) && (
                                                    <span className="text-purple-200 text-xs bg-purple-600/40 px-1 py-0.5 rounded">👤</span>
                                                )}
                                                {builderDeck.includes(card) && (
                                                    <span className="text-orange-200 text-xs bg-orange-600/40 px-1 py-0.5 rounded">🔧</span>
                                                )}
                                                {timeDeck.includes(card) && (
                                                    <span className="text-green-200 text-xs bg-green-600/40 px-1 py-0.5 rounded">🕐</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">{getElementIcon(card.element || '')}</span>
                                            <span className="text-white text-sm">
                                                {card.currentLifeElements}/{card.maxLifeElements} {getElementName(card.element || '')}
                                            </span>
                                            <span className="text-green-300 text-xs bg-green-600/30 px-1 py-0.5 rounded">
                                                已激活
                                            </span>
                                        </div>
                                        <div className="text-yellow-200 text-xs bg-yellow-600/20 rounded px-2 py-1">
                                            {card.effect}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {[...protagonistDeck, ...builderDeck, ...timeDeck].length === 0 && (
                                <div className="flex items-center justify-center h-40 text-yellow-300 text-center text-sm">
                                    <div>
                                        <div className="text-3xl mb-2">🌙</div>
                                        <div>暂无激活的神煞卡牌</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 总卡池区域 - 移动端 */}
                {isBuilt && (
                    <div className="lg:hidden bg-gradient-to-br from-yellow-600/20 to-amber-600/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-4 mb-8">
                        <h3 className="text-lg font-bold text-white mb-2 text-center flex items-center justify-center gap-2">
                            <span className="text-2xl">🎴</span>
                            总卡池
                        </h3>
                        <div className="text-center text-yellow-200 text-xs mb-3">
                            总计: {[...protagonistDeck, ...builderDeck, ...timeDeck].length} 张 
                            (👤{protagonistDeck.length} + 🔧{builderDeck.length} + 🕐{timeDeck.length})
                        </div>
                        
                        {/* 可折叠的卡池内容 */}
                        <details className="group">
                            <summary className="cursor-pointer bg-yellow-600/30 rounded-lg p-2 text-center text-white font-bold mb-3 group-open:mb-3">
                                🔽 展开查看卡牌详情 ({[...protagonistDeck, ...builderDeck, ...timeDeck].length}张)
                            </summary>
                            <div className="max-h-60 overflow-y-auto">
                                <div className="space-y-3">
                                    {[...protagonistDeck, ...builderDeck, ...timeDeck].map((card, index) => (
                                        <div key={`mobile-total-${card.id}-${index}`} className="bg-yellow-600/30 border border-yellow-400/50 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                                    {card.name}
                                                    <span className="text-green-400 text-xs">✅</span>
                                                </h4>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-200 text-xs bg-yellow-600/40 px-2 py-1 rounded">
                                                        {card.rarity}
                                                    </span>
                                                    {protagonistDeck.includes(card) && (
                                                        <span className="text-purple-200 text-xs bg-purple-600/40 px-1 py-0.5 rounded">👤</span>
                                                    )}
                                                    {builderDeck.includes(card) && (
                                                        <span className="text-orange-200 text-xs bg-orange-600/40 px-1 py-0.5 rounded">🔧</span>
                                                    )}
                                                    {timeDeck.includes(card) && (
                                                        <span className="text-green-200 text-xs bg-green-600/40 px-1 py-0.5 rounded">🕐</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">{getElementIcon(card.element || '')}</span>
                                                <span className="text-white text-sm">
                                                    {card.currentLifeElements}/{card.maxLifeElements} {getElementName(card.element || '')}
                                                </span>
                                                <span className="text-green-300 text-xs bg-green-600/30 px-1 py-0.5 rounded">
                                                    已激活
                                                </span>
                                            </div>
                                            <div className="text-yellow-200 text-xs bg-yellow-600/20 rounded px-2 py-1">
                                                {card.effect}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {[...protagonistDeck, ...builderDeck, ...timeDeck].length === 0 && (
                                    <div className="flex items-center justify-center h-20 text-yellow-300 text-center text-sm">
                                        <div>
                                            <div className="text-2xl mb-1">🌙</div>
                                            <div>暂无激活的神煞卡牌</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}; 