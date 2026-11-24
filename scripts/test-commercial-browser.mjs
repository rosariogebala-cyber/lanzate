import { chromium, firefox, webkit } from 'playwright';
import axe from 'axe-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = 'http://127.0.0.1:8765/';
const results = [];
for (const [engine, type] of Object.entries({chromium, firefox, webkit})) {
 const browser = await type.launch();
 try {
  for (const width of [320, 768, 1440]) {
   const context = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   try {
    await context.route('**/*', route => {
     const u = new URL(route.request().url());
     const staticHosts = ['fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net'];
     return u.origin === new URL(base).origin || (u.protocol === 'https:' && staticHosts.includes(u.hostname) && ['stylesheet','font'].includes(route.request().resourceType()) && route.request().method()==='GET') ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e=>errors.push(String(e)));
    for (const path of ['', 'terminos.html', 'privacidad.html']) {
     const row={engine,width,path:path||'index.html'};
     const start=errors.length;
     try {
      const response=await page.goto(base+path);
      assert.ok(response?.ok());
      await page.evaluate(()=>document.fonts.ready);
      if (!path) {
       const ctas=page.locator('[data-plans] .plan a.btn');
       await ctas.first().waitFor();
       assert.equal(await ctas.count(),3);
       for(const a of await ctas.all()){
        const href=await a.getAttribute('href'), label=(await a.innerText()).trim();
        assert.ok(href && (href.startsWith('mailto:') || href.startsWith('https://')));
        assert.equal(label,href.startsWith('mailto:')?'Solicitar contratación':'Pagar con Mercado Pago');
       }
       for(const a of await page.locator('[data-wa-link]').all()) assert.match(await a.getAttribute('href'),/^https:\/\/wa\.me\/\d+\?/);
       for(const a of await page.locator('[data-mail-link]').all()) assert.ok((await a.getAttribute('href')).startsWith('mailto:') && !(await a.getAttribute('href')).includes('example.com'));
       if(width===320){
        const toggle=page.locator('[data-nav-toggle]');
        await toggle.focus();
        await page.keyboard.press('Enter');
        assert.equal(await toggle.getAttribute('aria-expanded'),'true');
        await page.keyboard.press('Enter');
        assert.equal(await toggle.getAttribute('aria-expanded'),'false');
       }
      }
      await page.addScriptTag({content:axe.source});
      const a=await page.evaluate(()=>window.axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
      row.violations=a.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}));
      row.incomplete=a.incomplete.map(v=>v.id);
      row.overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
      row.errors=errors.slice(start);
      await page.keyboard.press('Tab');
      row.focus=await page.evaluate(()=>document.activeElement?.tagName);
     } catch(e){row.failure=String(e);}
     results.push(row);
    }
   } finally {await context.close();}
  }
 } finally {await browser.close();}
}
fs.writeFileSync('commercial-rc-report.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
assert.equal(results.length,27);
assert.ok(results.every(r=>!r.failure&&!r.errors.length&&!r.overflow&&!r.violations.length&&!['BODY','HTML'].includes(r.focus)));
