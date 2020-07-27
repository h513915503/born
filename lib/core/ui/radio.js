module.exports = function createRadio(item, prefix) {
    return `<el-radio-group v-model="${prefix}FormData.${item.prop}">
                ${item.radioValueList.map((radioItem) => {
                    return `<el-radio :label="${radioItem.value}">${radioItem.label}</el-radio>`
                }).join('\n')}
            </el-radio-group>`
}