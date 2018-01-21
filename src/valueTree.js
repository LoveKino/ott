'use strict';

let {
    LazyCode
} = require('./lazyCode');

/**
 * Store the solving process
 */

let ValueNode = function(codeNode) {
    this.codeNode = codeNode;
    this.id = codeNode.id;

    this.children = [];

    this.valueMap = {};
    this.runtimeCtxMap = {};
};

ValueNode.prototype.setValue = function(runtimeCtx, value) {
    this.valueMap[runtimeCtx.id] = value;
    this.runtimeCtxMap[runtimeCtx.id] = runtimeCtx;
};

ValueNode.prototype.getValue = function(runtimeCtx) {
    if (!this.hasCacheValue(runtimeCtx)) {
        this.setValue(runtimeCtx, this.codeNode.getValue(runtimeCtx));
    }

    return this.valueMap[runtimeCtx.id];
};

ValueNode.prototype.hasCacheValue = function(runtimeCtx) {
    return this.valueMap.hasOwnProperty(runtimeCtx.id);
};

ValueNode.prototype.reValue = function(runtimeCtx) {
    this.setValue(runtimeCtx, this.codeNode.execute(runtimeCtx));
};

ValueNode.prototype.addChild = function(child) {
    if (child instanceof ValueNode) {
        child.parent = this;
    }
    this.children.push(child);
};

/**
 *  valueNode bubble a change, it will influence of it's parent's value
 *  and cycle to root value
 */
ValueNode.prototype.bubbleChange = function(runtimeCtx) {
    if (this.parent) {
        this.parent.reValue(runtimeCtx);
        return this.parent.bubbleChange(runtimeCtx);
    }

    return this.getValue(runtimeCtx);
};

module.exports = (root) => {
    let valueNodeMap = {};

    let buildValueTree = (root) => {
        if (!(root instanceof LazyCode)) return root;
        let rootValueNode = new ValueNode(root);
        valueNodeMap[root.id] = rootValueNode;

        let args = root.args || [];

        for (let i = 0, n = args.length; i < n; i++) {
            let item = args[i];
            rootValueNode.addChild(buildValueTree(item));
        }

        return rootValueNode;
    };

    buildValueTree(root);

    return {
        setValue: (codeNode, runtimeCtx, value) => {
            valueNodeMap[codeNode.id].setValue(runtimeCtx, value);
        },

        hasCacheValue: (codeNode, runtimeCtx) => {
            return valueNodeMap[codeNode.id].hasCacheValue(runtimeCtx);
        },

        getCacheValue: (codeNode, runtimeCtx) => {
            return valueNodeMap[codeNode.id].getValue(runtimeCtx);
        },

        updateValue: (codeNode, newValue) => {
            let valueNode = valueNodeMap[codeNode.id];

            let result = {
                updated: false
            };

            for (let ctxId in valueNode.valueMap) {
                let runtimeCtx = valueNode.runtimeCtxMap[ctxId];
                valueNode.setValue(runtimeCtx, newValue);
                result.value = valueNode.bubbleChange(runtimeCtx);
                result.updated = true;
            }

            return result;
        }
    };
};
