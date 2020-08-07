const { generateData, generateCreatedData, generateMethodsData } = require('./scriptGenerator.js')
const serializeScript = require('../../core/serializeScript.js')
const beautify = require('js-beautify').js_beautify
const format = require('../../utils/format.js')

function generateScript({ meta, detailData, buttonList }) {
	const importData = [['detailMixin', "'@/mixins/detailMixin.js'"], ['{ timeToFormat }', "'@/utils/index.js'"]]
	const dataList = generateData(detailData)
	const mixinsData = ['detailMixin']
	const methodsData = generateMethodsData(meta, detailData, buttonList)
	const createdData = generateCreatedData()

    return `\n\n<script>\n${format(beautify(serializeScript({ importData, dataList, mixinsData, createdData, methodsData }), {
        indent_size: 4,
        'brace_style': 'collapse-preserve-inline',
        eol: '\r\n'
    }))}\n</script>\n`
}

module.exports = generateScript
