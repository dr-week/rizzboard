import {
  HybridContextRouter,
  analyzeDraftLocal,
  formatSourceBadge,
  type ContextResolution
} from '../../../../core/index.ts';
import { findActiveComposer, isComposerElement, scanDomChatBlocks } from '../adapters/site-adapters.ts';
import { commitTextToComposer, readComposerDraft } from '../injector/text-committer.ts';
import { SHADOW_WIDGET_CSS } from './shadow-styles.ts';

export class FloatingWingmanWidget {
  private readonly router = new HybridContextRouter();
  private hostEl: HTMLDivElement;
  private shadow: ShadowRoot;
  private isOpen = false;
  private activeTab: 'reply' | 'roast' = 'reply';
  private activeComposer: HTMLElement | null = null;
  private resolution: ContextResolution | null = null;
  private manualContext = '';
  private statusText = 'Click any card to insert directly into chat';
  private selectionChip: HTMLButtonElement | null = null;
  private selectionTimer: number | null = null;

  constructor() {
    this.hostEl = document.createElement('div');
    this.hostEl.id = 'rizzboard-wingman-host';
    this.shadow = this.hostEl.attachShadow({ mode: 'open' });
    document.documentElement.appendChild(this.hostEl);

    document.addEventListener('focusin', e => {
      const target = e.target as Element | null;
      if (isComposerElement(target)) {
        this.activeComposer = target;
      }
    });

    this.render();
  }

  public setVisible(enabled: boolean): void {
    this.hostEl.style.display = enabled ? 'block' : 'none';
  }

