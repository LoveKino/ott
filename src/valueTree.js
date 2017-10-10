'use strict';

let {
    LazyCode
} = require('./lazyCode');

/**
 * Store the solving process
 */

let ValueNode = function(codeNode) {
    this.codeNode = codeNode;
    this.children = [];
    this.resolved = false;
    this.id = codeNode.id;
};

ValueNode.prototype.getValue = function(runtimeCtx) {
    if (this.resolved) return this.value;
    this.setValue(this.codeNode.getValue());
    return this.value;
};

ValueNode.prototype.reValue = function(runtimeCtx) {
    this.setValue(this.codeNode.execute(runtimeCtx));
};

ValueNode.prototype.setValue = function(value) {
    this.resolved = true;
    this.value = value;
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

    return this.value;
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

    let valueRoot = buildValueTree(root);

    return {
        setValue: (codeNode, value) => {
            valueNodeMap[codeNode.id].setValue(value);
        },

        hasCacheValue: (codeNode) => {
            return !!valueNodeMap[codeNode.id].resolved;
        },

        getCacheValue: (codeNode) => {
            return valueNodeMap[codeNode.id].value;
        },

        updateValue: (codeNode, newValue, runtimeCtx) => {
            let valueNode = valueNodeMap[codeNode.id];
            valueNode.setValue(newValue);
            return valueNode.bubbleChange(runtimeCtx);
        }
    };
};
