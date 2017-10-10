'use strict';

const {
    lazyer,
    getValue
} = require('../../lazyCode');

module.exports = {
    appendTo: lazyer((ctx, [v, list]) => {
        v = getValue(ctx, v);
        list = getValue(ctx, list);
        return [v].concat(list);
    }, 'appendTo')
};
