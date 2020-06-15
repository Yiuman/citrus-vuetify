<template>
    <div>
        <v-dialog v-model="dialogSwitch" hide-overlay transition="dialog-bottom-transition" :width="width">
            <v-card>
                <!--顶部-->
                <v-toolbar dense color="#fafbfd" class="mb-3" elevation="3">
                    <v-btn icon @click="toggleSwitch">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title class="font-size-18 font-weight-bold">{{title}}</v-toolbar-title>
                    <v-spacer/>
                    <v-btn color="success" icon @click="executeSuccess">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-form ref="form">
                    <slot/>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "SimpleFormSlot",
        props: {
            value: Boolean,
            title: {
                type: String,
                default: () => ''
            },
            width: {
                type: [Number, String],
                default: () => '800'
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
                }
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
                    formValid = form.validate()
                }

                if (formValid) {
                    if (this.successAction) {
                        this.successAction()
                            .then(() => {
                                this.toggleSwitch();
                                //整个提交流程执行完成的回调
                                this.$emit('callback')
                            })
                    } else {
                        this.toggleSwitch();
                    }
                }

            }
        }
    }
</script>

<style scoped>

</style>
