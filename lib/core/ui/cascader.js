module.exports = function createCascader(item, prefix) {
    return `<el-cascader v-model="${prefix}FormData.${item.prop}" :props="${item.prop}Props" :options="${item.options}Options" filterable clearable placeholder="${item ?. attrs ?. placeholder ?? '请输入'}"></el-cascader>`
}