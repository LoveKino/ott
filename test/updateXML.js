'use strict';

const {
    testUpdate
} = require('./util');
const assert = require('assert');

const reflectTree = () => {
    let realTree = null;

    let count = 0;

    const createNode = function(tagName, props, children) {
        const node = {
            tagName,
            props,
            children,
        };

        return node;
    };

    const updateNode = function([tagName, props, children], e) {
        if (!e.stop) {
            e.currentValue.tagName = tagName;
            e.currentValue.props = props;
            e.currentValue.children = children;
            e.stop = true;

            // update realtree
            const realNode = nodeMap[e.currentValue.ref];
            realNode.tagName = tagName;
            realNode.props = props;

            // update children
            realNode.children = children.map(mountHelper);
        }

        return e.currentValue;
    };

    const nodeMap = {};

    const mount = (value) => {
        realTree = mountHelper(value);
    };

    const mountHelper = (value, parent) => {
        if (typeof value === 'object') {
            const id = value.ref || count++;
            let node = {
                id,
                tagName: value.tagName,
                props: value.props,
                parent
            };
            let children = value.children.map((item) => mountHelper(item, node));
            node.children = children;
            value.ref = id;
            nodeMap[id] = node;

            return node;
        } else {
            return value;
        }
    };

    const getRealTree = () => {
        return realTree;
    };

    return {
        createNode,
        updateNode,
        mount,
        getRealTree
    };
};

describe('on update', () => {
    it('base', () => {
        const {
            mount,
            createNode,
            updateNode,
            getRealTree
        } = reflectTree();

        testUpdate('<div><span>{.text}</span></div>', {
            source: {
                text: 'text1'
            },

            xmlMap: {
                createNode,
                updateNode
            }
        }, [
            [
                ['text'], 'text2', {
                    'children': [{
                        'children': [
                            'text2'
                        ],
                        'props': {},
                        'tagName': 'span',
                        ref: 1
                    }],
                    'props': {},
                    'tagName': 'div',
                    ref: 0
                }
            ]
        ], mount);

        const realTree = getRealTree();
        assert.deepEqual(realTree.children[0].children[0], 'text2');
    });

    it('update xml props', () => {
        const {
            mount,
            createNode,
            updateNode,
            getRealTree
        } = reflectTree();

        testUpdate('<p><span id=.id></span></p>', {
            source: {
                id: 0
            },

            xmlMap: {
                createNode,
                updateNode
            }
        }, [
            [
                ['id'], 1, {
                    'children': [{
                        'children': [],
                        'props': {
                            id: 1
                        },
                        'tagName': 'span',
                        ref: 1
                    }],
                    'props': {},
                    'tagName': 'p',
                    ref: 0
                }
            ]
        ], mount);

        const realTree = getRealTree();
        assert.deepEqual(realTree.children[0].props.id, 1);
    });

    it('update xml structure', () => {
        const {
            mount,
            createNode,
            updateNode,
            getRealTree
        } = reflectTree();

        testUpdate('<p>{ .flag? <span>1</span>: 2 }</p>', {
            source: {
                flag: false
            },

            xmlMap: {
                createNode,
                updateNode
            }
        }, [
            [
                ['flag'], true, {
                    'children': [{
                        'children': ['1'],
                        'tagName': 'span',
                        props: {},
                        ref: 1
                    }],
                    'props': {},
                    'tagName': 'p',
                    ref: 0
                }
            ]
        ], mount);

        const realTree = getRealTree();
        assert.deepEqual(realTree.children[0].children[0], 1);
    });
});
