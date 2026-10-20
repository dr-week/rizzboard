export interface EmojiCategory {
  name: string;
  icon: string;
  emojis: string[];
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: 'Smileys & Rizz',
    icon: '😏',
    emojis: ['😏', '😉', '😎', '😜', '🔥', '👀', '✨', '💅', '😈', '🫦', '🫠', '🤭', '🥰', '😘', '❤️‍🔥']
  },
  {
    name: 'Love & Hearts',
    icon: '❤️',
    emojis: ['❤️', '💖', '💘', '💕', '💌', '🌹', '💐', '🥂', '🍾', '🍫', '💍', '💋']
  },
  {
    name: 'Reactions & Gestures',
    icon: '✌️',
    emojis: ['✌️', '🤙', '🤌', '🤝', '🙌', '👏', '🫡', '🤷‍♂️', '🤷‍♀️', '🤦‍♂️', '💯', '🎯']
  },
  {
    name: 'Food & Dates',
    icon: '☕',
    emojis: ['☕', '🍸', '🍷', '🍕', '🍣', '🌮', '🍦', '🍿', '🎬', '🎳', '🏎️', '✈️']
  }
];
