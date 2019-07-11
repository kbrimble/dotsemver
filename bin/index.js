#!/usr/bin/env node

// eslint-disable-next-line no-global-assign
require = require('esm')(module)
/* eslint-disable indent */
const argv = require('yargs')
            .command('$0 <filename> [encoding]', 'Parse semver file', yargs => {
                yargs.positional('filename', {
                describe: 'Path to semver file to parse',
                type: 'string'
                }).positional('encoding', {
                describe: 'Encoding of supplied file',
                default: 'utf8',
                choices: ['ascii', 'utf8', 'ucs2', 'utf16le', 'base64', 'latin1', 'binary', 'hex']
                })
            })
            .demandCommand()
            .help()
            .argv
/* eslint-enable indent */

const filename = argv.filename
const encoding = argv.encoding || 'utf8'

const version = require('../lib/dotsemver').parseSemVerFromFile(filename, encoding)
// eslint-disable-next-line no-console
console.log(version)
