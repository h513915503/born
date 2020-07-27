module.exports = function createInput(item, prefix) {
    let eventStr = ''
    const numberType = item.numberType

    if (typeof numberType !== 'undefined') {
        eventStr = ` @keypress.native="handleKeypress($event, '${prefix}FormData.${item.prop}', ${numberType})"`
    }

    return `<el-input type="${item.attrs ?. type ?? 'text'}" v-model="${prefix}FormData.${item.prop}" placeholder="${item ?. attrs ?. placeholder ?? '请输入'}"${eventStr}></el-input>`
}