const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

async function runTest() {
  let driver;

  try {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://localhost:3000');
    await driver.sleep(10000);
 
    const mercury = await driver.findElement(By.xpath('//*[@id="planet-list"]//div[text()="Mercury"]'));
    await mercury.click();

    await driver.wait(until.elementLocated(By.id('planet-popup')), 5000);

    const tableRows = await driver.findElements(By.css('div#planet-popup tbody tr'));

    const densityRowCells = await tableRows[0].findElements(By.css('td'));
    const volumeRowCells = await tableRows[1].findElements(By.css('td'));

    const densityValue = await densityRowCells[1].getText();
    const volumeValue = await volumeRowCells[1].getText();

    assert(densityValue == 5.427)
    assert(volumeValue == 6.085)

    await driver.sleep(5000);

    const closeButton = await driver.findElement(By.css('div#planet-popup button'));
    assert(closeButton !== null, 'Close button should be present');
    await closeButton.click()

    await driver.sleep(500);

    const popupElements = await driver.findElements(By.css('div#planet-popup'));
    assert(popupElements.length === 0, 'Popup window should be gone after closing it');

    console.log('Test passed: Planet details popup works correctly');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

runTest();



