import { expect, test } from "@playwright/test";

test.describe("Smoke Tests", () => {
	test("homepage loads without errors", async ({ page }) => {
		const errors: string[] = [];
		page.on("console", (msg) => {
			if (msg.type() === "error") errors.push(msg.text());
		});

		await page.goto("/");
		await expect(page.locator("body")).toBeVisible();
		expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
	});

	test("algorithm selector is visible", async ({ page }) => {
		await page.goto("/");

		// Should have algorithm selection UI
		await expect(
			page.locator("select, [role='listbox'], [data-testid='algorithm-select']").first(),
		).toBeVisible();
	});

	test("visualization canvas/area present", async ({ page }) => {
		await page.goto("/");

		// Should have visualization area
		await expect(page.locator("canvas, svg, [data-testid='visualization']").first()).toBeVisible();
	});

	test("responsive layout", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto("/");
		await expect(page.locator("body")).toBeVisible();

		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator("body")).toBeVisible();
	});
});
