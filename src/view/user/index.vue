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
              <img
                  class="avatar-img"
                  v-if="profileForm.avatar"
                  :src="profileForm.avatar"
                  alt=""/>
              <v-icon v-else size="190" color="#fff">mdi-account-circle</v-icon>
            </div>
            <div class="my-2 text-center font-weight-bold">
              {{ userInfo.username }}
            </div>
          </v-img>

          <v-card-text>
            <div v-for="(line, index) in cardlines" :key="index">
              <div class="py-2">
                <v-icon small left>{{ line.icon }}
                </v-icon
                >
                {{ line.text }}
              </div>
              <v-divider/>
            </div>
            <div class="mb-3"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="ml-3">
        <v-card>
          <v-tabs>
            <v-tab>我的动态</v-tab>
            <v-tab>个人设置</v-tab>
            <v-tab>修改密码</v-tab>

            <!-- 我的动态 -->
            <v-tab-item>
              <v-card flat class="pa-3">
                <v-timeline>
                  <v-timeline-item
                      v-for="(log, index) in accessLogs"
                      :key="index"
                      small
                  >
                    <template v-slot:icon></template>
                    <span slot="opposite">{{
                        $moment(log.createTime).format("YYYY-MM-DD hh:mm:ss")
                      }}</span>
                    <v-card class="elevation-2">
                      <v-card-title class="headline">{{
                          log.resourceName || log.url
                        }}
                      </v-card-title>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-card>
            </v-tab-item>

            <!-- 个人设置 -->
            <v-tab-item>
              <v-card flat class="pa-3">
                <v-row>
                  <v-col md="6">
                    <v-form ref="form">
                      <!-- 字段渲染 -->
                      <v-container>
                        <v-row>
                          <v-col md="12">
                            <v-text-field
                                label="用户名"
                                :rules="profileRules.username"
                                v-model="profileForm.username"
                                clearable
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col md="12">
                            <v-text-field
                                label="手机号码"
                                :rules="profileRules.mobile"
                                v-model="profileForm.mobile"
                                clearable
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col md="12">
                            <v-text-field
                                label="邮箱"
                                :rules="profileRules.email"
                                v-model="profileForm.email"
                                clearable
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-col>
                  <v-col md="6">
                    <avatar-upload
                        tips-text="拖拽或单击进行上传图片"
                        v-model="profileForm.avatar"
                    />
                  </v-col>
                </v-row>
                <v-divider/>
                <v-row justify="end">
                  <v-col md="4" align="end">
                    <v-btn
                        small
                        outlined
                        tile
                        class="mr-2"
                        color="secondary"
                        @click="resetProfile"
                    >
                      重置
                    </v-btn>
                    <v-btn
                        small
                        tile
                        class="mr-2"
                        color="primary"
                        @click="saveProfile"
                    >
                      保存
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <!-- 修改密码 -->
            <v-tab-item>
              <v-card flat class="pa-3">
                <v-row justify="center" align="center">
                  <v-col md="6">
                    <v-form ref="passwordForm">
                      <!-- 字段渲染 -->
                      <v-container>
                        <v-row>
                          <v-col md="12">
                            <v-text-field
                                label="旧密码"
                                :rules="passwordRules.oldPassword"
                                v-model="passwordForm.oldPassword"
                                type="password"
                                clearable
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col md="12">
                            <v-text-field
                                label="新密码"
                                :rules="passwordRules.newPassword"
                                v-model="passwordForm.newPassword"
                                id="newPassword"
                                type="password"
                                clearable
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col md="12">
                            <v-text-field
                                label="确认密码"
                                :rules="passwordRules.confirmPassword"
                                v-model="passwordForm.confirmPassword"
                                id="confirmPassword"
                                type="password"
                                clearable
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-col>
                </v-row>
                <v-row justify="end">
                  <v-col md="4" align="end">
                    <v-btn
                        small
                        tile
                        class="mr-2"
                        color="primary"
                        @click="passwordUpate"
                    >
                      保存
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GeoPattern from "geopattern";
import {
  getAccessLogsByUserId,
  saveUserProfile,
  updatePassword,
} from "@/api/user";
import AvatarUpload from "@/components/AvatarUpload";
import {required} from "@/utils/widget";

