'use strict';

module.exports = () => {
    let pathMap = {};

    return {
        add: (codeNode, path) => {
            pathMap[path.join('.')] = codeNode;
        },
        find: (path) => {
            return [pathMap[path.join('')]];
        }
    };
};
