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

function serialize({search: { searchConditionList }, button, meta, modal}) {
    handleImportData(button)
    handleModalData(modal)

    const result = `
        import {timeToFormat} from '@/utils/index.js'
        import listMixin from '@/mixins/listMixin.js'

        export default {
            data() {
                return ${generateSerializeData(searchConditionList)}
            },

            computed: ${serializeComputed(searchConditionList)},

            mixins: [listMixin],

            methods: ${serializeMethods(searchConditionList, button, meta, modal)}
        }
    `
    return result
}

function generateSerializeData(searchConditionList) {
    // 下拉框列表
    const selectList = searchConditionList.filter((condition) => condition.type === 'select').map((condition) => [`${condition.prop}List`, []])

    return serializeData({
        pageDataStart,
        searchFormData: Object.fromEntries(searchConditionList.map((condition) => [condition.prop, condition.type.endsWith('range') ? [] : "''"])),
        selectList: Object.fromEntries(selectList),
        importData,
        modalData,
        pageDataEnd
    })
}

function serializeData({pageDataStart, searchFormData, selectList, importData, modalData, pageDataEnd}) {
    return `{
        ${serializeDataItem(pageDataStart, {comma: true})}
        searchFormData: {${serializeDataItem(searchFormData)}},\n
        ${serializeDataItem(selectList, {comma: true})}
        ${Object.keys(importData).length ? serializeDataItem(importData, {comma: true}) : '_flag_'}
        ${Object.keys(modalData).length ? serializeDataItem(modalData, {comma: true}) : '_flag_'}
        ${serializeDataItem(pageDataEnd, false)}}`.replace(/_flag_[\r\n]/g, '')
}

function serializeDataItem(data, {isBreak = true, comma = false} = {}) {
    return `${Object.keys(data).map((key) => `${key}: ${Array.isArray(data[key]) ? '[]' : data[key]}`)}${comma ? ',' : ''}${isBreak ? '\n' : ''}`
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

function serializeMethods(searchConditionList, buttonList, {url, method}, modal) {
    // 处理导入按钮
    buttonList.forEach((button) => {
        if (button.isImport) {
            methods.handleImportInputChange = `handleImportInputChange(event) {
                this.${button.loading} = true
            },`
        }
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