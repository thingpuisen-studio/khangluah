import { chromium } from 'playwright';

async function runDraftsTabDeepAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: DRAFTS TAB ONLY...\n');

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

    // =========================================================================
    // FEATURE 1: Initial Empty Drafts State & Badge Count
    // =========================================================================
    console.log('\n🧪 Feature 1: Initial State & Empty Message');
    // Ensure clean drafts state for test run
    await page.evaluate(() => localStorage.removeItem('hk_cms_drafts'));

    const draftsTabBtn = page.locator('button.nav-tab-btn[data-target="tab-drafts"]');
    await draftsTabBtn.click();
    await page.waitForTimeout(300);

    const draftsSection = page.locator('#tab-drafts');
    assert(await draftsSection.isVisible(), 'Drafts tab panel is visible');

    const emptyMsg = page.locator('#no-drafts-msg');
    assert(await emptyMsg.isVisible(), 'Empty drafts notice is visible when no drafts are saved');

    const draftsBadge = page.locator('#drafts-count-badge');
    assert((await draftsBadge.innerText()) === '(0)', 'Drafts counter badge shows "(0)"');

    // =========================================================================
    // FEATURE 2: Validation Guard (No Title Prevent Save)
    // =========================================================================
    console.log('\n🧪 Feature 2: Validation Guard on Empty Title');
    await page.locator('button.nav-tab-btn[data-target="tab-write"]').click();
    await page.waitForTimeout(200);

    // Clear form inputs
    await page.locator('#post-title').fill('');
    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(200);

    // Verify drafts in localStorage remained empty
    const draftsAfterEmpty = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hk_cms_drafts') || '[]');
    });
    assert(draftsAfterEmpty.length === 0, 'Saving draft with empty title prevented');

    // =========================================================================
    // FEATURE 3: Saving Multiple Multi-Schema Drafts (Poem & Academic Paper)
    // =========================================================================
    console.log('\n🧪 Feature 3: Saving Multi-Schema Drafts');

    // 3A: Save Poem Draft
    await page.locator('.type-pill-btn[data-type="poem"]').click();
    await page.locator('#post-title').fill('First Light Over Simte Hills');
    await page.locator('#post-slug').fill('first-light-simte-hills');
    await page.locator('#post-subtitle').fill('Stanzas on dawn mist and mountain birds');
    await page.locator('#post-category').fill('Highland Poetry');
    await page.locator('#post-body').fill('Dawn breaks upon the bamboo ridge  \nThe stream awakens with clear cold song');
    await page.locator('#poem-couplet-input').fill('Dawn breaks upon the bamboo ridge,\nAwakened by the mountain breeze.');

    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(300);
    // Dismiss publish modal if shown
    const pubModalClose = page.locator('#pub-modal-close');
    if (await pubModalClose.isVisible()) await pubModalClose.click();

    // 3B: Save Academic Paper Draft
    await page.locator('.type-pill-btn[data-type="academic_paper"]').click();
    await page.locator('#post-title').fill('Grammatical Aspect in Northern Simte');
    await page.locator('#post-slug').fill('grammatical-aspect-northern-simte');
    await page.locator('#paper-journal').fill('Himalayan Linguistics Journal');
    await page.locator('#paper-volume').fill('Vol 24, pp. 45-62');
    await page.locator('#paper-doi').fill('10.1515/hlj-2026-004');
    await page.locator('#paper-abstract').fill('An investigation of perfective vs habitual aspect marking in Northern Simte.');
    await page.locator('#post-body').fill('## 1. Introduction\nThe Simte aspectual system distinguishes perfective and imperfective...');

    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(300);
    if (await pubModalClose.isVisible()) await pubModalClose.click();

    // Verify badge updated to (2)
    assert((await draftsBadge.innerText()) === '(2)', 'Drafts counter badge updated to "(2)"');

    // =========================================================================
    // FEATURE 4: Drafts List Rendering & Metadata Display
    // =========================================================================
    console.log('\n🧪 Feature 4: Drafts List Rendering & Badges');
    await draftsTabBtn.click();
    await page.waitForTimeout(300);

    assert(!(await emptyMsg.isVisible()), 'Empty message hidden when drafts exist');

    const draftEntries = page.locator('#drafts-container > div');
    assert((await draftEntries.count()) === 2, 'Rendered exactly 2 draft cards');

    // Assert the first card is the most recently saved academic paper
    const firstDraftTitle = await draftEntries.first().locator('h3').innerText();
    assert(firstDraftTitle === 'Grammatical Aspect in Northern Simte', `Most recent draft card is first: "${firstDraftTitle}"`);

    // Assert schema badge
    const schemaBadge = await draftEntries.first().locator('span.uppercase').first().innerText();
    assert(schemaBadge === 'ACADEMIC_PAPER', `Schema badge reflects academic_paper: "${schemaBadge}"`);

    // =========================================================================
    // FEATURE 5: "Load Draft" Action & Exact Form Restoration
    // =========================================================================
    console.log('\n🧪 Feature 5: "Load Draft" Form Restoration');
    // Load the poem draft (the second card in list)
    const poemDraftCard = draftEntries.nth(1);
    const loadPoemBtn = poemDraftCard.locator('.btn-load-draft');
    await loadPoemBtn.click();
    await page.waitForTimeout(400);

    // Verify transitioned to Write Tab
    const writePanel = page.locator('#tab-write');
    assert(await writePanel.isVisible(), 'Clicking "Load Draft" transitioned view to Write tab');

    // Verify all fields restored accurately
    const loadedTitle = await page.locator('#post-title').inputValue();
    const loadedSlug = await page.locator('#post-slug').inputValue();
    const loadedCouplet = await page.locator('#poem-couplet-input').inputValue();
    const loadedBody = await page.locator('#post-body').inputValue();

    assert(loadedTitle === 'First Light Over Simte Hills', `Title restored: "${loadedTitle}"`);
    assert(loadedSlug === 'first-light-simte-hills', `Slug restored: "${loadedSlug}"`);
    assert(loadedCouplet.includes('Dawn breaks upon'), `Poem couplet restored: "${loadedCouplet}"`);
    assert(loadedBody.includes('stream awakens'), 'Poem body restored');

    // =========================================================================
    // FEATURE 6: Deleting an Individual Draft & Returning to Empty State
    // =========================================================================
    console.log('\n🧪 Feature 6: Individual Draft Deletion & Counter Decrement');
    await draftsTabBtn.click();
    await page.waitForTimeout(300);

    // Delete first draft
    const deleteBtn = page.locator('.btn-del-draft').first();
    await deleteBtn.click();
    await page.waitForTimeout(300);

    assert((await draftsBadge.innerText()) === '(1)', 'Badge decremented to "(1)" after deleting one draft');
    assert((await page.locator('#drafts-container > div').count()) === 1, 'Only 1 draft card remains');

    // Delete remaining draft
    await page.locator('.btn-del-draft').first().click();
    await page.waitForTimeout(300);

    assert((await draftsBadge.innerText()) === '(0)', 'Badge returned to "(0)"');
    assert(await emptyMsg.isVisible(), 'Empty state message restored after all drafts deleted');

  } catch (error) {
    console.error('\n❌ Unexpected error in Drafts Tab test run:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n' + '='.repeat(55));
  console.log(`🏁 DRAFTS TAB TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(55) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runDraftsTabDeepAudit();
