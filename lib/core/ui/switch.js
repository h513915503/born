module.exports = function createRadio({ prop }, prefix) {
    return `<el-switch v-model="${prefix}FormData.${prop}"></el-switch>`
}