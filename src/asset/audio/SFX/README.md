# SFX - 音效目录

## 🔊 目录说明

### 🎮 UI/ - 界面音效
**用途**：用户界面交互的音效反馈
**文件示例**：
- `SFX_UI_ButtonClick.wav` - 按钮点击音效
- `SFX_UI_ButtonHover.wav` - 按钮悬停音效
- `SFX_UI_MenuOpen.wav` - 菜单打开音效
- `SFX_UI_MenuClose.wav` - 菜单关闭音效
- `SFX_UI_TabSwitch.wav` - 标签页切换音效
- `SFX_UI_Confirm.wav` - 确认操作音效
- `SFX_UI_Cancel.wav` - 取消操作音效
- `SFX_UI_Error.wav` - 错误提示音效
- `SFX_UI_Success.wav` - 成功提示音效
- `SFX_UI_Notification.wav` - 通知音效

### 🃏 Card/ - 卡牌音效
**用途**：卡牌系统相关的音效
**文件示例**：
- `SFX_Card_Draw.wav` - 抽卡音效
- `SFX_Card_Place.wav` - 放置卡牌音效
- `SFX_Card_Flip.wav` - 翻转卡牌音效
- `SFX_Card_Shuffle.wav` - 洗牌音效
- `SFX_Card_Hover.wav` - 卡牌悬停音效
- `SFX_Card_Select.wav` - 选择卡牌音效
- `SFX_Card_Activate.wav` - 激活卡牌技能音效
- `SFX_Card_Combo.wav` - 卡牌组合音效
- `SFX_Card_DataFlow.wav` - 数据流动音效

### ⚡ Shensha/ - 神煞音效
**用途**：四柱神煞系统的特效音效
**吉神音效**：
- `SFX_Shensha_TianYi.wav` - 天乙贵人激活音效（温暖编钟和弦）
- `SFX_Shensha_WenChang.wav` - 文昌贵人激活音效（清脆古筝滑音）
- `SFX_Shensha_HuaGai.wav` - 华盖星激活音效（空灵洞箫长音）
- `SFX_Shensha_JinYu.wav` - 金舆贵人激活音效（富丽管弦和弦）
- `SFX_Shensha_HongLuan.wav` - 红鸾天喜激活音效
- `SFX_Shensha_TaoHua.wav` - 桃花星激活音效
- `SFX_Shensha_YiMa.wav` - 驿马星激活音效

**凶煞音效**：
- `SFX_Shensha_JieSha.wav` - 劫煞激活音效（不和谐电子失真）
- `SFX_Shensha_WangShen.wav` - 亡神激活音效（低沉战鼓震音）
- `SFX_Shensha_KongWang.wav` - 空亡激活音效（突然静默和回响）
- `SFX_Shensha_YangRen.wav` - 羊刃激活音效（尖锐金属碰撞）
- `SFX_Shensha_GuChen.wav` - 孤辰寡宿激活音效
- `SFX_Shensha_ZaiSha.wav` - 灾煞激活音效

**特殊神煞音效**：
- `SFX_Shensha_XueTang.wav` - 学堂词馆激活音效
- `SFX_Shensha_Fusion.wav` - 神煞融合音效
- `SFX_Shensha_Evolution.wav` - 神煞演化音效

### 🌍 Environment/ - 环境音效
**用途**：游戏世界环境的音效
**宇宙空间音效**：
- `SFX_Env_SpaceWind.wav` - 宇宙风声
- `SFX_Env_StarTwinkle.wav` - 星光闪烁音效
- `SFX_Env_WarpJump.wav` - 跃迁音效
- `SFX_Env_EngineHum.wav` - 飞船引擎声

**城市环境音效**：
- `SFX_Env_CityAmbient.wav` - 城市环境音
- `SFX_Env_TrafficFlow.wav` - 交通流音效
- `SFX_Env_DataStream.wav` - 数据流音效
- `SFX_Env_HologramBuzz.wav` - 全息影像音效

**技术环境音效**：
- `SFX_Env_ComputerHum.wav` - 计算机运行声
- `SFX_Env_ServerfarmBuzz.wav` - 服务器农场声
- `SFX_Env_DataCenter.wav` - 数据中心环境音
- `SFX_Env_AIProcessing.wav` - AI处理音效

**废料场环境音效**：
- `SFX_Env_MetalClank.wav` - 金属碰撞声
- `SFX_Env_MachineryWork.wav` - 机械工作声
- `SFX_Env_WeldingSpark.wav` - 焊接火花声
- `SFX_Env_Recycling.wav` - 回收处理声

## 🎯 制作要求

### 响应性
- 音效响应时间必须在50ms以内
- 支持音效的实时触发和停止
- 避免音效堆叠造成的音频混乱

### 动态变化
- 支持根据游戏状态调整音效强度
- 提供不同距离的音效版本（近距离/远距离）
- 支持音效的空间定位（左右声道）

### 文化融合
- 神煞音效必须体现传统文化元素
- 结合现代电子音效技术
- 保持与整体音乐风格的一致性

### 技术特性
- 快速加载和播放
- 低延迟响应
- 支持同时播放多个音效
- 音效衰减和混音处理

## 📊 技术规格

- **文件格式**: WAV (无损)
- **采样率**: 44.1kHz
- **位深度**: 16-bit
- **声道**: 单声道或立体声（根据用途）
- **时长**: 0.1-3秒（根据音效类型）
- **音量**: -18dB到-12dB之间
- **压缩**: 无压缩，保证音质和响应速度

## ⚡ 神煞音效设计原则

### 五行音色对应
- **金系神煞**: 金属质感、清脆明亮
- **木系神煞**: 有机质感、温和成长
- **水系神煞**: 流动质感、柔和渗透
- **火系神煞**: 爆发质感、热烈激昂
- **土系神煞**: 厚重质感、稳定包容

### 吉凶音效区分
- **吉神**: 和谐、温暖、上升的音调
- **凶煞**: 不和谐、紧张、下降的音调
- **中性**: 平衡、稳定的音调

### 激活层次
- **触发音效**: 神煞激活的瞬间音效
- **持续音效**: 神煞生效期间的环境音
- **消散音效**: 神煞效果结束的音效 