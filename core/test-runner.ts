import { PredictiveEngine } from './engine/predictive.ts';
import { analyzeDraftLocal } from './engine/roast-engine.ts';
import { segmentChatBubbles } from './ocr/bubble-segmentation.ts';
import { findMatches } from './vault/curated-lines.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
  console.log(`PASS: ${message}`);
}

console.log('--- Testing Predictive Engine ---');
const pred = new PredictiveEngine();
const completions = pred.completePrefix('wh', 3);
assert(completions.includes('what'), 'Prefix "wh" should complete to "what"');

const nextWords = pred.predictNextWord('how', 3);
assert(nextWords.includes('are'), 'Next word after "how" should predict "are"');

console.log('\n--- Testing Roast / Rizz Test Engine ---');
const dryResult = analyzeDraftLocal('hey');
assert(dryResult.score <= 3 && dryResult.verdict === 'Dry', 'Dry message "hey" should score <= 3');
assert(dryResult.improved.length > 0, 'Dry message should provide an upgraded response');

const smoothResult = analyzeDraftLocal('Are you always this much trouble?');
assert(smoothResult.score >= 8 && smoothResult.verdict === 'Smooth', 'Playful banter should score >= 8');

console.log('\n--- Testing Offline Vault Matcher ---');
const matches = findMatches('coffee weekend');
assert(matches.length > 0, 'Should find curated lines matching "coffee weekend"');

console.log('\n--- Testing Chat Bubble OCR Segmentation ---');
const sampleBlocks = [
  { text: 'Carrier 5G', x: 20, y: 30, width: 100, screenWidth: 1080 }, // Status bar (should be filtered)
  { text: 'Hey, saw your hiking photos!', x: 50, y: 400, width: 300, screenWidth: 1080 }, // Left / partner
  { text: 'Haha thanks, that was in Yosemite', x: 700, y: 550, width: 320, screenWidth: 1080 } // Right / user
];
const segmented = segmentChatBubbles(sampleBlocks);
assert(segmented.senderText === 'Hey, saw your hiking photos!', 'Left-aligned bubble should be identified as partner');
assert(segmented.myLastText === 'Haha thanks, that was in Yosemite', 'Right-aligned bubble should be identified as user');

console.log('\nAll core engine tests passed successfully!');
