const _utils_exc = require('../src/_utils_exc.js');

var _sprintf = _utils_exc._sprintf
var _contains = _utils_exc._contains

var globalErrors = ['BadApiCall', 'UnsupportedSys'];

function getErrorFunc(moduleName, errorTypes, autoThrow, onExc) {
   errorTypes = errorTypes.concat(globalErrors);

   if (autoThrow == undefined)
      autoThrow = true;
   if (moduleName == undefined)
      moduleName = 'None';
   if (onExc == undefined)
      onExc = () => null; //console.log;

   function makeError(errType, msg, shouldThrow) {
      if (!_contains(errorTypes, errType))
         console.log('Unknown error type!');
      if (msg == undefined)
         msg = 'None';
      if (shouldThrow == undefined)
         shouldThrow = autoThrow;

      var excDict = {
         'module' : moduleName,
         'err'    : errType,
         'msg'    : msg,
         'stack'  : stackTrace2()
      }
      if (shouldThrow)
         throw excDict; //excToStr(excDict); //TODO
      else
         console.log(excToStr(excDict)); //console.log(stackTrace2());
      onExc(excDict);
      return excDict;
   }
   return makeError;
}

function excToStr(exc) {
   var strMsg = 'jscloak error...';
   strMsg += _sprintf('module:{%s}; error type:{%s}; msg:{%s}; stack:\n{%s}',
                      exc.module, exc.err, exc.msg, exc.stack);

   return strMsg;
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack
//http://www.codeovertones.com/2011/08/how-to-print-stack-trace-anywhere-in.html
//https://gist.github.com/jay3sh/1158940

//http://stackoverflow.com/questions/591857/how-can-i-get-a-javascript-stack-trace-when-i-throw-an-exception
function stackTrace1() {
   function st2(f) {
      return !f ? [] :
              st2(f.caller).concat([f.toString().split('(')[0].substring(9) + '(' + f.arguments.join(',') + ')']);
      }
   return st2(arguments.callee.caller);
}

//http://stackoverflow.com/questions/6715571/how-to-get-result-of-console-trace-as-string-in-javascript-with-chrome-or-fire
function stackTrace2() {
   if (inNode) { //works on node and probably chrome
      var obj = {};
      Error.captureStackTrace(obj, stackTrace2);
     return obj.stack;
   }
   else { //Should work on firefox
      var err = new Error();
      return err.stack();
   }
}

////////////////////
function inNode() {
   return (typeof module !== 'undefined' && module.exports);
}

(function () {
if (inNode()) {
   module.exports.getErrorFunc = getErrorFunc;
   module.exports.excToStr = excToStr;
   module.exports.stacktrace = stackTrace2;
}
else {
   this.getErrorFunc = getErrorFunc;
   this.excToStr = excToStr;
   this.stacktrace = stackTrace2;
}
})();

