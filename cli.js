#!/usr/bin/env node
const program = require('commander')
const api = require('./index')
const pkg = require('./package.json')
program
    .version(pkg.version)
    .option('-x, --xxx', 'what the x')
program
    .command('add')
    .arguments('[args...]')
    .description('add a task')
    .action((args) => {
        const words = args.join(' ')
        api.add(words)
            .then(() => { console.log('添加成功'); },
                () => { console.log('添加失败'); })
    });
program
    .command('clear')
    .arguments('[args...]')
    .description('clear a task')
    .action((args) => {
        api.clear().then(() => { console.log('清除成功'); },
            () => { console.log('清除失败'); })
    });

program.parse(process.argv)
if (process.argv.length === 2) {
    api.showAll()
}

