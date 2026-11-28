/**
 * @fileoverview Ultra-fast in-memory Prefix Trie, Bigram Next-Word Predictor,
 * Autocorrect (contractions + typo map + Levenshtein fuzzy match), and Personal Dictionary.
 */

interface TrieNode {
  children: Map<string, TrieNode>;
  isWord: boolean;
  frequency: number;
}

const COMMON_AUTOCORRECTS: Record<string, string> = {
  i: 'I',
  im: "I'm",
  ive: "I've",
  ill: "I'll",
  id: "I'd",
  dont: "don't",
  cant: "can't",
  wont: "won't",
  didnt: "didn't",
  doesnt: "doesn't",
  isnt: "isn't",
  arent: "aren't",
  wasnt: "wasn't",
  werent: "weren't",
  havent: "haven't",
  hasnt: "hasn't",
  hadnt: "hadn't",
  wouldnt: "wouldn't",
  couldnt: "couldn't",
  shouldnt: "shouldn't",
  youre: "you're",
  youve: "you've",
  youll: "you'll",
  theyre: "they're",
  thats: "that's",
  whats: "what's",
  heres: "here's",
  theres: "there's",
  wheres: "where's",
  lets: "let's",
  teh: 'the',
  hte: 'the',
  adn: 'and',
  nad: 'and',
  taht: 'that',
  waht: 'what',
  whta: 'what',
  hwat: 'what',
  wiht: 'with',
  wtih: 'with',
  jsut: 'just',
  jstu: 'just',
  liek: 'like',
  lke: 'like',
  realy: 'really',
  relly: 'really',
  definately: 'definitely',
  definetly: 'definitely',
  seperate: 'separate',
  recieve: 'receive',
  occured: 'occurred',
  untill: 'until',
  tommorow: 'tomorrow',
  tomorow: 'tomorrow',
  tonite: 'tonight',
  becuase: 'because',
  beacuse: 'because',
  freind: 'friend',
  frend: 'friend',
  prolly: 'probably',
  probly: 'probably',
  thx: 'thanks',
  ty: 'thank you',
  pls: 'please',
  plz: 'please',
  sry: 'sorry',
  srry: 'sorry',
  msg: 'message',
  bday: 'birthday',
  wknd: 'weekend',
  tmrw: 'tomorrow'
};

export class PredictiveEngine {
  private root: TrieNode = { children: new Map(), isWord: false, frequency: 0 };
  private bigrams: Map<string, Array<{ word: string; count: number }>> = new Map();
  private dictionaryWords: Set<string> = new Set();
  private personalWords: Set<string> = new Set();

  constructor() {
    this.seedCommonVocabulary();
  }

  public insert(word: string, frequency = 1): void {
    let current = this.root;
    const lower = word.toLowerCase();
    for (const char of lower) {
      if (!current.children.has(char)) {
        current.children.set(char, { children: new Map(), isWord: false, frequency: 0 });
      }
      current = current.children.get(char)!;
    }
    current.isWord = true;
    current.frequency += frequency;
    this.dictionaryWords.add(lower);
  }

