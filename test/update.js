'use strict';

const {
    testUpdate
} = require('./util');

describe('update', () => {
    it('base', () => {
        testUpdate('<div id=.id></div>', {
            source: {
                id: '001'
            }
        }, [
            [
                ['id'], '002', {
                    tagName: 'div',
                    props: {
                        id: '002'
                    },
                    children: []
                }
            ],

            [
                ['id'], '003', {
                    tagName: 'div',
                    props: {
                        id: '003'
                    },
                    children: []
                }
            ]
        ]);
    });

    it('path update in json', () => {
        testUpdate('{a: 1, b: .p.a}', {
            source: {
                p: {
                    a: 10
                }
            }
        }, [
            [
                ['p', 'a'], -5, {
                    a: 1,
                    b: -5
                }
            ],

            [
                ['p', 'a'], 56, {
                    a: 1,
                    b: 56
                }
            ]
        ]);
    });
});
