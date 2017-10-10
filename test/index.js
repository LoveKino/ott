'use strict';

let {
    quickTest,
    createNode
} = require('./util');

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

    it('xml tag', () => {
        quickTest('<div/>', {
            tagName: 'div',
            props: {},
            children: []
        }, {
            xmlMap: {
                createNode
            }
        });

        quickTest('<div></div>', {
            tagName: 'div',
            props: {},
            children: []
        }, {
            xmlMap: {
                createNode
            }
        });

        quickTest('<div>abcd</div>', {
            tagName: 'div',
            props: {},
            children: ['abcd']
        }, {
            xmlMap: {
                createNode
            }
        });

        quickTest('<div><span>abc</span><p>123</p></div>', {
            "tagName": "div",
            "props": {},
            "children": [

                {
                    "tagName": "span",
                    "props": {},
                    "children": [
                        "abc"
                    ]
                },
                {
                    "tagName": "p",
                    "props": {},
                    "children": [
                        "123"
                    ]
                }
            ]
        }, {
            xmlMap: {
                createNode
            }
        });
    });

    it('xml {EXPRESSION}', () => {
        quickTest('<div>{1}</div>', {
            "tagName": "div",
            "props": {},
            "children": [1]
        }, {
            xmlMap: {
                createNode
            }
        });

        quickTest('<div>{add(2, 3)}</div>', {
            "tagName": "div",
            "props": {},
            "children": [5]
        }, {
            variableMap: {
                add: (v1, v2) => v1 + v2
            },
            xmlMap: {
                createNode
            }
        });
    });

    it('xml attr', () => {
        quickTest('<div id=2/>', {
            "tagName": "div",
            "props": {
                id: 2
            },
            "children": []
        }, {
            xmlMap: {
                createNode
            }
        });

        quickTest('<div id=2 "class"="common on!">gogogo!</div>', {
            "tagName": "div",
            "props": {
                id: 2,
                class: 'common on!'
            },
            "children": ['gogogo!']
        }, {
            xmlMap: {
                createNode
            }
        });

        quickTest('<div id=uuid()>gogogo!</div>', {
            "tagName": "div",
            "props": {
                id: '00009999'
            },
            "children": ['gogogo!']
        }, {
            variableMap: {
                uuid: () => '00009999'
            },
            xmlMap: {
                createNode
            }
        });
    });

    it('path query', () => {
        quickTest('.n1', 'hello!', {
            source: {
                n1: 'hello!'
            }
        });

        quickTest('.0', 1, {
            source: [1, 2, 3]
        });

        quickTest('.1', 2, {
            source: [1, 2, 3]
        });

        quickTest('.a.b', 10, {
            source: {
                a: {
                    b: 10
                }
            }
        });
    });

    it('path variable', () => {
        quickTest('.a.[next]', 100, {
            source: {
                a: {
                    f: 100
                }
            },

            variableMap: {
                next: 'f'
            }
        });
    });
});
