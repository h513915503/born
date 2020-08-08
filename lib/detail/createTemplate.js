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
    detailData: {
        prefix: 'info',
        list: [
            {
                title: '基本信息',
                dataItems: [
                    {
                        label: '微信二维码',
                        prop: 'imageList',
                        type: 'image',
                        value: ''
                    },
                    {
                        label: '微信头像',
                        prop: 'avatar',
                        type: 'image',
                        value: ''
                    },
                    {
                        label: '微信号',
                        prop: 'wxNumber',
                        type: 'text'
                    },
                    {
                        label: '微信 id',
                        prop: 'wxId',
                        type: 'text'
                    },
                    {
                        label: '最后登录',
                        prop: 'lastLoginTime',
                        type: 'text'
                    }
                ]
            }
        ]
    },

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