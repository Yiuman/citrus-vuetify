// 权限管理列表
<template>
  <div class="height-100pc">
    <crud-table
      namespace="/rest/auth"
      :exclude-actions="['edit']"
      @action="actionEvent"
      ref="$crud$"
    >
      <!--编辑页面-->
      <template v-slot:add-dialog>
        <simple-form-navigation
          v-model="addDialog"
          width="800"
          :successAction="saveEntity"
          @callback="reload"
        >
          <v-card elevation="0">
            <v-card-subtitle>基础信息</v-card-subtitle>
            <v-card-text>
              <v-text-field
                label="权限名称"
                :rules="[
                  (v) =>
                    (v !== undefined && v !== null && v !== '') ||
                    `权限名称不能为空`,
                ]"
                clearable
                v-model="authority.authorityName"
              />

              <v-text-field label="描述" clearable v-model="authority.remark" />
            </v-card-text>

            <v-divider class="mx-4" />

            <v-card-subtitle color="primary">功能设置</v-card-subtitle>
            <v-card-text>
              <v-row class="pa-4" justify="space-between">
                <!--选择功能-->
                <v-col cols="6" class="select-container">
                  <tree-model
                    :open-deep="1"
                    namespace="/rest/menus"
                    :value="authority.selectResources"
                    :display-root="false"
                    :searchable="true"
                    :selectable="true"
                    @selection="selection"
                    :nodeHandleWrapper="nodeHandleWrapper"
                    @nodeActive="treeNodeActive"
                  />
                </v-col>

                <!-- <v-divider vertical /> -->
                <v-col cols="5" class="mt-0">
                  <v-row>
                    <!--数据范围的选择-->
                    <template v-if="showScopes">
                      <v-select
                        label="数据范围"
                        placeholder="(若不选择则为所有)"
                        :items="dataScopes"
                        v-model="authority.resourceMap[selected.id]['scopeId']"
                        item-text="scopeName"
                        item-value="scopeId"
                      />
                    </template>
                  </v-row>
                  <v-row>
                    <!--操作资源的选择-->
                    <template v-if="showOperations">
                      <v-checkbox
                        class="pr-3"
                        v-for="(operation, index) in operations"
                        :key="index"
                        :value="operation.resourceId"
                        :label="operation.resourceName"
                        v-model="
                          authority.resourceMap[String(selected.id)][
                            'operations'
                          ]
                        "
                      />
                    </template>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </simple-form-navigation>
      </template>
    </crud-table>
  </div>
</template>

