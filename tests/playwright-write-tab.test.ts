import { chromium } from 'playwright';

async function runWriteTabDeepAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: WRITE TAB ONLY...\n');

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
    // console.log(`  [Dialog Alert]: ${dialog.message().slice(0, 60)}`);
    await dialog.accept();
  });

  try {
    await page.goto('http://localhost:4321/admin', { waitUntil: 'domcontentloaded' });
    const mainUi = page.locator('#admin-main-ui');
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });
    assert(await mainUi.isVisible(), 'Admin main UI studio is active and accessible');

    // Make sure we are on Write tab
    await page.locator('button.nav-tab-btn[data-target="tab-write"]').click();
    await page.waitForTimeout(200);

    // =========================================================================
    // FEATURE 1: Auto-Slug Generation & Manual Override Shield
    // =========================================================================
    console.log('\n🧪 Feature 1: Auto-Slug Generation & Manual Override Shield');
    const titleInput = page.locator('#post-title');
    const slugInput = page.locator('#post-slug');

    await titleInput.fill('Echoes Across the Valley! (Simte 2026)');
    const autoSlug = await slugInput.inputValue();
    assert(
      autoSlug === 'echoes-across-the-valley-simte-2026',
      `Auto-slug strips punctuation & sanitizes correctly: "${autoSlug}"`
    );

    // Manually edit slug and assert that subsequent title changes DO NOT overwrite it
    await slugInput.fill('custom-valley-slug');
    await titleInput.fill('A Completely Different Mountain Song');
    const retainedSlug = await slugInput.inputValue();
    assert(
      retainedSlug === 'custom-valley-slug',
      `Manual slug edit shield preserved custom slug against title input change: "${retainedSlug}"`
    );

    // =========================================================================
    // FEATURE 2: Publication Type Switching (Poem -> Essay -> Research Paper)
    // =========================================================================
    console.log('\n🧪 Feature 2: Multi-Schema Publication Type Switching');
    const poemSection = page.locator('#section-poem-fields');
    const essaySection = page.locator('#section-essay-fields');
    const paperSection = page.locator('#section-paper-fields');
    const composerLabel = page.locator('#composer-label');
    const categoryInput = page.locator('#post-category');

    // 2A: Essay Switch
    const essayBtn = page.locator('.type-pill-btn[data-type="essay"]');
    await essayBtn.click();
    await page.waitForTimeout(200);
    assert(await essaySection.isVisible(), 'Essay tailored section is visible');
    assert(!(await poemSection.isVisible()), 'Poem tailored section is hidden');
    assert(!(await paperSection.isVisible()), 'Paper tailored section is hidden');
    assert((await composerLabel.innerText()).toLowerCase().includes('essay body'), 'Composer label updated to "Essay Body"');
    assert((await categoryInput.inputValue()) === 'Cultural Dispatches', 'Default category updated to "Cultural Dispatches"');

    // Fill Essay-specific fields
    const pullquoteInput = page.locator('#essay-pullquote-input');
    await pullquoteInput.fill('Language is an oral vault of indigenous ancestry.');
    const essayTopicInput = page.locator('#essay-topic-input');
    await essayTopicInput.fill('Oral Epistemology');

    // 2B: Academic Paper Switch
    const paperBtn = page.locator('.type-pill-btn[data-type="academic_paper"]');
    await paperBtn.click();
    await page.waitForTimeout(200);
    assert(await paperSection.isVisible(), 'Research Paper tailored section is visible');
    assert(!(await essaySection.isVisible()), 'Essay tailored section is hidden');
    assert((await composerLabel.innerText()).toLowerCase().includes('monograph body'), 'Composer label updated to "Monograph Body"');
    assert((await categoryInput.inputValue()) === 'Linguistic Research', 'Default category updated to "Linguistic Research"');

    // Fill Academic Paper fields
    await page.locator('#paper-journal').fill('Linguistic Typology of the Northeast');
    await page.locator('#paper-volume').fill('Vol. 14, Issue 2');
    await page.locator('#paper-doi').fill('10.1007/s11185-026-0982-x');
    await page.locator('#paper-issn').fill('2349-8129');
    await page.locator('#paper-abstract').fill('This monograph analyzes pro-drop phenomena and emphatic pronominal forms in modern Simte.');

    // 2C: Return to Poem Switch
    const poemBtn = page.locator('.type-pill-btn[data-type="poem"]');
    await poemBtn.click();
    await page.waitForTimeout(200);
    assert(await poemSection.isVisible(), 'Poem tailored section returned to visible');
    assert(!(await paperSection.isVisible()), 'Research Paper tailored section hidden');

    // =========================================================================
    // FEATURE 3: Top Tip Spine & Background Gradient Theme Palette Selectors
    // =========================================================================
    console.log('\n🧪 Feature 3: Live Theme & Spine Accent Color Selectors');
    const miniCardTip = page.locator('#mini-card-tip');
    const miniCard = page.locator('#mini-card-preview');
    const tipLabel = page.locator('#label-selected-tip');
    const themeLabel = page.locator('#label-selected-theme');

    // Select Emerald Tip Color
    const emeraldTipBtn = page.locator('.tip-swatch-btn[data-tip-id="emerald"]');
    if (await emeraldTipBtn.isVisible()) {
      await emeraldTipBtn.click();
      await page.waitForTimeout(150);
      assert((await tipLabel.innerText()) === 'Emerald', 'Spine color label updated to "Emerald"');
      const tipClass = await miniCardTip.getAttribute('class');
      assert(tipClass?.includes('bg-emerald-500') || false, 'Mini card preview spine class updated to emerald');
    }

    // Select Forest Emerald Theme
    const forestThemeBtn = page.locator('.theme-tile-btn[data-theme-id="forest"]');
    if (await forestThemeBtn.isVisible()) {
      await forestThemeBtn.click();
      await page.waitForTimeout(150);
      assert((await themeLabel.innerText()) === 'Forest Emerald', 'Theme label updated to "Forest Emerald"');
      const cardClass = await miniCard.getAttribute('class');
      assert(cardClass?.includes('emerald') || false, 'Mini card preview background gradient updated to Forest Emerald');
    }

    // =========================================================================
    // FEATURE 4: Markdown Quick Toolbar Actions
    // =========================================================================
    console.log('\n🧪 Feature 4: Markdown Quick Toolbar Actions');
    const bodyInput = page.locator('#post-body');
    await bodyInput.fill('Initial stanza');

    // Test H2 heading button
    const h2Btn = page.locator('.md-tool-btn[data-action="h2"]');
    await h2Btn.click();
    let bodyVal = await bodyInput.inputValue();
    assert(bodyVal.includes('## '), 'H2 toolbar button prepended "## " to text');

    // Test Quote button
    const quoteBtn = page.locator('.md-tool-btn[data-action="quote"]');
    await quoteBtn.click();
    bodyVal = await bodyInput.inputValue();
    assert(bodyVal.includes('> '), 'Quote toolbar button prepended "> " to text');

    // Test Verse Break button
    const verseBreakBtn = page.locator('#btn-verse-break');
    await verseBreakBtn.click();
    bodyVal = await bodyInput.inputValue();
    assert(bodyVal.includes('  \n'), 'Verse break button inserted Markdown hard break ("  \\n")');

    // =========================================================================
    // FEATURE 5: Local Draft Save (SPADTLS) & Form Field Restoration
    // =========================================================================
    console.log('\n🧪 Feature 5: SPADTLS Local Draft Save & Restoration');
    await titleInput.fill('The Ancient Hearth of Pamjal');
    await slugInput.fill('ancient-hearth-pamjal');
    await bodyInput.fill('Stanza one by the fireside  \nShadows dancing on bamboo');

    const draftSaveBtn = page.locator('#btn-save-draft');
    await draftSaveBtn.click();
    await page.waitForTimeout(400);

    // Dismiss publish modal if opened
    const pubModalClose = page.locator('#pub-modal-close');
    if (await pubModalClose.isVisible()) {
      await pubModalClose.click();
      await page.waitForTimeout(200);
    }

    // Verify draft count badge increments
    const draftsBadge = page.locator('#drafts-count-badge');
    const badgeText = await draftsBadge.innerText();
    assert(badgeText !== '(0)', `Drafts count badge updated: ${badgeText}`);

    // Verify localStorage has the saved draft with exact fields
    const savedDrafts = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hk_cms_drafts') || '[]');
    });
    const foundDraft = savedDrafts.find((d: any) => d.slug === 'ancient-hearth-pamjal');
    assert(foundDraft && foundDraft.title === 'The Ancient Hearth of Pamjal', 'Draft persisted with matching title in localStorage');

    // =========================================================================
    // FEATURE 6: Form Reset / Clear Form Confirmation
    // =========================================================================
    console.log('\n🧪 Feature 6: Clear Form Confirmation & Reset');
    const clearFormBtn = page.locator('#btn-clear-form');
    await clearFormBtn.click();
    await page.waitForTimeout(300);
    await page.waitForTimeout(300);

    const clearedTitle = await titleInput.inputValue();
    const clearedBody = await bodyInput.inputValue();
    assert(clearedTitle === '', 'Form title input cleared after confirm');
    assert(clearedBody === '', 'Form body textarea cleared after confirm');

  } catch (error) {
    console.error('\n❌ Unexpected error in Write Tab test run:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n' + '='.repeat(55));
  console.log(`🏁 WRITE TAB TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(55) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runWriteTabDeepAudit();
