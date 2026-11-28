import { signal, computed } from '@zuari/signals';
import {
  PredictiveEngine,
  type DraftAnalysis,
  type ConversationContext,
  type ContextResolution
} from '../../../core/index.ts';

export type KeyboardView =
  | 'qwerty'
  | 'emojis'
  | 'clipboard'
  | 'roast'
  | 'nextmove'
  | 'textedit'
  | 'help'
  | 'talks'
  | 'settings';

function readStorage<T extends string>(key: string, valid: T[], fallback: T): T {
  try {
    const saved = localStorage.getItem(key) as T | null;
    if (saved && valid.includes(saved)) return saved;
  } catch {}
  return fallback;
}

export const predictive = new PredictiveEngine();

export const currentView = signal<KeyboardView>('qwerty');
export const typedBuffer = signal<string>('');
export const activeTheme = signal<'slate' | 'amoled' | 'light'>(
  readStorage('rizzboard_theme', ['slate', 'amoled', 'light'], 'slate')
);
export const oneHandedMode = signal<'off' | 'right' | 'left'>(
  readStorage('rizzboard_one_handed', ['off', 'right', 'left'], 'off')
);
export const showNumberRow = signal<boolean>(
  readStorage('rizzboard_number_row', ['true', 'false'], 'false') === 'true'
);
export const keyboardHeight = signal<'normal' | 'compact' | 'tall'>(
  readStorage('rizzboard_height', ['normal', 'compact', 'tall'], 'normal')
);
export const incognitoMode = signal<boolean>(false);

export const activeHostPackage = signal<string | undefined>(undefined);
export const pendingContext = signal<ConversationContext | null>(null);
export const activeResolution = signal<ContextResolution | null>(null);
export const stealthMode = signal<boolean>(false);
export const stealthBuffer = signal<string>('');
export const stealthHint = signal<string | null>(null);
export const showEnableScannerLink = signal<boolean>(false);

export const currentRoast = signal<DraftAnalysis | null>(null);
export const clipboardHistory = signal<string[]>([
  'What is your biggest red flag?',
  'Are we still on for coffee this weekend?'
]);

export const activeSuggestions = computed(() => {
  const buf = stealthMode.value ? stealthBuffer.value : typedBuffer.value;
  if (!buf) return stealthMode.value ? ['asked', 'red', 'weekend'] : ['how', 'are', 'you'];
  const words = buf.trim().split(/\s+/);
  const lastWord = words[words.length - 1];

  if (buf.endsWith(' ')) {
    return predictive.predictNextWord(lastWord, 3);
  }
  const completions = predictive.completePrefix(lastWord, 3);
  return completions.length > 0 ? completions : [lastWord];
});
