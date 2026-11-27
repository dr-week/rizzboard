import {
  HybridContextRouter,
  analyzeDraftLocal,
  formatAlertPillText,
  type ConversationContext
} from '../../core/index.ts';

interface SimScenario {
  id: string;
  tabLabel: string;
  contact: string;
  securityBadge: string;
  source: ConversationContext['source'];
  appPackage: string;
  partnerMessage: string;
}

const SCENARIOS: SimScenario[] = [
  {
    id: 'snapchat',
    tabLabel: 'Snapchat · Snitch Guard',
    contact: 'Maya (Snapchat)',
    securityBadge: 'STEALTH NOTIFICATION · NO SCREENSHOT ALERT',
    source: 'notification',
    appPackage: 'com.snapchat.android',
    partnerMessage: 'What is your biggest red flag?'
  },
  {
    id: 'telegram',
    tabLabel: 'Telegram Secret · FLAG_SECURE',
    contact: 'Elena (Secret Chat)',
    securityBadge: 'FLAG_SECURE BLOCKED · BUBBLE SCAN / STEALTH',
    source: 'accessibility',
    appPackage: 'org.telegram.messenger',
    partnerMessage: 'Are you free for drinks this weekend?'
  },
  {
    id: 'webext',
    tabLabel: 'WhatsApp Web · Extension',
    contact: 'Zoe (WhatsApp Web)',
    securityBadge: 'MANIFEST V3 EXTENSION · ALT+R',
    source: 'dom',
    appPackage: 'web.whatsapp.com',
    partnerMessage: 'Are you always this much trouble?'
  }
];

