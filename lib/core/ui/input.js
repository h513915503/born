module.exports = function createInput({ prop, numberType, attrs = {} }, prefix) {
    let eventStr = ''

    if (typeof numberType !== 'undefined') {
        eventStr = ` @keypress.native="handleKeypress($event, '${prefix}FormData.${prop}', ${numberType})"`
    }

    return `<el-input type="${attrs.type ?? 'text'}" v-model="${prefix}FormData.${prop}" placeholder="${attrs.placeholder ?? '请输入'}"${eventStr}></el-input>`
}