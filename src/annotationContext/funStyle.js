'use strict';

const {
    lazyer
} = require('../lazy');

module.exports = {
    applyFun: lazyer((fun, args) => {
        return fun.apply(undefined, args);
    })
};
