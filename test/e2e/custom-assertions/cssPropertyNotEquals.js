exports.assertion = function (selector, css, check) {
  this.message = `Testing if element <${selector}> doesn't have ${css} as ${check}`;
  this.expected = css;
  this.pass = function (val) {
    return val !== this.expected;
  };
  this.value = function (res) {
    return res.value;
  };
  this.command = function (cb) {
    var self = this;
    return this.api.execute(function (selector) {
      return document.querySelector(selector).style.right;
    }, [selector], function (res) {
      cb.call(self, res);
    });
  };
};
