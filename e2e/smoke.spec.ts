import { expect, test } from "@playwright/test";

test("home loads and shows graph chrome", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("EthosMap").first()).toBeVisible();
  await expect(page.getByText("Law & ethics as a tech tree")).toBeVisible();
});

test("node detail page renders", async ({ page }) => {
  await page.goto("/node/axiom-life-has-value");
  await expect(
    page.getByRole("heading", { name: /Human life matters on its own/i })
  ).toBeVisible();
});

test("browse mode shows dependency tree", async ({ page }) => {
  await page.goto("/?mode=browse");
  await expect(page.getByRole("navigation", { name: "View mode" })).toBeVisible();
  await expect(
    page.getByRole("tree", { name: "Browse nodes by dependency tree" })
  ).toBeVisible();
  const firstTreeItem = page.getByRole("treeitem").first();
  await expect(firstTreeItem).toBeVisible();
});
