const exceptions = require('../src/exceptions.js')
const utils = require('../src/utils.js');

var moduleErrorTypes = ['LenTooShort', 'NoAllowedChars'];
var throwExc = exceptions.getErrorFunc('PassGen', moduleErrorTypes);


function genReadablePass() {

}


function _genPassErrCheck(length, useCaps, useLows, useNums, useSpecial) {
   if (length < this.minPasLen)
      throwExc('LenTooShort');
   if (!(useCaps || useLows || useNums || useSpecial))
      throwExc('NoAllowedChars');

}

function _debugPrint(useCaps, useLows, useNums, useSpecial) {
   /*var logMsg = utils.sprintf('useCaps:%s,useLows:%s,useNums:%s,useSpecial:%s,' +
                              'length:%i,needed length:%i,pass:%s',
                              useCaps, useLows, useNums, useSpecial, pass.length, len, pass);*/
   var sprintf = utils.sprintf;
   var showStr = 'chars allowed: %s';
   if (useCaps && useLows && useNums && useSpecial)
      showStr = sprintf(showStr, 'all');
   else if (useCaps)
      showStr = sprintf(showStr, 'caps');
   else if (useLows)
      showStr = sprintf(showStr, 'lows');
   else if (useNums)
      showStr = sprintf(showStr, 'nums');
   else if (useSpecial)
      showStr = sprintf(showStr, 'special');
   return showStr;
}

function genPass(len, useCaps, useLows, useNums, useSpecial) {
   _genPassErrCheck(len, useCaps, useLows, useNums, useSpecial);

   var numCategories = useCaps + useLows + useNums + useSpecial;
   var numEach = Math.ceil(len / numCategories);

   var charsToUse = [];
   var getChars = _getPassChars;

   //TODO: I don't like this repeats
   var repeat = utils.repeatArr
   charsToUse.push(repeat(getChars(useCaps, false, false, false), 10));
   charsToUse.push(repeat(getChars(false, useLows, false, false), 10));
   charsToUse.push(repeat(getChars(false, false, useNums, false), 10));
   charsToUse.push(repeat(getChars(false, false, false, useSpecial), 10));

   charsToUse = utils.filter(charsToUse, (lst) => lst.length != 0);
   charsToUse = utils.map(charsToUse, (lst) => lst.slice(0, numEach));
   var pass = utils.fold(charsToUse, [], (acc, next) => acc.concat(next));
   pass = utils.shuffleArray(pass, true).slice(0, len).join('');

   var debug_msg = _debugPrint(useCaps, useLows, useNums, useSpecial);
   debug_msg = utils.sprintf('%s, needed length: %i, length: %i, pass: %s, num categories: %i',
                             debug_msg, len, pass.length, pass, numCategories);
   console.log(debug_msg);
   return pass;
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

