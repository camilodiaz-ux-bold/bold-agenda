# Verify skill — cobro-productos-servicios

## Launch
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev -- --host
```
Server: http://localhost:5173/cobro-productos-servicios/

## Playwright (browser-driven)
Playwright is NOT in project deps. Install in scratchpad first:
```bash
cd $SCRATCHPAD && npm init -y && npm install playwright
npx playwright install chromium
```

Then write a `.mjs` script in $SCRATCHPAD and run with:
```bash
cd $SCRATCHPAD && node --input-type=module < verify.mjs
```

## Key flows to drive
1. home-payments → click "Caja registradora" button → home-productos
2. home-productos → click "Crear producto o servicio" → create-product
3. Fill name + price → "Crear producto" button → success sheet (first product shows confetti)
4. "Continuar" → tus-productos → "Cobrar con mis productos" → cobro

## Selector tips
- "Caja registradora" button: `page.locator('button').filter({ hasText: /Caja/ }).click()`
- Check no mockup shell: `document.querySelector('[class*="e5e7eb"]')` should be null
- Check no fake status bar: `document.body.innerText.includes('Carrier')` should be false

## Useful DOM checks
```js
const root = document.getElementById('root');
const app = root.firstElementChild;
// Should be: "fixed inset-0 overflow-hidden bg-white"
app.className
// Should fill viewport exactly:
app.getBoundingClientRect() // {x:0,y:0,width:vw,height:vh}
```
