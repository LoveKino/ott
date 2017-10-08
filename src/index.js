'use strict';

const {
    grammer,
    annotations,
    lr1table
} = require('../res/grammer');
const tokenTypes = require('../grammer/tokenTypes');
const astTransfer = require('ast-transfer');
const {
    getValue,
    lazyer
} = require('./lazy');

const jsonStyleAnnotationContext = require('./annotationContext/jsonStyle');
const utilAnnotationContext = require('./annotationContext/utilContext');
const funStyleAnnotationContext = require('./annotationContext/funStyle');
const variableContexter = require('./annotationContext/variableContexter');
const xmlStyleContexter = require('./annotationContext/xmlStyleContexter');

const defCreateNode = (tagName, props, children) => {
    return {
        tagName,
        props,
        children
    };
};

let get = (source, path) => {
    let cur = source;
    for (let i = 0, n = path.length; i < n; i++) {
        let item = path[i];
        cur = cur[path[i]];
    }
    return cur;
};

let parser = ({
    source = {},
    variableMap = {},
    xmlMap
} = {}) => {
    let annotationContext = Object.assign({},
        utilAnnotationContext,
        jsonStyleAnnotationContext,
        funStyleAnnotationContext,
        variableContexter(variableMap),
        xmlStyleContexter(xmlMap), {
            pathNode: (pathNodeName) => {
                return pathNodeName.substring(1);
            },
            querySource: lazyer((path) => {
                return get(source, path);
            })
        });

    let parse = astTransfer.parser({
        grammer,
        lr1table,
        annotations,
        annotationContext,
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
