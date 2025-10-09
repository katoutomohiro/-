import { chromium } from 'playwright';
import net from 'node:net';

async function waitForServer(url, retries = 30, delay = 1000) {
  let parsed
  try {
    parsed = new URL(url)
  } catch (e) {
    console.error('waitForServer: invalid URL', url)
    return false
  }
  const host = parsed.hostname
  const port = parsed.port ? Number(parsed.port) : (parsed.protocol === 'https:' ? 443 : 80)

  for (let i = 0; i < retries; i++) {
    const ok = await new Promise((resolve) => {
      const socket = net.createConnection({ host, port, timeout: 1000 }, () => {
        socket.destroy()
        resolve(true)
      })
      socket.on('error', (err) => {
        // console.log('waitForServer: socket error', err && err.message)
        resolve(false)
      })
      socket.on('timeout', () => {
        socket.destroy()
        resolve(false)
      })
    })
    console.log('waitForServer: attempt', i, 'host=', host, 'port=', port, 'ok=', ok)
    if (ok) return true
    await new Promise((r) => setTimeout(r, delay))
  }
  return false
}

(async ()=>{
  const URL = process.env.CHECK_URL || 'http://localhost:3000'
  const ok = await waitForServer(URL, 40, 1000)
  if (!ok) {
    console.error('SERVER_NOT_READY', URL)
    process.exit(2)
  }
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const v0Messages = [];
  page.on('console', msg => {
    try {
      const text = msg.text();
      if (typeof text === 'string' && text.startsWith('[v0]')) v0Messages.push(text);
      console.log('PAGE_CONSOLE:', text);
    } catch (e) {}
  });

    try {
    await page.goto(URL, { waitUntil: 'networkidle' });
  } catch (e) {
    console.error('FAILED_TO_LOAD', e.message || e);
    await browser.close();
    process.exit(2);
  }

  // Try to click the dashboard category labeled 発作記録 if present
  try {
    const seizure = page.locator('text=発作記録').first();
    const count = await seizure.count();
    if (count > 0) {
      for (let i = 0; i < 5; i++) {
        await seizure.click({ force: true });
        await page.waitForTimeout(200);
      }
    } else {
      const btn = page.locator('div[role="button"]').first();
      for (let i = 0; i < 5; i++) {
        await btn.click({ force: true });
        await page.waitForTimeout(200);
      }
    }

    await page.waitForTimeout(1000);

    const hasParticles = await page.evaluate(() => !!document.querySelector('.v0-particle'));
    let formVisible = false;
    try {
      formVisible = await page.locator('text=発作記録').isVisible();
    } catch (e) {
      formVisible = false;
    }

    console.log('V0_COUNT', v0Messages.length);
    console.log('HAS_PARTICLES', hasParticles);
    console.log('FORM_VISIBLE', formVisible);

    await browser.close();
    // exit code 0 = success
    process.exit(0);
  } catch (e) {
    console.error('TEST_ERROR', e.message || e);
    await browser.close();
    process.exit(3);
  }
})();
