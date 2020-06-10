<template>
    <div class="tree-select">
        <v-menu v-model="showPanel"
                eager
                offset-y
                :z-index="9999"
        >
            <template v-slot:activator="{ on }">
                <v-text-field class="hover-pointer"
                              readonly
                              :dense="dense"
                              :label="label"
                              v-model="valueText"
                              v-on="on"
                              append-icon="$dropdown"
                              @click:append="showPanel=!showPanel"
                />
            </template>

            <tree-model
                    v-show="showPanel"
                    class="bg-color-white"
                    style="width: 300px"
                    :select-type="selectType"
                    :selectable="multipleSelect"
                    :model-key="modelKeyField"
                    :model-text="modelTextField"
                    :tree-item="treeItem"
                    :value="selection"
                    v-bind="$attrs"
                    @nodeActive="nodeActive"
                    @selection="selectionActive"

            />
        </v-menu>
    </div>
</template>

<script>

    import TreeModel from "./TreeModel";

    export default {
        name: "TreeSelect",
        components: {TreeModel},
        props: {
            value: [Array, Object, String, Number],
            dense: {
                type: Boolean,
                default: () => true,
            },
            selectType: {
                type: String,
                default: () => 'independent'
            },
            multipleSelect: {
                type: Boolean,
                default: () => false,
            },
            multipleActive: {
                type: Boolean,
                default: () => false
            },
            label: {
                type: String,
                default: () => ''
            },
            treeItem: Object,
            selected: {
                type: Array,
                default: () => []
            },
            modelTextField: String,
            modelKeyField: String
        },
        watch: {
            value: function () {
                if (JSON.stringify(this.value) === JSON.stringify(this.modelValue)) {
                    return;
                }

                //value改变要判断是否与模型值一致，否则会出先无限递归

                this.initSelection();


            }
        },
        methods: {
            initSelection() {
                if (this.value instanceof Array) {
                    if (this.value && this.value.length > 0) {
                        const selected = [];
                        this.value.forEach(id => {
                            selected.push({[this.modelKeyField]: id})
                        });
                        this.selection = selected;
                    } else {
                        this.selection = [];
                    }
                } else {
                    const selected = [];
                    selected.push({[this.modelKeyField]: this.value});
                    this.selection = selected;
                }
            },
            nodeActive(nodes) {
                this.active(nodes);
            },
            selectionActive(nodes) {
                this.active(nodes);
            },
            active(nodes) {
                if (!nodes || nodes.length === 0) {
                    return;
                }
                if (this.multipleSelect) {
                    this.valueText = nodes.map(item => item[this.modelTextField]).join(',');
                    this.modelValue = nodes.map(item => item[this.modelKeyField]);
                    this.$emit("input", this.modelValue);
                } else {
                    this.valueText = nodes[0][this.modelTextField];
                    this.modelValue = nodes[0][this.modelKeyField];
                    this.$emit("input", this.modelValue);
                }
            }
        },
        data: () => ({
            showPanel: false,
            selection: [],
            modelValue: null,
            valueText: '',
        }),
        mounted() {
            this.initSelection();
        }
    }
</script>

<style scoped>
    .tree-select:hover {
        cursor: pointer !important;
    }

    .tree-select >>> .v-text-field__slot input:hover {
        cursor: pointer !important;
    }
</style>
