'use strict';

const {
    lazyStuber
} = require('../../lazyStub');

module.exports = {
    id: v => v,
    appendTo: lazyStuber('appendTo')
};
