<template>
    <v-treeview
            class="hover-pointer"
            item-disabled="locked"
            hoverable
            rounded
            return-object
            v-model="selection"
            :activatable="activatable"
            :selection-type="selectType"
            :dense="isDense"
            :selectable="selectable"
            :multiple-active="multipleActive"
            :items="items"
            :open.sync="open"
            :load-children="loadChildren"
            :item-key="itemKey"
            :item-text="itemText"
            :filter="filter"
            @update:active="updateActive"
    >
        <template v-slot:prepend="{ item }">
            <v-icon small v-text="`mdi-${item.children ? 'home-variant' : 'folder-network'}`"/>
        </template>

        <template v-slot:label="{item}">
            <div class="hover-pointer font-size-14" @dblclick="$emit('nodeDbClick',item)">{{item[itemText]}}</div>
        </template>
    </v-treeview>
</template>

<script>
    import {TreeService} from "../api/crud";

    export default {
        name: "TreeModel",
        props: {
            value: Array,
            dense: Boolean,
            activatable: {
                type: Boolean,
                default: () => true
            },
            filter: Function,
            displayRoot: Boolean,
            treeItem: Object,
            namespace: {
                type: String,
                default: () => ''
            },
            multipleActive: {
                type: Boolean,
                default: () => false
            },
            selectable: {
                type: Boolean,
                default: () => false
            },
            //树模型的选择方式，leaf只能选择子节点，independent为单独可选
            selectType: {
                type: String,
                default: () => 'leaf'
            },
            modelText: String,
            modelKey: String,
            /**
             * 节点处理的扩展方法，用于获取节点的时候进行处理的时候，可能有特殊的节点处理方式，进行扩展
             */
            nodeHandleWrapper: Function,
        },
        data: () => ({
            isDisplayRoot: true,
            isDense: true,
            itemKey: '',
            lazy: false,
            loading: true,
            itemText: '',
            items: [],
            selection: [],
            open: [],
            queryParam: {},
        }),
        watch: {
            value: function () {
                if (this.value.length === this.selection) {
                    return;
                }
                this.initSelection();
            },
            selection: function () {
                this.$emit("selection", this.selection)
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                this.isDisplayRoot = this.displayRoot;
                this.isDense = this.dense;
                if (!this.treeItem) {
                    this.crudService = new TreeService(this.namespace);
                    this.load()
                } else {
                    this.handleNodes(this.treeItem, false);
                    this.items.splice(0, 1, this.treeItem);
                    this.itemText = this.modelText;
                    this.itemKey = this.modelKey;
                }
            },
            initSelection() {
                this.selection = this.value;
            },
            load() {
                const vm = this;
                vm.loading = true;
                vm.crudService.load(vm.queryParam).then(data => {
                    vm.itemKey = data.itemKey;
                    vm.itemText = data.itemText;
                    vm.lazy = data.lazy;
                    vm.open = [];
                    const tree = data.tree;
                    if (data.dialogView) {
                        this.dialogView = data.dialogView;
                    }

                    if (tree) {
                        vm.handleNodes(tree, !vm.lazy || Boolean(Object.keys(vm.queryParam).length));

                        //是否显示根节点
                        if (data.displayRoot) {
                            this.items.splice(0, 1, tree)
                        } else {
                            this.items = [...tree.children]

                        }

                    } else {
                        vm.items = [];
                    }

                    //初始化控件
                    if ((!vm.widgets || vm.widgets.length === 0) && data.widgets) {
                        vm.widgets = data.widgets;
                    }

                    //初始化按钮
                    if ((!vm.buttons || vm.buttons.length === 0) && data.buttons) {
                        vm.buttons = data.buttons;
                    }

                    this.loading = false;

                });
            },
            loadChildren(node) {
                return new Promise(resolve => {
                    this.crudService.loadChildren(node[this.itemKey]).then(children => {
                        if (children) {
                            children.forEach(child => {
                                this.handleNodes(child, this.lazy);
                            });
                        }
                        node.children = children;
                        resolve(node);
                    });
                })

            },
            handleNodes(node, open) {
                if (node.children) {
                    node.children.forEach(childNode => {
                        this.handleNodes(childNode, open)
                    });

                    if (open || !node.parentId) {
                        this.open.push(node[this.itemKey])
                    }

                    if (node.leaf) {
                        delete node.children;
                    }

                } else {
                    delete node.children;
                }

                if (this.nodeHandleWrapper) {
                    this.nodeHandleWrapper(node);
                }
            },
            updateActive(nodes) {
                this.$emit('nodeActive', nodes);
                this.$emit("input", nodes)
            }
        }
    }
</script>

<style scoped>

</style>
