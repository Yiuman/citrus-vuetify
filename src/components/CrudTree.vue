<template>
  <v-card :loading="loading" class="py-2 px-2 height-100pc crud-tree">
    <!--按钮及控件-->
    <v-row no-gutters justify="space-between" align="center">
      <v-col>
        <ButtonRender :buttons="buttons" @buttonClick="doAction" />
      </v-col>
      <!--控件的渲染-->
      <v-col align="end" class="pr-2">
        <template v-if="widgets && widgets.length > 0">
          <div class="col-item" @click="showFilter = !showFilter">
            <v-icon small color="#8091a5">mdi-filter-menu-outline</v-icon>
            过滤
          </div>
          <FilterNavigation
            v-model="showFilter"
            :widgets="widgets"
            :widget-model="queryParam"
            @confirm="load"
          />
        </template>
      </v-col>
    </v-row>
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
        <template v-slot:label="{ item }">
          <div @dblclick="edit('edit', item)">{{ item[itemText] }}</div>
        </template>
        <template v-slot:prepend="{ item }">
          <v-icon
            v-text="`mdi-${item.children ? 'home-variant' : 'folder-network'}`"
          />
        </template>
      </v-treeview>
    </v-card-text>
    <slot name="add-dialog">
      <FormNavigation
        v-model="actionSwitch.add"
        :dialog-view="dialogView"
        :current-item="currentItem"
        @confirm="edit_"
      />
    </slot>
    <slot name="edit-dialog">
      <FormNavigation
        v-model="actionSwitch.edit"
        :dialog-view="dialogView"
        :current-item="currentItem"
        @confirm="edit_"
      />
    </slot>
    <slot name="delete-dialog">
      <tips-dialog
        v-model="actionSwitch.delete"
        title="确认要删除当前数据项吗?"
        @confirm="delete_(currentItem)"
      />
    </slot>

    <slot name="delete-batch-dialog">
      <tips-dialog
        v-model="actionSwitch.batchDelete"
        title="确认要删除当期所选数据项吗?"
        @confirm="batchDelete_(selected)"
      />
    </slot>

    <!--消息提示-->
    <v-snackbar v-model="snackbar.switch" top multi-line>
      {{ snackbar.text }}
      <v-btn outlined @click="snackbar.switch = false">确认</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
  import { TreeService, mixins } from "../api/crud";
  import FormNavigation from "./FormNavigation";
  import TipsDialog from "./TipsDialog";
  // import WidgetButton from "./WidgetButton";
  import ButtonRender from "@/components/ButtonRender";
  import FilterNavigation from "@/components/FilterNavigation";

  export default {
    name: "CrudTree",
    mixins: [mixins],
    components: { TipsDialog, FormNavigation, ButtonRender, FilterNavigation },
    watch: {
      namespace: "init",
    },
    data: () => ({
      loading: true,
      lazy: false,
      itemText: "",
      items: [],
      open: [],
      showFilter:false,
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
        this.load();
      },
      load() {
        const vm = this;
        vm.loading = true;
        vm.crudService.load(vm.queryParam).then((data) => {
          vm.itemKey = data.itemKey;
          vm.itemText = data.itemText;
          vm.lazy = data.lazy;
          vm.open = [];
          const tree = data.tree;
          if (data.dialogView) {
            this.dialogView = data.dialogView;
          }

          if (tree) {
            vm.handleNodes(
              tree,
              !vm.lazy || Boolean(Object.keys(vm.queryParam).length)
            );

            //是否显示根节点
            if (data.displayRoot) {
              this.items.splice(0, 1, tree);
            } else {
              this.items = [...tree.children];
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
        return new Promise((resolve) => {
          this.crudService.loadChildren(node[this.itemKey]).then((children) => {
            if (children) {
              children.forEach((child) => {
                this.handleNodes(child, this.lazy);
              });
            }
            node.children = children;
            resolve(node);
          });
        });
      },
      handleNodes(node, open) {
        if (node.children) {
          node.children.forEach((childNode) => {
            this.handleNodes(childNode, open);
          });

          if (open || !node.parentId) {
            this.open.push(node[this.itemKey]);
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
        this.currentItem["parentId"] =
          this.selected[0] || (this.items[0] || {})[this.itemKey] || null;
      },
    },
  };
</script>

<style scoped>
  .crud-tree >>> .v-treeview-node__root {
    margin-top: 0;
    margin-bottom: 0;
  }

  .col-item,
  .col-item-readonly {
    display: inline-block;
    font-size: 14px;
    color: #8091a5;
    cursor: pointer;
  }

  .col-item:hover,
  .col-item:hover > * {
    color: #3582fb !important;
  }

  .total-count {
    color: #000;
    padding: 0 5px;
  }

  .per-page {
    display: inline-block;
    width: 30px;
    height: 20px;
  }

  .separator {
    border-right: 1px solid #dfe6ee;
    width: 1px;
    height: 18px;
    margin-left: 15px;
    margin-right: 15px;
  }

  .setting-title {
    min-width: 20px;
    font-size: 12px;
    color: #8091a5;
  }

  .setting-content {
    margin-top: 5px;
  }

  .setting-content span {
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    margin: 0 1px;
    border: 1px solid #ebebeb;
  }

  .setting-content span:hover {
    background: #d7e6fe;
    color: #3582fb;
    border: 1px solid #3582fb !important;
    z-index: 1;
    cursor: pointer;
  }

  .per-current {
    background: #d7e6fe;
    color: #3582fb;
    border: 1px solid #3582fb !important;
    z-index: 1;
    cursor: default;
  }

  .crud-tree >>> .v-progress-linear {
    height: 1px !important;
  }
</style>
