<template>
  <div class="height-100pc">
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
            <div @dblclick="edit('edit', item)">
              <v-row>
                <v-col> {{ item[itemText] }}</v-col>
                <v-col align="end" class="mr-3">
                  <v-menu
                    v-if="item.id && actions && actions.length > 0"
                    top
                    left
                    offset-y
                    rounded="0"
                    transition="scale-transition"
                    origin="bottom right"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        width="0"
                        height="0"
                        tile
                        fab
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon small>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item
                        v-for="(operation, index) in actions"
                        :key="index"
                        @click="doAction(operation.action, item, operation)"
                      >
                        <v-list-item-title>{{
                          operation.text || operation.action
                        }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
            </div>
          </template>
          <template v-slot:prepend="{ item }">
            <v-icon
              v-text="
                `mdi-${item.children ? 'home-variant' : 'folder-network'}`
              "
            />
          </template>
        </v-treeview>
      </v-card-text>

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

      <slot name="import-dialog">
        <v-dialog v-model="actionSwitch.import" width="400">
          <v-card class="pa-2">
            <v-row no-gutters justify="space-between" align="center">
              <v-col md="6" align="center" class="import-col">
                <v-hover v-slot:default="{ hover }">
                  <div
                    class="import-item-box"
                    :class="{ 'on-hover': hover }"
                    @click="exportTemplate"
                  >
                    <div>
                      <v-icon color="primary" size="100"
                        >mdi-file-download-outline
                      </v-icon>
                    </div>
                    <div class="text">下载模板</div>
                  </div>
                </v-hover>
              </v-col>

              <v-col md="6" align="center" class="import-col">
                <v-hover v-slot:default="{ hover }">
                  <div class="import-item-box" :class="{ 'on-hover': hover }">
                    <div>
                      <file-upload
                        ref="import-upload"
                        :headers="authHeanders"
                        :post-action="apiBase + namespace + '/import'"
                        @input-file="inputFile"
                        @input-filter="inputFilter"
                        class="import-upload"
                        v-model="importFiles"
                      >
                        <v-icon color="primary" size="100"
                          >mdi-file-upload-outline</v-icon
                        >
                      </file-upload>
                    </div>
                    <div class="text" style="margin-top:-8px">上传数据</div>
                  </div>
                </v-hover>
              </v-col>
            </v-row>
            <v-row no-gutters justify="space-between" align="center">
              <v-col md="12">
                <v-progress-linear
                  v-if="importFiles.length"
                  color="light-blue"
                  height="10"
                  :value="importFiles[0].progress"
                  striped
                ></v-progress-linear>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </slot>
    </v-card>
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
  </div>
</template>

<script>
  import { TreeService, mixins } from "../api/crud";
  import FormNavigation from "./FormNavigation";
  import TipsDialog from "./TipsDialog";
  // import WidgetButton from "./WidgetButton";
  import ButtonRender from "@/components/ButtonRender";
  import FilterNavigation from "@/components/FilterNavigation";
  import FileUpload from "vue-upload-component";

  export default {
    name: "CrudTree",
    mixins: [mixins],
    components: {
      TipsDialog,
      FormNavigation,
      ButtonRender,
      FilterNavigation,
      FileUpload,
    },
    watch: {
      namespace: "init",
    },
    data: () => ({
      loading: true,
      lazy: false,
      itemText: "",
      items: [],
      open: [],
      showFilter: false,
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
        const queryParam = { ...vm.queryParam, ...vm.$route.query };
        vm.crudService.load(queryParam).then((data) => {
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

          //初始化列事件
          if (
            (!this.actions || this.actions.length === 0) &&
            data.actions &&
            data.actions.length > 0
          ) {
            this.actions = data.actions;
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

  .crud-table >>> .v-progress-linear {
    height: 1px !important;
  }

  .import-item-box {
    margin: 10px;
    cursor: pointer;
    background-color: #fafafa;
    transition: opacity 0.4s ease-in-out;
  }

  .import-item-box:not(.on-hover) {
    opacity: 0.6;
  }

  .import-upload >>> label {
    cursor: pointer;
  }

  .import-item-box .text {
    color: #3582fb;
    font-weight: bold;
    padding-bottom: 10px;
  }
</style>
