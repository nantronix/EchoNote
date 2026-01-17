# EchoNote

<p align="center">
  <strong>AI 驱动的会议笔记应用，支持实时转录和离线使用</strong>
</p>

<p align="center">
  <a href="https://github.com/nantronix/EchoNote/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-GPL--3.0-blue.svg" alt="License">
  </a>
</p>

## 简介

EchoNote 是一款 AI 驱动的智能会议笔记应用，基于 [Hyprnote](https://github.com/fastrepl/hyprnote) 开源项目开发。它能够实时转录会议内容，结合 AI 智能生成会议摘要，让你专注于会议本身，而不是埋头记笔记。

### 核心特性

- **实时转录** - 自动捕获并转录会议音频，支持多种语音识别引擎
- **无侵入式** - 直接监听电脑音频，无需机器人加入会议
- **AI 摘要** - 会议结束后，AI 自动生成个性化会议摘要
- **完全离线** - 支持本地模型（Ollama、LM Studio），可在离线环境运行
- **多模型支持** - 支持 OpenAI、Anthropic、**DeepSeek**、Mistral、Google Gemini 等多种 LLM
- **隐私优先** - 所有数据本地存储，你的会议内容完全由你掌控

### 新增功能

相比原版 Hyprnote，EchoNote 新增了以下功能：

- ✅ **DeepSeek API 支持** - 使用 DeepSeek 的语言模型进行摘要和对话
- 🚀 更多功能持续开发中...

## 安装

### macOS

```bash
# 从源码构建（见下方开发部分）
git clone git@github.com:nantronix/EchoNote.git
cd EchoNote
pnpm install
pnpm -F desktop tauri:dev
```

## 开发

### 环境要求

- Node.js >= 22
- pnpm 10.28.0
- Rust 1.92.0（通过 rust-toolchain.toml 自动管理）
- macOS 14.2+（桌面应用）

### 快速开始

```bash
# 安装依赖
pnpm install

# 构建 UI 组件
pnpm -F @echonote/ui build

# 启动桌面应用（开发模式）
pnpm -F desktop tauri:dev
```

### 常用命令

```bash
# 代码格式化
dprint fmt

# TypeScript 类型检查
pnpm -r typecheck

# Rust 编译检查
cargo check

# 代码检查
pnpm lint
```

## 系统要求

### 运行要求

- **macOS 14.2+** (Sonoma 或更新版本)

### 开发/编译要求

- Node.js >= 22
- pnpm 10.28.0
- Rust 1.92.0（通过 rust-toolchain.toml 自动管理）

## 语音转文字原理

EchoNote 采用多模式架构，支持**本地离线**和**云端**两种语音识别方式。

### 本地离线模式

基于 OpenAI 的 **Whisper** 语音识别模型，使用 [whisper.cpp](https://github.com/ggerganov/whisper.cpp) (C++ 实现) 通过 GGML 后端在本地运行。

**支持的本地模型：**

| 模型 | 大小 | 语言支持 |
|------|------|----------|
| Whisper Tiny | ~43MB | 英语 / 多语言 |
| Whisper Base | ~82MB | 英语 / 多语言 |
| Whisper Small | ~264MB | 英语 / 多语言 |
| Whisper Large Turbo | ~874MB | 100+ 语言 |
| Parakeet V2/V3 | - | 英语 / 25 语言 |

### 云端语音识别

支持 8 种主流云端语音识别服务（需要 API Key）：

- **Deepgram** - 实时流式转录，高准确率
- **OpenAI Whisper API** - OpenAI 官方语音服务
- **Azure Speech Services** - 微软认知服务
- **AWS Transcribe** - 亚马逊转录服务
- **AssemblyAI** - AI 驱动的语音转录
- **Gladia** - 实时语音 AI
- **ElevenLabs** - 语音 AI 平台
- **Soniox / Fireworks / Argmax** - 其他提供商

### 工作流程

```
┌─────────────────────────────────────────────────────────────┐
│  音频采集                                                    │
│  - 麦克风输入 / 扬声器输出 / 双通道混合                       │
└─────────────────┬───────────────────────────────────────────┘
                  │ 音频流
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  STT 引擎选择                                                │
│  - 本地 Whisper (离线)                                       │
│  - 云端 API (WebSocket 实时流)                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  转录结果                                                    │
│  - 实时文本 + 时间戳 + 说话人识别                            │
└─────────────────────────────────────────────────────────────┘
```

**核心特点：**
- **无侵入式** - 直接监听电脑音频，无需机器人加入会议
- **实时流式** - 音频边录制边转录，低延迟
- **双通道分离** - 分别识别麦克风（你说的）和扬声器（对方说的）
- **关键词增强** - 可设置专业术语提高识别准确率

## 技术栈

- **前端**: React 19, TailwindCSS 4, TanStack Query/Router/Form
- **桌面**: Tauri 2.9 (Rust)
- **语音识别**: Whisper (本地 whisper.cpp), Deepgram, Azure, AWS, OpenAI 等
- **AI 摘要**: Vercel AI SDK，支持 OpenAI、Anthropic、DeepSeek、Ollama 等

## 许可证

本项目基于 **GNU General Public License v3.0** (GPL-3.0) 开源。

- EchoNote Copyright (C) 2025-present
- 原始 Hyprnote Copyright (C) 2023-present Fastrepl, Inc.

详见 [LICENSE](./LICENSE) 文件。

## 致谢

EchoNote 是 [Hyprnote](https://github.com/fastrepl/hyprnote) 的 fork 版本，感谢 Fastrepl, Inc. 团队的出色工作。

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/nantronix">Nanhara Technologies</a>
</p>
