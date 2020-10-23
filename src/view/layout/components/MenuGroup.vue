<template>
  <v-list dense>
    <div v-for="(menu, index) in menus" :key="index">
      <v-list-item
        color="primary"
        v-if="!menu.children"
        :to="resolvePath(menu)"
        ripple="ripple"
      >
        <v-list-item-icon>
          <v-icon v-if="menu.icon">{{ menu.icon }}</v-icon>
          <v-avatar v-else color="#b9cdef" size="24">
            <span class="white--text ">{{ menu.text.substring(0,1) }}</span>
          </v-avatar>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ menu.text || menu }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group color="primary" v-else :prepend-icon="menu.icon">
        <template v-slot:activator>
          <v-list-item-title>{{ menu.text }}</v-list-item-title>
        </template>

        <menu-group :menus="menu.children" :base-path="resolvePath(menu)" />
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
      },
      prefix: {
        type: String,
        default: () => "",
      },
    },
    methods: {
      resolvePath(item) {
        if (!item.path) {
          return;
        }
        return this.prefix + item.path;
      },
    },
  };
</script>

<style scoped></style>
