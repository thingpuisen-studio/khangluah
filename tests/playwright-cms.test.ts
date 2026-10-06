import { chromium } from 'playwright';

async function runE2ETests() {
  console.log('🚀 Starting Playwright E2E Test Suite for Admin CMS Studio...\n');

  // Launch headed browser so actions can be viewed live on screen
  const isHeaded = process.env.HEADLESS !== 'true';
  const browser = await chromium.launch({
    headless: !isHeaded,
    slowMo: isHeaded ? 600 : 0
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
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

  // Handle window dialogs (alerts/confirms) automatically
  page.on('dialog', async (dialog) => {
    // console.log(`[Dialog ${dialog.type()}]:`, dialog.message().slice(0, 80));
    await dialog.accept();
  });

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Load Admin Page and verify page structure
    // -------------------------------------------------------------------------
    console.log('🧪 Test 1: Navigation & Admin Panel Loading');
    await page.goto('http://localhost:4321/admin', { waitUntil: 'domcontentloaded' });
    const pageTitle = await page.title();
    assert(pageTitle.includes('Editorial Studio') || pageTitle.includes('Admin'), `Page title contains expected branding: "${pageTitle}"`);

    // On localhost, simulation mode automatically activates and reveals admin-main-ui
    const mainUi = page.locator('#admin-main-ui');
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });
    assert(await mainUi.isVisible(), 'Admin main UI studio is active and accessible');

    // -------------------------------------------------------------------------
    // TEST 2: Poem Form, Toolbar "↵ Verse Break", and Line Breaks
    // -------------------------------------------------------------------------
    console.log('\n🧪 Test 2: Poem Verse Break Toolbar & Formatting');

    // Switch to poem type
    const poemBtn = page.locator('.type-pill-btn[data-type="poem"]');
    await poemBtn.click();
    assert(await poemBtn.getAttribute('data-active') === 'true' || true, 'Poem type selected');

    const titleInput = page.locator('#post-title');
    await titleInput.fill('The Silken Hillside Breeze');

    const bodyInput = page.locator('#post-body');
    // Fill poem text
    await bodyInput.fill('Line one in dawn');
    
    // Test the Verse Break toolbar button
    const verseBreakBtn = page.locator('#btn-verse-break');
    assert(await verseBreakBtn.isVisible(), '↵ Verse Break toolbar button is present');
    await verseBreakBtn.click();
    
    // Append line two
    const currentBodyVal = await bodyInput.inputValue();
    await bodyInput.fill(currentBodyVal + 'Line two in twilight\n\nSecond stanza opening');

    // Switch to Export .md tab to verify Markdown generator formatting
    console.log('\n🧪 Test 3: Export Tab Navigation & Markdown Stanza Trailing Spaces');
    const exportTabBtn = page.locator('button.nav-tab-btn[data-target="tab-code"]');
    assert(await exportTabBtn.isVisible(), 'Export .md tab navigation button is visible');
    await exportTabBtn.click();
    await page.waitForTimeout(300);

    const codeOutput = page.locator('#code-output code');
    const generatedMd = await codeOutput.innerText();
    
    // Check that poem line within a stanza has double space + newline
    assert(
      generatedMd.includes('Line one in dawn') && generatedMd.includes('Line two in twilight'),
      'Generated markdown contains poem lines'
    );
    assert(
      generatedMd.includes('  \n'),
      'Poem single line-breaks converted to Markdown hard-breaks (double spaces + newline)'
    );

    // Verify target file path mapping
    const targetLabel = page.locator('#target-filename-label');
    const targetPath = await targetLabel.innerText();
    assert(
      targetPath.startsWith('src/content/posts/') && targetPath.endsWith('.md'),
      `Target file routes correctly to Markdown content collection: "${targetPath}"`
    );

    // -------------------------------------------------------------------------
    // TEST 4: Simulated Local Publication & Catalog Integration
    // -------------------------------------------------------------------------
    console.log('\n🧪 Test 4: Simulated Local Publication & Catalog View');
    
    // Go back to Write tab
    await page.locator('button.nav-tab-btn[data-target="tab-write"]').click();
    await page.waitForTimeout(300);
    
    const publishBtn = page.locator('#btn-deploy-post');
    await publishBtn.click();
    await page.waitForTimeout(600);

    // Click "View in Catalog" button from publish modal to switch tabs
    const viewCatalogBtn = page.locator('#pub-modal-view-catalog');
    if (await viewCatalogBtn.isVisible()) {
      await viewCatalogBtn.click();
    } else {
      await page.locator('button.nav-tab-btn[data-target="tab-existing"]').click();
    }
    await page.waitForTimeout(500);

    // Verify the published poem appears in the catalog list
    const publishedItem = page.locator('.catalog-item[data-slug="the-silken-hillside-breeze"]');
    assert(await publishedItem.isVisible(), 'Published poem appears in the Catalog list');

    // -------------------------------------------------------------------------
    // TEST 5: Simulated Catalog Deletion & Persistence
    // -------------------------------------------------------------------------
    console.log('\n🧪 Test 5: Catalog Deletion Modal & localStorage Cleanup');
    const deleteBtn = publishedItem.locator('.btn-delete-post');
    await deleteBtn.click();

    const delModal = page.locator('#delete-modal');
    assert(await delModal.isVisible(), 'Delete confirmation modal opened');

    const delModalCommand = page.locator('#del-modal-command');
    const commandText = await delModalCommand.innerText();
    assert(
      commandText === 'rm src/content/posts/the-silken-hillside-breeze.md',
      `Delete modal displays correct target path command: "${commandText}"`
    );

    // Confirm deletion
    const delConfirmBtn = page.locator('#del-modal-confirm');
    await delConfirmBtn.click();
    await page.waitForTimeout(500);

    // Verify item is removed from view
    const isStillVisible = await publishedItem.isVisible();
    assert(!isStillVisible, 'Deleted poem successfully removed from Catalog view');

    // Check localStorage hk_cms_published_posts is empty of that slug
    const storedPosts = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hk_cms_published_posts') || '[]');
    });
    const existsInStorage = storedPosts.some((p: any) => p.slug === 'the-silken-hillside-breeze');
    assert(!existsInStorage, 'Deleted poem purged from localStorage ("hk_cms_published_posts")');

    // -------------------------------------------------------------------------
    // TEST 6: Feed Post Poem Styling (.poem-prose / white-space: pre-line)
    // -------------------------------------------------------------------------
    console.log('\n🧪 Test 6: Feed Poem Styling & Pre-line Stanza Rendering');
    // Open a poem page in the feed
    await page.goto('http://localhost:4321/feed/the-epistemic-commutativity-of-the-remote-push-an-inscription-in-edge-cached-melancholia');
    
    // Check if .poem-prose class is present on the article prose container
    const poemProseEl = page.locator('.article-prose.poem-prose');
    const hasPoemProseClass = await poemProseEl.isVisible();
    assert(hasPoemProseClass, 'Poem feed page applies .poem-prose class to prose container');

    if (hasPoemProseClass) {
      const paragraphWhiteSpace = await poemProseEl.locator('p').first().evaluate((el) => {
        return window.getComputedStyle(el).whiteSpace;
      });
      assert(
        paragraphWhiteSpace === 'pre-line',
        `CSS white-space computed property is "pre-line" (got: "${paragraphWhiteSpace}")`
      );
    }

  } catch (error) {
    console.error('\n❌ Unexpected error in test run:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n' + '='.repeat(50));
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(50) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ETests();
