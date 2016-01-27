# jscloak
ICLOAK Common Javascript Tools Lib


use this for style guide:
   http://www.jslint.com/help.html

ideas
   require.js
   grunt

TODO:
   npm package name shouldn't be called jscloak but "cloak" sounds weird

===================
Exceptions:
   dictionary {'type': ExcType, 'err': ExcErrMsg}
   ExcType [ExcErrMsg]
      PassGen ['LenTooShort', 'NoAllowedChars']
      Utils []

utils.js
Utils(randomSeed) = optional value to add to random number generator
   getRandom(min, max)
   charRange(start, end)
   range(start, end, step)
   filter(lst, test)
   map(lst, f)
   isStr(str)
   mergeDict(a, b)

passgen.js
PassGen(minPassLen) = default is 6
   genPass(length, useCaps, useLows, useNums, useSpecial)
   genReadablePass()
===================

creating new modules:
   make a new file (with lowercase letters)
   make an object for your module (CamelCased)
   add all function to prototype
   insert the following code at the end of file:
   ==========
   //http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
   (function () {
      //Establish the root object, 'window'
      //in the browser, or 'global' on the server.
      var root = this;

      // Create a reference to this
      var _ = new Object();

      var isNode = false;

      // Export data for our file, with backwards-compatibility
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
   ==========
