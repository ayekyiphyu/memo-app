# Test info

- Name: responsive design
- Location: /home/akphyu/dashboard-app/tests/index.spec.ts:14:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at /home/akphyu/dashboard-app/tests/index.spec.ts:17:14
```

# Test source

```ts
   1 | import { test, expect } from "@playwright/test";
   2 |
   3 | test("homepage loads correctly", async ({ page }) => {
   4 |   await page.goto("/");
   5 |
   6 |   // Check if Next.js app loaded
   7 |   await expect(page).toHaveTitle(/Your App Name/);
   8 |
   9 |   // Test navigation
  10 |   await page.getByRole("link", { name: "About" }).click();
  11 |   await expect(page).toHaveURL("/about");
  12 | });
  13 |
  14 | test("responsive design", async ({ page }) => {
  15 |   // Test mobile view
  16 |   await page.setViewportSize({ width: 375, height: 667 });
> 17 |   await page.goto("/");
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  18 |
  19 |   // Check mobile menu
  20 |   await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
  21 | });
  22 |
```