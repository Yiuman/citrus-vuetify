<template>
    <v-row justify="space-around">
        <v-col class="pt-0">
            <v-sheet elevation="10" tile>
                <v-chip-group mandatory>
                    <v-chip v-for="(item,index) in visitedItems" :key="index"
                            :close="item.deletable"
                            active-class="chip-active"
                            class="ma-1 mb-0 pb-0"
                            label
                            outlined
                            :input-value="activeIndex ===index"
                            @click:close="close"
                    >
                        {{item.name}}
                    </v-chip>

                </v-chip-group>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: "VisitedBar",
        data: () => ({
            activeIndex: '',
            visitedItems: [
                {
                    name: 123123,
                    deletable: false
                },
                {
                    name: 123123,
                    deletable: true
                },
                {
                    name: 123123,
                    deletable: true
                }
            ]
        }),
        methods: {
            close() {

            }
        }
    }
</script>

<style scoped>
    .chip-active {
        border-bottom: #3f51b5 solid 3px !important;
    }
</style>
