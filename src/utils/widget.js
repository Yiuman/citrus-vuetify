const transform = (widget) => {
    let widgetProcessorElement = widgetProcessor[widget.widgetName];
    if (widgetProcessorElement) {
        return widgetProcessorElement(widget);
    }
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
            key: widget.key,
            label: widget.text,
            dense: true,
        }
    },
    'tree-select': (widget) => {
        return {
            ...widget,
            model:'',
            label: widget.text,
            treeItem: widget.model
        }
    }
};

export default transform
