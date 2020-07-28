module.exports = function createRadio({ prop, checkboxValueList }, prefix) {
    return `<el-checkbox-group v-model="${prefix}FormData.${prop}">
                ${checkboxValueList.map(({label, value}) => {
                    return `<el-checkbox :label="${value}">${label}</el-checkbox>`
                }).join('\n')}
            </el-checkbox-group>`
}