export default {
  name: "UserCenter",
  components: {
    AvatarUpload,
  },
  data() {
    return {
      alert: false,
      usercard: "",
      userInfo: {},
      cardlines: [],
      tabItems: [
        {tab: "logs", text: "我的动态"},
        {tab: "profile", content: "个人设置"},
        {tab: "password", content: "修改密码"},
      ],
      accessLogs: [],
      profileForm: {
        userId: "",
        username: "",
        mobile: "",
        email: "",
        avatar: "",
      },
      profileRules: {
        username: [required("用户名")],
        mobile: [
          required("手机号码"),
          function (v) {
            return /^1[3456789]\d{9}$/.test(v) || `手机号码格式错误`;
          },
        ],
        email: [required("邮箱")],
      },
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      passwordRules: {
        oldPassword: [required("旧密码")],
        newPassword: [],
        confirmPassword: [],
      },
    };
  },
  mounted() {
    this.initBaseInfo();
    this.initAccessLogs();
    this.initPasswordRules();
  },
  methods: {
    initBaseInfo() {
      this.userInfo = this.$store.state.user.userOnlineInfo;
      this.usercard = GeoPattern.generate(String(this.userInfo.userId), {}).toDataUrl();
      this.resetProfile();

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
        {
          icon: "mdi-update",
          text: `加入于 ${this.$moment(this.userInfo.createdTime).format('YYYY-MM-DD')}`
        }
      ];
    },
    initAccessLogs() {
      getAccessLogsByUserId(this.userInfo.userId)
          .then((result) => {
            this.accessLogs = result.records;
          })
          .catch((err) => {
            console.warn(err);
          });
    },
    saveProfile() {
      if (this.$refs.form.validate()) {
        saveUserProfile(this.profileForm)
            .then(() => {
              this.$store.dispatch("user/resetCurrent", {
                ...this.userInfo,
                ...this.profileForm,
              });
              this.$toast.success("保存成功", {
                position: "top-center",
              });
            })
            .catch((err) => {
              this.$toast.error(err.message, {
                position: "top-center",
              });
            });
      }
    },
    passwordUpate() {
      if (this.$refs.passwordForm.validate()) {
        updatePassword(this.passwordForm).catch((err) => {
          this.$toast.success(err.message, {
            position: "top-center",
          });
        });
      }
    },
    resetProfile() {
      this.profileForm = {
        userId: this.userInfo.userId,
        username: this.userInfo.username,
        mobile: this.userInfo.mobile,
        email: this.userInfo.email,
        avatar: this.userInfo.avatar || "",
      };
    },
    checkNewPassword(passwordFormfield) {
      const _this = this;
      const getField = function () {
        return _this.passwordForm[passwordFormfield];
      };

      return function (v) {
        const field = getField();
        const checkResult = !field || v === field;

        if (_this.$refs.passwordForm) {
          const targetInput = _this.$refs.passwordForm.inputs.filter(
              (input) => input.id === passwordFormfield
          )[0];

          if (v === field && !targetInput.valid) {
            targetInput.resetValidation();
          }
        }

        return checkResult || `两次输入的密码不一致`;
      };
    },
    initPasswordRules() {
      this.passwordRules.newPassword = [
        required("新密码"),
        this.checkNewPassword("confirmPassword"),
      ];
      this.passwordRules.confirmPassword = [
        required("确认密码"),
        this.checkNewPassword("newPassword"),
      ];
    },
  },
};
</script>

<style>
.user-card-img {
  opacity: 0.8 !important;
  background-size: 100%;
}

.avatar-img {
  width: 170px;
  border-radius: 50%;
}
</style>
