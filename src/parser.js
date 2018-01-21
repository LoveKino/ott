'use strict';

const {
    grammer,
    annotations,
    lr1table
} = require('../res/grammer');
const tokenTypes = require('../grammer/tokenTypes');
const astTransfer = require('ast-transfer');
const {
    toPlain,
    lazyStuber
} = require('./lazyStub');

const jsonStyle = require('./annotationContext/json/stub');
const utilStyle = require('./annotationContext/tool/stub');
const xmlStyle = require('./annotationContext/xml/stub');
const {
    ignore
} = require('./tokenProcess');

let annotationContext = Object.assign({},
    utilStyle,
    jsonStyle,
    xmlStyle,

    {
        pathNode: (pathNodeName) => {
            return pathNodeName.substring(1);
        },
        querySource: lazyStuber('querySource'),
        sourcePath: lazyStuber('sourcePath')
    });

const parser = () => {
    const parse = astTransfer.parser({
        grammer,
        lr1table,
        annotations,
        annotationContext,
        tokenTypes,
        processTokens: ignore({
            'whitespace': 1
        })
    });

    return (chunk) => {
        if (chunk !== null) {
            parse(chunk);
        } else {
            const stub = parse(null);
            const plain = toPlain(stub);
            return plain;
        }
    };
};

const compile = (text, options) => {
    let parse = parser(options);
    parse(text);
    return parse(null);
};

module.exports = {
    parser,
    compile
};
