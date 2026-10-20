import { findMatches, type CuratedEntry } from '../vault/curated-lines.js';
import { buildRizzPrompt, buildRewritePrompt, type RizzResponse } from '../ai/prompts.js';
import { segmentChatBubbles } from '../ocr/bubble-segmentation.js';

export class RizzEngine {
  /**
   * Fast offline generator (< 5ms response time).
   */
  public generateOfflineSuggestions(context: string): RizzResponse[] {
    const matches = findMatches(context, 3);
    if (matches.length === 0) {
      return [
        { vibe: 'Smooth', line: 'I was going to play it cool, but you made that impossible.' },
        { vibe: 'Tease', line: 'Are you always this much trouble or is today special?' },
        { vibe: 'Bold', line: 'Skip the small talk: what is your go-to weekend spot?' }
      ];
    }

    return matches.map((m, idx) => {
      const vibes: Array<'Smooth' | 'Tease' | 'Bold'> = ['Smooth', 'Tease', 'Bold'];
      return {
        vibe: vibes[idx % vibes.length],
        line: m.template
      };
    });
  }

  public getPromptForChat(partnerText: string, myText?: string): string {
    return buildRizzPrompt(partnerText, myText);
  }

  public getPromptForRewrite(draft: string): string {
    return buildRewritePrompt(draft);
  }
}

export { segmentChatBubbles, findMatches };
