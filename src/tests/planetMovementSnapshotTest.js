const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');

async function runSnapshotTest() {
  let driver;

  try {
    driver = await new Builder().forBrowser('chrome').build();

    await driver.get('http://localhost:3000');
    await driver.sleep(10000);

    const firstSnapshot = await driver.takeScreenshot();

    await driver.sleep(2000);

   
    const secondSnapshot = await driver.takeScreenshot();

    assert(
      firstSnapshot !== secondSnapshot,
      'Snapshots should be different after waiting for 2 seconds'
    );

    console.log('Test passed: Snapshots are different');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close the browser
    if (driver) {
      await driver.quit();
    }
  }
}

// Run the test
runSnapshotTest();
