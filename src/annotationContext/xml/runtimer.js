'use strict';

const {
    getValue,
    lazyer
} = require('../../lazyCode');

const defCreateNode = (tagName, props, children) => {
    return {
        tagName,
        props,
        children
    };
};

module.exports = ({
    createNode = defCreateNode,
    updateNode
} = {}) => {
    let updateFn = null;
    if (updateNode) {
        updateFn = (ctx, [xmlClass, props, children], options) => {
            props = getValue(ctx, props);
            children = getValue(ctx, children);
            return updateNode([xmlClass, props, children], options);
        };
    }
    return {
        xmlNode: lazyer((ctx, [xmlClass, props, children]) => {
            props = getValue(ctx, props);
            children = getValue(ctx, children);
            return createNode(xmlClass, props, children);
        }, 'xmlNode', updateFn)
    };
};
