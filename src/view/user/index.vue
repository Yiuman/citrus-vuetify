<template>
  <div class="py-2 px-2 height-100pc user-center" elevation="1">
    <v-row no-gutters justify="space-between">
      <v-col class="mr-3" md="3">
        <v-card shaped>
          <v-img
            :style="{ 'background-image': usercard }"
            height="250"
            class="user-card-img"
          >
            <div class="text-center mt-2">
              <v-avatar size="175">
                <v-icon size="190" color="#fff">mdi-account-circle</v-icon>
              </v-avatar>
            </div>
            <div class="my-2 text-center font-weight-bold">
              {{ userInfo.username }}
            </div>
          </v-img>

          <v-card-text>
            <div v-for="(line, index) in cardlines" :key="index">
              <div class="py-2">
                <v-icon small left>{{ line.icon }}</v-icon
                >{{ line.text }}
              </div>
              <v-divider />
            </div>
            <div class="mb-3"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="ml-3">
        <v-card>
          <v-tabs v-model="activeTab">
            <v-tab v-for="item in tabItems" :key="item.tab">
              {{ item.tab }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <v-tab-item v-for="item in tabItems" :key="item.tab">
              <v-card flat class="pa-3">
                <v-timeline>
                  <v-timeline-item v-for="n in 3" :key="n" small>
                    <template v-slot:icon>
                      <v-avatar v-if="avatar">
                        <img src="http://i.pravatar.cc/64" />
                      </v-avatar>
                    </template>
                    <span slot="opposite">Tus eu perfecto</span>
                    <v-card class="elevation-2">
                      <v-card-title class="headline">Lorem ipsum</v-card-title>
                      <v-card-text>
                        Lorem ipsum dolor sit amet, no nam oblique veritus.
                        Commune scaevola imperdiet nec ut, sed euismod convenire
                        principes at. Est et nobis iisque percipit, an vim zril
                        disputando voluptatibus, vix an salutandi sententiae.
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import GeoPattern from "geopattern";
  export default {
    name: "UserCenter",
    data() {
      return {
        usercard: "",
        userInfo: {},
        cardlines: [],
        activeTab: null,
        tabItems: [
          { tab: "我的动态", content: "访问记录" },
          { tab: "个人设置", content: "个人信息" },
          { tab: "修改密码", content: "修改密码" },
        ],
      };
    },
    mounted() {
      this.userInfo = this.$store.state.user.userOnlineInfo;
      this.usercard = GeoPattern.generate(String(this.userInfo.userId), {
        color: "#80abfa",
      }).toDataUrl();
      this.cardlines = [
        {
          icon: "mdi-email",
          text: this.userInfo.email,
        },
        {
          icon: "mdi-cellphone",
          text: this.userInfo.mobile,
        },
        {
          icon: "mdi-account-multiple",
          text: this.userInfo.organizations
            ? this.userInfo.organizations.map((item) => item.organName)
            : "无",
        },
        {
          icon: "mdi-account-tie-outline",
          text: this.userInfo.admin
            ? "超级管理员"
            : this.userInfo.roles
            ? this.userInfo.roles.map((item) => item.roleName)
            : "无",
        },
      ];
    },
  };
</script>

<style>
  .user-card-img {
    opacity: 0.8 !important;
    background-size: 100%;
  }
</style>
