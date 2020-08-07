const { generatePlane, generateButton } = require('./templateGenerator.js')
const beautify_html = require('js-beautify').html

function generateTemplate({ meta, detailData, buttonList }) {
    const result = `
        <template>
            <div class="jk-detail-wrapper">
                <template v-if="loading">
                    <jk-loading />
                </template>
                <template v-else>
                    ${generatePlane(detailData)}
                    ${generateButton(buttonList)}
                </template>
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