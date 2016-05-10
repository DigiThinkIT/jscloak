# jscloak

ICLOAK Common Javascript Tools Library

[![Build Status](https://travis-ci.org/KostyaKow/jscloak.svg?branch-master)](https://travis-ci.org/KostyaKow/jscloak)

- use this for style guide:
   - http://www.jslint.com/help.html
- TODO
   - [ ] Consider re-naming (npm package name shouldn't be called jscloak but "cloak" sounds weird)
   - [x] create npm package
   - [x] integrate Travis CI
   - [ ] Create password generator
   - [ ] Make unit tests
      - [ ] verify that exceptions do get thrown when we expect them
   - [ ] Make examples
   - [x] sprintf
   - [ ] sprintf argument check
   - [ ] exception system
      - [ ] if we throw dict, we don't get error printed, but if we throw string, we can't access error members
 		- [ ] Expose internal exception mechanism for external use
		- [ ] Modify exception stack to work with firefox.
		- [x] Modules pass default exception handler
		- [ ] Global exception handler for whole application
   - [x] foldr/foldl
   - [ ] interlace
   - [ ] IE magic if console doesn't exist
	- [ ] Add strict
   - [ ] Remove browser checks because we use browserify now
   - [x] Add toInt, toFloat, isNum, isInt, isFloat, isStr, isArr to utils
      - [ ] Unit tests
   - [x] Add toJ and addHtml to utils
      - [ ] Unit tests
      - [ ] Add check if string doesn't match isClass
  - ideas
   - require.js
   - grunt

-------------------


-Exceptions:
   - Global Error Types => ['BadApiCall', 'UnsupportedSys', 'Other']
   - dictionary {'module': ModuleName, 'err': ErrType, 'msg': Msg }
   - ModuleName => [ErrType]
      - PassGen => ['LenTooShort', 'NoAllowedChars', 'CHBSBadDict', 'CHBSPassLen']
      - Utils   => ['BadRange']
   - for new modules, add custom errors:
   - ```var throwError = exceptions.getErrorFunc(ModuleName, moduleErrorTypes, autoThrow, onExc)```
   - usage in module: throwError('Other', 'error details', true)
   - call it makeError instead of ThrowError if autoThrow is false
   -exceptions.js
      - getErrorFunc(moduleName, errorTypes, autoThrow)
      - excToStr(exc)
      - stacktrace()

utils.js
- Utils(randomSeed) - optional value to add to random number generator
   - map(lst, f) - map function f to lst
   - filter(lst, test) - filter lst and only return list of elements for which test(element) == true
   - contains(arr, el) - check if arr contains el
   - flatten(arr) - flatten([[a, b, c], d, [[e, f, g]]]) => [a, b, c, d, e, f, g]
   - copyArr(arr) - copy array
   - sprintf(format, ...) - similar to printf, but to a string
   - ...
   - getRandom(min, max) - get random number in range min to max
   - charRange(start, end) - character range start with start to end
   - range(start, end, step) - number range [start, start+step, ..., end]
   - mergeDict(a, b) - merge 2 dictionaries together
   - sameArray(arr1, arr2, needSort) - check if arrays elements are equal
   - repeatArr(arr, num) - repeat array num times (repeatArr([1, 2, 3], 2) => [1, 2, 3, 1, 2, 3])
   - shuffleArray(arr, noCopy) - randomly move around elements in array
   - interlace(a, b) - not implemented yet
   - folds(lst, acc, combine) - fold a list, starting with acc, and using combine function
      - combine(acc, next) - pass a function which combines acc and next, and returns next acc
      - foldl
      - foldr
      - fold = foldr
	- toInt(str) - cast string to int
   - toFloat(str) - cast string to float
   - isNum(o) - check if number
   - isInt(o) - check if integer
   - isFloat(o) - check if float
   - isStr(str) - check if string
   - isArr(arr) - check if array
   - isObj(o) - check if object
   - toJ(jTagOrId, isClass) - if jTagOrId equals '#id' or 'id' or $('#id') return $('#id')
   - addHtml(o, html, isClass) - add html data to jquery object o
passgen.js
- PassGen(minPassLen) - password generator (default minPassLen is 6)
   - genPass(length, useCaps, useLows, useNums, useSpecial) - generate password of lenght, useCaps = flag whether to use capital letters, useSpecial = flag whether to use special characters
	- getCHBSDict(options)
   - genCHBSPass(options, dict) - generate word password
   - scorePassword(pass) - check password strength

launcher.js
	- launch(path, extra_args, on_data, on_error, on_close)
		- on_data(str), on_error(str), on_close(int)
-------------------


- creating new modules:
   - make a new file (with lowercase letters)
   - make an object for your module (CamelCased)
   - add all function to prototype
   - insert the following code at the end of file:
   ```javascript
   //http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
   (function () {
      //Establish the root object, 'window'
      //in the browser, or 'global' on the server.
      var root = this;

      // Create a reference to this
      var _ = new Object();

      var isNode = false;

      // Export data for our file, with backwards=compatibility
      // for the old `require()` API. If we're not in
      // node, add data to the global object.
      if (typeof module !== 'undefined' && module.exports) {
         //module.exports.YourModule = YourModule;
         module.exports = YourModule;
         root.YourModule = YourModule;
         isNode = true;
      } else {
         root.YourModule = YourModule;
      }
   })();
   ```
