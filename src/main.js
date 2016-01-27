var utils = require('utils.js');
var passgen = require('passgen.js');

function _JsCloak() {
   this.utils = utils;
   this.passgen = passgen;
}

var JsCloak = new _JsCloak(); //TODO: we can't pass stuff this way


(function () {
   var root = this;
   var _ = new Object();
   var isNode = false;
   if (typeof module !== 'undefined' && module.exports) {
      module.exports = JsCloak;
      root.exports = JsCloak;
      isNode = true;
   }
   else
      root.JsCloak = JsCloak;
})();

