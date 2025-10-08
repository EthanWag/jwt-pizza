import { test, expect } from 'playwright-test-coverage';
import basicInit from './mock';

test('login as admin and view dashboard', async ({ page }) => {
    // set up the page and get to the admin screen
    await basicInit(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('l');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'Admin' }).click();

    await expect(page.locator('h3')).toContainText('Franchises');
    await expect(page.locator('tbody').filter({ hasText: 'LotaPizza' })).toContainText('LotaPizza');
    await expect(page.locator('tbody').filter({ hasText: 'PizzaCorp' })).toContainText('PizzaCorp');
    await expect(page.locator('tbody').filter({ hasText: 'topSpot' })).toContainText('topSpot');

    // prices
    await expect(page.locator('tbody').filter({ hasText: 'Spanish Fork' })).toContainText('Spanish Fork');
    await expect(page.locator('tbody').filter({ hasText: 'Lehi' })).toContainText('Lehi');
});

test('closing a store', async ({ page }) => {
    // set up the page and get to the admin screen
    await basicInit(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('l');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'Admin' }).click();

    await page.getByRole('row', { name: 'Springville ₿ Close' }).getByRole('button').click();
    await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
    await expect(page.getByRole('main')).toContainText('Are you sure you want to close the LotaPizza store Springville ? This cannot be restored. All outstanding revenue will not be refunded.');

});

test('create a franchise', async ({ page }) => {
    await basicInit(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('l');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'Admin' }).click();
    
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await expect(page.getByRole('heading')).toContainText('Create franchise');
    await expect(page.locator('form')).toContainText('Want to create franchise?');
    await page.getByRole('textbox', { name: 'franchise name' }).fill('Super Pizza');
    await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
    await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('s@pwd.com');
});


// more tests here

// do one of the filter, that seems pretty cool

/*



*/