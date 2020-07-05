const fs = require('fs')
const path = require('path')

const generateTemplate = require('../core/generateTemplate.js')
const generateScript = require('../core/generateScript.js')
const generateStyle = require('../core/generateStyle.js')
let { name, search, button, table, pagination } = require(`${path.resolve(process.cwd())}/template.js`)

let pageStr = ''

pageStr += generateStyle()
pageStr += generateTemplate({
	search,
	button,
	table,
	pagination
})
pageStr += generateScript({search, table})

if (! name) {
	name = 'index'
}

fs.writeFile(`${path.resolve(process.cwd())}/${name}.vue`, pageStr, (error) => {
    if (error) {
    	throw error
    }
})