const { stringify } = require('../../utils/index.js')

module.exports = function createImageUpload({ num, tips, ratio, ratioTips, prop }, prefix) {
    return `<jk-upload :num="${num}" tips="${tips}"${stringify('ratio', ratio)}${stringify('ratioTips', ratioTips)} :result="${prefix}FormData.${prop}"></jk-upload>`
}