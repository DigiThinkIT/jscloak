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
   - isStr(str)
   - isArr(arr)
   - map(lst, f)
   - filter(lst, test)
   - contains(arr, el)
   - flatten(arr)
   - copyArr(arr)
   - sprintf(format, ...)
   - ...
   - getRandom(min, max)
   - charRange(start, end)
   - range(start, end, step)
   - mergeDict(a, b)
   - contains(arr, el)
   - sameArray(arr1, arr2, needSort)
   - repeatArr(arr, num)
   - shuffleArray(arr, noCopy)
   - interlace(a, b)
   - folds(lst, acc, combine) => combine(acc, next)
      - foldl
      - foldr
      - fold = foldr
	- toInt(str)

passgen.js
- PassGen(minPassLen) - default is 6
   - genPass(length, useCaps, useLows, useNums, useSpecial)
	- getCHBSDict(options)
   - genCHBSPass(options, dict)
   - scorePassword(pass)

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
