'use strict';

let {
    quickTest,
    createNode,
    testUpdate
} = require('./util');

describe('condition', () => {
    it('base', () => {
        quickTest('map(.list, (m) -> add(m, 1))', [2, 3, 4], {
            variableMap: {
                add: (x, y) => x + y,
                map: (list, handler) => list.map(handler)
            },
            source: {
                list: [1, 2, 3]
            }
        });
    });

    it('two parameters', () => {
        quickTest('map(.list, (m, index) -> add(m, index))', [1, 3, 5], {
            variableMap: {
                add: (x, y) => x + y,
                map: (list, handler) => list.map(handler)
            },
            source: {
                list: [1, 2, 3]
            }
        });
    });
});
