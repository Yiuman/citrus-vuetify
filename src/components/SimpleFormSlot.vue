<template>
    <div>
        <v-dialog v-model="dialogSwitch" hide-overlay transition="dialog-bottom-transition" :width="width">
            <v-card>
                <!--顶部-->
                <v-toolbar dense color="#fafbfd" class="mb-3" elevation="3">
                    <v-btn  icon @click="toggleSwitch">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title class="font-size-18 font-weight-bold">{{title}}</v-toolbar-title>
                    <v-spacer/>
                    <v-btn  color="success" icon @click="executeSuccess">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-toolbar>

                <slot/>
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
            successAction: Function
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
        },
        methods: {
            toggleSwitch() {
                this.dialogSwitch = !this.dialogSwitch;
            },
            executeSuccess() {
                if (this.successAction) {
                    this.successAction()
                        .then(() => {this.toggleSwitch();})
                } else {
                    this.toggleSwitch();
                }
            }
        }

    }
</script>

<style scoped>

</style>
