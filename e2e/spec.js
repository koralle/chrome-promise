describe('chrome extension page', function() {
  'use strict';

  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.get('chrome-extension://oaeciicibcdolnheomcfodedafhmgkee/empty.html');
  });

  it('has a chrome object', function() {
    expect(browser.driver.executeScript('return typeof chrome')).toBe('object');
  });

  describe('with ChromePromise', function() {

    var chromePromiseScript;

    (function() {
      var fs = require('fs');
      chromePromiseScript = fs.readFileSync('chrome-promise.js', {
        encoding: 'utf8'
      });
    })();

    beforeEach(function() {
      browser.driver.executeScript(chromePromiseScript);
    });

    afterEach(function() {
      function cleanUp() {
        chrome.storage.local.clear();
      }

      browser.driver.executeScript(cleanUp);
    });

    it('it sets and gets some value using chrome.storage', function() {
      function script(callback) {
        var chromep = new ChromePromise();

        return chromep.storage.local.set({foo: 'bar'}).then(function() {
          return chromep.storage.local.get('foo');
        }).then(callback);
      }

      expect(browser.driver.executeAsyncScript(script)).toEqual({foo: 'bar'});
    });

  });
});