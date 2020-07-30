<template>
    <div class="v-application--wrap">
        <!-- 菜单导航-->
        <navigation :enable-mini="enableMini"/>
        <!--应用顶部导航条#344763-->
        <v-app-bar app
                   dense
                   color="primary"
                   class="app-bar"
                   elevation="0"
        >
            <v-app-bar-nav-icon @click.stop="enableMini=!enableMini">
                <v-icon>{{toggleNavIcon}}</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title class="white--text">
                <v-img height="20" width="98" :src="systemSrc"/>
                <!--                {{systemTitle}}-->
            </v-toolbar-title>

            <v-spacer/>

            <v-btn icon>
                <v-avatar color="#b9cdef" size="36">
                    <span class="white--text headline">{{currentUser}}</span>
                </v-avatar>
                <!--                <v-icon>mdi-heart</v-icon>-->
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
            },
            currentUser() {
                let username = this.$store.state.user.name;
                if (username && username.length > 1) {
                    username = username.substring(0, 1);
                }
                return username;
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

