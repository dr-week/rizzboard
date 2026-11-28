import { findMatches, type CuratedEntry } from '../vault/curated-lines.ts';
import { buildRizzPrompt, buildRewritePrompt, type RizzResponse } from '../ai/prompts.ts';
import { segmentChatBubbles } from '../ocr/bubble-segmentation.ts';

function extractTopicKeyword(text: string): string | null {
  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'you', 'that', 'this', 'with', 'have', 'what',
    'when', 'where', 'why', 'how', 'just', 'like', 'really', 'very', 'about',
    'from', 'they', 'them', 'your', 'mine', 'been', 'were', 'was', 'will',
    'would', 'could', 'should', 'going', 'doing', 'want', 'need', 'know',
    'think', 'today', 'tonight', 'tomorrow', 'lol', 'haha', 'lmao', 'yeah',
    'yep', 'nope', 'okay', 'hey', 'hii', 'hello'
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4 && !stopWords.has(w));
  return words.length > 0 ? words[words.length - 1] : null;
}

export class RizzEngine {
  /**
   * Fast offline generator (< 5ms response time).
   * Analyzes intent + extracted topic so replies are specific, varied, and never repetitive.
   */
  public generateOfflineSuggestions(context: string, _myLastText?: string): RizzResponse[] {
    const trimmed = context.trim();
    const lower = trimmed.toLowerCase();
    const matches = findMatches(trimmed, 3);

    const byVibe: Partial<Record<'Smooth' | 'Tease' | 'Bold', string>> = {};
    for (const m of matches) {
      if (m.vibe === 'smooth' && !byVibe.Smooth) {
        byVibe.Smooth = m.template;
      } else if ((m.vibe === 'playful' || m.vibe === 'witty') && !byVibe.Tease) {
        byVibe.Tease = m.template;
      } else if (m.vibe === 'bold' && !byVibe.Bold) {
        byVibe.Bold = m.template;
      }
    }

    for (const m of matches) {
      if (!byVibe.Smooth && m.template !== byVibe.Tease && m.template !== byVibe.Bold) {
        byVibe.Smooth = m.template;
      } else if (!byVibe.Tease && m.template !== byVibe.Smooth && m.template !== byVibe.Bold) {
        byVibe.Tease = m.template;
      } else if (!byVibe.Bold && m.template !== byVibe.Smooth && m.template !== byVibe.Tease) {
        byVibe.Bold = m.template;
      }
    }

    const topic = extractTopicKeyword(trimmed);
    const isQuestion = trimmed.includes('?') || /^(what|why|how|where|when|who|are|do|did|would|can|wanna)\b/i.test(trimmed);
    const isShortDry = trimmed.length > 0 && trimmed.split(/\s+/).length <= 2 && !isQuestion;
    const isGreeting = /^(hey|hi|hello|yo|sup|heyy+|hii+|gm|good morning)\b/i.test(lower);
    const isSorry = /\b(sorry|my bad|apologize|late|missed)\b/i.test(lower);
    const isCompliment = /\b(cute|hot|pretty|handsome|smart|funny|sweet|love your|like your)\b/i.test(lower);
    const isKonkani = /\b(koso|kashi|kitem|khuim|mhaka|borem|barem|vhoi|naka|zala|mog)\b/i.test(lower);

    let defaultSmooth: string;
    let defaultTease: string;
    let defaultBold: string;

    if (isKonkani) {
      defaultSmooth = 'Borem asa! Tum koso asa?';
      defaultTease = 'Arey, itlem busy asa ki mhaka visarlo?';
      defaultBold = 'Choll, coffee-k vetam—kedna free asa?';
    } else if (isGreeting) {
      defaultSmooth = 'Was literally just thinking about texting you—great timing.';
      defaultTease = 'Look who finally decided to grace my notifications.';
      defaultBold = 'Hey—skipping the small talk, how is your week looking?';
    } else if (isSorry) {
      defaultSmooth = 'All good, life happens. Just glad you are here now.';
      defaultTease = 'You owe me a coffee for the suspense, then we are even.';
      defaultBold = 'Apology accepted—make it up to me this weekend?';
    } else if (isCompliment) {
      defaultSmooth = 'Careful, keep talking like that and I might actually blush.';
      defaultTease = 'Flattery will get you everywhere—what else you got?';
      defaultBold = 'Say that again in person over drinks.';
    } else if (isQuestion && topic) {
      defaultSmooth = `Honestly, ${topic} is a whole story—I will tell you the good part.`;
      defaultTease = `Depends—are you asking about ${topic} out of curiosity or research?`;
      defaultBold = `Better ${topic} story in person. Are you free Thursday?`;
    } else if (isQuestion) {
      defaultSmooth = 'Careful, the honest answer might make you like me more.';
      defaultTease = 'I plead the fifth—unless you are buying the first round.';
      defaultBold = 'Better story in person. When are we hanging out?';
    } else if (isShortDry) {
      defaultSmooth = 'A person of few words—good thing I speak fluent mystery.';
      defaultTease = 'Do not hurt your thumbs typing a whole novel over there.';
      defaultBold = 'Tell me what you are actually up to right now.';
    } else if (topic) {
      defaultSmooth = `Okay, ${topic} actually sounds like my kind of vibe.`;
      defaultTease = `Wait, you cannot just drop "${topic}" and not elaborate.`;
      defaultBold = `We definitely need to talk more about ${topic}—coffee this week?`;
    } else if (lower.includes('haha') || lower.includes('lol') || lower.includes('lmao')) {
      defaultSmooth = 'Making you laugh this early is dangerous for both of us.';
      defaultTease = 'Glad I could entertain you—my rates go up after midnight.';
      defaultBold = 'Wait until you hear my actual voice—call later?';
    } else {
      defaultSmooth = 'I was going to play it cool, but you made that impossible.';
      defaultTease = 'Are you always this much trouble or is today special?';
      defaultBold = 'Skip the small talk: what is your go-to spot for drinks?';
    }

    return [
      { vibe: 'Smooth', line: byVibe.Smooth ?? defaultSmooth },
      { vibe: 'Tease', line: byVibe.Tease ?? defaultTease },
      { vibe: 'Bold', line: byVibe.Bold ?? defaultBold }
    ];
  }

