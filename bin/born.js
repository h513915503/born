#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const child_process = require('child_process')

const resolve = dir => path.join(__dirname, dir)
const package = require(resolve('../package.json'))

program
  .version(package.version)
  .description(package.description)

program
    .command('createTemplate')
    .alias('ct')
    .description('创建 template.js')
    .action(() => {
        child_process.fork(resolve('../lib/createTemplate.js'))
    })

program
    .command('createPage')
    .alias('cp')
    .description('创建模板页面')
    .action(() => {
        child_process.fork(resolve('../lib/createPage.js'))
    })

program.parse(process.argv)