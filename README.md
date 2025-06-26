# 🌟 L-Zore 神煞卡牌战斗系统

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](package.json)
[![Chinese](https://img.shields.io/badge/Language-中文-red.svg)](README.md)

**融合传统命理学与赛博朋克的创新卡牌战斗游戏**

## 🎯 项目概述

L-Zore神煞卡牌战斗系统是一款基于大纲文件夹设定开发的创新卡牌游戏，完整实现了传统中华命理学的数字化转换，包括：

- **四柱八字系统**：年月日时的完整时间结构
- **50种神煞卡牌**：吉神、凶神、特殊神煞的完整体系  
- **八格战场布局**：对应四柱的空间战术系统
- **枚制中和机制**：基于8枚元素的精确战斗系统
- **公共卡池系统**：共享命运的战术博弈机制

## 🚀 技术特色

### 🎮 核心游戏机制
- ✅ **八字中和系统**：完整的8枚制伤害计算
- ✅ **神煞激活条件**：基于传统命理学的严格条件
- ✅ **五行相克系统**：金木水火土的完整克制关系
- ✅ **公共卡池机制**：属性分配与节奏重置
- ✅ **AI虚拟人格**：智能对手系统

### 💻 技术栈
- **前端框架**：原生JavaScript + HTML5 + CSS3
- **响应式设计**：支持PC和移动端
- **动画效果**：CSS3动画和过渡效果
- **游戏引擎**：自研轻量级卡牌游戏引擎

## 📦 安装与运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 快速开始
```bash
# 克隆项目
git clone https://github.com/your-username/L-Zore.git

# 进入项目目录
cd L-Zore

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🎮 游戏特色

### 🌟 创新机制
1. **传统文化数字化**
   - 完整的四柱八字系统
   - 50种传统神煞的准确实现
   - 五行相生相克的深度应用

2. **战术深度**
   - 八格战场的空间布局
   - 多维度的战术考量
   - 时间流转的动态影响

3. **教育价值**
   - 在游戏中学习传统命理学
   - 理解中华文化的深层智慧
   - 培养系统性思维能力

### 🎯 游戏模式
- **单人模式**：对战AI虚拟人格
- **练习模式**：学习神煞机制
- **挑战模式**：不同难度的AI对手

## 📖 文档与教程

### 📚 完整文档
- [游戏说明书](L-Zore游戏说明.md) - 详细的游戏规则和策略指南
- [大纲设定](大纲/) - 完整的世界观和系统设定
- [API文档](docs/api.md) - 开发者接口文档

### 🎓 学习资源
- [新手教程](docs/tutorial.md) - 零基础入门指南
- [高级策略](docs/advanced.md) - 进阶战术分析
- [传统文化背景](docs/culture.md) - 神煞系统的文化内涵

## 🏗️ 项目结构

```
L-Zore/
├── index.html                 # 主页面
├── src/                       # 源代码目录
│   ├── components/            # 游戏组件
│   │   └── LZoreGame.js      # 核心游戏逻辑
│   ├── app.css               # 样式文件
│   └── ...
├── 大纲/                      # 游戏设定文档
│   ├── 神煞种类.md            # 神煞系统设定
│   ├── 37-公共卡池系统设计.md  # 公共卡池机制
│   ├── 35-八格战斗布局系统设计.md # 战场布局
│   └── ...
├── L-Zore游戏说明.md          # 游戏说明文档
└── README.md                  # 项目说明
```

## 🎯 核心系统介绍

### 🃏 神煞卡牌系统
```javascript
// 神煞卡牌示例
{
    name: '天乙贵人',
    type: 'auspicious',
    element: 'metal',
    power: 4,
    cost: 2,
    rarity: '⭐⭐⭐',
    description: '最高吉星，避免厄运，遇事有人帮',
    effect: '保护己方4枚元素不被中和'
}
```

### 🏟️ 八格战场布局
```
对方阵营（AI虚拟人格）
┌─────┬─────┬─────┬─────┐
│ 年柱 │ 月柱 │ 日柱 │ 时柱 │ 天干
├─────┼─────┼─────┼─────┤
│ 年柱 │ 月柱 │ 日柱 │ 时柱 │ 地支
├─────┼─────┼─────┼─────┤
│ 年柱 │ 月柱 │ 日柱 │ 时柱 │ 地支
├─────┼─────┼─────┼─────┤
│ 年柱 │ 月柱 │ 日柱 │ 时柱 │ 天干
└─────┴─────┴─────┴─────┘
己方阵营（络尘）
```

### ⚖️ 枚制中和系统
- **8枚元素**：对应四柱八字的完整结构
- **中和威力**：1-8枚不等的神煞威力
- **获胜条件**：完全中和对方8枚元素

## 🌟 特色功能

### 🎭 神煞激活系统
基于传统命理学的严格条件：
- **五行组合**：特定元素的搭配要求
- **位置效应**：四柱位置的加成影响
- **时间因素**：大运流年的动态变化

### 🌊 公共卡池机制
创新的共享战术系统：
- **自动翻开**：每2回合自动翻开
- **主动翻开**：玩家可主动选择
- **属性分配**：吉神增益、凶神减损
- **节奏重置**：改变游戏时间节奏

## 🔧 开发指南

### 🛠️ 代码结构
```javascript
class LZoreGame {
    constructor() {
        this.player = { health: 8, board: [], hand: [] };
        this.opponent = { health: 8, board: [], hand: [] };
        this.publicPool = [];
        // ...
    }
    
    // 核心方法
    placeCard(position) { /* 放置卡牌 */ }
    calculateActiveGods() { /* 计算神煞激活 */ }
    processPublicPool() { /* 处理公共卡池 */ }
    // ...
}
```

### 🎨 UI组件
- **卡牌组件**：动态生成的神煞卡牌
- **战场组件**：八格布局的交互界面
- **状态栏**：实时显示游戏状态
- **日志系统**：记录战斗过程

## 🤝 贡献指南

欢迎为L-Zore项目做出贡献！

### 📝 贡献方式
1. **Bug报告**：发现问题请提交Issue
2. **功能建议**：提出新功能想法
3. **代码贡献**：提交Pull Request
4. **文档改进**：完善游戏说明和教程

### 🔄 开发流程
```bash
# Fork项目并克隆
git clone https://github.com/your-username/L-Zore.git

# 创建功能分支
git checkout -b feature/new-feature

# 提交更改
git commit -m "Add new feature"

# 推送到分支
git push origin feature/new-feature

# 创建Pull Request
```

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🏆 致谢

### 🎓 文化传承
感谢传统中华文化的深厚底蕴为本项目提供了丰富的内容基础。

### 👥 贡献者
- **项目创建者**：基于大纲设定的完整实现
- **文化顾问**：传统命理学的准确性保证
- **测试团队**：游戏平衡性和用户体验优化

### 🌟 特别鸣谢
- 传统命理学文献的研究资料
- 现代游戏设计理念的融合灵感
- 开源社区的技术支持

## 📞 联系我们

### 💬 社区交流
- **Issues**：[GitHub Issues](https://github.com/your-username/L-Zore/issues)
- **Discussions**：[GitHub Discussions](https://github.com/your-username/L-Zore/discussions)
- **Email**：lzore-dev@example.com

### 🌐 相关链接
- **在线体验**：[https://lzore-game.github.io](https://lzore-game.github.io)
- **文档站点**：[https://docs.lzore-game.com](https://docs.lzore-game.com)
- **社区论坛**：[https://community.lzore-game.com](https://community.lzore-game.com)

---

## 🌟 项目愿景

**让传统文化在数字时代焕发新的生命力**

L-Zore不仅是一款游戏，更是一次文化传承的创新实验。我们希望通过现代化的游戏形式，让更多人了解和喜爱中华传统文化，在娱乐中学习，在游戏中成长。

**愿每一次对战都成为智慧的碰撞，每一次选择都体现传统文化的魅力！** 

---

<div align="center">

**⭐ 如果您喜欢这个项目，请给我们一个Star！⭐**

[🎮 立即体验游戏](https://lzore-game.github.io) | [📚 查看文档](docs/) | [💬 加入社区](https://community.lzore-game.com)

</div>

## 🌟 最新更新：神煞数据库系统

### 📊 神煞数据库 (IndexedDB)
基于传统命理学的完整神煞数据库系统，使用IndexedDB本地存储。

**特性：**
- 50种传统神煞完整数据
- 三大分类：吉星吉神、凶星凶神、特殊神煞
- 完整的传统查法实现
- 多维度查询功能
- TypeScript类型安全

**核心文件：**
- `src/db/ShenshaDatabase.ts` - 主数据库类
- `src/components/ShenshaDBDemo.tsx` - 演示组件
- `src/db/README.md` - 详细文档

**使用方法：**
```typescript
import { shenshaDB } from './src/db/ShenshaDatabase';

// 初始化数据库
await shenshaDB.initialize();

// 查询神煞
const bazi = {
    year: { gan: '甲', zhi: '子' },
    month: { gan: '乙', zhi: '丑' },
    day: { gan: '丙', zhi: '寅' },
    hour: { gan: '丁', zhi: '卯' }
};

const matchingShensha = await shenshaDB.findShenshaForBazi(bazi);
```

**支持的神煞查法：**
- 天乙贵人：甲戊庚牛羊，乙己鼠猴乡...
- 文昌贵人：甲乙巳午报君知...
- 羊刃：甲刃卯，乙刃寅...
- 华盖：三合局见墓库
- 驿马：三合局对冲
- 将星：三合局旺位
- 魁罡：庚戌、庚辰、戊戌、壬辰四日柱
- 更多...

## 🎯 项目结构

### 核心游戏系统
- **主场景**: `src/scenes/LZoreGameScene.refactored.ts` - 主游戏场景
- **管理器系统**: `src/managers/` - 16个专业管理器
- **界面组件**: `src/components/` - React UI组件
- **路由系统**: `src/routes/` - 页面路由

### 构筑系统
- **三源融合**: 主角神煞 + 构筑器神煞 + 时间神煞
- **数据碎片**: 资源投入系统
- **八字配置**: 完整的天干地支配置

### 战斗系统
- **神煞卡牌**: 基于传统命理的卡牌效果
- **生命元素**: 五行元素系统
- **实时计算**: 基于八字的动态神煞生成

## 🚀 快速开始

1. **安装依赖**
```bash
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

3. **访问应用**
- 主页: `http://localhost:5173/`
- 构筑界面: `http://localhost:5173/deck-builder`
- 游戏场景: `http://localhost:5173/phaser-lzore`

## 📖 详细文档

- [神煞数据库说明](src/db/README.md)
- [游戏重构总结](L-Zore游戏重构第二阶段完成总结.md)
- [构筑系统说明](神煞构筑系统实现总结.md)
- [生命元素系统](神煞卡牌生命元素系统实现总结.md)

## 🎨 技术栈

- **前端框架**: React 18 + TypeScript
- **游戏引擎**: Phaser.js 3
- **数据库**: IndexedDB (浏览器本地)
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **类型安全**: 完整的TypeScript类型定义

## 🌟 特色功能

### 传统文化融合
- 基于正统命理学的神煞系统
- 完整的八字查法实现
- 传统文化的现代化表达

### 技术创新
- 16个专业管理器的模块化架构
- React-Phaser双向事件通信
- IndexedDB本地数据库系统
- 实时八字计算和神煞匹配

### 游戏体验
- 三源融合的构筑系统
- 多层次策略深度
- 美观的现代UI设计
- 流畅的动画效果

## 📊 项目状态

- ✅ 核心游戏系统重构完成
- ✅ 神煞数据库系统实现
- ✅ 三源融合构筑系统
- ✅ 生命元素系统
- ✅ React-Phaser集成
- 🚧 完整50种神煞数据录入
- 🚧 高级战斗系统
- 🔮 多人对战系统

---

**将传统文化与现代技术完美融合，为玩家带来独特的神煞卡牌游戏体验！** 🌟
