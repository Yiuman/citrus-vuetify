<template>
  <v-navigation-drawer
    right
    v-model="dialogSwitch"
    absolute
    temporary
    hide-overlay
    :style="{ top: `${scrollTop}px` }"
    :height="navigationHeight"
    :width="width"
  >
    <!-- 字段渲染 -->
    <v-container>
      <v-row v-if="widgetModel" class="px-4">
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
            color="secondary"
            @click="dialogSwitch = !dialogSwitch"
          >
            {{ cancelText }}
          </v-btn>
          <v-btn small tile class="mr-2" color="primary" @click="confirm">
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
        default: () => "400",
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
    data: () => ({
      scrollTop: 0,
      navigationHeight: "100%",
    }),
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
    watch: {
      modelObject: function() {
      },
      dialogSwitch: function(data) {
        if (data) {
          this.handleScroll();
        }
      },
    },
    methods: {
      confirm() {
        this.$emit("confirm");
      },
      handleScroll() {
        const scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        if (scrollTop && scrollTop !== 0) {
          this.scrollTop = scrollTop - 12;
        } else {
          this.scrollTop = 0;
        }

        this.navigationHeight =
          document.body.scrollHeight - this.scrollTop - 108;
      },
    },
  };
</script>

<style></style>
