<template>
    <div class="v-application--wrap">
        <!-- 菜单导航-->
        <navigation :enable-mini="enableMini"/>
        <!--应用顶部导航条-->
        <v-app-bar app color="#344763" flat class="app-bar">
            <v-app-bar-nav-icon @click.stop="enableMini=!enableMini">
                <v-icon color="white">{{toggleNavIcon}}</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title class="white--text">{{systemTitle}}</v-toolbar-title>

            <template v-slot:extension >
                <visited-bar class="mb-n1"/>
            </template>
        </v-app-bar>

        <!--整体容器-->
        <v-content >
            <v-container >
                <router-view/>
            </v-container>
        </v-content>
    </div>
</template>

<script>
    import Navigation from "./components/Navigation";
    import VisitedBar from "./components/VisitedBar";
    import {SYSTEM_CONFIG} from '../../config'

    export default {
        name: "Layout",
        components: {
            Navigation,
            VisitedBar
        },
        data: () => ({
            systemTitle: SYSTEM_CONFIG.systemTile,
            enableMini: false,
        }),
        computed: {
            toggleNavIcon() {
                return this.enableMini ? 'mdi-format-indent-increase' : 'mdi-format-indent-decrease';
            }
        }
    }
</script>
<style scoped>
    .app-bar {
        height: auto !important;
    }

    .app-bar >>> .v-toolbar__extension {
        padding: 0 !important;
        height: 44px !important;
    }
</style>

