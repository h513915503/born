const { toUpperCaseFirst } = require('../../utils.js')

const functionListCreated = []

function generateImportData(formList) {
	const result = []
	const enumResult = []
	const utilsResult = []

	formList.forEach((formListItem) => {
		// selectType === 1 是枚举列表
		formListItem.formItems.filter(({selectType}) => selectType === 1).map(({prop}) => {
			enumResult.push(prop)
		})

		formListItem.formItems.filter(({isNeedCheck}) => isNeedCheck).map(({isNeedCheck: {funcProp}}) => {
			utilsResult.push(funcProp)
		})
	})

	// 枚举文件导入列表
	result.push(enumResult.map((prop) => [`${prop}TypeList`, `'@/enum/${prop}TypeList.js'`]).flat())

	// 表单校验处理函数可能重复，需要去重
	result.push([`{ ${[... new Set(utilsResult)].join(', ')} }`, "'@/utils/index.js'"])

	return result
}

function generateData(formList) {
	const formData = {}

	// 枚举下拉框列表
	const selectTypeListAloneData = []

	const selectTypeListData = {
		lf: true
	}
	const cascaderData = {
		lf: true
	}
	const otherData = {
		lf: true,
		submitBtnLoading: false
	}

	formList.forEach((formListItem) => {
		// 表单数据
		formData[`${formListItem.prefix}FormData`] = Object.fromEntries(formListItem.formItems.map(({prop, value}) => {
			return [prop, value ?? '']
		}))

		// 校验规则
		const rulesObj = {}

		formListItem.formItems.filter(({required}) => required).map(({prop, rules}) => {
			rulesObj[prop] = rules
		})

		formData[`${formListItem.prefix}Rules`] = rulesObj

		// 下拉框数据
		selectTypeListAloneData.push(formListItem.formItems.filter(({selectType}) => selectType === 1).map(({prop}) => prop))
		formListItem.formItems.filter(({selectType}) => selectType === 2).map(({prop}) => {
			selectTypeListData[`${prop}List`] = []
		})

		// 级联下拉框数据
		formListItem.formItems.filter(({type}) => type === 'cascader').map(({prop, props, options}) => {
			cascaderData[`${prop}Props`] = props
			cascaderData[`${options}Options`] = []
		})
	})

	return [formData, selectTypeListData, selectTypeListAloneData.flat(), cascaderData, otherData]
}

function generateComputedData(formList) {
	const result = {}

	result.isDisabledBtnSubmit = `isDisabledBtnSubmit() {
            ${serializeVariableData(formList)}

            ${generateLetData(formList)}

            if (${formList.map(({prefix}) => `${prefix}FormData`).join(' && ')}) {
                return false
            }

            return true
        }
	`

	return result
}

function generateLetData(formData) {
    return formData.map((item) => generateLetDataItem(item)).join('\n')
}

function generateLetDataItem({ prefix, formItems }) {
    return `let ${prefix}FormData = ${formItems.filter(({required}) => required).map(({type, prop}) => {
        if (type === 'daterange') {
            return `${prop}${toUpperCaseFirst(prefix)}.length`
        }

        return `${prop}${toUpperCaseFirst(prefix)}`
    }).join(' && ')}`
}

function generateCreatedData() {
	return functionListCreated
}

function getPrefix(formList) {
	return formList.map((formListItem) => formListItem.prefix)
}

function getRulesFunc(formList) {
	return formList.map((formListItem) => {
		return formListItem.formItems.filter(({isNeedCheck}) => isNeedCheck).map(({prop, isNeedCheck}) => {
			return `if (! ${isNeedCheck.funcProp}(this.${formListItem.prefix}FormData.${prop})) {
                this.$message.error('${isNeedCheck.message}')

                return
            }`
		}).join('')
	})
}

function serializeVariableData(formData, required = true) {
    return formData.map((item) => serializeVariableDataItem(item, required)).join('\n')
}

function serializeVariableDataItem({ prefix, formItems }, required) {
    return `const { ${(required ? formItems.filter(({required}) => required) : formItems).map(({prop}) => `${prop}: ${prop}${toUpperCaseFirst(prefix)}`).join(', ')} } = this.${prefix}FormData`
}

function getParamsByType(formData, type = 0) {
    return formData.map((item) => {
        // 0 全部
        // 1 必填
        // 2 可选
        let list = item.formItems
        const listRequired = item.formItems.filter(({required}) => required)

        if (type === 1) {
            list = listRequired
        }

        if (type === 2) {
            list = list.filter(({prop}) => ! listRequired.find(({prop: propRequired}) => propRequired === prop))
        }

        return list.map(({prop, value, type}) => ({
            type,
            value,
            prop: `${prop}${toUpperCaseFirst(item.prefix)}`
        }))
    }).flat()
}

function generateMethodsData(meta, formList, buttonList) {
	const result = {}

	// 下拉列表
	formList.forEach((formListItem) => {
		formListItem.formItems.filter(({selectType}) => selectType === 2).forEach(({prop, selectRequestURL}) => {
			const key = `get${prop}List`

			// created 钩子需要调用的函数列表
			functionListCreated.push(key)

			result[key] = `async ${key}() {
		        const {success, data} = await this.http.get('${selectRequestURL}')

		        if (! success) {
		            return
		        }

		        this.${prop}List = data
		    },`
		})
	})


	// 按钮事件
	buttonList.forEach((button, index, arr) => {
		Object.values(button.events ?? {}).forEach((eventValue) => {
			result[eventValue] = `${eventValue}() {

			}${index === arr.length - 1 ? '' : ','}`
		})
	})

	// 提交表单数据
	result.readySubmit = `readySubmit() {
		Promise.all([${getPrefix(formList).map((prefix) => `this.$refs.${prefix}Form.validate()`)}]).then(() => {
            ${getRulesFunc(formList).join('\n\n')}

            this.submit()
        }).catch(() => {

        })
	},`

	result.makeParams = `makeParams() {
        ${serializeVariableData(formList, false)}

        const params = {
            ... this.$params,

            ${getParamsByType(formList, 1).map(({prop}) => prop).join(',\n')}
        }

        ${getParamsByType(formList, 2).map(({prop, value, type}) => {
            if (type.endsWith('range')) {
                return '_flag_'
            }

            let propStr = prop

            if (Array.isArray(value)) {
                propStr = `${prop}.length`
            }

            return `if (${propStr}) {
                params.${prop} = ${prop}
            }\n`
        }).join('\n')}
        return params
    },`.replace(/_flag_[\r\n]/g, '')

	result.submit = `async submit(options) {
            this.submitBtnLoading = true

            let url = '${meta.url}'
            let method = '${meta.method}'

            const params = this.makeParams()
            const { id } = this.$route.query

            if (id) {
                url = '${meta.urlEdit}'
                method = '${meta.methodEdit}'
                params.id = id
            }

            const {success, data} = await this.http[method](url, params)

            this.submitBtnLoading = false

    }`

	return result
}

module.exports = {
	generateImportData,
	generateData,
	generateComputedData,
	generateCreatedData,
	generateMethodsData
}