
var globalErrors = ['BadApiCall', 'UnsupportedSys'];



function getErrorFunc(moduleName, errorTypes, autoThrow) {
   errorTypes = errorTypes.concat(globalErrors);

   if (autoThrow == undefined)
      autoThrow = true;
   if (moduleName == undefined)
      moduleName = 'None';

   function makeError(errType, msg, shouldThrow) {
      if (!_contains(errorTypes, errType))
         console.log('Unknown error type!');
      if (msg == undefined)
         msg = 'None';
      if (shouldThrow == undefined)
         shouldThrow == autoThrow;
      console.log(autoThrow);

      var excDict = {
         'module' : moduleName,
         'err'    : errType,
         'msg'    : msg
      }

      if (shouldThrow)
         throw excDict;
      else {
         console.log(excToStr(excDict));
         stackTrace2();
      }
      return excDict;
   }
   return makeError;
}

function excToStr(exc) {
   var strMsg = 'jscloak error...';
   strMsg += sprintf('module:{%s}; error type:{%s}; msg:{%s}',
                     exc.module, exc.err, exc.msg);
   return strMsg;
}

//http://stackoverflow.com/questions/591857/how-can-i-get-a-javascript-stack-trace-when-i-throw-an-exception
function stackTrace1() {
   function st2(f) {
      return !f ? [] :
              st2(f.caller).concat([f.toString().split('(')[0].substring(9) + '(' + f.arguments.join(',') + ')']);
      }
   return st2(arguments.callee.caller);
}

function stackTrace2() {
   var err = new Error();
   return err.stack();
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

