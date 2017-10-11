'use strict';

let {
    quickTest,
    createNode,
    testUpdate
} = require('./util');

describe('condition', () => {
    it('base', () => {
        quickTest('1 ? "A" : "B"', "A");
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
});
