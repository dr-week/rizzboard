import { signal, computed } from '@zuari/signals';
import { html, render } from '@zuari/dom';
import {
  commitToChat,
  deleteCharacter,
  sendAction,
  triggerHaptic,
  kotlinBridge,
  requestScreenshotOCR,
  requestLiveScreenScan,
  fetchActiveNativeContext,
  openNativeSetting,
  startVoiceTyping,
  showInputMethodPicker,
  moveCursor
} from './services/bridge-service.ts';
import {
  PredictiveEngine,
  analyzeDraftLocal,
  HybridContextRouter,
  type DraftAnalysis,
  type ConversationContext,
  type ContextResolution
} from '../../core/index.ts';

// Micro-Modular UI Components
import { ActionRibbon } from './components/ribbon/ActionRibbon.ts';
import { StealthContextBar } from './components/ribbon/StealthContextBar.ts';
import { SuggestionStrip } from './components/grid/SuggestionStrip.ts';
import { QwertyGrid } from './components/grid/QwertyGrid.ts';
import { EmojiPanel } from './components/panels/EmojiPanel.ts';
import { ClipboardPanel } from './components/panels/ClipboardPanel.ts';
import { RoastPanel } from './components/panels/RoastPanel.ts';
import { NextMovePanel } from './components/panels/NextMovePanel.ts';
import { TextEditPanel } from './components/panels/TextEditPanel.ts';
import { HelpPanel } from './components/panels/HelpPanel.ts';

import './styles/keyboard.css';

const predictive = new PredictiveEngine();
const contextRouter = new HybridContextRouter();

// Reactive UI State
export type KeyboardView = 'qwerty' | 'emojis' | 'clipboard' | 'roast' | 'nextmove' | 'textedit' | 'help';
const currentView = signal<KeyboardView>('qwerty');
const typedBuffer = signal<string>('');

// Hybrid Context & Stealth Input State
const activeHostPackage = signal<string | undefined>(undefined);
const pendingContext = signal<ConversationContext | null>(null);
const activeResolution = signal<ContextResolution | null>(null);
const stealthMode = signal<boolean>(false);
const stealthBuffer = signal<string>('');
const stealthHint = signal<string | null>(null);
const showEnableScannerLink = signal<boolean>(false);

const currentRoast = signal<DraftAnalysis | null>(null);
const clipboardHistory = signal<string[]>([
  'What is your biggest red flag?',
  'Are we still on for coffee this weekend?'
]);

// Reactive Next-Word & Prefix Predictions (tracks active target buffer)
const activeSuggestions = computed(() => {
  const buf = stealthMode.value ? stealthBuffer.value : typedBuffer.value;
  if (!buf) return stealthMode.value ? ['asked', 'red', 'weekend'] : ['how', 'are', 'you'];
  const words = buf.trim().split(/\s+/);
  const lastWord = words[words.length - 1];

  if (buf.endsWith(' ')) {
    return predictive.predictNextWord(lastWord, 3);
  } else {
    const completions = predictive.completePrefix(lastWord, 3);
    return completions.length > 0 ? completions : [lastWord];
  }
});

// --- Native Hybrid Bridge Listeners ---

kotlinBridge.registerNativeCallback('appContextChanged', (payload: any) => {
  if (payload?.packageName) {
    activeHostPackage.value = payload.packageName;
    // Automatically scan screen context in background so user doesn't have to click Scan manually
    try {
      const scan = requestLiveScreenScan();
      if (scan.status === 'ok' && scan.blocks.length > 0) {
        const extracted = contextRouter.ingestScreenBlocks(scan.blocks, 'accessibility', {
          appPackage: scan.appPackage ?? payload.packageName
        });
        if (extracted) {
          pendingContext.value = extracted;
        }
      }
    } catch {
      // Silent fallback to notification/clipboard tiers
    }
  }
});

kotlinBridge.registerNativeCallback('screenshotDetected', (payload: any) => {
  if (!payload?.uri) return;
  pendingContext.value = {
    id: `screenshot-${payload.timestamp ?? Date.now()}`,
    source: 'screenshot',
    partnerText: 'Screenshot captured',
    uri: payload.uri,
    appPackage: payload.appPackage ?? activeHostPackage.value,
    timestamp: Date.now()
  };
  triggerHaptic('heavy');
});

