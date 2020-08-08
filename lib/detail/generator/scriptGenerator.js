const { toUpperCaseFirst } = require('../../utils/index.js')

let functionCreated = ''

function generateData(detailData) {
	const loadingData = {
		loading: false
	}
	const formData = {
		lf: true
	}

	detailData.list.forEach((formListItem) => {
		// 表单数据
		formData[`${detailData.prefix}DataItem`] = Object.fromEntries(formListItem.dataItems.filter((item) => item.type === 'image').map(({prop, value}) => {
			return [prop, value ?? '']
		}))
	})

	return [loadingData, formData]
}

function generateComputedData(detailData) {
	const result = {}

	return result
}

function generateCreatedData() {
	return `this.loading = true
		this.${functionCreated}().then(() => {
		this.loading = false
	})`
}

function generateMethodsData(meta, detailData, buttonList) {
	const result = {}

	// 获取详情
	const key = 'getDetailData'

	// created 钩子需要调用的函数
	functionCreated = key

	result[key] = `async ${key}() {
		const params = this.$route.query
        const {success, data} = await this.http.get('${meta.url}', { params })

        if (! success) {
            return
        }

        this.${detailData.prefix}DataItem = data
    }`

	// 按钮事件
	buttonList.forEach((button, index, arr) => {
		Object.values(button.events ?? {}).forEach((eventValue) => {
			// 过滤以 $ 开头的内联函数
			if (eventValue.startsWith('$')) {
				return
			}

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