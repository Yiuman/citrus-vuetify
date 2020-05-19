<template>
    <div>
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
    </div>
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
        data: () => ({
            itemText: '',
            items: [],
            open: []
        }),
        created() {
            this.crudService = new TreeService(this.namespace);
            this.load()
        },
        methods: {
            load() {
                this.crudService.load(this.queryParam).then(data => {
                    this.itemKey = data.itemKey;
                    this.itemText = data.itemText;
                    this.open = [];
                    const tree = data.tree;
                    if(data.dialogView){
                        this.dialogView = data.dialogView ;
                    }

                    if (tree) {
                        this.handleNodes(tree, Boolean(this.queryParam));
                        this.$set(this.items, 0, tree);
                    } else {
                        this.items = [];
                    }

                    //初始化控件
                    if ((!this.widgets || this.widgets.length === 0) && data.widgets) {
                        this.widgets = data.widgets;
                    }

                    //初始化按钮
                    if ((!this.buttons || this.buttons.length === 0) && data.buttons) {
                        this.buttons = data.buttons;
                    }

                });
            },
            loadChildren(node) {
                return new Promise(resolve => {
                    this.crudService.loadChildren(node.organId).then(children => {
                        if (children) {
                            children.forEach(child => {
                                this.handleNodes(child);
                            });
                        }
                        node.children = children;
                        resolve(node);
                    });
                })

            },
            handleNodes(node, openAll) {
                if (node.children) {
                    node.children.forEach(childNode => {
                        this.handleNodes(childNode, openAll)
                    });

                    if (openAll) {
                        this.open.push(node[this.itemKey])
                    }

                } else {
                    delete node.children;
                }
            },
            updateActive(nodes) {
                this.selected =nodes;
            }
        }
    }
</script>

<style scoped>

</style>
