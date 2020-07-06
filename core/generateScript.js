const { serialize } = require('./serialization.js')
const beautify = require('js-beautify').js_beautify

function generateScript({search, meta}) {
    return `\n\n<script>\n${beautify(serialize({search, meta}), {
        indent_size: 4,
        'brace_style': 'collapse-preserve-inline',
        eol: '\r\n'
    })}\n</script>`
}

module.exports = generateScript