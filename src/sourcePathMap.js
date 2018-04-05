'use strict';

/**
 *
 * build source path map tree by source tree
 */

const Node = function() {
  this.children = {};
  this.codeNodes = {};
};

Node.prototype.addChild = function(key, child) {
  this.children[key] = child;
};

Node.prototype.addCodeNode = function(path, codeNode) {
  let cur = this;

  for (let i = 0, n = path.length; i < n; i++) {
    const item = path[i];
    if (!cur.children[item]) {
      const next = new Node();
      cur.addChild(item, next);
      cur = next;
    } else {
      cur = cur.children[item];
    }
  }

  cur.codeNodes[codeNode.id] = codeNode;
};

/**
 * find the nearest bottom node in the path
 *
 * eg1: >a>b, with update path .a.b
 * eg2: >list, with update path .list.0
 */
Node.prototype.findNearestDescendant = function(path) {
  let cur = this;
  let sourcePath = [];

  for (let i = 0, n = path.length; i < n; i++) {
    const item = path[i];
    const next = cur.children[item];
    if (!next) {
      if (i > 0) {
        return {
          node: cur,
          sourcePath
        };
      } else { // did not match anyone
        return null;
      }
    } else {
      sourcePath.push(item);
      cur = next;
    }
  }
  return {
    node: cur,
    sourcePath
  };
};

const assembleCodeNodes = ({
  node,
  sourcePath
}) => {
  // TODO opt
  let results = {};
  for (let codeId in node.codeNodes) {
    results[codeId] = {
      sourcePath,
      codeNode: node.codeNodes[codeId]
    };
  }

  for (let name in node.children) {
    const ret = assembleCodeNodes({
      node: node.children[name],
      sourcePath: sourcePath.concat([name])
    });

    // merge child result
    results = Object.assign(results, ret);
  }

  return results;
};

module.exports = () => {
  let root = new Node();

  return {
    /**
         * add relationship between codeNode and source path
         */
    add: (codeNode, path) => {
      root.addCodeNode(path, codeNode);
    },

    /**
         * try to find code nodes which need to update.
         */
    find: (path) => {
      let nearest = root.findNearestDescendant(path);
      if (nearest) {
        return assembleCodeNodes(nearest);
      }

      return null;
    }
  };
};