kotlinBridge.registerNativeCallback('contextDetected', (payload: any) => {
  if (!payload?.text || !payload?.source) return;
  const ctx = contextRouter.ingestRawContext({
    source: payload.source,
    text: payload.text,
    senderName: payload.senderName,
    appPackage: payload.appPackage ?? activeHostPackage.value,
    timestamp: payload.timestamp
  });
  if (ctx) {
    pendingContext.value = ctx;
    triggerHaptic('click');
  }
});

kotlinBridge.registerNativeCallback('clipboardAdded', (payload: any) => {
  if (payload?.text) {
    const clean = String(payload.text).trim();
    if (!clean) return;
    clipboardHistory.value = [
      clean,
      ...clipboardHistory.value.filter(item => item !== clean).slice(0, 9)
    ];
    const ctx = contextRouter.ingestRawContext({
      source: 'clipboard',
      text: clean,
      appPackage: activeHostPackage.value
    });
    if (ctx) {
      pendingContext.value = ctx;
    }
  }
});

// Check buffered context immediately on boot (e.g. notification arrived prior to IME open)
const initialBuffered = fetchActiveNativeContext();
if (initialBuffered.status === 'ok' && initialBuffered.text && initialBuffered.source) {
  const bootCtx = contextRouter.ingestRawContext({
    source: initialBuffered.source,
    text: initialBuffered.text,
    senderName: initialBuffered.senderName,
    appPackage: initialBuffered.appPackage,
    timestamp: initialBuffered.timestamp
  });
  if (bootCtx) {
    pendingContext.value = bootCtx;
  }
}

// --- Hybrid Context Actions ---

function openRepliesForContext(ctx: ConversationContext) {
  triggerHaptic('heavy');

  // If this is an unparsed screenshot URI, run ML Kit OCR first
  if (ctx.source === 'screenshot' && ctx.uri) {
    const ocr = requestScreenshotOCR(ctx.uri);
    const extracted = contextRouter.ingestScreenBlocks(ocr.blocks, 'screenshot', {
      appPackage: ocr.appPackage ?? ctx.appPackage,
      uri: ctx.uri
    });

    if (!extracted) {
      pendingContext.value = null;
      enterStealthMode('Screenshot looked blank/protected — type what they said:');
      return;
    }

    activeResolution.value = contextRouter.resolveSuggestions(extracted);
    pendingContext.value = null;
    stealthMode.value = false;
    currentView.value = 'nextmove';
    return;
  }

  activeResolution.value = contextRouter.resolveSuggestions(ctx);
  pendingContext.value = null;
  stealthMode.value = false;
  currentView.value = 'nextmove';
}

function handleLiveScreenScan() {
  triggerHaptic('click');
  const scan = requestLiveScreenScan();

  if (scan.status === 'ok' && scan.blocks.length > 0) {
    const extracted = contextRouter.ingestScreenBlocks(scan.blocks, 'accessibility', {
      appPackage: scan.appPackage ?? activeHostPackage.value
    });
    if (extracted) {
      activeResolution.value = contextRouter.resolveSuggestions(extracted);
      stealthMode.value = false;
      currentView.value = 'nextmove';
      return;
    }
  }

  if (scan.status === 'not_enabled') {
    showEnableScannerLink.value = true;
    enterStealthMode('Scanner off — type what they said, or tap Enable Scanner ⚙');
    return;
  }

  showEnableScannerLink.value = false;
  enterStealthMode('Screen protected (FLAG_SECURE) — type a quick summary here:');
}

function enterStealthMode(customHint?: string) {
  stealthHint.value = customHint ?? null;
  stealthMode.value = true;
  currentView.value = 'qwerty';
}

function toggleStealthMode() {
  triggerHaptic('click');
  if (stealthMode.value) {
    stealthMode.value = false;
    stealthHint.value = null;
    showEnableScannerLink.value = false;
  } else {
    showEnableScannerLink.value = false;
    enterStealthMode();
  }
}

