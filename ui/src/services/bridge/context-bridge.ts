import { createKotlinBridge } from '@zuari/kotlin';
import type { ScreenBlock } from '../../../../core/engine/hybrid-context.ts';

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

function getAndroid(): any | null {
  return typeof window !== 'undefined' && (window as any).Android
    ? (window as any).Android
    : null;
}

export function requestScreenshotOCR(uri: string): OcrScanResponse {
  const android = getAndroid();
  if (android && typeof android.requestScreenshotAnalysis === 'function') {
    try {
      return JSON.parse(android.requestScreenshotAnalysis(uri)) as OcrScanResponse;
    } catch {
      return { status: 'error', blocks: [] };
    }
  }
  return {
    status: 'ok',
    blocks: [{ text: 'Are you free for drinks this weekend?', x: 48, y: 420, width: 320, screenWidth: 1080 }]
  };
}

export function requestLiveScreenScan(): OcrScanResponse {
  const android = getAndroid();
  if (android && typeof android.requestScreenScan === 'function') {
    try {
      return JSON.parse(android.requestScreenScan()) as OcrScanResponse;
    } catch {
      return { status: 'error', blocks: [] };
    }
  }
  return {
    status: 'ok',
    appPackage: 'com.snapchat.android',
    blocks: [{ text: 'What is your biggest red flag?', x: 52, y: 460, width: 300, screenWidth: 1080 }]
  };
}

export function fetchActiveNativeContext(): NativeBufferedContext {
  const android = getAndroid();
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
  const android = getAndroid();
  if (android && typeof android.openSystemSetting === 'function') {
    android.openSystemSetting(target);
  }
}
