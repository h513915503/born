module.exports = function createImageUpload({ num, tips, handleFunc }) {
    return `<jk-upload :num="${num}" tips="${tips}" @complete="${handleFunc}"></jk-upload>`
}