<template>
    <v-card :loading="loading" class="py-2 px-2 height-100pc">
        <!--控件及按钮-->
        <widget-button :widgets="widgets" :buttons="buttons" :model-object="queryParam" @widgetChange="load"
                       @buttonClick="doAction"/>
        <v-card-text>
            <v-treeview
                    dense
                    hoverable
                    activatable
                    rounded
                    :items="items"
                    :open.sync="open"
                    :load-children="loadChildren"
                    :item-key="itemKey"
                    @update:active="updateActive"
                    :item-text="itemText"
            >
                <template v-slot:label="{item}">
                    <div @dblclick="edit('edit',item)">{{item[itemText]}}</div>
                </template>
                <template v-slot:prepend="{ item }">
                    <v-icon v-text="`mdi-${item.children ? 'home-variant' : 'folder-network'}`"/>
                </template>
            </v-treeview>
        </v-card-text>

        <slot name="add-dialog">
            <form-dialog v-model="actionSwitch.add" :dialog-view="dialogView"
                         :current-item="currentItem" @confirm="edit_"/>
        </slot>
        <slot name="edit-dialog">
            <form-dialog v-model="actionSwitch.edit" :dialog-view="dialogView" :current-item="currentItem"
                         @confirm="edit_"/>
        </slot>
        <slot name="delete-dialog">
            <tips-dialog v-model="actionSwitch.delete" title="确认要删除当前数据项吗?" @confirm="delete_(currentItem)"/>
        </slot>

        <slot name="delete-batch-dialog">
            <tips-dialog v-model="actionSwitch.batchDelete" title="确认要删除当期所选数据项吗?"
                         @confirm="batchDelete_(selected)"/>
        </slot>

        <!--消息提示-->
        <v-snackbar v-model="snackbar.switch" top multi-line>
            {{ snackbar.text }}
            <v-btn outlined @click="snackbar.switch = false">确认</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    import {TreeService, mixins} from "../api/crud";
    import FormDialog from "./FormDialog";
    import TipsDialog from "./TipsDialog";
    import WidgetButton from "./WidgetButton";

    export default {
        name: "CrudTree",
        mixins: [mixins],
        components: {WidgetButton, TipsDialog, FormDialog},
        watch: {
            namespace: 'init'
        },
        data: () => ({
            loading: true,
            lazy: false,
            itemText: '',
            items: [],
            open: []
        }),
        created() {
            this.init();
        },
        methods: {
            init() {
                this.crudService = new TreeService(this.namespace);
                this.dialogView = {};
                this.widgets = [];
                this.buttons = [];
                this.load()
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
                this.selected = nodes;
            },
            add(actions) {
                mixins.methods.add.call(this, actions);
                this.currentItem['parentId'] = this.selected[0] || (this.items[0] || {})[this.itemKey] || null;
            }
        }
    }
</script>

<style scoped>

</style>
