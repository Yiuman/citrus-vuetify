<template>
    <div>
        <v-dialog v-model="dialogSwitch"
                  :max-width="`${dialogView.width?dialogView.width:800}px`"
                  :fullscreen="dialogView && dialogView.fullscreen">
            <v-toolbar dense :color="dialogView.color" v-if="Boolean(dialogView.title)">
                <v-toolbar-title>{{dialogView.title}}</v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-form>
                    <v-card-text>

                        <v-container>
                            <v-row>
                                <v-col v-for="(editField,index) in editFields" :key="index" cols="12" sm="6"
                                       md="4">
                                    <component :is="editField.widget.widgetName"
                                               v-bind="transform(editField.widget)"
                                               v-model="currentItem[editField.widget.key]"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer/>
                        <v-btn color="grey darken-1" outlined @click="dialogSwitch=!dialogSwitch">{{cancelText}}</v-btn>
                        <v-btn color="blue darken-1" outlined @click="save">{{saveText}}</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import transform from "../utils/widget";
    const mixins = {
        methods: {
            transform
        }
    };
    export default {
        mixins:[mixins],
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
                    //grants_改变由父组件控制
                    this.$emit("input", val);
                }
            },
            editFields:{
                get(){
                    return this.dialogView.editFields;
                },
            }
        },
        methods: {
            save() {
                this.$emit("confirm", this.currentItem);
            }
        }
    }
</script>

<style scoped>

</style>
