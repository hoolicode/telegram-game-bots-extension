const esbuild = require('esbuild');

async function buildContentScript(): Promise<unknown> {
  return esbuild.build({
    entryPoints: ['src/extension/content.ts'],
    bundle: true,
    write: true,
    outdir: 'dist/hamster-combat-extension/browser/',
  });
}

async function buildTelegramWebviewContentScript(): Promise<unknown> {
  return esbuild.build({
    entryPoints: ['src/extension/telegram-webview.ts'],
    bundle: true,
    write: true,
    outdir: 'dist/hamster-combat-extension/browser/',
  });
}

async function buildKittyVerseContentScript(): Promise<unknown> {
  return esbuild.build({
    entryPoints: ['src/extension/kitty-verse.ts'],
    bundle: true,
    write: true,
    outdir: 'dist/hamster-combat-extension/browser/',
  });
}

async function buildBackgroundScript(): Promise<unknown> {
  return esbuild.build({
    entryPoints: ['src/extension/background.ts'],
    bundle: true,
    write: true,
    outdir: 'dist/hamster-combat-extension/browser/',
  });
}

// Build process
async function buildChromeExtension(): Promise<void> {
  try {
    await buildContentScript();
    await buildTelegramWebviewContentScript();
    await buildKittyVerseContentScript();
    await buildBackgroundScript();
    console.info('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
  }
}

void buildChromeExtension();
