import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@zuari/signals': path.resolve(__dirname, '../../../webframework/fast/packages/signals/src/index.ts'),
      '@zuari/dom': path.resolve(__dirname, '../../../webframework/fast/packages/dom/src/index.ts'),
      '@zuari/kotlin': path.resolve(__dirname, '../../../webframework/fast/packages/kotlin/src/index.ts'),
      '@zuari/ai': path.resolve(__dirname, '../../../webframework/fast/packages/ai/src/index.ts')
    }
  }
});
