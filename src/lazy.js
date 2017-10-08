'use strict';

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

module.exports = {
    getValue,
    lazyer
};
