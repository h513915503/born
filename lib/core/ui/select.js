module.exports = function createSelect({ prop, selectType }, prefix) {
	return `<el-select v-model="${prefix}FormData.${prop}">
    			<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item of ${prop}${selectType === 1 ? 'Type' : ''}List"></el-option>
    		</el-select>`
}