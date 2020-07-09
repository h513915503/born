const { serialize } = require('./serialization.js')
const beautify = require('js-beautify').js_beautify

function generateScript({search, button, meta, modal}) {
    return `\n\n<script>\n${beautify(serialize({search, button, meta, modal}), {
        indent_size: 4,
        'brace_style': 'collapse-preserve-inline',
        eol: '\r\n'
    })}\n</script>`
}

module.exports = generateScript