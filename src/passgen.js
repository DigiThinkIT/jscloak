
const utils = require('../src/utils.js');

function genReadablePass() {

}


function genPass(length, useCaps, useLows, useNums, useSpecial) {
   if (length < this.minPasLen)
      throw {'type':'PassGen', 'err':'LenTooShort'};
   if (!(useCaps || useLows || useNums || useSpecial))
      throw {'type':'PassGen', 'err':'NoAllowedChars'};

   var passChars = _getPassChars(useCaps, useLows,
                                 useNums, useSpecial);
   var pass = [];
   for (i = 0; i < length; i++) {
      var randNum = utils.getRandom(0, passChars.length-1);
      var newChar = passChars[randNum];
      pass.push(newChar);
   }
   return pass.join('');
}

function _getPassChars(useCaps, useLows, useNums, useSpecial) {
   var passChars = [];
   if (useCaps) {
      var charCaps = Utils.charRange('A', 'Z');
      passChars = passChars.concat(charCaps);
   }
   if (useLows) {
      var lowChars = Utils.charRange('a', 'z');
      passChars = passChars.concat(lowChars);
   }
   if (useNums) {
      var numChars = Utils.charRange('0', '9');
      passChars = passChars.concat(numChars);
   }
   if (useSpecial) {
      var specialChars = [
         '#', '$', '%', '^', '&',
         '*', '(', ')', '-', '='
      ];
      /*for (i = '#'.charCodeAt(); i <= '='.charCodeAt(); i++)
         charSpecial.push(String.fromCharCode(i));*/
      passChars = passChars.concat(specialChars);
   }
   return passChars;
}


function _PassGen(minPassLen) {
   if (minPassLen == undefined)
      this.minPassLen = 6;
   this.minPassLen = minPassLen;
}
_PassGen.prototype.genPass = genPass;
_PassGen.prototype.genReadablePass = genReadablePass;
//for unit tests
_PassGen.prototype._getPassChars = _getPassChars;

var PassGen = new _PassGen();

(function () {
   var root = this;
   var _ = new Object();
   var isNode = false;
   if (typeof module !== 'undefined' && module.exports) {
      module.exports = PassGen;
      root.PassGen = PassGen;
      isNode = true;
   }
   else
      root.PassGen = PassGen;
})();