  public learnWord(word: string): void {
    const clean = word.trim().replace(/[^a-zA-Z']/g, '');
    if (clean.length < 2) return;
    this.insert(clean, 25);
    this.personalWords.add(clean.toLowerCase());
  }

  public getPersonalDictionary(): string[] {
    return Array.from(this.personalWords).sort();
  }

  public hasWord(word: string): boolean {
    return this.dictionaryWords.has(word.toLowerCase());
  }

  /**
   * Returns an autocorrected replacement if the word is a known typo/contraction
   * or within Levenshtein edit distance 1 of a high-frequency dictionary word.
   */
  public autocorrect(word: string): string | null {
    const trimmed = word.trim();
    if (!trimmed || trimmed.length < 1) return null;
    const lower = trimmed.toLowerCase();

    if (COMMON_AUTOCORRECTS[lower]) {
      const fixed = COMMON_AUTOCORRECTS[lower];
      return trimmed[0] === trimmed[0].toUpperCase() && fixed[0] !== fixed[0].toUpperCase()
        ? fixed[0].toUpperCase() + fixed.slice(1)
        : fixed;
    }

    if (this.dictionaryWords.has(lower) || lower.length < 3) {
      return null;
    }

    // Fuzzy edit-distance 1 lookup
    let bestWord: string | null = null;
    let bestFreq = 0;

    for (const candidate of this.dictionaryWords) {
      if (Math.abs(candidate.length - lower.length) > 1) continue;
      if (this.levenshtein(lower, candidate) === 1) {
        const freq = this.getWordFrequency(candidate);
        if (freq > bestFreq) {
          bestFreq = freq;
          bestWord = candidate;
        }
      }
    }

    if (!bestWord) return null;
    return trimmed[0] === trimmed[0].toUpperCase()
      ? bestWord[0].toUpperCase() + bestWord.slice(1)
      : bestWord;
  }

  private getWordFrequency(word: string): number {
    let current = this.root;
    for (const ch of word.toLowerCase()) {
      const next = current.children.get(ch);
      if (!next) return 0;
      current = next;
    }
    return current.isWord ? current.frequency : 0;
  }

  private levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const temp = dp[j];
        if (a[i - 1] === b[j - 1]) {
          dp[j] = prev;
        } else {
          dp[j] = 1 + Math.min(prev, dp[j], dp[j - 1]);
        }
        prev = temp;
      }
    }
    return dp[n];
  }

  public addBigram(prevWord: string, nextWord: string): void {
    const p = prevWord.toLowerCase();
    const n = nextWord.toLowerCase();
    let list = this.bigrams.get(p);
    if (!list) {
      list = [];
      this.bigrams.set(p, list);
    }
    const existing = list.find(item => item.word === n);
    if (existing) {
      existing.count++;
    } else {
      list.push({ word: n, count: 1 });
    }
    list.sort((a, b) => b.count - a.count);
  }

  /**
   * Completes the current prefix being typed (e.g. "wh" -> ["what", "where", "when"]).
   */
  public completePrefix(prefix: string, maxResults = 3): string[] {
    if (!prefix) return [];
    let current = this.root;
    const lower = prefix.toLowerCase();

    for (const char of lower) {
      if (!current.children.has(char)) return [];
      current = current.children.get(char)!;
    }

    const matches: Array<{ word: string; frequency: number }> = [];
    this.collectWords(current, lower, matches);
    matches.sort((a, b) => b.frequency - a.frequency);
    return matches.slice(0, maxResults).map(m => m.word);
  }

  /**
   * Suggests the next probable word given the previous word (Bigram).
   */
  public predictNextWord(prevWord: string, maxResults = 3): string[] {
    if (!prevWord) return ['the', 'you', 'I'];
    const lower = prevWord.toLowerCase();
    const matches = this.bigrams.get(lower);
    if (matches && matches.length > 0) {
      return matches.slice(0, maxResults).map(m => m.word);
    }
    return ['and', 'to', 'you'];
  }

  private collectWords(node: TrieNode, currentPath: string, results: Array<{ word: string; frequency: number }>): void {
    if (node.isWord) {
      results.push({ word: currentPath, frequency: node.frequency });
    }
    for (const [char, childNode] of node.children.entries()) {
      this.collectWords(childNode, currentPath + char, results);
    }
  }

  private seedCommonVocabulary(): void {
    const commonWords: Array<[string, number]> = [
      ['the', 200], ['be', 180], ['to', 180], ['of', 175], ['and', 175], ['a', 170], ['in', 165],
      ['that', 160], ['have', 155], ['it', 155], ['for', 150], ['not', 145], ['on', 145], ['with', 140],
      ['he', 135], ['as', 135], ['you', 190], ['do', 130], ['at', 130], ['this', 130], ['but', 125],
      ['his', 120], ['by', 120], ['from', 120], ['they', 120], ['we', 125], ['say', 115], ['her', 115],
      ['she', 115], ['or', 115], ['an', 115], ['will', 120], ['my', 130], ['one', 115], ['all', 115],
      ['would', 115], ['there', 115], ['their', 110], ['what', 140], ['so', 125], ['up', 110], ['out', 110],
      ['if', 115], ['about', 120], ['who', 110], ['get', 115], ['which', 105], ['go', 115], ['me', 125],
      ['when', 120], ['make', 110], ['can', 125], ['like', 130], ['time', 115], ['no', 115], ['just', 125],
      ['him', 105], ['know', 120], ['take', 105], ['people', 100], ['into', 100], ['year', 95], ['your', 130],
      ['good', 125], ['some', 105], ['could', 105], ['them', 105], ['see', 115], ['other', 100], ['than', 100],
      ['then', 105], ['now', 115], ['look', 105], ['only', 105], ['come', 105], ['its', 100], ['over', 100],
      ['think', 110], ['also', 100], ['back', 105], ['after', 100], ['use', 100], ['two', 95], ['how', 135],
      ['our', 105], ['work', 105], ['first', 100], ['well', 110], ['way', 105], ['even', 100], ['new', 100],
      ['want', 115], ['because', 105], ['any', 100], ['these', 95], ['give', 95], ['day', 105], ['most', 95],
      ['us', 100], ['are', 150], ['was', 130], ['were', 110], ['been', 105], ['has', 110], ['had', 110],
      ['free', 110], ['tonight', 105], ['tomorrow', 100], ['weekend', 110], ['coffee', 95], ['drinks', 95],
      ['dinner', 95], ['lunch', 90], ['plans', 95], ['sounds', 105], ['love', 120], ['talking', 90],
      ['where', 115], ['why', 110], ['going', 115], ['great', 115], ['amazing', 95], ['awesome', 95],
      ['cool', 100], ['nice', 105], ['sorry', 100], ['thanks', 105], ['please', 105], ['maybe', 95],
      ['definitely', 90], ['probably', 90], ['actually', 95], ['really', 115], ['very', 110],
      ['morning', 95], ['night', 105], ['today', 105], ['soon', 95], ['later', 95], ['ready', 90],
      ['busy', 90], ['happy', 95], ['excited', 90], ['miss', 95], ['wait', 95], ['meet', 95]
    ];
    for (const [w, f] of commonWords) {
      this.insert(w, f);
    }

    const commonBigrams: Array<[string, string]> = [
      ['how', 'are'], ['how', 'is'], ['how', 'was'],
      ['are', 'you'], ['are', 'we'], ['are', 'they'],
      ['you', 'free'], ['you', 'doing'], ['you', 'up'],
      ['what', 'are'], ['what', 'is'], ['what', 'do'],
      ['want', 'to'], ['going', 'to'], ['have', 'to'],
      ['good', 'morning'], ['good', 'night'], ['good', 'idea'],
      ['sounds', 'good'], ['sounds', 'great'], ['sounds', 'fun'],
      ['see', 'you'], ['talk', 'to'], ['let', 'me'],
      ['on', 'my'], ['my', 'way'], ['this', 'weekend']
    ];
    for (const [a, b] of commonBigrams) {
      this.addBigram(a, b);
    }
  }
}
