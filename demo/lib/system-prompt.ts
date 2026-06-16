import fs from 'fs';
import path from 'path';

const SKILL_DIR = path.resolve(process.cwd(), '..', 'skills', 'tongtu-china-travel');
const REFS_DIR = path.join(SKILL_DIR, 'references');

function readFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

/**
 * Build the full system prompt by combining SKILL.md with key reference documents.
 * This is loaded once at module level (cached by Node.js module system).
 */
function buildSystemPrompt(): string {
  const skillMd = readFile(path.join(SKILL_DIR, 'SKILL.md'));

  // Key reference documents that provide knowledge base content
  const referenceDocs = [
    'payment/payment-overview.md',
    'payment/alipay-for-foreigners.md',
    'payment/wechat-pay-for-foreigners.md',
    'transport/transport-overview.md',
    'transport/airport-transfer.md',
    'transport/public-transport.md',
    'transport/taxi.md',
    'transport/intercity.md',
    'planning/itinerary-principles.md',
    'planning/seasonal-guide.md',
    'visa/overview.md',
    'visa/visa-free-countries.md',
    'visa/visa-free-transit.md',
    'communications/communications-overview.md',
    'communications/esim.md',
    'communications/local-sim.md',
  ];

  const referenceContent = referenceDocs
    .map((doc) => {
      const content = readFile(path.join(REFS_DIR, doc));
      if (!content) return '';
      return `\n\n---\n## Reference: ${doc}\n${content}`;
    })
    .filter(Boolean)
    .join('');

  // Strip frontmatter from SKILL.md (everything between --- markers at the top)
  const cleanSkill = skillMd.replace(/^---[\s\S]*?---\n/, '');

  return `${cleanSkill}

---

## Knowledge Base

The following reference documents contain detailed information you should use to answer user questions. When a question matches a topic below, use the specific facts, steps, and data from these documents rather than generating generic advice.
${referenceContent}

---

## Important: Today's Date
Today is ${new Date().toISOString().split('T')[0]}. Use this to convert relative dates (e.g., "next weekend", "next month") to absolute dates when calling flyai commands.
`;
}

// Cached at module level — computed once on first import
export const systemPrompt = buildSystemPrompt();
