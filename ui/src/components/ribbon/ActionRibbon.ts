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
  onCycleTheme: () => void;
  onToggleOneHanded: () => void;
  onToggleNumberRow: () => void;
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
        🎙️
      </button>
      <button class="action-pill" @click=${options.onScanScreen} title="Scan Screen">
        👁️
      </button>
      <button
        class=${() => options.stealthMode.value ? 'action-pill active-mode' : 'action-pill'}
        @click=${options.onToggleStealth}
        title="Tell Rizz">
        💬
      </button>
      <button class="action-pill" @click=${options.onToggleRoast} title="Roast Draft">
        🔥
      </button>
      <button class="action-pill" @click=${options.onToggleClipboard} title="Clipboard">
        📋
      </button>
      <button class="action-pill" @click=${options.onToggleEmojis} title="Emojis">
        😏
      </button>
      <button class="action-pill" @click=${options.onToggleTextEdit} title="Text Editing">
        ✂️
      </button>
      <button class="action-pill" @click=${options.onToggleHelp} title="Help & Gestures">
        ❓
      </button>
      <button class="action-pill" @click=${options.onCycleTheme} title="Switch Theme">
        🎨
      </button>
      <button class="action-pill" @click=${options.onToggleOneHanded} title="One-Handed Mode">
        🤚
      </button>
      <button class="action-pill" @click=${options.onToggleNumberRow} title="Number Row">
        🔢
      </button>
      <button class="action-pill" @click=${options.onSwitchKeyboard} title="Switch Keyboard">
        🌐
      </button>
    </div>
  `);
}
