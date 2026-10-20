export interface CuratedEntry {
  id: string;
  category: 'opener' | 'banter' | 'wordplay' | 'closer';
  vibe: 'smooth' | 'playful' | 'bold' | 'witty';
  triggerKeywords: string[];
  template: string;
}

export const OFFLINE_VAULT: CuratedEntry[] = [
  // Openers
  {
    id: 'op-1',
    category: 'opener',
    vibe: 'playful',
    triggerKeywords: ['travel', 'hiking', 'nature'],
    template: 'Are you as adventurous as your profile says, or do you also get lost in grocery stores?'
  },
  {
    id: 'op-2',
    category: 'opener',
    vibe: 'smooth',
    triggerKeywords: ['smile', 'eyes', 'cute'],
    template: 'I was going to wait two days to message you, but patience was never my strong suit.'
  },
  {
    id: 'op-3',
    category: 'opener',
    vibe: 'witty',
    triggerKeywords: ['food', 'coffee', 'cooking'],
    template: 'Important question: what is your most controversial culinary opinion?'
  },

  // Banter / Teases
  {
    id: 'bt-1',
    category: 'banter',
    vibe: 'playful',
    triggerKeywords: ['trouble', 'sarcasm', 'bad'],
    template: 'Are you always this much trouble or did I catch you on a good day?'
  },
  {
    id: 'bt-2',
    category: 'banter',
    vibe: 'witty',
    triggerKeywords: ['challenge', 'bet', 'win'],
    template: 'Careful, high expectations are my only weakness.'
  },
  {
    id: 'bt-3',
    category: 'banter',
    vibe: 'bold',
    triggerKeywords: ['rules', 'late', 'fast'],
    template: 'I would say you are five minutes away from being my favorite person.'
  },

  // Wordplay
  {
    id: 'wp-1',
    category: 'wordplay',
    vibe: 'witty',
    triggerKeywords: ['smart', 'books', 'study', 'work'],
    template: 'Are you an overdue library book? Because you have fine written all over you.'
  },
  {
    id: 'wp-2',
    category: 'wordplay',
    vibe: 'smooth',
    triggerKeywords: ['music', 'song', 'playlist'],
    template: 'If our conversation was a playlist, I would have it on repeat.'
  },

  // Closers / Meetups
  {
    id: 'cl-1',
    category: 'closer',
    vibe: 'bold',
    triggerKeywords: ['drinks', 'date', 'weekend', 'meet'],
    template: 'Drinks this Thursday. You pick the spot, I will bring the conversation.'
  },
  {
    id: 'cl-2',
    category: 'closer',
    vibe: 'smooth',
    triggerKeywords: ['coffee', 'tea', 'afternoon'],
    template: 'Let us see if you are as fun in person. Coffee tomorrow?'
  }
];

export function findMatches(input: string, limit = 3): CuratedEntry[] {
  const normalized = input.toLowerCase();
  const scored = OFFLINE_VAULT.map(entry => {
    let score = 0;
    for (const kw of entry.triggerKeywords) {
      if (normalized.includes(kw)) score += 2;
    }
    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.entry);
}
