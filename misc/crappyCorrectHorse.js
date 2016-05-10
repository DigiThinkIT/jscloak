var fs = require('fs');

var options = {
	'dictPath'		: 'passGenData/wordlist.txt',
	'firstUpper' 	: true,
	'numWords'		: 4, //minimum should be 3
	'minLength'		: 10, //minimum word length
	'separator'		: '-',
	'randNumPool'	: 10,
	'appendNums'	: true,
};

function getDictJS(options, callBack) {
	function onOpen(content, textStatus) {
		var words = cont.toString().split(',');
		callBack(words);
	}
	$.get(options.dictPath, onOpen, 'text');
}

function getDict(options) {
	var dictText = fs.readFileSync(options.dictPath);
	var words = dictText.toString().split(',');
	return words;
}

function getRandomWords(options, dict) {
	var n = options.numWords;
	var len = dict.length;
	var words = [];
	for (var i = 0; i < n; i++) {
		var rand = Math.floor(Math.random() * len);
		var word = dict[rand];
		if (options.firstUpper)
			word = word.charAt(0).toUpperCase() + word.slice(1);
		words.push(word);
	}
	return words;
}

//replaced with just use string.split('')
function stringToArray(str) {
	var chars = [];
	var len = str.length || 0;

	//TODO: utils
	if (typeof(str) !== "string" && len === 0)
		return false;

	for (var i = 0; i < len; i++ ) {
		var theChar = str.substring(i, i + 1);
		chars.push(theChar);
	}
	return chars;
}

function join(words, options) {
	var theString = "";

	if (options.appendNums)
		words.push(Math.ceil(Math.random() * options.randNumPool));

	for (var i = 0; i < words.length; i++) {
		var symbol = '';
		if (i !== words.length - 1)
			symbol = options.separator;
		theString += words[i] + symbol;
	}
	return theString;
}

function getSeparator(seps) {
	return seps[Math.floor(Math.random() * seps.length)] || '';
}

function generate(options, dict) {
	var words = getRandomWords(options, dict);

	//generate a full string to test against min length
	var fullword = join(words, options);

	//recurse untill our password is long enough;
	if (fullword.length < options.minLength)
		return generate(1);
	return fullword;
}

function genPass() {
	var dict = getDict(options);
	return generate(options, dict);
}

/*var dict = [];
getDict(options, (d) => dict = d);
exports.o = options
exports.getDict = getDict
exports.generate = generate*/

exports.genPass = genPass;


