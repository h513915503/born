module.exports = function createSelect({ prop, selectType }, prefix) {
	let suffix = ''

	if (selectType === 1 && ! prop.endsWith('Type')) {
		suffix = 'Type'
	}

	return `<el-select v-model="${prefix}FormData.${prop}">
    			<el-option :key="item.value" :label="item.text" :value="item.value" v-for="item of ${prop}${suffix}List"></el-option>
    		</el-select>`
}