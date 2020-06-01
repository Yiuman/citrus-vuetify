<template>
    <v-treeview
            dense
            hoverable
            activatable
            rounded
            :selection-type="selectType"
            v-model="selection"
            :selectable="selectable"
            :multiple-active="multipleActive"
            :items="items"
            return-object
            :open.sync="open"
            :load-children="loadChildren"
            :item-key="itemKey"
            @update:active="updateActive"
            class="hover-pointer"
            :item-text="itemText"
    >
        <template v-slot:prepend="{ item }">
            <v-icon v-text="`mdi-${item.children ? 'home-variant' : 'folder-network'}`"/>
        </template>

        <template v-slot:label="{item}">
            <div class="hover-pointer" @dblclick="$emit('nodeDbClick',item)">{{item[itemText]}}</div>
        </template>
    </v-treeview>
</template>

<script>
    import {TreeService} from "../api/crud";

    export default {
        name: "TreeModel",
        props: {
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
            selected: {
                type: Array,
                default: () => []
            },
            selectType: {
                type: String,
                default: () => 'leaf'
            },
            modelText: String,
            modelKey: String,
        },
        watch: {
            selection: function () {
                this.$emit('selection', this.selection)
            }
        },
        data: () => ({
            itemKey: '',
            lazy: false,
            loading: true,
            itemText: '',
            items: [],
            selection: [],
            open: [],
            queryParam: {},
        }),
        created() {
            this.init()
        },
        methods: {
            init() {
                this.selection = this.selected;
                if (!this.treeItem) {
                    this.crudService = new TreeService(this.namespace);
                    this.load()
                } else {
                    this.handleNodes(this.treeItem, false);
                    this.items.splice(0, 1, this.treeItem)
                    this.itemText = this.modelText;
                    this.itemKey = this.modelKey;
                }

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
            },
            updateActive(nodes) {
                this.$emit('nodeActive', nodes);
                if (this.multipleActive) {
                    this.$emit("input", nodes)
                } else {
                    this.$emit("input", nodes[0])
                }

            }
        }
    }
</script>

<style scoped>

</style>
