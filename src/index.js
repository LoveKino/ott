'use strict';

const {
    grammer,
    annotations,
    lr1table
} = require('../res/grammer');
const tokenTypes = require('../grammer/tokenTypes');
const astTransfer = require('ast-transfer');

let LazyCode = function(args, fn) {
    this.args = args;
    this.fn = fn;
}

LazyCode.prototype.getValue = function() {
    let params = [];
    for (let i = 0, n = this.args.length; i < n; i++) {
        params[i] = getValue(this.args[i]);
    }
    return this.fn.apply(undefined, params);
}

let getValue = (v) => {
    if (v instanceof LazyCode) {
        return v.getValue();
    }
    return v;
}

let lazyer = (fn) => (...args) => {
    return new LazyCode(args, fn);
};

const jsonStyleAnnotationContext = {
    number: (v) => Number(v),
    string: (v) => JSON.parse(v),
    'null': null,
    'true': true,
    'false': false,
    array: lazyer((...args) => args),
    object: lazyer((pairs) => {
        let ret = {};
        if (!pairs) return ret;
        for (let i = 0, n = pairs.length; i < n; i++) {
            let [key, value] = pairs[i];
            ret[key] = value;
        }
        return ret;
    })
};

const utilAnnorationContext = {
    id: v => v,
    appendTo: lazyer((v, list) => [v].concat(list))
};


const defCreateNode = (tagName, props, children) => {
    return {
        tagName,
        props,
        children
    };
};

let parser = ({
    variableMap = {},
    xmlMap: {
        createNode = defCreateNode
    } = {}
} = {}) => {
    let parse = astTransfer.parser({
        grammer,
        lr1table,
        annotations,
        annotationContext: Object.assign({}, utilAnnorationContext, jsonStyleAnnotationContext, {
            lookupVariable: (name) => {
                // TODO check variable type
                if (!variableMap.hasOwnProperty(name)) {
                    throw new Error(`missing variable ${name} in variableMap ${JSON.stringify(Object.keys(variableMap))}`);
                }

                return variableMap[name];
            },

            applyFun: lazyer((fun, args) => {
                return fun.apply(undefined, args);
            }),

            xmlNode: lazyer((xmlClass, props, children, closexmlClass) => {
                if (xmlClass !== closexmlClass) {
                    throw new Error(`xml tag does not close correctly. start tag is ${xmlClass}, close tag is ${closexmlClass}`);
                }

                // TODO check close tag
                return createNode(xmlClass, props, children);
            }),
            parseXmlCharTextWithInnerBracket: (text) => {
                return text.substring(1, text.length - 2).trim();
            }
        }),
        tokenTypes,
        processTokens: (tokens) => {
            let ret = [];
            for (let i = 0, n = tokens.length; i < n; i++) {
                if (tokens[i].name !== 'whitespace') {
                    ret.push(tokens[i]);
                }
            }
            return ret;
        }
    });

    return (chunk) => {
        if (chunk !== null) {
            parse(chunk);
        } else {
            return getValue(parse(null));
        }
    };
};

let compile = (text, options) => {
    let parse = parser(options);
    parse(text);
    return parse(null);
};

module.exports = {
    parser,
    compile
};
