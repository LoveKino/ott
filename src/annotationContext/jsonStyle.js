'use strict';

const {
    lazyer
} = require('../lazy');

module.exports = {
    number: (v) => Number(v),
    string: (v) => JSON.parse(v),
    'null': null,
    'true': true,
    'false': false,
    array: lazyer((...args) => args),
    object: lazyer((pairs) => {
        let ret = {};
        if (!pairs) return ret;
        for (let i = 0, n = pairs.length; i < n; i++) {
            let [key, value] = pairs[i];
            ret[key] = value;
        }
        return ret;
    })
};
