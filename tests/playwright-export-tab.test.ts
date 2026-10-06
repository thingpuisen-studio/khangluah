import { chromium } from 'playwright';

async function runExportTabDeepAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: EXPORT .MD TAB ONLY...\n');

  const isHeaded = process.env.HEADLESS !== 'true';
  const browser = await chromium.launch({
    headless: !isHeaded,
    slowMo: isHeaded ? 400 : 0
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 },
    acceptDownloads: true,
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page = await context.newPage();

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    await page.goto('http://localhost:4321/admin', { waitUntil: 'domcontentloaded' });
    const mainUi = page.locator('#admin-main-ui');
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });
    assert(await mainUi.isVisible(), 'Admin main UI studio is active and accessible');

    // =========================================================================
    // FEATURE 1: Tab Navigation & Initial Export View
    // =========================================================================
    console.log('\n🧪 Feature 1: Tab Navigation & Initial View');
    const exportTabBtn = page.locator('button.nav-tab-btn[data-target="tab-code"]');
    assert(await exportTabBtn.isVisible(), 'Export .md navigation tab button is rendered');

    await exportTabBtn.click();
    await page.waitForTimeout(300);

    const exportSection = page.locator('#tab-code');
    assert(await exportSection.isVisible(), 'Export tab panel (#tab-code) is visible');

    const codeContainer = page.locator('#code-output code');
    assert(await codeContainer.isVisible(), 'Markdown code container is visible');

    const copyBtn = page.locator('#btn-copy-code');
    const downloadBtn = page.locator('#btn-download-file');
    assert(await copyBtn.isVisible(), 'Copy Markdown action button is visible');
    assert(await downloadBtn.isVisible(), 'Download .md action button is visible');

    // =========================================================================
    // FEATURE 2: Schema 1 - Poem Markdown Frontmatter & Stanza Formatting
    // =========================================================================
    console.log('\n🧪 Feature 2: Poem Schema Frontmatter & Stanza Formatting');
    await page.locator('button.nav-tab-btn[data-target="tab-write"]').click();
    await page.waitForTimeout(200);

    // Select Poem type pill
    await page.locator('.type-pill-btn[data-type="poem"]').click();
    await page.locator('#post-title').fill('Whispers of the Lushai Hills');
    await page.locator('#post-subtitle').fill('A Solitary Verse of the High Ridges');
    await page.locator('#poem-couplet-input').fill('When winds ascend the misty pine,\nThe stars recall your ancient line.');
    await page.locator('#poem-reflection-input').fill('Reflecting on high-altitude migration patterns in Mizoram.');
    await page.locator('#post-tags').fill('Poetry, Hills, Lushai, Nature');
    await page.locator('#post-body').fill('First stanza line one\nFirst stanza line two\n\nSecond stanza line one\nSecond stanza line two');
    await page.waitForTimeout(300);

    // Switch to Export tab
    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const poemCode = await codeContainer.innerText();
    assert(poemCode.startsWith('---'), 'Export starts with YAML frontmatter delimiters');
    assert(poemCode.includes('title: "Whispers of the Lushai Hills"'), 'Frontmatter contains quoted title');
    assert(poemCode.includes('postType: "poem"'), 'Frontmatter specifies postType: "poem"');
    assert(
      poemCode.includes('featuredCouplet: |') && poemCode.includes('When winds ascend the misty pine,'),
      'Frontmatter contains featured couplet YAML block scalar'
    );
    assert(
      poemCode.includes('abstract: "Reflecting on high-altitude migration patterns in Mizoram."'),
      'Frontmatter contains poem reflection abstract'
    );
    assert(poemCode.includes('  \nFirst stanza line two'), 'Stanza line breaks contain markdown trailing double spaces ("  \\n")');

    const targetLabel = page.locator('#target-filename-label');
    const targetPath = (await targetLabel.innerText()).trim();
    assert(
      targetPath === 'src/content/posts/whispers-of-the-lushai-hills.md',
      `Target filename correctly formatted: "${targetPath}"`
    );

    // =========================================================================
    // FEATURE 3: Schema 2 - Academic Research Paper Metadata Export
    // =========================================================================
    console.log('\n🧪 Feature 3: Academic Research Paper Metadata Export');
    await page.locator('button.nav-tab-btn[data-target="tab-write"]').click();
    await page.waitForTimeout(200);

    // Select Academic Paper type pill
    await page.locator('.type-pill-btn[data-type="academic_paper"]').click();
    await page.locator('#post-title').fill('Phonological Inventory of Simte Language');
    await page.locator('#paper-journal').fill('Journal of South Asian Linguistics');
    await page.locator('#paper-volume').fill('Vol. 14, No. 2, pp. 88-112');
    await page.locator('#paper-issn').fill('1947-8232');
    await page.locator('#paper-doi').fill('10.1515/jsal-2026-0042');
    await page.locator('#paper-abstract').fill('This study investigates tone contrasts and segmental phonemes in Simte.');
    await page.locator('#post-body').fill('## 1. Introduction\n\nSimte exhibits complex acoustic pitch contrasts.');
    await page.waitForTimeout(300);

    // Switch to Export tab
    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const paperCode = await codeContainer.innerText();
    assert(paperCode.includes('postType: "academic_paper"'), 'Frontmatter specifies postType: "academic_paper"');
    assert(paperCode.includes('journal: "Journal of South Asian Linguistics"'), 'Frontmatter contains academic journal');
    assert(paperCode.includes('volume: "Vol. 14, No. 2, pp. 88-112"'), 'Frontmatter contains journal volume');
    assert(paperCode.includes('issn: "1947-8232"'), 'Frontmatter contains ISSN identifier');
    assert(paperCode.includes('doi: "10.1515/jsal-2026-0042"'), 'Frontmatter contains publication DOI');
    assert(
      paperCode.includes('abstract: "This study investigates tone contrasts and segmental phonemes in Simte."'),
      'Frontmatter contains paper abstract'
    );
    assert(paperCode.includes('## 1. Introduction'), 'Markdown body contains academic introduction heading');

    // =========================================================================
    // FEATURE 4: Clipboard Copy Action
    // =========================================================================
    console.log('\n🧪 Feature 4: Clipboard Copy Action & Toast Confirmation');
    await copyBtn.click();
    await page.waitForTimeout(300);

    const toastMsg = page.locator('#cms-toast-msg');
    const toastText = (await toastMsg.innerText()).trim();
    assert(
      toastText.includes('copied to clipboard') || toastText.length > 0,
      `Toast triggered on copy action ("${toastText}")`
    );

    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    assert(
      clipboardContent.includes('postType: "academic_paper"') && clipboardContent.includes('Journal of South Asian Linguistics'),
      'Clipboard content accurately matches generated markdown code'
    );

    // =========================================================================
    // FEATURE 5: Browser File Download Action
    // =========================================================================
    console.log('\n🧪 Feature 5: Browser File Download Trigger');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadBtn.click()
    ]);

    const suggestedFilename = download.suggestedFilename();
    assert(
      suggestedFilename === 'phonological-inventory-of-simte-language.md',
      `Browser download suggested filename matches slug: "${suggestedFilename}"`
    );

  } catch (error) {
    console.error('💥 Test execution threw an uncaught error:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log(`📊 EXPORT .MD TAB TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runExportTabDeepAudit();
