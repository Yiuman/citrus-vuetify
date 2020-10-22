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
    realWidget = { ...widget };
  }
  return realWidget;
};

const widgetProcessor = {
  //选择控件
  "v-select": (widget) => {
    return {
      ...widget,
      key: widget.key,
      label: widget.text,
      items: widget.model,
      "x-samll": true,
      "item-text": "label",
      "item-value": "value",
      "small-chips": true,
      multiple: widget.multiple,
      dense: true,
      widgetName: "v-autocomplete",
      clearable: true,
    };
  },
  //input控件
  "v-text-field": (widget) => {
    return {
      ...widget,
      key: widget.key,
      label: widget.text,
      dense: true,
    };
  },
  //文办控件
  "v-textarea": (widget) => {
    return {
      ...widget,
      key: widget.key,
      label: widget.text,
      dense: true,
      rows: 1,
    };
  },
  //树形选择控件
  "tree-select": (widget) => {
    return {
      ...widget,
      dense: true,
      model: "",
      label: widget.text,
      treeItem: widget.model,
    };
  },
  "date-picker": (widget) => {
    return {
      ...widget,
      label:widget.text,   
      dense: true,
    };
  },
};

//校验器适配器，用于处理字段的校验
export const validatorAdapter = (editField) => {
  const validators = {
    //必填项
    required: required(editField.text),
    //手机号码
    phone: function(v) {
      return /^1[3456789]\d{9}$/.test(v) || `${editField.text}格式错误`;
    },
  };

  return editField.rules.map((ruleName) => validators[ruleName]);
};

export const required = function(name) {
  return function(v) {
    return (v !== undefined && v !== null && v !== "") || `${name}不能为空`;
  };
};
