module.exports = {
  'Badge must correctly switch position': function test(browser) {
    const devServer = browser.globals.devServerURL;

    browser
      .useCss()
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('#vsb-bubble')
      .assert.elementPresent('#vsb-badge')
      .assert.cssProperty('#vsb-badge', 'right', '0px')
      .assert.elementCount('img', 1)
      .moveToElement('#vsb-bubble', 29, 29)
      .mouseButtonDown(0)
      .moveToElement('body', 500, 200)
      .mouseButtonUp(0)
      .assert.cssPropertyNotEquals('#vsb-badge', 'right', '0px')
      .pause(1000)
      .end();
  },
};
