import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function resolveZuariModule(pkg: string, fallbackFile: string): string {
  const siblingRepoPath = path.resolve(
    __dirname,
    `../../../webframework/fast/packages/${pkg}/src/index.ts`
  );
  if (fs.existsSync(siblingRepoPath)) {
    return siblingRepoPath;
  }
  return path.resolve(__dirname, `./src/vendor/zuari/${fallbackFile}`);
}

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@zuari/signals': resolveZuariModule('signals', 'signals.ts'),
      '@zuari/dom': resolveZuariModule('dom', 'dom.ts'),
      '@zuari/kotlin': resolveZuariModule('kotlin', 'kotlin.ts'),
      '@zuari/ai': resolveZuariModule('ai', 'ai.ts')
    }
  }
});
