const exceptions = require('../src/exceptions.js')
const utils = require('../src/utils.js');

var moduleErrorTypes = ['LenTooShort', 'NoAllowedChars'];
var throwExc = exceptions.getErrorFunc('Utils', moduleErrorTypes);


function genReadablePass() {

}


function _genPassErrCheck(length, useCaps, useLows, useNums, useSpecial) {
   if (length < this.minPasLen)
      throwExc('LenTooShort');
   if (!(useCaps || useLows || useNums || useSpecial))
      throwExc('NoAllowedChars');

}

function genPass(len, useCaps, useLows, useNums, useSpecial) {
   _genPassErrCheck(len, useCaps, useLows, useNums, useSpecial);

   /*var passChars = _getPassChars(useCaps, useLows,
                                 useNums, useSpecial);

   var pass = [];
   for (i = 0; i < len; i++) {
      var randNum = utils.getRandom(0, passChars.length-1);
      var newChar = passChars[randNum];
      pass.push(newChar);
   }*/
   var numCategories = 0;
   if (useCaps) numCategories++;
   if (useLows) numCategories++;
   if (useNums) numCategories++;
   if (useSpecial) numCategories++;
   var numEach = Math.ceil(len / numCategories);

   var numCategories = 0;


   var charsToUse = [];
   var getChars = _getPassChars;

   if (useCaps)
      charsToUse.push(getChars(useCaps, false, false, false));
   if (useLows)
      charsToUse.push(getChars(false, useLows, false, false));
   if (useNums)
      charsToUse.push(getChars(false, false, useNums, false));
   if (useSpecial)
      charsToUse.push(getChars(false, false, false, useSpecial));

      numCategories++;


   var
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

