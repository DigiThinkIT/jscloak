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

function _filter(lst, test) {
   var ret = [];
   for (x in lst) {
      if (test(lst[x]))
         ret.push(lst[x]);
   }
   return ret;
}

function _foldl() {}
function _foldr() {}


function _contains(arr, el) {
   return _filter(arr, (x) => x == el).length >= 1
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

function _copy_array(arr) {
   return arr.slice();
}

//var _recursive_checker = 0;
function _recursive_split(str, splitters) {
   splitters = _copy_array(splitters);
   //if (_recursive_checker++ > 1000) { console.log('oops'); return; }
   var ret = [];

   if (splitters.length == 0) {
      if (str.length != 0)
         return str;
   }

   var splitter = splitters.pop();
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
   return ret;
}


function _sprintf(format) {
   var formatters = ['%s', '%i'];
   var splitted = _recursive_split(format, formatters);
   splitted = _flatten_rec(splitted);

   var j = 0;
   for (var i = 1; i < arguments.length && j < splitted.length-1; i++) {
      while (j < splitted.length) {
         if (_contains(formatters, splitted[j]))
            break;
         j++;
      }
      splitted[j] = arguments[i];
      j++;
   }
   return splitted.join('');
}

////////////////////
function inNode() {
   return (typeof module !== 'undefined' && module.exports);
}

(function () {
if (inNode()) {
   module.exports._isStr = _isStr;
   module.exports._isArr = _isArr;
   module.exports._map = _map;
   module.exports._filter = _filter;
   module.exports._foldl = _foldl;
   module.exports._foldr = _foldr;
   module.exports._contains = _contains;
   module.exports._flatten = _flatten_rec;
   module.exports._copy_arr = _copy_array;
   module.exports._sprintf = _sprintf;
}
else {
   this._isStr = _isStr;
   this._isArr = _isArr;
   this._map = _map;
   this._filter = _filter;
   this._foldl = _foldl;
   this._foldr = _foldr;
   this._contains = _contains;
   this._flatten = _flatten_rec;
   this._copy_arr = _copy_array;
   this._sprintf = _sprintf;
}
})();

