'use strict';

const {
  testUpdate
} = require('./util');

describe('update list', () => {
  it('update one element', () => {
    testUpdate('{plain: .list}', {
      source: {
        list: [0, 1, 2, 3]
      }
    }, [
      [
        ['list', '0'], -5, {
          plain: [-5, 1, 2, 3]
        }
      ]
    ]);
  });

  it('update parent source path', () => {
    testUpdate('{value: map(.list, succ)}', {
      source: {
        list: [0, 1, 2, 3]
      },

      variableMap: {
        map: (arr, fn) => {
          return arr.map(fn);
        },
        succ: (v) => ++v
      }
    }, [
      [
        ['list', '0'], 2, {
          value: [3, 2, 3, 4]
        }
      ],

      [
        ['list'],
        [-5, 1, 2, 3], {
          value: [-4, 2, 3, 4]
        }
      ]
    ]);
  });

  it('update parent source path2', () => {
    testUpdate('succ(.a.b)', {
      source: {
        a: {
          b: 20
        }
      },

      variableMap: {
        succ: (v) => ++v
      }
    }, [
      [
        ['a', 'b'], 8, 9
      ],

      [
        ['a'], {
          b: 100
        },
        101
      ]
    ]);
  });
});
