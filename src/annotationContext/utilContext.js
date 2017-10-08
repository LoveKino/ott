'use strict';

const {
    lazyer
} = require('../lazy');

module.exports = {
    id: v => v,
    appendTo: lazyer((v, list) => [v].concat(list))
};
