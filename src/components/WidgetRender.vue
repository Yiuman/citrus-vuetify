<template>
  <component
        :is="widget.widgetName"
        v-bind="convert(widget)"
        v-model="modelObject[widget.key]"
        @change="widgetChange"
      />
</template>

<script>
import { convertWidget } from "../utils/widget";

  export default {
    name: "WidgetRender",
    props: {
      widget: Object,
      modelObject: Object,
    },
    methods: {
      convert(widget) {
        return convertWidget(widget);
      },
      widgetChange() {
        this.$emit("widgetChange");
      },
    },
  };
</script>

<style>

</style>