  /**
   * Free online AI suggestion generator using Pollinations.ai (no API key needed)
   * with automatic timeout and instant offline fallback.
   */
  public async generateOnlineSuggestions(context: string, myLastText?: string): Promise<RizzResponse[]> {
    const fallback = this.generateOfflineSuggestions(context, myLastText);
    if (typeof fetch !== 'function') return fallback;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    try {
      const prompt = `${buildRizzPrompt(context, myLastText)}\nReturn ONLY a JSON array of 3 objects: [{"vibe":"Smooth","line":"..."},{"vibe":"Tease","line":"..."},{"vibe":"Bold","line":"..."}]`;
      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a concise, witty dating/chat assistant. Reply ONLY with valid JSON.' },
            { role: 'user', content: prompt }
          ],
          model: 'openai'
        }),
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!res.ok) return fallback;
      const text = await res.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return fallback;
      const parsed = JSON.parse(jsonMatch[0]) as Array<{ vibe?: string; line?: string }>;
      if (!Array.isArray(parsed) || parsed.length < 3) return fallback;
      return [
        { vibe: 'Smooth', line: String(parsed[0]?.line || fallback[0].line) },
        { vibe: 'Tease', line: String(parsed[1]?.line || fallback[1].line) },
        { vibe: 'Bold', line: String(parsed[2]?.line || fallback[2].line) }
      ];
    } catch {
      clearTimeout(timer);
      return fallback;
    }
  }

  public getPromptForChat(partnerText: string, myText?: string): string {
    return buildRizzPrompt(partnerText, myText);
  }

  public getPromptForRewrite(draft: string): string {
    return buildRewritePrompt(draft);
  }
}

export { segmentChatBubbles, findMatches, type CuratedEntry, type RizzResponse };
