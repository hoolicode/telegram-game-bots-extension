const esbuild = require('esbuild');

async function buildBackgroundScript(): Promise<unknown> {
  return esbuild.build({
    entryPoints: ['src/extension/content.ts'],
    bundle: true,
    write: true,
    outdir: 'dist/hamster-combat-extension/browser/'
  });
}

// Build process
async function buildChromeExtension(): Promise<void> {
  try {
    await buildBackgroundScript();
    console.info('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
  }
}

buildChromeExtension();
