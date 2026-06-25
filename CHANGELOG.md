# Changelog

All notable changes to the TongTu skill are documented in this file.

---

## [Unreleased]

---

## [0.3.0] — 2026-06-25

### Planning Knowledge Base Expansion

- **Expanded city coverage from 1 to 10 cities** with comprehensive guides for foreign tourists:
  - Existing: Beijing (updated)
  - New: Shanghai, Chengdu, Chongqing, Datong, Guangzhou, Hangzhou, Nanjing, Shenzhen, Xi'an
- Each city guide follows consistent structure: TL;DR (5 fields), city orientation, attractions (Tier 1/2), food & dining, logistics, day trips.
- All guides include practical constraints: booking requirements, timing, transport, seasonal advice.

### `itinerary-principles.md` Enhancements

- **Reservation table expanded from 5 → 20 attractions** with Alipay-first booking guidance (24 Alipay references).
- **High-speed rail connections** added for new city pairs: Shanghai→Nanjing, Guangzhou→Shenzhen, Chengdu→Leshan, Chengdu→Emei Mountain, Xi'an→Huashan.
- **Closure day rules** now include comprehensive museum list (15 museums named) with explicit Monday closure policy.
- **Alipay as primary booking method** throughout; WeChat mini-programs and official websites as backup.

### `seasonal-guide.md` Enhancements

- **Canton Fair warning** for Guangzhou (April & October): 5-star impact rating, specific dates (Apr 15-19, 23-27; Oct 15-19, 23-27), hotel price surge 2-3×, Shenzhen alternative.
- **"Three furnaces" heat warnings** for Chongqing, Nanjing, Wuhan (July-August, 38°C+ extreme heat).
- **City-specific best/worst times** for all 10 cities with detailed weather patterns and seasonal constraints.
- **Datong AQI warning** for coal region air quality before outdoor sightseeing.
- **Clothing recommendations** updated with city-specific notes (Chongqing grip for steep terrain, Datong sandstorms in March).

### Verified Improvements (83 test cases)

| Test Category | Count | Pass Rate |
|---------------|:-----:|:---------:|
| File integrity | 21 | 100% |
| Routing accuracy | 14 | 100% |
| Content quality | 30 | 100% |
| Multilingual routing | 12 | 100% |
| flyai CLI integration | 6 | 100% |
| **Total** | **83** | **100%** |

---

## [0.2.0] — 2026-06-14

### Routing Overhaul

- **Removed `keyword-search`** from all routing paths. Replaced by `ai-search` (discovery, comparison, recommendations) and `search-poi` (structured attraction queries).
  - `keyword-search` was a Fliggy product search engine — useful for tour package SKUs but poor for the travel advice TongTu users need.
  - Eliminated URL leakage risk from `jumpUrl` fields being actively rendered by the model.
- **Added 5 `ai-search` routing entries**: attraction comparison, activity/route discovery, food & dining, general discovery, complex trip planning with constraints.
- **Enhanced trip planning pipeline** to a 5-step flow: itinerary-principles → seasonal-guide → city-guide → flyai structured commands → ai-search for complex constraints.

### `search-poi` Routing Precision

- Split the single catch-all `search-poi` route into 4 intent-specific routes:
  - Specific attraction name → `--keyword`
  - Attraction type/category (e.g. "museums") → `--category` (exact enum filter)
  - Top-rated / 5A attractions → `--poi-level 5`
  - General discovery → no filter (city hotspots)
- Added 3 attraction output templates (A: category, B: specific, C: discovery table) with `freePoiStatus` and `poiLevel` display.

### Global Output Rules

- **New `flyai Output Rules` section** (MANDATORY, applies to ALL flyai commands):
  1. **URL blocking** — covers all formats: JSON fields (`jumpUrl`/`detailUrl`), markdown hyperlinks (`a.feizhu.com`/`fliggy.com`), and plain text URLs.
  2. **Chinese params** — all flyai command parameters must be in Chinese (previously only applied to `keyword-search`).
  3. **Description compression** — max 2-3 sentences for any attraction/hotel description from flyai.
- **New `ai-search Output Processing` template**: treat output as reference material, strip URLs, rewrite in own voice, cross-reference knowledge base (reservation requirements, closure days, seasonal advice, transport tips).

### Structure Cleanup

- Slimmed `CRITICAL` section from 10 lines of mixed content to a 2-line pure meta-rule.
- `Routing table` is now the single source of truth for all intent→action mapping (no duplication with CRITICAL).
- Deleted `keyword-search language rule` section (Chinese param rule moved to global rules).
- Removed redundant URL blocking lines from `Price Handling` and `Display Rules` (covered by global rules).

### Iteration 2 — 2026-06-14 (later)

- Inlined trip planning pipeline back into routing table (removed standalone section).
- Clarified "General attraction discovery" intent: added "when no city guide exists".
- Clarified "General discovery / vague intent": added "no city specified".
- Complex trip planning now validates against full pipeline steps 1-4 (not just `itinerary-principles.md`).

### Verified Improvements (8 test cases)

| Test Case | Before | After |
|-----------|--------|-------|
| "What museums in Beijing?" | `keyword="博物馆"` → missed Forbidden City | `category="博物馆"` → Forbidden City ranked #1 |
| "Top 5A attractions" | No route → `keyword="5A"` → garbage results | `poi-level=5` → 10 accurate 5A sites |
| "Best citywalk neighborhoods" | `keyword="citywalk"` → 0 results | `ai-search` → 5 complete routes with transit + timing |
| "Badaling vs Mutianyu" | No route | `ai-search` → structured comparison table |
| "Best local food" | `keyword="美食"` → hot spring buffets | Knowledge base + `ai-search` → food streets + dishes |
| "3-day Hangzhou itinerary" | Fallback only | 5-step pipeline → full itinerary with closure warnings |
| "Cruise from Shanghai" | `keyword-search` → product SKUs | `ai-search` → port info + cruise recommendations |
| "Do I need a visa?" | Ambiguous routing | Knowledge base `visa/overview.md` (not ai-search) |

---

## [0.1.0] — 2026-06-13

### Initial Release

- TongTu — multilingual travel guide for foreign tourists visiting China.
- Capabilities: flight/hotel/train/attraction search via `flyai` CLI, plus knowledge base covering payment, communications, transport, visa, and trip planning.
- Supports English, Korean, Japanese, and Chinese input.
- Recommends booking via Alipay AliTrip mini-program.
