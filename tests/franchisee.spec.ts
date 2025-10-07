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

    
});

/*
test('yada', async ({ page }) => {


    await page.goto('http://localhost:5174/');
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();


});
*/
// maybe one other test after I finish these two