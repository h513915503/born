module.exports = function createRadio({ prop, radioValueList }, prefix) {
    return `<el-radio-group v-model="${prefix}FormData.${prop}">
                ${radioValueList.map(({label, value}) => {
                    return `<el-radio :label="${value}">${label}</el-radio>`
                }).join('\n')}
            </el-radio-group>`
}