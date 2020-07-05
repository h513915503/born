const path = require('path')
const { generateSearch, generateTable, generatePagination } = require('./generatorCollection.js')
const beautify_html = require('js-beautify').html

function generateTemplate({search, button, table, pagination}) {
    let result = `
        <template>
            <div class="jk-list-wrapper">
                <template v-if="loading">
                    <jk-loading></jk-loading>
                </template>

                <template v-else>`

    if (search) {
        result += generateSearch(search, button)
    }

    if (table) {
        result += generateTable(table)
    }

    if (pagination) {
        result += generatePagination()
    }

    result += `
                </template>
            </div>
        </template>`

    return beautify_html(result, {
        indent_size: 4,
        eol: '\r\n',
        'wrap-attributes': 'preserve',
        'wrap-attributes-indent-size': 4
    })
}

module.exports = generateTemplate