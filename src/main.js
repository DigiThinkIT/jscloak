var utils = require('./utils.js');
var passgen = require('./passgen.js');
var launcher = require('./launcher.js');
var exceptions = require('./exceptions.js');

function _JsCloak() {
   this.utils = utils;
   this.passgen = passgen;
	this.launcher = launcher;	
	this.exceptions = exceptions;
}

//TODO: we can't pass arguments this way
var JsCloak = new _JsCloak(); 

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

