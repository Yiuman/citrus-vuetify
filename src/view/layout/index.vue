<template>
  <div class="v-application--wrap">
    <!-- 菜单导航-->
    <navigation :enable-mini="enableMini" />
    <!--应用顶部导航条#344763-->
    <v-app-bar app dense color="primary" class="app-bar" elevation="0">
      <v-app-bar-nav-icon @click.stop="enableMini = !enableMini">
        <v-icon>{{ toggleNavIcon }}</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="white--text">
        <v-img height="20" width="98" :src="systemSrc" />
        <!--                {{systemTitle}}-->
      </v-toolbar-title>

      <v-spacer />

      <!-- 头像列表，操作 -->
      <v-menu
        bottom
        offset-y
        rounded="0"
        transition="scale-transition"
        origin="bottom"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-avatar color="#b9cdef" size="36">
              <span class="white--text headline">{{ currentUser }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(operation, index) in actions"
            :key="index"
            @click="doAction(operation)"
          >
            <v-list-item-title>{{
              operation.text || operation.action
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <template v-slot:extension>
        <visited-bar class="mb-n1" />
      </template>
    </v-app-bar>

    <!--整体容器-->

    <v-main class="main-content">
      <v-container fluid class="height-100pc">
        <transition name="slide-left" appear>
          <router-view class="main-router-view" :key="routerKey" />
        </transition>
      </v-container>
    </v-main>
  </div>
</template>

<script>
  import Navigation from "./components/Navigation";
  import VisitedBar from "./components/VisitedBar";
  import { SYSTEM_CONFIG } from "../../config";

  export default {
    name: "Layout",
    components: {
      Navigation,
      VisitedBar,
    },
    data: () => ({
      systemSrc: require("../../assets/text.png"),
      systemTitle: SYSTEM_CONFIG.systemTile,
      enableMini: true,
      actions: [
        {
          text: "个人中心",
          action: "/usercenter",
        },
        {
          text: "登出",
          action: "logout",
          method: true,
        },
      ],
    }),
    computed: {
      toggleNavIcon() {
        return this.enableMini
          ? "mdi-format-indent-increase"
          : "mdi-format-indent-decrease";
      },
      currentUser() {
        let username = this.$store.state.user.name;
        if (username && username.length > 1) {
          username = username.substring(0, 1);
        }
        return username;
      },
      routerKey() {
        return this.$route.meta.id;
      },
    },
    methods: {
      doAction(operation) {
        if (operation.method) {
          this[operation.action]();
        } else {
          this.$router.push(operation.action);
        }
      },
      logout() {
        this.$store
          .dispatch("user/logout")
          .then(() => {
            this.$router.push("/login");
          })
          .catch((err) => {
            console.warn(err);
            this.refreshCaptcha();
            this.$toasted.show(err.message, {
              position: "top-center",
              type: "error",
              icon: "alert-circle",
            });
          });
      },
    },
  };
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
    background-color: #fefefe;
  }

  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: opacity 0.5s, transform 0.5s;
    top: 0;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  .slide-right-enter /* .fade-leave-active in below version 2.1.8 */
 {
    opacity: 0;
    top: 0;
    transform: translateX(100%);
  }

  .slide-right-leave-to /* .fade-leave-active in below version 2.1.8 */
 {
    opacity: 0;
    top: 0;
    transform: translateX(-100%);
  }

  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: opacity 0.5s, transform 0.5s;
    top: 0;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  .slide-left-enter /* .fade-leave-active in below version 2.1.8 */
 {
    opacity: 0;
    top: 0;
    transform: translateX(-100%);
  }

  .slide-left-leave-to /* .fade-leave-active in below version 2.1.8 */
 {
    display: none;
    opacity: 0;
    top: 0;
    transform: translateX(100%);
  }
</style>
