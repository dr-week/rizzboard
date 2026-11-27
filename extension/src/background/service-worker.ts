declare const chrome: any;

const MENU_ID = 'rizzboard-suggest-selection';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['wingmanEnabled'], (res: any) => {
    if (typeof res?.wingmanEnabled !== 'boolean') {
      chrome.storage.local.set({ wingmanEnabled: true });
    }
  });

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: '⚡ RizzBoard: Suggest Replies for "%s"',
      contexts: ['selection']
    });
  });
});

chrome.contextMenus.onClicked.addListener((info: any, tab: any) => {
  if (info.menuItemId !== MENU_ID || !info.selectionText) return;
  const selected = String(info.selectionText).trim();
  if (!selected) return;

  chrome.storage.local.set({
    lastSelectedContext: {
      text: selected,
      timestamp: Date.now()
    }
  });

  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'RIZZ_ANALYZE_SELECTION',
      text: selected
    }).catch(() => {
      // Content script not injected on arbitrary non-chat domain; popup reads storage fallback
    });
  }
});

chrome.commands.onCommand.addListener((command: string) => {
  if (command !== 'toggle-wingman') return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
    const activeTab = tabs?.[0];
    if (activeTab?.id) {
      chrome.tabs.sendMessage(activeTab.id, { type: 'RIZZ_TOGGLE_HUD' }).catch(() => {});
    }
  });
});
