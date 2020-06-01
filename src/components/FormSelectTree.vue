<template>
    <v-combobox
            v-model="selection"
            :items="[treeItem]"
            :item-text="modelTextField"
            clearable
            @click.stop.prevent="mousedown"
            :label="label">

        <template v-slot:item="{ item }">
            <tree-model  @click.stop.prevent="mousedown" style="width: 300px"
                        :lazy="false"
                         v-model="selection"
                        :tree-item="item"
                        :model-key="modelKeyField"
                        :model-text="modelTextField"
            />
        </template>
    </v-combobox>
</template>

<script>

    import TreeModel from "./TreeModel";

    export default {
        name: "FormSelectTree",
        components: {TreeModel},
        props: {
            label: {
                type: String,
                default: () => ''
            },
            treeItem: Object,
            selected: {
                type: Array,
                default: () => []
            },
            modelTextField: String,
            modelKeyField: String
        },
        methods: {
            mousedown(event, item) {
                console.warn(event, item);

            }
        },
        data: () => ({
            selection: [],
            items: []
        }),
        created() {
            this.items.splice(0, 1, this.treeItem)
        }
    }
</script>

<style scoped>

</style>
