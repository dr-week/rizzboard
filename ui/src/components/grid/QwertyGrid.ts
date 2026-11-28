import { signal } from '@zuari/signals';
import { html } from '@zuari/dom';
import { mountList, mountTemplate } from '../../services/dom-helper.ts';

type ShiftState = 'off' | 'once' | 'caps';
type GridLayer = 'alpha' | 'numbers' | 'symbols';

const LONG_PRESS_MAP: Record<string, string> = {
  q: '1', w: '2', e: '3', r: '4', t: '5', y: '6', u: '7', i: '8', o: '9', p: '0',
  a: '@', s: '#', d: '$', f: '%', g: '&', h: '-', j: '+', k: '(', l: ')',
  z: '*', x: '"', c: "'", v: ':', b: ';', n: '!', m: '?'
};

export function QwertyGrid(options: {
  stealthMode: { value: boolean };
  showNumberRow?: { value: boolean };
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSend: () => void;
  onOpenEmojis: () => void;
  onMoveCursor?: (delta: number) => void;
  onDeleteWord?: () => void;
  onSwipeUpSpace?: () => void;
  onVoiceInput?: () => void;
}) {
  const shiftState = signal<ShiftState>('off');
  const activeLayer = signal<GridLayer>('alpha');

  const alphaRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const alphaRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const alphaRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  const numRow1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const numRow2 = ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'];
  const numRow3 = ['*', '"', "'", ':', ';', '!', '?'];

  const symRow1 = ['~', '`', '|', '•', '√', 'π', '÷', '×', '§', 'Δ'];
  const symRow2 = ['£', '€', '¥', '^', '°', '=', '{', '}', '\\', '©'];
  const symRow3 = ['%', '®', '™', '✓', '[', ']', '<', '>'];

  const handleAlphaKey = (char: string) => {
    const isUpper = shiftState.value !== 'off';
    const out = isUpper ? char.toUpperCase() : char;
    options.onKeyPress(out);
    if (shiftState.value === 'once') {
      shiftState.value = 'off';
    }
  };

  const toggleShift = () => {
    if (shiftState.value === 'off') {
      shiftState.value = 'once';
    } else if (shiftState.value === 'once') {
      shiftState.value = 'caps';
    } else {
      shiftState.value = 'off';
    }
  };

  const createAlphaKeyBtn = (k: string, isUpper: boolean) => {
    const label = isUpper ? k.toUpperCase() : k;
    const alt = LONG_PRESS_MAP[k] ?? '';
    let lpTimer: ReturnType<typeof setTimeout> | null = null;
    let didLongPress = false;

    const onPointerDown = () => {
      didLongPress = false;
      if (!alt) return;
      lpTimer = setTimeout(() => {
        didLongPress = true;
        options.onKeyPress(alt);
      }, 380);
    };

    const onPointerCancel = () => {
      if (lpTimer) {
        clearTimeout(lpTimer);
        lpTimer = null;
      }
    };

    const onClick = () => {
      if (lpTimer) {
        clearTimeout(lpTimer);
        lpTimer = null;
      }
      if (!didLongPress) {
        handleAlphaKey(k);
      }
      didLongPress = false;
    };

    return html`
      <button
        class="key-btn"
        @pointerdown=${onPointerDown}
        @pointerup=${onPointerCancel}
        @pointerleave=${onPointerCancel}
        @pointercancel=${onPointerCancel}
        @click=${onClick}>
        ${label}
      </button>
    `;
  };

  const createBackspaceBtn = () => {
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    let repeatTimer: ReturnType<typeof setInterval> | null = null;
    let didRepeat = false;
    let startX = 0;

    const stopRepeat = () => {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
      if (repeatTimer) {
        clearInterval(repeatTimer);
        repeatTimer = null;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      startX = e.clientX;
      didRepeat = false;
      stopRepeat();
      delayTimer = setTimeout(() => {
        didRepeat = true;
        options.onBackspace();
        repeatTimer = setInterval(() => {
          options.onBackspace();
        }, 55);
      }, 350);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (startX - e.clientX >= 28 && !didRepeat) {
        didRepeat = true;
        stopRepeat();
        options.onDeleteWord?.();
      }
    };

    const onClick = () => {
      stopRepeat();
      if (!didRepeat) {
        options.onBackspace();
      }
      didRepeat = false;
    };

    return html`
      <button
        class="key-btn special"
        @pointerdown=${onPointerDown}
        @pointermove=${onPointerMove}
        @pointerup=${stopRepeat}
        @pointerleave=${stopRepeat}
        @pointercancel=${stopRepeat}
        @click=${onClick}>
        ⌫
      </button>
    `;
  };

  const createSpaceBtn = () => {
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let didScrub = false;
    let active = false;

    const onPointerDown = (e: PointerEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      didScrub = false;
      active = true;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active) return;
      if (startY - e.clientY >= 28 && !didScrub) {
        didScrub = true;
        active = false;
        options.onSwipeUpSpace?.();
        return;
      }
      if (!options.onMoveCursor) return;
      const dx = e.clientX - lastX;
      if (Math.abs(e.clientX - startX) > 10) {
        didScrub = true;
      }
      if (Math.abs(dx) >= 18) {
        const steps = Math.trunc(dx / 18);
        options.onMoveCursor(steps);
        lastX += steps * 18;
      }
    };

    const onPointerEnd = () => {
      active = false;
    };

    const onClick = () => {
      if (!didScrub) {
        options.onKeyPress(' ');
      }
      didScrub = false;
    };

    return html`
      <button
        class="key-btn space"
        @pointerdown=${onPointerDown}
        @pointermove=${onPointerMove}
        @pointerup=${onPointerEnd}
        @pointercancel=${onPointerEnd}
        @click=${onClick}>
        ${() => options.stealthMode.value ? 'stealth space' : 'space'}
      </button>
    `;
  };

  const renderAlpha = () => {
    const isUpper = shiftState.value !== 'off';
    const shiftLabel = shiftState.value === 'caps' ? '⇪' : shiftState.value === 'once' ? '⬆' : '⇧';
    const shiftClass = shiftState.value === 'off' ? 'key-btn special' : 'key-btn special active-shift';

    const row3El = document.createElement('div');
    row3El.className = 'keyboard-row';
    row3El.appendChild(
      mountTemplate(html`<button class=${shiftClass} @click=${toggleShift}>${shiftLabel}</button>`)
    );
    for (const k of alphaRow3) {
      row3El.appendChild(mountTemplate(createAlphaKeyBtn(k, isUpper)));
    }
    row3El.appendChild(mountTemplate(createBackspaceBtn()));

    return mountTemplate(html`
      <div class="keyboard-grid">
        ${() => options.showNumberRow?.value
          ? mountList(
              'keyboard-row',
              numRow1.map(n => html`<button class="key-btn" @click=${() => options.onKeyPress(n)}>${n}</button>`)
            )
          : ''}
        ${mountList(
          'keyboard-row',
          alphaRow1.map(k => createAlphaKeyBtn(k, isUpper))
        )}
        ${mountList(
          'keyboard-row',
          alphaRow2.map(k => createAlphaKeyBtn(k, isUpper))
        )}
        ${row3El}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${() => activeLayer.value = 'numbers'}>123</button>
          <button class="key-btn special" @click=${options.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${() => options.onKeyPress(',')}>,</button>
          ${mountTemplate(createSpaceBtn())}
          <button class="key-btn special" @click=${() => options.onKeyPress('.')}>.</button>
          <button class="key-btn send" @click=${options.onSend}>
            ${() => options.stealthMode.value ? 'Ask ⚡' : 'Send'}
          </button>
        </div>
      </div>
    `);
  };

  const renderNumbersOrSymbols = (isSymbols: boolean) => {
    const r1 = isSymbols ? symRow1 : numRow1;
    const r2 = isSymbols ? symRow2 : numRow2;
    const r3 = isSymbols ? symRow3 : numRow3;

    const row3El = document.createElement('div');
    row3El.className = 'keyboard-row';
    row3El.appendChild(
      mountTemplate(html`
        <button
          class="key-btn special"
          @click=${() => activeLayer.value = isSymbols ? 'numbers' : 'symbols'}>
          ${isSymbols ? '123' : '=\\<'}
        </button>
      `)
    );
    for (const k of r3) {
      row3El.appendChild(
        mountTemplate(html`<button class="key-btn" @click=${() => options.onKeyPress(k)}>${k}</button>`)
      );
    }
    row3El.appendChild(mountTemplate(createBackspaceBtn()));

    return mountTemplate(html`
      <div class="keyboard-grid">
        ${mountList(
          'keyboard-row',
          r1.map(k => html`<button class="key-btn" @click=${() => options.onKeyPress(k)}>${k}</button>`)
        )}
        ${mountList(
          'keyboard-row',
          r2.map(k => html`<button class="key-btn" @click=${() => options.onKeyPress(k)}>${k}</button>`)
        )}
        ${row3El}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${() => activeLayer.value = 'alpha'}>ABC</button>
          <button class="key-btn special" @click=${options.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${() => options.onKeyPress(',')}>,</button>
          ${mountTemplate(createSpaceBtn())}
          <button class="key-btn special" @click=${() => options.onKeyPress('.')}>.</button>
          <button class="key-btn send" @click=${options.onSend}>
            ${() => options.stealthMode.value ? 'Ask ⚡' : 'Send'}
          </button>
        </div>
      </div>
    `);
  };

  return mountTemplate(html`
    <div class="keyboard-grid-wrapper">
      ${() => {
        if (activeLayer.value === 'numbers') return renderNumbersOrSymbols(false);
        if (activeLayer.value === 'symbols') return renderNumbersOrSymbols(true);
        return renderAlpha();
      }}
    </div>
  `);
}
