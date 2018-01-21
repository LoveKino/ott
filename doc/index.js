'use strict';

const packageCollector = require('docway/collectors/node/package');
const path = require('path');
const sampleCollector = require('docway/collectors/sample');
const simpleDocTemplate = require('docway/templates/simple/docTemplate.js');
const puppeteer = require('puppeteer');

const headlessOpen = async(url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle'
    });

    return {
        kill: () => {
            browser.close();
        }
    };
};

module.exports = {
    template: simpleDocTemplate,

    docResDir: __dirname, // we need a doc resource dir which we can used to store images, documents, ...

    target: path.join(__dirname, '../README.md'),

    content: {
        topic: 'Calling local browser to run some js code and return the result to you. You can use both nodeJs interfaces or CLI interfaces.',
        features: [
            'Run js code in browser, get results, can be async.',
            'Easy to run js code in different browsers.',
            'Make ajax easy to test.'
        ],
        licensePath: './LICENSE'
    },

    collectors: [{
        name: 'module',
        collector: packageCollector,
        data: path.join(__dirname, '../package.json')
    }, {
        name: 'cliSamples',
        collector: sampleCollector,
        data: {
            samples: require('../sample/quickCLISample.js'),
            options: {
                capture: true
            }
        }
    }, {
        name: 'apiSamples',
        collector: sampleCollector,
        data: {
            samples: require('../sample/quickAPISample.js'),
            options: {
                capture: true
            }
        }
    }],

    subDocuments: [],

    captureOptions: {
        open: headlessOpen
    }
};
