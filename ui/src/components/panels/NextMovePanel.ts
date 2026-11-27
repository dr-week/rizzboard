import { html } from '@zuari/dom';
import {
  formatSourceBadge,
  type ContextResolution
} from '../../../../core/index.ts';
import { mountList, mountTemplate } from '../../services/dom-helper.ts';

export function NextMovePanel(options: {
  resolution: { value: ContextResolution | null };
  onSelectReply: (line: string) => void;
  onSwitchToStealth: () => void;
  onClose: () => void;
}) {
  return mountTemplate(html`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${() => options.resolution.value
              ? formatSourceBadge(options.resolution.value.context)
              : '⚡ Next Move'}
          </span>
          <span class="partner-quote">
            "${() => {
              const txt = options.resolution.value?.context.partnerText ?? '';
              return txt.length > 44 ? `${txt.slice(0, 44).trim()}…` : txt;
            }}"
          </span>
        </div>
        <div class="nextmove-actions">
          <button class="back-link" @click=${options.onSwitchToStealth}>Edit</button>
          <button class="back-link" @click=${options.onClose}>Close ✕</button>
        </div>
      </div>

      ${() => {
        const res = options.resolution.value;
        if (!res || res.suggestions.length === 0) {
          return mountTemplate(html`
            <div class="roast-feedback">Tap "Tell Rizz" or "Scan Screen" to load chat context.</div>
          `);
        }
        return mountList(
          'nextmove-cards',
          res.suggestions.map(item => html`
            <div class="vibe-card" @click=${() => options.onSelectReply(item.line)}>
              <span class="vibe-tag vibe-${item.vibe.toLowerCase()}">${item.vibe}</span>
              <span class="vibe-line">${item.line}</span>
            </div>
          `)
        );
      }}
    </div>
  `);
}
