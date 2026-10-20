import { html } from '@zuari/dom';

export function QwertyGrid(options: {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSend: () => void;
  onOpenEmojis: () => void;
}) {
  const row1 = ['q','w','e','r','t','y','u','i','o','p'];
  const row2 = ['a','s','d','f','g','h','j','k','l'];
  const row3 = ['z','x','c','v','b','n','m'];

  return html`
    <div class="keyboard-grid">
      <div class="keyboard-row">
        ${row1.map(k => html`<button class="key-btn" @click=${() => options.onKeyPress(k)}>${k}</button>`)}
      </div>
      <div class="keyboard-row">
        ${row2.map(k => html`<button class="key-btn" @click=${() => options.onKeyPress(k)}>${k}</button>`)}
      </div>
      <div class="keyboard-row">
        <button class="key-btn special" @click=${options.onOpenEmojis}>123</button>
        ${row3.map(k => html`<button class="key-btn" @click=${() => options.onKeyPress(k)}>${k}</button>`)}
        <button class="key-btn special" @click=${options.onBackspace}>⌫</button>
      </div>
      <div class="keyboard-row">
        <button class="key-btn special" @click=${options.onOpenEmojis}>😏</button>
        <button class="key-btn special" @click=${() => options.onKeyPress(',')}>,</button>
        <button class="key-btn space" @click=${() => options.onKeyPress(' ')}>space</button>
        <button class="key-btn special" @click=${() => options.onKeyPress('.')}>.</button>
        <button class="key-btn send" @click=${options.onSend}>Send</button>
      </div>
    </div>
  `;
}
