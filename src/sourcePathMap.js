'use strict';

let Node = function() {
    this.children = {};
    this.codeNodes = {};
};

Node.prototype.addChild = function(key, child) {
    this.children[key] = child;
};

Node.prototype.addCodeNode = function(path, codeNode) {
    let cur = this;

    for (let i = 0, n = path.length; i < n; i++) {
        let item = path[i];
        if (!cur.children[item]) {
            let next = new Node();
            cur.addChild(item, next);
            cur = next;
        } else {
            cur = cur.children[item];
        }
    }

    cur.codeNodes[codeNode.id] = codeNode;
};

Node.prototype.findDescendant = function(path) {
    let cur = this;
    for (let i = 0, n = path.length; i < n; i++) {
        let item = path[i];
        cur = cur.children[item];
        if (!cur) return null;
    }
    return cur;
};

Node.prototype.assembleCodeNodes = function() {
    let codeNodes = {};

    for (let id in this.codeNodes) {
        codeNodes[id] = this.codeNodes[id];
    }

    for (let name in this.children) {
        let ret = this.children[name].assembleCodeNodes();
        for (let id in ret) {
            codeNode[id] = ret[id];
        }
    }

    return codeNodes;
};

module.exports = () => {
    let root = new Node();

    return {
        add: (codeNode, path) => {
            root.addCodeNode(path, codeNode);
        },

        find: (path) => {
            let node = root.findDescendant(path);
            return node.assembleCodeNodes();
        }
    };
};
