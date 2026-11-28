import { html } from '@zuari/dom';
import {
  formatAlertPillText,
  type ConversationContext
} from '../../../../core/index.ts';
import { mountTemplate } from '../../services/dom-helper.ts';
import { Icons } from '../../services/icons.ts';

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
        ${Icons.mic()}
      </button>
      <button class="action-pill" @click=${options.onScanScreen} title="Scan Screen">
        ${Icons.scan()}
      </button>
      <button
        class=${() => options.stealthMode.value ? 'action-pill active-mode' : 'action-pill'}
        @click=${options.onToggleStealth}
        title="Tell Rizz">
        ${Icons.chat()}
      </button>
      <button class="action-pill" @click=${options.onToggleRoast} title="Roast Draft">
        ${Icons.flame()}
      </button>
      <button class="action-pill" @click=${options.onToggleClipboard} title="Clipboard">
        ${Icons.clipboard()}
      </button>
      <button class="action-pill" @click=${options.onToggleEmojis} title="Emojis">
        ${Icons.emoji()}
      </button>
      <button class="action-pill" @click=${options.onToggleTextEdit} title="Text Editing">
        ${Icons.edit()}
      </button>
      <button class="action-pill" @click=${options.onToggleHelp} title="Help & Gestures">
        ${Icons.help()}
      </button>
      <button class="action-pill" @click=${options.onCycleTheme} title="Switch Theme">
        ${Icons.theme()}
      </button>
      <button class="action-pill" @click=${options.onToggleOneHanded} title="One-Handed Mode">
        ${Icons.oneHanded()}
      </button>
      <button class="action-pill" @click=${options.onToggleNumberRow} title="Number Row">
        ${Icons.numbers()}
      </button>
      <button class="action-pill" @click=${options.onSwitchKeyboard} title="Switch Keyboard">
        ${Icons.globe()}
      </button>
    </div>
  `);
}
