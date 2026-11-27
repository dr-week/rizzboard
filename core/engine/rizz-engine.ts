import { findMatches, type CuratedEntry } from '../vault/curated-lines.ts';
import { buildRizzPrompt, buildRewritePrompt, type RizzResponse } from '../ai/prompts.ts';
import { segmentChatBubbles } from '../ocr/bubble-segmentation.ts';

export class RizzEngine {
  /**
   * Fast offline generator (< 5ms response time).
   * Always returns 3 distinct vibes (Smooth, Tease, Bold) tailored to partner text.
   */
  public generateOfflineSuggestions(context: string, _myLastText?: string): RizzResponse[] {
    const trimmed = context.trim();
    const lower = trimmed.toLowerCase();
    const matches = findMatches(trimmed, 3);

    const byVibe: Partial<Record<'Smooth' | 'Tease' | 'Bold', string>> = {};
    for (const m of matches) {
      if ((m.vibe === 'smooth') && !byVibe.Smooth) {
        byVibe.Smooth = m.template;
      } else if ((m.vibe === 'playful' || m.vibe === 'witty') && !byVibe.Tease) {
        byVibe.Tease = m.template;
      } else if (m.vibe === 'bold' && !byVibe.Bold) {
        byVibe.Bold = m.template;
      }
    }

    // Fill any unpopulated slots using Remaining Vault Matches or Contextual Heuristics
    for (const m of matches) {
      if (!byVibe.Smooth && m.template !== byVibe.Tease && m.template !== byVibe.Bold) {
        byVibe.Smooth = m.template;
      } else if (!byVibe.Tease && m.template !== byVibe.Smooth && m.template !== byVibe.Bold) {
        byVibe.Tease = m.template;
      } else if (!byVibe.Bold && m.template !== byVibe.Smooth && m.template !== byVibe.Tease) {
        byVibe.Bold = m.template;
      }
    }

    const isQuestion = trimmed.includes('?') || /^(what|why|how|where|when|who|are|do|did|would)\b/i.test(trimmed);
    const isShortDry = trimmed.length > 0 && trimmed.split(/\s+/).length <= 2 && !isQuestion;

    const defaultSmooth = isQuestion
      ? 'Careful, the honest answer might make you like me more.'
      : isShortDry
        ? 'You are a person of few words—good thing I speak fluent mystery.'
        : lower.includes('haha') || lower.includes('lol')
          ? 'Making you laugh this early is dangerous for both of us.'
          : 'I was going to play it cool, but you made that impossible.';

    const defaultTease = isQuestion
      ? 'I plead the fifth—unless you are buying the first round.'
      : isShortDry
        ? 'Do not hurt your thumbs typing a whole novel over there.'
        : 'Are you always this much trouble or is today special?';

    const defaultBold = isQuestion
      ? 'Better story in person. Are you free Thursday night?'
      : 'Skip the small talk: what is your go-to spot for drinks?';

    return [
      { vibe: 'Smooth', line: byVibe.Smooth ?? defaultSmooth },
      { vibe: 'Tease', line: byVibe.Tease ?? defaultTease },
      { vibe: 'Bold', line: byVibe.Bold ?? defaultBold }
    ];
  }

  public getPromptForChat(partnerText: string, myText?: string): string {
    return buildRizzPrompt(partnerText, myText);
  }

  public getPromptForRewrite(draft: string): string {
    return buildRewritePrompt(draft);
  }
}

export { segmentChatBubbles, findMatches, type CuratedEntry, type RizzResponse };
