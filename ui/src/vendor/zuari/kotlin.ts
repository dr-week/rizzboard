import { computed, signal } from './signals.ts';

export function createKotlinBridge(dark = true) {
  const isDarkTheme = signal(dark);
  const isAndroid = computed(
    () =>
      typeof navigator !== 'undefined' &&
      (/android/i.test(navigator.userAgent) || Boolean((window as any)?.Android))
  );
  const callbacks = new Map<string, (payload: any) => void>();

  if (typeof window !== 'undefined') {
    (window as any).__zuariKotlinDispatcher = (event: string, rawPayload: any) => {
      const fn = callbacks.get(event);
      if (!fn) return;
      if (typeof rawPayload === 'string') {
        try {
          fn(JSON.parse(rawPayload));
        } catch {
          fn(rawPayload);
        }
      } else {
        fn(rawPayload);
      }
    };
  }

  function registerNativeCallback(event: string, handler: (payload: any) => void) {
    callbacks.set(event, handler);
    return () => callbacks.delete(event);
  }

  return {
    isAndroid,
    isDarkTheme,
    registerNativeCallback
  };
}
