module.exports = function createDate(item, prefix) {
    const attrs = item.attrs ?? {}
    const placeholderString = attrs.placeholder ?? '选择日期时间'
    const startPlaceholderString = attrs.startPlaceholder ?? '选择开始日期时间'
    const endPlaceholderString = attrs.endPlaceholder ?? '选择结束日期时间'

    let placeholder = `placeholder="${placeholderString}"`
    let eventStr = ''

    if (item.type.endsWith('range')) {
    	eventStr = ` @change="handleDatePicker${item.prop}"`
        placeholder = `start-placeholder="${startPlaceholderString}" end-placeholder="${endPlaceholderString}"`
    }

    return `<el-date-picker v-model="${prefix}FormData.${item.prop}" type="${item.type}" value-format="${item.valueFormat ?? 'timestamp'}" ${placeholder}${eventStr}></el-date-picker>`
}