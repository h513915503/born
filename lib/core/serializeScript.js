const { serializeImport, serializeData, serializeComputed, serializeMixins, serializeCreated, serializeMethods } = require('../utils.js')

module.exports = function serializeScript({ importData, dataList, computedData, mixinsData, createdData, methodsData }) {
    const result = `
        ${serializeImport(importData)}

        export default {
            ${serializeData(dataList)}
            ${serializeComputed(computedData)}
            ${serializeMixins(mixinsData)}
            ${serializeCreated(createdData)}
            ${serializeMethods(methodsData)}
        }
    `.replace(/_flag_[\r\n]/g, '')
    return result
}