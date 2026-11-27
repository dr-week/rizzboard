import type { ConversationContext } from './types.ts';

const KNOWN_APPS: Record<string, string> = {
  'com.snapchat.android': 'Snapchat',
  'org.telegram.messenger': 'Telegram',
  'org.thoughtcrime.securesms': 'Signal',
  'co.hinge.app': 'Hinge',
  'com.bumble.app': 'Bumble',
  'com.tinder': 'Tinder',
  'com.instagram.android': 'Instagram',
  'com.whatsapp': 'WhatsApp',
  'web.whatsapp.com': 'WhatsApp Web',
  'instagram.com': 'Instagram DM',
  'web.telegram.org': 'Telegram Web',
  'tinder.com': 'Tinder Web',
  'bumble.com': 'Bumble Web',
  'discord.com': 'Discord',
  'x.com': 'X DM'
};

export function resolveAppDisplayName(packageOrHost?: string): string | undefined {
  if (!packageOrHost) return undefined;
  const cleaned = packageOrHost.replace(/^www\./i, '');
  if (KNOWN_APPS[cleaned]) return KNOWN_APPS[cleaned];

  const segments = cleaned.split('.');
  const last = segments[segments.length - 1];
  if (!last || ['android', 'app', 'messenger', 'com', 'org', 'io'].includes(last)) {
    const prev = segments[segments.length - 2];
    return prev ? prev.charAt(0).toUpperCase() + prev.slice(1) : undefined;
  }
  return last.charAt(0).toUpperCase() + last.slice(1);
}

export function formatSourceBadge(ctx: ConversationContext): string {
  const appLabel = resolveAppDisplayName(ctx.appPackage);
  switch (ctx.source) {
    case 'screenshot':
      return '📸 Screenshot';
    case 'notification':
      return appLabel ? `🔔 ${appLabel} Msg` : '🔔 Incoming Msg';
    case 'clipboard':
      return '📋 Copied Bubble';
    case 'accessibility':
      return appLabel ? `👁️ ${appLabel} Scan` : '👁️ Screen Scan';
    case 'selection':
      return '✨ Selected Text';
    case 'dom':
      return appLabel ? `🌐 ${appLabel} Chat` : '🌐 Web Chat';
    case 'manual':
      return '💬 Stealth Context';
  }
}

export function formatAlertPillText(ctx: ConversationContext): string {
  const preview = ctx.partnerText.length > 26
    ? `${ctx.partnerText.slice(0, 26).trim()}…`
    : ctx.partnerText;

  switch (ctx.source) {
    case 'screenshot':
      return '📸 Screenshot Detected: Analyze Next Move';
    case 'notification': {
      const app = resolveAppDisplayName(ctx.appPackage);
      return app
        ? `🔔 ${app}: "${preview}" — Reply`
        : `🔔 New Msg: "${preview}" — Reply`;
    }
    case 'clipboard':
      return `📋 Copied: "${preview}" — Reply`;
    case 'accessibility':
    case 'dom':
      return `👁️ Scanned: "${preview}" — Reply`;
    case 'selection':
      return `✨ Selected: "${preview}" — Reply`;
    case 'manual':
      return '💬 Context Ready — View Replies';
  }
}
