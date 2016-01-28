const exceptions = require('../src/exceptions.js')

var moduleErrorTypes = ['BadRange'];
var throwExc = exceptions.getErrorFunc('Utils', moduleErrorTypes);


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
   if (end >= start)
      throwExc('BadRange', 'charRange() only works when end > start')
   var ret = [];
   for (var i = start.charCodeAt(); i <= end.charCodeAt(); i++)
      ret.push(String.fromCharCode(i));
   return ret;
}

/*function filter(lst, test) {
   var ret = [];
   for (x in lst) {
      if (test(lst[x]))
         ret.push(lst[x]);
   }
   return ret;
}*/

/*function map(lst, f) {
   var ret = [];
   for (x in lst)
      ret.push(f(lst[x]));
   return ret;
}*/

function mergeDict(a, b) {
   var c = {};
   for (var key in a)
      c[key] = a[key];
   for (var key in b)
      c[key] = b[key];
   return c;
}



function contains(arr, el) {
   return filter(arr, (x) => x == el).length > 1
}

function sameArray(arr1, arr2, needSort) {
   if (!arr1 || !arr2)
      return false;
   if (arr1.length != arr2.length)
      return false;

   if (shouldSort == true) {
      arr1 = arr1.sort();
      arr2 = arr2.sort();
   }

   for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] != arr2[i])
         return false;
   }
   return true;
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

_Utils.prototype.getRandom = getRandom;
_Utils.prototype.range = range;
_Utils.prototype.charRange = charRange;
_Utils.prototype.filter = filter;
_Utils.prototype.map = map;
_Utils.prototype.mergeDict = mergeDict;
_Utils.prototype.isStr = isStr;
_Utils.prototype.isArr = isArr;
_Utils.prototype.contains = contains;
_Utils.prototype.sameArray = sameArray;
_Utils.prototype.shuffleArray = shuffleArray;

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

