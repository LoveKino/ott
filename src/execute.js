'use strict';

const jsonStyle = require('./annotationContext/json/runtime');
const utilStyle = require('./annotationContext/tool/runtime');
const xmlStyle = require('./annotationContext/xml/runtimer');
const ValueTree = require('./valueTree');
const SourcePathMap = require('./sourcePathMap');
const {
    RuntimeContext
} = require('./runtimeContext');

const {
    fromPlain,
    getValue,
    lazyer
} = require('./lazyCode');

let get = (source, path) => {
    let cur = source;
    for (let i = 0, n = path.length; i < n; i++) {
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
    xmlMap,
    onUpdate
} = {}) => {
    let annotationContext = Object.assign({},
        utilStyle,
        jsonStyle,
        xmlStyle(xmlMap),

        {
            querySource: lazyer(function(ctx, [path]) {
                return get(source, getValue(ctx, path));
            }, 'querySource'),

            sourcePath: lazyer((ctx, [v]) => getValue(ctx, v), 'sourcePath')
        });

    let programCode = fromPlain(plain, annotationContext);

    let valueTree = ValueTree(programCode);
    let sourcePathMap = SourcePathMap();

    let curPath = null;
    let runtimeOptions = {
        onAfterEvalCode: (codeNode, value, runtimeCtx) => {
            // update valueTree with new value
            valueTree.setValue(codeNode, runtimeCtx, value);

            if (codeNode.type === 'sourcePath') { // find a source path expression
                curPath = value;
            } else if (codeNode.type === 'querySource') { // find a source path expression
                sourcePathMap.add(codeNode, curPath);
            }
        },
        hasCacheValue: valueTree.hasCacheValue,
        getCacheValue: valueTree.getCacheValue
    };

    let programValue = getValue(new RuntimeContext(variableMap, null, runtimeOptions), programCode, []);

    // TODO check reasonable path
    let updateSource = (path, v) => {
        // update source object
        set(source, path, v);

        // update value tree
        const codeNodes = sourcePathMap.find(path);

        for (let codeId in codeNodes) {
            // TODO runtimeCtx
            const {
                codeNode,
                sourcePath
            } = codeNodes[codeId];
            let {
                updated,
                value
            } = valueTree.updateValue(codeNode, get(source, sourcePath), {
                onUpdate
            });

            if (updated) {
                programValue = value;
            }
        }

        return programValue;
    };

    return {
        value: programValue,
        updateSource
    };
};
