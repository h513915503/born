const fs = require('fs')
const path = require('path')

const { meta, detailData, buttonList } = require(`${path.resolve(process.cwd())}/detail-template.js`)

const generateTemplate = require('./generator/generateTemplate.js')
const generateScript = require('./generator/generateScript.js')
const generateStyle = require('./generator/generateStyle.js')

let pageStr = ''

pageStr += generateStyle()
pageStr += generateTemplate({ detailData, buttonList })
pageStr += generateScript({ meta, detailData, buttonList })

if (! meta.name) {
    meta.name = 'detail'
}

fs.writeFile(`${path.resolve(process.cwd())}/${meta.name}.vue`, pageStr, (error) => {
    if (error) {
        throw error
    }
})