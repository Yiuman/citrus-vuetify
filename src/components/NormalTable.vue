<template>
    <v-data-table
            :headers="headers"
            :items="records"
            fixed-header
            :loading="loading"
            class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>My CRUD</v-toolbar-title>
                <v-divider
                        class="mx-4"
                        inset
                        vertical
                />
                <v-spacer/>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
<!--                                    todo-->
                                    <!--                                    <v-col cols="12" sm="6" md="4" :key="index">-->
                                    <!--                                        <v-text-field v-model="editedItem.name" label="Dessert name"/>-->
                                    <!--                                    </v-col>-->
                                    <!--                                    <v-col cols="12" sm="6" md="4">-->
                                    <!--                                        <v-text-field v-model="editedItem.calories" label="Calories"/>-->
                                    <!--                                    </v-col>-->
                                    <!--                                    <v-col cols="12" sm="6" md="4">-->
                                    <!--                                        <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>-->
                                    <!--                                    </v-col>-->
                                    <!--                                    <v-col cols="12" sm="6" md="4">-->
                                    <!--                                        <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>-->
                                    <!--                                    </v-col>-->
                                    <!--                                    <v-col cols="12" sm="6" md="4">-->
                                    <!--                                        <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>-->
                                    <!--                                    </v-col>-->
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer/>
                            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="save(editedItem)">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="update(item)">mdi-pencil
            </v-icon>
            <v-icon small @click="remove(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
    </v-data-table>
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
            crudService: null,
            loading: true,
            dialog: false,
            records: [],
            editedIndex: -1,
        }),
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },
        watch: {
            dialog(val) {
                val || this.close()
            },
        },
        created() {
            this.initialize()
        },
        methods: {
            initialize() {
                this.crudService = new CrudService(this.namespace);
                this.crudService.list().then(data => {
                    this.records = data.records;
                    //若表头没定义则用数据列的
                    if (!this.headers) {
                        let tempHeaders = [];
                        if (data.headers) {
                            tempHeaders = data.headers;
                        } else {
                            const record = data.records[0];
                            record.keys().forEach(key => {
                                tempHeaders.push({text: key, value: key})
                            })
                        }
                        this.$set('headers', tempHeaders);
                    }
                    this.loading = true
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
