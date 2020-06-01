<template>
    <div class="v-application--wrap">
        <!-- 菜单导航-->
        <navigation :enable-mini="enableMini"/>
        <!--应用顶部导航条#344763-->
        <v-app-bar app
                   dense
                   color="#80abfa"
                   class="app-bar"
                   elevation="0"
        >
            <v-app-bar-nav-icon @click.stop="enableMini=!enableMini">
                <v-icon color="#fafbfd">{{toggleNavIcon}}</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title class="white--text">
                <v-img height="20" width="98" :src="systemSrc"/>
                <!--                {{systemTitle}}-->
            </v-toolbar-title>

            <v-spacer/>

            <v-btn icon>
                <v-icon>mdi-heart</v-icon>
            </v-btn>

            <template v-slot:extension>
                <visited-bar class="mb-n1"/>
            </template>
        </v-app-bar>

        <!--整体容器-->
        <v-content class="main-content">
            <v-container fluid class="height-100pc">
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
            systemSrc: require('../../assets/text.png'),
            systemTitle: SYSTEM_CONFIG.systemTile,
            enableMini: true,
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

    .main-content {
        background-color: #f8f8f8;
    }

</style>

