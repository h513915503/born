module.exports = function createDate({ type, prop, valueFormat = 'timestamp', attrs = {}}, prefix) {
    const placeholderString = attrs.placeholder ?? '选择日期时间'
    const startPlaceholderString = attrs.startPlaceholder ?? '选择开始日期时间'
    const endPlaceholderString = attrs.endPlaceholder ?? '选择结束日期时间'

    let placeholder = `placeholder="${placeholderString}"`
    let eventStr = ''

    if (type.endsWith('range')) {
    	eventStr = ` @change="handleDatePicker${prop}"`
        placeholder = `start-placeholder="${startPlaceholderString}" end-placeholder="${endPlaceholderString}"`
    }

    return `<el-date-picker v-model="${prefix}FormData.${prop}" type="${type}" value-format="${valueFormat}" ${placeholder}${eventStr}></el-date-picker>`
}