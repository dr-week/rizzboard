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
  onToggleTalks: () => void;
  onCycleHeight: () => void;
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
        ${mountTemplate(Icons.mic())}
      </button>
      <button class="action-pill" @click=${options.onScanScreen} title="Scan Screen">
        ${mountTemplate(Icons.scan())}
      </button>
      <button
        class=${() => options.stealthMode.value ? 'action-pill active-mode' : 'action-pill'}
        @click=${options.onToggleStealth}
        title="Tell Rizz">
        ${mountTemplate(Icons.chat())}
      </button>
      <button class="action-pill" @click=${options.onToggleRoast} title="Roast Draft">
        ${mountTemplate(Icons.flame())}
      </button>
      <button class="action-pill" @click=${options.onToggleClipboard} title="Clipboard">
        ${mountTemplate(Icons.clipboard())}
      </button>
      <button class="action-pill" @click=${options.onToggleEmojis} title="Emojis">
        ${mountTemplate(Icons.emoji())}
      </button>
      <button class="action-pill" @click=${options.onToggleTalks} title="Rizz Talks">
        ${mountTemplate(Icons.talks())}
      </button>
      <button class="action-pill" @click=${options.onToggleHelp} title="Quick Settings">
        ${mountTemplate(Icons.help())}
      </button>
      <button class="action-pill" @click=${options.onSwitchKeyboard} title="Switch Keyboard">
        ${mountTemplate(Icons.globe())}
      </button>
    </div>
  `);
}
