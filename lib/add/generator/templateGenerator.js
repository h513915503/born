function generatePlane(formList) {
    let result = ``

    formList.forEach((formItem) => {
        const prefix = formItem.prefix

        result += `
            <div class="jk-add-panel">
                <h2 class="jk-add-title">${formItem.title}</h2>

                <el-form :model="${prefix}FormData" :rules="${prefix}Rules" label-position="left" label-width="80px" ref="${prefix}Form">
                    ${generateFormItem(formItem.formItems, prefix)}
                </el-form>
            </div>`
    })

    return result
}

function generateFormItem(formItems, prefix) {
    return formItems.map((formItem) => {
        let required = ''

        if (formItem.required) {
            required = 'required'
        }

        if (formItem.rules) {
            required = ''
        }

        return `<el-form-item label="${formItem.label}"${formItem.prop ? `prop="${formItem.prop}"` : ''}${required}>
                    ${generateFormItemByType(formItem, prefix)}
                </el-form-item>`
    }).join('\n')
}

function generateFormItemByType(formItem, prefix) {
    const map = {
        text: `<span class="jk-item-content">{{dataItem.${formItem.prop}}}</span>`,
        image:  `<el-image :src="dataItem.${formItem.prop}" fit="cover"></el-image>`
    }

    if (map[formItem.type]) {
        return map[formItem.type]
    }

    formItem.type = formItem.type === 'daterange' ? 'date' : formItem.type

    return require(`../../core/ui/${formItem.type}.js`)(formItem, prefix)
}

function generateButton(buttonList) {
    return `
        <div class="btn-wrapper">
            ${buttonList.map(({ type, text, events, loadingKey, disabled }) => {
                let eventStr = ''
                let loading = ''
                let disabledStr = ''

                if (events) {
                    Object.entries(events).forEach(([key, value]) => {
                        eventStr += ` @${key}="${value}"`
                    })
                }

                if (loadingKey) {
                    loading = ` :loading="${loadingKey}BtnLoading"`
                }

                if (disabled) {
                    disabledStr = ` :disabled="${disabled}"`
                }

                return `<el-button type="${type ?? 'primary'}"${disabledStr}${loading}${eventStr}>${text}</el-button>`
            }).join('\n')}
        </div>`
}

module.exports = {
    generatePlane,
    generateButton
}