import { html } from '@zuari/dom';
import { mountTemplate } from '../../services/dom-helper.ts';

export function StealthContextBar(options: {
  buffer: { value: string };
  hint: { value: string | null };
  showEnableScanner: { value: boolean };
  onGenerate: () => void;
  onEnableScanner: () => void;
  onCancel: () => void;
}) {
  return mountTemplate(html`
    <div class="stealth-bar">
      <div class="stealth-top">
        <span class="stealth-badge">🛡️ STEALTH MODE · Hidden from chat</span>
        <div class="stealth-actions">
          ${() => options.showEnableScanner.value
            ? mountTemplate(html`
                <button class="stealth-link" @click=${options.onEnableScanner}>
                  Enable Scanner ⚙
                </button>
              `)
            : ''}
          <button class="back-link" @click=${options.onCancel}>Cancel ✕</button>
        </div>
      </div>
      <div class="stealth-input-row">
        <div class="stealth-preview">
          ${() => options.buffer.value
            ? options.buffer.value
            : (options.hint.value ?? 'Type what they said or asked (e.g. "asked my red flag")…')}
        </div>
        <button class="stealth-go-btn" @click=${options.onGenerate}>
          ⚡ Replies
        </button>
      </div>
    </div>
  `);
}
