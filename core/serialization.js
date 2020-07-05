const methods = {
    cTimeToFormat: `cTimeToFormat(value, params) {
        // type=datetimerange 的时间控件点击 x 清空值后值为 null
        if (value ?. length) {
            const [start, end] = value

            params.regTimeStart = timeToFormat(start, 'yyyy-MM-dd HH:mm:ss')
            params.regTimeEnd = timeToFormat(end, 'yyyy-MM-dd HH:mm:ss')
        }
    },`,
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
    }`
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

function serialize({search: {searchConditionList}, table}) {
    const result = `
        import {timeToFormat} from '@/utils/index.js'
        import listMixin from '@/mixins/listMixin.js'

        export default {
            data() {
                return ${generateSerializeData(searchConditionList)}
            },

            computed: ${serializeComputed(searchConditionList)},

            mixins: [listMixin],

            methods: ${serializeMethods(table)}
        }
    `
    return result
}

function generateSerializeData(searchConditionList) {
    // 下拉框列表
    const selectList = searchConditionList.filter((condition) => condition.type === 'select').map((condition) => [`${condition.prop}List`, []])

    return serializeData({
        ... pageDataStart,
        searchFormData: serializeData(Object.fromEntries(searchConditionList.map((condition) => [condition.prop, condition.type.endsWith('range') ? [] : "''"]))),
        ... Object.fromEntries(selectList),
        ... pageDataEnd
    })
}

function serializeData(data) {
    return `{
        ${Object.keys(data).map((key) => `${key}: ${Array.isArray(data[key]) ? '[]' : data[key]}`)}
    }`
}

function serializeComputed(searchConditionList) {
    return `
        {
            keyArray() {
                return ${JSON.stringify(searchConditionList.map((condition) => [condition.prop]))}
            }
        }
    `
}

function serializeMethods(table) {
    methods.handleRequestMetadata = `handleRequestMetadata(options) {
        options.url = '${table.url}'
        options.method = '${table.method}'

        options.axiosOptions = {
            cancelToken: this.$source.token
        }
    },`

    return `{
        ${Object.keys(methods).sort().map((key) => methods[key]).join('\n')}
    }`
}

module.exports = {
    serialize
}