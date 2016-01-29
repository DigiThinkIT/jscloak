

const utils = require('../src/utils.js')

var assert = console.assert

var sameArr = utils.sameArray
var copyArr = utils.copyArr

//isStr
assert(utils.isStr('blah') == true);
assert(utils.isStr(5) == false);
assert(utils.isStr(null) == false);
//isArr
assert(utils.isArr([1, 2, 3]) == true);
assert(utils.isArr(4) == false);
//map
var arr = [0, 1, 2, 3, 4];
var newArr = utils.map(arr, (x) => x*2);
for (var i = 0; i < arr.length; i++)
	assert(newArr[i] == arr[i] * 2);
assert(utils.map([], (x)=>x).length == 0);
assert(sameArr(utils.map(arr, (x)=>x), arr));
//filter
var newArr = utils.filter(arr, (x) => x > 2);
assert(sameArr(newArr, [3, 4]));
//contains
assert(utils.contains([1, 2, 3], 2));
assert(utils.contains([1, 2, 3], 0) == false);
//flatten
var lst = [1, [2, [3, 4], 5], [6], 7];
var cpy = copyArr(lst);
var flattened = utils.flatten(cpy);
assert(sameArr(lst, cpy));
assert(sameArr(flattened, [1,2,3,4,5,6,7]));
//copyArr
var lst = [1, 2, 3];
var b = copyArr(lst);
b[0] = 2;
assert(lst[0] == 1);
//sprintf
var s = utils.sprintf('Hello, %s %i', 'World', 4);
assert(s == 'Hello, World 4');
var s = utils.sprintf('%s%s%ihi', 'a', 'b', 4);
assert(s == 'ab4hi');
//getRandom
var r = utils.getRandom(1, 5);
assert(r >= 1 && r <= 5);
var thrown = false;
try {
	utils.getRandom(0, 0);
} catch (e) {
	assert(e.module == 'Utils' && e.err == 'BadRange');
	thrown = true;
}
assert(thrown);
3+5;
//charRange

//range

//mergeDict

//contains

//sameArray

//repeatArr

//suffleArray

//interlace

//folds
