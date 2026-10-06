import { chromium } from 'playwright';

async function runSettingsTabDeepAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: SITE SETTINGS STUDIO TAB ONLY...\n');

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

  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  try {
    await page.goto('http://localhost:4321/admin', { waitUntil: 'domcontentloaded' });
    const mainUi = page.locator('#admin-main-ui');
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });
    assert(await mainUi.isVisible(), 'Admin main UI studio is active and accessible');

    // Clean any prior stored config before starting tests
    await page.evaluate(() => localStorage.removeItem('hk_cms_site_config'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });

    // =========================================================================
    // FEATURE 1: Navigation to Site Settings Studio & Initial State
    // =========================================================================
    console.log('\n🧪 Feature 1: Navigation to Settings Tab & Initial Default State');
    const settingsTabBtn = page.locator('button.nav-tab-btn[data-target="tab-site-config"]');
    assert(await settingsTabBtn.isVisible(), 'Settings navigation tab button is rendered');

    await settingsTabBtn.click();
    await page.waitForTimeout(300);

    const settingsPanel = page.locator('#tab-site-config');
    assert(await settingsPanel.isVisible(), 'Site Settings Studio panel (#tab-site-config) is visible');

    const storageBadge = page.locator('#config-storage-status');
    const badgeText = (await storageBadge.innerText()).trim();
    assert(badgeText === 'Default Loaded', `Initial storage status badge is "Default Loaded" (got "${badgeText}")`);

    const sideNavLinks = page.locator('.cfg-side-link');
    const sideNavCount = await sideNavLinks.count();
    assert(sideNavCount >= 7, `Sticky settings sidebar navigation links rendered (${sideNavCount} links found)`);

    // =========================================================================
    // FEATURE 2: Navigation Items Reordering, Labels & Visibility
    // =========================================================================
    console.log('\n🧪 Feature 2: Navigation Tab Reordering & Visibility Toggles');
    const navItems = page.locator('#cfg-nav-list > div');
    const initialNavCount = await navItems.count();
    assert(initialNavCount >= 5, `Navigation items populated in settings list (${initialNavCount} items)`);

    // First item up button should be disabled
    const firstUpBtn = navItems.first().locator('.btn-nav-up');
    assert(await firstUpBtn.isDisabled(), 'First navigation item "Move Up" button is disabled');

    // Get initial first item label
    const firstInput = navItems.first().locator('.nav-label-input');
    const originalFirstLabel = await firstInput.inputValue();
    const secondInput = navItems.nth(1).locator('.nav-label-input');
    const originalSecondLabel = await secondInput.inputValue();

    // Click Move Down on first item
    const firstDownBtn = navItems.first().locator('.btn-nav-down');
    await firstDownBtn.click();
    await page.waitForTimeout(300);

    // After swapping, the new first item should have originalSecondLabel
    const swappedFirstInput = page.locator('#cfg-nav-list > div').first().locator('.nav-label-input');
    const swappedFirstLabel = await swappedFirstInput.inputValue();
    assert(
      swappedFirstLabel === originalSecondLabel,
      `Navigation order swap verified: item "${originalSecondLabel}" moved up to position 1`
    );

    // Edit a navigation label
    await swappedFirstInput.fill('Discover');
    await swappedFirstInput.dispatchEvent('input');
    await page.waitForTimeout(200);

    // Verify code output reflects edited label
    const codeOutput = page.locator('#site-config-code-output code');
    let generatedCode = await codeOutput.innerText();
    assert(generatedCode.includes('Discover'), 'TypeScript code output dynamically updated with new nav label "Discover"');

    // Toggle visibility checkbox on first item
    const firstToggle = page.locator('#cfg-nav-list > div').first().locator('.nav-enabled-toggle');
    const initialToggleChecked = await firstToggle.isChecked();
    await firstToggle.setChecked(!initialToggleChecked);
    await firstToggle.dispatchEvent('change');
    await page.waitForTimeout(200);

    generatedCode = await codeOutput.innerText();
    assert(
      generatedCode.includes(`"enabled": ${!initialToggleChecked}`),
      `Navigation visibility checkbox toggle dynamically reflected in TypeScript export (enabled: ${!initialToggleChecked})`
    );

    // =========================================================================
    // FEATURE 3: Author Monograph & Identity Metadata Customization
    // =========================================================================
    console.log('\n🧪 Feature 3: Author Monograph & Identity Metadata Customization');
    const authorNameInput = page.locator('#cfg-author-name');
    const authorTitleInput = page.locator('#cfg-author-title');
    const authorAffilInput = page.locator('#cfg-author-affiliation');
    const authorResearchInput = page.locator('#cfg-author-research-areas');
    const metricPapersVal = page.locator('#cfg-metric-papers-val');
    const metricPapersLbl = page.locator('#cfg-metric-papers-lbl');

    await authorNameInput.fill('Dr. H. Khangluah, Ph.D.');
    await authorNameInput.dispatchEvent('input');
    await authorTitleInput.fill('Senior Fellow in Computational Linguistics');
    await authorTitleInput.dispatchEvent('input');
    await authorAffilInput.fill('Centre for Endangered Languages');
    await authorAffilInput.dispatchEvent('input');
    await authorResearchInput.fill('Phonology, Morphology, Tibeto-Burman Documentation');
    await authorResearchInput.dispatchEvent('input');
    await metricPapersVal.fill('38+');
    await metricPapersVal.dispatchEvent('input');
    await metricPapersLbl.fill('Scholarly Papers');
    await metricPapersLbl.dispatchEvent('input');
    await page.waitForTimeout(200);

    generatedCode = await codeOutput.innerText();
    assert(generatedCode.includes('Dr. H. Khangluah, Ph.D.'), 'Generated code contains updated author name');
    assert(generatedCode.includes('Senior Fellow in Computational Linguistics'), 'Generated code contains updated author title');
    assert(generatedCode.includes('38+'), 'Generated code contains updated papers metric value');

    // =========================================================================
    // FEATURE 4: Fieldwork Spotlight Configuration
    // =========================================================================
    console.log('\n🧪 Feature 4: Fieldwork Spotlight Interlinear Gloss Configuration');
    const spotlightBadge = page.locator('#cfg-spotlight-badge');
    const spotlightW1Src = page.locator('#cfg-spotlight-w1-src');
    const spotlightW1Gloss = page.locator('#cfg-spotlight-w1-gloss');
    const spotlightTrans = page.locator('#cfg-spotlight-trans');

    await spotlightBadge.fill('Linguistic Fieldwork 2026');
    await spotlightBadge.dispatchEvent('input');
    await spotlightW1Src.fill('kho-na');
    await spotlightW1Src.dispatchEvent('input');
    await spotlightW1Gloss.fill('river-LOC');
    await spotlightW1Gloss.dispatchEvent('input');
    await spotlightTrans.fill('Beside the tranquil mountain stream.');
    await spotlightTrans.dispatchEvent('input');
    await page.waitForTimeout(200);

    generatedCode = await codeOutput.innerText();
    assert(generatedCode.includes('Linguistic Fieldwork 2026'), 'Spotlight badge updated in code generator');
    assert(generatedCode.includes('kho-na') && generatedCode.includes('river-LOC'), 'Interlinear gloss source & gloss updated in code generator');
    assert(generatedCode.includes('Beside the tranquil mountain stream.'), 'Free translation updated in code generator');

    // =========================================================================
    // FEATURE 5: Social & Academic Directory Links
    // =========================================================================
    console.log('\n🧪 Feature 5: Social & Academic Directory Profiles');
    const socialCards = page.locator('#cfg-socials-list > div');
    const socialCount = await socialCards.count();
    assert(socialCount >= 5, `Social and academic profiles rendered (${socialCount} profiles found)`);

    // Modify the first profile's URL and handle
    const firstSocialHref = socialCards.first().locator('.social-href-input');
    const firstSocialHandle = socialCards.first().locator('.social-handle-input');
    await firstSocialHref.fill('https://orcid.org/0009-0002-1234-5678');
    await firstSocialHref.dispatchEvent('input');
    await firstSocialHandle.fill('0009-0002-1234-5678');
    await firstSocialHandle.dispatchEvent('input');
    await page.waitForTimeout(200);

    generatedCode = await codeOutput.innerText();
    assert(generatedCode.includes('0009-0002-1234-5678'), 'Social directory profile updates reflected in TypeScript generator');

    // =========================================================================
    // FEATURE 6: Page Leads & Footer Colophon Configuration
    // =========================================================================
    console.log('\n🧪 Feature 6: Page Leads and Footer Colophon Configuration');
    const researchEyebrow = page.locator('#cfg-page-research-eyebrow');
    const researchTitle = page.locator('#cfg-page-research-title');
    const footerCopy = page.locator('#cfg-footer-copy');

    await researchEyebrow.fill('Academic Corpus');
    await researchEyebrow.dispatchEvent('input');
    await researchTitle.fill('Field Research & Linguistic Working Papers');
    await researchTitle.dispatchEvent('input');
    await footerCopy.fill('© 2026 Dr. H. Khangluah. All rights reserved under CC-BY.');
    await footerCopy.dispatchEvent('input');
    await page.waitForTimeout(200);

    generatedCode = await codeOutput.innerText();
    assert(generatedCode.includes('Academic Corpus'), 'Page eyebrow updated in code generator');
    assert(generatedCode.includes('Field Research & Linguistic Working Papers'), 'Page title updated in code generator');
    assert(generatedCode.includes('© 2026 Dr. H. Khangluah. All rights reserved under CC-BY.'), 'Footer copyright updated in code generator');

    // =========================================================================
    // FEATURE 7: Local Storage Persistence & Reload Rehydration
    // =========================================================================
    console.log('\n🧪 Feature 7: Local Storage Commitment & Page Reload Rehydration');
    const saveBtn = page.locator('#btn-save-site-config');
    await saveBtn.click();
    await page.waitForTimeout(400);

    // Verify badge updated to Saved Locally
    const savedBadgeText = (await storageBadge.innerText()).trim();
    assert(
      savedBadgeText === 'Saved Locally (localStorage)',
      `Storage badge updated to "Saved Locally (localStorage)" (got "${savedBadgeText}")`
    );

    // Verify localStorage item is present in window context
    const storedJson = await page.evaluate(() => localStorage.getItem('hk_cms_site_config'));
    assert(storedJson !== null && storedJson.length > 50, 'localStorage key "hk_cms_site_config" is populated');
    const parsedStored = JSON.parse(storedJson!);
    assert(
      parsedStored.author?.name === 'Dr. H. Khangluah, Ph.D.',
      'localStorage contains saved author name "Dr. H. Khangluah, Ph.D."'
    );

    // Perform full page reload to test rehydration
    console.log('  🔄 Reloading page to test rehydration...');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });

    // Switch back to site config tab
    await settingsTabBtn.click();
    await page.waitForTimeout(300);

    // Badge should still say Saved Locally
    const rehydratedBadgeText = (await page.locator('#config-storage-status').innerText()).trim();
    assert(
      rehydratedBadgeText === 'Saved Locally (localStorage)',
      `After reload, storage badge indicates "Saved Locally (localStorage)" (got "${rehydratedBadgeText}")`
    );

    // Check author name rehydrated
    const rehydratedAuthorName = await page.locator('#cfg-author-name').inputValue();
    assert(
      rehydratedAuthorName === 'Dr. H. Khangluah, Ph.D.',
      `After reload, author name rehydrated into input: "${rehydratedAuthorName}"`
    );

    const rehydratedPapersVal = await page.locator('#cfg-metric-papers-val').inputValue();
    assert(
      rehydratedPapersVal === '38+',
      `After reload, papers metric rehydrated into input: "${rehydratedPapersVal}"`
    );

    // =========================================================================
    // FEATURE 8: Reset to Defaults Lifecycle & Cleanup
    // =========================================================================
    console.log('\n🧪 Feature 8: Reset Defaults Lifecycle & Export Action Verification');

    // Test Copy File button
    const copyBtn = page.locator('#btn-copy-site-config-code');
    assert(await copyBtn.isVisible(), 'Copy siteConfig.ts code button is visible');
    await copyBtn.click();
    await page.waitForTimeout(200);

    // Test Download button
    const downloadBtn = page.locator('#btn-download-site-config-file');
    assert(await downloadBtn.isVisible(), 'Download siteConfig.ts file button is visible');

    // Click Reset Defaults button (the dialog handler registered at top automatically accepts)
    const resetBtn = page.locator('#btn-reset-site-config');
    await resetBtn.click();
    await page.waitForTimeout(400);

    // Verify localStorage key is purged
    const postResetStorage = await page.evaluate(() => localStorage.getItem('hk_cms_site_config'));
    assert(postResetStorage === null, 'localStorage key "hk_cms_site_config" purged after Reset Defaults');

    // Verify badge resets to Default Loaded
    const resetBadgeText = (await page.locator('#config-storage-status').innerText()).trim();
    assert(
      resetBadgeText === 'Default Loaded',
      `Storage status badge reset back to "Default Loaded" (got "${resetBadgeText}")`
    );

    // Verify input reset back to original default
    const resetAuthorName = await page.locator('#cfg-author-name').inputValue();
    assert(
      resetAuthorName === 'H. Kapginlian',
      `Author name reset back to default: "${resetAuthorName}"`
    );

  } catch (error) {
    console.error('💥 Test execution threw an uncaught error:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log(`📊 SITE SETTINGS STUDIO TAB TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSettingsTabDeepAudit();
