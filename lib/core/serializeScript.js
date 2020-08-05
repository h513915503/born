const { serializeImport, serializeData, serializeComputed, serializeMixins, serializeCreated, serializeMethods } = require('../utils/index.js')

module.exports = function serializeScript({ importData, dataList, computedData, mixinsData, createdData, methodsData }) {
    const result = `
        ${serializeImport(importData)}

        export default {
            ${serializeData(dataList)}
            ${computedData ? serializeComputed(computedData) : '_flag_'}
            ${serializeMixins(mixinsData)}
            ${serializeCreated(createdData)}
            ${serializeMethods(methodsData)}
        }
    `.replace(/_flag_[\r\n]/g, '')
    return result
}