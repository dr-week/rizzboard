import type { RizzResponse } from '../ai/prompts.ts';

export type ContextSource =
  | 'screenshot'
  | 'notification'
  | 'clipboard'
  | 'accessibility'
  | 'selection'
  | 'dom'
  | 'manual';

export interface ScreenBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  screenWidth: number;
}

export interface ConversationContext {
  id: string;
  source: ContextSource;
  partnerText: string;
  myLastText?: string;
  senderName?: string;
  appPackage?: string;
  uri?: string;
  timestamp: number;
}

export interface ContextResolution {
  context: ConversationContext;
  suggestions: RizzResponse[];
}
