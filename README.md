<p align="center">
  <h1 align="center">🇨🇳 TongTu — China Travel Guide for Foreign Tourists</h1>
  <p align="center">
    <strong>A multilingual travel assistant for foreign tourists visiting China — flights, hotels, trains, visa, payment, and transport guidance in your language.</strong>
  </p>
  <p align="center">
    Powered by <a href="https://open.fly.ai/">FlyAI</a> and <a href="https://www.fliggy.com/">Fliggy</a>.
  </p>
  <p align="center">
    <a href="https://clawhub.ai/jesse-tzx/tongtu-china-travel"><img src="https://img.shields.io/badge/clawhub-available-purple" alt="ClawHub"></a>
    <a href="https://github.com/jesse-tzx/tongtu-china-travel"><img src="https://img.shields.io/github/stars/jesse-tzx/tongtu-china-travel?style=social" alt="GitHub Stars"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"></a>
    <a href="https://github.com/jesse-tzx/tongtu-china-travel"><img src="https://img.shields.io/badge/version-0.3.3-orange" alt="Version"></a>
  </p>
</p>

---

## What is TongTu?

TongTu is a skill for [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [OpenClaw](https://github.com/nicepkg/openclaw), and other skill-compatible agents. It helps foreign tourists navigate every aspect of traveling to China — from searching flights and hotels to understanding visa policies, setting up mobile payments, and getting around local transport.

**All responses are delivered in the user's language** — English, Korean, Japanese, and more.

### What makes it different from FlyAI?

- **FlyAI** is a travel search tool — it queries Fliggy's inventory and returns raw results
- **TongTu** layers travel knowledge on top — visa rules, payment setup guides, transport tips, city guides — and uses FlyAI as its data source

## Quick Start

### Step 1 — Install the Skill

**OpenClaw / Claude Code (recommended):**

```bash
npx skills add jesse-tzx/tongtu-china-travel
```

**Claude Code (manual):**

```bash
git clone https://github.com/jesse-tzx/tongtu-china-travel.git
cp -r tongtu-china-travel/skills/tongtu-china-travel ~/.claude/skills/tongtu-china-travel
```

**ClawHub:**

```bash
clawhub install tongtu-china-travel
```

### Step 2 — Install the CLI

TongTu requires the `flyai` CLI tool for real-time search:

```bash
npm i -g @fly-ai/flyai-cli
```

### Step 3 — Verify

```bash
flyai keyword-search --query "things to do in Beijing"
```

You should see structured JSON output. You're good to go.

### Step 4 — Try It

Ask in your language — TongTu detects and responds in kind:

> "I'm visiting Beijing for 5 days in October — what should I see and how do I pay for things?"

> "서울에서 상하이 가는 비행기 찾아주세요"

> "中国のビザは必要ですか？144時間トランジットを使いたいです"

## Web Demo

TongTu also has a runnable web demo — a chat interface powered by Claude API + FlyAI.

### Prerequisites

- Node.js 18+
- `flyai` CLI installed globally (`npm i -g @fly-ai/flyai-cli`)
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Get the Demo Code

```bash
git clone https://github.com/jesse-tzx/tongtu-china-travel.git
cd tongtu-china-travel
```

The demo is in the `demo/` subdirectory.

### Run Locally

```bash
cd demo
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.

### Deploy to Vercel

1. Push this repo to GitHub
2. Import into [Vercel](https://vercel.com) — set root directory to `demo/`
3. Add `ANTHROPIC_API_KEY` as an environment variable in Vercel
4. Deploy

## Capabilities

### Travel Search (via FlyAI)

| Search Type | Example Query |
|-------------|---------------|
| Flights | "Find flights from Tokyo to Shanghai next Monday" |
| Hotels | "Hotels near West Lake in Hangzhou under 500 yuan" |
| Trains | "High-speed train from Beijing to Xi'an, second class" |
| Attractions | "Top-rated attractions in Chengdu" |
| Marriott Hotels | "JW Marriott hotels in Shanghai" |

### Travel Knowledge Base

| Topic | What You'll Learn |
|-------|-------------------|
| **Visa** | Visa-free countries, 144-hour transit, visa types, application process |
| **Payment** | Alipay & WeChat Pay setup for foreigners, credit cards, cash tips |
| **Communications** | eSIM vs local SIM, carrier comparison, international app access |
| **Transport** | Metro, taxi (Didi), intercity trains, airport transfers |
| **Trip Planning** | City guides, itinerary principles, seasonal recommendations |

## How It Works

```
You ask in any language
      │
      ▼
┌─ ① Input Processing ───────────────────┐
│  Detect language → extract parameters   │
│  → translate city names to Chinese       │
└──────────────────┬─────────────────────┘
                   ▼
┌─ ② Intent Routing ─────────────────────┐
│  Match 32 routing rules →               │
│  determine execution action             │
└──────────────────┬─────────────────────┘
                   ▼
┌─ ③ Execution (Dual-Track) ─────────────┐
│  Search  → FlyAI CLI (live Fliggy data) │
│  Knowledge → references/ (25 docs)      │
│  Planning → both combined               │
└──────────────────┬─────────────────────┘
                   ▼
┌─ ④ LLM Synthesis ──────────────────────┐
│  Understand raw data → rewrite in your  │
│  language → apply output constraints    │
└──────────────────┬─────────────────────┘
                   ▼
        Response in your language
```

## Knowledge Base Structure

```
references/
├── flyai/            — CLI command documentation
├── visa/             — Visa policies, visa-free transit, country lists
├── payment/          — Alipay, WeChat Pay, payment overview
├── communications/   — eSIM, local SIM, connectivity
├── transport/        — Metro, taxi, intercity, airport transfers
└── planning/         — City guides, itinerary tips, seasonal guide
```

## Supported Languages

TongTu auto-detects the user's language and responds accordingly. Built-in support for:

- English
- Korean (합니다 style)
- Japanese (です/ます style)
- Other languages supported via translation

City and location names are translated to Chinese internally for accurate search results, then displayed in the user's language.

## Prerequisites

- Node.js (for `flyai` CLI)
- A skill-compatible agent (Claude Code, OpenClaw, etc.)

## Contributing

This project is maintained by jesse-tzx. Contributions welcome — especially:

- More city guides (`references/planning/city-guides/`)
- Language-specific improvements
- Updated visa and payment policy information

## License

[MIT](LICENSE) — Copyright (c) 2026 jesse-tzx
