<template>
  <div class="v-application--wrap">
    <!-- 菜单导航-->
    <navigation :enable-mini="enableMini" />
    <!--应用顶部导航条#344763-->
    <v-app-bar
      app
      dense
      :src="config.appBarBgSrc"
      :color="config.appBarColor"
      class="app-bar"
      elevation="0"
    >
      <v-app-bar-nav-icon small @click.stop="enableMini = !enableMini">
        <v-icon>{{ toggleNavIcon }}</v-icon>
      </v-app-bar-nav-icon>
      <!-- 面包屑导航 -->
      <v-breadcrumbs
        v-if="config.breadcrumb"
        :items="breadCrumbs"
      ></v-breadcrumbs>

      <v-toolbar-title v-if="config.toolbarTitle">
        <v-img
          v-if="config.systemImageSrc"
          height="20"
          width="98"
          :src="config.systemImageSrc"
        />
        <div class="system-title" v-if="config.systemTitle">
          {{ config.systemTitle }}
        </div>
      </v-toolbar-title>

      <v-spacer />

      <!-- 这里开始是右边 -->

      <!-- 头像列表，操作 -->
      <v-menu
        bottom
        offset-y
        rounded="0"
        transition="scale-transition"
        origin="bottom"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mr-1" small icon v-bind="attrs" v-on="on">
            <v-avatar
              color="#b9cdef"
              size="32"
              :style="{ 'background-image': defaultAvatar }"
            >
              <img v-if="userAvatar" :src="userAvatar" alt="" />
              <span v-else class="white--text text-h6">
                {{ currentUser }}
              </span>
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
        <visited-bar />
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
  import GeoPattern from "geopattern";
  import Navigation from "./components/Navigation";
  import VisitedBar from "./components/VisitedBar";
  import { SYSTEM_CONFIG as config } from "../../config";
  import { createBreadCrumbs } from "@/utils/app";

  export default {
    name: "Layout",
    components: {
      Navigation,
      VisitedBar,
    },
    data: () => ({
      config,
      enableMini: true,
      enableSearch: false,
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
      breadCrumbs() {
        return createBreadCrumbs(this.$route);
      },
      userAvatar() {
        const userInfo = this.$store.state.user.userOnlineInfo;
        return userInfo.avatar;
      },
      defaultAvatar() {
        const userInfo = this.$store.state.user.userOnlineInfo;
        return GeoPattern.generate(String(userInfo.userId), {}).toDataUrl();
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
            this.refreshCaptcha();
            this.$toast.error(err.message, {
              position: "top-right",
            });
          });
      },
    },
  };
</script>
<style scoped>
  .app-bar {
    height: auto !important;
    z-index: 999 !important;
  }

  .app-bar >>> .v-toolbar__extension {
    padding: 0 !important;
    height: 36px !important;
  }

  .main-content {
    background-color: #f0f2f5;
    padding-top: 86px !important;
  }

  .system-title {
    color: #000;
    font-weight: bold;
  }

  .app-bar >>> .v-breadcrumbs__item--disabled{
    color: rgba(0, 0, 0, 0.87) !important;
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
