<template>
  <v-navigation-drawer
    app
    color="#fafbfd"
    permanent
    class="menu-navigation-drawer"
    :mini-variant="enableMini"
    :expand-on-hover="enableMini"
  >
    <menu-group :menus="menus" />
  </v-navigation-drawer>
</template>

<script>
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
