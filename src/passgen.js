const exceptions = require('../src/exceptions.js')
const utils = require('../src/utils.js');

var moduleErrorTypes = ['LenTooShort', 'NoAllowedChars', 'CHBSBadDict', 'CHBSPassLen'];
var throwExc = exceptions.getErrorFunc('PassGen', moduleErrorTypes, true);

var debug = false;

var defaultCHBSoptions = {
	'dictPath'		: './src/passGenData/wordlist.txt',
	'firstUpper' 	: true,
	'numWords'		: 4, //minimum should be 3
	'minLength'		: 15, //minimum password length
	'maxLength'		: 40,
	'separator'		: '-',
	'appendNum'		: true,
	'maxLoops'		: 100
};

function _getCHBSOpts(o) {
	if (o == undefined)
		o = defaultCHBSoptions;
	for (var option in o) {
		if (o[option] == undefined)
			o[option] = defaultCHBSoptions[option];
	}
	return o;
}

function getCHBSDict(options) {
	options = _getCHBSOpts(options);
	var dictText = fs.readFileSync(options.dictPath);
	var dictLst = dictText.toString().split(',');
	if (dictLst.length < 100)
		throwExc('CHBSBadDict', 'length of dict needs to be at least 100');
	return dictLst;
}

function genCHBSPass(options, dict) {
	var o = options;
	o = _getCHBSOpts(o);

	if (dict == undefined)
		dict = getCHBSDict(options);

	for (var i = 0; i < o.maxLoops; i++) {
		var words = [];
		for (var i = 0; i < o.numWords; i++) {
			var wordIndex = utils.getRandom(0, dict.length-1);
			var word = dict[wordIndex];
			if (o.firstUpper)
				word[0] = word[0].toUpperCase();
			words.push(word);
		}
		if (o.appendNum)
			words.push(utils.getRandom(0, 9));
		var pass = words.join(o.separator);
		var len = pass.length;
		if (len >= o.minLength && len <= o.maxLength)
			return pass;
	}
	var msg = 'Could not generate password with given dictionary.'; 
	msg = utils.sprintf('%s %i words, minLen:%i, maxLen:%i',
							  msg, o.numWords, o.minLength, o.MaxLength);
	throwExc('CHBSPassLen', msg);
}

function _genPassErrCheck(length, useCaps, useLows, useNums, useSpecial) {
   if (length < 8)
      throwExc('LenTooShort');
   if (!(useCaps || useLows || useNums || useSpecial))
      throwExc('NoAllowedChars');
}

function _debugPrint(useCaps, useLows, useNums, useSpecial, pass, neededLen, numCategories) {
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

	var s = '%s, needed length: %i, length: %i, pass: %s, num categories: %i';
   debug_msg = utils.sprintf(s, showStr, len, pass.length, pass, numCategories);

   return debug_msg;
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


	if (debug == true) {
   	var debug_msg = _debugPrint(useCaps, useLows, useNums, useSpecial,
											 pass, neededLen, numCategories);
   	console.log(debug_msg);
	}

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


//http://stackoverflow.com/questions/948172/password-strength-meter/11268104#11268104
//https://blogs.dropbox.com/tech/2012/04/zxcvbn-realistic-password-strength-estimation/
function scorePassword(pass) {
    var score = 0;
    if (!pass)
        return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i=0; i<pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    }

    variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    /*if (score > 80)
        return "strong";
    if (score > 60)
        return "good";
    if (score >= 30)
        return "weak";
   return "bad";*/
	return score;
}

function _PassGen(/*minPassLen*/) {
   /*if (minPassLen == undefined)
      this.minPassLen = 10;
   this.minPassLen = minPassLen;*/
}
_PassGen.prototype.genPass = genPass;
_PassGen.prototype.getCHBSDict = getCHBSDict;
_PassGen.prototype.genCHBSPass = genCHBSPass;
_PassGen.prototype.scorePassword = scorePassword;

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

