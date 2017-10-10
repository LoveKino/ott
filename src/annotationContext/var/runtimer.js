'use strict';

const {
    lazyer
} = require('../../lazyCode');

module.exports = (variableMap) => {
    return {
        lookupVariable: lazyer((ctx, [name]) => {
            // TODO check variable type
            if (!variableMap.hasOwnProperty(name)) {
                throw new Error(`missing variable ${name} in variableMap ${JSON.stringify(Object.keys(variableMap))}`);
            }

            return variableMap[name];
        }, 'lookupVariable')
    };
};
