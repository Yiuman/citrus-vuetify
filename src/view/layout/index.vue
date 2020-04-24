<template>
    <div class="v-application--wrap">
        <!-- 菜单导航-->
        <navigation :enable-mini="enableMini"/>
        <!--应用顶部导航条-->
        <v-app-bar app color="teal lighten-3" flat class="app-bar">
            <v-app-bar-nav-icon @click.stop="enableMini=!enableMini">
                <v-icon>{{toggleNavIcon}}</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title>{{systemTitle}}</v-toolbar-title>

            <template v-slot:extension>
                <visited-bar/>
            </template>
        </v-app-bar>

        <!--整体容器-->
        <v-content>
            <v-container fluid>
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

