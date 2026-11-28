import { html } from '@zuari/dom';
import { mountTemplate } from '../../services/dom-helper.ts';
import { performEditAction, sendDpad, triggerHaptic } from '../../services/bridge-service.ts';

export function TextEditPanel(options: {
  onBackspace: () => void;
  onClose: () => void;
}) {
  const act = (action: 'selectAll' | 'copy' | 'cut' | 'paste') => {
    triggerHaptic('click');
    performEditAction(action);
  };

  const dpad = (dir: 'left' | 'right' | 'up' | 'down') => {
    triggerHaptic('light');
    sendDpad(dir);
  };

  return mountTemplate(html`
    <div class="clipboard-view" style="padding: 8px;">
      <div class="clipboard-header">
        <span>Text Editing & Cursor Pad</span>
        <button class="back-link" @click=${options.onClose}>ABC ✕</button>
      </div>
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin-bottom:8px;">
        <button class="key-btn special" @click=${() => act('selectAll')}>Select All</button>
        <button class="key-btn special" @click=${() => act('copy')}>Copy</button>
        <button class="key-btn special" @click=${() => act('cut')}>Cut</button>
        <button class="key-btn special" @click=${() => act('paste')}>Paste</button>
      </div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px; max-width: 240px; margin: 0 auto;">
        <div></div>
        <button class="key-btn" @click=${() => dpad('up')}>▲</button>
        <button class="key-btn special" @click=${options.onBackspace}>⌫</button>
        <button class="key-btn" @click=${() => dpad('left')}>◀</button>
        <button class="key-btn" @click=${() => dpad('down')}>▼</button>
        <button class="key-btn" @click=${() => dpad('right')}>▶</button>
      </div>
    </div>
  `);
}
