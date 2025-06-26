# L-Zore神煞数据库系统

基于IndexedDB的完整神煞数据库，包含50种传统神煞的完整数据和查询功能。

## 🌟 特性

### 📊 数据完整性
- **50种神煞**：完整收录传统命理学神煞
- **三大分类**：吉星吉神(20种)、凶星凶神(20种)、特殊神煞(10种)
- **多维度属性**：稀有度、五行、威力值、查法、含义、游戏效果

### 🔍 查询功能
- **按分类查询**：吉星吉神/凶星凶神/特殊神煞
- **按稀有度查询**：⭐/⭐⭐/⭐⭐⭐
- **按五行查询**：火/水/木/金/土/特殊
- **八字匹配查询**：根据完整八字查找符合条件的神煞

### 💾 存储技术
- **IndexedDB**：浏览器本地数据库
- **类型安全**：完整的TypeScript类型定义
- **性能优化**：多种索引支持快速查询

## 📋 数据结构

```typescript
interface ShenshaRecord {
    id: string;                    // 唯一标识
    name: string;                  // 神煞名称
    category: '吉星吉神' | '凶星凶神' | '特殊神煞';
    rarity: '⭐' | '⭐⭐' | '⭐⭐⭐';
    element: '火' | '水' | '木' | '金' | '土' | '特殊';
    power: number;                 // 威力值
    lookupMethod: string;          // 查法口诀
    meaning: string;               // 传统含义
    gameEffect: string;            // 游戏效果
    type: 'auspicious' | 'inauspicious' | 'special';
    detailedLookup: {
        method: string;            // 查法说明
        conditions: string[];      // 具体条件
        examples?: string[];       // 示例
    };
}
```

## 🚀 使用方法

### 1. 初始化数据库

```typescript
import { shenshaDB } from './db/ShenshaDatabase';

// 初始化数据库
await shenshaDB.initialize();
```

### 2. 基础查询

```typescript
// 获取所有神煞
const allShensha = await shenshaDB.getAllShensha();

// 按分类查询
const auspiciousShensha = await shenshaDB.getShenshaByCategory('吉星吉神');

// 按稀有度查询
const legendaryShensa = await shenshaDB.getShenshaByRarity('⭐⭐⭐');

// 按五行查询
const fireShensha = await shenshaDB.getShenshaByElement('火');
```

### 3. 八字神煞查询

```typescript
// 定义八字
const bazi = {
    year: { gan: '甲', zhi: '子' },
    month: { gan: '乙', zhi: '丑' },
    day: { gan: '丙', zhi: '寅' },
    hour: { gan: '丁', zhi: '卯' }
};

// 查找匹配的神煞
const matchingShensha = await shenshaDB.findShenshaForBazi(bazi);
```

### 4. 统计信息

```typescript
// 获取数据库统计
const stats = await shenshaDB.getStatistics();
console.log(stats);
// {
//     total: 14,
//     byCategory: { '吉星吉神': 8, '凶星凶神': 4, '特殊神煞': 2 },
//     byRarity: { '⭐': 2, '⭐⭐': 6, '⭐⭐⭐': 6 },
//     byElement: { '金': 2, '水': 2, '火': 4, '土': 2, '特殊': 2 }
// }
```

## 🎯 支持的神煞查法

### 吉星吉神类
1. **天乙贵人** - 甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位...
2. **文昌贵人** - 甲乙巳午报君知，丙戊申宫丁己鸡...
3. **禄神** - 甲禄寅、乙禄卯、丙戊禄巳...
4. **太极贵人** - 甲乙子午，丙丁卯酉...
5. **三奇贵人** - 天上三奇甲戊庚，地上三奇乙丙丁...

### 凶星凶神类
1. **羊刃** - 甲刃卯，乙刃寅，丙戊刃午...
2. **劫煞** - 申子辰见巳，亥卯未见申...
3. **亡神** - 申子辰见亥，亥卯未见寅...
4. **咸池** - 申子辰酉，亥卯未子...
5. **空亡** - 按日柱所在旬查法

### 特殊神煞类
1. **华盖** - 申子辰见辰，亥卯未见未...
2. **驿马** - 申子辰马在寅，寅午戌马在申...
3. **将星** - 申子辰见子，亥卯未见卯...
4. **魁罡** - 庚戌、庚辰、戊戌、壬辰四日柱

## 🔧 技术实现

### IndexedDB配置
- **数据库名称**：L-Zore-Shensha-DB
- **版本**：1
- **对象存储**：shensha
- **索引**：category, rarity, element, type, power

### 查法实现
每个神煞都有对应的查法检查函数：
- `checkTianyiGuiren()` - 天乙贵人查法
- `checkWenchang()` - 文昌贵人查法
- `checkLushen()` - 禄神查法
- `checkYangren()` - 羊刃查法
- `checkHuagai()` - 华盖查法
- `checkYima()` - 驿马查法
- 更多...

### 三合局判断
支持完整的三合局查法：
- 申子辰水局
- 亥卯未木局  
- 寅午戌火局
- 巳酉丑金局

## 📈 性能特点

- **快速查询**：多重索引支持，查询速度优化
- **内存友好**：按需加载，避免内存浪费
- **类型安全**：完整TypeScript支持
- **易于扩展**：模块化设计，方便添加新神煞

## 🎮 游戏集成

### 与构筑系统集成
```typescript
// 在构筑界面中使用
const enhancedBuilderBazi = applyFragmentEffects(builderBazi);
const builderCards = await shenshaDB.findShenshaForBazi(enhancedBuilderBazi);
```

### 与战斗系统集成
```typescript
// 在战斗中查找可用神煞
const availableShensha = await shenshaDB.findShenshaForBazi(playerBazi);
const activeShensha = availableShensha.filter(s => s.power > 2);
```

## 🌍 文化价值

这个数据库系统不仅是技术实现，更是对传统命理学文化的数字化传承：

- **准确性**：严格按照传统命理学查法实现
- **完整性**：涵盖主要神煞类型和查法
- **现代化**：用现代技术承载古老智慧
- **可扩展**：为未来添加更多神煞预留空间

## 📚 参考资料

- 《三命通会》神煞篇
- 《渊海子平》神煞论
- 《神峰通考》神煞集
- L-Zore项目神煞种类.md文档

---

**这个神煞数据库系统完美融合了传统命理学的深厚底蕴与现代技术的强大功能，为L-Zore游戏提供了坚实的文化和技术基础！** 🌟 