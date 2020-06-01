<template>
    <v-card class="py-2 px-2 height-100pc">
        <!--按钮及控件-->
        <widget-button :widgets="widgets" :buttons="buttons" :model-object="queryParam" @widgetChange="queryPage"
                       @buttonClick="doAction"/>
        <!--表格-->
        <v-data-table
                v-model="selected"
                :item-key="itemKey"
                :headers="headerArray"
                :items="records"
                :options.sync="pageOptions"
                fixed-header
                :items-per-page="page.size"
                :loading="loading"
                :server-items-length="total"
                hide-default-footer
                :show-select="Boolean(itemKey)"
                class="elevation-0"
        >
            <!--行内操作按钮事件-->
            <template v-slot:item.actions="{ item }">
                <v-btn icon v-for="(operation,index) in actions" :key="index"
                       @click="doAction(operation.action,item)"
                       class="mr-2"
                       :color="operation.color">
                    <v-icon small>mdi-{{operation.icon}}</v-icon>
                    {{operation.text}}
                </v-btn>
            </template>

        </v-data-table>
        <!--分页相关组件-->
        <v-row justify="end" no-gutters class="mt-2">
            <v-col md="1">
                <div class="pa-2 mt-3 mr-3 text-right">
                    共{{total}}条
                </div>
            </v-col>
            <v-col md="auto">
                <v-select
                        label="条/页"
                        :items="perPageOptions"
                        v-model="page.size"
                        style="width: 50px"
                />
            </v-col>
            <v-col md="auto">
                <!--                    color="#81b90c"-->
                <v-pagination
                        class="pa-2 text-right page-selection"
                        prev-icon="mdi-menu-left"
                        next-icon="mdi-menu-right"
                        v-model="page.current"
                        :length="pageCount"
                        total-visible="5"/>
            </v-col>
            <v-col md="auto">
                <v-text-field label="跳转到" type="number" v-model="jumpToPage" @keydown="queryPage"
                              style="width: 60px"/>
            </v-col>
        </v-row>

        <slot name="add-dialog">
            <form-dialog v-model="actionSwitch.add" :dialog-view="dialogView"
                         :current-item="currentItem" @confirm="edit_"/>
        </slot>
        <slot name="edit-dialog">
            <form-dialog v-model="actionSwitch.edit" :dialog-view="dialogView"
                         :current-item="currentItem"
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
    import {CrudService, mixins as crudMixins} from "../api/crud";
    import transform from "../utils/widget";
    import FormDialog from "./FormDialog";
    import TipsDialog from "./TipsDialog";
    import WidgetButton from "./WidgetButton";

    crudMixins.methods.transform = transform;

    export default {
        name: "CrudTable",
        mixins: [crudMixins],
        components: {WidgetButton, TipsDialog, FormDialog},
        props: {
            //表头
            headers: {
                type: Array,
                default: () => []
            },
            /**
             * 控件
             */
            widgetModels: {
                type: Array,
                default: () => []
            },
            /**
             * 顶部按钮
             */
            buttonModels: {
                type: Array,
                default: () => []
            },
        },
        data: () => ({
            //表头数组
            headerArray: [],
            //每页的条数定义
            perPageOptions: [
                5, 10, 20, 30
            ],
            //页面的定义信息，外部排序，外部分页等
            pageOptions: {},
            // 页面信息，查询条数，及当前页
            page: {
                size: 10,
                current: 1,
            },
            //跳转到的页数
            jumpToPage: 1,
            //最多
            pageCount: 5,
            //总页数
            pageTotal: 1,
            //加载中...
            loading: true,
            //总记录数
            total: 0,
            //记录数组
            records: [],
            //行内操作事件按钮
            actions: [],
            loadMethod: 'queryPage'
        }),
        watch: {
            'namespace': 'initCrud',
            'page.current': function (value, old) {
                if (value === old) {
                    return;
                }
                this.jumpToPage = value;
                this.queryPage();
            },
            'page.size': function (value, old) {
                if (value === old) {
                    return;
                }
                this.page.current = 1;
                this.queryPage();
            },
            'jumpToPage': function (value, old) {
                if (value === old || value < 1 || value === '' || value > this.pageTotal) {
                    return;
                }
                this.page.current = Number(value);
            },
            'pageOptions': {
                handler(value, old) {

                    if (!Object.keys(old).length) {
                        return;
                    }
                    this.queryPage();
                },
                deep: true
            }
        },
        created() {
            this.initCrud();
        },
        methods: {
            initCrud() {
                this.crudService = new CrudService(this.namespace);
                this.headerArray = this.headers;
                this.widgets = this.widgetModels;
                this.buttons = this.buttonModels;
                this.actions = [];
                this.queryPage();
            },
            queryPage() {
                this.loading = true;
                const queryParams = {...this.page, ...this.queryParam};
                const sortBy = this.pageOptions.sortBy;
                if (sortBy && sortBy.length) {
                    queryParams.sortBy = sortBy[0];
                }

                const sortDesc = this.pageOptions.sortDesc;
                if (sortDesc && sortDesc.length) {
                    queryParams.sortDesc = sortDesc[0];
                }

                /**
                 * 处理返回的数据
                 * @param data 返回结果
                 */
                const handlerRecord = function (data) {
                    const records = data.records;
                    const recordExtend = data.recordExtend;
                    if (recordExtend) {
                        records.forEach(record => {
                            const extendData = recordExtend[record[data.itemKey]];
                            if (extendData) {
                                Object.keys(extendData).forEach(key => {
                                    record[key] = extendData[key];
                                })
                            }

                        })
                    }
                    return records;
                };

                this.crudService.list(queryParams).then(data => {
                    this.total = data.total;
                    this.itemKey = data.itemKey;
                    this.records = handlerRecord(data);
                    this.pageTotal = data.pages;
                    if (data.dialogView) {
                        this.dialogView = data.dialogView;
                    }

                    if (data.pages!==null &&  data.pages <= 5) {
                        this.pageCount = data.pages || 1
                    }

                    //若表头没定义则用数据列的
                    if (!this.headerArray || this.headerArray.length === 0) {
                        if (data.headers) {
                            this.headerArray = data.headers
                        } else {
                            const record = data.records[0];
                            Object.keys(record).forEach(key => {
                                this.headerArray.push({text: key, value: key})
                            })
                        }

                    }

                    //初始化控件
                    if ((!this.widgets || this.widgets.length === 0) && data.widgets) {
                        this.widgets = data.widgets;
                    }

                    //初始化按钮
                    if ((!this.buttons || this.buttons.length === 0) && data.buttons) {
                        this.buttons = data.buttons;
                    }

                    //初始化列事件
                    if ((!this.actions || this.actions.length === 0) && data.actions && data.actions.length > 0) {
                        this.actions = data.actions;
                        this.headerArray.push({
                            text: '操作',
                            value: 'actions',
                            align: 'center',
                            sortable: false,
                            width: 'auto'
                        })
                    }

                    this.loading = false
                })
            }
        }
    }
</script>

<style scoped>
    .page-selection:focus {
        outline: none !important;
        /*background-color: green !important;*/
    }
</style>
