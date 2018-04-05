'use strict';

let {
  buildGrammer
} = require('ast-transfer');
let fs = require('fs');
let promisify = require('es6-promisify');
let path = require('path');

let readFile = promisify(fs.readFile);
let writeFile = promisify(fs.writeFile);

const GRAMMER_TXT = path.join(__dirname, '../grammer/grammer.txt');
const LR1TableJsPath = path.join(__dirname, '../res/grammer.js');

let generateGrammer = async() => {
  let grammerText = await readFile(GRAMMER_TXT, 'utf-8');
  await writeFile(LR1TableJsPath, `module.exports=${JSON.stringify(buildGrammer(grammerText))}`, 'utf-8');
};

generateGrammer();
