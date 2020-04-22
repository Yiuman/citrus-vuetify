<template>
    <div id="visited-bar">
        <v-chip active-class="chip-active" v-for="(item,index) in visitedItems" :key="index"
                :close="item.deletable"
                class="ma-1"
                color="white"
                label
                :input-value="activeIndex ===index"
                text-color="black"
                @click:close="close"
        >
            {{item.name}}
        </v-chip>
    </div>
</template>

<script>
    export default {
        name: "VisitedBar",
        data: () => ({
            activeIndex: '',
            visitedItems: [
                {
                    name: 123123,
                    deletable: true
                },
                {
                    name: 123123,
                    deletable: false
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
    #visited-bar {
        padding: 5px 0 0 0;
        border-bottom: #e2e2e2 solid 1px;
    }

    .chip-active {
        border-bottom: cornflowerblue solid 2px;
    }
</style>
