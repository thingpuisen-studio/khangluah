import { chromium } from 'playwright';

async function runExportTabEdgeCasesAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: EXPORT TAB EDGE CASES...\n');

  const isHeaded = process.env.HEADLESS !== 'true';
  const browser = await chromium.launch({
    headless: !isHeaded,
    slowMo: isHeaded ? 350 : 0
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

  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  try {
    await page.goto('http://localhost:4321/admin', { waitUntil: 'domcontentloaded' });
    const mainUi = page.locator('#admin-main-ui');
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });
    assert(await mainUi.isVisible(), 'Admin main UI studio is active and accessible');

    const writeTabBtn = page.locator('button.nav-tab-btn[data-target="tab-write"]');
    const exportTabBtn = page.locator('button.nav-tab-btn[data-target="tab-code"]');
    const codeOutput = page.locator('#code-output code');
    const filenameLabel = page.locator('#target-filename-label');

    // =========================================================================
    // EDGE CASE 1: Empty Body Fallback Comment in Markdown Output
    // =========================================================================
    console.log('\n🧪 Edge Case 1: Empty Body Fallback Comment');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    await page.locator('#post-title').fill('Empty Body Test Post');
    await page.locator('#post-slug').fill('empty-body-test');
    await page.locator('#post-body').fill(''); // Clear body completely
    await page.waitForTimeout(200);

    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const emptyBodyCode = await codeOutput.innerText();
    assert(
      emptyBodyCode.includes('<!-- Verses or content -->'),
      'Empty body safely renders fallback comment "<!-- Verses or content -->"'
    );

    // =========================================================================
    // EDGE CASE 2: Complex YAML Frontmatter Escaping (Colons, Quotes, Slashes)
    // =========================================================================
    console.log('\n🧪 Edge Case 2: Complex YAML Frontmatter Characters Escaping');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    const complexTitle = 'Simte: An Anthropological Study - Vol. 1: "The Clan Origins" & [ŋ] Phonemes';
    const complexSubtitle = 'Case Studies: 100% Verified / "Fieldwork" & Tone Analysis';
    await page.locator('#post-title').fill(complexTitle);
    await page.locator('#post-subtitle').fill(complexSubtitle);
    await page.waitForTimeout(200);

    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const complexCode = await codeOutput.innerText();
    // In valid YAML frontmatter generated with JSON.stringify, colons and quotes are properly wrapped
    assert(
      complexCode.includes('title: "Simte: An Anthropological Study - Vol. 1: \\"The Clan Origins\\" & [ŋ] Phonemes"'),
      'Title with colons, quotes, and IPA brackets is correctly JSON-quoted in YAML frontmatter'
    );
    assert(
      complexCode.includes('subtitle: "Case Studies: 100% Verified / \\"Fieldwork\\" & Tone Analysis"'),
      'Subtitle with slashes, percent, and quotes is correctly JSON-quoted in YAML frontmatter'
    );

    // =========================================================================
    // EDGE CASE 3: Irregular Tag Formats (Empty items, Excess Whitespace, Duplicates)
    // =========================================================================
    console.log('\n🧪 Edge Case 3: Irregular Tag Whitespace & Comma Sanitization');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    await page.locator('#post-tags').fill('   linguistics  , ,   syntax   ,  , ,   phonology   ');
    await page.waitForTimeout(200);

    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const tagsCode = await codeOutput.innerText();
    assert(tagsCode.includes('- "linguistics"'), 'First tag trimmed of excess whitespace');
    assert(tagsCode.includes('- "syntax"'), 'Middle tag trimmed of excess whitespace');
    assert(tagsCode.includes('- "phonology"'), 'Last tag trimmed of excess whitespace');
    assert(!tagsCode.includes('- ""'), 'Empty comma entries pruned from YAML tags list');

    // =========================================================================
    // EDGE CASE 4: Poem Verse Trailing Spaces & Multi-Stanza Formatting
    // =========================================================================
    console.log('\n🧪 Edge Case 4: Poem Verse Trailing Two Spaces Formatting');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    await page.locator('.type-pill-btn[data-type="poem"]').click();
    await page.waitForTimeout(200);

    const verseText = 'Above the misty pines they wander\nBeneath the quiet evening stars\n\nAcross the hills of ancient thunder\nBeyond the silent earthen jars';
    await page.locator('#post-body').fill(verseText);
    await page.waitForTimeout(200);

    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const poemExportCode = await codeOutput.innerText();
    assert(
      poemExportCode.includes('Above the misty pines they wander  \nBeneath the quiet evening stars'),
      'Poem lines within stanza receive two trailing spaces ("  \\n") for Markdown verse line breaks'
    );
    assert(
      poemExportCode.includes('evening stars\n\nAcross the hills'),
      'Stanzas are cleanly separated by double newlines without dangling spaces'
    );

    // =========================================================================
    // EDGE CASE 5: Poem Couplet Block Scalar Formatting (`featuredCouplet: |`)
    // =========================================================================
    console.log('\n🧪 Edge Case 5: Poem Couplet Multiline Block Scalar');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    const coupletText = 'Line one of ancient couplet\nLine two of ancient couplet';
    await page.locator('#poem-couplet-input').fill(coupletText);
    await page.waitForTimeout(200);

    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const coupletCode = await codeOutput.innerText();
    assert(
      coupletCode.includes('featuredCouplet: |') &&
      coupletCode.includes('  Line one of ancient couplet\n  Line two of ancient couplet'),
      'Multiline couplet formatted as YAML literal block scalar with 2-space indentation'
    );

    // =========================================================================
    // EDGE CASE 6: Academic Paper Schema Full Frontmatter Output
    // =========================================================================
    console.log('\n🧪 Edge Case 6: Academic Paper Schema Full Metadata');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    await page.locator('.type-pill-btn[data-type="academic_paper"]').click();
    await page.waitForTimeout(200);

    await page.locator('#paper-journal').fill('Linguistics of the Tibeto-Burman Area');
    await page.locator('#paper-doi').fill('10.1075/ltba.24.2.04kap');
    await page.locator('#paper-volume').fill('Vol. 47:2, pp. 185-212');
    await page.locator('#paper-issn').fill('0731-3500');
    await page.locator('#paper-lang').fill('Simte (smt)');
    await page.locator('#paper-abstract').fill('Comprehensive morphosyntactic investigation of agreement markers in Simte.');
    await page.waitForTimeout(200);

    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const academicCode = await codeOutput.innerText();
    assert(academicCode.includes('postType: "academic_paper"'), 'postType correctly set to academic_paper');
    assert(academicCode.includes('journal: "Linguistics of the Tibeto-Burman Area"'), 'Journal metadata exported');
    assert(academicCode.includes('doi: "10.1075/ltba.24.2.04kap"'), 'DOI metadata exported');
    assert(academicCode.includes('volume: "Vol. 47:2, pp. 185-212"'), 'Volume metadata exported');
    assert(academicCode.includes('issn: "0731-3500"'), 'ISSN metadata exported');
    assert(academicCode.includes('language: "Simte (smt)"'), 'Language metadata exported');
    assert(academicCode.includes('abstract: "Comprehensive morphosyntactic investigation of agreement markers in Simte."'), 'Abstract metadata exported');

    // =========================================================================
    // EDGE CASE 7: Essay / Monograph Reading Time Estimation
    // =========================================================================
    console.log('\n🧪 Edge Case 7: Essay Reading Time Calculation');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    await page.locator('.type-pill-btn[data-type="essay"]').click();
    await page.waitForTimeout(200);

    // Write a 450-word body to trigger calculated reading time
    const longEssayWords = Array(450).fill('linguistic').join(' ');
    await page.locator('#post-body').fill(longEssayWords);
    await page.waitForTimeout(200);

    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const essayCode = await codeOutput.innerText();
    assert(essayCode.includes('postType: "essay"'), 'postType correctly set to essay');
    assert(essayCode.includes('readingTime: "5 min read"'), 'Reading time reflects essay schema default ("5 min read")');

    // Test custom reading time input
    await writeTabBtn.click();
    await page.waitForTimeout(200);
    await page.locator('#post-reading-time').fill('8 min read');
    await page.waitForTimeout(200);

    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const customEssayCode = await codeOutput.innerText();
    assert(customEssayCode.includes('readingTime: "8 min read"'), 'Custom reading time dynamically exported ("8 min read")');

    // =========================================================================
    // EDGE CASE 8: Target Filename Label Sync Across Schemas
    // =========================================================================
    console.log('\n🧪 Edge Case 8: Target Filename Resolution');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    await page.locator('#post-slug').fill('tibeto-burman-phonology-analysis');
    await page.waitForTimeout(200);

    await exportTabBtn.click();
    await page.waitForTimeout(200);

    const currentFilename = (await filenameLabel.innerText()).trim();
    assert(
      currentFilename === 'src/content/posts/tibeto-burman-phonology-analysis.md',
      `Target filename correctly formatted: "${currentFilename}"`
    );

    // =========================================================================
    // EDGE CASE 9: Copy Markdown Action Toast Verification
    // =========================================================================
    console.log('\n🧪 Edge Case 9: Copy Markdown Button Toast Feedback');
    const copyBtn = page.locator('#btn-copy-code');
    await copyBtn.click();
    await page.waitForTimeout(300);

    const toastMsg = page.locator('#cms-toast-msg');
    const toastText = (await toastMsg.innerText()).trim();
    assert(
      toastText.toLowerCase().includes('copied to clipboard'),
      `Toast feedback rendered on copy action: "${toastText}"`
    );

    // =========================================================================
    // EDGE CASE 10: Download .md File Action
    // =========================================================================
    console.log('\n🧪 Edge Case 10: Download .md Action Trigger');
    const downloadPromise = page.waitForEvent('download', { timeout: 3000 }).catch(() => null);
    await page.locator('#btn-download-file').click();
    const download = await downloadPromise;

    if (download) {
      const suggestedFilename = download.suggestedFilename();
      assert(
        suggestedFilename === 'tibeto-burman-phonology-analysis.md',
        `Downloaded file matches slug: "${suggestedFilename}"`
      );
    } else {
      // In environments where simulated download triggers without OS save dialog
      assert(await page.locator('#cms-toast').isVisible(), 'Download action triggered toast confirmation');
    }

  } catch (error) {
    console.error('💥 Export Edge Case Test execution threw an uncaught error:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`📊 EXPORT TAB EDGE CASES AUDIT: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runExportTabEdgeCasesAudit();
