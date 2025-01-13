const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');

async function runLoginTest() {
  let driver;

  try {
    driver = await new Builder().forBrowser('chrome').build();

    await driver.get('http://localhost:3000/login');

    const usernameInput = await driver.findElement(By.id('username-input'));
    const passwordInput = await driver.findElement(By.id('password-input'));

    await usernameInput.sendKeys('Nolan');
    await passwordInput.sendKeys('##tarantino##');

    const submitButton = await driver.findElement(By.id('submit-login'));
    await submitButton.click();

    await driver.sleep(3000);

    const currentUrl = await driver.getCurrentUrl();
    console.log(`Current URL after submission: ${currentUrl}`);

    assert(
      currentUrl === 'http://localhost:3000/',
      'Login was successful'
    );

    const signOutButton = await driver.findElement(By.id('sign-out'));
    await signOutButton.click()

    await driver.sleep(3000);
    const urlAfterSignout = await driver.getCurrentUrl();
   

    assert(
      urlAfterSignout === 'http://localhost:3000/login',
      'Sign out was successful'
    );

    console.log('Test passed: Login and logout was successful');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// Run the test
runLoginTest();