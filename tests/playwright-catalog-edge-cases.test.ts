import { chromium } from 'playwright';

async function runCatalogTabEdgeCasesAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: CATALOG TAB EDGE CASES...\n');

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

  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  try {
    await page.goto('http://localhost:4321/admin', { waitUntil: 'domcontentloaded' });
    const mainUi = page.locator('#admin-main-ui');
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });
    assert(await mainUi.isVisible(), 'Admin main UI studio is active and accessible');

    const catalogTabBtn = page.locator('button.nav-tab-btn[data-target="tab-existing"]');
    const writeTabBtn = page.locator('button.nav-tab-btn[data-target="tab-write"]');
    const catalogBadge = page.locator('#catalog-count-badge');
    const searchInput = page.locator('#existing-search');

    await catalogTabBtn.click();
    await page.waitForTimeout(300);

    const getBadgeCount = async () => parseInt((await catalogBadge.innerText()).replace(/\D/g, ''), 10);
    const initialBadgeCount = await getBadgeCount();
    assert(initialBadgeCount >= 5, `Initial catalog populated with publications (${initialBadgeCount} items)`);

    // =========================================================================
    // EDGE CASE 1: Search Query with Regex Metacharacters
    // =========================================================================
    console.log('\n🧪 Edge Case 1: Regex Metacharacters Search Safety');
    await searchInput.fill('[simte].*?(test)?');
    await page.waitForTimeout(200);

    assert(await mainUi.isVisible(), 'Searching with regex metacharacters does not throw runtime exceptions');

    // =========================================================================
    // EDGE CASE 2: Whitespace-Only Query Display Integrity
    // =========================================================================
    console.log('\n🧪 Edge Case 2: Whitespace-Only Query Handling');
    await searchInput.fill('       ');
    await page.waitForTimeout(200);

    const visibleItemsWhitespace = await page.locator('.catalog-item:visible').count();
    assert(
      visibleItemsWhitespace === initialBadgeCount,
      'Whitespace-only query keeps all catalog items visible without filtering out'
    );

    // =========================================================================
    // EDGE CASE 3: Case-Insensitive Search Matching
    // =========================================================================
    console.log('\n🧪 Edge Case 3: Case-Insensitive Search Matching');
    await searchInput.fill('PRONOUNS');
    await page.waitForTimeout(200);

    const matchedItem = page.locator('.catalog-item:visible:has-text("Pronouns in Simte")');
    assert(await matchedItem.isVisible(), 'Uppercase query "PRONOUNS" matches "Pronouns in Simte"');

    const otherItemsHidden = await page.locator('.catalog-item:visible').count();
    assert(
      otherItemsHidden < initialBadgeCount,
      `Non-matching items successfully hidden (${otherItemsHidden} matches shown)`
    );

    // =========================================================================
    // EDGE CASE 4: Non-Existent Query & Full Collection Restoration
    // =========================================================================
    console.log('\n🧪 Edge Case 4: Zero-Match Query & Query Clear Restoration');
    await searchInput.fill('xyz-nonexistent-search-query-999');
    await page.waitForTimeout(200);

    const zeroVisible = await page.locator('.catalog-item:visible').count();
    assert(zeroVisible === 0, 'Non-existent query hides all catalog items (0 visible)');

    await searchInput.fill('');
    await page.waitForTimeout(200);

    const restoredVisible = await page.locator('.catalog-item:visible').count();
    assert(
      restoredVisible === initialBadgeCount,
      `Clearing search input restores all ${restoredVisible} items to view`
    );

    // =========================================================================
    // EDGE CASE 5: Delete Modal Cancellation
    // =========================================================================
    console.log('\n🧪 Edge Case 5: Deletion Modal Cancellation');
    const firstPostCard = page.locator('.catalog-item').first();
    const firstPostTitle = (await firstPostCard.locator('h3').innerText()).trim();

    await firstPostCard.locator('.btn-delete-post').click();
    await page.waitForTimeout(300);

    const delModal = page.locator('#delete-modal');
    assert(await delModal.isVisible(), 'Delete confirmation modal displayed');

    const modalTitle = (await page.locator('#del-modal-title').innerText()).trim();
    assert(modalTitle.includes(firstPostTitle), `Modal title matches target post ("${modalTitle}")`);

    // Cancel deletion
    await page.locator('#del-modal-cancel').click();
    await page.waitForTimeout(300);

    assert(await delModal.isHidden(), 'Delete modal dismissed cleanly upon Cancel');
    assert(
      await page.locator(`.catalog-item:has-text("${firstPostTitle}")`).isVisible(),
      'Target post remains intact in catalog view after cancel'
    );

    // =========================================================================
    // EDGE CASE 6: Live Publication Prepend & Immediate Searchability
    // =========================================================================
    console.log('\n🧪 Edge Case 6: Live Simulated Publication Prepend & Immediate Search');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    await page.locator('#post-title').fill('Edge Case Catalog Test Monograph');
    await page.locator('#post-slug').fill('edge-case-catalog-test');
    await page.locator('#post-subtitle').fill('Simulated publication for catalog synchronization');
    await page.locator('#post-body').fill('Simulated publication markdown body content.');

    // Save post locally
    await page.locator('#btn-save-post').click();
    await page.waitForTimeout(300);

    // Dismiss publish modal
    const pubModalClose = page.locator('#pub-modal-close');
    if (await pubModalClose.isVisible()) {
      await pubModalClose.click();
      await page.waitForTimeout(200);
    }

    // Switch to Catalog
    await catalogTabBtn.click();
    await page.waitForTimeout(300);

    const newBadgeCount = await getBadgeCount();
    assert(
      newBadgeCount === initialBadgeCount + 1,
      `Catalog badge count incremented by 1 (${initialBadgeCount} -> ${newBadgeCount})`
    );

    const newPostCard = page.locator('.catalog-item:has-text("Edge Case Catalog Test Monograph")');
    assert(await newPostCard.isVisible(), 'Newly published post prepended into catalog DOM list');

    // Test immediate searchability of the newly added post
    await searchInput.fill('Edge Case Catalog');
    await page.waitForTimeout(200);
    assert(
      await newPostCard.isVisible(),
      'Newly published post is immediately searchable by title keyword'
    );

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(200);

    // =========================================================================
    // EDGE CASE 7: Cross-Tab "Edit" State Transfer
    // =========================================================================
    console.log('\n🧪 Edge Case 7: Cross-Tab Form Restoration on "Edit" Click');
    await newPostCard.locator('.btn-load-existing').click();
    await page.waitForTimeout(300);

    assert(await page.locator('#tab-write').isVisible(), 'Automatically transitioned to Write tab on Edit');
    assert(
      (await page.locator('#post-title').inputValue()) === 'Edge Case Catalog Test Monograph',
      'Restored title in Write form input'
    );
    assert(
      (await page.locator('#post-slug').inputValue()) === 'edge-case-catalog-test',
      'Restored slug in Write form input'
    );
    assert(
      (await page.locator('#post-body').inputValue()).includes('Simulated publication markdown body'),
      'Restored body content in Write textarea'
    );

    // =========================================================================
    // EDGE CASE 8: Deletion While Search Filter is Active
    // =========================================================================
    console.log('\n🧪 Edge Case 8: Deletion While Active Search Filter is Applied');
    await catalogTabBtn.click();
    await page.waitForTimeout(300);

    // Filter to the test post
    await searchInput.fill('Edge Case Catalog');
    await page.waitForTimeout(200);

    // Click Delete on the filtered item
    await newPostCard.locator('.btn-delete-post').click();
    await page.waitForTimeout(300);
    assert(await delModal.isVisible(), 'Delete modal opened for filtered item');

    // Confirm deletion
    await page.locator('#del-modal-confirm').click();
    await page.waitForTimeout(400);

    // Verify item is removed
    assert(
      await page.locator('.catalog-item:has-text("Edge Case Catalog Test Monograph")').count() === 0,
      'Deleted post removed from DOM while search filter was active'
    );

    // Clear search and verify count returns to initial count
    await searchInput.fill('');
    await page.waitForTimeout(200);

    const postDelBadgeCount = await getBadgeCount();
    assert(
      postDelBadgeCount === initialBadgeCount,
      `Badge count accurately restored back to initial count (${postDelBadgeCount})`
    );

    // =========================================================================
    // EDGE CASE 9: Local Storage Published Posts Purge Verification
    // =========================================================================
    console.log('\n🧪 Edge Case 9: Local Storage Published Posts Storage Purge');
    const storedPubPosts = await page.evaluate(() => {
      const p = JSON.parse(localStorage.getItem('hk_cms_published_posts') || '[]');
      return p.filter((x: any) => x.slug === 'edge-case-catalog-test');
    });
    assert(
      storedPubPosts.length === 0,
      'Deleted post cleanly purged from "hk_cms_published_posts" in localStorage'
    );

    // =========================================================================
    // EDGE CASE 10: Slug-Collision Updates Item In-Place
    // =========================================================================
    console.log('\n🧪 Edge Case 10: Duplicate Slug Publication Updates In-Place');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    // Save first version
    await page.locator('#post-title').fill('First Duplicate Test Version');
    await page.locator('#post-slug').fill('duplicate-slug-test');
    await page.locator('#btn-save-post').click();
    await page.waitForTimeout(300);

    if (await pubModalClose.isVisible()) {
      await pubModalClose.click();
      await page.waitForTimeout(200);
    }

    // Save second version with same slug but different title
    await page.locator('#post-title').fill('Second Duplicate Test Version (Updated)');
    await page.locator('#btn-save-post').click();
    await page.waitForTimeout(300);

    if (await pubModalClose.isVisible()) {
      await pubModalClose.click();
      await page.waitForTimeout(200);
    }

    await catalogTabBtn.click();
    await page.waitForTimeout(300);

    const duplicateCards = await page.locator('.catalog-item[data-slug="duplicate-slug-test"]').count();
    assert(
      duplicateCards === 1,
      `Publishing with identical slug updates item in place (1 card rendered, got ${duplicateCards})`
    );

    const updatedCard = page.locator('.catalog-item[data-slug="duplicate-slug-test"]');
    assert(
      await updatedCard.locator('h3:has-text("Second Duplicate Test Version")').isVisible(),
      'Card title reflects updated publication data'
    );

    // Clean up test post
    await updatedCard.locator('.btn-delete-post').click();
    await page.waitForTimeout(300);
    await page.locator('#del-modal-confirm').click();
    await page.waitForTimeout(300);

  } catch (error) {
    console.error('💥 Catalog Edge Case Test execution threw an uncaught error:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`📊 CATALOG TAB EDGE CASES AUDIT: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCatalogTabEdgeCasesAudit();
