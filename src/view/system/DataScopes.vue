<template>
    <v-card class="height-100pc">
        <crud-table namespace="/rest/scopes" @action="actionEvent">
            <template v-slot:add-dialog>
                <v-row justify="center">
                    <v-dialog v-model="addDialog" hide-overlay transition="dialog-bottom-transition" width="800">
                        <v-card>
                            <!--顶部-->
                            <v-toolbar dense>
                                <v-btn small icon @click="addDialog = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <v-toolbar-title>数据范围维护</v-toolbar-title>
                                <v-spacer/>
                                <v-toolbar-items>
                                    <v-btn text @click="addDialog = false">保存</v-btn>
                                </v-toolbar-items>
                            </v-toolbar>

                            <v-divider/>

                            <v-form>
                                <v-card elevation="0">
                                    <v-card-subtitle>基础信息</v-card-subtitle>
                                    <v-card-text>
                                        <v-text-field label="数据范围名称" clearable v-model="scopeEntity.scopeName"/>
                                        <v-text-field dense label="描述" clearable v-model="scopeEntity.describe"/>
                                    </v-card-text>

                                    <v-divider class="mx-4"/>

                                    <v-card-subtitle color="primary">数据范围设置</v-card-subtitle>
                                    <v-card-text>
                                        <v-row class="pa-4">
                                            <!--组织机构选择-->
                                            <v-col cols="6" class="select-container">
                                                <tree-model
                                                        select-type="independent"
                                                        namespace="/rest/organs"
                                                        :selectable="true"
                                                        @selection="selection"
                                                        @nodeActive="treeNodeActive"/>
                                            </v-col>

                                            <v-divider vertical/>
                                            <v-col cols="5" class="mt-0 ml-3 align-center">
                                                <template v-if="selected
                                                                && scopeEntity.scopeDefinesMap[String(selected.id)]">
                                                    <div>范围规则</div>
                                                    <v-divider/>
                                                    <v-radio-group
                                                            class="ml-1"
                                                            :row="true"
                                                            v-model="scopeEntity.scopeDefinesMap[String(selected.id)]['scopeRule']"
                                                            :mandatory="true"
                                                    >
                                                        <v-radio label="包含" value="0"/>
                                                        <v-radio label="排除" value="1"/>
                                                    </v-radio-group>
                                                </template>

                                                <template v-if="scopeTypes
                                                                && scopeTypes.length>0
                                                                && selected
                                                                && scopeEntity.scopeDefinesMap[String(selected.id)]">
                                                    <div>范围类型</div>
                                                    <v-divider/>
                                                    <v-row v-for="(scopeType,index) in scopeTypes" :key="index" dense>
                                                        <!--数据范围类型的选择-->
                                                        <v-checkbox class="ml-3"
                                                                    :key="index"
                                                                    v-model="scopeEntity.scopeDefinesMap[String(selected.id)]['types']"
                                                                    :value=scopeType.code
                                                                    :label="scopeType.text"
                                                        />
                                                    </v-row>
                                                </template>
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
    import TreeModel from "../../components/TreeModel"
    import {getScopeTypes} from "../../api/auth";

    export default {
        name: "DataScopes",
        components: {CrudTable, TreeModel},
        data: () => ({
            addDialog: false,
            scopeEntity: {
                scopeId: null,
                scopeName: '',
                describe: '',
                selectedOrganIds: [],
                scopeDefinesMap: {}
            },
            active: [],
            open: [],
            scopeTypes: [],
            selected: {},
        }),
        watch: {
            selected: {
                handler(node) {
                    if (node && node.id) {
                        this.initNodeScopeDefine(node)
                    }
                }
            }
        },
        methods: {
            //初始化必要的数据
            initNecessary() {
                getScopeTypes().then(data => {
                    this.scopeTypes = data;
                })
            },
            actionEvent(action) {
                this.addDialog = true;
                console.warn(action)
            },
            treeNodeActive(nodes) {
                this.selected = nodes && nodes.length > 0 ? nodes[0] : null;
            },
            selection(nodes) {
                if (nodes) {
                    this.scopeEntity.selectedOrganIds = nodes.map(item => item.id);
                }
            },
            //初始化节点的数据范围的定义规则
            initNodeScopeDefine(node) {
                if (!this.scopeEntity.scopeDefinesMap[String(node.id)]) {
                    this.scopeEntity.scopeDefinesMap[String(node.id)] = {
                        scopeRule: '0',
                        types: []
                    }
                }
            }
        },
        created() {
            this.initNecessary();
        }
    }
</script>

<style scoped>
    .select-container {
        height: 377px !important;
        overflow: auto !important;
        width: 100% !important;
    }
</style>
