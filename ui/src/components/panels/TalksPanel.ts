import { signal } from '@zuari/signals';
import { html } from '@zuari/dom';
import { mountList, mountTemplate } from '../../services/dom-helper.ts';

const TALKS_DECKS = [
  {
    name: 'Icebreakers',
    lines: [
      'Two truths and a lie—you go first.',
      'What is the most spontaneous thing you have done this year?',
      'Unpopular opinion: what food is wildly overrated?'
    ]
  },
  {
    name: 'Flirty',
    lines: [
      'I was going to play it cool, but you made that impossible.',
      'Careful, keep talking like that and I might actually like you.',
      'Are you always this much trouble or is today special?'
    ]
  },
  {
    name: 'Date Pivots',
    lines: [
      'This is fun, but I am way better in person. Coffee this week?',
      'Skip the small talk—what is your go-to spot for drinks?',
      'Are you free Thursday evening? I know a great place.'
    ]
  },
  {
    name: 'Recovery',
    lines: [
      'You are a person of few words—good thing I speak fluent mystery.',
      'I will take that as a yes. What are you up to this weekend?',
      'Do not hurt your thumbs typing a whole novel over there.'
    ]
  },
  {
    name: 'Deals',
    lines: [
      'Quick check-in—are we still aligned to kick this off this week?',
      'Totally fair—let us look at the ROI: this pays for itself in week one.',
      'If everything looks good, I can send the agreement over today—shall we lock it in?'
    ]
  }
];

export function TalksPanel(options: {
  onSelectLine: (line: string) => void;
  onClose: () => void;
}) {
  const activeDeck = signal<number>(0);

  return mountTemplate(html`
    <div class="clipboard-view" style="padding: 8px;">
      <div class="clipboard-header">
        <span>Rizz Talks — Tap to Insert</span>
        <button class="back-link" @click=${options.onClose}>ABC ✕</button>
      </div>
      <div class="emoji-tabs" style="margin-bottom: 6px;">
        ${TALKS_DECKS.map((deck, idx) => html`
          <button
            class=${() => idx === activeDeck.value ? 'emoji-tab active' : 'emoji-tab'}
            style="font-size: 11px; padding: 4px 8px;"
            @click=${() => (activeDeck.value = idx)}>
            ${deck.name}
          </button>
        `)}
      </div>
      ${() => {
        const deck = TALKS_DECKS[activeDeck.value] ?? TALKS_DECKS[0];
        return mountList(
          'clipboard-list',
          deck.lines.map(line => html`
            <div class="clipboard-item-row">
              <div class="clipboard-item" @click=${() => options.onSelectLine(line)}>
                ${line}
              </div>
            </div>
          `)
        );
      }}
    </div>
  `);
}
