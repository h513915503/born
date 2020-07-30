const { generatePlane, generateButton } = require('./templateGenerator.js')
const beautify_html = require('js-beautify').html

function generateTemplate({ meta, formList, buttonList }) {
    const result = `
        <template>
            <div class="form-info-wrapper">
            ${generatePlane(formList)}
            ${generateButton(buttonList)}
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