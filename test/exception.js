'use strict';

let {
  quickTest,
  createNode
} = require('./util');
let assert = require('assert');

describe('exception', () => {
  it('missing match tagname', (done) => {
    try {
      quickTest('<div></span>');
    } catch (err) {
      assert(err.toString().indexOf('xml tag does not close correctly') !== -1);
      done();
    }
  });
});
