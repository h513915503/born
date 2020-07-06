const fs = require('fs')
const path = require('path')

const generateTemplate = require('../core/generateTemplate.js')
const generateScript = require('../core/generateScript.js')
const generateStyle = require('../core/generateStyle.js')
let { meta, search, button, table, pagination } = require(`${path.resolve(process.cwd())}/template.js`)

let pageStr = ''

pageStr += generateStyle()
pageStr += generateTemplate({
    search,
    button,
    table,
    pagination
})
pageStr += generateScript({search, meta})

if (! meta.name) {
    meta.name = 'index'
}

fs.writeFile(`${path.resolve(process.cwd())}/${meta.name}.vue`, pageStr, (error) => {
    if (error) {
        throw error
    }
})