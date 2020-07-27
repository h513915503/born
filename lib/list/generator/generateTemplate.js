const path = require('path')
const { generateSearch, generateTable, generateModal, generatePagination } = require('./templateGenerator.js')
const beautify_html = require('js-beautify').html

function generateTemplate({search, button, table, modal, pagination}) {
    let result = `
        <template>
            <div class="jk-list-wrapper">`

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
                ${modal ? generateModal(modal) : '_flag_'}
            </div>
        </template>`.replace(/_flag_[\r\n]/, '')

    return beautify_html(result, {
        indent_size: 4,
        eol: '\r\n',
        'wrap-attributes': 'preserve',
        'wrap-attributes-indent-size': 4
    })
}

module.exports = generateTemplate