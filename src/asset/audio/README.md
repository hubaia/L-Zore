# L-Zore 音频资源目录结构说明

## 📁 目录结构概览

```
Audio/
├── BGM/                # 背景音乐 (Background Music)
│   ├── Theme/          # 主题音乐
│   ├── Battle/         # 战斗音乐
│   ├── Character/      # 人物主题音乐
│   ├── Environment/    # 环境音乐
│   └── Emotion/        # 情感音乐
├── SFX/                # 音效 (Sound Effects)
│   ├── UI/            # 界面音效
│   ├── Card/          # 卡牌音效
│   ├── Shensha/       # 神煞音效
│   └── Environment/   # 环境音效
└── Voice/              # 语音 (Voice)
    ├── Narrator/      # 旁白配音
    ├── Character/     # 角色配音
    └── AI/            # AI语音
```

## 🎵 音频标准

### 文件格式
- **BGM**: .ogg (循环播放，文件大小优化)
- **SFX**: .wav (高品质，快速响应)
- **Voice**: .mp3 (压缩率与质量平衡)

### 命名规范
- BGM文件：`BGM_[类型]_[名称].ogg`
- SFX文件：`SFX_[类型]_[名称].wav`
- Voice文件：`Voice_[类型]_[角色]_[内容].mp3`

### 音频参数
- **采样率**: 44.1kHz
- **位深度**: 16-bit
- **声道**: 立体声 (Stereo)
- **音量**: 标准化处理，避免削波

## 🎯 制作指南

详细的音乐制作指南请参考：
- [BGM风格设定.md](../BGM风格设定.md)
- [音效设定.md](../音效设定.md)

## 📝 更新记录

- 2024.12.19: 创建完整目录结构
- 2024.12.19: 建立音频标准和命名规范 