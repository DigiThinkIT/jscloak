const exceptions = require('../src/exceptions.js');

var moduleErrorTypes = ['BadRange'];
var throwExc = exceptions.getErrorFunc(
						'Utils', moduleErrorTypes, true);


const _utils_exc = require('../src/_utils_exc.js');
var isStr = _utils_exc._isStr;
var isArr = _utils_exc._isArr;
var map = _utils_exc._map;
var filter = _utils_exc._filter;
var contains = _utils_exc._contains;
var flatten = _utils_exc._flatten;
var copyArr = _utils_exc._copy_arr;
var sprintf = _utils_exc._sprintf;


function getRandom(min, max) {
   //return Math.round((Math.random() * 100000)) % (max + 1)
   var random = Math.random();
   if (this.randomSeed)
      random = (random + this.randomSeed) / 2
   if (min >= max)
      throwExc('BadRange', 'Bad range for random number generator');
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _rangeErrCheck(start, end, step) {
   if (contains([start, end], undefined))
      throwExc('BadRange', 'start and end need to be passed');

   if (start == end)
      console.log('Range called with same start and end')
   if (step == 0)
      throwExc('BadApiCall', 'step cannot be 0');

   var badStep = false;
   if ((end > start) && (step < 1))
      badStep = true;
   if ((start > end) && (step > 1))
      badStep = true;
   if (badStep) {
      var loopErrMsg = sprintf('end=%i;start=%i;step=%i;',
                               end, start, step);
      loopErrMsg += ' This will cause infinite loop';
      throwExc('BadRange', loopErrMsg)
   }
}

function range(start, end, step) {
   if (step == undefined) {
      if (start <= end)
         step = 1;
      else if (start > end)
         step = -1;
   }
   _rangeErrCheck(start, end, step);
   var ret = [];
   var done = false;
   while (!done) {
      ret.push(start);
      start += step;
      if (step > 0)
         done = start > end;
      else
         done = start < end;
   }
   return ret;
}

function charRange(start, end) {
   if (end <= start)
      throwExc('BadRange', 'charRange() only works when end > start')
   var ret = [];
   for (var i = start.charCodeAt(); i <= end.charCodeAt(); i++)
      ret.push(String.fromCharCode(i));
   return ret;
}

function mergeDict(a, b) {
   var c = {};
   for (var key in a)
      c[key] = a[key];
   for (var key in b)
      c[key] = b[key];
   return c;
}

function sameArray(arr1, arr2, needSort) {
   if (!arr1 || !arr2)
      return false;
   if (arr1.length != arr2.length)
      return false;

   if (needSort != undefined && needSort == true) {
      arr1 = arr1.sort();
      arr2 = arr2.sort();
   }

   for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] != arr2[i])
         return false;
   }
   return true;
}

function repeatArr(arr, num) {
   var ret = [];
   for (var i = 0; i < num; i++)
      ret = ret.concat(arr);
   return ret;
}

function shuffleArray(arr, noCopy) {
   if (noCopy == undefined || noCopy == false)
      arr = arr.slice();

   var len = arr.length;
   for (var i = 0; i < len-1; i++) {
      var index = getRandom(i, len-1);
      var tmp = arr[index];
      arr[index] = arr[i];
      arr[i] = tmp;
   }
   return arr;
}

function interlace(a, b) {
   //TODO
}

/* Never use foldr_rec. foldl_rec is ok with tail optimization
 * which doesn't yet work in javascript
 * fold(l/r) combine combina(acc, next)
 * foldl_rec combine(init, next), foldr_rec combine(acc, next)
 * > u.foldr([1, 2, 3], 0, (init, next) => init + next)
 *    6
 * > u.foldl([1, 2, 3], [], (init, next) => init.concat([next]))
 *    [ 3, 2, 1 ]
 * > u.foldr([1, 2, 3], [], (init, next) => init.concat([next]))
 *    [ 1, 2, 3 ]
 */
function foldr(lst, acc, combine) {
   for (var i = 0; i < lst.length; i++)
      acc = combine(acc, lst[i]);
   return acc;
}
function foldl(lst, acc, combine) {
   for (var i = lst.length-1; i >= 0; i--)
      acc = combine(acc, lst[i]);
   return acc;
}
var fold = foldr;

function foldl_rec(lst, initial, combine) {
   if (lst.length == 0)
      return initial;
   var next = lst.pop();
   return foldl(lst, combine(initial, next), combine);
}
function foldr_rec(lst, accumulator, combine) {
   if (lst.length == 0)
      return accumulator;
   var next = lst.pop();
   return combine(foldr(lst, accumulator, combine), next);
}

function toInt(s) {
	return parseInt(s);
}
function toFloat(s) {
   return parseFloat(s);
}
function isNum(o) {
   return isFinite(o) && !isNaN(o);
}
function isInt(o) {
   return isNum(o) && ((o % 1) === 0);
}
function isFloat(o) {
   return isNum(o) && (n === +n && n !== (n|0));
}
function isStr(o) {
   return typeof o == 'string' || o instanceof String;
}
function isArr(o) {
   return o instanceof Array; //slower Array.isArray(o);
}
function isObj(o) {
   return o != null && typeof o == 'object';
}

function toJ(jTagOrId, isClass) {
   if (isStr(jTagOrId)) {
      if (contains(['#', '.'], jTagOrId[0])
         return $(jTagOrId);
      else {
         var prepand = '#';
         if (isClass != undefined && isClass)
            prepand = '.';
         return $(prepand + jTagOrId);
      }
   }
   return jTagOrId;
}

function addHtml(o, html, isClass) {
   var jTag = toJ(o, isClass);
   jTag.html(jTag.html() + html);
}

function _Utils(randomSeed) {
   if (randomSeed == undefined)
      this.randomSeed = null;
   else {
      while (randomSeed > 1)
         randomSeed /= 10;
      this.randomSeed = randomSeed;
   }
}

//this stuff is from helper _utils_exc.js
_Utils.prototype.isStr = isStr;
_Utils.prototype.isArr = isArr;
_Utils.prototype.map = map;
_Utils.prototype.filter = filter;
_Utils.prototype.contains = contains;
_Utils.prototype.flatten = flatten;
_Utils.prototype.copyArr = copyArr;
_Utils.prototype.sprintf = sprintf;
//functions defined in this file
_Utils.prototype.getRandom = getRandom;
_Utils.prototype.range = range;
_Utils.prototype.charRange = charRange;
_Utils.prototype.mergeDict = mergeDict;
_Utils.prototype.sameArray = sameArray;
_Utils.prototype.repeatArr = repeatArr;
_Utils.prototype.shuffleArray = shuffleArray;
_Utils.prototype.interlace = interlace;
_Utils.prototype.foldl = foldl;
_Utils.prototype.foldr = foldr;
_Utils.prototype.fold = fold;

_Utils.prototype.toInt = toInt;
_Utils.prototype.toFloat = toFlat;
_Utils.prototype.isNum = isNum;
_Utils.prototype.isInt = isInt;
_Utils.prototype.isFloat = isFloat;
_Utils.prototype.isStr = isStr;
_Utils.prototype.isArr = isArr;
_Utils.prototype.isObj = isObj;
_Utils.prototype.toJ = toJ;
_Utils.prototype.addHtml = addHtml;



var Utils = new _Utils(); //TODO: we can't pass stuff this way

(function () {
   var root = this;
   var _ = new Object();
   var isNode = false;
   if (typeof module !== 'undefined' && module.exports) {
      //module.exports.Utils = Utils;
      module.exports = Utils;
      root.Utils = Utils;
      isNode = true;
   }
   else
      root.Utils = Utils;
})();

