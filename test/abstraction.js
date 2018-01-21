'use strict';

let {
    quickTest,
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

    it('update in abstraction', () => {
        testUpdate('map(.list, (m, index) -> add(.list.[index], 1))', {
            variableMap: {
                add: (x, y) => x + y,
                map: (list, handler) => list.map(handler)
            },
            source: {
                list: [1, 2, 3]
            }
        }, [
            [
                ['list', '0'], 64, [65, 3, 4]
            ]
        ]);

    });
});
