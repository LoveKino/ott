'use strict';

const {
    lazyer
} = require('../lazy');

const defCreateNode = (tagName, props, children) => {
    return {
        tagName,
        props,
        children
    };
};

module.exports = ({
    createNode = defCreateNode
} = {}) => {
    return {
        xmlNode: lazyer((xmlClass, props, children, closexmlClass) => {
            if (xmlClass !== closexmlClass) {
                throw new Error(`xml tag does not close correctly. start tag is ${xmlClass}, close tag is ${closexmlClass}`);
            }

            // TODO check close tag
            return createNode(xmlClass, props, children);
        }),

        // >text...</
        parseXmlCharTextWithInnerBracket: (text) => {
            return text.substring(1, text.length - 2).trim();
        }
    }
};
