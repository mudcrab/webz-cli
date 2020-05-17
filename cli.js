#!/usr/bin/env node

const indexTs = `import 'reflect-metadata';
import { init } from '@khv/webz/config';
import { join } from 'path';

init({
  controllers: join(__dirname, 'controllers'),
  enableSystemController: true,
  dbConfig: null,
});
`;

const tsconfig = `{
  "extends": "./node_modules/@khv/webz/tsconfig.json",
  "compilerOptions": {
    "outDir": "./build",
    "moduleResolution": "node",
    "baseUrl": "../src",
  }
}
`;

const { load, run } = require('npm');
const { basename, resolve, join } = require('path');
const { writeFile, readFile, mkdir } = require('fs').promises;
const { existsSync } = require('fs');

const args = require('args').option('init', 'Initialize a new project').option('dev', 'Start server');

const flags = args.parse(process.argv);

if (flags.init) {
  const p = require('./package.sample.json');

  p.name = basename(resolve());

  writeFile(join(resolve(), 'package.json'), JSON.stringify(p, null, 2), 'utf8')
    .then(() => (existsSync(join(resolve(), 'src')) ? Promise.resolve() : mkdir(join(resolve(), 'src'))))
    .then((f) => writeFile(join(resolve(), 'src', 'index.ts'), indexTs, 'utf8'))
    .then((f) => writeFile(join(resolve(), 'tsconfig.json'), tsconfig, 'utf8'))
    .catch((err) => console.log(err));
}

if (flags.dev) {
  load(() => run('dev'));
}
