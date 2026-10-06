import { chromium } from 'playwright';

async function runAssetsTabEdgeCasesAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: ASSETS TAB EDGE CASES...\n');

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

  try {
    await page.goto('http://localhost:4321/admin', { waitUntil: 'domcontentloaded' });
    const mainUi = page.locator('#admin-main-ui');
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });
    assert(await mainUi.isVisible(), 'Admin main UI studio is active and accessible');

    const assetsTabBtn = page.locator('button.nav-tab-btn[data-target="tab-assets"]');
    const writeTabBtn = page.locator('button.nav-tab-btn[data-target="tab-write"]');
    const draftsTabBtn = page.locator('button.nav-tab-btn[data-target="tab-drafts"]');

    // Switch to Assets tab
    await assetsTabBtn.click();
    await page.waitForTimeout(300);

    const assetsSection = page.locator('#tab-assets');
    assert(await assetsSection.isVisible(), 'Assets tab panel (#tab-assets) is visible');

    // =========================================================================
    // EDGE CASE 1: Non-Image File Rejection
    // =========================================================================
    console.log('\n🧪 Edge Case 1: Non-Image File Upload Rejection');
    const fileInput = page.locator('#asset-upload-input');

    // Upload a simulated text file
    await fileInput.setInputFiles({
      name: 'notes.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Linguistic notes and transcription')
    });
    await page.waitForTimeout(300);

    const toastMsg = page.locator('#cms-toast-msg');
    const toastText = (await toastMsg.innerText()).trim();
    assert(
      toastText.includes('choose a valid image file'),
      `Non-image file (.txt) blocked with validation toast ("${toastText}")`
    );

    const pendingBox = page.locator('#asset-pending-preview');
    assert(
      await pendingBox.isHidden(),
      'Pending WebP preview box remains hidden when non-image is supplied'
    );

    // =========================================================================
    // EDGE CASE 2: Complex Filename Sanitization on Upload
    // =========================================================================
    console.log('\n🧪 Edge Case 2: Complex Filename Sanitization');
    // Upload a PNG image with messy filename containing spaces, numbers, symbols, uppercase
    const samplePng1x1 = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );

    await fileInput.setInputFiles({
      name: 'Fieldwork Photo (1) & Notes #3 [final].png',
      mimeType: 'image/png',
      buffer: samplePng1x1
    });
    await page.waitForTimeout(400);

    assert(await pendingBox.isVisible(), 'Pending WebP preview box is revealed after valid image conversion');

    const filenameInput = page.locator('#asset-pending-filename');
    const sanitizedFilename = await filenameInput.inputValue();
    assert(
      sanitizedFilename === 'fieldwork-photo-1-notes-3-final.webp',
      `Complex filename sanitized cleanly to URL-safe WebP: "${sanitizedFilename}"`
    );

    // =========================================================================
    // EDGE CASE 3: Cancel Upload Action & State Reset
    // =========================================================================
    console.log('\n🧪 Edge Case 3: Cancel Upload Action & State Discard');
    const cancelBtn = page.locator('#btn-cancel-pending-asset');
    await cancelBtn.click();
    await page.waitForTimeout(300);

    assert(await pendingBox.isHidden(), 'Pending WebP box dismissed upon clicking Cancel');
    const postCancelToast = (await toastMsg.innerText()).trim();
    assert(postCancelToast.includes('cancelled'), 'Toast confirms upload cancelled');

    // =========================================================================
    // EDGE CASE 4: Extension Normalization on Manual Filename Override
    // =========================================================================
    console.log('\n🧪 Edge Case 4: Extension Normalization on Manual Name Override');
    await fileInput.setInputFiles({
      name: 'sample-image.jpg',
      mimeType: 'image/jpeg',
      buffer: samplePng1x1
    });
    await page.waitForTimeout(400);

    // Author types a custom filename without the .webp extension
    await filenameInput.fill('custom-linguistic-chart');
    await filenameInput.dispatchEvent('input');

    // Click commit upload in simulated local mode
    const uploadBtn = page.locator('#btn-upload-pending-asset');
    await uploadBtn.click();
    await page.waitForTimeout(400);

    // Check newly added asset in local gallery
    const customAssetCard = page.locator('.asset-card:has-text("custom-linguistic-chart.webp")');
    assert(
      await customAssetCard.isVisible(),
      'Committed asset automatically normalizes extension to ".webp"'
    );

    // =========================================================================
    // EDGE CASE 5: Dynamic Usage Graph Detection from Drafts
    // =========================================================================
    console.log('\n🧪 Edge Case 5: Dynamic Usage Graph Update from Saved Draft');
    // Before creating draft, custom asset is Unused
    let customCardBadge = customAssetCard.locator('span:has-text("Unused Asset")');
    assert(await customCardBadge.isVisible(), 'Newly uploaded asset is initially flagged as "Unused Asset"');

    // Navigate to Write tab, create draft using this asset as cover
    await writeTabBtn.click();
    await page.waitForTimeout(200);
    await page.locator('#post-title').fill('Draft Using Custom Asset Cover');
    await page.locator('#post-slug').fill('draft-custom-cover-slug');
    await page.locator('#post-cover').fill('/images/custom-linguistic-chart.webp');
    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(300);

    // Return to Assets tab
    await assetsTabBtn.click();
    await page.waitForTimeout(300);

    // Verify usage recalculation immediately detected the draft
    const inUseCustomBadge = page.locator('.asset-card:has-text("custom-linguistic-chart.webp") span:has-text("In Use")');
    assert(
      await inUseCustomBadge.isVisible(),
      'Asset dynamically recalculated to "In Use" after being referenced in a local draft'
    );

    const draftUsageRef = page.locator('.asset-card:has-text("custom-linguistic-chart.webp"):has-text("Draft Using Custom Asset Cover")');
    assert(
      await draftUsageRef.isVisible(),
      'Referenced draft title listed in the asset card usage details'
    );

    // =========================================================================
    // EDGE CASE 6: Deletion Safety Guard Blocks In-Use Asset
    // =========================================================================
    console.log('\n🧪 Edge Case 6: Deletion Protection Guard for In-Use Asset');
    const inUseDelBtn = customAssetCard.locator('.btn-asset-delete');
    await inUseDelBtn.click();
    await page.waitForTimeout(300);

    const blockedModal = page.locator('#asset-blocked-modal');
    assert(await blockedModal.isVisible(), 'Deletion safety guard modal (#asset-blocked-modal) blocked deletion');

    const blockedItem = page.locator('#asset-blocked-list:has-text("Draft Using Custom Asset Cover")');
    assert(
      await blockedItem.isVisible(),
      'Safety guard modal lists the exact draft publication preventing deletion'
    );

    // Close blocked modal
    await page.locator('#asset-blocked-close').click();
    await page.waitForTimeout(200);
    assert(await blockedModal.isHidden(), 'Blocked modal closed cleanly');

    // =========================================================================
    // EDGE CASE 7: Dynamic Unlinking on Draft Deletion
    // =========================================================================
    console.log('\n🧪 Edge Case 7: Dynamic Usage Graph Unlinking upon Draft Deletion');
    // Go to Drafts tab and delete the draft referencing this asset
    await draftsTabBtn.click();
    await page.waitForTimeout(300);

    const draftItem = page.locator('#drafts-container:has-text("Draft Using Custom Asset Cover")');
    const delDraftBtn = draftItem.locator('.btn-del-draft');
    await delDraftBtn.click();
    await page.waitForTimeout(300);

    // Return to Assets tab
    await assetsTabBtn.click();
    await page.waitForTimeout(300);

    // Verify asset reverted back to "Unused Asset"
    const restoredUnusedBadge = page.locator('.asset-card:has-text("custom-linguistic-chart.webp") span:has-text("Unused Asset")');
    assert(
      await restoredUnusedBadge.isVisible(),
      'Deleting the referencing draft immediately reverts asset back to "Unused Asset"'
    );

    // =========================================================================
    // EDGE CASE 8: Clean Deletion of Unused Asset & Storage Purge
    // =========================================================================
    console.log('\n🧪 Edge Case 8: Clean Deletion & Local Storage Purge');
    await customAssetCard.locator('.btn-asset-delete').click();
    await page.waitForTimeout(300);

    const delModal = page.locator('#asset-delete-modal');
    assert(await delModal.isVisible(), 'Confirmation modal opened for unused asset deletion');

    // Confirm deletion
    await page.locator('#asset-del-confirm').click();
    await page.waitForTimeout(400);

    // Verify card is removed from DOM
    assert(
      await page.locator('.asset-card:has-text("custom-linguistic-chart.webp")').isHidden(),
      'Custom asset card removed from DOM gallery after confirmed deletion'
    );

    // Verify localStorage key is purged
    const storedCustomAssets = await page.evaluate(() => {
      const a = JSON.parse(localStorage.getItem('hk_cms_custom_assets') || '[]');
      return a.filter((x: any) => x.filename === 'custom-linguistic-chart.webp');
    });
    assert(
      storedCustomAssets.length === 0,
      'Deleted asset purged from "hk_cms_custom_assets" in browser storage'
    );

    // =========================================================================
    // EDGE CASE 9: Search Query Boundary Cases & Empty State
    // =========================================================================
    console.log('\n🧪 Edge Case 9: Search Query Boundary Cases & Empty State');
    const searchInput = page.locator('#asset-search-input');
    const noAssetsFound = page.locator('#no-assets-found');

    // Search with regex characters that could crash fragile code
    await searchInput.fill('[author].*?');
    await page.waitForTimeout(200);
    assert(await mainUi.isVisible(), 'Searching with regex characters does not throw exceptions');

    // Search with whitespace only
    await searchInput.fill('     ');
    await page.waitForTimeout(200);
    assert(
      await page.locator('.asset-card').count() >= 10,
      'Whitespace-only query trims cleanly and displays all gallery assets'
    );

    // Search with non-existent query
    await searchInput.fill('xyz-nonexistent-query-999');
    await page.waitForTimeout(200);
    assert(await noAssetsFound.isVisible(), 'Empty state notice (#no-assets-found) appears when query has 0 matches');
    assert(await page.locator('.asset-card').count() === 0, '0 asset cards displayed during non-matching query');

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(200);
    assert(await noAssetsFound.isHidden(), 'Empty state notice hidden after clearing query');
    assert(await page.locator('.asset-card').count() >= 10, 'All asset cards restored');

    // =========================================================================
    // EDGE CASE 10: "Set Cover" Cross-Tab Injection Integrity
    // =========================================================================
    console.log('\n🧪 Edge Case 10: "Set Cover" Action Integrity');
    const firstCard = page.locator('.asset-card').first();
    const firstCardPathBtn = firstCard.locator('.btn-asset-set-cover');
    const expectedCoverPath = await firstCardPathBtn.getAttribute('data-path');

    await firstCardPathBtn.click();
    await page.waitForTimeout(300);

    // Should switch to tab-write automatically
    const writePanel = page.locator('#tab-write');
    assert(await writePanel.isVisible(), '"Set Cover" action automatically transitioned view to Write tab');

    const currentCoverVal = await page.locator('#post-cover').inputValue();
    assert(
      currentCoverVal === expectedCoverPath,
      `Cover input populated with selected asset path: "${currentCoverVal}"`
    );

  } catch (error) {
    console.error('💥 Assets Edge Case Test execution threw an uncaught error:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`📊 ASSETS TAB EDGE CASES AUDIT: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAssetsTabEdgeCasesAudit();
