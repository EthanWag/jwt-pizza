import { test, expect } from 'playwright-test-coverage';
import basicInit from './mock';

test('franchisee page signed out', async ({ page }) => {

    await basicInit(page);
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await page.getByRole('heading', { name: 'Unleash Your Potential' }).click();
    await expect(page.getByRole('main')).toContainText('Unleash Your Potential');
    await page.getByRole('main').locator('img').click();

});

test('franchisee page as franchisee', async ({ page }) => {

    await basicInit(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('f');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

    await page.getByText('pizzaPocket').click();
    await expect(page.locator('tbody')).toContainText('SLC');
    await expect(page.locator('tbody')).toContainText('0.12 ₿');
    await expect(page.locator('tbody')).toContainText('Chicago');

});

test('franchisee makes store', async ({ page }) => {

    // Logging in
    await basicInit(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('f');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

    // Making a store
    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByRole('textbox', { name: 'store name' }).click();
    await page.getByRole('textbox', { name: 'store name' }).fill('New York');
    await page.getByRole('button', { name: 'Create' }).click();
});
// maybe one other test after I finish these two

test('closing a store', async ({ page }) => {
    await basicInit(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('f');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

    await page.getByRole('row', { name: 'SLC 0.12 ₿ Close' }).getByRole('button').click();
});