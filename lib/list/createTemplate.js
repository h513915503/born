const fs = require('fs')
const path = require('path')

const data =
`const template = {
    // 元数据
    meta: {
        url: '/api/example',
        method: 'get'
    },

    // 搜索
    search: {
        labelWidth: '80px',
        labelPosition: 'left',
        searchConditionList: [
            {
                prop: 'roomName',
                label: '房间名称',
                type: 'input',
                attrs: {
                    placeholder: '请输入房间名称'
                }
            },
            {
                prop: 'phone',
                label: '手机号',
                type: 'input',
                // 1 纯数字
                // 2 纯数字 + 小数点
                // 3 手机号
                numberType: 1,
                attrs: {
                    type: 'number',
                    placeholder: '请输入手机号'
                }
            },
            {
                prop: 'referrer',
                label: '来源列表',
                type: 'select',
                // 1 下拉框列表来源于 enum 枚举文件
                // 2 下拉框列表来源于 接口数据
                selectType: 1,
                enumDir: 'shop',
                attrs: {
                    placeholder: '请选择',
                }
            },
            {
                prop: 'payment',
                label: '支付列表',
                type: 'select',
                // 1 下拉框列表来源于 enum 枚举文件
                // 2 下拉框列表来源于 接口数据
                selectType: 2,
                selectRequestURL: '/api/example',
                attrs: {
                    placeholder: '请选择',
                }
            },
            {
                prop: 'loginTime',
                label: '登录时间',
                type: 'date',
                attrs: {
                    placeholder: '请选择时间',
                }
            },
            {
                prop: 'updateTimeRange',
                label: '更新时间',
                type: 'daterange',
                attrs: {
                    startPlaceholder: '请选择开始时间',
                    endPlaceholder: '请选择结束时间'
                }
            }
        ]
    },

    // 按钮
    button: [
        {
            type: 'primary',
            disabled: 'isDisabled',
            text: '按钮'
        },
        {
            type: 'primary',
            text: '导入',
            loading: 'importBtnLoading',
            isImport: true
        }
    ],

    // 表格
    table: {
        stripe: true,
        tableColumnList: [
            {
                prop: 'id',
                label: '序号'
            },
            {
                prop: 'id',
                label: 'logo',
                isImage: true
            },
            {
                prop: 'id',
                label: '序号',
                // 生成详情
                isDetailKind: true
            },
            {
                prop: 'time',
                label: '时间',
                sortable: 'custom'
            },
            {
                prop: 'money',
                label: '金额',
                minWidth: 100,
                align: 'center'
            },
            {
                label: '地址',
                isCustom: true
            },
            {
                label: '状态',
                prop: 'status',
                formatter: true
            },
            {
                label: '操作',
                operationList: [
                    {
                        text: '默认按钮',
                        isPlainBtn: true
                    },
                    {
                        text: '审核',
                        dropdownList: [
                            {
                                text: '通过',
                                command: 'resolve'
                            },
                            {
                                text: '拒绝',
                                command: 'reject'
                            }
                        ],
                        isDropdownBtn: true
                    },
                    {
                        text: '查看',
                        prop: 'id',
                        path: '/detail'
                    },
                    {
                        text: '编辑',
                        prop: 'id',
                        path: '/put',
                        query: {
                            id: 'id'
                        }
                    }
                ]
            }
        ]
    },

    // 弹窗
    modal: {
        title: '弹窗标题',
        visibleProp: 'dialogVisible',
        loadingProp: 'dialogBtnLoading'
    },

    // 分页
    pagination: true
}

module.exports = template`

fs.writeFile(`${path.resolve(process.cwd())}/list-template.js`, data, (error) => {
    if (error) {
        throw error
    }
})