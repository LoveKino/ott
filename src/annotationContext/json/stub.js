'use strict';

const {
  lazyStuber
} = require('../../lazyStub');

module.exports = {
  number: (v) => Number(v),
  string: (v) => JSON.parse(v),
  'null': null,
  'true': true,
  'false': false,
  array: lazyStuber('array'),
  object: lazyStuber('object')
};