  public togglePanel(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && !this.resolution) {
      this.scanChatNow();
    } else {
      this.render();
    }
  }

  public openWithSelection(text: string): void {
    this.clearSelectionChip();
    const ctx = this.router.ingestRawContext({
      source: 'selection',
      text,
      appPackage: location.hostname
    });
    if (ctx) {
      this.manualContext = ctx.partnerText;
      this.resolution = this.router.resolveSuggestions(ctx);
      this.activeTab = 'reply';
      this.isOpen = true;
      this.render();
    }
  }

  public showSelectionTrigger(text: string, rect: DOMRect): void {
    this.clearSelectionChip();
    const btn = document.createElement('button');
    btn.className = 'rb-selection-pill';
    btn.textContent = '⚡ Rizz Reply';
    btn.style.top = `${Math.max(8, rect.top - 34)}px`;
    btn.style.left = `${Math.min(window.innerWidth - 110, Math.max(8, rect.left))}px`;
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      this.openWithSelection(text);
    });
    this.shadow.appendChild(btn);
    this.selectionChip = btn;
    this.selectionTimer = window.setTimeout(() => this.clearSelectionChip(), 4500);
  }

  private clearSelectionChip(): void {
    if (this.selectionTimer) {
      clearTimeout(this.selectionTimer);
      this.selectionTimer = null;
    }
    if (this.selectionChip) {
      this.selectionChip.remove();
      this.selectionChip = null;
    }
  }

  private scanChatNow(): void {
    const blocks = scanDomChatBlocks();
    const ctx = this.router.ingestScreenBlocks(blocks, 'dom', {
      appPackage: location.hostname
    });
    if (ctx) {
      this.manualContext = ctx.partnerText;
      this.resolution = this.router.resolveSuggestions(ctx);
      this.statusText = 'Scanned latest incoming chat bubble';
    } else {
      const fallback = this.router.ingestRawContext({
        source: 'manual',
        text: this.manualContext || 'start playful conversation',
        appPackage: location.hostname
      });
      if (fallback) {
        this.resolution = this.router.resolveSuggestions(fallback);
      }
      this.statusText = 'Type partner message above for tailored banter';
    }
    this.render();
  }

  private insertOrCopy(line: string, replace = false): void {
    this.router.recordCommittedReply(line);
    const composer = findActiveComposer(this.activeComposer);
    const committed = commitTextToComposer(composer, line, replace);
    if (committed) {
      this.statusText = '✓ Inserted into chat input';
    } else {
      navigator.clipboard?.writeText(line).catch(() => {});
      this.statusText = '✓ Copied to clipboard (focus chat input to auto-insert)';
    }
    this.render();
  }

  private render(): void {
    this.shadow.innerHTML = '';
    const style = document.createElement('style');
    style.textContent = SHADOW_WIDGET_CSS;
    this.shadow.appendChild(style);

    const dock = document.createElement('div');
    dock.className = 'rb-dock';

    if (this.isOpen) {
      dock.appendChild(this.buildPanel());
    }

    const trigger = document.createElement('button');
    trigger.className = 'rb-trigger';
    trigger.innerHTML = `<span class="rb-dot"></span><span>${this.isOpen ? 'Close RizzBoard' : '⚡ RizzBoard'}</span>`;
    trigger.addEventListener('click', () => this.togglePanel());
    dock.appendChild(trigger);

    this.shadow.appendChild(dock);
  }

  private buildPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'rb-panel';

    const head = document.createElement('div');
    head.className = 'rb-head';
    const badgeLabel = this.resolution ? formatSourceBadge(this.resolution.context) : '⚡ Wingman';
    head.innerHTML = `
      <div class="rb-title">
        <span>RizzBoard Web</span>
        <span class="rb-badge">${this.escape(badgeLabel)}</span>
      </div>
    `;
    const closeBtn = document.createElement('button');
    closeBtn.className = 'rb-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => {
      this.isOpen = false;
      this.render();
    });
    head.appendChild(closeBtn);
    panel.appendChild(head);

    const tabs = document.createElement('div');
    tabs.className = 'rb-tabs';
    const replyTab = document.createElement('button');
    replyTab.className = `rb-tab ${this.activeTab === 'reply' ? 'active' : ''}`;
    replyTab.textContent = '⚡ Next Move';
    replyTab.addEventListener('click', () => {
      this.activeTab = 'reply';
      this.render();
    });

    const roastTab = document.createElement('button');
    roastTab.className = `rb-tab ${this.activeTab === 'roast' ? 'active' : ''}`;
    roastTab.textContent = '🔥 Roast Draft';
    roastTab.addEventListener('click', () => {
      this.activeTab = 'roast';
      this.render();
    });
    tabs.append(replyTab, roastTab);
    panel.appendChild(tabs);

    if (this.activeTab === 'reply') {
      const inputRow = document.createElement('div');
      inputRow.className = 'rb-input-row';

      const input = document.createElement('input');
      input.className = 'rb-input';
      input.placeholder = 'Partner message or prompt…';
      input.value = this.manualContext;
      input.addEventListener('input', () => {
        this.manualContext = input.value;
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this.generateManual();
      });

      const scanBtn = document.createElement('button');
      scanBtn.className = 'rb-btn secondary';
      scanBtn.title = 'Scan chat bubbles on page';
      scanBtn.textContent = '👁️ Scan';
      scanBtn.addEventListener('click', () => this.scanChatNow());

      const goBtn = document.createElement('button');
      goBtn.className = 'rb-btn';
      goBtn.textContent = 'Go';
      goBtn.addEventListener('click', () => this.generateManual());

      inputRow.append(input, scanBtn, goBtn);
      panel.appendChild(inputRow);

      const cards = document.createElement('div');
      cards.className = 'rb-cards';
      for (const s of this.resolution?.suggestions ?? []) {
        const card = document.createElement('div');
        card.className = 'rb-card';
        card.innerHTML = `
          <span class="rb-vibe ${s.vibe.toLowerCase()}">${s.vibe}</span>
          <span class="rb-line">${this.escape(s.line)}</span>
        `;
        card.addEventListener('click', () => this.insertOrCopy(s.line, false));
        cards.appendChild(card);
      }
      panel.appendChild(cards);
    } else {
      const composer = findActiveComposer(this.activeComposer);
      const draft = readComposerDraft(composer) || this.manualContext;
      const analysis = analyzeDraftLocal(draft);

      const scoreCard = document.createElement('div');
      scoreCard.className = 'rb-card';
      scoreCard.innerHTML = `
        <span class="rb-vibe bold">Score: ${analysis.score}/10 · ${analysis.verdict}</span>
        <span class="rb-line">"${this.escape(analysis.feedback)}"</span>
      `;
      panel.appendChild(scoreCard);

      const upgradeCard = document.createElement('div');
      upgradeCard.className = 'rb-card';
      upgradeCard.innerHTML = `
        <span class="rb-vibe smooth">1-Click Upgrade (Click to Replace)</span>
        <span class="rb-line">${this.escape(analysis.improved)}</span>
      `;
      upgradeCard.addEventListener('click', () => this.insertOrCopy(analysis.improved, true));
      panel.appendChild(upgradeCard);
    }

    const foot = document.createElement('div');
    foot.className = 'rb-foot';
    foot.innerHTML = `<span>${this.escape(this.statusText)}</span><span>Alt+R</span>`;
    panel.appendChild(foot);

    return panel;
  }

  private generateManual(): void {
    const ctx = this.router.ingestRawContext({
      source: 'manual',
      text: this.manualContext || 'start playful conversation',
      appPackage: location.hostname
    });
    if (ctx) {
      this.resolution = this.router.resolveSuggestions(ctx);
      this.statusText = 'Generated 3 fresh vibes (<1ms)';
      this.render();
    }
  }

  private escape(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
