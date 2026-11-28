const RECENT_STORAGE_KEY = 'rizzboard_recent_emojis';

export function loadRecentEmojis(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return ['😏', '🔥', '❤️', '😂', '✨', '👀', '💯', '🥂'];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['😏', '🔥', '❤️', '😂'];
  } catch {
    return ['😏', '🔥', '❤️', '😂'];
  }
}

export function saveRecentEmoji(emoji: string) {
  try {
    const current = loadRecentEmojis().filter(e => e !== emoji);
    const updated = [emoji, ...current].slice(0, 16);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}
