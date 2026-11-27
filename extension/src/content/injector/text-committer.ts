/**
 * Reads and commits text safely across standard <textarea>/<input> elements as well as
 * React, Lexical, Draft.js, and Slate contenteditable editors used by modern web chat apps.
 */
export function readComposerDraft(composer: HTMLElement | null): string {
  if (!composer) return '';
  if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) {
    return composer.value || '';
  }
  return (composer.innerText || composer.textContent || '').trim();
}

export function commitTextToComposer(composer: HTMLElement | null, text: string, replace = false): boolean {
  if (!composer) return false;
  composer.focus();

  if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) {
    const proto = composer instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    const nextValue = replace || !composer.value ? text : `${composer.value} ${text}`;

    if (nativeSetter) {
      nativeSetter.call(composer, nextValue);
    } else {
      composer.value = nextValue;
    }
    composer.dispatchEvent(new Event('input', { bubbles: true }));
    composer.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  if (composer.isContentEditable) {
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(composer);
      if (!replace) {
        range.collapse(false);
      }
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Modern browsers & Lexical/DraftJS editors handle execCommand('insertText') best
    const inserted = document.execCommand('insertText', false, text);
    if (!inserted) {
      if (replace) {
        composer.textContent = text;
      } else {
        composer.textContent = `${composer.textContent ?? ''}${text}`;
      }
      composer.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          inputType: 'insertText',
          data: text
        })
      );
    }
    return true;
  }

  return false;
}
