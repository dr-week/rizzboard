import { signal } from '@zuari/signals';
import { html } from '@zuari/dom';
import { EMOJI_CATEGORIES } from '../../../core/vault/emoji-data.ts';

export function EmojiPanel(options: {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}) {
  const selectedCategory = signal<number>(0);

  return html`
    <div class="emoji-view">
      <div class="emoji-tabs">
        ${EMOJI_CATEGORIES.map((cat, idx) => html`
          <button class="emoji-tab ${() => idx === selectedCategory.value ? 'active' : ''}"
                  @click=${() => selectedCategory.value = idx}>
            ${cat.icon}
          </button>
        `)}
        <button class="emoji-tab back-key" @click=${options.onClose}>ABC</button>
      </div>
      <div class="emoji-grid">
        ${() => {
          const category = EMOJI_CATEGORIES[selectedCategory.value] ?? EMOJI_CATEGORIES[0];
          return category.emojis.map(e => html`
            <button class="emoji-btn" @click=${() => options.onSelectEmoji(e)}>${e}</button>
          `);
        }}
      </div>
    </div>
  `;
}
