# BGM - 背景音乐目录

## 🎵 目录说明

### 📁 Theme/ - 主题音乐
**用途**：游戏的主要主题音乐和核心音乐主题
**文件示例**：
- `BGM_Theme_DataSamsara.ogg` - 主题曲《数据轮回》
- `BGM_Theme_LiuGuangEternal.ogg` - 友谊主题《流光永恒》
- `BGM_Theme_Opening.ogg` - 开场主题音乐
- `BGM_Theme_Ending.ogg` - 结局主题音乐

### ⚔️ Battle/ - 战斗音乐
**用途**：四柱神煞战斗系统和各种对战场景的音乐
**文件示例**：
- `BGM_Battle_SiZhu.ogg` - 四柱神煞战斗主题《天干地支》
- `BGM_Battle_VirtualPersona.ogg` - 虚拟人格对抗音乐
- `BGM_Battle_Enterprise.ogg` - 企业守护者战斗音乐
- `BGM_Battle_Government.ogg` - 政府守护者战斗音乐
- `BGM_Battle_AI.ogg` - AI守护者战斗音乐

**✅ 已集成文件**：
- `BGM_Virtual_Personality_Confrontation.mp3` - **当前使用的战斗BGM**

### 👤 Character/ - 人物主题音乐
**用途**：每个重要角色的专属主题音乐
**文件示例**：
- `BGM_Char_LiuGuang.ogg` - AI-流光主题《光与数据的舞蹈》
- `BGM_Char_MoRanQiu.ogg` - 墨染秋/染千秋主题《师者轮回》
- `BGM_Char_SarahTitan.ogg` - 莎拉·泰坦主题《企业女王》
- `BGM_Char_ColdCrow.ogg` - 代号寒鸦主题《多重身份》
- `BGM_Char_ZeroTech.ogg` - 零号技师主题《技术民主》
- `BGM_Char_XiaoYu.ogg` - 小雨主题《人文关怀》
- `BGM_Char_Nightingale.ogg` - 夜莺主题《反抗之歌》

### 🌍 Environment/ - 环境音乐
**用途**：不同场景和环境的背景音乐
**文件示例**：
- `BGM_Env_SpaceVoid.ogg` - 宇宙空间音乐《虚无与永恒》
- `BGM_Env_CyberCity.ogg` - 赛博城市音乐《数字脉搏》
- `BGM_Env_Scrapyard.ogg` - 废料场音乐《重生之地》
- `BGM_Env_CorpTower.ogg` - 企业大厦音乐《效率机器》
- `BGM_Env_Underground.ogg` - 地下基地音乐
- `BGM_Env_NeutralZone.ogg` - 中立区音乐

### 💭 Emotion/ - 情感音乐
**用途**：表达特定情感状态和剧情氛围的音乐
**文件示例**：
- `BGM_Emotion_Farewell.ogg` - 《流光的告别》- 悲伤与失去
- `BGM_Emotion_Rebirth.ogg` - 《数据的新生》- 希望与重生
- `BGM_Emotion_Choice.ogg` - 《选择的重量》- 紧张与冲突
- `BGM_Emotion_Philosophy.ogg` - 《永恒的问题》- 哲学与思辨
- `BGM_Emotion_Friendship.ogg` - 友谊与温暖
- `BGM_Emotion_Sacrifice.ogg` - 牺牲与崇高

## 🎯 制作要求

### 循环特性
- 所有BGM必须支持无缝循环播放
- 开头和结尾需要精确匹配，避免音频跳跃
- 循环点应选择在音乐的自然段落

### 动态分层
- 支持根据游戏状态动态添加/移除音乐层次
- 提供不同强度版本（轻柔版、标准版、激烈版）
- 支持实时音量和音色调整

### 文化特色
- 体现传统中华音乐元素与现代电子音乐的融合
- 运用五行音乐理论指导音乐创作
- 体现元素系统的世界观特色

## 📊 技术规格

- **文件格式**: OGG Vorbis / MP3
- **采样率**: 44.1kHz
- **比特率**: 192-320 kbps
- **声道**: 立体声
- **时长**: 2-5分钟（根据用途调整）
- **音量**: -12dB到-6dB之间，避免削波

## 🎮 游戏集成功能

### 🎵 已实现功能

#### 📦 音频加载系统
- ✅ 自动预加载BGM文件
- ✅ 错误处理和回退机制
- ✅ 支持MP3格式（兼容性考虑）

#### 🎛️ 音频控制
- ✅ **M键**: 快速切换音乐静音/开启
- ✅ 音量控制: 背景音乐默认40%，总音量70%
- ✅ 循环播放: 自动无缝循环
- ✅ 状态提示: 切换时显示音频状态

#### 🎼 当前播放
- 🎵 **BGM_Virtual_Personality_Confrontation.mp3**
- 🔄 循环播放模式
- 🔊 适中音量，不干扰游戏体验

### 🚧 待开发功能

#### 🎵 音效系统
```typescript
// 计划中的音效
- card_draw.wav     // 抽卡音效
- card_place.wav    // 放置卡牌音效
- shensha_trigger.wav // 神煞激活音效
- victory.wav       // 胜利音效
- defeat.wav        // 失败音效
```

#### 🎚️ 高级音频控制
- [ ] 音量滑块控制
- [ ] 背景音乐/音效分离控制
- [ ] 音频淡入淡出效果
- [ ] 根据游戏状态动态切换BGM

#### 🎯 动态音乐系统
- [ ] 战斗强度自适应音乐
- [ ] 神煞激活时的音乐层次叠加
- [ ] 不同环境的BGM自动切换
- [ ] 角色主题音乐播放

## 🎵 使用说明

### 🎮 玩家控制
1. **游戏启动**: 自动播放虚拟人格对抗BGM
2. **音乐控制**: 按 **M键** 切换静音/开启
3. **音量提示**: 状态变化时会显示提示信息

### 🔧 开发者说明
- 音频文件放置在 `src/asset/audio/BGM/Battle/` 目录
- 使用Phaser 3音频系统，支持Web Audio API
- 错误处理确保音频问题不影响游戏进行
- 预留了音效系统的扩展接口

### ⚠️ 注意事项
- 某些浏览器需要用户交互后才能播放音频
- 开发环境中请确保音频文件路径正确
- 建议使用支持Web Audio API的现代浏览器

## 📝 更新记录

- **2024.12.19**: ✅ 集成BGM_Virtual_Personality_Confrontation背景音乐
- **2024.12.19**: ✅ 添加M键音频控制功能
- **2024.12.19**: ✅ 实现循环播放和音量控制
- **2024.12.19**: 🚧 预留音效系统接口（待实现） 