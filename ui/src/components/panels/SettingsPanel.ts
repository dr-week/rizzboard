import { html } from '@zuari/dom';
import { mountTemplate } from '../../services/dom-helper.ts';
import { Icons } from '../../services/icons.ts';

export function SettingsPanel(options: {
  theme: { value: string };
  oneHanded: { value: string };
  height: { value: string };
  numberRow: { value: boolean };
  onCycleTheme: () => void;
  onToggleOneHanded: () => void;
  onCycleHeight: () => void;
  onToggleNumberRow: () => void;
  onOpenTextEdit: () => void;
  onOpenHelp: () => void;
  onClose: () => void;
}) {
  return mountTemplate(html`
    <div class="clipboard-view" style="padding: 8px;">
      <div class="clipboard-header" style="margin-bottom: 8px;">
        <span>Quick Settings</span>
        <button class="back-link" @click=${options.onClose}>ABC ✕</button>
      </div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px;">
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${options.onCycleTheme}>
          ${mountTemplate(Icons.theme())}
          <span>${() => options.theme.value}</span>
        </button>
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${options.onToggleOneHanded}>
          ${mountTemplate(Icons.oneHanded())}
          <span>${() => options.oneHanded.value}</span>
        </button>
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${options.onCycleHeight}>
          ${mountTemplate(Icons.height())}
          <span>${() => options.height.value}</span>
        </button>
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${options.onToggleNumberRow}>
          ${mountTemplate(Icons.numbers())}
          <span>${() => options.numberRow.value ? '1-0: ON' : '1-0: OFF'}</span>
        </button>
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${options.onOpenTextEdit}>
          ${mountTemplate(Icons.edit())}
          <span>Text Edit</span>
        </button>
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${options.onOpenHelp}>
          ${mountTemplate(Icons.help())}
          <span>Guide</span>
        </button>
      </div>
    </div>
  `);
}
