import { expect, test } from "@playwright/test";
import { resetITContent } from "./lib/reset";

const SEARCH_FIELD = "Search keys and translations";

test.beforeEach(async ({ page, baseURL }) => {
    await resetITContent(baseURL);
    await page.goto("/tools/translation/dictionaries/message-entries.html/content/dictionaries/fruit/i18n");
});

test("Search entries by key", async ({ page }) => {
    await page.getByPlaceholder(SEARCH_FIELD).fill("berry");
    await page.getByPlaceholder(SEARCH_FIELD).press("Enter");
    await page.waitForURL(/\?q=berry$/);

    await expect(page.getByPlaceholder(SEARCH_FIELD)).toHaveValue("berry");
    await expect(page.getByRole("row", { name: "blackberry Blackberry Braam" })).toBeVisible();
    await expect(page.getByRole("row", { name: "blueberry Blueberry Blauwe bes" })).toBeVisible();
    await expect(page.getByRole("row", { name: "raspberry Raspberry Framboos" })).toBeVisible();
    await expect(page.getByRole("row", { name: "strawberry Strawberry Aardbei" })).toBeVisible();
    await expect(page.getByRole("row", { name: "apple Apple Appel" })).toHaveCount(0);
});

test("Search entries by translation", async ({ page }) => {
    // "appel" is only contained in Dutch translations
    await page.getByPlaceholder(SEARCH_FIELD).fill("appel");
    await page.getByPlaceholder(SEARCH_FIELD).press("Enter");
    await page.waitForURL(/\?q=appel$/);

    await expect(page.getByRole("row", { name: "apple Apple Appel" })).toBeVisible();
    await expect(page.getByRole("row", { name: "orange Orange Sinaasappel" })).toBeVisible();
    await expect(page.getByRole("row", { name: "pomegranate Pomegranate Granaatappel" })).toBeVisible();
    await expect(page.getByRole("row", { name: "pineapple Pineapple Ananas" })).toHaveCount(0);
});

test("Clear search", async ({ page }) => {
    await page.goto("/tools/translation/dictionaries/message-entries.html/content/dictionaries/fruit/i18n?q=berry");
    await expect(page.getByRole("row", { name: "apple Apple Appel" })).toHaveCount(0);

    await page.getByPlaceholder(SEARCH_FIELD).fill("");
    await page.getByPlaceholder(SEARCH_FIELD).press("Enter");
    await page.waitForURL((url) => url.search === "");

    await expect(page.getByRole("row", { name: "apple Apple Appel" })).toBeVisible();
});
