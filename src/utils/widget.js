const transform = (widget) => {
    let widgetProcessorElement = widgetProcessor[widget.widgetName];
    if (widgetProcessorElement) {
        return widgetProcessorElement(widget);
    }
};

const widgetProcessor = {
    'v-select': (widget) => {
        return {
            ...widget,
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
            label: widget.text,
            dense: true,
        }
    },
    'FormSelectTree': (widget) => {
        return {
            ...widget,
            label:widget.text,
            treeItem:widget.model
        }
    }
};

export default transform
