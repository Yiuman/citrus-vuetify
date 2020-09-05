<template>
  <v-navigation-drawer
    right
    v-model="dialogSwitch"
    absolute
    temporary
    hide-overlay
    :width="width"
  >
    <!-- 字段渲染 -->
    <v-container>
      <v-row v-if="widgetModel">
        <v-col :md="12" v-for="(widget, index) in widgets" :key="index">
          <widget-render :widget="widget" :model-object="widgetModel" />
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <v-row align="end" justify="end">
        <v-col>
          <v-btn
            small
            outlined
            tile
            class="mr-2"
            color="grey darken-1"
            @click="dialogSwitch = !dialogSwitch"
          >
            {{ cancelText }}
          </v-btn>
          <v-btn
            small
            outlined
            tile
            class="mr-2"
            color="blue darken-1"
            @click="confirm"
          >
            {{ confirmText }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- 按钮 -->
    <v-container> </v-container>
  </v-navigation-drawer>
</template>

<script>
  import WidgetRender from "@/components/WidgetRender";
  export default {
    name: "FilterNavigation",
    components: { WidgetRender },
    props: {
      value: Boolean,
      width: {
        type: String || Number,
        default: () => "300",
      },
      widgets: Array,
      widgetModel: Object,
      cancelText: {
        type: String,
        default: () => "取消",
      },
      confirmText: {
        type: String,
        default: () => "过滤",
      },
    },
    computed: {
      dialogSwitch: {
        get() {
          return this.value;
        },
        set(val) {
          //grants_改变由父组件控制
          this.$emit("input", val);
        },
      },
    },
    mounted() {
      console.warn(this.widgetModel);
      console.warn(this.widgets);
    },
    watch: {
      modelObject: function() {
        console.warn(this.modelObject);
      },
    },
    methods: {
      confirm() {
        this.$emit("confirm");
      },
    },
  };
</script>

<style></style>
