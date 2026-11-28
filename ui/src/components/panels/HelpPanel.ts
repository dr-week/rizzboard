import { html } from '@zuari/dom';
import { mountTemplate } from '../../services/dom-helper.ts';
import { openNativeSetting } from '../../services/bridge-service.ts';

const GUIDE_ITEMS = [
  { icon: '✨', title: 'Auto Chat Replies', desc: 'Opens automatically when a chat is detected, or swipe up on Spacebar.' },
  { icon: '🔢', title: 'Long-Press Numbers & Symbols', desc: 'Hold q–p for 1–0, or hold a–m for @ # $ % & - + ( ) * " \' : ; ! ?' },
  { icon: '⌫', title: 'Swipe Left / Hold Backspace', desc: 'Hold ⌫ to repeat-delete, or swipe left on ⌫ to delete a whole word.' },
  { icon: '↔️', title: 'Spacebar Cursor Scrub', desc: 'Slide your finger left or right on Spacebar to move the cursor.' },
  { icon: '🎙️', title: 'Google Voice Typing', desc: 'Tap Mic in the top bar for instant voice dictation.' },
  { icon: '✂️', title: 'Text Editing & D-Pad', desc: 'Tap ✂️ for Select All, Copy, Cut, Paste, and arrow keys.' },
  { icon: '📋', title: 'Clipboard & Emoji Search', desc: 'Pin/delete clips in 📋, or search 250+ emojis in 😏.' }
];

export function HelpPanel(options: { onClose: () => void }) {
  return mountTemplate(html`
    <div class="help-view" style="padding: 8px; max-height: 220px; overflow-y: auto;">
      <div class="clipboard-header" style="margin-bottom: 6px;">
        <span>RizzBoard Gestures & Guide</span>
        <div style="display:flex; gap:8px;">
          <button class="back-link" @click=${() => openNativeSetting('setup')}>⚙ Setup</button>
          <button class="back-link" @click=${options.onClose}>ABC ✕</button>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${GUIDE_ITEMS.map(item => html`
          <div class="help-card">
            <span style="font-size: 16px; min-width: 24px; text-align: center;">${item.icon}</span>
            <div>
              <div style="font-weight: 600; font-size: 12px;">${item.title}</div>
              <div style="opacity: 0.72; font-size: 11px;">${item.desc}</div>
            </div>
          </div>
        `)}
      </div>
    </div>
  `);
}
