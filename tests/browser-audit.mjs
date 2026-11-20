// Browser QA: npm install --no-save playwright @axe-core/playwright
// npx playwright install chromium
// Run a local server first: python3 -m http.server 8000
// Then: node tests/browser-audit.mjs
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.QA_URL || 'http://127.0.0.1:8000';
const widths = [320, 375, 768, 1024, 1440];
const browser = await chromium.launch({ headless: true });
const findings = [];
await mkdir('qa-reports', { recursive: true });
try {
  for (const width of widths) {
    // axe-core/playwright opens an auxiliary page in the same browser context.
    // A context created by browser.newPage() does not allow that operation.
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto(origin, { waitUntil: 'networkidle' });
    if (!response?.ok()) findings.push({ width, type: 'http', status: response?.status() });
    const overflow = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth
    }));
    if (overflow.documentWidth > overflow.viewportWidth + 1) {
      findings.push({ width, type: 'horizontal-overflow', ...overflow });
    }
    await page.screenshot({ path: `qa-reports/home-${width}.png`, fullPage: true });
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    findings.push(...axe.violations.map(v => ({
      width, type: 'axe', id: v.id, impact: v.impact,
      description: v.description,
      nodes: v.nodes.map(n => ({ target: n.target, failureSummary: n.failureSummary }))
    })));
    findings.push(...errors.map(message => ({ width, type: 'javascript', message })));
    if (width === 375) {
      const toggle = page.locator('[data-nav-toggle]');
      await toggle.click();
      const menu = page.locator('[data-nav]');
      const openState = await toggle.getAttribute('aria-expanded');
      const openClass = await menu.evaluate(el => el.classList.contains('is-open'));
      if (openState !== 'true' || !openClass) {
        findings.push({ width, type: 'navigation', message: 'Menu did not open', ariaExpanded: openState, menuOpenClass: openClass });
      } else {
        await page.keyboard.press('Escape');
        const closedState = await toggle.getAttribute('aria-expanded');
        const closeClass = await menu.evaluate(el => el.classList.contains('is-open'));
        if (closedState !== 'false' || closeClass) {
          findings.push({ width, type: 'navigation', message: 'Escape did not close menu', ariaExpanded: closedState, menuOpenClass: closeClass });
        }
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile('qa-reports/results.json', JSON.stringify({ origin, findings }, null, 2));
console.log(`QA browser audit: ${findings.length} findings. See qa-reports/results.json`);
if (findings.length) process.exitCode = 1;
