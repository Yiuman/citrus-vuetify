<template>
  <v-navigation-drawer v-model="dialogSwitch" absolute temporary :width="width">
    <v-form ref="form">
      <slot />
      <v-spacer />
      <!-- 按钮 -->
      <v-container>
        <v-row justify="end">
          <v-col md="4" align="end">
            <v-btn
              small
              outlined
              tile
              class="mr-2"
              color="grey darken-1"
              @click="toggleSwitch"
            >
              {{ cancelText }}
            </v-btn>
            <v-btn
              small
              outlined
              tile
              class="mr-2"
              color="blue darken-1"
              @click="executeSuccess"
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
  export default {
    name: "SimpleFormNavigation",
    props: {
      value: Boolean,
      cancelText: {
        type: String,
        default: () => "取消",
      },
      width: {
        type: [Number, String],
        default: () => "500",
      },
      saveText: {
        type: String,
        default: () => "保存",
      },
      successAction: Function,
    },
    computed: {
      dialogSwitch: {
        get() {
          return this.value;
        },
        set(val) {
          //grants_改变由父组件控制
          const form = this.$refs.form;
          if (form) {
            form.resetValidation();
          }

          this.$emit("input", val);
        },
      },
    },
    methods: {
      toggleSwitch() {
        this.dialogSwitch = !this.dialogSwitch;
      },
      executeSuccess() {
        let formValid = true;
        const form = this.$refs.form;
        if (form) {
          formValid = form.validate();
        }

        if (formValid) {
          if (this.successAction) {
            this.successAction().then(() => {
              this.toggleSwitch();
              //整个提交流程执行完成的回调
              this.$emit("callback");
            });
          } else {
            this.toggleSwitch();
          }
        }
      },
    },
  };
</script>

<style></style>
