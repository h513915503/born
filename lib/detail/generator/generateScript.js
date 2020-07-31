const { generateData, generateCreatedData, generateMethodsData } = require('./scriptGenerator.js')
const serializeScript = require('../../core/serializeScript.js')
const beautify = require('js-beautify').js_beautify


function generateScript({ meta, formList, buttonList }) {
	const importData = [['detailMixin', "'@/mixins/detailMixin.js'"], ['{ timeToFormat }', "'@/utils/index.js'"]]
	const dataList = generateData(formList)
	const mixinsData = ['detailMixin']
	const methodsData = generateMethodsData(meta, formList, buttonList)
	const createdData = generateCreatedData()

    return `\n\n<script>\n${beautify(serializeScript({ importData, dataList, mixinsData, createdData, methodsData }), {
        indent_size: 4,
        'brace_style': 'collapse-preserve-inline',
        eol: '\r\n'
    })}\n</script>`
}

module.exports = generateScript
