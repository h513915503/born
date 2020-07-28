module.exports = function createCascader({ prop, options, attrs = {} }, prefix) {
    return `<el-cascader v-model="${prefix}FormData.${prop}" :props="${prop}Props" :options="${options}Options" filterable clearable placeholder="${attrs.placeholder ?? '请输入'}"></el-cascader>`
}