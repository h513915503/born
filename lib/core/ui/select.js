module.exports = function createSelect(item, prefix) {
	return `<el-select v-model="${prefix}FormData.${item.prop}">
    			<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item of ${item.prop}${item.selectType === 1 ? 'Type' : ''}List"></el-option>
    		</el-select>`
}