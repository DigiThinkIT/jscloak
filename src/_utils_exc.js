//This stuff should be in utils.js, but it's also used
//in exceptions.js, and utils relies on exceptions

function _isStr(str) {
   return typeof str == 'string' || str instanceof String;
}

function _isArr(arr) {
   return Array.isArray(arr);
}

function _map(lst, f) {
   var ret = [];
   for (x in lst)
      ret.push(f(lst[x]));
   return ret;
}

function _foldl() {}
function _foldr() {}

function _filter(lst, test) {
   var ret = [];
   for (x in lst) {
      if (test(lst[x]))
         ret.push(lst[x]);
   }
   return ret;
}

function _contains(arr, el) {
   return _filter(arr, (x) => x == el).length > 1
}

function _flatten_rec(arr) {
   if (!_isArr(arr))
      return [arr];

   var ret = [];
   arr.forEach(function (el, i, a) {
      ret = ret.concat(_flatten_rec(el));
   });
   return ret;
}


var _recursive_checker = 0;
function _recursive_split(str, splitters) {
   if (_recursive_checker++ > 1000) {
      console.log('oops');
      return;
   }
   var ret = [];

   if (splitters.length == 0)
      return ret;

   if (_isStr(str)) {
      var splitter = splitters.pop();
      //splitters.forEach((splitter) => {
      var splitterLen = splitter.length;

      var i = str.indexOf(splitter);
      while (i != -1) {
         if (i != 0) {
            var head = str.slice(0, i);
            ret.push(_recursive_split(head, splitters));
         }
         ret.push(splitter);
         str = str.slice(i+splitterLen);
         i = str.indexOf(splitter);
      }
      if (str.length != 0) {
         var tail = _recursive_split(str, splitters);
         ret.push(tail);
      }
   }
   if (_isArr(str)) {
      console.log('arr passed');
      return;
   }

   //});
   /*for (s in splitters) {
      var splitter = splitters[0]; //[s]
      var splitted = str.split(splitter);

      var lastSplitter = false;
      if (splitted[splitted.length-1].length == 0) {
         lastSplitter = true;
         splitted.pop();
      }
      var firstSplitter = false;
      if (splitted[0].length == 0)
         firstSplitter = true;

      //splitted = _filter(splitted, (word) => word.length > 0);
      var withSplitter = _map(splitted, (word) => [splitter, word]);

      if (lastSplitter) {
         withSplitter.push('%s');
      }
      if (!firstSplitter)
         withSplitter[0][0] = '';
      console.log(withSplitter);
      //console.log(_flatten_rec(withSplitter));
      console.log('....');

      //withSplitter = _filter(withSplitter, (word) => word != '');
      //ret = ret.concat(withSplitter);
   //} */
   return ret;
}
function _sprintf(format) {
   return _recursive_split(format, ['%s', '%i']);
   /*for (var i = 0; i < arguments.length; i++) {

   }*/
}

////////////////////
function inNode() {
   return (typeof module !== 'undefined' && module.exports);
}

(function () {
if (inNode()) {
   module.exports._isArr = _isArr;
   module.exports._map = _map;
   module.exports._foldl = _foldl;
   module.exports._foldr = _foldr;
   module.exports._filter = _filter;
   module.exports._contains = _contains;
   module.exports._flatten = _flatten_rec;
   module.exports._sprintf = _sprintf;
}
else {
   this._isStr = _isStr;
   this._isArr = _isArr;
   this._map = _map;
   this._foldl = _foldl;
   this._foldr = _foldr;
   this._filter = _filter;
   this._contains = _contains;
   this._flatten = _flatten_rec;
   this._sprintf = _sprintf;
}
})();

