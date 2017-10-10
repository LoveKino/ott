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
const funStyle = require('./annotationContext/fun/stub');
const varStyler = require('./annotationContext/var/stub');
const xmlStyle = require('./annotationContext/xml/stub');
const {
    ignore
} = require('./tokenProcess');

let get = (source, path) => {
    let cur = source;
    for (let i = 0, n = path.length; i < n; i++) {
        let item = path[i];
        cur = cur[path[i]];
    }
    return cur;
};

let parser = () => {
    let annotationContext = Object.assign({},
        utilStyle,
        jsonStyle,
        funStyle,
        varStyler,
        xmlStyle,

        {
            pathNode: (pathNodeName) => {
                return pathNodeName.substring(1);
            },
            querySource: lazyStuber('querySource'),
            sourcePath: lazyStuber('sourcePath')
        });

    let parse = astTransfer.parser({
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
            let stub = parse(null);
            let plain = toPlain(stub);
            return plain;
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
