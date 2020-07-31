const { toUpperCaseFirst } = require('../../utils.js')

let functionCreated = ''

function generateData(formList) {
	const loadingData = {
		loading: false
	}
	const formData = {
		lf: true
	}

	formList.forEach((formListItem) => {
		// 表单数据
		formData[`${formListItem.prefix}FormData`] = Object.fromEntries(formListItem.formItems.map(({prop, value}) => {
			return [prop, value ?? '']
		}))
	})

	return [loadingData, formData]
}

function generateComputedData(formList) {
	const result = {}

	return result
}

function generateCreatedData() {
	return `this.loading = true
		this.${functionCreated}().then(() => {
		this.loading = false
	})`
}

function getPrefix(formList) {
	return formList.map((formListItem) => formListItem.prefix)
}

function generateMethodsData(meta, formList, buttonList) {
	const result = {}

	// 获取详情
	const key = 'getDetailData'

	// created 钩子需要调用的函数
	functionCreated = key

	result[key] = `async ${key}() {
		const params = {}
        const {success, data} = await this.http.get('${meta.url}', { params })

        if (! success) {
            return
        }

        this.setDetailData(data)
    },`


    result.setDetail = `setDetailData(data = {}) {
    	const { ${formList.map((formListItem) => formListItem.formItems.map((item) => item.prop).join(', '))} } = data
    	${formList.map((formItem, index) => {
    		return `
    		const ${formItem.prefix}KeyArray = new Map([${formItem.formItems.map((item) => `['${item.prop}', ${item.prop}]`).join(', ')}])

                this.setFormData('${formItem.prefix}FormData', ${formItem.prefix}KeyArray)`
    	}).join('\n')}
    },`

	// 按钮事件
	buttonList.forEach((button, index, arr) => {
		Object.values(button.events ?? {}).forEach((eventValue) => {
			result[eventValue] = `${eventValue}() {

			}${index === arr.length - 1 ? '' : ','}`
		})
	})

	return result
}

module.exports = {
	generateData,
	generateComputedData,
	generateCreatedData,
	generateMethodsData
}