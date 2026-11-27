import type { ContextSource } from './types.ts';

export class ContextNoiseFilter {
  private readonly recentSelfCommits = new Set<string>();

  public recordSelfCommit(text: string): void {
    const norm = this.normalize(text);
    if (!norm) return;
    this.recentSelfCommits.add(norm);
    if (this.recentSelfCommits.size > 25) {
      const oldest = this.recentSelfCommits.values().next().value;
      if (oldest) this.recentSelfCommits.delete(oldest);
    }
  }

  public isIgnored(text: string, source: ContextSource): boolean {
    const trimmed = text.trim();
    if (!trimmed) return true;

    // User-initiated manual or highlighted selections are always intentional
    if (source === 'manual' || source === 'selection') return false;

    const norm = this.normalize(trimmed);
    if (this.recentSelfCommits.has(norm)) return true;

    // Ignore standalone URLs and numeric 2FA OTP codes in automatic hooks
    if (/^https?:\/\/\S+$/i.test(trimmed)) return true;
    if (/^\d{4,8}$/.test(trimmed)) return true;

    return false;
  }

  public normalize(text: string): string {
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
  }
}
