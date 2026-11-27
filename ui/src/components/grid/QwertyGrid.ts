import { html } from '@zuari/dom';
import { mountList, mountTemplate } from '../../services/dom-helper.ts';

export function QwertyGrid(options: {
  stealthMode: { value: boolean };
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSend: () => void;
  onOpenEmojis: () => void;
}) {
  const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  const row3El = document.createElement('div');
  row3El.className = 'keyboard-row';
  row3El.appendChild(
    mountTemplate(html`<button class="key-btn special" @click=${options.onOpenEmojis}>123</button>`)
  );
  for (const k of row3) {
    row3El.appendChild(
      mountTemplate(html`<button class="key-btn" @click=${() => options.onKeyPress(k)}>${k}</button>`)
    );
  }
  row3El.appendChild(
    mountTemplate(html`<button class="key-btn special" @click=${options.onBackspace}>⌫</button>`)
  );

  return mountTemplate(html`
    <div class="keyboard-grid">
      ${mountList(
        'keyboard-row',
        row1.map(k => html`<button class="key-btn" @click=${() => options.onKeyPress(k)}>${k}</button>`)
      )}
      ${mountList(
        'keyboard-row',
        row2.map(k => html`<button class="key-btn" @click=${() => options.onKeyPress(k)}>${k}</button>`)
      )}
      ${row3El}
      <div class="keyboard-row">
        <button class="key-btn special" @click=${options.onOpenEmojis}>😏</button>
        <button class="key-btn special" @click=${() => options.onKeyPress('?')}>?</button>
        <button class="key-btn space" @click=${() => options.onKeyPress(' ')}>
          ${() => options.stealthMode.value ? 'stealth space' : 'space'}
        </button>
        <button class="key-btn special" @click=${() => options.onKeyPress('.')}>.</button>
        <button class="key-btn send" @click=${options.onSend}>
          ${() => options.stealthMode.value ? 'Ask ⚡' : 'Send'}
        </button>
      </div>
    </div>
  `);
}
