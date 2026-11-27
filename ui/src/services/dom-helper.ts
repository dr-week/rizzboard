import { render, type TemplateResult } from '@zuari/dom';

/**
 * Materializes a Zuari TemplateResult into its root DOM Element so
 * ChildNodePart / FallbackChildPart can mount and swap subtrees atomically.
 */
export function mountTemplate(tpl: TemplateResult): Node {
  const { fragment } = render(tpl);
  if (fragment.childElementCount === 1 && fragment.firstElementChild) {
    return fragment.firstElementChild;
  }
  const wrapper = document.createElement('div');
  wrapper.style.display = 'contents';
  wrapper.appendChild(fragment);
  return wrapper;
}

/**
 * Materializes an array of Zuari TemplateResults inside a wrapper element.
 */
export function mountList(className: string, items: TemplateResult[]): HTMLElement {
  const container = document.createElement('div');
  container.className = className;
  for (const item of items) {
    const { fragment } = render(item);
    container.appendChild(fragment);
  }
  return container;
}
