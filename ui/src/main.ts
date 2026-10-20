import { signal, computed } from '@zuari/signals';
import { html, render } from '@zuari/dom';
import { commitToChat, deleteCharacter, sendAction, triggerHaptic, kotlinBridge } from './services/bridge-service.js';
import { PredictiveEngine } from '../../core/engine/predictive.ts';
import { analyzeDraftLocal, type DraftAnalysis } from '../../core/engine/roast-engine.ts';

// Modular UI Components
import { ActionRibbon } from './components/ActionRibbon.ts';
import { SuggestionStrip } from './components/SuggestionStrip.ts';
import { QwertyGrid } from './components/QwertyGrid.ts';
import { EmojiPanel } from './components/EmojiPanel.ts';
import { ClipboardPanel } from './components/ClipboardPanel.ts';
import { RoastPanel } from './components/RoastPanel.ts';

import './styles/keyboard.css';

const predictive = new PredictiveEngine();

// UI State
export type KeyboardView = 'qwerty' | 'emojis' | 'clipboard' | 'roast';
const currentView = signal<KeyboardView>('qwerty');
const typedBuffer = signal<string>('');
const screenshotAlert = signal<string | null>(null);
const currentRoast = signal<DraftAnalysis | null>(null);
const clipboardHistory = signal<string[]>([
  'Hey! Are we still on for coffee?',
  'Check this out: https://instagram.com/reel/xyz'
]);

// Reactive Next-Word & Prefix Predictions
const activeSuggestions = computed(() => {
  const buf = typedBuffer.value;
  if (!buf) return ['how', 'are', 'you'];
  const words = buf.trim().split(/\s+/);
  const lastWord = words[words.length - 1];

  if (buf.endsWith(' ')) {
    return predictive.predictNextWord(lastWord, 3);
  } else {
    const completions = predictive.completePrefix(lastWord, 3);
    return completions.length > 0 ? completions : [lastWord];
  }
});

// Native Events
kotlinBridge.registerNativeCallback('screenshotDetected', (payload: any) => {
  screenshotAlert.value = payload.uri;
  triggerHaptic('heavy');
});

kotlinBridge.registerNativeCallback('clipboardAdded', (payload: any) => {
  if (payload.text) {
    clipboardHistory.value = [payload.text, ...clipboardHistory.value.slice(0, 9)];
  }
});

// Event Handlers
function handleKey(char: string) {
  triggerHaptic('light');
  typedBuffer.value += char;
  commitToChat(char);
}

function handleBackspace() {
  triggerHaptic('light');
  if (typedBuffer.value.length > 0) {
    typedBuffer.value = typedBuffer.value.slice(0, -1);
  }
  deleteCharacter();
}

function handleAutocomplete(word: string) {
  triggerHaptic('click');
  const buf = typedBuffer.value;
  const words = buf.trim().split(/\s+/);
  if (!buf.endsWith(' ') && words.length > 0) {
    const lastWord = words[words.length - 1];
    for (let i = 0; i < lastWord.length; i++) {
      deleteCharacter();
    }
  }
  commitToChat(word + ' ');
  typedBuffer.value = (buf.endsWith(' ') ? buf : words.slice(0, -1).join(' ') + ' ') + word + ' ';
}

function runDraftRoast() {
  triggerHaptic('heavy');
  currentRoast.value = analyzeDraftLocal(typedBuffer.value);
  currentView.value = 'roast';
}

function acceptRoastFix(improved: string) {
  triggerHaptic('click');
  for (let i = 0; i < typedBuffer.value.length; i++) {
    deleteCharacter();
  }
  commitToChat(improved);
  typedBuffer.value = improved;
  currentView.value = 'qwerty';
}

export function App() {
  return html`
    <div class="rizz-app">
      ${ActionRibbon({
        screenshotAlert,
        onAnalyzeScreenshot: () => { screenshotAlert.value = null; runDraftRoast(); },
        onToggleRoast: () => currentView.value = currentView.value === 'qwerty' ? 'roast' : 'qwerty',
        onToggleClipboard: () => currentView.value = currentView.value === 'clipboard' ? 'qwerty' : 'clipboard',
        onToggleEmojis: () => currentView.value = currentView.value === 'emojis' ? 'qwerty' : 'emojis'
      })}

      ${SuggestionStrip({
        suggestions: activeSuggestions,
        onSelectSuggestion: handleAutocomplete
      })}

      ${() => {
        const view = currentView.value;
        if (view === 'emojis') {
          return EmojiPanel({
            onSelectEmoji: handleKey,
            onClose: () => currentView.value = 'qwerty'
          });
        }
        if (view === 'clipboard') {
          return ClipboardPanel({
            history: clipboardHistory,
            onSelectClip: (clip) => { commitToChat(clip); currentView.value = 'qwerty'; },
            onClose: () => currentView.value = 'qwerty'
          });
        }
        if (view === 'roast') {
          return RoastPanel({
            roast: currentRoast,
            onApplyUpgrade: acceptRoastFix,
            onClose: () => currentView.value = 'qwerty'
          });
        }
        return QwertyGrid({
          onKeyPress: handleKey,
          onBackspace: handleBackspace,
          onSend: () => { triggerHaptic('heavy'); sendAction(); },
          onOpenEmojis: () => currentView.value = 'emojis'
        });
      }}
    </div>
  `;
}

// Mount to DOM
const root = document.getElementById('app');
if (root) {
  const { fragment } = render(App());
  root.appendChild(fragment);
}
