import { signal } from '@zuari/signals';
import { html } from '@zuari/dom';
import { EMOJI_CATEGORIES } from '../../../../core/index.ts';
import { mountList, mountTemplate } from '../../services/dom-helper.ts';

const RECENT_STORAGE_KEY = 'rizzboard_recent_emojis';

function loadRecentEmojis(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return ['😏', '🔥', '❤️', '😂', '✨', '👀', '💯', '🥂'];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['😏', '🔥', '❤️', '😂'];
  } catch {
    return ['😏', '🔥', '❤️', '😂'];
  }
}

function saveRecentEmoji(emoji: string) {
  try {
    const current = loadRecentEmojis().filter(e => e !== emoji);
    const updated = [emoji, ...current].slice(0, 16);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export function EmojiPanel(options: {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}) {
  const selectedCategory = signal<number>(0); // 0 = Recent, 1..N = EMOJI_CATEGORIES
  const searchQuery = signal<string>('');
  const recentEmojis = signal<string[]>(loadRecentEmojis());

  const handlePick = (emoji: string) => {
    saveRecentEmoji(emoji);
    recentEmojis.value = loadRecentEmojis();
    options.onSelectEmoji(emoji);
  };

  const tabsRow = document.createElement('div');
  tabsRow.className = 'emoji-tabs';

  // Recent tab
  tabsRow.appendChild(
    mountTemplate(html`
      <button
        class=${() => selectedCategory.value === 0 ? 'emoji-tab active' : 'emoji-tab'}
        @click=${() => {
          searchQuery.value = '';
          selectedCategory.value = 0;
        }}>
        🕒
      </button>
    `)
  );

  EMOJI_CATEGORIES.forEach((cat, idx) => {
    const tabIdx = idx + 1;
    tabsRow.appendChild(
      mountTemplate(html`
        <button
          class=${() => tabIdx === selectedCategory.value ? 'emoji-tab active' : 'emoji-tab'}
          @click=${() => {
            searchQuery.value = '';
            selectedCategory.value = tabIdx;
          }}>
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
      <div class="emoji-search-bar" style="padding: 4px 8px;">
        <input
          type="text"
          class="stealth-input"
          placeholder="Search emojis (e.g. love, food, fire, gesture)..."
          .value=${() => searchQuery.value}
          @input=${(e: Event) => {
            searchQuery.value = (e.target as HTMLInputElement).value;
          }}
          style="width: 100%; padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.25); color: inherit; font-size: 13px;"
        />
      </div>
      ${tabsRow}
      ${() => {
        const q = searchQuery.value.trim().toLowerCase();
        let emojis: string[];
        if (q) {
          const matchedCats = EMOJI_CATEGORIES.filter(c => c.name.toLowerCase().includes(q));
          emojis = matchedCats.length > 0
            ? matchedCats.flatMap(c => c.emojis)
            : EMOJI_CATEGORIES.flatMap(c => c.emojis);
        } else if (selectedCategory.value === 0) {
          emojis = recentEmojis.value;
        } else {
          const category = EMOJI_CATEGORIES[selectedCategory.value - 1] ?? EMOJI_CATEGORIES[0];
          emojis = category.emojis;
        }
        return mountList(
          'emoji-grid',
          emojis.map(e => html`
            <button class="emoji-btn" @click=${() => handlePick(e)}>${e}</button>
          `)
        );
      }}
    </div>
  `);
}
