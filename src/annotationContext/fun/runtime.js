'use strict';

const {
    lazyer,
    getValue
} = require('../../lazyCode');

module.exports = {
    applyFun: lazyer(function(ctx, [fun, args]) {
        fun = getValue(ctx, fun);
        args = getValue(ctx, args);

        return fun(...args);
    }, 'applyFun')
};
