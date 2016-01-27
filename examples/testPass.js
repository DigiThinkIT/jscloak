const passgen = require('../src/passgen.js');

var testPass = passgen.genPass(10, false, true, true, false);
console.log(testPass);
