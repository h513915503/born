function generatePlane(detailData) {
    let result = ``

    detailData.list.forEach((item) => {
        result += `
            <div class="jk-detail-panel">
                <h2 class="jk-detail-title">${item.title}</h2>

                <div class="jk-detail-item-wrapper">
                    ${generateItem(detailData.prefix, item.dataItems)}
                </div>
            </div>`
    })

    return result
}

function generateItem(prefix, formItems) {
    return formItems.map((item) => {
        return `<div class="jk-detail-item">
            <span class="jk-detail-label">${item.label}：</span>${generateItemType(prefix, item)}
        </div>`
    }).join('')
}

function generateItemType(prefix, item) {
    const map = {
        text: `\n<span class="jk-detail-content">{{${prefix}DataItem.${item.prop}}}</span>`,
        image: `
            <div class="jk-detail-image-list">
                <el-image :src="item" fit="cover" :key="item" :preview-src-list="${prefix}DataItem.${item.prop}" v-for="item of ${prefix}DataItem.${item.prop}"></el-image>
            </div>`
    }

    if (item.type === 'image' && item.value === '') {
        map.image =  `<el-image :src="${prefix}DataItem.${item.prop}" fit="cover"></el-image>`
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