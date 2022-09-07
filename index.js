const db = require('./db.js')
const inquirer = require('inquirer');
module.exports.add = async (title) => {
    //读取之前的任务
    const list = await db.read()
    // 往里面加一个title任务
    list.push({ title, done: false })
    // 存储任务到文件
    db.write(list)
    // fs.readFile(dbPath, { flag: 'a+' }, (error, data) => {
    //     if (error) { console.log(error); }
    //     else {
    //         let list
    //         try {
    //             list = JSON.parse(data.toString())
    //         } catch (error2) {
    //             list = []
    //         }
    //         const task = {
    //             title: title,
    //             done: false
    //         }
    //         list.push(task)
    //         const string = JSON.stringify(list)
    //         fs.writeFile(dbPath, string, (error3) => {
    //             if (error3) {
    //                 console.log(error3);
    //             }
    //         })
    //         console.log(list)
    //     }
    // })

}
module.exports.clear = async () => {
    await db.write([])
}
function askForCreateTask(list) {
    inquirer.prompt({
        type: 'input', name: 'title',
        message: "输入任务标题",
    }).then(answer => {
        list.push({ title: answer.title, done: false })
        db.write(list)
    })
}
function askForAction(list, index) {
    inquirer
        .prompt({
            type: 'list', name: 'action',
            message: '请选择操作',
            choices: [
                { name: '已完成', value: 'markAsDone' },
                { name: '未完成', value: 'markAsUnDone' },
                { name: '删除', value: 'remove' },
                { name: '改标题', value: 'updateTitle' },
                { name: '退出', value: 'quit' }

            ]
        }).then(answers2 => {
            switch (answers2.action) {
                case 'markAsDone':
                    list[index].done = true
                    db.write(list)
                    break;
                case 'markAsUnDone':
                    list[index].done = false
                    db.write(list)
                    break;
                case 'updateTitle':
                    inquirer.prompt({
                        type: 'input', name: 'title',
                        message: "新的标题",
                        default: list[index].title
                    }).then(answer => {
                        list[index].title = answer.title
                        db.write(list)
                    })
                    break;
                case 'remove':
                    list.splice(index, 1)
                    db.write(list)
                    break;
            }
        })
}
function printTasks(list) {
    inquirer.prompt([
        {
            type: 'list', name: 'index',
            message: '请选择你想操作的任务?',
            choices: [{ name: '+创建任务', value: '-1' }, ...list.map((task, index) => {
                return { name: `${task.done ? '[x]' : '[_]'} ${index + 1}-${task.title}`, value: index }
            }), { name: '退出', value: '-2' }]
        },
    ]).then((answers) => {
        const index = parseInt(answers.index)
        if (index >= 0) {
            askForAction(list, index)
        } else if (index === -1) {
            askForCreateTask(list)
        }
    });
}

module.exports.showAll = async (title) => {
    const list = await db.read()
    printTasks(list)
}