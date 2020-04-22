<template>
    <v-navigation-drawer :src="bgSrc" permanent
                         :mini-variant="enableMini"
                         :expand-on-hover="enableMini"
                         app>
        <v-list dense>
            <template v-for="item in items">
                <v-layout v-if="item.heading" :key="item.heading" row align-center>
                    <v-flex xs6>
                        <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
                    </v-flex>
                    <v-flex xs6 class="text-xs-center">
                        <a href="#!" class="body-2 black--text">EDIT</a>
                    </v-flex>
                </v-layout>

                <v-list-group
                        v-else-if="item.children"
                        :key="item.text"
                        v-model="item.model"
                        :prepend-icon="item.model ? item.icon : item['mdi-icon-alt']"
                        append-icon=""
                >
                    <template v-slot:activator>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ item.text }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                    <v-list-item v-for="(child, i) in item.children" :key="i">
                        <v-list-item-action v-if="child.icon">
                            <v-icon>{{ child.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>{{ child.text }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>

                <v-list-item v-else :key="item.text" @click="alert(1)">
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        name: "Navigation",
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
            items: [
                {icon: 'mdi-contacts', text: 'Contacts'},
                {icon: 'mdi-history', text: 'Frequently contacted'},
                {icon: 'mdi-content_copy', text: 'Duplicates'},
                {
                    icon: 'mdi-keyboard_arrow_up',
                    'icon-alt': 'mdi-keyboard_arrow_down',
                    text: 'Labels',
                    model: true,
                    children: [
                        {icon: 'mdi-add', text: 'Create label'},
                    ],
                },
                {
                    icon: 'mdi-keyboard_arrow_up',
                    'icon-alt': 'mdi-keyboard_arrow_down',
                    text: 'More',
                    model: false,
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
