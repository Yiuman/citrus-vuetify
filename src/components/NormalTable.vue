<template>
    <div>
        <v-data-table
                v-model="selected"
                :item-key="itemKey"
                :headers="headers"
                :items="records"
                fixed-header
                :items-per-page="page.size"
                :loading="loading"
                hide-default-footer
                show-select
                class="elevation-1"
        >

            <!--        <template v-slot:item.actions="{ item }">-->
            <!--            <v-icon small class="mr-2" @click="update(item)">mdi-pencil-->
            <!--            </v-icon>-->
            <!--            <v-icon small @click="remove(item)">mdi-delete</v-icon>-->
            <!--        </template>-->
            <!--        <template v-slot:no-data>-->
            <!--            <v-btn color="primary" @click="initialize">Reset</v-btn>-->
            <!--        </template>-->
        </v-data-table>
        <div class="float-left pt-2">
            {{total}}
        </div>
        <div class="float-right pt-2">
            <v-pagination
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                    v-model="page.current"
                    :length="pageCount"
                    total-visible="5"/>
        </div>
    </div>

</template>

<script>
    import {CrudService} from "../api/crud";

    export default {
        name: "NormalTable",
        props: {
            //命名空间，与后台RESTFULTCRUD对应，如用户则是/rest/users
            namespace: String,
            //表头
            headers: {
                type: Array,
                default: () => []
            },
            //编辑项
            editedItem: {
                type: Array,
                default: () => []
            },
            //编辑项的定义，如是否校验等
            editedDefine: {
                type: Object,
                default: () => {
                }
            }
        },
        data: () => ({
            page: {
                size: 10,
                current: 1,
            },
            pageCount: 5,
            crudService: null,
            loading: true,
            dialog: false,
            total: 0,
            records: [],
            selected: [],
            itemKey: 'userId',
            editedIndex: -1,
        }),
        watch: {
            'page.current': 'queryPage'
        },
        created() {
            this.crudService = new CrudService(this.namespace);
            this.queryPage()
        },
        methods: {
            queryPage() {
                this.loading = true;
                this.crudService.list(this.page).then(data => {
                    this.total = data.total;
                    this.records = data.records;
                    if (data.pages && data.pages <= 5) {
                        this.pageCount = data.pages
                    }

                    //若表头没定义则用数据列的
                    if (!this.headers || this.headers.length === 0) {

                        const record = data.records[0];
                        Object.keys(record).forEach(key => {
                            this.headers.push({text: key, value: key})
                        })
                    }
                    this.loading = false
                })
            },
            save(item) {
                this.crudService.save(item).then(() => {
                }).catch((err) => {
                    console.warn(err)
                });
            },
            update(item) {
                this.crudService.update(item).then(() => {
                }).catch((err) => {
                    console.warn(err)
                })
            },
            remove(id) {
                this.crudService.delete(id).then(() => {
                }).catch((err) => {
                    console.warn(err)
                })
            },
            close() {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },
        }
    }
</script>

<style scoped>

</style>
