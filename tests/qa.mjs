const qaBase = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const root = new URL("../qa/", import.meta.url);
await mkdir(root, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const checks = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
const ok = (name, value) => {
  if (!value) throw new Error(name);
  checks.push(name);
};
await page.goto(qaBase);
await page.locator("h1").waitFor();
await page.waitForTimeout(1300);
ok(
  "Hero image loads",
  await page
    .locator(".hero-photo img")
    .evaluate((i) => i.complete && i.naturalWidth > 0),
);
await page.screenshot({ path: new URL("desktop.png", root).pathname.slice(1) });
await page.locator(".hero-secondary").click();
await page.getByRole("button", { name: "ВЗЯТЬ ПИНЦЕТ →" }).click();
const first = page.getByRole("button", {
  name: "Удалить волос 1",
  exact: true,
});
await first.scrollIntoViewIfNeeded();
const b = await first.boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.mouse.down();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2 - 45, { steps: 7 });
await page.mouse.up();
ok("Mouse drag removes one hair", await first.isDisabled());
for (let i = 2; i <= 25; i++) {
  const hair = page.getByRole("button", {
    name: `Удалить волос ${i}`,
    exact: true,
  });
  await hair.focus();
  await page.keyboard.press("Enter");
}
await page.getByRole("button", { name: "TRY LASER →", exact: true }).waitFor();
ok("All 25 hairs and completion transition", true);
await page.getByRole("button", { name: "TRY LASER →", exact: true }).click();
await page.getByRole("button", { name: "ПОПРОБОВАТЬ →", exact: true }).click();
let pulseCount = 0;
for (let i = 1; i <= 64; i++) {
  const hair = page.getByRole("button", {
    name: `Обработать волос ${i}`,
    exact: true,
  });
  if (!(await hair.isVisible())) break;
  if (await hair.isDisabled()) continue;
  await hair.focus();
  await page.keyboard.press("Enter");
  pulseCount++;
  await page.waitForTimeout(200);
}
await page.getByText("SESSION COMPLETE.", { exact: true }).waitFor();
ok("Laser treats grouped hairs, full completion", pulseCount < 20);
await page.screenshot({
  path: new URL("experience.png", root).pathname.slice(1),
});
await page.getByRole("button", { name: "RESTART", exact: true }).click();
await page.getByRole("button", { name: "SKIP ↗", exact: true }).click();
await page
  .getByRole("button", { name: "ЗАПИСАТЬСЯ НА ЛАЗЕР ↗", exact: true })
  .first()
  .click();
const dialog = page.locator("dialog");
await dialog.waitFor({ state: "visible" });
await page.getByLabel("Зона", { exact: true }).selectOption("legs");
await dialog.getByRole("button", { name: "ПРОДОЛЖИТЬ →" }).click();
await dialog.getByRole("button", { name: "КОМПЛЕКС", exact: true }).click();
await page.getByLabel("Комплекс", { exact: true }).selectOption("set-2");
await dialog.getByRole("button", { name: "ПРОДОЛЖИТЬ →" }).click();
await dialog.getByRole("button", { name: "ПРОДОЛЖИТЬ →" }).click();
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 3);
await page
  .getByLabel("Предпочтительная дата")
  .fill(futureDate.toISOString().slice(0, 10));
await dialog.getByRole("button", { name: "ПРОДОЛЖИТЬ →" }).click();
await dialog.getByRole("button", { name: "13:00" }).click();
await dialog.getByRole("button", { name: "ПРОДОЛЖИТЬ →" }).click();
await page.getByLabel("Имя", { exact: true }).fill("Тестовый клиент");
await dialog.getByRole("button", { name: "ПРОДОЛЖИТЬ →" }).click();
await page.getByLabel("Телефон", { exact: true }).fill("123");
ok(
  "Invalid phone blocks next step",
  await dialog.getByRole("button", { name: "ПРОДОЛЖИТЬ →" }).isDisabled(),
);
await page.getByLabel("Телефон", { exact: true }).fill("+7 700 000 00 00");
await dialog.getByRole("button", { name: "ПРОДОЛЖИТЬ →" }).click();
await dialog.getByRole("button", { name: "ПОДТВЕРДИТЬ ДЕМО ↗" }).click();
await page.getByText("Демонстрационная запись создана.").waitFor();
ok("All 8 booking steps and honest mock confirmation", true);
await dialog.getByRole("button", { name: "ГОТОВО ↗" }).click();
await page.locator("#zones").scrollIntoViewIfNeeded();
await page
  .locator(".zone-list")
  .getByRole("button", { name: "Голени", exact: false })
  .click();
ok(
  "Zone selector updates details",
  (await page.locator(".zone-detail h3").innerText()) === "Голени",
);
await page.getByRole("tab", { name: "НОГИ", exact: true }).click();
ok(
  "Price category filters 3 leg zones",
  (await page.locator(".price-row").count()) === 3,
);
await page.locator(".faq summary").first().click();
ok(
  "FAQ opens",
  (await page.locator(".faq details").first().getAttribute("open")) !== null,
);
for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(80);
  ok(
    `No horizontal overflow at ${width}px`,
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  );
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(qaBase);
await page.waitForTimeout(500);
await page.screenshot({ path: new URL("mobile.png", root).pathname.slice(1) });
await page.getByRole("button", { name: "Меню", exact: true }).click();
ok("Mobile menu opens", await page.locator("nav.open").isVisible());
await page
  .locator("nav")
  .getByRole("link", { name: "ЦЕНЫ", exact: true })
  .click();
