<template>
    <v-card class="height-100pc">
        <crud-table namespace="/rest/auth" @action="actionEvent">
            <!--编辑页面-->
            <template v-slot:add-dialog>
                <v-row justify="center">
                    <v-dialog v-model="addDialog" hide-overlay transition="dialog-bottom-transition" width="800">
                        <v-card>
                            <!--顶部-->
                            <v-toolbar dense dark>
                                <v-btn small icon dark @click="addDialog = false">
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
                                                        @nodeActive="treeNodeActive"/>
                                            </v-col>

                                            <v-divider vertical/>
                                            <v-col cols="5" class="mt-0">
                                                <v-row>
                                                    <v-select label="数据范围" placeholder="(若不选择则为所有)"
                                                              :items="dataScopes"/>
                                                </v-row>
                                                <v-row>
                                                    <template v-if="selected && operations && operations.length>0 ">
                                                        <v-checkbox class="pr-3" v-for="(operation,index) in operations"
                                                                    :key="index"
                                                                    :value=operation.resourceId
                                                                    v-model="authority.resources[selected.id]"
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
                    if (node && node.id) {
                        this.operations = [];
                        getOperationByKey(node.id).then(data => {
                            this.operations = data;
                            if (!this.authority.resources[node.id]) {
                                this.authority.resources[node.id] = data ? data.map(item => item.id) : []
                            }

                        })
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
                this.selected = nodes ? nodes[0] : null;
                console.warn(nodes)
            },
            selection(nodes) {
                console.warn(nodes)
            }
        },
        created() {
            getDataScopes().then(data => {
                console.warn(data);
                this.dataScopes = data.records
            })
        }
    }
</script>

<style scoped>

</style>
