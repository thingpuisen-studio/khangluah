import { chromium } from 'playwright';

async function runPreviewTabDeepAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: PREVIEW TAB ONLY...\n');

  const isHeaded = process.env.HEADLESS !== 'true';
  const browser = await chromium.launch({
    headless: !isHeaded,
    slowMo: isHeaded ? 400 : 0
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

    // =========================================================================
    // STEP 1: Populate Form in Write Tab with Multi-Format Content
    // =========================================================================
    console.log('\n📝 Step 1: Populating inputs in Write Tab...');
    await page.locator('button.nav-tab-btn[data-target="tab-write"]').click();

    // Select Poem type
    await page.locator('.type-pill-btn[data-type="poem"]').click();

    const titleInput = page.locator('#post-title');
    const subtitleInput = page.locator('#post-subtitle');
    const dateInput = page.locator('#post-date');
    const categoryInput = page.locator('#post-category');
    const readingTimeInput = page.locator('#post-reading-time');
    const bodyInput = page.locator('#post-body');
    const tagsInput = page.locator('#post-tags');

    await titleInput.fill('The Highland Evening Breeze');
    await subtitleInput.fill('A lyrical poem on high ridge mists and twilight silence');
    await dateInput.fill('November 2026');
    await categoryInput.fill('Highland Poetry');
    await readingTimeInput.fill('4 min read');
    await tagsInput.fill('Poetry, Highland, Solitude');

    // Rich Markdown body with headers, blockquote, bullet list, code, and verses
    const markdownSample = [
      '## The Quiet Valley',
      '> "Where the river curves into the mountain ridge, silence speaks."',
      '',
      'First stanza line one  ',
      'First stanza line two in twilight glow',
      '',
      '- Ancient pine needles',
      '- Cold mountain spring',
      '',
      '```simte',
      'Tuilui luang khawm in simlei a zuun',
      '```'
    ].join('\n');

    await bodyInput.fill(markdownSample);

    // Set Amber tip color and Autumn Amber gradient theme
    await page.locator('.tip-swatch-btn[data-tip-id="amber"]').click();
    await page.locator('.theme-tile-btn[data-theme-id="amber"]').click();

    // =========================================================================
    // FEATURE 1: Navigation to Preview Tab via Top Nav & Write Tab Action Button
    // =========================================================================
    console.log('\n🧪 Feature 1: Preview Tab Navigation');
    const previewTabBtn = page.locator('button.nav-tab-btn[data-target="tab-preview"]');
    await previewTabBtn.click();
    await page.waitForTimeout(300);

    const previewPanel = page.locator('#tab-preview');
    assert(await previewPanel.isVisible(), 'Preview panel tab is visible and active');

    // =========================================================================
    // FEATURE 2: 16:9 Card Plate Real-Time Typography & Theme Spine Synchronization
    // =========================================================================
    console.log('\n🧪 Feature 2: 16:9 Card Plate Simulation');
    const fullCard = page.locator('#full-card-preview');
    const fullCardTip = page.locator('#full-card-tip');
    const fullCardTitle = page.locator('#full-card-title');
    const fullCardHeader = page.locator('#full-card-header');
    const fullCardYear = page.locator('#full-card-year');
    const fullCardSubcat = page.locator('#full-card-subcat');
    const fullCardLang = page.locator('#full-card-lang');

    // Check title sync
    const plateTitleText = await fullCardTitle.innerText();
    assert(plateTitleText === 'The Highland Evening Breeze', `Plate title synced: "${plateTitleText}"`);

    // Check year sync (derived from "November 2026")
    const plateYearText = await fullCardYear.innerText();
    assert(plateYearText === '2026', `Plate year extracted: "${plateYearText}"`);

    // Check header & subcategory
    const plateHeaderText = await fullCardHeader.innerText();
    assert(plateHeaderText.includes('POETRY'), `Plate header reflects poem type: "${plateHeaderText}"`);

    const plateSubcatText = await fullCardSubcat.innerText();
    assert(plateSubcatText === 'HIGHLAND POETRY', `Plate subcategory reflects custom category: "${plateSubcatText}"`);

    // Check language badge
    const plateLangText = await fullCardLang.innerText();
    assert(plateLangText === 'English Verse', `Plate language reflects poem default: "${plateLangText}"`);

    // Check theme gradient and spine color
    const cardClass = await fullCard.getAttribute('class');
    assert(cardClass?.includes('amber') || false, 'Card plate background applied amber theme classes');

    const tipClass = await fullCardTip.getAttribute('class');
    assert(tipClass?.includes('bg-amber-500') || false, 'Card plate tip spine applied amber tip class');

    // =========================================================================
    // FEATURE 3: Article Layout & Full Typography Rendering
    // =========================================================================
    console.log('\n🧪 Feature 3: Article Layout & Metadata Synchronization');
    const prevTitle = page.locator('#prev-title');
    const prevSubtitle = page.locator('#prev-subtitle');
    const prevCategory = page.locator('#prev-category-badge');
    const prevDate = page.locator('#prev-date');
    const prevReadingTime = page.locator('#prev-reading-time');

    assert((await prevTitle.innerText()) === 'The Highland Evening Breeze', 'Article layout title matches');
    assert((await prevSubtitle.innerText()) === 'A lyrical poem on high ridge mists and twilight silence', 'Article layout subtitle matches');
    assert((await prevCategory.innerText()).toLowerCase() === 'highland poetry', 'Category badge matches');
    assert((await prevDate.innerText()) === 'November 2026', 'Date display matches');
    assert((await prevReadingTime.innerText()) === '4 min read', 'Reading time matches');

    // =========================================================================
    // FEATURE 4: Client-Side Markdown Parser Output Verification
    // =========================================================================
    console.log('\n🧪 Feature 4: Client-Side Markdown Parser Elements');
    const renderedContainer = page.locator('#prev-markdown-rendered');

    // 4A: Heading H2
    const renderedH2 = renderedContainer.locator('h2');
    assert(await renderedH2.isVisible(), 'Markdown H2 heading (##) rendered into <h2> tag');
    assert((await renderedH2.innerText()) === 'The Quiet Valley', 'H2 text parsed accurately');

    // 4B: Blockquote
    const renderedQuote = renderedContainer.locator('blockquote');
    assert(await renderedQuote.isVisible(), 'Markdown blockquote (>) rendered into <blockquote> tag');

    // 4C: Unordered List
    const renderedUl = renderedContainer.locator('ul');
    assert(await renderedUl.isVisible(), 'Markdown list (-) rendered into <ul> tag');
    const listItemsCount = await renderedUl.locator('li').count();
    assert(listItemsCount === 2, `Bullet list rendered 2 items (found: ${listItemsCount})`);

    // 4D: Fenced Code Block
    const renderedCodeBlock = renderedContainer.locator('pre code');
    assert(await renderedCodeBlock.isVisible(), 'Fenced code block (```simte) rendered into <pre><code>');
    const codeContent = await renderedCodeBlock.innerText();
    assert(codeContent.includes('Tuilui luang khawm'), 'Code block preserved language text');

    // =========================================================================
    // FEATURE 5: "Back to Editor" Quick Navigation Button
    // =========================================================================
    console.log('\n🧪 Feature 5: "Back to Editor" Button');
    const backBtn = page.locator('button[data-target="tab-write"]', { hasText: 'Back to Editor' });
    assert(await backBtn.isVisible(), '"Back to Editor" button is visible in Preview banner');
    await backBtn.click();
    await page.waitForTimeout(300);

    const writePanel = page.locator('#tab-write');
    assert(await writePanel.isVisible(), 'Successfully navigated back to Write tab via "Back to Editor" button');

  } catch (error) {
    console.error('\n❌ Unexpected error in Preview Tab test run:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n' + '='.repeat(55));
  console.log(`🏁 PREVIEW TAB TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(55) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPreviewTabDeepAudit();
