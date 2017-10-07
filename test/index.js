'use strict';

let {
    compile
} = require('..');
let assert = require('assert');

let quickTest = (text, expect, options) => {
    let real = compile(text, options);
    assert.deepEqual(real, expect);
};

describe('index', () => {
    it('base', () => {
        quickTest('1', 1);
        quickTest('"hello world"', 'hello world');
        quickTest('null', null);
        quickTest('true', true);
        quickTest('false', false);
    });

    it('array', () => {
        quickTest('[]', []);
        quickTest('[1]', [1]);
        quickTest('[1, 2]', [1, 2]);
        quickTest('[1, 2, "3"]', [1, 2, '3']);
    });

    it('object', () => {
        quickTest('{}', {});
        quickTest('{"a": 1}', {
            a: 1
        });
        quickTest('{a: 1}', {
            a: 1
        });
        quickTest('{a: 1, b:2, c:3}', {
            a: 1,
            b: 2,
            c: 3
        });
        quickTest('{a: [1, 2], b: {c: 4}}', {
            a: [1, 2],
            b: {
                c: 4
            }
        });
    });

    it('fun variable', () => {
        quickTest('add(1, 2)', 3, {
            variableMap: {
                add: (v1, v2) => v1 + v2
            }
        });

        quickTest('reverse([1,2,3,4])', [4, 3, 2, 1], {
            variableMap: {
                reverse: (list) => list.reverse()
            }
        });


        quickTest('add(1, subtraction(4, 7))', -2, {
            variableMap: {
                add: (v1, v2) => v1 + v2,
                subtraction: (v1, v2) => v1 - v2
            }
        });
    });

    it('fun - high order', () => {
        quickTest('f(4)(8)', 32, {
            variableMap: {
                f: (v1) => (v2) => v1 * v2
            }
        });

        quickTest('map([2,8,5,3], succ)', [3, 9, 6, 4], {
            variableMap: {
                map: (array, handler) => {
                    return array.map(handler);
                },
                succ: (v) => ++v
            }
        });
    });
});
