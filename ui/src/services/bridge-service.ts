import { createKotlinBridge } from '@zuari/kotlin';
import type { ScreenBlock } from '../../../core/engine/hybrid-context.ts';

export const kotlinBridge = createKotlinBridge(true);

export interface OcrScanResponse {
  status: 'ok' | 'empty' | 'restricted' | 'not_enabled' | 'error';
  blocks: ScreenBlock[];
  appPackage?: string;
  error?: string;
}

export interface NativeBufferedContext {
  status: 'ok' | 'none';
  source?: 'notification' | 'clipboard';
  text?: string;
  senderName?: string;
  appPackage?: string;
  timestamp?: number;
}

function getAndroidInterface(): any | null {
  return typeof window !== 'undefined' && (window as any).Android
    ? (window as any).Android
    : null;
}

export function commitToChat(text: string) {
  const android = getAndroidInterface();
  if (android) {
    android.commitText(text);
  } else {
    console.log('[Dev Mock Commit]:', text);
  }
}

export function deleteCharacter() {
  const android = getAndroidInterface();
  if (android) {
    android.deleteBackward();
  } else {
    console.log('[Dev Mock Delete]');
  }
}

export function sendAction() {
  const android = getAndroidInterface();
  if (android) {
    android.sendEnter();
  } else {
    console.log('[Dev Mock Enter]');
  }
}

export function triggerHaptic(type: 'light' | 'click' | 'heavy' = 'click') {
  const android = getAndroidInterface();
  if (android && typeof android.triggerHaptic === 'function') {
    android.triggerHaptic(type);
  }
}

export function requestScreenshotOCR(uri: string): OcrScanResponse {
  const android = getAndroidInterface();
  if (android && typeof android.requestScreenshotAnalysis === 'function') {
    try {
      const raw = android.requestScreenshotAnalysis(uri);
      return JSON.parse(raw) as OcrScanResponse;
    } catch {
      return { status: 'error', blocks: [] };
    }
  }
  return {
    status: 'ok',
    blocks: [
      { text: 'Are you free for drinks this weekend?', x: 48, y: 420, width: 320, screenWidth: 1080 }
    ]
  };
}

export function requestLiveScreenScan(): OcrScanResponse {
  const android = getAndroidInterface();
  if (android && typeof android.requestScreenScan === 'function') {
    try {
      const raw = android.requestScreenScan();
      return JSON.parse(raw) as OcrScanResponse;
    } catch {
      return { status: 'error', blocks: [] };
    }
  }
  // Browser dev preview mock
  return {
    status: 'ok',
    appPackage: 'com.snapchat.android',
    blocks: [
      { text: 'What is your biggest red flag?', x: 52, y: 460, width: 300, screenWidth: 1080 }
    ]
  };
}

export function fetchActiveNativeContext(): NativeBufferedContext {
  const android = getAndroidInterface();
  if (android && typeof android.getActiveContext === 'function') {
    try {
      return JSON.parse(android.getActiveContext()) as NativeBufferedContext;
    } catch {
      return { status: 'none' };
    }
  }
  return { status: 'none' };
}

export function openNativeSetting(target: 'notifications' | 'accessibility' | 'setup') {
  const android = getAndroidInterface();
  if (android && typeof android.openSystemSetting === 'function') {
    android.openSystemSetting(target);
  } else {
    console.log('[Dev Mock Open Setting]:', target);
  }
}

export function startVoiceTyping() {
  const android = getAndroidInterface();
  if (android && typeof android.startVoiceTyping === 'function') {
    android.startVoiceTyping();
  } else {
    console.log('[Dev Mock Voice Typing]');
  }
}

export function showInputMethodPicker() {
  const android = getAndroidInterface();
  if (android && typeof android.showInputMethodPicker === 'function') {
    android.showInputMethodPicker();
  } else {
    console.log('[Dev Mock IME Picker]');
  }
}

export function setComposingText(text: string) {
  const android = getAndroidInterface();
  if (android && typeof android.setComposingText === 'function') {
    android.setComposingText(text);
  }
}

export function finishComposingText() {
  const android = getAndroidInterface();
  if (android && typeof android.finishComposingText === 'function') {
    android.finishComposingText();
  }
}

export function moveCursor(delta: number) {
  const android = getAndroidInterface();
  if (android && typeof android.moveCursor === 'function') {
    android.moveCursor(delta);
  }
}

export function getCursorCapsMode(): number {
  const android = getAndroidInterface();
  if (android && typeof android.getCursorCapsMode === 'function') {
    return Number(android.getCursorCapsMode()) || 0;
  }
  return 0;
}
