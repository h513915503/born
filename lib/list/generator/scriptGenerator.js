const methods = {
    handleRequestSuccess: `handleRequestSuccess(data) {
        // 处理非首次请求，数据为空
        if (this.loaded) {
            if (! data) {
                this.$message.error('暂无数据')
                return
            }
        }

        this.loaded = true

        this.pageTotal = data.total
        this.dataList = data.records
    },`
}
const pageDataStart = {
    loading: false,
    loaded: false
}

const pageDataEnd = {
    page: 1,
    pageTotal: 1,
    pageSize: 10,
    pageName: "'pageCurrent'",
    pageSizeName: "'pageSize'",

    dataList: []
}

const importData = {}

const modalData = {}

function handleModalData(modal = {}) {
    Object.keys(modal).filter((key) => key.endsWith('Prop')).forEach((key) => {
        modalData[modal[key]] = 'false'
    })
}

function handleImportData(buttonList) {
    buttonList.forEach((button) => {
        if (button.isImport) {
            importData[button.loading] = 'false'
        }
    })
}

function serialize({search: { searchConditionList }, button, table, meta, modal}) {
    handleImportData(button)
    handleModalData(modal)

    const result = `
        import {timeToFormat} from '@/utils/index.js'
        import listMixin from '@/mixins/listMixin.js'
        ${generateImportData(searchConditionList)}

        export default {
            data() {
                return ${generateSerializeData(searchConditionList)}
            },

            computed: ${serializeComputed(searchConditionList)},

            mixins: [listMixin],

            ${serializeCreated(searchConditionList)}

            methods: ${serializeMethods(searchConditionList, button, table, meta, modal)}
        }
    `.replace(/_flag_[\r\n]/g, '')
    return result
}

function generateImportData(searchConditionList) {
    return searchConditionList.filter((condition) => condition.type === 'select' && condition.selectType === 1).map((condition, index) => {
        return `${index === 0 ? '\n' : ''}import ${condition.prop}TypeList from '@/enum/${condition.prop}TypeList.js'`
    }).join('\n')
}

function generateSerializeData(searchConditionList) {
    // 下拉框列表
    const selectList = searchConditionList.filter((condition) => condition.type === 'select' && condition.selectType === 2).map((condition) => [`${condition.prop}List`, []])
    const selectListAlone = searchConditionList.filter((condition) => condition.type === 'select' && condition.selectType === 1).map((condition) => condition.prop)

    return serializeData({
        pageDataStart,
        searchFormData: Object.fromEntries(searchConditionList.map((condition) => [condition.prop, condition.type.endsWith('range') ? [] : "''"])),
        selectListAlone,
        selectList: Object.fromEntries(selectList),
        importData,
        modalData,
        pageDataEnd
    })
}

function serializeData({pageDataStart, searchFormData, selectListAlone, selectList, importData, modalData, pageDataEnd}) {
    return `{
        ${serializeDataItem(pageDataStart, {comma: true})}
        searchFormData: {${serializeDataItem(searchFormData)}},\n
        ${serializeDataItemAlone(selectListAlone, {comma: true})}
        ${serializeDataItem(selectList, {comma: true})}
        ${Object.keys(importData).length ? serializeDataItem(importData, {comma: true}) : '_flag_'}
        ${Object.keys(modalData).length ? serializeDataItem(modalData, {comma: true}) : '_flag_'}
        ${serializeDataItem(pageDataEnd, false)}}`.replace(/_flag_[\r\n]/g, '')
}

function serializeDataItem(data, {isBreak = true, comma = false} = {}) {
    return `${Object.keys(data).map((key) => `${key}: ${Array.isArray(data[key]) ? '[]' : data[key]}`)}${comma ? ',' : ''}${isBreak ? '\n' : ''}`
}

function serializeDataItemAlone(data) {
    return data.map((key) => `${key}TypeList,`).join('\n')
}

function serializeComputed(searchConditionList) {
    return `
        {
            keyArray() {
                return ${JSON.stringify(searchConditionList.map((condition) => [condition.prop])).replace(/"/g, "'")}
            }
        }
    `
}

function serializeCreated(searchConditionList) {
    const selectListAlone = searchConditionList.filter((condition) => condition.type === 'select' && condition.selectType === 2)

    if (! selectListAlone.length) {
        return '_flag_'
    }

    return `created() {
        ${selectListAlone.map((condition) => `this.get${condition.prop.replace(/\w/, (match) => match.toUpperCase())}List()`).join('\n')}
    },`
}

function serializeMethods(searchConditionList, buttonList, table, {url, method}, modal) {
    // 处理导入按钮
    buttonList.forEach((button) => {
        if (button.isImport) {
            methods.handleImportInputChange = `handleImportInputChange(event) {
                this.${button.loading} = true
            },`
        }
    })

    // 下拉列表
    searchConditionList.filter((condition) => condition.type === 'select' && condition.selectType === 2).forEach((condition) => {
        const key = `get${condition.prop.replace(/\w/, (match) => match.toUpperCase())}List`

        methods[key] = `async ${key}() {
            const {success, data} = await axios.get('${condition.selectRequestURL}')

            if (! success) {
                return
            }

            this.${condition.prop}List = data
        },`
    })

    // 添加日期处理
    searchConditionList.forEach((condition) => {
        if (condition.type.endsWith('range')) {
            const key = `${condition.prop}ToFormat`

            methods[key] = `${key}(value, params) {
                // type=datetimerange 的时间控件点击 x 清空值后值为 null
                if (value) {
                    const [start, end] = value

                    params.${condition.prop}Start = start
                    params.${condition.prop}End = end
                }
            },`
        }
    })

    if (modal) {
        methods.handleDialogClose = `handleDialogClose() {

        },`
    }

    // dropdown 按钮处理函数
    const column = table.tableColumnList.find((column) => column.operationList)
    const operation = column ?. operationList.find((operation) => operation.isDropdownBtn)

    if (operation) {
        methods.composeValue = `composeValue(command, row) {
            return {
                command,
                row
            }
        },`
        methods.handleDropdownCommand = `handleDropdownCommand({command, row}) {

        },`
    }

    methods.handleRequestMetadata = `handleRequestMetadata(options) {
        options.url = '${url}'
        options.method = '${method}'

        options.axiosOptions = {
            cancelToken: this.$source.token
        }
    },`

    return `{
        ${Object.keys(methods).map((key) => methods[key]).join('\n')}
    }`
}

module.exports = {
    serialize
}