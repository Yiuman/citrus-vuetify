<template>
    <v-navigation-drawer app
                         permanent
                         :src="bgSrc"
                         :mini-variant="enableMini"
                         :expand-on-hover="enableMini"
    >
        <menu-group :menus="items"/>
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
            activeItem:1,
            items: [
                {icon: 'mdi-contacts', text: '用户管理',path:'users'},
                {icon: 'mdi-history', text: 'Frequently contacted'},
                {icon: 'mdi-content_copy', text: 'Duplicates'},
                {
                    icon: 'mdi-keyboard_arrow_up',
                    'icon-alt': 'mdi-keyboard_arrow_down',
                    text: 'Labels',
                    children: [
                        {icon: 'mdi-add', text: 'Create label'},
                    ],
                },
                {
                    icon: 'mdi-keyboard_arrow_up',
                    'icon-alt': 'mdi-keyboard_arrow_down',
                    text: 'More',
                    children: [
                        {text: 'Import'},
                        {text: 'Export'},
                        {text: 'Print'},
                        {text: 'Undo changes'},
                        {text: 'Other contacts'},
                    ],
                },
                {icon: 'mdi-settings', text: 'Settings'},
                {icon: 'mdi-chat_bubble', text: 'Send feedback'},
                {icon: 'mdi-help', text: 'Help'},
                {icon: 'mdi-phonelink', text: 'App downloads'},
                {icon: 'mdi-keyboard', text: 'Go to the old version'},
            ],
        })
    }
</script>

<style scoped>

</style>
