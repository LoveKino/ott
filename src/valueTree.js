'use strict';

const {
    LazyCode
} = require('./lazyCode');

/**
 * Store the solving process
 */

const ValueNode = function(codeNode) {
    this.codeNode = codeNode;
    this.id = codeNode.id;

    this.children = [];

    this.valueMap = {}; // associate different context with current code node
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

/**
 * re-calculate value for value node.
 */
ValueNode.prototype.reValue = function(runtimeCtx, e) {
    e.currentValue = this.valueMap[runtimeCtx.id];
    e.current = this;
    this.setValue(runtimeCtx, this.codeNode.execute(runtimeCtx, true, e));
};

ValueNode.prototype.addChild = function(child) {
    if (child instanceof ValueNode) {
        child.parent = this;
    }
    this.children.push(child);
};

/**
 *  After update current node's value, bubble change event to parent node and re-evaluate node.
 *  valueNode bubble a change, it will influence of it's parent's value
 *  and cycle to root value
 */
ValueNode.prototype.bubbleChange = function(runtimeCtx, e) {
    const node = this.parent;
    if (node) {
        node.reValue(runtimeCtx, e);
        return node.bubbleChange(runtimeCtx, e);
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
                const runtimeCtx = valueNode.runtimeCtxMap[ctxId];
                // set current value for valueNode
                valueNode.setValue(runtimeCtx, newValue);

                // bubble changes
                result.value = valueNode.bubbleChange(runtimeCtx, {
                    source: valueNode
                });
                result.updated = true;
            }

            return result;
        }
    };
};
