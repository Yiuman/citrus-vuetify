<template>
  <v-navigation-drawer
    v-model="dialogSwitch"
    disable-resize-watcher
    absolute
    temporary
    :width="dialogView.width || width"
  >
    <v-form ref="form" v-show="dialogSwitch">
      <!-- 字段渲染 -->
      <v-container>
        <v-row>
          <template v-for="(editFieldWidget, index) in editFieldWidgets">
            <v-col
              :md="getColMd(editFieldWidget, editFieldWidgets.length)"
              :key="index"
            >
              <component
                :is="editFieldWidget.widgetName"
                v-bind="editFieldWidget"
                v-model="currentItem[editFieldWidget.key]"
              />
            </v-col>
          </template>
        </v-row>

        <v-divider />
        <v-row justify="end">
          <v-col md="4" align="end">
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
              tile
              class="mr-2"
              color="primary"
              @click="save"
            >
              {{ saveText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-navigation-drawer>
</template>

<script>
  import { convertFieldWidget } from "../utils/widget";

  const mixins = {
    methods: {
      convertFieldWidget,
    },
  };
  export default {
    name: "FormNavigation",
    mixins: [mixins],
    props: {
      value: Boolean,
      width: {
        type: String || Number,
        default: () => "500",
      },
      libNameSpace: {
        type: String,
        default: () => "../template",
      },
      dialogView: Object,
      currentItem: Object,
      cancelText: {
        type: String,
        default: () => "关闭",
      },
      saveText: {
        type: String,
        default: () => "保存",
      },
    },
    computed: {
      dialogSwitch: {
        get() {
          return this.value;
        },
        set(val) {
          this.$refs.form.resetValidation();
          //grants_改变由父组件控制
          this.$emit("input", val);
        },
      },
      editFields: {
        get() {
          return this.dialogView.editFields;
        },
      },
      editFieldWidgets: {
        get() {
          if (this.editFields) {
            return this.editFields.map((editField) =>
              this.convertFieldWidget(editField)
            );
          }
          return null;
        },
      },
    },
    methods: {
      save() {
        if (this.$refs.form.validate()) {
          this.$emit("confirm", this.currentItem);
        }
      },
      getColMd(widget, widgetsLength) {
        const col12Widgets = ["v-textarea"];
        if (col12Widgets.indexOf(widget.widgetName) > -1) {
          return 12;
        }

        return 12 / (widgetsLength > 2 ? 2 : widgetsLength);
      },
    },
  };
</script>

<style>

</style>
