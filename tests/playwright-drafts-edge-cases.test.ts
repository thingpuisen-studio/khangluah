import { chromium } from 'playwright';

async function runDraftsTabEdgeCasesAudit() {
  console.log('🚀 Starting Deep-Dive E2E Test Suite: DRAFTS TAB EDGE CASES...\n');

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

    const draftsTabBtn = page.locator('button.nav-tab-btn[data-target="tab-drafts"]');
    const writeTabBtn = page.locator('button.nav-tab-btn[data-target="tab-write"]');
    const draftsBadge = page.locator('#drafts-count-badge');

    // =========================================================================
    // EDGE CASE 1: Corrupted / Malformed JSON in localStorage Recovery
    // =========================================================================
    console.log('\n🧪 Edge Case 1: Corrupted JSON Recovery in Local Storage');
    await page.evaluate(() => {
      localStorage.setItem('hk_cms_drafts', '{"invalid_malformed_json_array: [unclosed');
    });

    await draftsTabBtn.click();
    await page.waitForTimeout(300);

    const draftsSection = page.locator('#tab-drafts');
    assert(await draftsSection.isVisible(), 'Drafts tab panel is visible after malformed storage');

    const emptyNotice = page.locator('#no-drafts-msg');
    assert(
      await emptyNotice.isVisible(),
      'Corrupted storage safely falls back to empty drafts notice without runtime errors'
    );

    assert(
      (await draftsBadge.innerText()) === '(0)',
      'Drafts counter badge safely recovers to "(0)" when storage contains invalid JSON'
    );

    // =========================================================================
    // EDGE CASE 2: Clean Overwrite of Corrupted Storage by New Valid Draft
    // =========================================================================
    console.log('\n🧪 Edge Case 2: Clean Storage Overwrite After Corruption');
    await writeTabBtn.click();
    await page.waitForTimeout(200);

    await page.locator('#post-title').fill('First Valid Draft Post-Corruption');
    await page.locator('#post-slug').fill('first-valid-draft');
    await page.locator('#post-body').fill('Fresh markdown body recovery notes');
    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(300);

    const storedAfterSave = await page.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem('hk_cms_drafts') || '[]');
      } catch {
        return null;
      }
    });

    assert(
      Array.isArray(storedAfterSave) && storedAfterSave.length === 1,
      'Saving a draft successfully overwrites corrupted storage with a valid JSON array'
    );

    assert(
      (await draftsBadge.innerText()) === '(1)',
      'Drafts badge counter increments to "(1)" after storage healing'
    );

    // =========================================================================
    // EDGE CASE 3: Academic Research Paper Full-Schema Restoration
    // =========================================================================
    console.log('\n🧪 Edge Case 3: Academic Research Paper Cross-Schema Restoration');
    await page.locator('.type-pill-btn[data-type="academic_paper"]').click();
    await page.locator('#post-title').fill('Tone and Clusivity in Simte Pronominals');
    await page.locator('#post-slug').fill('tone-and-clusivity-simte');
    await page.locator('#paper-journal').fill('Linguistics of the Tibeto-Burman Area');
    await page.locator('#paper-volume').fill('Vol. 45, No. 1, pp. 24-58');
    await page.locator('#paper-issn').fill('0731-3500');
    await page.locator('#paper-doi').fill('10.1075/ltba.2026.0012');
    await page.locator('#paper-authors').fill('H. Kapginlian (NEHU, Shillong)');
    await page.locator('#paper-abstract').fill('Comprehensive analysis of tonal categories across dual and plural pronominal morphemes.');
    await page.locator('#post-body').fill('## 1. Grammatical Framework\n\nSimte pronouns display bipartite clusivity distinctions.');
    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(300);

    // Switch active Write form to Poem to test cross-schema reset
    await page.locator('.type-pill-btn[data-type="poem"]').click();
    await page.waitForTimeout(200);
    assert(
      await page.locator('#section-paper-fields').isHidden(),
      'Paper fields hidden when switching to Poem on editor'
    );

    // Go to Drafts tab and load the Academic Paper draft
    await draftsTabBtn.click();
    await page.waitForTimeout(300);

    const paperDraftCard = page.locator('#drafts-container > div:has-text("Tone and Clusivity in Simte Pronominals")');
    assert(await paperDraftCard.isVisible(), 'Academic paper draft card displayed in list');

    await paperDraftCard.locator('.btn-load-draft').click();
    await page.waitForTimeout(400);

    // Verify it automatically returned to Write tab and rehydrated the schema
    assert(await page.locator('#tab-write').isVisible(), 'Automatically transitioned to Write tab on Load Draft');
    assert(
      await page.locator('.type-pill-btn[data-type="academic_paper"]').getAttribute('class').then(c => c?.includes('bg-[var(--text-primary)]')),
      'Active type pill restored to academic_paper'
    );
    assert(
      await page.locator('#section-paper-fields').isVisible(),
      'Academic research fields section is revealed'
    );
    assert(
      (await page.locator('#paper-journal').inputValue()) === 'Linguistics of the Tibeto-Burman Area',
      'Restored academic journal input'
    );
    assert(
      (await page.locator('#paper-volume').inputValue()) === 'Vol. 45, No. 1, pp. 24-58',
      'Restored academic volume input'
    );
    assert(
      (await page.locator('#paper-issn').inputValue()) === '0731-3500',
      'Restored academic ISSN input'
    );
    assert(
      (await page.locator('#paper-doi').inputValue()) === '10.1075/ltba.2026.0012',
      'Restored academic DOI input'
    );
    assert(
      (await page.locator('#paper-authors').inputValue()) === 'H. Kapginlian (NEHU, Shillong)',
      'Restored academic authors input'
    );
    assert(
      (await page.locator('#paper-abstract').inputValue()).includes('Comprehensive analysis of tonal categories'),
      'Restored academic abstract input'
    );

    // =========================================================================
    // EDGE CASE 4: Poem Schema Restoration with Featured Couplet
    // =========================================================================
    console.log('\n🧪 Edge Case 4: Poem Schema Restoration with Couplet & Reflection');
    await page.locator('.type-pill-btn[data-type="poem"]').click();
    await page.locator('#post-title').fill('Solitary Ridgeline at Dusk');
    await page.locator('#post-slug').fill('solitary-ridgeline-at-dusk');
    await page.locator('#poem-couplet-input').fill('Across the quiet pines the evening descends,\nWhere memory of ancient song transcends.');
    await page.locator('#poem-reflection-input').fill('Meditations on pastoral silence in Churachandpur.');
    await page.locator('#post-body').fill('Shadows stretch along the slope  \nCarrying an ancient hope');
    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(300);

    // Switch to Essay
    await page.locator('.type-pill-btn[data-type="essay"]').click();
    await page.waitForTimeout(200);

    // Go to Drafts and load Poem
    await draftsTabBtn.click();
    await page.waitForTimeout(300);
    const poemDraftCard = page.locator('#drafts-container > div:has-text("Solitary Ridgeline at Dusk")');
    await poemDraftCard.locator('.btn-load-draft').click();
    await page.waitForTimeout(400);

    assert(
      await page.locator('.type-pill-btn[data-type="poem"]').getAttribute('class').then(c => c?.includes('bg-[var(--text-primary)]')),
      'Type pill restored to Poem schema'
    );
    assert(
      (await page.locator('#poem-couplet-input').inputValue()).includes('Across the quiet pines'),
      'Restored poem featured couplet input'
    );
    assert(
      (await page.locator('#poem-reflection-input').inputValue()).includes('Meditations on pastoral silence'),
      'Restored poem reflection context input'
    );

    // =========================================================================
    // EDGE CASE 5: Essay Schema Restoration with Pull-Quote
    // =========================================================================
    console.log('\n🧪 Edge Case 5: Essay Schema Restoration with Pull-Quote');
    await page.locator('.type-pill-btn[data-type="essay"]').click();
    await page.locator('#post-title').fill('Documenting Orality in the Highlands');
    await page.locator('#post-slug').fill('documenting-orality-highlands');
    await page.locator('#essay-pullquote-input').fill('Language lives in the telling, not the archive.');
    await page.locator('#post-body').fill('Oral narratives encapsulate ecological taxonomy.');
    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(300);

    // Switch to Poem
    await page.locator('.type-pill-btn[data-type="poem"]').click();
    await page.waitForTimeout(200);

    // Go to Drafts and load Essay
    await draftsTabBtn.click();
    await page.waitForTimeout(300);
    const essayDraftCard = page.locator('#drafts-container > div:has-text("Documenting Orality in the Highlands")');
    await essayDraftCard.locator('.btn-load-draft').click();
    await page.waitForTimeout(400);

    assert(
      await page.locator('.type-pill-btn[data-type="essay"]').getAttribute('class').then(c => c?.includes('bg-[var(--text-primary)]')),
      'Type pill restored to Essay schema'
    );
    assert(
      (await page.locator('#essay-pullquote-input').inputValue()) === 'Language lives in the telling, not the archive.',
      'Restored essay pull-quote input'
    );

    // =========================================================================
    // EDGE CASE 6: Draft Overwrite In-Place by Slug (No Duplicate Pollution)
    // =========================================================================
    console.log('\n🧪 Edge Case 6: In-Place Draft Updating (No Ghost Duplicates)');
    // Edit the currently loaded Essay draft
    await page.locator('#post-title').fill('Documenting Orality in the Highlands (Revised)');
    await page.locator('#post-body').fill('Substantially expanded treatise on indigenous taxonomy.');
    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(300);

    // Check drafts list
    await draftsTabBtn.click();
    await page.waitForTimeout(300);

    const matchingSlugDrafts = await page.evaluate(() => {
      const d = JSON.parse(localStorage.getItem('hk_cms_drafts') || '[]');
      return d.filter((x: any) => x.slug === 'documenting-orality-highlands');
    });

    assert(
      matchingSlugDrafts.length === 1,
      'Editing and saving an existing draft updates in place (exactly 1 copy stored)'
    );
    assert(
      matchingSlugDrafts[0].title === 'Documenting Orality in the Highlands (Revised)' &&
      matchingSlugDrafts[0].body.includes('Substantially expanded treatise'),
      'Updated draft contains latest title and body values'
    );

    // =========================================================================
    // EDGE CASE 7: Multi-Draft Sequential Deletion Down to Zero State
    // =========================================================================
    console.log('\n🧪 Edge Case 7: Sequential Deletion Lifecycle & Zero State');
    const initialCount = await page.locator('#drafts-container > div').count();
    assert(initialCount >= 3, `Multiple drafts present before deletion sequence (${initialCount} drafts)`);

    // Delete one draft
    const firstDraftDeleteBtn = page.locator('#drafts-container > div').first().locator('.btn-del-draft');
    await firstDraftDeleteBtn.click();
    await page.waitForTimeout(300);

    const postDelCount = await page.locator('#drafts-container > div').count();
    assert(postDelCount === initialCount - 1, `Drafts count decremented by 1 (${postDelCount} drafts remain)`);

    // Delete all remaining drafts in a loop
    while (await page.locator('#drafts-container .btn-del-draft').count() > 0) {
      await page.locator('#drafts-container .btn-del-draft').first().click();
      await page.waitForTimeout(200);
    }

    assert(
      (await draftsBadge.innerText()) === '(0)',
      'Drafts badge counter decrements down to "(0)" when all drafts are deleted'
    );

    assert(
      await page.locator('#no-drafts-msg').isVisible(),
      'Empty state message (#no-drafts-msg) is restored cleanly when drafts hit 0'
    );

    // =========================================================================
    // EDGE CASE 8: Legacy / Incomplete Draft Object Graceful Handling
    // =========================================================================
    console.log('\n🧪 Edge Case 8: Incomplete Legacy Draft Graceful Defaults');
    await page.evaluate(() => {
      const legacyDraft = [{
        id: Date.now(),
        savedAt: '12:00 PM',
        title: 'Legacy Incomplete Draft',
        slug: 'legacy-draft-missing-fields'
        // Missing tags, readingTime, category, type, themeClass, coverImage, etc.
      }];
      localStorage.setItem('hk_cms_drafts', JSON.stringify(legacyDraft));
    });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await mainUi.waitFor({ state: 'visible', timeout: 5000 });

    await draftsTabBtn.click();
    await page.waitForTimeout(300);

    const legacyCard = page.locator('#drafts-container > div:has-text("Legacy Incomplete Draft")');
    assert(await legacyCard.isVisible(), 'Legacy draft with missing fields rendered without crash');

    await legacyCard.locator('.btn-load-draft').click();
    await page.waitForTimeout(300);

    assert(
      (await page.locator('#post-title').inputValue()) === 'Legacy Incomplete Draft',
      'Legacy draft title loaded successfully'
    );
    assert(
      (await page.locator('#post-reading-time').inputValue()) === '3 min read',
      'Missing readingTime falls back cleanly to default "3 min read"'
    );
    assert(
      (await page.locator('#post-category').inputValue()) === 'Poetry',
      'Missing category falls back cleanly to default'
    );

    // =========================================================================
    // EDGE CASE 9: Unicode, Diacritics & Formatting Preservation
    // =========================================================================
    console.log('\n🧪 Edge Case 9: Unicode & Diacritic Preservation Across Draft Storage');
    const unicodeTitle = '“Simte Nam: Thawnthu & Pupa Dan (ɛ, ɔ, ŋ)”';
    const unicodeBody = 'Linguistic analysis of glottal stop /ʔ/ and nasal /ŋ/.\n\nStanza with quotes: “Thawnthu”.';

    await page.locator('#post-title').fill(unicodeTitle);
    await page.locator('#post-slug').fill('simte-nam-thawnthu-pupa-dan');
    await page.locator('#post-body').fill(unicodeBody);
    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(300);

    await draftsTabBtn.click();
    await page.waitForTimeout(300);

    const unicodeDraftCard = page.locator('#drafts-container > div:has-text("Simte Nam: Thawnthu")');
    assert(await unicodeDraftCard.isVisible(), 'Unicode draft card displayed with complex characters');

    await unicodeDraftCard.locator('.btn-load-draft').click();
    await page.waitForTimeout(300);

    assert(
      (await page.locator('#post-title').inputValue()) === unicodeTitle,
      'Unicode title with smart quotes, IPA (ɛ, ɔ, ŋ), and ampersands preserved exactly'
    );
    assert(
      (await page.locator('#post-body').inputValue()) === unicodeBody,
      'Unicode body with glottal stops /ʔ/ and quotation marks preserved without character corruption'
    );

    // =========================================================================
    // EDGE CASE 10: High-Volume Text Retention (40,000+ characters)
    // =========================================================================
    console.log('\n🧪 Edge Case 10: Massive Volume Text Retention in Draft');
    const largeBodyText = 'Sample fieldwork linguistic analysis paragraph with examples and glosses.\n\n'.repeat(600);
    await page.locator('#post-title').fill('Massive Corpus Monograph Draft');
    await page.locator('#post-slug').fill('massive-corpus-monograph');
    await page.locator('#post-body').fill(largeBodyText);
    await page.locator('#btn-save-draft').click();
    await page.waitForTimeout(400);

    await draftsTabBtn.click();
    await page.waitForTimeout(300);

    const massiveDraftCard = page.locator('#drafts-container > div:has-text("Massive Corpus Monograph Draft")');
    await massiveDraftCard.locator('.btn-load-draft').click();
    await page.waitForTimeout(400);

    const reloadedBody = await page.locator('#post-body').inputValue();
    assert(
      reloadedBody.length >= 40000 && reloadedBody === largeBodyText,
      `High-volume text (40,000+ chars) restored with byte-for-byte fidelity (got ${reloadedBody.length} chars)`
    );

  } catch (error) {
    console.error('💥 Drafts Edge Case Test execution threw an uncaught error:', error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`📊 DRAFTS TAB EDGE CASES AUDIT: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runDraftsTabEdgeCasesAudit();