export function initInteractiveSimulator(): void {
  const root = document.getElementById('live-simulator-mount');
  if (!root) return;

  const router = new HybridContextRouter();
  let scenarioIdx = 0;
  let chatLog: Array<{ from: 'partner' | 'me'; text: string }> = [
    { from: 'partner', text: SCENARIOS[0].partnerMessage }
  ];
  let draftText = '';
  let stealthOpen = false;
  let stealthText = '';
  let panelView: 'qwerty' | 'replies' | 'roast' = 'replies';

  const loadScenario = (idx: number) => {
    scenarioIdx = idx;
    const sc = SCENARIOS[idx];
    chatLog = [{ from: 'partner', text: sc.partnerMessage }];
    draftText = '';
    stealthOpen = false;
    stealthText = sc.partnerMessage;
    panelView = 'replies';
    renderSim();
  };

  const renderSim = () => {
    const sc = SCENARIOS[scenarioIdx];
    const activeCtx: ConversationContext = {
      id: `sim-${sc.id}`,
      source: stealthOpen ? 'manual' : sc.source,
      partnerText: stealthText || sc.partnerMessage,
      appPackage: sc.appPackage,
      timestamp: Date.now()
    };
    const resolution = router.resolveSuggestions(activeCtx);

    root.innerHTML = '';

    // 1. Scenario Tabs
    const tabBar = document.createElement('div');
    tabBar.className = 'sim-scenario-bar';
    SCENARIOS.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.id = `sim-tab-${item.id}`;
      btn.className = `scenario-tab ${idx === scenarioIdx ? 'active' : ''}`;
      btn.textContent = item.tabLabel;
      btn.addEventListener('click', () => loadScenario(idx));
      tabBar.appendChild(btn);
    });
    root.appendChild(tabBar);

    // 2. Chat Screen
    const chatScreen = document.createElement('div');
    chatScreen.className = 'sim-chat-screen';
    chatScreen.innerHTML = `
      <div class="sim-app-header">
        <span class="sim-contact">${escapeHtml(sc.contact)}</span>
        <span class="sim-security-tag">${escapeHtml(sc.securityBadge)}</span>
      </div>
    `;
    const msgWrap = document.createElement('div');
    msgWrap.className = 'sim-messages';
    for (const m of chatLog) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${m.from}`;
      bubble.textContent = m.text;
      msgWrap.appendChild(bubble);
    }
    chatScreen.appendChild(msgWrap);

    const composer = document.createElement('div');
    composer.className = 'sim-composer-line';
    composer.innerHTML = draftText
      ? `<span>${escapeHtml(draftText)}</span>`
      : `<span class="composer-placeholder">Tap a RizzBoard card or type below…</span>`;
    if (draftText) {
      const sendBtn = document.createElement('button');
      sendBtn.className = 'sim-pill active';
      sendBtn.textContent = 'Send ↑';
      sendBtn.addEventListener('click', () => {
        chatLog.push({ from: 'me', text: draftText });
        draftText = '';
        panelView = 'qwerty';
        renderSim();
      });
      composer.appendChild(sendBtn);
    }
    chatScreen.appendChild(composer);
    root.appendChild(chatScreen);

    // 3. Interactive RizzBoard IME / Extension Surface
    const ime = document.createElement('div');
    ime.className = 'sim-ime';

    const ribbon = document.createElement('div');
    ribbon.className = 'sim-ribbon';

    const alertBtn = document.createElement('button');
    alertBtn.id = 'sim-alert-pill';
    alertBtn.className = 'sim-pill alert';
    alertBtn.textContent = formatAlertPillText(activeCtx);
    alertBtn.addEventListener('click', () => {
      panelView = 'replies';
      renderSim();
    });

    const stealthBtn = document.createElement('button');
    stealthBtn.id = 'sim-stealth-pill';
    stealthBtn.className = `sim-pill ${stealthOpen ? 'active' : ''}`;
    stealthBtn.textContent = '💬 Tell Rizz';
    stealthBtn.addEventListener('click', () => {
      stealthOpen = !stealthOpen;
      renderSim();
    });

    const roastBtn = document.createElement('button');
    roastBtn.id = 'sim-roast-pill';
    roastBtn.className = `sim-pill ${panelView === 'roast' ? 'active' : ''}`;
    roastBtn.textContent = '🔥 Roast Draft';
    roastBtn.addEventListener('click', () => {
      panelView = panelView === 'roast' ? 'qwerty' : 'roast';
      renderSim();
    });

    const keysBtn = document.createElement('button');
    keysBtn.id = 'sim-keys-pill';
    keysBtn.className = `sim-pill ${panelView === 'qwerty' ? 'active' : ''}`;
    keysBtn.textContent = '⌨️ Keys';
    keysBtn.addEventListener('click', () => {
      panelView = 'qwerty';
      renderSim();
    });

    ribbon.append(alertBtn, stealthBtn, roastBtn, keysBtn);
    ime.appendChild(ribbon);

    if (stealthOpen) {
      const stealthBox = document.createElement('div');
      stealthBox.className = 'sim-stealth-box';
      const input = document.createElement('input');
      input.className = 'sim-stealth-input';
      input.placeholder = 'Stealth prompt (hidden from host chat)…';
      input.value = stealthText;
      input.addEventListener('input', () => {
        stealthText = input.value;
      });
      const go = document.createElement('button');
      go.className = 'sim-pill active';
      go.textContent = '⚡ Generate';
      go.addEventListener('click', () => {
        stealthOpen = false;
        panelView = 'replies';
        renderSim();
      });
      stealthBox.append(input, go);
      ime.appendChild(stealthBox);
    }

    const body = document.createElement('div');
    body.className = 'sim-body';

    if (panelView === 'replies') {
      for (const s of resolution.suggestions) {
        const card = document.createElement('div');
        card.className = 'sim-vibe-card';
        card.innerHTML = `
          <span class="sim-vibe-badge ${s.vibe.toLowerCase()}">${s.vibe}</span>
          <span>${escapeHtml(s.line)}</span>
        `;
        card.addEventListener('click', () => {
          draftText = s.line;
          renderSim();
        });
        body.appendChild(card);
      }
    } else if (panelView === 'roast') {
      const roast = analyzeDraftLocal(draftText || 'hey');
      const info = document.createElement('div');
      info.className = 'sim-vibe-card';
      info.innerHTML = `
        <span class="sim-vibe-badge bold">${roast.score}/10 · ${roast.verdict}</span>
        <span>"${escapeHtml(roast.feedback)}"</span>
      `;
      const fix = document.createElement('div');
      fix.className = 'sim-vibe-card';
      fix.innerHTML = `
        <span class="sim-vibe-badge smooth">Upgrade</span>
        <span>${escapeHtml(roast.improved)}</span>
      `;
      fix.addEventListener('click', () => {
        draftText = roast.improved;
        panelView = 'qwerty';
        renderSim();
      });
      body.append(info, fix);
    } else {
      const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
      ];
      for (const r of rows) {
        const rEl = document.createElement('div');
        rEl.className = 'sim-key-row';
        for (const k of r) {
          const btn = document.createElement('button');
          btn.className = 'sim-key';
          btn.textContent = k;
          btn.addEventListener('click', () => {
            if (k === '⌫') {
              draftText = draftText.slice(0, -1);
            } else {
              draftText += k;
            }
            renderSim();
          });
          rEl.appendChild(btn);
        }
        body.appendChild(rEl);
      }
      const bottomRow = document.createElement('div');
      bottomRow.className = 'sim-key-row';
      const space = document.createElement('button');
      space.className = 'sim-key wide';
      space.textContent = 'space';
      space.addEventListener('click', () => {
        draftText += ' ';
        renderSim();
      });
      const send = document.createElement('button');
      send.className = 'sim-key action';
      send.textContent = 'Send';
      send.addEventListener('click', () => {
        if (draftText.trim()) {
          chatLog.push({ from: 'me', text: draftText.trim() });
          draftText = '';
          renderSim();
        }
      });
      bottomRow.append(space, send);
      body.appendChild(bottomRow);
    }

    ime.appendChild(body);
    root.appendChild(ime);
  };

  renderSim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
