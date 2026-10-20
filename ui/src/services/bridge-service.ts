import { createKotlinBridge } from '@zuari/kotlin';

export const kotlinBridge = createKotlinBridge(true);

export function commitToChat(text: string) {
  if (typeof window !== 'undefined' && (window as any).Android) {
    (window as any).Android.commitText(text);
  } else {
    console.log('[Dev Mock Commit]:', text);
  }
}

export function deleteCharacter() {
  if (typeof window !== 'undefined' && (window as any).Android) {
    (window as any).Android.deleteBackward();
  } else {
    console.log('[Dev Mock Delete]');
  }
}

export function sendAction() {
  if (typeof window !== 'undefined' && (window as any).Android) {
    (window as any).Android.sendEnter();
  } else {
    console.log('[Dev Mock Enter]');
  }
}

export function triggerHaptic(type: 'light' | 'click' | 'heavy' = 'click') {
  if (typeof window !== 'undefined' && (window as any).Android) {
    (window as any).Android.triggerHaptic(type);
  }
}
