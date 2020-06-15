/**
 * 处理字段及空间
 * @param editField 字段的数据描述
 */
export const convertFieldWidget = (editField) => {
    const widget = editField.widget;
    let realWidget = convertWidget(widget);
    //处理校验规则
    realWidget.rules = validatorAdapter(editField || []);
    return realWidget;
};

/**
 * 处理控件
 * @param widget 后台返回的控件数据描述
 */
export const convertWidget = (widget) => {
    let widgetProcessorElement = widgetProcessor[widget.widgetName];
    let realWidget;
    //找到处理器进行控件处理，否则直接使用后台返回的组件属性
    if (widgetProcessorElement) {
        realWidget = widgetProcessorElement(widget);
    } else {
        realWidget = {...widget};
    }
    return realWidget;
};

const widgetProcessor = {
    'v-select': (widget) => {
        return {
            key: widget.key,
            label: widget.text,
            items: widget.model,
            'item-text': "label",
            'item-value': 'value',
            multiple: widget.multiple,
            dense: true,
        }
    },
    'v-text-field': (widget) => {
        return {
            ...widget,
            key: widget.key,
            label: widget.text,
            dense: true,
        }
    },
    'tree-select': (widget) => {
        return {
            ...widget,
            dense: true,
            model: '',
            label: widget.text,
            treeItem: widget.model
        }
    }
};

//校验器适配器，用于处理字段的校验
const validatorAdapter = (editField) => {
    const validators = {
        //必填项
        required: function (v) {
            return (v !== undefined && v !== null && v !== '') || `${editField.text}不能为空`;
        },
        //手机号码
        phone: function (v) {
            return ((/^1[3456789]\d{9}$/.test(v))) || `${editField.text}格式错误`
        }
    };

    return editField.rules.map(ruleName => validators[ruleName]);
};

