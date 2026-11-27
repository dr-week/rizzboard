import { segmentChatBubbles } from '../ocr/bubble-segmentation.ts';
import { RizzEngine } from '../engine/rizz-engine.ts';
import { ContextNoiseFilter } from './noise-filter.ts';
import type {
  ContextResolution,
  ContextSource,
  ConversationContext,
  ScreenBlock
} from './types.ts';

/**
 * Unified Multi-Platform Hybrid Context Router.
 * Powers both the 5-Tier Android IME and the Manifest V3 Web Chat Extension.
 */
export class HybridContextRouter {
  private readonly engine = new RizzEngine();
  private readonly filter = new ContextNoiseFilter();
  private lastProcessedSignature = '';

  public recordCommittedReply(text: string): void {
    this.filter.recordSelfCommit(text);
  }

  public isIgnoredNoiseOrSelf(text: string, source: ContextSource): boolean {
    return this.filter.isIgnored(text, source);
  }

  public ingestRawContext(input: {
    source: ContextSource;
    text: string;
    myLastText?: string;
    senderName?: string;
    appPackage?: string;
    uri?: string;
    timestamp?: number;
  }): ConversationContext | null {
    const cleaned = input.text.replace(/\s+/g, ' ').trim();
    if (this.filter.isIgnored(cleaned, input.source)) {
      return null;
    }

    const signature = `${input.source}:${input.appPackage ?? ''}:${this.filter.normalize(cleaned)}`;
    if (input.source !== 'manual' && input.source !== 'selection' && signature === this.lastProcessedSignature) {
      return null;
    }
    this.lastProcessedSignature = signature;

    const ts = input.timestamp ?? Date.now();
    return {
      id: `${input.source}-${ts}`,
      source: input.source,
      partnerText: cleaned,
      myLastText: input.myLastText?.trim() || undefined,
      senderName: input.senderName?.trim() || undefined,
      appPackage: input.appPackage,
      uri: input.uri,
      timestamp: ts
    };
  }

  public ingestScreenBlocks(
    blocks: ScreenBlock[],
    source: 'screenshot' | 'accessibility' | 'dom',
    meta?: { appPackage?: string; uri?: string; timestamp?: number }
  ): ConversationContext | null {
    if (!blocks || blocks.length === 0) return null;

    const segmented = segmentChatBubbles(blocks);
    const partner = segmented.senderText
      ?? segmented.rawBlocks.find(t => !this.filter.isIgnored(t, source));

    if (!partner) return null;

    return {
      id: `${source}-${meta?.timestamp ?? Date.now()}`,
      source,
      partnerText: partner.trim(),
      myLastText: segmented.myLastText?.trim(),
      appPackage: meta?.appPackage,
      uri: meta?.uri,
      timestamp: meta?.timestamp ?? Date.now()
    };
  }

  public resolveSuggestions(context: ConversationContext): ContextResolution {
    const suggestions = this.engine.generateOfflineSuggestions(
      context.partnerText,
      context.myLastText
    );
    return { context, suggestions };
  }
}
