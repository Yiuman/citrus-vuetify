<template>
  <component
      :is="convertWidget.widgetName"
      v-bind="convertWidget"
      v-model="modelObject[convertWidget.key]"
      @change="widgetChange"
  />
</template>

<script>
import {convertWidget} from "@/utils/widget";

export default {
  name: "WidgetRender",
  props: {
    widget: Object,
    modelObject: Object,
  },
  computed: {
    convertWidget: {
      get() {
        return convertWidget(this.widget);
      },
    },
  },
  methods: {
    widgetChange() {
      this.$emit("widgetChange");
    },
  },
};
</script>
