<template>
  <v-navigation-drawer v-model="dialogSwitch" absolute temporary :width="width">
    <v-form ref="form">
      <!-- 字段渲染 -->
      <v-container>
        <v-row>
          <v-col
            :md="12 / (editFields.length > 2 ? 2 : editFields.length)"
            v-for="(editField, index) in editFields"
            :key="index"
          >
            <component
              :is="editField.widget.widgetName"
              v-bind="convertFieldWidget(editField)"
              v-model="currentItem[editField.widget.key]"
            />
          </v-col>
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
              outlined
              tile
              class="mr-2"
              color="blue darken-1"
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
    },
    methods: {
      save() {
        if (this.$refs.form.validate()) {
          this.$emit("confirm", this.currentItem);
        }
      },
    },
  };
</script>

<style></style>