ok(
  "Mobile menu closes after navigation",
  (await page.locator("nav.open").count()) === 0,
);
await page.emulateMedia({ reducedMotion: "reduce" });
ok(
  "Reduced motion disables smooth scroll",
  await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior === "auto",
  ),
);
const touch = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
const tp = await touch.newPage();
await tp.goto(qaBase);
await tp.locator(".hero-secondary").tap();
await tp.waitForTimeout(700);
await tp.getByRole("button", { name: "ВЗЯТЬ ПИНЦЕТ →" }).tap();
await tp.locator(".skin-surface").scrollIntoViewIfNeeded();
await tp.waitForTimeout(700);
const hb = await tp
  .getByRole("button", { name: "Удалить волос 1", exact: true })
  .boundingBox();
const cdp = await touch.newCDPSession(tp);
await cdp.send("Input.dispatchTouchEvent", {
  type: "touchStart",
  touchPoints: [{ x: hb.x + hb.width / 2, y: hb.y + hb.height / 2 }],
});
await cdp.send("Input.dispatchTouchEvent", {
  type: "touchMove",
  touchPoints: [{ x: hb.x + hb.width / 2, y: hb.y + hb.height / 2 - 42 }],
});
await cdp.send("Input.dispatchTouchEvent", {
  type: "touchEnd",
  touchPoints: [],
});
ok(
  "Touch drag removes hair",
  await tp
    .getByRole("button", { name: "Удалить волос 1", exact: true })
    .isDisabled(),
);
await tp
  .getByRole("button", { name: "УЖЕ НАДОЕЛО? TRY LASER →" })
  .scrollIntoViewIfNeeded();
await tp.waitForTimeout(700);
await tp.getByRole("button", { name: "УЖЕ НАДОЕЛО? TRY LASER →" }).tap();
await tp.waitForTimeout(500);
await tp.screenshot({
  path: new URL("touch-transition.png", root).pathname.slice(1),
});
await tp.getByRole("button", { name: "ПОПРОБОВАТЬ →", exact: true }).tap();
await tp.locator(".skin-surface").tap({ position: { x: 80, y: 90 } });
await tp.waitForTimeout(80);
const skin = tp.locator(".skin-surface");
const skinBox = await skin.boundingBox();
const toolPosition = () => skin.locator(".tool").evaluate((tool) => ({
  x: parseFloat(tool.style.left), y: parseFloat(tool.style.top),
}));
const tapPosition = await toolPosition();
ok("Touch tap moves laser to pulse location",
  Math.abs(tapPosition.x - 80 / skinBox.width * 100) < 1 &&
  Math.abs(tapPosition.y - 90 / skinBox.height * 100) < 1);
ok(
  "Touch laser pulse treats hairs",
  (await tp.locator(".hair.removed").count()) > 1,
);
await tp.waitForTimeout(220);
const start = { x: skinBox.x + skinBox.width * 0.75, y: skinBox.y + skinBox.height * 0.65 };
const end = { x: skinBox.x + skinBox.width * 0.3, y: skinBox.y + skinBox.height * 0.8 };
await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [end] });
await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
await tp.waitForTimeout(80);
const dragPosition = await toolPosition();
ok("Touch drag keeps laser aligned with finger",
  Math.abs(dragPosition.x - 30) < 1 && Math.abs(dragPosition.y - 80) < 1);
await touch.close();
// Exercise the Safari-specific input path; desktop emulation cannot test hardware haptics.
const ios = await browser.newContext({
  viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
});
await ios.addInitScript(() => {
  delete Navigator.prototype.vibrate;
  Object.defineProperty(HTMLInputElement.prototype, "switch", { value: false });
});
const ip = await ios.newPage();
await ip.goto(qaBase);
await ip.locator(".hero-secondary").tap();
await ip.waitForTimeout(700);
await ip.getByRole("button", { name: "СРАЗУ ПОПРОБОВАТЬ ЛАЗЕР ↗" }).scrollIntoViewIfNeeded();
await ip.waitForTimeout(700);
await ip.getByRole("button", { name: "СРАЗУ ПОПРОБОВАТЬ ЛАЗЕР ↗" }).tap();
await ip.waitForTimeout(500);
await ip.getByRole("button", { name: "ПОПРОБОВАТЬ →", exact: true }).tap();
const nativeSwitch = ip.locator(".ios-laser-haptic");
await nativeSwitch.tap({ position: { x: 80, y: 90 } });
await ip.waitForTimeout(100);
ok("iPhone direct tap toggles native haptic switch", await nativeSwitch.isChecked());
ok("iPhone haptic input still treats hair groups", await ip.locator(".hair.removed").count() > 1);
const ib = await ip.locator(".skin-surface").boundingBox();
const it = await ip.locator(".tool").evaluate((tool) => ({ x: parseFloat(tool.style.left), y: parseFloat(tool.style.top) }));
ok("iPhone haptic input keeps laser aligned with tap",
  Math.abs(it.x - 80 / ib.width * 100) < 1 && Math.abs(it.y - 90 / ib.height * 100) < 1);
await ios.close();
for (const route of ["about", "laser", "zones", "prices", "contacts"]) {
  const response = await page.goto(qaBase + "/" + route + "/");
  ok(`Route /${route}/ works`, response.status() === 200);
}
console.log(JSON.stringify({ errors }));
ok("No browser errors", errors.length === 0);
await writeFile(
  new URL("report.json", root),
  JSON.stringify(
    { passed: checks.length, checks, errors, pulseCount },
    null,
    2,
  ),
);
console.log(JSON.stringify({ passed: checks.length, errors, pulseCount }));
await browser.close();
