import { html } from '@zuari/dom';

export function ActionRibbon(options: {
  screenshotAlert: { value: string | null };
  onAnalyzeScreenshot: () => void;
  onToggleRoast: () => void;
  onToggleClipboard: () => void;
  onToggleEmojis: () => void;
}) {
  return html`
    <div class="action-bar">
      ${() => options.screenshotAlert.value ? html`
        <button class="action-pill highlight" @click=${options.onAnalyzeScreenshot}>
          📸 Screenshot Detected: Analyze Next Move
        </button>
      ` : null}
      <button class="action-pill" @click=${options.onToggleRoast}>
        🔥 Roast Draft (Rizz Test)
      </button>
      <button class="action-pill" @click=${options.onToggleClipboard}>
        📋 Clipboard
      </button>
      <button class="action-pill" @click=${options.onToggleEmojis}>
        😏 Emojis
      </button>
    </div>
  `;
}
