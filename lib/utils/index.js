const chalk = require('chalk')

const format = (label, msg) => {
    return msg.split('\n').map((line, i) => {
        return i === 0
            ? `${label} ${line}`
            : line.padStart(50)
    }).join('\n')
}

function error(msg) {
	console.error(format('ERROR', chalk.red(msg)))
}

function toUpperCaseFirst(str) {
	return str.replace(/\w/, (match) => match.toUpperCase())
}

function isObject(val) {
    return val !== null && typeof val === 'object'
}

function serializeImport(data) {
    return data.map(([importStr, fromStr]) => `import ${importStr} from ${fromStr}`).join('\n')
}

function serializeData(dataList) {
    dataList = dataList.filter((data) => {
        if (Array.isArray(data)) {
            return data.length
        } else {
            return ! (Object.keys(data).length === 1 && data['lf'])
        }
    })

    return `data() {
            return {
                ${dataList.map((data) => Array.isArray(data) ? serializeDataItemAlone(data) : serializeDataItem(data))}
            }
        },`
}

function serializeComputed(data) {
    return `
        computed: {
            ${Object.values(data).map((value) => value).join('\n')}
    },`
}

function serializeMixins(data) {
    return `\nmixins: [${data}],`

}

function serializeCreated(data) {
    return `
        created() {
            ${Array.isArray(data) ? `this.$params = {} \n${data.map((func) => `this.${func}()`).join('\n')}` : data}
    },`
}

function serializeMethods(data) {
    return `
        methods: {
            ${Object.values(data).map((value) => value).join('\n')}
    }`
}

function serializeDataItem(data, {comma = false} = {}) {
    // 是否需要换行
    let lf = ''

    const keyList = Object.keys(data).map((key, index, arr) => {
        let result = ''

        if (key === 'lf') {
            lf = '\n\n'
            return null
        }

        result = `${lf}${key}: ${getValueType(data[key], {
            isLast: index === arr.length - 1,
            comma
         })}`

        lf = ''

        return result
    })

    if (! keyList.length) {
        return '_flag_'
    }

    return `${keyList.filter((item) => item)}`
}

function getValueType(value, { comma, isLast }) {
    if (Array.isArray(value)) {
        if (! value.length) {
            return `[]${isLast && comma ? ',' : ''}`
        }

        return `[
            ${value.map((item, index, arr) => `
                {
                    ${serializeDataItem(item)}
                }${index === arr.length - 1 ? '' : ','}`).join('')}
            ]`
    }

    if (isObject(value)) {
        return `{
                ${serializeDataItem(value)}
        }${isLast && comma ? ',' : ''}`
    }

    return typeof value === 'string' ? `'${value}'` : value
}

function serializeDataItemAlone(data) {
    return data.map((key) => `${key}TypeList`).join('\n')
}

module.exports = {
	error,
	isObject,
	toUpperCaseFirst,

    serializeImport,
    serializeData,
    serializeComputed,
    serializeMixins,
    serializeCreated,
    serializeMethods
}