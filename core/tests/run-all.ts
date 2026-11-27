import {
  PredictiveEngine,
  analyzeDraftLocal,
  segmentChatBubbles,
  findMatches,
  HybridContextRouter,
  formatAlertPillText,
  formatSourceBadge
} from '../index.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
  console.log(`PASS: ${message}`);
}

export function runCoreTestSuite(): void {
  console.log('--- [Dept 1: Core] Testing Predictive Engine ---');
  const pred = new PredictiveEngine();
  assert(pred.completePrefix('wh', 3).includes('what'), 'Prefix "wh" should complete to "what"');
  assert(pred.predictNextWord('how', 3).includes('are'), 'Next word after "how" should predict "are"');

  console.log('\n--- [Dept 1: Core] Testing Roast / Rizz Test Engine ---');
  const dryResult = analyzeDraftLocal('hey');
  assert(dryResult.score <= 3 && dryResult.verdict === 'Dry', 'Dry message "hey" should score <= 3');
  assert(dryResult.improved.length > 0, 'Dry message should provide an upgraded response');

  const smoothResult = analyzeDraftLocal('Are you always this much trouble?');
  assert(smoothResult.score >= 8 && smoothResult.verdict === 'Smooth', 'Playful banter should score >= 8');

  console.log('\n--- [Dept 1: Core] Testing Offline Vault Matcher ---');
  assert(findMatches('coffee weekend').length > 0, 'Should find curated lines matching "coffee weekend"');
  assert(findMatches('zzzznonexistentkeyword').length === 0, 'Unmatched gibberish should return 0 vault hits');

  console.log('\n--- [Dept 1: Core] Testing Chat Bubble Coordinate Segmentation ---');
  const sampleBlocks = [
    { text: 'Carrier 5G', x: 20, y: 30, width: 100, screenWidth: 1080 },
    { text: 'Hey, saw your hiking photos!', x: 50, y: 400, width: 300, screenWidth: 1080 },
    { text: 'Haha thanks, that was in Yosemite', x: 700, y: 550, width: 320, screenWidth: 1080 }
  ];
  const segmented = segmentChatBubbles(sampleBlocks);
  assert(segmented.senderText === 'Hey, saw your hiking photos!', 'Left bubble identified as partner');
  assert(segmented.myLastText === 'Haha thanks, that was in Yosemite', 'Right bubble identified as user');

  console.log('\n--- [Dept 1: Core] Testing Multi-Platform Hybrid Context Router ---');
  const router = new HybridContextRouter();

  const snapCtx = router.ingestRawContext({
    source: 'notification',
    text: 'What is your biggest red flag?',
    senderName: 'Maya',
    appPackage: 'com.snapchat.android'
  });
  assert(snapCtx !== null, 'Snapchat notification context ingested');
  assert(formatSourceBadge(snapCtx!).includes('Snapchat'), 'Badge resolves Snapchat package');
  assert(formatAlertPillText(snapCtx!).includes('Snapchat'), 'Alert pill resolves Snapchat label');

  const snapReplies = router.resolveSuggestions(snapCtx!);
  assert(snapReplies.suggestions.length === 3, 'Returns Smooth, Tease, and Bold suggestions');
  assert(
    snapReplies.suggestions.some(s => s.line.toLowerCase().includes('staring contest')),
    'Red flag prompt matches curated red-flag banter'
  );

  // Self-commit filter
  const chosenReply = snapReplies.suggestions[0].line;
  router.recordCommittedReply(chosenReply);
  assert(
    router.ingestRawContext({ source: 'clipboard', text: chosenReply }) === null,
    'Own committed reply filtered from clipboard loop'
  );

  // Noise filter vs intentional selection/manual
  assert(router.ingestRawContext({ source: 'clipboard', text: 'https://instagram.com/reel/123' }) === null, 'URL ignored in clipboard');
  assert(router.ingestRawContext({ source: 'clipboard', text: '482910' }) === null, 'OTP ignored in clipboard');
  assert(router.ingestRawContext({ source: 'manual', text: 'she sent a dog snap' }) !== null, 'Stealth manual prompt honored');
  assert(router.ingestRawContext({ source: 'selection', text: 'drinks tonight?' }) !== null, 'Browser text selection honored');

  // Web DOM & Android Accessibility block ingestion
  const domCtx = router.ingestScreenBlocks(sampleBlocks, 'dom', { appPackage: 'web.whatsapp.com' });
  assert(domCtx !== null && formatSourceBadge(domCtx).includes('WhatsApp Web'), 'Web DOM chat blocks resolved');

  console.log('\n✓ All Dept 1 Core Engine tests passed!');
}

runCoreTestSuite();
