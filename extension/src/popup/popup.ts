import {
  RizzEngine,
  analyzeDraftLocal,
  OFFLINE_VAULT
} from '../../../core/index.ts';

declare const chrome: any;

const engine = new RizzEngine();

const partnerInput = document.getElementById('partner-input') as HTMLInputElement;
const generateBtn = document.getElementById('generate-replies-btn') as HTMLButtonElement;
const repliesList = document.getElementById('replies-list') as HTMLDivElement;

const draftInput = document.getElementById('draft-input') as HTMLInputElement;
const roastBtn = document.getElementById('run-roast-btn') as HTMLButtonElement;
const roastOutput = document.getElementById('roast-output') as HTMLDivElement;

const vaultSearch = document.getElementById('vault-search') as HTMLInputElement;
const vaultList = document.getElementById('vault-list') as HTMLDivElement;

const hudToggle = document.getElementById('hud-enabled-toggle') as HTMLInputElement;
const copyToast = document.getElementById('copy-toast') as HTMLSpanElement;

function copyLine(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {});
  copyToast.textContent = '✓ Copied to clipboard!';
  setTimeout(() => {
    copyToast.textContent = 'Click any card to copy · Alt+R in chats';
  }, 1800);
}

function renderReplies(contextText: string) {
  const suggestions = engine.generateOfflineSuggestions(contextText || 'weekend drinks');
  repliesList.innerHTML = '';
  for (const item of suggestions) {
    const card = document.createElement('div');
    card.className = 'reply-card';
    card.innerHTML = `
      <span class="tag ${item.vibe.toLowerCase()}">${item.vibe}</span>
      <span class="line-text"></span>
    `;
    (card.querySelector('.line-text') as HTMLElement).textContent = item.line;
    card.addEventListener('click', () => copyLine(item.line));
    repliesList.appendChild(card);
  }
}

function renderRoast(draft: string) {
  const res = analyzeDraftLocal(draft);
  roastOutput.innerHTML = '';

  const verdictCard = document.createElement('div');
  verdictCard.className = 'reply-card';
  verdictCard.innerHTML = `
    <span class="tag bold">Score: ${res.score}/10 — ${res.verdict}</span>
    <span class="line-text"></span>
  `;
  (verdictCard.querySelector('.line-text') as HTMLElement).textContent = `"${res.feedback}"`;

  const upgradeCard = document.createElement('div');
  upgradeCard.className = 'reply-card';
  upgradeCard.innerHTML = `
    <span class="tag smooth">1-Click Upgrade (Click to Copy)</span>
    <span class="line-text"></span>
  `;
  (upgradeCard.querySelector('.line-text') as HTMLElement).textContent = res.improved;
  upgradeCard.addEventListener('click', () => copyLine(res.improved));

  roastOutput.append(verdictCard, upgradeCard);
}

function renderVault(query: string) {
  const q = query.toLowerCase().trim();
  const filtered = OFFLINE_VAULT.filter(entry => {
    if (!q) return true;
    return (
      entry.template.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q) ||
      entry.triggerKeywords.some(k => k.includes(q))
    );
  });

  vaultList.innerHTML = '';
  for (const item of filtered) {
    const card = document.createElement('div');
    card.className = 'reply-card';
    card.innerHTML = `
      <span class="tag ${item.vibe}">${item.category} · ${item.vibe}</span>
      <span class="line-text"></span>
    `;
    (card.querySelector('.line-text') as HTMLElement).textContent = item.template;
    card.addEventListener('click', () => copyLine(item.template));
    vaultList.appendChild(card);
  }
}

// Tab switching
document.querySelectorAll<HTMLButtonElement>('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`pane-${target}`)?.classList.add('active');
  });
});

generateBtn.addEventListener('click', () => renderReplies(partnerInput.value));
partnerInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') renderReplies(partnerInput.value);
});

roastBtn.addEventListener('click', () => renderRoast(draftInput.value));
draftInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') renderRoast(draftInput.value);
});

vaultSearch.addEventListener('input', () => renderVault(vaultSearch.value));

if (typeof chrome !== 'undefined' && chrome.storage?.local) {
  chrome.storage.local.get(['wingmanEnabled', 'lastSelectedContext'], (res: any) => {
    hudToggle.checked = res?.wingmanEnabled !== false;
    if (res?.lastSelectedContext?.text) {
      partnerInput.value = res.lastSelectedContext.text;
      renderReplies(res.lastSelectedContext.text);
    } else {
      renderReplies('What is your biggest red flag?');
    }
  });

  hudToggle.addEventListener('change', () => {
    chrome.storage.local.set({ wingmanEnabled: hudToggle.checked });
  });
} else {
  renderReplies('What is your biggest red flag?');
}

renderRoast('hey how was your day');
renderVault('');
