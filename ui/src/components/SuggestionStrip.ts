import { html } from '@zuari/dom';

export function SuggestionStrip(options: {
  suggestions: { value: string[] };
  onSelectSuggestion: (word: string) => void;
}) {
  return html`
    <div class="suggestions-panel">
      ${() => options.suggestions.value.map(word => html`
        <div class="suggestion-card" @click=${() => options.onSelectSuggestion(word)}>
          <span class="suggestion-text">${word}</span>
        </div>
      `)}
    </div>
  `;
}
