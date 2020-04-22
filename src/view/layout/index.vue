<template>
    <div class="v-application--wrap">
        <!-- 菜单导航-->
        <navigation :enable-mini="enableMini"/>
        <!--应用顶部导航条-->
        <v-app-bar app color="pink" flat>
            <v-app-bar-nav-icon @click.stop="enableMini=!enableMini">
                <v-icon>{{toggleNavIcon}}</v-icon>
            </v-app-bar-nav-icon>
            <!--            <v-toolbar-title >Citrus</v-toolbar-title>-->
        </v-app-bar>

        <!--整体容器-->
        <v-content>
            <visited-bar/>
            <v-container fluid>
                <router-view/>
            </v-container>
        </v-content>
    </div>
</template>

<script>
    import Navigation from "./components/Navigation";
    import VisitedBar from "./components/VisitedBar";

    export default {
        name: "Layout",
        components: {
            Navigation,
            VisitedBar
        },
        data: () => ({
            enableMini: false,
        }),
        computed: {
            toggleNavIcon() {
                return this.enableMini ? 'mdi-format-indent-decrease' : 'mdi-format-indent-increase';
            }
        }
    }
</script>

