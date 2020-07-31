const fs = require('fs')
const path = require('path')

const data =
`const template = {
    // 元数据
    meta: {
        url: '/api/example',
        method: 'get'
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
                    type: 'text'
                },
                {
                    label: '商品标题',
                    prop: 'title',
                    type: 'text'
                },
                {
                    label: '封面头图',
                    prop: 'imageList',
                    type: 'image',
                    value: []
                }
            ]
        },
        {
            title: '产品信息',
            prefix: 'production',
            formItems: [
                {
                    label: '商品价格',
                    prop: 'price',
                    type: 'text'
                },
                {
                    label: '商品库存',
                    prop: 'stock',
                    type: 'text'
                }
            ]
        }
    ],

    // 按钮
    buttonList: [
        {
            text: '返回',
            type: 'plain',
            events: {
                click: '$router.back()'
            }
        }
    ]
}

module.exports = template`

fs.writeFile(`${path.resolve(process.cwd())}/detail-template.js`, data, (error) => {
    if (error) {
        throw error
    }
})