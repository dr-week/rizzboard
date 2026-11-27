import { html } from '@zuari/dom';
import { mountList, mountTemplate } from '../../services/dom-helper.ts';

export function SuggestionStrip(options: {
  suggestions: { value: string[] };
  onSelectSuggestion: (word: string) => void;
}) {
  return mountTemplate(html`
    <div class="suggestions-shell">
      ${() => mountList(
        'suggestions-panel',
        options.suggestions.value.map(word => html`
          <div class="suggestion-card" @click=${() => options.onSelectSuggestion(word)}>
            <span class="suggestion-text">${word}</span>
          </div>
        `)
      )}
    </div>
  `);
}
