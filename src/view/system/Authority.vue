<template>
    <v-card class="height-100pc">
        <crud-table namespace="/rest/auth" @action="actionEvent">
            <!--编辑页面-->
            <template v-slot:add-dialog>
                <v-row justify="center">
                    <v-dialog v-model="addDialog" hide-overlay transition="dialog-bottom-transition" width="800">
                        <v-card>
                            <!--顶部-->
                            <v-toolbar dense color="primary">
                                <v-btn small icon @click="addDialog = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <v-toolbar-title>权限配置</v-toolbar-title>
                                <v-spacer/>
                                <v-toolbar-items>
                                    <v-btn dark text @click="addDialog = false">保存</v-btn>
                                </v-toolbar-items>
                            </v-toolbar>
                            <v-form>
                                <v-card elevation="0">
                                    <v-card-subtitle>基础信息</v-card-subtitle>
                                    <v-card-text>
                                        <v-text-field label="权限名称" clearable v-model="authority.authorityName"/>
                                        <v-text-field dense label="描述" clearable v-model="authority.describe"/>
                                    </v-card-text>

                                    <v-divider class="mx-4"/>

                                    <v-card-subtitle color="primary">功能设置</v-card-subtitle>
                                    <v-card-text>
                                        <v-row class="pa-4" justify="space-between">
                                            <!--选择功能-->
                                            <v-col cols="5">
                                                <tree-model
                                                        namespace="/rest/menus"
                                                        :selectable="true"
                                                        @selection="selection"
                                                        :nodeHandleWrapper="nodeHandleWrapper"
                                                        @nodeActive="treeNodeActive"/>
                                            </v-col>

                                            <v-divider vertical/>
                                            <v-col cols="5" class="mt-0">
                                                <v-row>
                                                    <!--数据范围的选择-->
                                                    <template
                                                            v-if="selected && authority.resources[String(selected.id)]">
                                                        <v-select label="数据范围" placeholder="(若不选择则为所有)"
                                                                  :items="dataScopes"
                                                                  v-model="authority.resources[String(selected.id)]['scopeId']"
                                                                  item-text="scopeName" item-value="scopeId"/>
                                                    </template>
                                                </v-row>
                                                <v-row>
                                                    <!--操作资源的选择-->
                                                    <template v-if="selected && authority.resources[String(selected.id)]">
                                                        <v-checkbox class="pr-3" v-for="(operation,index) in operations"
                                                                    :key="index"
                                                                    :value=operation.resourceId
                                                                    v-model="authority.resources[String(selected.id)]['operations']"
                                                                    :label="operation.resourceName"
                                                        />
                                                    </template>
                                                </v-row>

                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-form>
                        </v-card>
                    </v-dialog>
                </v-row>
            </template>

        </crud-table>
    </v-card>
</template>

<script>
    import CrudTable from "../../components/CrudTable";
    import TreeModel from '../../components/TreeModel'
    import {getDataScopes, getOperationByKey} from "../../api/auth";

    export default {
        name: "Authority",
        components: {TreeModel, CrudTable},
        data: () => ({
            addDialog: false,
            authority: {
                authorityId: null,
                authorityName: '',
                describe: '',
                resources: {}
            },
            active: [],
            open: [],
            dataScopes: [],
            selected: {},
            operations: []
        }),
        watch: {
            selected: {
                handler(node) {
                    if (node && node.id && node.path) {
                        this.operations = [];
                        this.getOperationByResource(node)
                    }
                }
            }
        },
        methods: {
            actionEvent(action) {
                this.addDialog = true;
                console.warn(action)
            },
            treeNodeActive(nodes) {
                this.selected = nodes && nodes.length > 0 ? nodes[0] : null;
                console.warn(nodes)
            },
            selection(nodes) {
                console.warn(nodes)
            },
            /**
             * 获取当前资源节点的资源及数据范围
             * @param node 当前节点
             */
            getOperationByResource(node) {
                this.operations = [...node.operations];
                if (!this.authority.resources[node.id]) {
                    this.authority.resources[node.id] = {
                        scopeId: null,
                        operations: this.operations ? this.operations.map(item => item.id) : [],
                    };
                }
            },
            /**
             * 用于扩展功能资源树的节点处理，有路径则有数据范围及操作资源
             * @param node 正在处理的节点
             */
            nodeHandleWrapper(node) {
                if (node && node.id && node.path) {
                    getOperationByKey(node.id).then(data => {
                        node.operations = data;
                    })
                }
            }
        },
        created() {
            getDataScopes().then(data => {
                this.dataScopes = data.records
            })
        }
    }
</script>

<style scoped>

</style>
