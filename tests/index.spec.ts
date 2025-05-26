import { test, expect } from "@playwright/test";

test("homepage loads correctly", async ({ page }) => {
  await page.goto("/login");

  // Check if Next.js app loaded
  await expect(page).toHaveTitle(/Your App Name/);

  // Test navigation
  await page.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL("/about");
});

test("responsive design", async ({ page }) => {
  // Test mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  // Check mobile menu
  await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
});
