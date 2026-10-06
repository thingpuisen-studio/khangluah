import { chromium } from 'playwright';

async function runAssetsTabDeepAudit() {
  console.log('🚀 Starting Comprehensive E2E Test Suite: ASSETS & MEDIA GALLERY TAB...\n');

  const isHeaded = process.env.HEADLESS !== 'true';
  const browser = await chromium.launch({
    headless: !isHeaded,
    slowMo: isHeaded ? 350 : 0
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 },
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
    // Auto accept confirmation / alerts
    await dialog.accept();
  });

  try {
    await page.goto('http://localhost:4321/admin', { waitUntil: 'domcontentloaded' });
    const mainUi = page.locator('#admin-main-ui');
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });
    assert(await mainUi.isVisible(), 'Admin main UI studio is active and accessible');

    // =========================================================================
    // FEATURE 1: Tab Navigation & Media Gallery Grid Mount
    // =========================================================================
    console.log('\n🧪 Feature 1: Tab Navigation & Asset Grid Population');
    const assetsTabBtn = page.locator('button.nav-tab-btn[data-target="tab-assets"]');
    await assetsTabBtn.click();
    await page.waitForTimeout(300);

    const assetsSection = page.locator('#tab-assets');
    assert(await assetsSection.isVisible(), 'Assets tab panel is visible and active');

    const assetCards = page.locator('.asset-card');
    const totalAssetsCount = await assetCards.count();
    assert(totalAssetsCount > 0, `Assets grid loaded images (found: ${totalAssetsCount} cards)`);

    // =========================================================================
    // FEATURE 2: Usage Counters & Filter Buttons (All, In Use, Unused)
    // =========================================================================
    console.log('\n🧪 Feature 2: Filter Controls (All, In Use, Unused)');
    const countAllEl = page.locator('#count-assets-all');
    const countUsedEl = page.locator('#count-assets-used');
    const countUnusedEl = page.locator('#count-assets-unused');

    const allCount = parseInt(await countAllEl.innerText(), 10);
    const usedCount = parseInt(await countUsedEl.innerText(), 10);
    const unusedCount = parseInt(await countUnusedEl.innerText(), 10);

    assert(allCount === usedCount + unusedCount, `Usage count equation holds: ${allCount} total = ${usedCount} used + ${unusedCount} unused`);

    // Click "In Use" filter button
    const filterUsedBtn = page.locator('.asset-filter-btn[data-filter="used"]');
    await filterUsedBtn.click();
    await page.waitForTimeout(200);
    const visibleUsedCards = await page.locator('.asset-card').count();
    assert(visibleUsedCards === usedCount, `Filter "In Use" displays exactly ${usedCount} cards`);

    // Click "Unused" filter button
    const filterUnusedBtn = page.locator('.asset-filter-btn[data-filter="unused"]');
    await filterUnusedBtn.click();
    await page.waitForTimeout(200);
    const visibleUnusedCards = await page.locator('.asset-card').count();
    assert(visibleUnusedCards === unusedCount, `Filter "Unused" displays exactly ${unusedCount} cards`);

    // Click "All" filter button to restore
    const filterAllBtn = page.locator('.asset-filter-btn[data-filter="all"]');
    await filterAllBtn.click();
    await page.waitForTimeout(200);
    assert((await page.locator('.asset-card').count()) === allCount, 'Filter "All" restores full gallery grid');

    // =========================================================================
    // FEATURE 3: Asset Search Input (Filename & Referenced Post) & Empty State
    // =========================================================================
    console.log('\n🧪 Feature 3: Live Asset Search Filter & Empty State');
    const searchInput = page.locator('#asset-search-input');
    await searchInput.fill('himalayan');
    await page.waitForTimeout(200);

    const searchedCards = page.locator('.asset-card');
    assert((await searchedCards.count()) >= 1, 'Search found matching card for "himalayan"');

    // Test Empty Search State
    await searchInput.fill('nonexistent-gibberish-photo-query-xyz');
    await page.waitForTimeout(250);
    const noAssetsFoundEl = page.locator('#no-assets-found');
    assert(await noAssetsFoundEl.isVisible(), 'Empty state ("No matching assets found") displayed for unmatched query');

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(200);
    assert(!(await noAssetsFoundEl.isVisible()), 'Empty state hidden after clearing search');
    assert((await page.locator('.asset-card').count()) === allCount, 'Clearing search restores all assets');

    // =========================================================================
    // FEATURE 4: "Copy Markdown" and "Copy Path" Clipboard Actions
    // =========================================================================
    console.log('\n🧪 Feature 4: Clipboard Actions ("Copy Markdown" & "Copy Path")');
    const testCard = page.locator('.asset-card').first();
    const cpPathBtn = testCard.locator('.btn-asset-cp-path');
    const expectedPath = await cpPathBtn.getAttribute('data-path');

    await cpPathBtn.click();
    await page.waitForTimeout(200);

    const clipboardPath = await page.evaluate(() => navigator.clipboard.readText());
    assert(clipboardPath === expectedPath, `Copied asset path matches clipboard: "${clipboardPath}"`);

    const cpMdBtn = testCard.locator('.btn-asset-cp-md');
    await cpMdBtn.click();
    await page.waitForTimeout(200);

    const clipboardMd = await page.evaluate(() => navigator.clipboard.readText());
    assert(
      clipboardMd.startsWith('![') && clipboardMd.endsWith(`](${expectedPath})`),
      `Copied markdown matches format: "${clipboardMd}"`
    );

    // =========================================================================
    // FEATURE 5: "Set Cover" Action (Cross-Tab State Injection to Write Tab)
    // =========================================================================
    console.log('\n🧪 Feature 5: "Set Cover" Cross-Tab Action');
    const setCoverBtn = testCard.locator('.btn-asset-set-cover');
    const targetPath = await setCoverBtn.getAttribute('data-path');

    await setCoverBtn.click();
    await page.waitForTimeout(400);

    // Verify view automatically transitioned to Write Tab
    const writePanel = page.locator('#tab-write');
    assert(await writePanel.isVisible(), 'Clicking "Set Cover" transitioned view to Write tab');

    const coverInput = page.locator('#post-cover');
    const currentCoverVal = await coverInput.inputValue();
    assert(currentCoverVal === targetPath, `Write form cover image field populated: "${currentCoverVal}"`);

    // Switch back to Assets tab
    await assetsTabBtn.click();
    await page.waitForTimeout(300);

    // =========================================================================
    // FEATURE 6: Deletion Safety Guard for "In Use" Assets
    // =========================================================================
    console.log('\n🧪 Feature 6: In-Use Asset Deletion Protection Guard');
    // Filter to used assets
    await filterUsedBtn.click();
    await page.waitForTimeout(200);

    const usedCard = page.locator('.asset-card').first();
    const usedDeleteBtn = usedCard.locator('.btn-asset-delete');
    await usedDeleteBtn.click();
    await page.waitForTimeout(300);

    // Assert that the BLOCKED safety modal opened (not the delete confirm modal)
    const blockedModal = page.locator('#asset-blocked-modal');
    assert(await blockedModal.isVisible(), 'Deletion BLOCKED safety guard modal popped up for in-use asset');

    // Close blocked modal
    const closeBlockedBtn = page.locator('#asset-blocked-close');
    await closeBlockedBtn.click();
    await page.waitForTimeout(200);
    assert(!(await blockedModal.isVisible()), 'Blocked modal successfully closed');

    // =========================================================================
    // FEATURE 7: Drag-and-Drop Dropzone UI Feedback & Cancel Action
    // =========================================================================
    console.log('\n🧪 Feature 7: Drag-and-Drop Dropzone Feedback & Cancel');
    const dropzone = page.locator('#asset-dropzone');
    assert(await dropzone.isVisible(), 'Asset upload dropzone card is visible');

    // Test dragover visual feedback classes
    await dropzone.dispatchEvent('dragover');
    await page.waitForTimeout(100);
    const dropzoneClass = await dropzone.getAttribute('class');
    assert(dropzoneClass?.includes('border-[var(--accent)]'), 'Dropzone applies accent border on dragover');

    await dropzone.dispatchEvent('dragleave');
    await page.waitForTimeout(100);

    // Upload an image and verify "Cancel" button discards preview
    const fileInput = page.locator('#asset-upload-input');
    await fileInput.setInputFiles('public/images/author-avatar.jpg');
    await page.waitForTimeout(500);

    const pendingPreview = page.locator('#asset-pending-preview');
    assert(await pendingPreview.isVisible(), 'Pending compression preview box revealed on file select');

    const cancelUploadBtn = page.locator('#btn-cancel-pending-asset');
    await cancelUploadBtn.click();
    await page.waitForTimeout(250);
    assert(!(await pendingPreview.isVisible()), 'Clicking Cancel discards pending compression preview');

    // =========================================================================
    // FEATURE 8: Client-Side WebP Converter & Local Simulation Commit
    // =========================================================================
    console.log('\n🧪 Feature 8: Client-Side WebP Converter & Simulated Asset Commit');
    // Re-upload test image to proceed with commit
    await fileInput.setInputFiles('public/images/author-avatar.jpg');
    await page.waitForTimeout(600);
    assert(await pendingPreview.isVisible(), 'Pending preview box visible for commit');

    const pendingStats = page.locator('#asset-pending-stats');
    const statsText = await pendingStats.innerText();
    assert(statsText.includes('WebP Compressed'), `Compression ratio statistics calculated: "${statsText}"`);

    // Change filename to custom webp name
    const pendingFilename = page.locator('#asset-pending-filename');
    await pendingFilename.fill('e2e-valley-monograph.webp');

    // Commit WebP asset
    const commitBtn = page.locator('#btn-upload-pending-asset');
    await commitBtn.click();
    await page.waitForTimeout(600);

    // Return to "All" filter to inspect new asset
    await filterAllBtn.click();
    await page.waitForTimeout(300);

    // Verify new asset appears in gallery grid
    const newAssetCard = page.locator('.asset-card', { hasText: 'e2e-valley-monograph.webp' });
    assert(await newAssetCard.isVisible(), 'Newly converted WebP asset is present in the gallery grid');

    // Verify persistence in localStorage ('hk_cms_custom_assets')
    const customAssetsStorage = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hk_cms_custom_assets') || '[]');
    });
    const foundCustom = customAssetsStorage.some((a: any) => a.filename === 'e2e-valley-monograph.webp');
    assert(foundCustom, 'Simulated asset saved to localStorage ("hk_cms_custom_assets")');

    // =========================================================================
    // FEATURE 9: Deletion of Unused Asset & Local Storage Cleanup
    // =========================================================================
    console.log('\n🧪 Feature 9: Deletion of Unused Asset');
    const deleteNewBtn = newAssetCard.locator('.btn-asset-delete');
    await deleteNewBtn.click();
    await page.waitForTimeout(300);

    // Assert normal delete confirmation modal opened
    const assetDelModal = page.locator('#asset-delete-modal');
    assert(await assetDelModal.isVisible(), 'Unused asset delete confirmation modal opened');

    const confirmAssetDel = page.locator('#asset-del-confirm');
    await confirmAssetDel.click();
    await page.waitForTimeout(400);

    assert(!(await newAssetCard.isVisible()), 'Unused asset removed from gallery grid');

  } catch (error) {
    console.error('\n❌ Unexpected error in Assets Tab test run:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n' + '='.repeat(55));
  console.log(`🏁 ASSETS TAB TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(55) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAssetsTabDeepAudit();
