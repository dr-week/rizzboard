function getAndroid(): any | null {
  return typeof window !== 'undefined' && (window as any).Android
    ? (window as any).Android
    : null;
}

export function commitToChat(text: string) {
  const android = getAndroid();
  if (android) android.commitText(text);
}

export function deleteCharacter() {
  const android = getAndroid();
  if (android) android.deleteBackward();
}

export function sendAction() {
  const android = getAndroid();
  if (android) android.sendEnter();
}

export function triggerHaptic(type: 'light' | 'click' | 'heavy' = 'click') {
  const android = getAndroid();
  if (android && typeof android.triggerHaptic === 'function') {
    android.triggerHaptic(type);
  }
}

export function startVoiceTyping() {
  const android = getAndroid();
  if (android && typeof android.startVoiceTyping === 'function') {
    android.startVoiceTyping();
  }
}

export function showInputMethodPicker() {
  const android = getAndroid();
  if (android && typeof android.showInputMethodPicker === 'function') {
    android.showInputMethodPicker();
  }
}

export function setComposingText(text: string) {
  const android = getAndroid();
  if (android && typeof android.setComposingText === 'function') {
    android.setComposingText(text);
  }
}

export function finishComposingText() {
  const android = getAndroid();
  if (android && typeof android.finishComposingText === 'function') {
    android.finishComposingText();
  }
}

export function moveCursor(delta: number) {
  const android = getAndroid();
  if (android && typeof android.moveCursor === 'function') {
    android.moveCursor(delta);
  }
}

export function getCursorCapsMode(): number {
  const android = getAndroid();
  if (android && typeof android.getCursorCapsMode === 'function') {
    return Number(android.getCursorCapsMode()) || 0;
  }
  return 0;
}

export function performEditAction(action: 'selectAll' | 'copy' | 'cut' | 'paste') {
  const android = getAndroid();
  if (android && typeof android.performEditAction === 'function') {
    android.performEditAction(action);
  }
}

export function sendDpad(direction: 'left' | 'right' | 'up' | 'down') {
  const android = getAndroid();
  if (android && typeof android.sendDpad === 'function') {
    android.sendDpad(direction);
  }
}
