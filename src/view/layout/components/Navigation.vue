<template>
    <v-navigation-drawer app
                         permanent
                         :src="bgSrc"
                         :mini-variant="enableMini"
                         :expand-on-hover="enableMini"
    >
        <menu-group :menus="menus"/>
    </v-navigation-drawer>
</template>

<script>
    import MenuGroup from "./MenuGroup";

    export default {
        name: "Navigation",
        components: {MenuGroup},
        props: {
            enableMini: {
                type: Boolean,
                default: () => false
            },
            bgSrc: {
                type: String,
                default: () => null
            }
        },
        data: () => ({
            menus: []
        }),
        mounted() {
            this.menus = this.$store.state.menu.menus
        }
    }
</script>

<style scoped>

</style>
