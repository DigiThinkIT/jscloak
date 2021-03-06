const passgen = require('../src/passgen.js');
const utils = require('../src/utils.js');

/*function assert(x) {
   if (!x) console.log('Test failed');
   throw 'Unit tests failed';
}*/
assert = console.assert

var cCaps = passgen._getPassChars(true, false, false, false);
var cLows = passgen._getPassChars(false, true, false, false);
var cNums = passgen._getPassChars(false, false, true, false);
var cSpec = passgen._getPassChars(false, false, false, true);
var cAll  = passgen._getPassChars(true, true, true, true);

assert(utils.sameArray(cNums, ['0','1','2','3','4','5','6','7','8','9']));
assert(utils.sameArray(cSpec, ['#','$','%','^','&','*','(',')','-','=']));

//count how many times characters
//in chars appear in str
function countChars(str, chars) {
   var count = 0;
   for (var i = 0; i < chars.length; i++)
      count += Utils.filter(str, ((c) => c == chars[i])).length;
   return count;
}

function testPass(len, caps, lows, nums, special) {
   var pass = passgen.genPass(len, caps, lows, nums, special);
   assert(pass.length == len);

   var goodChars = passgen._getPassChars(caps, lows, nums, special);
   assert(countChars(pass, goodChars) == len);
}

function testPassGen() {
   for (var i = 10; i < 25; i++) {
      testPass(i, true,  false, false, false);
      testPass(i, false, true,  false, false);
      testPass(i, false, false, true,  false);
      testPass(i, false, false, false, true);
      testPass(i, true,  true,  true,  true);

      //test that password has all characters
      var hasCaps = false, hasLows = false,
          hasNums = false, hasSpecial = false;

      var pass = passgen.genPass(i, true, true, true, true);
      assert(countChars(pass, cLows) > 0);
      assert(countChars(pass, cCaps) > 0);
      assert(countChars(pass, cNums) > 0);
      assert(countChars(pass, cSpec) > 0);
      assert(countChars(pass, cCaps) > 0);
   }
   //TODO: varify that it actually
   //throws and give error if it doesn't
	var thrown = false;
   try {
      testPass(10, false, false, false, false);
   } catch (e) {
      assert(e.module == 'PassGen' && e.err == 'NoAllowedChars');
		thrown = true;
   }
	assert(thrown);
	thrown = false;
   try {
      testPass(5, true, true, true, true);
   } catch (e) {
      assert(e.module == 'PassGen' && e.err == 'LenTooShort');
		thrown = true;
   }
	assert(thrown);
}

testPassGen();

