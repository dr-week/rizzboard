export const SHADOW_WIDGET_CSS = `
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #f3f2ee;
  }

  * {
    box-sizing: border-box;
  }

  .rb-dock {
    position: fixed;
    right: 20px;
    bottom: 24px;
    z-index: 2147483646;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }

  .rb-trigger {
    background: #17171b;
    color: #f3f2ee;
    border: 1px solid #30303a;
    border-bottom: 3px solid #c2272d;
    border-radius: 10px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: -0.01em;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.42);
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: transform 0.14s ease, background 0.14s ease;
  }

  .rb-trigger:hover {
    background: #202026;
    transform: translateY(-1px);
  }

  .rb-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff4b72;
  }

  .rb-selection-pill {
    position: fixed;
    z-index: 2147483647;
    background: #c2272d;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  }

  .rb-panel {
    width: 340px;
    background: #151519;
    border: 1px solid #2d2d36;
    border-radius: 14px;
    padding: 12px;
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.55);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .rb-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .rb-title {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .rb-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 6px;
    background: rgba(194, 39, 45, 0.22);
    color: #ff859d;
  }

  .rb-close {
    background: transparent;
    border: none;
    color: #9a9aa6;
    cursor: pointer;
    font-size: 13px;
  }

  .rb-tabs {
    display: flex;
    gap: 6px;
    background: #1d1d23;
    padding: 4px;
    border-radius: 9px;
  }

  .rb-tab {
    flex: 1;
    border: none;
    background: transparent;
    color: #9a9aa6;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;
  }

  .rb-tab.active {
    background: #2b2b34;
    color: #f3f2ee;
  }

  .rb-input-row {
    display: flex;
    gap: 6px;
  }

  .rb-input {
    flex: 1;
    background: #1e1e25;
    border: 1px solid #32323c;
    border-radius: 8px;
    padding: 7px 9px;
    color: #f3f2ee;
    font-size: 12px;
    outline: none;
  }

  .rb-input:focus {
    border-color: #ff4b72;
  }

  .rb-btn {
    background: #c2272d;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 7px 10px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }

  .rb-btn.secondary {
    background: #26262f;
    color: #e4e4ec;
  }

  .rb-cards {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .rb-card {
    background: #1f1f27;
    border: 1px solid #2e2e38;
    border-radius: 9px;
    padding: 8px 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: background 0.12s ease, border-color 0.12s ease;
  }

  .rb-card:hover {
    background: #272732;
    border-color: #ff4b72;
  }

  .rb-vibe {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .rb-vibe.smooth { color: #6ee7b7; }
  .rb-vibe.tease { color: #fbbf24; }
  .rb-vibe.bold { color: #ff859d; }

  .rb-line {
    font-size: 12.5px;
    line-height: 1.35;
    color: #f3f2ee;
  }

  .rb-foot {
    font-size: 11px;
    color: #8c8c98;
    display: flex;
    justify-content: space-between;
  }
`;
