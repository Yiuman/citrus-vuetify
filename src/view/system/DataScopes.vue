<template>
    <v-card class="height-100pc">
        <crud-table namespace="/rest/scopes" :exclude-actions="['edit']" @action="actionEvent" ref="$crud$">
            <template v-slot:add-dialog>
                <v-row justify="center">
                    <simple-form-slot v-model="addDialog" title="数据范围维护" width="800" :successAction="saveEntity">
                        <v-form >
                            <v-card elevation="0">
                                <v-card-subtitle>基础信息</v-card-subtitle>
                                <v-card-text>
                                    <v-text-field label="数据范围名称" clearable v-model="scopeEntity.scopeName"/>
                                    <v-text-field label="描述" clearable v-model="scopeEntity.describe"/>
                                </v-card-text>

                                <v-divider class="mx-4"/>

                                <v-card-subtitle color="primary">数据范围设置</v-card-subtitle>
                                <v-card-text>
                                    <v-row class="pa-4">
                                        <!--组织机构选择-->
                                        <v-col cols="6" class="select-container">
                                            <tree-model
                                                    :value="scopeEntity.selectedOrganIds"
                                                    :return-object="false"
                                                    select-type="independent"
                                                    namespace="/rest/organs"
                                                    :selectable="true"
                                                    :searchable="true"
                                                    @selection="selection"
                                                    @nodeActive="treeNodeActive"/>
                                        </v-col>

                                        <v-divider vertical/>
                                        <v-col cols="5" class="mt-0 ml-3 align-center">
                                            <template v-if="scopeRuleShow">
                                                <div>范围规则</div>
                                                <v-divider/>
                                                <v-radio-group
                                                        class="ml-1"
                                                        :row="true"
                                                        v-model="scopeEntity.scopeDefinesMap[selected]['scopeRule']"
                                                        :mandatory="true"
                                                >
                                                    <v-radio label="包含" value="0"/>
                                                    <v-radio label="排除" value="1"/>
                                                </v-radio-group>
                                            </template>

                                            <template v-if="scopeTypeShow   ">
                                                <div>范围类型</div>
                                                <v-divider/>
                                                <v-row v-for="(scopeType,index) in scopeTypes" :key="index" dense>
                                                    <!--数据范围类型的选择-->
                                                    <v-checkbox class="ml-3"
                                                                :key="index"
                                                                v-model="scopeEntity.scopeDefinesMap[selected]['types']"
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
                    </simple-form-slot>
                </v-row>
            </template>
        </crud-table>
    </v-card>
</template>

<script>
    import CrudTable from "../../components/CrudTable";
    import TreeModel from "../../components/TreeModel"
    import {getScopeTypes} from "../../api/auth";
    import SimpleFormSlot from "../../components/SimpleFormSlot";

    const DEFAULT_ENTITY = {
        scopeId: null,
        scopeName: '',
        describe: '',
        selectedOrganIds: [],
        scopeDefinesMap: {}
    };

    export default {
        name: "DataScopes",
        components: {SimpleFormSlot, CrudTable, TreeModel},
        data: () => ({
            addDialog: false,
            scopeEntity: JSON.parse(JSON.stringify(DEFAULT_ENTITY)),
            open: [],
            scopeTypes: [],
            selected: {},
            //观察数据是否已经准备就续,主要是用于动态数组对象的更新控制
            hasReadiness: false,
        }),
        computed: {
            scopeRuleShow: function () {
                return this.selected && this.scopeEntity.scopeDefinesMap[this.selected] && this.hasReadiness;
            },
            scopeTypeShow: function () {
                return (this.scopeTypes
                    && this.scopeTypes.length > 0
                    && this.selected
                    && this.scopeEntity.scopeDefinesMap[this.selected])
                    && this.hasReadiness
            }
        },
        watch: {
            selected: {
                handler(nodeId) {
                    if (nodeId) {
                        this.initNodeScopeDefine(nodeId)
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
            //执行的事件
            actionEvent(action, item) {
                switch (action) {
                    case 'add': {
                        this.scopeEntity = JSON.parse(JSON.stringify(DEFAULT_ENTITY));
                        this.addDialog = true;
                        break;
                    }
                    case 'edit': {
                        const scopeDefinesMap = {}, selectedOrganIds = [];
                        if (item.scopeDefines && item.scopeDefines.length > 0) {
                            item.scopeDefines.forEach(scopeDefine => {
                                selectedOrganIds.push(scopeDefine.organId);
                                scopeDefinesMap[scopeDefine.organId] = {
                                    scopeRule: String(scopeDefine.scopeRule),
                                    types: scopeDefine.scopeTypes || []
                                }
                            })
                        }
                        this.scopeEntity = {
                            ...item,
                            scopeDefinesMap: scopeDefinesMap,
                            selectedOrganIds: selectedOrganIds
                        };
                        this.$nextTick(() => {
                            this.addDialog = true;
                        });

                        break;
                    }
                    default:

                }
            },
            treeNodeActive(nodeIds) {
                this.selected = nodeIds && nodeIds.length > 0 ? nodeIds[0] : null;
            },
            selection(nodes) {
                if (nodes) {
                    this.scopeEntity.selectedOrganIds = nodes;
                }
            },
            //初始化节点的数据范围的定义规则
            initNodeScopeDefine(nodeId) {
                if (!this.scopeEntity.scopeDefinesMap[nodeId]) {
                    this.hasReadiness = false;
                    this.scopeEntity.scopeDefinesMap[nodeId] = {
                        scopeRule: '0',
                        types: []
                    };
                    this.$nextTick(() => {
                        this.hasReadiness = true;
                    })
                }
            },
            saveEntity() {
                const submitEntity = {...this.scopeEntity};
                submitEntity.scopeDefines = Object.keys(submitEntity.scopeDefinesMap)
                    .map(scopeDefineId => {
                        const scopeDefinesMapElement = submitEntity.scopeDefinesMap[scopeDefineId];
                        return {
                            scopeId: submitEntity.scopeId,
                            organId: scopeDefineId,
                            scopeRule: scopeDefinesMapElement.scopeRule,
                            scopeTypes: scopeDefinesMapElement.types || []
                        }
                    });
                return new Promise(resolve => {
                    this.$refs['$crud$'].crudService.save(submitEntity)
                        .then(resolve);
                })

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
