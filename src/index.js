'use strict';

let {
    parser,
    compile
} = require('./parser');
let execute = require('./execute');

module.exports = {
    parser,
    compile,
    execute
};
