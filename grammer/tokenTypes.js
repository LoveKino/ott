'use strict';

let {
    jsonStringExpStr,
    jsonNumberExpStr,
} = require('cl-fsm/lib/commonTokenReg');
let {
    buildFSM
} = require('stream-token-parser');

let whitespace = '[\\f\\n\\r\\t\\v ][\\f\\n\\r\\t\\v ]*';
let pathNodeName = '\\.[\\_\\%a-zA-Z0-9][\\_\\%a-zA-Z0-9]*';
let variableName = '[\\_a-zA-Z][\\_a-zA-Z0-9]*'; //_abc, abc, ej89

let xmlCharTextWithInnerBracket = '\\>[\\f\\n\\r\\t\\v ]*^[\\{\\<\\>\\}]^[\\<\\>]*^[\\}\\{\\<\\>]?[\\f\\n\\r\\t\\v ]*\\</';

module.exports = [

    {
        priority: 1,
        match: 'true',
        name: 'true'
    }, {
        priority: 1,
        match: 'false',
        name: 'false'
    }, {
        priority: 1,
        match: 'null',
        name: 'null'
    }, {
        priority: 1,
        match: buildFSM(jsonStringExpStr),
        name: 'string'
    }, {
        priority: 1,
        match: buildFSM(jsonNumberExpStr),
        name: 'number'
    },
    {
        priority: 1,
        match: buildFSM(xmlCharTextWithInnerBracket),
        name: 'xmlCharTextWithInnerBracket'
    },

    {
        priority: 1,
        match: buildFSM(pathNodeName),
        name: 'pathNodeName'
    },
    {
        priority: 1,
        match: buildFSM(variableName),
        name: 'variableName'
    },

    //
    {
        priority: 1,
        match: '=',
        name: 'assign'
    },
    {
        priority: 1,
        match: ';',
        name: 'semicolon'
    },
    {
        priority: 1,
        match: ':',
        name: 'colon'
    },

    // brackets
    {
        priority: 1,
        match: '(',
        name: '('
    },
    {
        priority: 1,
        match: ')',
        name: ')'
    },
    {
        priority: 1,
        match: '<',
        name: '<'
    },
    {
        priority: 1,
        match: '</',
        name: '</'
    },
    {
        priority: 1,
        match: '/>',
        name: '/>'
    },

    {
        priority: 1,
        match: '>',
        name: '>'
    },

    {
        priority: 1,
        match: '[',
        name: '['
    },
    {
        priority: 1,
        match: ']',
        name: ']'
    },
    {
        priority: 1,
        match: '{',
        name: '{'
    },
    {
        priority: 1,
        match: '}',
        name: '}'
    },
    {
        priority: 1,
        match: '.',
        name: '.'
    },
    {
        priority: 1,
        match: '?',
        name: '?'
    },
    {
        priority: 1,
        match: '->',
        name: '->'
    },

    {
        priority: 1,
        match: ',',
        name: ','
    },
    {
        priority: 1,
        match: buildFSM(whitespace),
        name: 'whitespace'
    }
];
