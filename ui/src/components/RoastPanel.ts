import { html } from '@zuari/dom';
import type { DraftAnalysis } from '../../../core/engine/roast-engine.ts';

export function RoastPanel(options: {
  roast: { value: DraftAnalysis | null };
  onApplyUpgrade: (improved: string) => void;
  onClose: () => void;
}) {
  return html`
    <div class="roast-view">
      <div class="roast-badge">
        <span>Score: ${() => options.roast.value ? `${options.roast.value.score}/10 — ${options.roast.value.verdict}` : 'Analyzing...'}</span>
        <button class="back-link" @click=${options.onClose}>Back to typing ✕</button>
      </div>
      <p class="roast-feedback">"${() => options.roast.value ? options.roast.value.feedback : ''}"</p>
      <div class="roast-upgrade" @click=${() => {
        if (options.roast.value) options.onApplyUpgrade(options.roast.value.improved);
      }}>
        <span class="upgrade-tag">1-Tap Upgrade:</span>
        <span class="upgrade-line">${() => options.roast.value ? options.roast.value.improved : ''}</span>
      </div>
    </div>
  `;
}
