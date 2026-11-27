import { effect, type CleanupFn, type Signal } from './signals.ts';

export type TemplateValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Node
  | Signal<unknown>
  | (() => unknown)
  | TemplateResult;

export interface TemplateResult {
  strings: TemplateStringsArray;
  values: TemplateValue[];
}

export interface RenderInstance {
  fragment: DocumentFragment;
  destroy: CleanupFn;
}

const templateCache = new Map<string, HTMLTemplateElement>();
const HOLE_PREFIX = '<!--zuari-hole-';
const HOLE_SUFFIX = '-->';
const ATTR_PREFIX = 'data-zuari-attr-';

export function html(strings: TemplateStringsArray, ...values: TemplateValue[]): TemplateResult {
  return { strings, values };
}

export function render(result: TemplateResult, container?: Element | DocumentFragment): RenderInstance {
  const { strings, values } = result;
  const key = strings.join('<!--?-->');
  let template = templateCache.get(key);
  if (!template) {
    template = document.createElement('template');
    template.innerHTML = strings.reduce((markup, text, index) => {
      if (index >= values.length) return markup + text;
      const attribute = /=["']?[^"'>]*$/.test(text);
      const marker = attribute ? `"${ATTR_PREFIX}${index}"` : `${HOLE_PREFIX}${index}${HOLE_SUFFIX}`;
      return markup + text + marker;
    }, '');
    templateCache.set(key, template);
  }

  const fragment = template.content.cloneNode(true) as DocumentFragment;
  const ownedNodes = Array.from(fragment.childNodes);
  const cleanups: CleanupFn[] = [];
  values.forEach((val, idx) => bindHole(fragment, idx, val, cleanups));
  if (container) container.appendChild(fragment);

  return {
    fragment,
    destroy() {
      cleanups.forEach(c => c());
      ownedNodes.forEach(n => n.parentNode?.removeChild(n));
    }
  };
}

function bindHole(root: DocumentFragment, index: number, value: TemplateValue, cleanups: CleanupFn[]): void {
  const comment = findComment(root, `${HOLE_PREFIX}${index}${HOLE_SUFFIX}`);
  if (comment && comment.parentNode) {
    const parent = comment.parentNode;
    let current: Node = document.createTextNode('');
    parent.replaceChild(current, comment);

    const applyValue = (val: unknown) => {
      if (val instanceof DocumentFragment) {
        const anchor = document.createTextNode('');
        parent.replaceChild(anchor, current);
        parent.insertBefore(val, anchor);
        current = anchor;
        return;
      }
      if (val instanceof Node) {
        if (current !== val) {
          parent.replaceChild(val, current);
          current = val;
        }
        return;
      }
      if (current instanceof Text) {
        current.data = String(val ?? '');
      } else {
        const txt = document.createTextNode(String(val ?? ''));
        parent.replaceChild(txt, current);
        current = txt;
      }
    };

    if (isReactive(value)) {
      cleanups.push(effect(() => applyValue(unwrap(value))));
    } else {
      applyValue(value);
    }
    return;
  }

  const marker = `${ATTR_PREFIX}${index}`;
  const found = findAttr(root, marker);
  if (!found) return;
  const { element, attrName } = found;
  if (attrName.startsWith('@') || attrName.startsWith('on')) {
    const ev = (attrName.startsWith('@') ? attrName.slice(1) : attrName.slice(2)).toLowerCase();
    element.removeAttribute(attrName);
    if (typeof value === 'function') {
      const fn = value as EventListener;
      element.addEventListener(ev, fn);
      cleanups.push(() => element.removeEventListener(ev, fn));
    }
    return;
  }

  const applyAttr = (val: unknown) => {
    if (val === false || val === null || val === undefined) {
      element.removeAttribute(attrName);
    } else {
      element.setAttribute(attrName, String(val));
    }
  };

  if (isReactive(value)) {
    cleanups.push(effect(() => applyAttr(unwrap(value))));
  } else {
    applyAttr(value);
  }
}

function isReactive(v: unknown): boolean {
  return (typeof v === 'object' && v !== null && 'value' in v) || typeof v === 'function';
}

function unwrap(v: unknown): unknown {
  if (typeof v === 'object' && v !== null && 'value' in v) {
    return (v as { value: unknown }).value;
  }
  return typeof v === 'function' ? (v as () => unknown)() : v;
}

function findComment(root: Node, target: string): Comment | null {
  const it = document.createNodeIterator(root, NodeFilter.SHOW_COMMENT);
  let cur = it.nextNode() as Comment | null;
  while (cur) {
    if (`<!--${cur.data}-->` === target) return cur;
    cur = it.nextNode() as Comment | null;
  }
  return null;
}

function findAttr(root: Node, marker: string): { element: Element; attrName: string } | null {
  const it = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);
  let cur = it.nextNode() as Element | null;
  while (cur) {
    for (const attr of Array.from(cur.attributes)) {
      if (attr.value.includes(marker)) return { element: cur, attrName: attr.name };
    }
    cur = it.nextNode() as Element | null;
  }
  return null;
}
