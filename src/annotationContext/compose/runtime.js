'use strict';

const {
    lazyer,
    getValue
} = require('../../lazyCode');

module.exports = {
    condition: lazyer(function(ctx, [c, e1, e2]) {
        if (getValue(ctx, c)) {
            return getValue(ctx, e1);
        } else {
            return getValue(ctx, e2);
        }
    }, 'condition')
};
