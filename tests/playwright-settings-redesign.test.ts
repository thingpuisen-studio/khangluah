import { chromium } from 'playwright';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function runSettingsRedesignAudit() {
  console.log('Starting E2E Test Suite: Page-Centric Settings Redesign & Media Pickers...\n');

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
      console.log(`  PASS: ${message}`);
      passed++;
    } else {
      console.error(`  FAIL: ${message}`);
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

    const settingsTabBtn = page.locator('button.nav-tab-btn[data-target="tab-site-config"]');
    await settingsTabBtn.click();
    await page.waitForTimeout(300);

    // =========================================================================
    // FEATURE 1: Home Page Settings Section & Profile Avatar Visual Media Picker
    // =========================================================================
    console.log('\nFeature 1: Home Page Settings Section & Profile Avatar Visual Media Picker');
    const homeSection = page.locator('#sec-cfg-home');
    assert(await homeSection.isVisible(), 'Home Page settings section (#sec-cfg-home) is rendered and visible');

    const avatarPreviewImg = page.locator('#avatar-preview-img');
    assert(await avatarPreviewImg.isVisible(), 'Profile avatar preview image thumbnail (#avatar-preview-img) is visible');

    const uploadAvatarBtn = page.locator('#btn-upload-avatar');
    assert(await uploadAvatarBtn.isVisible(), 'Upload New Photo button (#btn-upload-avatar) is visible');

    const pickAvatarAssetBtn = page.locator('#btn-pick-avatar-asset');
    assert(await pickAvatarAssetBtn.isVisible(), 'Choose from Asset Library button (#btn-pick-avatar-asset) is visible');

    const avatarInput = page.locator('#cfg-author-avatar');
    assert(await avatarInput.isVisible(), 'Avatar file path input (#cfg-author-avatar) is visible');

    const shortBioInput = page.locator('#cfg-author-shortbio');
    assert(await shortBioInput.isVisible(), 'Home page hero short bio textarea (#cfg-author-shortbio) is visible');

    // Test live thumbnail updating when typing image path
    const customAvatarPath = '/images/author-avatar.jpg';
    await avatarInput.fill(customAvatarPath);
    await avatarInput.dispatchEvent('input');
    await page.waitForTimeout(150);

    const updatedAvatarSrc = await avatarPreviewImg.getAttribute('src');
    assert(
      updatedAvatarSrc === customAvatarPath,
      `Avatar preview thumbnail dynamically updated src to "${customAvatarPath}"`
    );

    // =========================================================================
    // FEATURE 2: About Page Settings Section & Portrait Photo Visual Media Picker
    // =========================================================================
    console.log('\nFeature 2: About Page Settings Section & Portrait Photo Visual Media Picker');
    const aboutSection = page.locator('#sec-cfg-about');
    assert(await aboutSection.isVisible(), 'About Page settings section (#sec-cfg-about) is rendered and visible');

    const photoPreviewImg = page.locator('#photo-preview-img');
    assert(await photoPreviewImg.isVisible(), 'About portrait preview image thumbnail (#photo-preview-img) is visible');

    const uploadPhotoBtn = page.locator('#btn-upload-photo');
    assert(await uploadPhotoBtn.isVisible(), 'Upload New Portrait button (#btn-upload-photo) is visible');

    const pickPhotoAssetBtn = page.locator('#btn-pick-photo-asset');
    assert(await pickPhotoAssetBtn.isVisible(), 'Choose from Asset Library button (#btn-pick-photo-asset) is visible');

    const photoInput = page.locator('#cfg-author-photo');
    assert(await photoInput.isVisible(), 'Portrait photo file path input (#cfg-author-photo) is visible');

    const aboutEyebrowInput = page.locator('#cfg-page-about-eyebrow');
    const aboutTitleInput = page.locator('#cfg-page-about-title');
    const aboutSubInput = page.locator('#cfg-page-about-sub');
    const fullBioInput = page.locator('#cfg-author-fullbio');
    const qualInput = page.locator('#cfg-author-qualification');

    assert(await aboutEyebrowInput.isVisible(), 'About page eyebrow input (#cfg-page-about-eyebrow) is located in About section');
    assert(await aboutTitleInput.isVisible(), 'About page title input (#cfg-page-about-title) is located in About section');
    assert(await aboutSubInput.isVisible(), 'About page subtitle input (#cfg-page-about-sub) is located in About section');
    assert(await fullBioInput.isVisible(), 'About page full bio textarea (#cfg-author-fullbio) is located in About section');
    assert(await qualInput.isVisible(), 'About page qualification input (#cfg-author-qualification) is located in About section');

    // Test portrait preview update
    const customPhotoPath = '/images/author-centered.jpg';
    await photoInput.fill(customPhotoPath);
    await photoInput.dispatchEvent('input');
    await page.waitForTimeout(150);

    const updatedPhotoSrc = await photoPreviewImg.getAttribute('src');
    assert(
      updatedPhotoSrc === customPhotoPath,
      `Portrait preview thumbnail dynamically updated src to "${customPhotoPath}"`
    );

    // =========================================================================
    // FEATURE 3: Asset Library Picker Modal Interaction
    // =========================================================================
    console.log('\nFeature 3: Asset Library Picker Modal Interaction');
    const assetModal = page.locator('#settings-asset-picker-modal');
    assert(!await assetModal.isVisible(), 'Asset Library modal is initially closed/hidden');

    // Open modal via Avatar picker button
    await pickAvatarAssetBtn.click();
    await page.waitForTimeout(200);
    assert(await assetModal.isVisible(), 'Asset Library modal opens when clicking "Choose from Asset Library"');

    // Search bar is visible
    const modalSearch = page.locator('#settings-asset-picker-search');
    assert(await modalSearch.isVisible(), 'Search input in Asset Library modal is rendered');

    // Close button works
    const closeBtn = page.locator('#btn-close-settings-asset-modal');
    await closeBtn.click();
    await page.waitForTimeout(200);
    assert(!await assetModal.isVisible(), 'Asset Library modal closes when clicking close button');

    // Open via About Portrait picker button
    await pickPhotoAssetBtn.click();
    await page.waitForTimeout(200);
    assert(await assetModal.isVisible(), 'Asset Library modal opens when clicking About photo picker button');

    // Close by clicking backdrop
    await assetModal.click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(200);
    assert(!await assetModal.isVisible(), 'Asset Library modal closes when clicking outside backdrop');

    // =========================================================================
    // FEATURE 4: Direct Local Server API Endpoints (/api/save-config & /api/save-asset)
    // =========================================================================
    console.log('\nFeature 4: Direct Local Server API Endpoints (/api/save-config & /api/save-asset)');

    // Test /api/save-config rejection of invalid payload
    const invalidConfigRes = await page.request.post('http://localhost:4321/api/save-config', {
      data: JSON.stringify({ invalid: true })
    });
    assert(invalidConfigRes.status() === 400, 'POST /api/save-config returns 400 on invalid payload');

    // Test /api/save-asset rejection of missing data
    const invalidAssetRes = await page.request.post('http://localhost:4321/api/save-asset', {
      data: JSON.stringify({ filename: '' })
    });
    assert(invalidAssetRes.status() === 400, 'POST /api/save-asset returns 400 on missing image data');

    // Test /api/save-asset saving a test asset
    const testBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const validAssetRes = await page.request.post('http://localhost:4321/api/save-asset', {
      data: JSON.stringify({
        filename: 'test-ping-asset.webp',
        base64: testBase64
      })
    });
    assert(validAssetRes.status() === 200, 'POST /api/save-asset successfully writes image file and returns 200 OK');
    const assetJson = await validAssetRes.json();
    assert(assetJson.success === true && assetJson.path.includes('test-ping-asset.webp'), 'POST /api/save-asset returns success and target web path');

    const tempFile = path.join(process.cwd(), 'public/images/posts/test-ping-asset.webp');
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }

    // =========================================================================
    // FEATURE 5: Clean Reset to Baseline
    // =========================================================================
    console.log('\nFeature 5: Clean Reset to Baseline');
    const resetBtn = page.locator('#btn-reset-site-config');
    await resetBtn.click();
    await page.waitForTimeout(300);

    const resetAuthorName = await page.locator('#cfg-author-name').inputValue();
    assert(
      resetAuthorName === 'H. Kapginlian',
      `Settings reset restores author name to default ("${resetAuthorName}")`
    );

  } catch (error) {
    console.error('Settings redesign test threw an uncaught error:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log(`SETTINGS REDESIGN TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSettingsRedesignAudit();
