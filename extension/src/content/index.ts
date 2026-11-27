import { attachSelectionWatcher } from './extractor/selection-watcher.ts';
import { FloatingWingmanWidget } from './widget/floating-wingman.ts';

declare const chrome: any;

function bootstrapContentWingman() {
  if ((window as any).__rizzboardWingmanInitialized) return;
  (window as any).__rizzboardWingmanInitialized = true;

  const widget = new FloatingWingmanWidget();

  attachSelectionWatcher((selectedText, rect) => {
    widget.showSelectionTrigger(selectedText, rect);
  });

  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.get(['wingmanEnabled'], (res: any) => {
      if (res?.wingmanEnabled === false) {
        widget.setVisible(false);
      }
    });

    chrome.storage.onChanged?.addListener((changes: any) => {
      if (changes?.wingmanEnabled) {
        widget.setVisible(changes.wingmanEnabled.newValue !== false);
      }
    });
  }

  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg: any) => {
      if (msg?.type === 'RIZZ_TOGGLE_HUD') {
        widget.togglePanel();
      } else if (msg?.type === 'RIZZ_ANALYZE_SELECTION' && msg.text) {
        widget.openWithSelection(String(msg.text));
      }
    });
  }
}

bootstrapContentWingman();
