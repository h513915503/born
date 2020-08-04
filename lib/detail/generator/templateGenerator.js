function generatePlane(formList) {
    let result = ``

    formList.forEach((formItem) => {
        result += `
            <div class="jk-detail-panel">
                <h2 class="jk-detail-title">${formItem.title}</h2>

                <div class="jk-detail-item-wrapper">
                    ${generateItem(formItem)}
                </div>
            </div>`
    })

    return result
}

function generateItem({ prefix, formItems }) {
    return formItems.map((item) => {
        return `<div class="jk-detail-item">
            <span class="jk-detail-label">${item.label}：</span>${generateItemType(prefix, item)}
        </div>`
    }).join('')
}

function generateItemType(prefix, item) {
    const map = {
        text: `\n<span class="jk-detail-content">{{${prefix}FormData.${item.prop}}}</span>`,
        image: `
            <div class="jk-detail-image-list">
                <el-image :src="item" fit="cover" :preview-src-list="${prefix}FormData.${item.prop}" v-for="item of ${prefix}FormData.${item.prop}"></el-image>
            </div>`
    }

    return map[item.type]
}

function generateButton(buttonList) {
    return `
        <div class="btn-wrapper">
            ${buttonList.map(({ type, text, events }) => {
                let eventStr = ''

                if (events) {
                    Object.entries(events).forEach(([key, value]) => {
                        eventStr += ` @${key}="${value}"`
                    })
                }

                return `<el-button type="${type ?? 'primary'}"${eventStr}>${text}</el-button>`
            }).join('\n')}
        </div>`
}

module.exports = {
    generatePlane,
    generateButton
}