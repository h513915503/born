function generateSearch(search, button) {
    let result = `
        <header>
            <el-form :model="searchFormData" :inline="true" label-position="${search.labelPosition ?? 'left'}" label-width="${search.labelWidth ?? '100px'}" ref="searchForm">
                ${generateFormItem(search.searchConditionList)}

                <el-form-item>
                    <el-button @click="searchData" type="primary">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                    ${generateButton(button)}
                </el-form-item>
            </el-form>
        </header>
    `

    return result
}
function generateFormItem(searchConditionList) {
    return searchConditionList.map((condition) => {
        return `<el-form-item label="${condition.label}" prop="${condition.prop}">
            ${generateFormItemByType(condition)}
        </el-form-item>`
    }).join('\n')
}

function generateFormItemByType(condition) {
    const map = {
        input: generateFormItemInput,
        select: generateFormItemSelect
    }

    return map[condition.type] ?. (condition) ?? generateFormItemDate(condition)
}

function generateFormItemInput(condition) {
    let eventStr = ''
    let isNumber = condition.attrs.type === 'number'

    if (isNumber) {
        eventStr = ` @input="${condition.prop} = ${condition.prop}.slice(0, 11)" @keypress="handleKeypress"`
    }

    return `<el-input type="${condition.type ?? 'text'}" v-model="searchFormData.${condition.prop}" placeholder="${condition.attrs.placeholder}"${eventStr}></el-input>`
}

function generateFormItemSelect(condition) {
    return `<el-select v-model="searchFormData.${condition.prop}">
                <el-option :key="item.value" :label="item.text" :value="item.value" v-for="item of ${condition.prop}List"></el-option>
            </el-select>`
}

function generateFormItemDate(condition) {
    let placeholder = 'placeholder="选择日期时间"'

    if (condition.type.endsWith('range')) {
        placeholder = 'start-placeholder="选择开始时间" end-placeholder="选择结束时间"'
    }

    return `<el-date-picker v-model="searchFormData.${condition.prop}" type="${condition.type}" value-format="${condition.valueFormat ?? 'timestamp'}" ${placeholder}></el-date-picker>`
}

function generateButton(buttonList) {
    let result = `
        <el-button @click="searchData" type="primary">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
    `

    return buttonList.map((button) => {
        let eventStr = ''
        const disabled = button.disabled ? `disabled="${button.disabled}"` : ''

        if (button.events) {
            Object.keys(button.events).forEach((eventName) => {
                eventStr += ` @${eventName}=${button.events[eventName]}`
            })
        }

        return `<el-button type="${button.type}"${disabled}${eventStr}>${button.text}</el-button>`
    }).join('\n')
}

function generateTable(table) {
    const stripe = table.stripe ? ' stripe' : ''
    const isSort = table.tableColumnList.some((column) => column.sortable) ? ' @sort-change="sortChange"' : ''

    return `\n<el-table :data="dataList" header-cell-class-name="table-header" ref="table"${stripe}${isSort}>
                ${generateTableColumn(table.tableColumnList)}
            </el-table>`
}

function generateTableColumn(tableColumnList) {
    let result = ''

    tableColumnList.forEach((column) => {
        let other = ''

        if (column.minWidth) {
            other += `min-width="${column.minWidth}"`
        }

        if (column.align) {
            other += ` align="${column.align}"`
        }

        if (column.sortable) {
            other += `sortable="${column.sortable}"`
        }

        if (column.isCustom) {
            return result += `<el-table-column label="${column.label}"${other}>
                        <template slot-scope="scope">
                        </template>
                    </el-table-column>`
        }

        if (column.operationList) {
            return result += `<el-table-column label="${column.label ?? '操作'}"${other}>
                        <template slot-scope="scope">
                            ${generateOperationList(column.operationList)}
                        </template>
                    </el-table-column>`
        }

        result += `<el-table-column prop="${column.prop}" label="${column.label}"${other}></el-table-column>`
    })

    return result
}

function generateOperationList(operationList) {
    return operationList.map((operation) => {
        return ` <el-button type="text">
                    <router-link :to="{path: '${operation.path}' + scope.row.${operation.prop}${operation.query ? `, query: ${generateQuery(operation)}` : ''}}">${operation.text}</router-link>
                </el-button>`
    }).join('\n')
}

function generateQuery(operation) {
    return `{${Object.keys(operation.query).map((key) => `${key}: scope.row.${operation.query[key]}`)}}`
}

function generatePagination() {
    return `\n\n<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="page" :page-size.sync="pageSize" :page-sizes="[10, 20, 30]" layout="sizes, prev, pager, next, jumper" :total="pageTotal" v-if="dataList.length"></el-pagination>`
}

module.exports = {
    generateSearch,
    generateTable,
    generatePagination
}