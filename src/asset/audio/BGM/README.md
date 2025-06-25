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
- 体现[元素]系统的世界观特色

## 📊 技术规格

- **文件格式**: OGG Vorbis
- **采样率**: 44.1kHz
- **比特率**: 192-320 kbps
- **声道**: 立体声
- **时长**: 2-5分钟（根据用途调整）
- **音量**: -12dB到-6dB之间，避免削波 