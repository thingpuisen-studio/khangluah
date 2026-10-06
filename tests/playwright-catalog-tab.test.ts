import { chromium } from 'playwright';

async function runCatalogTabDeepAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: CATALOG TAB ONLY...\n');

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

  // Handle window alert/confirm dialogs
  page.on('dialog', async (dialog) => {
    // console.log(`  [Dialog]: ${dialog.message().slice(0, 60)}`);
    await dialog.accept();
  });

  try {
    await page.goto('http://localhost:4321/admin', { waitUntil: 'domcontentloaded' });
    const mainUi = page.locator('#admin-main-ui');
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });
    assert(await mainUi.isVisible(), 'Admin main UI studio is active and accessible');

    // Switch to Catalog Tab
    console.log('\n🧪 Feature 1: Catalog Tab Navigation & Initial Items Population');
    const catalogTabBtn = page.locator('button.nav-tab-btn[data-target="tab-existing"]');
    await catalogTabBtn.click();
    await page.waitForTimeout(300);

    const catalogSection = page.locator('#tab-existing');
    assert(await catalogSection.isVisible(), 'Catalog tab section is visible and active');

    // Assert initial items exist
    const catalogItems = page.locator('.catalog-item');
    const initialCount = await catalogItems.count();
    assert(initialCount > 0, `Catalog loaded repository publications (found: ${initialCount} items)`);

    // Verify counter badge matches or reflects items
    const badge = page.locator('#catalog-count-badge');
    const badgeCount = await badge.innerText();
    assert(badgeCount.includes(String(initialCount)), `Catalog badge matches item count: "${badgeCount}"`);

    // =========================================================================
    // FEATURE 2: Real-Time Catalog Search Filtering
    // =========================================================================
    console.log('\n🧪 Feature 2: Real-Time Catalog Search Filtering');
    const searchInput = page.locator('#existing-search');
    assert(await searchInput.isVisible(), 'Catalog search input is visible');

    // Search for a specific post (e.g. "pronouns")
    await searchInput.fill('pronouns');
    await page.waitForTimeout(250);

    const visibleItemsMatching = page.locator('.catalog-item:visible');
    const matchCount = await visibleItemsMatching.count();
    assert(matchCount >= 1, `Search filtered down to matching items (visible: ${matchCount})`);
    const matchingTitle = await visibleItemsMatching.first().locator('h3').innerText();
    assert(matchingTitle.toLowerCase().includes('pronouns'), `Visible item matches query: "${matchingTitle}"`);

    // Clear search and ensure all items return
    await searchInput.fill('');
    await page.waitForTimeout(200);
    const restoredCount = await page.locator('.catalog-item:visible').count();
    assert(restoredCount === initialCount, `Clearing search restored all items (${restoredCount} visible)`);

    // =========================================================================
    // FEATURE 3: "Edit" Action & Complete Form Restoration
    // =========================================================================
    console.log('\n🧪 Feature 3: "Edit" Action & Cross-Tab Form Restoration');
    const firstItem = page.locator('.catalog-item').first();
    const itemTitle = await firstItem.locator('h3').innerText();
    const itemSlug = await firstItem.getAttribute('data-slug');
    const editBtn = firstItem.locator('.btn-load-existing');

    await editBtn.click();
    await page.waitForTimeout(400);

    // Verify view automatically transitioned to Write Tab
    const writePanel = page.locator('#tab-write');
    assert(await writePanel.isVisible(), 'Clicking "Edit" switched view to Write tab');

    // Verify form fields restored exactly
    const titleInput = page.locator('#post-title');
    const slugInput = page.locator('#post-slug');
    const restoredTitle = await titleInput.inputValue();
    const restoredSlug = await slugInput.inputValue();

    assert(restoredTitle === itemTitle, `Form title restored: "${restoredTitle}"`);
    assert(restoredSlug === itemSlug, `Form slug restored: "${restoredSlug}"`);

    // =========================================================================
    // FEATURE 4: Simulated Local Publication Addition to Catalog
    // =========================================================================
    console.log('\n🧪 Feature 4: Simulated Local Publication Addition to Catalog');
    // Set a new unique post
    const testSlug = 'catalog-e2e-monograph-test';
    const testTitle = 'Catalog E2E Deep Monograph';
    await titleInput.fill(testTitle);
    await slugInput.fill(testSlug);
    await page.locator('#post-body').fill('Stanza one for catalog verification\n\nStanza two');

    // Deploy locally (Publish)
    const publishBtn = page.locator('#btn-deploy-post');
    await publishBtn.click();
    await page.waitForTimeout(400);

    // Click "View in Catalog" from the confirmation modal
    const viewCatalogBtn = page.locator('#pub-modal-view-catalog');
    if (await viewCatalogBtn.isVisible()) {
      await viewCatalogBtn.click();
      await page.waitForTimeout(300);
    } else {
      await catalogTabBtn.click();
      await page.waitForTimeout(300);
    }

    // Verify newly published item is prepended in Catalog
    const newlyCreatedItem = page.locator(`.catalog-item[data-slug="${testSlug}"]`);
    assert(await newlyCreatedItem.isVisible(), 'Newly published post is prepended to the Catalog');

    // Verify it has the "PUBLISHED" status badge
    const statusBadge = newlyCreatedItem.locator('span', { hasText: 'PUBLISHED' });
    assert(await statusBadge.isVisible(), 'Newly published item has "PUBLISHED" badge');

    // =========================================================================
    // FEATURE 5: Post Deletion Modal Confirmation & Target Path Verification
    // =========================================================================
    console.log('\n🧪 Feature 5: Deletion Modal, Safe Cancellation & Confirmation');
    const deleteBtn = newlyCreatedItem.locator('.btn-delete-post');
    await deleteBtn.click();

    const delModal = page.locator('#delete-modal');
    assert(await delModal.isVisible(), 'Delete confirmation modal opened');

    const delModalTitle = page.locator('#del-modal-title');
    assert((await delModalTitle.innerText()).includes(testTitle), 'Delete modal highlights correct post title');

    const delModalCommand = page.locator('#del-modal-command');
    assert(
      (await delModalCommand.innerText()) === `rm src/content/posts/${testSlug}.md`,
      'Delete modal shows correct markdown collection path command'
    );

    // Test 5A: Cancel deletion first
    const delCancelBtn = page.locator('#del-modal-cancel');
    await delCancelBtn.click();
    await page.waitForTimeout(200);
    assert(!(await delModal.isVisible()), 'Delete modal closed on cancel');
    assert(await newlyCreatedItem.isVisible(), 'Post remains in catalog after cancel');

    // Test 5B: Confirm deletion
    await deleteBtn.click();
    await page.waitForTimeout(200);
    const delConfirmBtn = page.locator('#del-modal-confirm');
    await delConfirmBtn.click();
    await page.waitForTimeout(400);

    // Verify item is removed from catalog view
    assert(!(await newlyCreatedItem.isVisible()), 'Post element removed from catalog list');

    // Verify removed from localStorage ('hk_cms_published_posts')
    const publishedStorage = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hk_cms_published_posts') || '[]');
    });
    const exists = publishedStorage.some((p: any) => p.slug === testSlug);
    assert(!exists, 'Post purged from localStorage ("hk_cms_published_posts")');

  } catch (error) {
    console.error('\n❌ Unexpected error in Catalog Tab test run:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n' + '='.repeat(55));
  console.log(`🏁 CATALOG TAB TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(55) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCatalogTabDeepAudit();
