<p align="center">
  <h1 align="center">🇨🇳 通途 — 来华外国游客中国旅行指南</h1>
  <p align="center">
    <strong>面向来华外国游客的多语言旅行助手——航班、酒店、火车、签证、支付、交通，用你的语言回答。</strong>
  </p>
  <p align="center">
    基于 <a href="https://open.fly.ai/">FlyAI</a> 和 <a href="https://www.fliggy.com/">飞猪</a>。
  </p>
  <p align="center">
    <a href="https://clawhub.ai/jesse-tzx/tongtu-china-travel"><img src="https://img.shields.io/badge/clawhub-available-purple" alt="ClawHub"></a>
    <a href="https://github.com/jesse-tzx/tongtu-china-travel"><img src="https://img.shields.io/github/stars/jesse-tzx/tongtu-china-travel?style=social" alt="GitHub Stars"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"></a>
    <a href="https://github.com/jesse-tzx/tongtu-china-travel"><img src="https://img.shields.io/badge/version-0.3.4-orange" alt="Version"></a>
  </p>
</p>

---

## 通途是什么？

通途是一个 [Claude Code](https://docs.anthropic.com/en/docs/claude-code)、[OpenClaw](https://github.com/nicepkg/openclaw) 及其他兼容 agent 的 skill 插件。它帮助来华外国游客处理旅行的方方面面——从搜航班酒店，到了解签证政策、设置手机支付、市内交通出行。

**所有回答都会自动适配用户语言**——英语、韩语、日语等。

### 和 FlyAI 有什么区别？

- **FlyAI** 是旅行搜索工具——查询飞猪数据，返回原始结果
- **通途** 在 FlyAI 之上叠加旅行知识——签证规则、支付设置指南、交通攻略、城市攻略——并把 FlyAI 作为数据源

## 快速开始

### 第一步 — 安装 Skill

**OpenClaw / Claude Code（推荐）：**

```bash
npx skills add jesse-tzx/tongtu-china-travel
```

**Claude Code（手动）：**

```bash
git clone https://github.com/jesse-tzx/tongtu-china-travel.git
cp -r tongtu-china-travel/skills/tongtu-china-travel ~/.claude/skills/tongtu-china-travel
```

**ClawHub：**

```bash
clawhub install tongtu-china-travel
```

### 第二步 — 安装 CLI

通途需要 `flyai` CLI 工具来执行实时搜索：

```bash
npm i -g @fly-ai/flyai-cli
```

### 第三步 — 验证

```bash
flyai keyword-search --query "things to do in Beijing"
```

看到结构化 JSON 输出即表示安装成功。

### 第四步 — 试用

用任何语言提问——通途自动检测并回复：

> "I'm visiting Beijing for 5 days in October — what should I see and how do I pay for things?"

> "서울에서 상하이 가는 비행기 찾아주세요"

> "中国のビザは必要ですか？144時間トランジットを使いたいです"

## Web Demo

通途还有一个可运行的 Web Demo——基于 Claude API + FlyAI 的聊天界面。

### 前置条件

- Node.js 18+
- `flyai` CLI 全局安装（`npm i -g @fly-ai/flyai-cli`）
- Anthropic API Key（[点击申请](https://console.anthropic.com/)）

### 获取代码

```bash
git clone https://github.com/jesse-tzx/tongtu-china-travel.git
cd tongtu-china-travel
```

Demo 在 `demo/` 子目录下。

### 本地运行

```bash
cd demo
cp .env.local.example .env.local
# 在 .env.local 中添加你的 ANTHROPIC_API_KEY
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 开始对话。

### 部署到 Vercel

1. 将本仓库推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入——root directory 设为 `demo/`
3. 在 Vercel 中添加 `ANTHROPIC_API_KEY` 环境变量
4. 部署

## 功能

### 旅行搜索（基于 FlyAI）

| 搜索类型 | 示例查询 |
|---------|---------|
| 航班 | "Find flights from Tokyo to Shanghai next Monday" |
| 酒店 | "Hotels near West Lake in Hangzhou under 500 yuan" |
| 火车 | "High-speed train from Beijing to Xi'an, second class" |
| 景点 | "Top-rated attractions in Chengdu" |
| 万豪酒店 | "JW Marriott hotels in Shanghai" |

### 旅行知识库

| 主题 | 内容 |
|------|------|
| **签证** | 免签国家、144小时过境免签、签证类型、申请流程 |
| **支付** | 外国人支付宝和微信支付设置、信用卡、现金提示 |
| **通信** | eSIM vs 本地 SIM、运营商对比、国际 App 访问 |
| **交通** | 地铁、打车（滴滴）、城际高铁、机场接驳 |
| **行程规划** | 城市攻略、行程设计原则、季节推荐 |

## 工作原理

```
你用任意语言提问
      │
      ▼
┌─ ① 输入处理 ──────────────────────────────┐
│  检测语言 → 提取参数 → 城市名翻译为中文    │
└──────────────────┬────────────────────────┘
                   ▼
┌─ ② 意图路由 ──────────────────────────────┐
│  匹配 32 条路由规则 → 确定执行动作          │
└──────────────────┬────────────────────────┘
                   ▼
┌─ ③ 执行（双轨制）─────────────────────────┐
│  搜索类  → FlyAI CLI（飞猪实时数据）        │
│  知识类  → references/（25篇文档）          │
│  规划类  → 两者结合                         │
└──────────────────┬────────────────────────┘
                   ▼
┌─ ④ LLM 合成 ─────────────────────────────┐
│  理解原始数据 → 用你的语言重写 →            │
│  应用输出约束                               │
└──────────────────┬────────────────────────┘
                   ▼
        用你的语言回复
```

## 知识库结构

```
references/
├── flyai/            — CLI 命令文档
├── visa/             — 签证政策、免签过境、国家列表
├── payment/          — 支付宝、微信支付、支付概览
├── communications/   — eSIM、本地 SIM、网络连接
├── transport/        — 地铁、打车、城际交通、机场接驳
└── planning/         — 城市攻略、行程建议、季节指南
```

## 支持的语言

通途自动检测用户语言并适配回复。内置支持：

- 英语
- 韩语（합니다 敬语风格）
- 日语（です/ます 敬语风格）
- 其他语言通过翻译支持

城市和地名在内部搜索时翻译为中文，展示时翻译为用户语言。

## 前置条件

- Node.js（`flyai` CLI 需要）
- 兼容 skill 的 agent（Claude Code、OpenClaw 等）

## 贡献

本项目由 jesse-tzx 维护。欢迎贡献——尤其是：

- 更多城市攻略（`references/planning/city-guides/`）
- 语言适配改进
- 签证和支付政策更新

## 许可证

[MIT](LICENSE) — Copyright (c) 2026 jesse-tzx
