import { chromium } from 'playwright';

async function runPreviewTabEdgeCasesAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: PREVIEW TAB EDGE CASES...\n');

  const isHeaded = process.env.HEADLESS !== 'true';
  const browser = await chromium.launch({
    headless: !isHeaded,
    slowMo: isHeaded ? 350 : 0
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 }
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

    const previewTabBtn = page.locator('button.nav-tab-btn[data-target="tab-preview"]');
    const writeTabBtn = page.locator('button.nav-tab-btn[data-target="tab-write"]');
    const titleInput = page.locator('#post-title');
    const subtitleInput = page.locator('#post-subtitle');
    const dateInput = page.locator('#post-date');
    const coverInput = page.locator('#post-cover');
    const tagsInput = page.locator('#post-tags');
    const bodyInput = page.locator('#post-body');

    // =========================================================================
    // EDGE CASE 1: XSS / HTML Injection Defense in Markdown Body
    // =========================================================================
    console.log('\n🧪 Edge Case 1: XSS / HTML Script Injection Neutralization');
    await page.evaluate(() => {
      (window as any).__xssRan = false;
    });

    const maliciousBody = `
Normal introduction paragraph.

<script>window.__xssRan = true;</script>
<img src="invalid_img_path" onerror="window.__xssRan = true;" />

End of paragraph.
`;

    await bodyInput.fill(maliciousBody);
    await previewTabBtn.click();
    await page.waitForTimeout(400);

    const renderedMarkdown = page.locator('#prev-markdown-rendered');
    const htmlContent = await renderedMarkdown.innerHTML();

    // Verify script tags were escaped as entities
    assert(
      htmlContent.includes('&lt;script&gt;') && htmlContent.includes('&lt;img'),
      'Raw HTML tags (<script>, <img>) escaped to safe entities (&lt;script&gt;, &lt;img)'
    );

    const xssTriggered = await page.evaluate(() => (window as any).__xssRan);
    assert(
      !xssTriggered,
      'Neutralized script payload: window.__xssRan was not executed'
    );

    // =========================================================================
    // EDGE CASE 2: XSS in Code Block Language & Content
    // =========================================================================
    console.log('\n🧪 Edge Case 2: Code Block Syntax & Injection Neutralization');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    const maliciousCodeBlock = "```python\n<b onmouseover=alert(1)>print('hello')</b>\n```";
    await bodyInput.fill(maliciousCodeBlock);
    await previewTabBtn.click();
    await page.waitForTimeout(300);

    const renderedCodeSnippet = page.locator('#prev-markdown-rendered pre code');
    assert(await renderedCodeSnippet.isVisible(), 'Code block rendered successfully');
    const codeInnerHtml = await renderedCodeSnippet.innerHTML();
    assert(
      codeInnerHtml.includes('&lt;b') && !codeInnerHtml.includes('<b onmouseover'),
      'HTML entities inside fenced code blocks are sanitized against injection'
    );

    // =========================================================================
    // EDGE CASE 3: Markdown Tables Rendering
    // =========================================================================
    console.log('\n🧪 Edge Case 3: Markdown Table Parser Validation');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    const tableMarkdown = `
| Morpheme | Gloss | Category |
|---|---|---|
| -na | LOC | Case |
| -tu | PL | Number |
| -sa | PFV | Aspect |
`;
    await bodyInput.fill(tableMarkdown);
    await previewTabBtn.click();
    await page.waitForTimeout(300);

    const table = page.locator('#prev-markdown-rendered table');
    assert(await table.isVisible(), 'Markdown table transformed into styled <table> element');
    assert(
      await page.locator('#prev-markdown-rendered th:has-text("Morpheme")').isVisible(),
      'Table header cell rendered'
    );
    assert(
      await page.locator('#prev-markdown-rendered td:has-text("-na")').isVisible() &&
      await page.locator('#prev-markdown-rendered td:has-text("LOC")').isVisible(),
      'Table data rows rendered accurately'
    );

    // =========================================================================
    // EDGE CASE 4: Unclosed Code Block Graceful Handling
    // =========================================================================
    console.log('\n🧪 Edge Case 4: Unclosed Code Fence Graceful Rendering');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    const unclosedCode = '```simte\nUnclosed code fence without closing backticks';
    await bodyInput.fill(unclosedCode);
    await previewTabBtn.click();
    await page.waitForTimeout(300);

    // Should not crash the parser or freeze execution
    assert(await mainUi.isVisible(), 'Unclosed code fence handled gracefully without crashing parser');
    const renderedText = await renderedMarkdown.innerText();
    assert(
      renderedText.includes('Unclosed code fence'),
      'Unclosed fence text displayed as content'
    );

    // =========================================================================
    // EDGE CASE 5: Ordered Lists vs Unordered Lists
    // =========================================================================
    console.log('\n🧪 Edge Case 5: Ordered & Unordered Lists Transformation');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    const listsMarkdown = `
- First bullet item
- Second bullet item

1. First enumerated step
2. Second enumerated step
`;
    await bodyInput.fill(listsMarkdown);
    await previewTabBtn.click();
    await page.waitForTimeout(300);

    const ul = page.locator('#prev-markdown-rendered ul');
    const ol = page.locator('#prev-markdown-rendered ol');
    assert(await ul.isVisible(), 'Unordered list transformed to <ul>');
    assert(await ol.isVisible(), 'Ordered list transformed to <ol>');
    assert(
      await page.locator('#prev-markdown-rendered ul li:has-text("First bullet item")').isVisible(),
      'Bullet item <li> rendered'
    );
    assert(
      await page.locator('#prev-markdown-rendered ol li:has-text("First enumerated step")').isVisible(),
      'Enumerated item <li> rendered'
    );

    // =========================================================================
    // EDGE CASE 6: 16:9 Card Plate Line-Clamping on Extreme Titles
    // =========================================================================
    console.log('\n🧪 Edge Case 6: 16:9 Card Plate Clamping on 400+ Char Title');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    const massiveTitle = 'An Exhaustive Empirical and Typological Investigation into Tone Sandhi, Differential Object Marking, and Ergative Ergativity Alignment within the Northern Chin Linguistic Subgroup of the Tibeto-Burman Family in Manipur and Surrounding Highlands ' + 'A'.repeat(150);
    await titleInput.fill(massiveTitle);
    await previewTabBtn.click();
    await page.waitForTimeout(300);

    const cardTitle = page.locator('#full-card-title');
    assert(await cardTitle.isVisible(), 'Full card preview title rendered');
    const cardTitleClass = await cardTitle.getAttribute('class');
    assert(
      cardTitleClass?.includes('line-clamp-') === true,
      `Card plate enforces CSS line-clamping classes to protect 16:9 ratio ("${cardTitleClass}")`
    );

    // =========================================================================
    // EDGE CASE 7: Date Parsing Boundary Cases (Four-Digit Year Extraction)
    // =========================================================================
    console.log('\n🧪 Edge Case 7: Four-Digit Year Extraction Boundary Cases');
    const fullYear = page.locator('#full-card-year');

    // Subcase 7A: Non-standard text with year
    await writeTabBtn.click();
    await page.waitForTimeout(100);
    await dateInput.fill('Mid Winter 2031');
    await previewTabBtn.click();
    await page.waitForTimeout(200);
    assert((await fullYear.innerText()) === '2031', 'Extracts 2031 from "Mid Winter 2031"');

    // Subcase 7B: Historical date
    await writeTabBtn.click();
    await page.waitForTimeout(100);
    await dateInput.fill('Fieldwork 1988');
    await previewTabBtn.click();
    await page.waitForTimeout(200);
    assert((await fullYear.innerText()) === '1988', 'Extracts 1988 from "Fieldwork 1988"');

    // Subcase 7C: Date string with no digits at all
    await writeTabBtn.click();
    await page.waitForTimeout(100);
    await dateInput.fill('Undated Manuscript');
    await previewTabBtn.click();
    await page.waitForTimeout(200);
    assert((await fullYear.innerText()) === '2026', 'Safely defaults year to 2026 when no digits exist');

    // =========================================================================
    // EDGE CASE 8: Academic Journal Badge Clamping in Card Header
    // =========================================================================
    console.log('\n🧪 Edge Case 8: Academic Journal Header Badge Clamping (Max 24 Chars)');
    await writeTabBtn.click();
    await page.waitForTimeout(100);
    await page.locator('.type-pill-btn[data-type="academic_paper"]').click();
    await page.locator('#paper-journal').fill('International Journal of South Asian Linguistics & Dialectology');
    await previewTabBtn.click();
    await page.waitForTimeout(300);

    const fullHeader = page.locator('#full-card-header');
    const headerText = await fullHeader.innerText();
    assert(
      headerText.length <= 24,
      `Card header badge clamped to <= 24 characters: "${headerText}" (${headerText.length} chars)`
    );
    assert(
      headerText === headerText.toUpperCase(),
      'Card header badge formatted in uppercase'
    );

    // =========================================================================
    // EDGE CASE 9: Zero Tags Handling
    // =========================================================================
    console.log('\n🧪 Edge Case 9: Zero Tags Handling in Live Article View');
    await writeTabBtn.click();
    await page.waitForTimeout(100);
    await tagsInput.fill('');
    await previewTabBtn.click();
    await page.waitForTimeout(200);

    const tagsContainer = page.locator('#prev-tags-container');
    const tagsHtml = await tagsContainer.innerHTML();
    assert(
      tagsHtml === '' || tagsHtml.trim().length === 0,
      'Blank tags field renders empty container without "#undefined" or empty tags'
    );

    // =========================================================================
    // EDGE CASE 10: Cover Image Visibility Toggle
    // =========================================================================
    console.log('\n🧪 Edge Case 10: Cover Image Visibility Toggle in Preview');
    const coverContainer = page.locator('#prev-cover-container');

    // Subcase 10A: With Cover Image
    await writeTabBtn.click();
    await page.waitForTimeout(100);
    await coverInput.fill('/images/posts/sample-cover.webp');
    await previewTabBtn.click();
    await page.waitForTimeout(200);
    assert(await coverContainer.isVisible(), 'Cover container visible when image path is provided');

    // Subcase 10B: Clear Cover Image
    await writeTabBtn.click();
    await page.waitForTimeout(100);
    await coverInput.fill('');
    await previewTabBtn.click();
    await page.waitForTimeout(200);
    assert(await coverContainer.isHidden(), 'Cover container hidden when cover image input is empty');

    // =========================================================================
    // EDGE CASE 11: Nested Markdown (Bold Inside Blockquote)
    // =========================================================================
    console.log('\n🧪 Edge Case 11: Complex Nested Markdown Transformation');
    await writeTabBtn.click();
    await page.waitForTimeout(100);
    await bodyInput.fill('> An essential observation regarding **phonemic vowel quantity** in Simte.');
    await previewTabBtn.click();
    await page.waitForTimeout(300);

    const bq = page.locator('#prev-markdown-rendered blockquote');
    assert(await bq.isVisible(), 'Blockquote rendered');
    const boldInsideBq = bq.locator('strong');
    assert(await boldInsideBq.isVisible(), 'Bold <strong> tag successfully nested inside blockquote');
    assert(
      (await boldInsideBq.innerText()) === 'phonemic vowel quantity',
      'Nested bold text preserved accurately'
    );

  } catch (error) {
    console.error('💥 Preview Edge Case Test execution threw an uncaught error:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`📊 PREVIEW TAB EDGE CASES AUDIT: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPreviewTabEdgeCasesAudit();
