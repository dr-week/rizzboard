import { initInteractiveSimulator } from './simulator.ts';
import { hydrateReleaseDownloads } from './downloads.ts';

document.addEventListener('DOMContentLoaded', () => {
  initInteractiveSimulator();
  hydrateReleaseDownloads();
});
