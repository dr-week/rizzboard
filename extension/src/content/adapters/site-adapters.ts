import type { ScreenBlock } from '../../../../core/index.ts';

export interface SiteAdapterConfig {
  hostPattern: RegExp;
  name: string;
  bubbleSelectors: string[];
  composerSelectors: string[];
}

const ADAPTERS: SiteAdapterConfig[] = [
  {
    hostPattern: /whatsapp\.com/i,
    name: 'WhatsApp Web',
    bubbleSelectors: ['div.message-in span.selectable-text', 'div.message-out span.selectable-text'],
    composerSelectors: ['footer div[contenteditable="true"]', 'div[contenteditable="true"][data-tab]']
  },
  {
    hostPattern: /instagram\.com/i,
    name: 'Instagram DM',
    bubbleSelectors: ['div[role="row"] div[dir="auto"]', 'div[data-scope="messages_table"] div[dir="auto"]'],
    composerSelectors: ['div[role="textbox"][contenteditable="true"]', 'textarea[placeholder]']
  },
  {
    hostPattern: /telegram\.org/i,
    name: 'Telegram Web',
    bubbleSelectors: ['.message .text-content', '.bubble-content .message'],
    composerSelectors: ['.input-message-input[contenteditable="true"]', '#editable-message-text']
  },
  {
    hostPattern: /discord\.com/i,
    name: 'Discord',
    bubbleSelectors: ['div[id^="message-content-"]'],
    composerSelectors: ['div[role="textbox"][data-slate-editor="true"]', 'div[role="textbox"][contenteditable="true"]']
  },
  {
    hostPattern: /(tinder|bumble|hinge|x|messenger)\.com/i,
    name: 'Web Chat',
    bubbleSelectors: ['[data-testid*="message"]', 'div[dir="auto"]', 'p'],
    composerSelectors: ['textarea', 'div[role="textbox"][contenteditable="true"]']
  }
];

export function detectAdapter(hostname = location.hostname): SiteAdapterConfig {
  return (
    ADAPTERS.find(a => a.hostPattern.test(hostname)) ?? {
      hostPattern: /.*/,
      name: 'Web Chat',
      bubbleSelectors: ['div[dir="auto"]'],
      composerSelectors: ['textarea', 'div[role="textbox"][contenteditable="true"]', 'input[type="text"]']
    }
  );
}

export function isComposerElement(el: Element | null): el is HTMLElement {
  if (!el || !(el instanceof HTMLElement)) return false;
  if (el.closest('#rizzboard-wingman-host')) return false;
  if (el.tagName === 'TEXTAREA') return true;
  if (el.tagName === 'INPUT') {
    const type = (el as HTMLInputElement).type?.toLowerCase() || 'text';
    return type === 'text' || type === 'search';
  }
  return el.isContentEditable;
}

export function findActiveComposer(preferred?: HTMLElement | null): HTMLElement | null {
  if (preferred && document.contains(preferred) && isComposerElement(preferred)) {
    return preferred;
  }
  const adapter = detectAdapter();
  for (const sel of adapter.composerSelectors) {
    const found = document.querySelector<HTMLElement>(sel);
    if (found && found.offsetParent !== null) return found;
  }
  return null;
}

/**
 * Extracts visible chat bubbles with bounding coordinates for segmentChatBubbles().
 */
export function scanDomChatBlocks(): ScreenBlock[] {
  const adapter = detectAdapter();
  const blocks: ScreenBlock[] = [];
  const viewportWidth = Math.max(window.innerWidth, 720);

  for (const selector of adapter.bubbleSelectors) {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector)).slice(-18);
    for (const node of nodes) {
      if (node.closest('#rizzboard-wingman-host') || isComposerElement(node)) continue;
      const text = (node.innerText || node.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text || text.length < 2 || text.length > 360) continue;

      const rect = node.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 12) continue;

      blocks.push({
        text,
        x: Math.max(0, Math.round(rect.left)),
        y: Math.max(140, Math.round(rect.top)),
        width: Math.round(rect.width),
        screenWidth: viewportWidth
      });
    }
    if (blocks.length > 0) break;
  }

  return blocks;
}
