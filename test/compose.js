'use strict';

let {
    quickTest
} = require('./util');

describe('compose', () => {
    it('path query as attr', () => {
        quickTest('<div id=.a.b/>', {
            'tagName': 'div',
            'props': {
                'id': '0123'
            },
            'children': []
        }, {
            source: {
                a: {
                    b: '0123'
                }
            }
        });
    });
});
