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
        return `<el-form-item label="${formItem.label}" prop="${formItem.prop}">
                    ${generateFormItemByType(formItem, prefix)}
                </el-form-item>`
    }).join('\n')
}

function generateFormItemByType(formItem, prefix) {
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