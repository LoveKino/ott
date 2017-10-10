let {
    compile,
    execute
} = require('..');
let assert = require('assert');

let quickTest = (text, expect, options) => {
    let plain = compile(text);
    let real = execute(JSON.parse(JSON.stringify(plain)), options).value;
    try {
        assert.deepEqual(real, expect);
    } catch (err) {
        console.log(JSON.stringify(real, null, 4));
        throw err;
    }
};

let testUpdate = (text, options, updates) => {
    let plain = compile(text);
    let {
        updateSource
    } = execute(JSON.parse(JSON.stringify(plain)), options);

    updates.forEach(([path, value, newExpected]) => {
        let newReal = updateSource(path, value);
        assert.deepEqual(newReal, newExpected);
    });
};

let createNode = (tagName, props, children) => {
    return {
        tagName,
        props,
        children
    };
};

module.exports = {
    quickTest,
    createNode,
    testUpdate
};
