interface ReleaseArtifactMeta {
  fileName: string;
  url: string;
  sizeFormatted: string;
  sha256: string;
}

interface ReleaseManifest {
  version: string;
  builtAt: string;
  apk: ReleaseArtifactMeta;
  extension: ReleaseArtifactMeta;
}

export async function hydrateReleaseDownloads(): Promise<void> {
  try {
    const res = await fetch('./downloads/release-manifest.json');
    if (!res.ok) return;
    const manifest = (await res.json()) as ReleaseManifest;

    // Update APK metadata & links
    setText('apk-size-badge', manifest.apk.sizeFormatted);
    setText('dl-apk-size', `Size: ${manifest.apk.sizeFormatted}`);
    setText('apk-sha256-value', `SHA-256: ${manifest.apk.sha256}`);
    setHref('nav-download-apk', manifest.apk.url);
    setHref('hero-download-apk', manifest.apk.url);
    setHref('card-download-apk', manifest.apk.url);
    bindCopyButton('copy-apk-sha', manifest.apk.sha256);

    // Update Extension metadata & links
    setText('ext-size-badge', manifest.extension.sizeFormatted);
    setText('dl-ext-size', `Size: ${manifest.extension.sizeFormatted}`);
    setText('ext-sha256-value', `SHA-256: ${manifest.extension.sha256}`);
    setHref('hero-download-ext', manifest.extension.url);
    setHref('card-download-ext', manifest.extension.url);
    bindCopyButton('copy-ext-sha', manifest.extension.sha256);
  } catch {
    // Static fallback values in HTML remain intact
  }
}

function setText(id: string, value: string) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHref(id: string, href: string) {
  const el = document.getElementById(id) as HTMLAnchorElement | null;
  if (el) el.href = href;
}

function bindCopyButton(id: string, rawHash: string) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', () => {
    navigator.clipboard?.writeText(rawHash).catch(() => {});
    const original = btn.textContent;
    btn.textContent = 'Copied ✓';
    setTimeout(() => {
      btn.textContent = original;
    }, 1600);
  });
}
