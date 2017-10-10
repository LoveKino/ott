'use strict';

let _code_node_id_count = 0;

/**
 * Normally, when reduce a production, will new a LazyCode object
 *
 * TODO fast way to indicate ancestor-descendant relationship
 */
let LazyCode = function(args, fn, type) {
    this.args = args;
    this.fn = fn;
    this.type = type;

    this.id = 'code_node-' + _code_node_id_count++;
};

LazyCode.prototype.getValue = function(runtimeCtx) {
    if (runtimeCtx.hasCacheValue && runtimeCtx.hasCacheValue(this)) {
        return runtimeCtx.getCacheValue(this);
    }

    return this.execute(runtimeCtx);
};

LazyCode.prototype.execute = function(runtimeCtx) {
    runtimeCtx.onBeforeEvalCode && runtimeCtx.onBeforeEvalCode(this);

    // run code
    runtimeCtx.callingStack.push(this);
    let value = this.fn(runtimeCtx, this.args);
    runtimeCtx.callingStack.pop();

    runtimeCtx.onAfterEvalCode && runtimeCtx.onAfterEvalCode(this, value);
    return value;
};

let fromPlain = (plainObj, classMap) => {
    if (plainObj.classType === 'Base') return plainObj.value;

    let {
        type,
        args
    } = plainObj;

    let lazyerInst = classMap[type];

    if (typeof lazyerInst !== 'function') {
        throw new Error(`can not found function from type ${type}.`);
    }

    let params = [];
    for (let i = 0, n = args.length; i < n; i++) {
        params[i] = fromPlain(args[i], classMap);
    }

    return lazyerInst(...params);
};

let getValue = (runtimeCtx, v) => {
    if (v instanceof LazyCode) {
        // TODO try-catch and display calling stack information
        return v.getValue(runtimeCtx);
    }
    return v;
};

let lazyer = (fn, type) => {
    return (...args) => {
        return new LazyCode(args, fn, type);
    };
};

module.exports = {
    getValue,
    lazyer,
    fromPlain,
    LazyCode
};
