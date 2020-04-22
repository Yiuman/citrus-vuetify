<template>
    <div class="v-application--wrap">
        <!-- 菜单导航-->
        <navigation :enable-mini="enableMini"/>
        <!--应用顶部导航条-->
        <v-app-bar app class="indigo">
            <v-app-bar-nav-icon @click.stop="enableMini=!enableMini"/>
            <v-toolbar-title>Citrus</v-toolbar-title>
        </v-app-bar>

        <!--        整体容器-->
        <v-content>
            <!--            <v-card>-->
            <!--                <v-tabs-->
            <!--                        height="33"-->
            <!--                        grow-->
            <!--                        v-model="tab"-->
            <!--                        light-->
            <!--                        slider-color="red"-->
            <!--                        background-color="white"-->
            <!--                        optional-->
            <!--                >-->
            <!--                    <v-tab v-for="n in length" :key="n" class="tab-remove">-->
            <!--                            Item {{ n }}-->
            <!--                            <v-icon size="10" right="0" >mdi-close-circle</v-icon>-->
            <!--                    </v-tab>-->
            <!--                </v-tabs>-->
            <!--            </v-card>-->
            <visited-bar/>
            <v-container fluid>

                <router-view/>
            </v-container>
        </v-content>
    </div>
</template>

<script>
    import Navigation from "./Navigation";
    import VisitedBar from "./VisitedBar";

    export default {
        name: "Layout",
        components: {
            Navigation,
            VisitedBar
        },
        props: {
            source: String
        },
        data: () => ({
            enableMini: false,
            tab: null,
            length: 20,

        }),
        watch: {
            length(val) {
                this.tab = val - 1
            },
        },
    }
</script>

<style scoped="">

    .tab-remove {
        color: grey;
        z-index: 99
    }

    .tab-remove:hover {
        color: black;
    }
</style>