function generateFromStealthBuffer() {
  triggerHaptic('heavy');
  const promptText = stealthBuffer.value.trim();
  const ctx = contextRouter.ingestRawContext({
    source: 'manual',
    text: promptText || 'start playful conversation',
    appPackage: activeHostPackage.value
  });
  if (ctx) {
    activeResolution.value = contextRouter.resolveSuggestions(ctx);
    stealthMode.value = false;
    stealthHint.value = null;
    showEnableScannerLink.value = false;
    currentView.value = 'nextmove';
  }
}

function applyNextMoveReply(line: string) {
  triggerHaptic('heavy');
  contextRouter.recordCommittedReply(line);
  commitToChat(line);
  typedBuffer.value = line;
  stealthBuffer.value = '';
  currentView.value = 'qwerty';
}

function analyzeClipboardBubble(clip: string) {
  const ctx = contextRouter.ingestRawContext({
    source: 'manual',
    text: clip,
    appPackage: activeHostPackage.value
  });
  if (ctx) {
    ctx.source = 'clipboard';
    activeResolution.value = contextRouter.resolveSuggestions(ctx);
    currentView.value = 'nextmove';
  }
}

// --- Keystroke & Typing Handlers ---

function handleKey(char: string) {
  triggerHaptic('light');
  if (stealthMode.value) {
    stealthBuffer.value += char;
    return;
  }

  // Autocorrect & personal dictionary learning on word boundary
  if (char === ' ' || char === '.' || char === ',' || char === '!' || char === '?') {
    const match = typedBuffer.value.match(/([a-zA-Z']+)$/);
    if (match) {
      const lastWord = match[1];
      const corrected = predictive.autocorrect(lastWord);
      if (corrected && corrected !== lastWord) {
        for (let i = 0; i < lastWord.length; i++) {
          deleteCharacter();
        }
        typedBuffer.value = typedBuffer.value.slice(0, -lastWord.length) + corrected + char;
        commitToChat(corrected + char);
        return;
      } else {
        predictive.learnWord(lastWord);
      }
    }
  }

  typedBuffer.value += char;
  commitToChat(char);
}

function handleBackspace() {
  triggerHaptic('light');
  if (stealthMode.value) {
    if (stealthBuffer.value.length > 0) {
      stealthBuffer.value = stealthBuffer.value.slice(0, -1);
    }
    return;
  }
  if (typedBuffer.value.length > 0) {
    typedBuffer.value = typedBuffer.value.slice(0, -1);
  }
  deleteCharacter();
}

function handleAutocomplete(word: string) {
  triggerHaptic('click');
  if (stealthMode.value) {
    const buf = stealthBuffer.value;
    const words = buf.trim().split(/\s+/);
    const prefix = buf.endsWith(' ')
      ? buf
      : (words.length > 1 ? words.slice(0, -1).join(' ') + ' ' : '');
    stealthBuffer.value = `${prefix}${word} `;
    return;
  }

  const buf = typedBuffer.value;
  const words = buf.trim().split(/\s+/);
  if (!buf.endsWith(' ') && words.length > 0) {
    const lastWord = words[words.length - 1];
    for (let i = 0; i < lastWord.length; i++) {
      deleteCharacter();
    }
  }
  commitToChat(word + ' ');
  typedBuffer.value =
    (buf.endsWith(' ') ? buf : (words.length > 1 ? words.slice(0, -1).join(' ') + ' ' : '')) +
    word +
    ' ';
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
  contextRouter.recordCommittedReply(improved);
  commitToChat(improved);
  typedBuffer.value = improved;
  currentView.value = 'qwerty';
}

export function App() {
  return html`
    <div class="rizz-app">
      ${ActionRibbon({
        activeContext: pendingContext,
        stealthMode,
        onOpenContextReplies: () => {
          if (pendingContext.value) openRepliesForContext(pendingContext.value);
        },
        onScanScreen: handleLiveScreenScan,
        onToggleStealth: toggleStealthMode,
        onToggleRoast: () => {
          if (currentView.value === 'roast') {
            currentView.value = 'qwerty';
          } else {
            runDraftRoast();
          }
        },
        onToggleClipboard: () =>
          (currentView.value = currentView.value === 'clipboard' ? 'qwerty' : 'clipboard'),
        onToggleEmojis: () =>
          (currentView.value = currentView.value === 'emojis' ? 'qwerty' : 'emojis'),
        onVoiceInput: () => {
          triggerHaptic('click');
          startVoiceTyping();
        },
        onSwitchKeyboard: () => {
          triggerHaptic('click');
          showInputMethodPicker();
        },
        onToggleTextEdit: () =>
          (currentView.value = currentView.value === 'textedit' ? 'qwerty' : 'textedit'),
        onToggleHelp: () =>
          (currentView.value = currentView.value === 'help' ? 'qwerty' : 'help')
      })}

      ${() =>
        stealthMode.value
          ? StealthContextBar({
              buffer: stealthBuffer,
              hint: stealthHint,
              showEnableScanner: showEnableScannerLink,
              onGenerate: generateFromStealthBuffer,
              onEnableScanner: () => openNativeSetting('accessibility'),
              onCancel: () => {
                stealthMode.value = false;
                stealthHint.value = null;
                showEnableScannerLink.value = false;
              }
            })
          : ''}

      ${SuggestionStrip({
        suggestions: activeSuggestions,
        onSelectSuggestion: handleAutocomplete
      })}

      ${() => {
        const view = currentView.value;
        if (view === 'nextmove') {
          return NextMovePanel({
            resolution: activeResolution,
            onSelectReply: applyNextMoveReply,
            onSwitchToStealth: () => {
              stealthBuffer.value = activeResolution.value?.context.partnerText ?? '';
              enterStealthMode();
            },
            onClose: () => (currentView.value = 'qwerty')
          });
        }
        if (view === 'emojis') {
          return EmojiPanel({
            onSelectEmoji: handleKey,
            onClose: () => (currentView.value = 'qwerty')
          });
        }
        if (view === 'clipboard') {
          return ClipboardPanel({
            history: clipboardHistory,
            onSelectClip: clip => {
              contextRouter.recordCommittedReply(clip);
              commitToChat(clip);
              currentView.value = 'qwerty';
            },
            onAnalyzeClip: clip => {
              triggerHaptic('heavy');
              analyzeClipboardBubble(clip);
            },
            onDeleteClip: clip => {
              triggerHaptic('light');
              clipboardHistory.value = clipboardHistory.value.filter(c => c !== clip);
            },
            onClearAll: () => {
              triggerHaptic('click');
              clipboardHistory.value = [];
            },
            onClose: () => (currentView.value = 'qwerty')
          });
        }
        if (view === 'roast') {
          return RoastPanel({
            roast: currentRoast,
            onApplyUpgrade: acceptRoastFix,
            onClose: () => (currentView.value = 'qwerty')
          });
        }
        if (view === 'textedit') {
          return TextEditPanel({
            onBackspace: handleBackspace,
            onClose: () => (currentView.value = 'qwerty')
          });
        }
        if (view === 'help') {
          return HelpPanel({
            onClose: () => (currentView.value = 'qwerty')
          });
        }
        return QwertyGrid({
          stealthMode,
          onKeyPress: handleKey,
          onBackspace: handleBackspace,
          onSend: () => {
            if (stealthMode.value) {
              generateFromStealthBuffer();
            } else {
              triggerHaptic('heavy');
              sendAction();
            }
          },
          onOpenEmojis: () => (currentView.value = 'emojis'),
          onMoveCursor: (delta: number) => {
            triggerHaptic('light');
            moveCursor(delta);
          },
          onDeleteWord: () => {
            triggerHaptic('heavy');
            const m = typedBuffer.value.match(/(\S+\s*)$/);
            const count = m ? m[1].length : 1;
            typedBuffer.value = typedBuffer.value.slice(0, -count);
            for (let i = 0; i < count; i++) {
              deleteCharacter();
            }
          },
          onSwipeUpSpace: () => {
            triggerHaptic('click');
            if (pendingContext.value) {
              openRepliesForContext(pendingContext.value);
            } else {
              handleLiveScreenScan();
            }
          }
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
