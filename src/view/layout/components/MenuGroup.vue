<template>
    <v-list dense>
        <div v-for="item in menus" :key="item.title">
            <v-list-item
                    v-if="!item.children"
                    :to="resolvePath(item)"
                    ripple="ripple"
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>
                        {{ item.text }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-group
                    v-else
                    :prepend-icon="item.icon"
            >
                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </template>

                <menu-group
                        :menus="item.children"
                        :base-path="resolvePath(item)"
                />
            </v-list-group>
        </div>
    </v-list>
</template>

<script>
    export default {
        name: "MenuGroup",
        props: {
            menus: {
                type: Array,
                default: () => {
                }
            },
            prefix: {
                type: String,
                default: () => ''
            }
        },
        data: () => ({}),
        methods: {
            resolvePath(item) {
                if (!item.path) {
                    return;
                }
                return this.prefix + item.path
            }
        }
    }
</script>

<style scoped>

</style>
