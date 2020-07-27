const fs = require('fs')
const path = require('path')

const { meta, formList, buttonList } = require(`${path.resolve(process.cwd())}/add-template.js`)

const generateTemplate = require('./generator/generateTemplate.js')
const generateScript = require('./generator/generateScript.js')
const generateStyle = require('./generator/generateStyle.js')

let pageStr = ''

pageStr += generateStyle()
pageStr += generateTemplate({ formList, buttonList })
pageStr += generateScript({ meta, formList, buttonList })

if (! meta.name) {
    meta.name = 'index'
}

fs.writeFile(`${path.resolve(process.cwd())}/${meta.name}.vue`, pageStr, (error) => {
    if (error) {
        throw error
    }
})