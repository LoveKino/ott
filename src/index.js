'use strict';

const {
    parser,
    compile
} = require('./parser');
const execute = require('./execute');

module.exports = {
    parser,
    compile,
    execute
};
