const { generateImportData, generateData, generateComputedData, generateCreatedData, generateMethodsData } = require('./scriptGenerator.js')
const serializeScript = require('../../core/serializeScript.js')
const beautify = require('js-beautify').js_beautify


function generateScript({ meta, formList, buttonList }) {
	const importData = [['addMixin', "'@/mixins/addMixin.js'"], ['service', "'@/api/index.js'"], ... generateImportData(formList)]
	const dataList = generateData(formList)
	const computedData = generateComputedData(formList)
	const mixinsData = ['addMixin']
	const methodsData = generateMethodsData(meta, formList, buttonList)
	const createdData = generateCreatedData()

    return `\n\n<script>\n${beautify(serializeScript({ importData, dataList, computedData, mixinsData, createdData, methodsData }), {
        indent_size: 4,
        'brace_style': 'collapse-preserve-inline',
        eol: '\r\n'
    })}\n</script>`
}

module.exports = generateScript