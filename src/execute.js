'use strict';

const jsonStyle = require('./annotationContext/json/runtime');
const utilStyle = require('./annotationContext/tool/runtime');
const funStyle = require('./annotationContext/fun/runtime');
const varStyler = require('./annotationContext/var/runtimer');
const xmlStyle = require('./annotationContext/xml/runtimer');
const composeStyle = require('./annotationContext/compose/runtime');
const ValueTree = require('./valueTree');
const SourcePathMap = require('./sourcePathMap');

const {
    fromPlain,
    getValue,
    lazyer
} = require('./lazyCode');

let get = (source, path) => {
    let cur = source;
    for (let i = 0, n = path.length; i < n; i++) {
        let item = path[i];
        cur = cur[path[i]];
    }
    return cur;
};

let set = (sandbox, parts, value) => {
    let parent = sandbox;
    if (!parent || typeof parent !== 'object') return;

    if (!parts.length) return;
    for (let i = 0, n = parts.length - 1; i < n; i++) {
        let part = parts[i];
        let next = parent[part];

        if (!next || typeof next !== 'object') {
            next = {};
            parent[part] = next;
        }
        parent = next;
    }

    parent[parts[parts.length - 1]] = value;
    return sandbox;
};

module.exports = (plain, {
    source = {},
    variableMap = {},
    xmlMap
} = {}) => {
    let annotationContext = Object.assign({},
        utilStyle,
        jsonStyle,
        funStyle,
        composeStyle,
        varStyler(variableMap),
        xmlStyle(xmlMap),

        {
            querySource: lazyer(function(ctx, [path]) {
                return get(source, getValue(ctx, path));
            }, 'querySource'),

            sourcePath: lazyer((ctx, [v]) => getValue(ctx, v), 'sourcePath')
        });

    // TODO update XML Node and json node partial
    let programCode = fromPlain(plain, annotationContext);

    let valueTree = ValueTree(programCode);
    let sourcePathMap = SourcePathMap();

    let curPath = null;
    let runtimeCtx = {
        callingStack: [],
        onAfterEvalCode: (codeNode, value) => {
            valueTree.setValue(codeNode, value);
            if (codeNode.type === 'sourcePath') { // find a source path expression
                curPath = value;
            } else if (codeNode.type === 'querySource') { // find a source path expression
                sourcePathMap.add(codeNode, curPath);
            }
        },
        hasCacheValue: valueTree.hasCacheValue,
        getCacheValue: valueTree.getCacheValue
    };

    let programValue = getValue(runtimeCtx, programCode, []);

    let updateSource = (path, v) => {
        // update source object
        set(source, path, v);

        // update value tree

        let result = programValue;

        let codeNodes = sourcePathMap.find(path);
        for (let codeId in codeNodes) {
            result = valueTree.updateValue(codeNodes[codeId], v, runtimeCtx);
        }

        return result;
    };

    return {
        value: programValue,
        updateSource
    };
};
