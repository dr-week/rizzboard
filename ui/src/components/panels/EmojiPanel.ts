import { signal } from '@zuari/signals';
import { html } from '@zuari/dom';
import { EMOJI_CATEGORIES } from '../../../../core/index.ts';
import { mountList, mountTemplate } from '../../services/dom-helper.ts';

export function EmojiPanel(options: {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}) {
  const selectedCategory = signal<number>(0);

  const tabsRow = document.createElement('div');
  tabsRow.className = 'emoji-tabs';
  EMOJI_CATEGORIES.forEach((cat, idx) => {
    tabsRow.appendChild(
      mountTemplate(html`
        <button
          class=${() => idx === selectedCategory.value ? 'emoji-tab active' : 'emoji-tab'}
          @click=${() => selectedCategory.value = idx}>
          ${cat.icon}
        </button>
      `)
    );
  });
  tabsRow.appendChild(
    mountTemplate(html`<button class="emoji-tab back-key" @click=${options.onClose}>ABC</button>`)
  );

  return mountTemplate(html`
    <div class="emoji-view">
      ${tabsRow}
      ${() => {
        const category = EMOJI_CATEGORIES[selectedCategory.value] ?? EMOJI_CATEGORIES[0];
        return mountList(
          'emoji-grid',
          category.emojis.map(e => html`
            <button class="emoji-btn" @click=${() => options.onSelectEmoji(e)}>${e}</button>
          `)
        );
      }}
    </div>
  `);
}
