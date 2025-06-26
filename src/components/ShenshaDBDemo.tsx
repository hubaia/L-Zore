/**
 * 神煞数据库演示组件
 * 展示完整的50种神煞数据库功能
 */
import React, { useState, useEffect } from 'react';
import { shenshaDB } from '../db/ShenshaDatabase';
import type { ShenshaRecord, BaziInput } from '../db/ShenshaDatabase';

const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const ShenshaDBDemo: React.FC = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allShensha, setAllShensha] = useState<ShenshaRecord[]>([]);
    const [filteredShensha, setFilteredShensha] = useState<ShenshaRecord[]>([]);
    const [matchingShensha, setMatchingShensha] = useState<ShenshaRecord[]>([]);
    const [statistics, setStatistics] = useState<any>(null);
    
    // 筛选条件
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedRarity, setSelectedRarity] = useState<string>('all');
    const [selectedElement, setSelectedElement] = useState<string>('all');
    
    // 八字输入
    const [bazi, setBazi] = useState<BaziInput>({
        year: { gan: '甲', zhi: '子' },
        month: { gan: '乙', zhi: '丑' },
        day: { gan: '丙', zhi: '寅' },
        hour: { gan: '丁', zhi: '卯' }
    });

    // 初始化数据库
    useEffect(() => {
        const initDB = async () => {
            try {
                setLoading(true);
                await shenshaDB.initialize();
                setIsInitialized(true);
                
                // 加载所有神煞
                const shensha = await shenshaDB.getAllShensha();
                setAllShensha(shensha);
                setFilteredShensha(shensha);
                
                // 获取统计信息
                const stats = await shenshaDB.getStatistics();
                setStatistics(stats);
                
                console.log('神煞数据库初始化完成', { 总数: shensha.length, 统计: stats });
            } catch (error) {
                console.error('数据库初始化失败:', error);
            } finally {
                setLoading(false);
            }
        };

        initDB();
    }, []);

    // 应用筛选条件
    useEffect(() => {
        if (!allShensha.length) return;

        let filtered = [...allShensha];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(s => s.category === selectedCategory);
        }

        if (selectedRarity !== 'all') {
            filtered = filtered.filter(s => s.rarity === selectedRarity);
        }

        if (selectedElement !== 'all') {
            filtered = filtered.filter(s => s.element === selectedElement);
        }

        setFilteredShensha(filtered);
    }, [allShensha, selectedCategory, selectedRarity, selectedElement]);

    // 查找八字对应神煞
    const findShenshaForBazi = async () => {
        try {
            setLoading(true);
            const matching = await shenshaDB.findShenshaForBazi(bazi);
            setMatchingShensha(matching);
            console.log('八字神煞查询结果:', matching);
        } catch (error) {
            console.error('神煞查询失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 更新八字
    const updateBazi = (pillar: keyof BaziInput, type: 'gan' | 'zhi', value: string) => {
        setBazi(prev => ({
            ...prev,
            [pillar]: {
                ...prev[pillar],
                [type]: value
            }
        }));
    };

    // 获取元素图标
    const getElementIcon = (element: string) => {
        const icons: { [key: string]: string } = {
            '火': '🔥', '水': '💧', '木': '🌲', '金': '💎', '土': '🏔️', '特殊': '✨'
        };
        return icons[element] || '❓';
    };

    // 获取类型图标
    const getTypeIcon = (category: string) => {
        const icons: { [key: string]: string } = {
            '吉星吉神': '🌟', '凶星凶神': '⚡', '特殊神煞': '🔮'
        };
        return icons[category] || '📜';
    };

    if (loading && !isInitialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">🔮</div>
                    <div className="text-white text-xl">正在初始化神煞数据库...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* 标题 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        🔮 L-Zore神煞数据库演示
                    </h1>
                    <p className="text-purple-200 text-lg">
                        完整的50种传统神煞IndexedDB数据库系统
                    </p>
                </div>

                {/* 统计信息 */}
                {statistics && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">📊 数据库统计</h2>
                        <div className="grid md:grid-cols-4 gap-4 text-center mb-6">
                            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg p-4">
                                <div className="text-2xl mb-2">📚</div>
                                <div className="text-white font-bold text-xl">{statistics.total}</div>
                                <div className="text-blue-200 text-sm">总神煞数</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg p-4">
                                <div className="text-2xl mb-2">🌟</div>
                                <div className="text-white font-bold text-xl">{statistics.byCategory['吉星吉神'] || 0}</div>
                                <div className="text-green-200 text-sm">吉星吉神</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-lg p-4">
                                <div className="text-2xl mb-2">⚡</div>
                                <div className="text-white font-bold text-xl">{statistics.byCategory['凶星凶神'] || 0}</div>
                                <div className="text-red-200 text-sm">凶星凶神</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded-lg p-4">
                                <div className="text-2xl mb-2">🔮</div>
                                <div className="text-white font-bold text-xl">{statistics.byCategory['特殊神煞'] || 0}</div>
                                <div className="text-purple-200 text-sm">特殊神煞</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* 八字查询 */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">🎯 八字神煞查询</h2>
                        
                        {/* 八字输入 */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {(['year', 'month', 'day', 'hour'] as const).map((pillar, index) => (
                                <div key={pillar} className="text-center">
                                    <div className="text-white text-sm mb-2">
                                        {['年柱', '月柱', '日柱', '时柱'][index]}
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={bazi[pillar].gan}
                                            onChange={(e) => updateBazi(pillar, 'gan', e.target.value)}
                                            className="flex-1 bg-purple-600/30 border border-purple-400/40 rounded px-2 py-1 text-white text-sm"
                                        >
                                            {TIANGAN.map(gan => (
                                                <option key={gan} value={gan} className="bg-purple-800">
                                                    {gan}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={bazi[pillar].zhi}
                                            onChange={(e) => updateBazi(pillar, 'zhi', e.target.value)}
                                            className="flex-1 bg-purple-600/30 border border-purple-400/40 rounded px-2 py-1 text-white text-sm"
                                        >
                                            {DIZHI.map(zhi => (
                                                <option key={zhi} value={zhi} className="bg-purple-800">
                                                    {zhi}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={findShenshaForBazi}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                        >
                            {loading ? '查询中...' : '🔍 查找神煞'}
                        </button>

                        {/* 查询结果 */}
                        {matchingShensha.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-white font-bold mb-3">
                                    ✨ 找到 {matchingShensha.length} 个神煞:
                                </h3>
                                <div className="space-y-3 max-h-64 overflow-y-auto border border-purple-400/30 rounded-lg p-3 bg-purple-600/10">
                                    {matchingShensha.map(shensha => (
                                        <div key={shensha.id} className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-white font-bold">
                                                    {getTypeIcon(shensha.category)} {shensha.name}
                                                </span>
                                                <span className="text-purple-200 text-xs">
                                                    {shensha.rarity} {getElementIcon(shensha.element)}
                                                </span>
                                            </div>
                                            <div className="text-purple-200 text-sm">
                                                {shensha.meaning}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 筛选控件 */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">🔧 神煞筛选</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white text-sm mb-2">按分类筛选:</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full bg-purple-600/30 border border-purple-400/40 rounded px-3 py-2 text-white"
                                >
                                    <option value="all" className="bg-purple-800">全部分类</option>
                                    <option value="吉星吉神" className="bg-purple-800">🌟 吉星吉神</option>
                                    <option value="凶星凶神" className="bg-purple-800">⚡ 凶星凶神</option>
                                    <option value="特殊神煞" className="bg-purple-800">🔮 特殊神煞</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white text-sm mb-2">按稀有度筛选:</label>
                                <select
                                    value={selectedRarity}
                                    onChange={(e) => setSelectedRarity(e.target.value)}
                                    className="w-full bg-purple-600/30 border border-purple-400/40 rounded px-3 py-2 text-white"
                                >
                                    <option value="all" className="bg-purple-800">全部稀有度</option>
                                    <option value="⭐" className="bg-purple-800">⭐ 普通</option>
                                    <option value="⭐⭐" className="bg-purple-800">⭐⭐ 稀有</option>
                                    <option value="⭐⭐⭐" className="bg-purple-800">⭐⭐⭐ 传说</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white text-sm mb-2">按五行筛选:</label>
                                <select
                                    value={selectedElement}
                                    onChange={(e) => setSelectedElement(e.target.value)}
                                    className="w-full bg-purple-600/30 border border-purple-400/40 rounded px-3 py-2 text-white"
                                >
                                    <option value="all" className="bg-purple-800">全部五行</option>
                                    <option value="火" className="bg-purple-800">🔥 火</option>
                                    <option value="水" className="bg-purple-800">💧 水</option>
                                    <option value="木" className="bg-purple-800">🌲 木</option>
                                    <option value="金" className="bg-purple-800">💎 金</option>
                                    <option value="土" className="bg-purple-800">🏔️ 土</option>
                                    <option value="特殊" className="bg-purple-800">✨ 特殊</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <div className="text-white font-bold text-lg">
                                筛选结果: {filteredShensha.length} 个神煞
                            </div>
                        </div>
                    </div>
                </div>

                {/* 神煞列表 */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-96 flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-6">📜 神煞详情</h2>
                    
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredShensha.map(shensha => (
                                <div
                                    key={shensha.id}
                                    className={`border rounded-lg p-4 transition-all duration-300 hover:scale-105 ${
                                        shensha.category === '吉星吉神' 
                                            ? 'bg-green-600/20 border-green-400/50'
                                            : shensha.category === '凶星凶神'
                                            ? 'bg-red-600/20 border-red-400/50'
                                            : 'bg-purple-600/20 border-purple-400/50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-white font-bold">
                                            {getTypeIcon(shensha.category)} {shensha.name}
                                        </h3>
                                        <div className="text-right">
                                            <div className="text-yellow-300 text-sm">{shensha.rarity}</div>
                                            <div className="text-gray-300 text-xs">
                                                {getElementIcon(shensha.element)} {shensha.element}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-gray-200 text-sm mb-3">
                                        <strong>查法:</strong> {shensha.lookupMethod}
                                    </div>

                                    <div className="text-gray-200 text-sm mb-3">
                                        <strong>含义:</strong> {shensha.meaning}
                                    </div>

                                    <div className="text-gray-200 text-sm mb-3">
                                        <strong>游戏效果:</strong> {shensha.gameEffect}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-orange-300 font-bold">
                                            威力: {shensha.power}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            shensha.type === 'auspicious' ? 'bg-green-600/30 text-green-200' :
                                            shensha.type === 'inauspicious' ? 'bg-red-600/30 text-red-200' :
                                            'bg-purple-600/30 text-purple-200'
                                        }`}>
                                            {shensha.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredShensha.length === 0 && (
                            <div className="flex items-center justify-center h-full text-gray-400 text-center">
                                <div>
                                    <div className="text-4xl mb-2">🔍</div>
                                    <div>没有找到符合条件的神煞</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShenshaDBDemo; 