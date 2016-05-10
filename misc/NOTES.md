
- npm stuff
   - npm publish
   - npm help json
   - npm install jscloak
   - npm info = prints current package info

- arr
   - splice vs slice vs substring vs substr
      - http://ariya.ofilabs.com/2014/02/javascript-array-slice-vs-splice.html
      - http://stackoverflow.com/questions/2243824/what-is-the-difference-between-string-slice-and-string-substring
      - substr(start, length)
         - returns length characters
      - substring(from, to)
         - doesn't include to [start..end-1]
      - splice(start, end) (list only)
         - returns range [start..end]
         - modifies array and cuts out start to end
      - slice(start, end)
         - returns range [start..end-1]
         - doesn't include arr[end]
         - does modify array


- snippets
   -get current mouse position
      var x = 0, y = 0;
      $(document).on('mouseover', function(e) {
         x = e.pageX;
         y = e.pageY;
      });

-credits
   isFloat http://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-float-or-integer
