import { chromium } from 'playwright';

async function runSettingsTabEdgeCasesAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: SITE SETTINGS TAB EDGE CASES...\n');

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

  // Configurable dialog behavior
  let shouldAcceptDialog = true;
  page.on('dialog', async (dialog) => {
    if (shouldAcceptDialog) {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  });

  try {
    await page.goto('http://localhost:4321/admin', { waitUntil: 'domcontentloaded' });
    const mainUi = page.locator('#admin-main-ui');
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });
    assert(await mainUi.isVisible(), 'Admin main UI studio is active and accessible');

    const settingsTabBtn = page.locator('button.nav-tab-btn[data-target="tab-site-config"]');
    const catalogTabBtn = page.locator('button.nav-tab-btn[data-target="tab-existing"]');
    const storageBadge = page.locator('#config-storage-status');

    // =========================================================================
    // EDGE CASE 1: Corrupted JSON in localStorage ('hk_cms_site_config') Fallback
    // =========================================================================
    console.log('\n🧪 Edge Case 1: Corrupted JSON in localStorage Fallback Safety');
    await page.evaluate(() => {
      localStorage.setItem('hk_cms_site_config', '{"brokenJson": true, unexpected_trailing_comma:');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });

    await settingsTabBtn.click();
    await page.waitForTimeout(300);

    const badgeText = (await storageBadge.innerText()).trim();
    assert(badgeText === 'Default Loaded', `Corrupted JSON fallback defaults gracefully to "Default Loaded" (got "${badgeText}")`);

    const authorNameInput = page.locator('#cfg-author-name');
    const restoredAuthor = await authorNameInput.inputValue();
    assert(restoredAuthor.length > 0 && restoredAuthor.includes('Kapginlian'), `Author name populated with default values despite corrupted storage: "${restoredAuthor}"`);

    // Clean corrupted storage
    await page.evaluate(() => localStorage.removeItem('hk_cms_site_config'));

    // =========================================================================
    // EDGE CASE 2: Navigation Up Boundary Guard (Index 0 is disabled)
    // =========================================================================
    console.log('\n🧪 Edge Case 2: Navigation First Item Boundary Guard (Index 0)');
    const navItems = page.locator('#cfg-nav-list > div');
    const firstItem = navItems.first();
    const firstUpBtn = firstItem.locator('.btn-nav-up');

    assert(await firstUpBtn.isDisabled(), 'First navigation item "Move Up" button has disabled attribute');
    const initialFirstLabel = await firstItem.locator('.nav-label-input').inputValue();

    // Attempting to dispatch click on disabled button should not alter order
    await firstUpBtn.dispatchEvent('click');
    await page.waitForTimeout(200);

    const afterFirstLabel = await page.locator('#cfg-nav-list > div').first().locator('.nav-label-input').inputValue();
    assert(afterFirstLabel === initialFirstLabel, `First item label remain unaltered after index 0 up click ("${afterFirstLabel}")`);

    // =========================================================================
    // EDGE CASE 3: Navigation Down Boundary Guard (Last item is disabled)
    // =========================================================================
    console.log('\n🧪 Edge Case 3: Navigation Last Item Boundary Guard (Last Index)');
    const totalNavs = await navItems.count();
    const lastItem = navItems.nth(totalNavs - 1);
    const lastDownBtn = lastItem.locator('.btn-nav-down');

    assert(await lastDownBtn.isDisabled(), 'Last navigation item "Move Down" button has disabled attribute');
    const initialLastLabel = await lastItem.locator('.nav-label-input').inputValue();

    await lastDownBtn.dispatchEvent('click');
    await page.waitForTimeout(200);

    const afterLastLabel = await page.locator('#cfg-nav-list > div').nth(totalNavs - 1).locator('.nav-label-input').inputValue();
    assert(afterLastLabel === initialLastLabel, `Last item label remained unaltered after last index down click ("${afterLastLabel}")`);

    // =========================================================================
    // EDGE CASE 4: Sequential Reordering & Monotonic Order Integrity
    // =========================================================================
    console.log('\n🧪 Edge Case 4: Sequential Reordering & Monotonic Order Integrity');
    // Swap first item down
    const firstDownBtn = page.locator('#cfg-nav-list > div').first().locator('.btn-nav-down');
    await firstDownBtn.click();
    await page.waitForTimeout(250);

    // Swap second item down
    const secondDownBtn = page.locator('#cfg-nav-list > div').nth(1).locator('.btn-nav-down');
    await secondDownBtn.click();
    await page.waitForTimeout(250);

    // Verify all order numbers are strictly sequential #1, #2, #3, ...
    const orderBadges = (await page.locator('#cfg-nav-list span.font-mono').allInnerTexts())
      .filter(t => t.startsWith('#'));
    const parsedOrders = orderBadges.map(b => parseInt(b.replace('#', '').trim(), 10));
    const isStrictlySorted = parsedOrders.length > 0 && parsedOrders.every((val, i) => val === i + 1);
    assert(isStrictlySorted, `Navigation order badges remain sequentially ordered 1 to N without duplicates: [${parsedOrders.join(', ')}]`);

    // =========================================================================
    // EDGE CASE 5: Unicode, IPA & Special Characters Preservation
    // =========================================================================
    console.log('\n🧪 Edge Case 5: Unicode, IPA & Special Characters Preservation');
    const specialAuthor = 'Dr. H. Kapginlian [ɦ. kapɡinlian] & Folklore';
    const specialBio = 'Linguist researching [tɬʰ], tonal contours [˥˧], em-dashes — & simte.';

    await authorNameInput.fill(specialAuthor);
    await authorNameInput.dispatchEvent('input');

    const shortBioInput = page.locator('#cfg-author-shortbio');
    await shortBioInput.fill(specialBio);
    await shortBioInput.dispatchEvent('input');
    await page.waitForTimeout(300);

    // Check live TypeScript output contains exact characters
    const codeOutput = await page.locator('#site-config-code-output code').innerText();
    assert(codeOutput.includes('ɦ. kapɡinlian'), 'Live TypeScript code output faithfully preserves Unicode author with IPA');
    assert(codeOutput.includes('tɬʰ') && codeOutput.includes('˥˧') && codeOutput.includes('—'), 'Live TypeScript code output faithfully preserves IPA phonetic tone symbols & em-dashes');

    // =========================================================================
    // EDGE CASE 6: Bulk Navigation Disable (Empty Header Navigation Guard)
    // =========================================================================
    console.log('\n🧪 Edge Case 6: Bulk Navigation Item Disable State');
    const toggles = page.locator('.nav-enabled-toggle');
    const toggleCount = await toggles.count();

    // Disable all navigation items
    for (let i = 0; i < toggleCount; i++) {
      if (await toggles.nth(i).isChecked()) {
        await toggles.nth(i).uncheck();
        await page.waitForTimeout(50);
      }
    }
    await page.waitForTimeout(200);

    const codeAfterDisable = await page.locator('#site-config-code-output code').innerText();
    const navBlockMatch = codeAfterDisable.match(/"navigation":\s*\[([\s\S]*?)\]/);
    const navBlock = navBlockMatch ? navBlockMatch[1] : '';
    assert(navBlock.includes('"enabled": false'), 'TypeScript output reflects navigation disabled toggles');
    assert(!navBlock.includes('"enabled": true'), 'All navigation items in navigation array successfully toggled to enabled: false');

    // Restore first navigation item
    await toggles.first().check();
    await page.waitForTimeout(200);
    const codeRestoredOne = await page.locator('#site-config-code-output code').innerText();
    assert(codeRestoredOne.includes('"enabled": true'), 'Single navigation item re-enabled successfully');

    // =========================================================================
    // EDGE CASE 7: Social Profile Deactivation & Empty Handles
    // =========================================================================
    console.log('\n🧪 Edge Case 7: Social Profile Deactivation & Empty Field Output');
    const firstSocialToggle = page.locator('.social-active-toggle').first();
    await firstSocialToggle.uncheck();
    await page.waitForTimeout(100);

    const firstSocialHandle = page.locator('.social-handle-input').first();
    await firstSocialHandle.fill('');
    await firstSocialHandle.dispatchEvent('input');
    await page.waitForTimeout(200);

    const codeAfterSocial = await page.locator('#site-config-code-output code').innerText();
    assert(codeAfterSocial.includes('"isActive": false'), 'Deactivated social profile generates "isActive": false');
    assert(codeAfterSocial.includes('"handle": ""'), 'Empty social handle produces valid empty string in configuration');

    // =========================================================================
    // EDGE CASE 8: Reset to Defaults Dialog Cancellation
    // =========================================================================
    console.log('\n🧪 Edge Case 8: Reset to Defaults Dismissal / Cancellation');
    shouldAcceptDialog = false; // Simulate user clicking "Cancel" in confirmation dialog

    const resetBtn = page.locator('#btn-reset-site-config');
    await resetBtn.click();
    await page.waitForTimeout(300);

    // Value should still be specialAuthor
    const authorAfterCancel = await authorNameInput.inputValue();
    assert(authorAfterCancel === specialAuthor, 'Cancelling reset dialog leaves custom settings intact');

    // =========================================================================
    // EDGE CASE 9: Reset to Defaults Dialog Confirmation
    // =========================================================================
    console.log('\n🧪 Edge Case 9: Reset to Defaults Confirmation Execution');
    shouldAcceptDialog = true; // Simulate user clicking "OK" in confirmation dialog

    await resetBtn.click();
    await page.waitForTimeout(400);

    const authorAfterReset = await authorNameInput.inputValue();
    assert(
      authorAfterReset === 'H. Kapginlian' || authorAfterReset.includes('Kapginlian'),
      `Confirming reset restores original default author name ("${authorAfterReset}")`
    );

    const badgeAfterReset = (await storageBadge.innerText()).trim();
    assert(badgeAfterReset === 'Default Loaded', `Storage badge resets back to "Default Loaded" (got "${badgeAfterReset}")`);

    // Verify localStorage key was removed
    const storedAfterReset = await page.evaluate(() => localStorage.getItem('hk_cms_site_config'));
    assert(storedAfterReset === null, 'Reset operation cleanly removes "hk_cms_site_config" from localStorage');

    // =========================================================================
    // EDGE CASE 10: Local Storage Persistence Across Full Page Reload
    // =========================================================================
    console.log('\n🧪 Edge Case 10: Local Storage Persistence Across Page Reload');
    const customTitle = 'Senior Research Fellow in Tibeto-Burman Morphosyntax';
    const authorTitleInput = page.locator('#cfg-author-title');
    await authorTitleInput.fill(customTitle);
    await authorTitleInput.dispatchEvent('input');

    // Click Save Settings Locally
    const saveBtn = page.locator('#btn-save-site-config');
    await saveBtn.click();
    await page.waitForTimeout(300);

    const badgeAfterSave = (await storageBadge.innerText()).trim();
    assert(badgeAfterSave.includes('Saved Locally'), `Storage badge reflects local save ("${badgeAfterSave}")`);

    // Verify localStorage is populated
    const storedConfigRaw = await page.evaluate(() => localStorage.getItem('hk_cms_site_config'));
    assert(storedConfigRaw !== null && storedConfigRaw.includes(customTitle), 'localStorage correctly updated with customized title');

    // Reload the page
    await page.reload({ waitUntil: 'domcontentloaded' });
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });

    // Navigate back to Settings Tab
    await settingsTabBtn.click();
    await page.waitForTimeout(300);

    const reloadedBadge = (await storageBadge.innerText()).trim();
    assert(reloadedBadge.includes('Saved Locally'), `After reload, storage badge indicates local save ("${reloadedBadge}")`);

    const reloadedTitle = await page.locator('#cfg-author-title').inputValue();
    assert(reloadedTitle === customTitle, `After reload, customized title is faithfully restored from storage ("${reloadedTitle}")`);

    // Clean up: Reset back to defaults
    await resetBtn.click();
    await page.waitForTimeout(300);

  } catch (error) {
    console.error('💥 Settings Edge Case Test execution threw an uncaught error:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`📊 SITE SETTINGS TAB EDGE CASES AUDIT: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSettingsTabEdgeCasesAudit();
