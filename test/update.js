'use strict';

let {
    createNode,
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
});
