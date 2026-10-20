export interface DraftAnalysis {
  score: number; // 1 to 10
  verdict: 'Dry' | 'Safe' | 'Smooth' | 'God Tier';
  feedback: string;
  improved: string;
}

/**
 * Instant local heuristic analyzer (< 1ms). Evaluates energy, engagement, and cliché risk.
 */
export function analyzeDraftLocal(text: string): DraftAnalysis {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed) {
    return {
      score: 1,
      verdict: 'Dry',
      feedback: 'Empty canvas. Drop something bold.',
      improved: 'Are we breaking records or rules tonight?'
    };
  }

  // Cliché penalties
  if (/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(trimmed)) {
    return {
      score: 2,
      verdict: 'Dry',
      feedback: 'Low effort opener. High ghosting probability (~90%).',
      improved: 'Important question: what is your most controversial food opinion?'
    };
  }

  if (lower.includes('how are you') || lower.includes('how was your day')) {
    return {
      score: 4,
      verdict: 'Safe',
      feedback: 'Polite but sounds like an HR interview.',
      improved: 'Tell me your day was more exciting than grocery shopping.'
    };
  }

  if (lower.includes('cutie') || lower.includes('beautiful') || lower.includes('gorgeous')) {
    return {
      score: 5,
      verdict: 'Safe',
      feedback: 'Compliment is sweet, but every other match says the exact same thing.',
      improved: 'I was going to play it cool, but you made that impossible.'
    };
  }

  // Teasing / banter / date proposals
  if (lower.includes('trouble') || lower.includes('bet') || lower.includes('drinks') || lower.includes('coffee')) {
    return {
      score: 9,
      verdict: 'Smooth',
      feedback: 'High energy, playful intrigue. Ready to send.',
      improved: trimmed
    };
  }

  return {
    score: 7,
    verdict: 'Smooth',
    feedback: 'Solid message. Could use 10% more cheekiness.',
    improved: `${trimmed} — unless you scare easily.`
  };
}
