export interface ExtractedChat {
  senderText?: string;
  myLastText?: string;
  detectedName?: string;
  rawBlocks: string[];
}

/**
 * Parses raw OCR bounding blocks into sender vs receiver messages based on
 * standard dating app layouts (Tinder, Bumble, Hinge, Instagram).
 * In left-to-right phone layouts:
 * - Bounding boxes on the left (x < threshold) are the Match/Receiver.
 * - Bounding boxes on the right (x > threshold) are User/Sender.
 */
export function segmentChatBubbles(
  blocks: Array<{ text: string; x: number; y: number; width: number; screenWidth: number }>
): ExtractedChat {
  const result: ExtractedChat = {
    rawBlocks: blocks.map(b => b.text)
  };

  if (blocks.length === 0) return result;

  // Filter out system UI elements (battery, carrier, timestamp bars, bottom navigation)
  const conversationBlocks = blocks.filter(b => {
    const isTopBar = b.y < 120; // Status bar
    const isBottomNav = b.y > (b.screenWidth * 1.8); // Input box or system gesture nav
    return !isTopBar && !isBottomNav;
  });

  // Sort vertically top to bottom
  conversationBlocks.sort((a, b) => a.y - b.y);

  // Identify last messages
  for (let i = conversationBlocks.length - 1; i >= 0; i--) {
    const b = conversationBlocks[i];
    const isRightAligned = (b.x + b.width / 2) > (b.screenWidth / 2);

    if (!isRightAligned && !result.senderText) {
      result.senderText = b.text;
    } else if (isRightAligned && !result.myLastText) {
      result.myLastText = b.text;
    }

    if (result.senderText && result.myLastText) break;
  }

  return result;
}