<script>
  import CrudTable from "@/components/CrudTable";
  import TreeModel from "@/components/TreeModel";
  import SimpleFormNavigation from "@/components/SimpleFormNavigation";
  import { getDataScopes, getOperationByKey } from "@/api/auth";
  // import SimpleFormSlot from "@/components/SimpleFormSlot";

  const DEFAULT_ENTITY = {
    authorityId: null,
    authorityName: "",
    remark: "",
    selectResources: [],
    resourceMap: {},
  };

  export default {
    name: "Authority",
    components: { TreeModel, CrudTable, SimpleFormNavigation },
    data: () => ({
      addDialog: false,
      authority: JSON.parse(JSON.stringify(DEFAULT_ENTITY)),
      active: [],
      open: [],
      dataScopes: [],
      selected: {},
      operations: [],
      //观察数据是否已经准备就续,主要是用于动态数组对象的更新控制
      hasReadiness: false,
    }),
    watch: {
      selected: {
        handler(node) {
          if (node && node.id && node.path) {
            this.operations = [];
            this.getOperationByResource(node);
          }
        },
      },
    },
    computed: {
      showScopes: function() {
        return (
          this.selected &&
          this.authority.resourceMap[this.selected.id] &&
          this.hasReadiness
        );
      },
      showOperations: function() {
        return (
          this.selected &&
          this.authority.resourceMap[this.selected.id] &&
          this.hasReadiness
        );
      },
    },
    methods: {
      //执行的事件
      actionEvent(action, item) {
        switch (action) {
          case "add": {
            this.authority = JSON.parse(JSON.stringify(DEFAULT_ENTITY));
            this.addDialog = true;
            break;
          }
          case "edit": {
            //获取当前权限的资源列表
            const resourceMap = {},
              selectResources = [];
            this.getService()
              .getEntity(item.authorityId)
              .then((data) => {
                if (data.resources && data.resources.length > 0) {
                  data.resources.forEach((resource) => {
                    selectResources.push(resource.resourceId);
                    const operationIds = resource.operations
                      ? resource.operations.map((item) => item.resourceId)
                      : [];
                    resourceMap[resource.resourceId] = {
                      scopeId: resource.scopeId,
                      operations: operationIds,
                    };
                  });
                }
                this.authority = {
                  ...item,
                  resourceMap: resourceMap,
                  selectResources: selectResources,
                };
                this.$nextTick(() => {
                  this.addDialog = true;
                });
              });

            break;
          }
          default:
        }
      },
      treeNodeActive(nodes) {
        this.selected = nodes && nodes.length > 0 ? nodes[0] : null;
      },
      selection(nodes) {
        if (nodes) {
          this.authority.selectResources = nodes.map((item) => item.id);
          console.warn(nodes);
          nodes.forEach((node) => {
            if (!this.authority.resourceMap[node.id]) {
              this.authority.resourceMap[node.id] = {
                scopeId: null,
                operations: [...node.operations].map((item) => item.id)
              };
            }
          });
        }
      },
      /**
       * 获取当前资源节点的资源及数据范围
       * @param node 当前节点
       */
      getOperationByResource(node) {
        this.operations = [...node.operations];
        this.hasReadiness = false;
        if (!this.authority.resourceMap[node.id]) {
          this.authority.resourceMap[node.id] = {
            scopeId: null,
            operations: this.operations
              ? this.operations.map((item) => item.id)
              : [],
          };
        }

        this.$nextTick(() => {
          this.hasReadiness = true;
        });
      },
      /**
       * 用于扩展功能资源树的节点处理，有路径则有数据范围及操作资源
       * @param node 正在处理的节点
       */
      nodeHandleWrapper(node) {
        if (node && node.id && node.path) {
          getOperationByKey(node.id).then((data) => {
            node.operations = data;
          });
        }
      },
      //保存当前页面实体
      saveEntity() {
        const submitEntity = { ...this.authority };
        submitEntity.resources = this.authority.selectResources.map(
          (resourceId) => {
            //处理当前选择的资源的操作资源
            //TODO
            let operations = this.authority.resourceMap[
              resourceId
            ].operations.map((operation) => ({
              authorityId: this.authority.authorityId,
              scopeId: this.authority.resourceMap[resourceId].scopeId,
              objectId: resourceId,
              resourceId: operation,
              type: "2",
            }));

            return {
              authorityId: this.authority.authorityId,
              scopeId: this.authority.resourceMap[resourceId].scopeId,
              operations: operations,
              resourceId: resourceId,
              type: "0",
            };
          }
        );
        return new Promise((resolve) => {
          this.getService()
            .save(submitEntity)
            .then(() => {
              this.$toast.success("操作成功", {
                position: "top-center",
              });
              resolve();
            })
            .catch((err) => {
              this.$toast.error(err.message, {
                position: "top-center",
              });
              console.warn(err);
            });
        });
      },
      getService() {
        return this.$refs["$crud$"].crudService;
      },
      reload() {
        this.$refs["$crud$"].reload();
      },
    },
    created() {
      getDataScopes().then((data) => {
        this.dataScopes = data.records;
      });
    },
  };
</script>

<style scoped>
  .select-container {
    /* height: 270px !important; */
    max-height: 450px;
    overflow: auto !important;
    /* width: 100% !important; */
  }
</style>
