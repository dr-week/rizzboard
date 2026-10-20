export interface RizzResponse {
  vibe: 'Smooth' | 'Tease' | 'Bold';
  line: string;
}

export function buildRizzPrompt(partnerMessage: string, myPreviousContext?: string): string {
  return `You are an elite wingman who excels at playful, concise, charismatic banter.
Your task: Suggest 3 distinct next moves for a dating app conversation.
Strict rules:
1. MAX 12 words per line.
2. NO cheesy cliché compliments like "Hey cutie" or "You must be tired from running through my mind".
3. Use witty banter, slight teasing, or confident playful framing.
4. Output MUST be valid JSON array with keys: "vibe" (Smooth | Tease | Bold) and "line" (string).

Partner said: "${partnerMessage}"
${myPreviousContext ? `Context I said previously: "${myPreviousContext}"` : ''}

Respond ONLY with the JSON array:`;
}

export function buildRewritePrompt(draft: string): string {
  return `You are a charisma coach. Rewrite this bland text message into 3 sharper, confident, flirty versions.
Max 12 words each.
Bland text: "${draft}"

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`;
}
