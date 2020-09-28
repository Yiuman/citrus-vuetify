<template>
    <v-dialog v-model="dialogSwitch">
        <v-card>
            <v-card-title >{{title}}</v-card-title>
            <v-card-text v-if="tips">
                {{tips}}
            </v-card-text>

            <v-card-actions>
                <v-spacer/>
                <v-btn color="grey darken-1" text @click="dialogSwitch = false">取消</v-btn>
                <v-btn color="green darken-1" text @click="confirmAction">确定</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "TipsDialog",
        props: {
            value: Boolean,
            title: String,
            tips: String,
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
            confirmAction() {
                this.dialogSwitch = false;
                this.$emit('confirm');
            }
        }
    }
</script>

<style scoped>
    .tips-text {
        font-size: 16px;
    }
</style>
