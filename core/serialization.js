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

function serialize({search: { searchConditionList }, meta}) {
    const result = `
        import {timeToFormat} from '@/utils/index.js'
        import listMixin from '@/mixins/listMixin.js'

        export default {
            data() {
                return ${generateSerializeData(searchConditionList)}
            },

            computed: ${serializeComputed(searchConditionList)},

            mixins: [listMixin],

            methods: ${serializeMethods(searchConditionList, meta)}
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
        pageDataEnd
    })
}

function serializeData({pageDataStart, searchFormData, selectList, pageDataEnd}) {
    return `{
        ${serializeDataItem(pageDataStart, {comma: true})}
        searchFormData: {${serializeDataItem(searchFormData)}},\n
        ${serializeDataItem(selectList, {comma: true})}
        ${serializeDataItem(pageDataEnd, false)}}`
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

function serializeMethods(searchConditionList, {url, method}) {
    const searchCondition = searchConditionList.find((condition) => condition.type.endsWith('range'))

    if (searchCondition) {
        const key = `${searchCondition.prop}ToFormat`

        methods[key] = `${key}(value, params) {
            // type=datetimerange 的时间控件点击 x 清空值后值为 null
            if (value) {
                const [start, end] = value

                params.${searchCondition.prop}Start = start
                params.${searchCondition.prop}End = end
            }
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