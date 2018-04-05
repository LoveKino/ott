'use strict';

const {
  quickTest,
  testUpdate
} = require('./util');

describe('condition', () => {
  it('base', () => {
    quickTest('1 ? "A" : "B"', 'A');
  });

  it('lazy', () => {
    quickTest('.flag ? mul(.v1, .v2) : div(.v1, .v2)', 0, {
      variableMap: {
        'mul': (v1, v2) => v1 * v2,
        'div': (v1, v2) => v1 / v2
      },

      source: {
        flag: true,
        v1: 0,
        v2: 0
      }
    });
  });

  it('update in condition', () => {
    testUpdate('.flag ? .a : .b', {
      source: {
        flag: true,
        a: 10,
        b: 5
      }
    }, [
      [
        ['flag'], false, 5
      ],

      [
        ['flag'], true, 10
      ]
    ]);
  });

  it('condition in xml', () => {
    quickTest('.flag? <span>1</span>: 2', {
      children: ['1'],
      tagName: 'span',
      props: {}
    }, {
      source: {
        flag: true
      }
    });
  });

  it('condition inside xml', () => {
    quickTest('<p>{.flag? <span>1</span>: 2}</p>', {
      children: [{
        tagName: 'span',
        props: {},
        children: ['1']
      }],
      tagName: 'p',
      props: {}
    }, {
      source: {
        flag: true
      }
    });
  });
});
