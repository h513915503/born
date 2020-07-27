#!/usr/bin/env node

const semver = require('semver')
const { error } = require('../lib/utils.js')
const requiredVersion = require('../package.json').engines.node

if (! semver.satisfies(process.version, requiredVersion, { includePrerelease: true })) {
  error(
    `You are using Node ${process.version}, but vue-cli-service ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  )
  process.exit(1)
}

const program = require('commander')
const path = require('path')
const child_process = require('child_process')

const resolve = dir => path.join(__dirname, dir)
const package = require(resolve('../package.json'))

const corePlugins = ['list', 'add', 'detail']

function getResolvePath(type, isPage) {
    const createFileType = isPage ? 'createPage' : 'createTemplate'

    if (corePlugins.includes(type)) {
        return resolve(`../lib/${type}/${createFileType}.js`)
    }

    error(`${type} is not supported.`)

    process.exit(1)
}

program
  .version(package.version)
  .description(package.description)

program
    .command('createTemplate')
    .alias('ct')
    .description('创建 template.js')
    .option('-t, --type [type]', '模板类型', 'list')
    .action((argv) => {
        child_process.fork(getResolvePath(argv.type))
    })

program
    .command('createPage')
    .alias('cp')
    .description('创建模板页面')
    .option('-t, --type [type]', '模板类型', 'list')
    .action((argv) => {
        child_process.fork(getResolvePath(argv.type, true))
    })

program.parse(process.argv)