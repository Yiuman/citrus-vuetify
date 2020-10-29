<template>
  <!-- color="#fafbfd" -->
  <v-navigation-drawer
    app
    dark
    :color="config.menuColor"
    permanent
    class="menu-navigation-drawer"
    :mini-variant="enableMini"
    :expand-on-hover="enableMini"
  >
    <menu-group :menus="menus" :enable-mini="enableMini"/>
  </v-navigation-drawer>
</template>

<script>
  import { SYSTEM_CONFIG as config } from "@/config";
  import MenuGroup from "./MenuGroup";

  export default {
    name: "Navigation",
    components: { MenuGroup },
    props: {
      enableMini: {
        type: Boolean,
        default: () => false,
      },
      bgSrc: {
        type: String,
        default: () => require("../../../assets/logo.png"),
      },
    },
    data: () => ({
      menus: [],
      config,
    }),
    mounted() {
      this.menus = this.$store.state.menu.menus;
    },
  };
</script>

<style scoped>
  .menu-navigation-drawer {
    z-index: 9999;
  }
</style>
