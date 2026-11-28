import { html } from '@zuari/dom';
import {
  formatAlertPillText,
  type ConversationContext
} from '../../../../core/index.ts';
import { mountTemplate } from '../../services/dom-helper.ts';

export function ActionRibbon(options: {
  activeContext: { value: ConversationContext | null };
  stealthMode: { value: boolean };
  onOpenContextReplies: () => void;
  onScanScreen: () => void;
  onToggleStealth: () => void;
  onToggleRoast: () => void;
  onToggleClipboard: () => void;
  onToggleEmojis: () => void;
  onVoiceInput: () => void;
  onSwitchKeyboard: () => void;
  onToggleTextEdit: () => void;
  onToggleHelp: () => void;
}) {
  return mountTemplate(html`
    <div class="action-bar">
      ${() => options.activeContext.value
        ? mountTemplate(html`
            <button class="action-pill highlight" @click=${options.onOpenContextReplies}>
              ${formatAlertPillText(options.activeContext.value)}
            </button>
          `)
        : ''}
      <button class="action-pill" @click=${options.onVoiceInput} title="Google Voice Typing">
        🎙️ Mic
      </button>
      <button class="action-pill" @click=${options.onScanScreen}>
        👁️ Scan
      </button>
      <button
        class=${() => options.stealthMode.value ? 'action-pill active-mode' : 'action-pill'}
        @click=${options.onToggleStealth}>
        💬 Tell Rizz
      </button>
      <button class="action-pill" @click=${options.onToggleRoast}>
        🔥 Roast
      </button>
      <button class="action-pill" @click=${options.onToggleClipboard}>
        📋 Clipboard
      </button>
      <button class="action-pill" @click=${options.onToggleEmojis}>
        😏 Emojis
      </button>
      <button class="action-pill" @click=${options.onToggleTextEdit} title="Text Editing">
        ✂️
      </button>
      <button class="action-pill" @click=${options.onToggleHelp} title="Help & Gestures">
        ❓
      </button>
      <button class="action-pill" @click=${options.onSwitchKeyboard} title="Switch Keyboard">
        🌐
      </button>
    </div>
  `);
}
