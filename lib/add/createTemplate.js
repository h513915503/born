const fs = require('fs')
const path = require('path')

const data =
`const template = {
    // 元数据
    meta: {
        name: 'add',
        url: '/api/example',
        method: 'post',
        urlEdit: '/api/example/edit',
        methodEdit: 'put'
    },

    // 表单
    formList: [
        {
            title: '个人信息',
            prefix: 'info',
            formItems: [
                {
                    label: '真实姓名',
                    prop: 'name',
                    type: 'input',
                    required: true,
                    isNeedCheck: {
                        funcProp: 'isChinese',
                        message: '姓名必须是汉字'
                    },

                    rules: [
                        {
                            required: true,
                            message: '请输入真实姓名',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 20,
                            message: '姓名长度 2 - 20 个字符',
                            trigger: 'blur'
                        }
                    ],

                    attrs: {
                        placeholder: '请输入真实姓名'
                    }
                },
                {
                    label: '手机号码',
                    prop: 'phone',
                    type: 'input',
                    required: true,

                    isNeedCheck: {
                        funcProp: 'isPhone',
                        message: '手机号码不合法'
                    },

                    rules: [
                        {
                            required: true,
                            message: '请输入手机号码',
                            trigger: 'blur'
                        },
                        {
                            min: 11,
                            max: 11,
                            message: '手机号码长度 11 位',
                            trigger: 'blur'
                        }
                    ],

                    // 1 纯数字
                    // 2 纯数字 + 小数点
                    // 3 手机号码
                    // 默认放开
                    numberType: 3,

                    attrs: {
                        type: 'number',
                        placeholder: '请输入手机号码'
                    }
                },
                {
                    label: '店铺头图',
                    num: 4,
                    tips: '只能上传图片',
                    type: 'imageUpload',
                    handleFunc: 'handleJkUploadComplete'
                },
                {
                    label: '证件类型',
                    prop: 'cardType',
                    type: 'select',
                    require: true,

                    rules: [
                        {
                            required: true,
                            message: '请输入证件类型',
                            trigger: 'blur'
                        }
                    ],

                    // 1 下拉框列表来源于 enum 枚举文件
                    // 2 下拉框列表来源于 接口数据
                    selectType: 1
                },
                {
                    label: '职业类型',
                    prop: 'profession',
                    type: 'select',

                    // 1 下拉框列表来源于 enum 枚举文件
                    // 2 下拉框列表来源于 接口数据

                    selectType: 2,
                    selectRequestURL: '/api/example',
                },
                {
                    label: '证件期限',
                    prop: 'cardExpireType',
                    type: 'radio',
                    value: 1,

                    // radioValue 是数组，直接写入 data
                    // radioValue 是字符串，则从 enum 读取
                    radioValueList: [
                        {
                            label: '固定有效期',
                            value: 0
                        },
                        {
                            label: '长期有效',
                            value: 1
                        }
                    ]
                },
                {
                    label: '选择时间',
                    prop: 'time',
                    type: 'daterange',
                    value: [],
                    valueFormat: 'yyyy-MM-dd',
                    attrs: {
                        startPlaceholder: '选择开始日期时间',
                        endPlaceholder: '选择结束日期时间'
                    }
                },
                {
                    label: '注册地址',
                    prop: 'region',
                    type: 'cascader',
                    value: [],
                    props: {
                        value: 'value',
                        label: 'label'
                    },
                    options: 'regionList',
                    attrs: {
                        placeholder: '请选择注册地址'
                    }
                }
            ]
        },

        {
            title: '公司信息',
            prefix: 'company',
            formItems: [
                {
                    label: '公司名称',
                    prop: 'name',
                    type: 'input',
                    required: true,
                    isNeedCheck: {
                        funcProp: 'isChinese',
                        message: '公司名称必须是汉字'
                    },

                    rules: [
                        {
                            required: true,
                            message: '请输入公司名称',
                            trigger: 'blur'
                        }
                    ],

                    attrs: {
                        placeholder: '请输入公司名称'
                    }
                },
                {
                    label: '金额',
                    prop: 'cardNumber',
                    type: 'input',
                    numberType: 2,
                    attrs: {
                        placeholder: '请输入金额'
                    }
                },
                {
                    label: '水果',
                    prop: 'fruitType',
                    type: 'checkbox',
                    value: [],

                    // checkboxValue 是数组，直接写入 data
                    // checkboxValue 是字符串，则从 enum 读取
                    checkboxValueList: [
                        {
                            label: '苹果',
                            value: 0
                        },
                        {
                            label: '香蕉',
                            value: 1
                        },
                        {
                            label: '雪梨',
                            value: 2
                        },
                        {
                            label: '冬枣',
                            value: 3
                        }
                    ]
                }
            ]
        }
    ],

    // 按钮
    buttonList: [
        {
            text: '取消',
            type: 'plain',
            events: {
                click: 'cancel'
            }
        },
        {
            text: '提交审核',
            loadingKey: 'submit',
            disabled: 'isDisabledBtnSubmit',
            events: {
                click: 'readySubmit'
            }
        }
    ]
}

module.exports = template`

fs.writeFile(`${path.resolve(process.cwd())}/add-template.js`, data, (error) => {
    if (error) {
        throw error
    }
})