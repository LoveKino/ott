'use strict';

module.exports = (variableMap) => {
    return {
        lookupVariable: (name) => {
            // TODO check variable type
            if (!variableMap.hasOwnProperty(name)) {
                throw new Error(`missing variable ${name} in variableMap ${JSON.stringify(Object.keys(variableMap))}`);
            }

            return variableMap[name];
        }
    };
};
