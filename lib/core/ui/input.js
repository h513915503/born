const { stringify } = require('../../utils/index.js')

module.exports = function createInput({ prop, maxlength, numberType, attrs = {} }, prefix) {
    let eventStr = ''

    if (typeof numberType !== 'undefined') {
        eventStr = ` @keypress.native="handleKeypress($event, '${prefix}FormData.${prop}', ${numberType})"`
    }

    return `<el-input type="${attrs.type ?? 'text'}" v-model="${prefix}FormData.${prop}" placeholder="${attrs.placeholder ?? '请输入'}"${stringify('maxlength', maxlength)}${stringify('rows', attrs.rows)}${stringify('resize', attrs.resize)}${eventStr}></el-input>`
}