<template>
    <div style="width: 300px !important;">
        <v-dialog v-model="dialogSwitch"
                  :width="dialogView.width || 600"
                  :max-width="`${dialogView.width || 600}px`"
                  :fullscreen="dialogView && dialogView.fullscreen">
            <v-toolbar dense :color="dialogView.color" v-if="Boolean(dialogView.title)">
                <v-toolbar-title>{{dialogView.title}}</v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-form ref="form">
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col :md="12/(editFields.length>3?3:editFields.length)"
                                       v-for="(editField,index) in editFields"
                                       :key="index"
                                >
                                    <component :is="editField.widget.widgetName"
                                               v-bind="convertFieldWidget(editField)"
                                               v-model="currentItem[editField.widget.key]"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer/>
                        <v-btn small outlined color="secondary" @click="dialogSwitch=!dialogSwitch">
                            <v-icon>mdi-close</v-icon>
                            {{cancelText}}
                        </v-btn>
                        <v-btn small color="primary" @click="save">
                            <v-icon>mdi-content-save-outline</v-icon>
                            {{saveText}}
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {convertFieldWidget} from "@/utils/widget";

    const mixins = {
        methods: {
            convertFieldWidget
        }
    };
    export default {
        mixins: [mixins],
        name: "FormDialog",
        props: {
            value: Boolean,
            libNameSpace: {
                type: String,
                default: () => '../template'
            },
            dialogView: Object,
            currentItem: Object,
            cancelText: {
                type: String,
                default: () => '关闭'
            },
            saveText: {
                type: String,
                default: () => '保存'
            }
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
                }
            },
            editFields: {
                get() {
                    return this.dialogView.editFields;
                },
            }
        },
        methods: {
            save() {
                if (this.$refs.form.validate()) {
                    this.$emit("confirm", this.currentItem);
                }
            }
        }
    }
</script>

<style scoped>

</style>
