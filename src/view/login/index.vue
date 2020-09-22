<template>
    <v-container class="container--fluid fill-height  sea-bg">
        <v-row no-gutters align="center" justify="center">
            <v-col cols="12" sm="8" md="4" lg="4">
                <v-card class="elevation-10 pa-3 z-index-99 color-white bg-white">
                    <div class="logo-mount"></div>
                    <v-card-text>
                        <div id="system-title" class="layout column align-center mb-6 ">
                            <v-img :src="logoSrc" height="30" width="150"/>
<!--                                                        Citrus-->
                        </div>
                        <v-form @keydown.enter.native="login">
                            <v-text-field
                                    outlined
                                    clearable
                                    v-model="model.loginId"
                                    prepend-icon="mdi-account"
                                    placeholder="请输入登录名"
                                    name="loginId"
                                    label="登录名"
                                    required
                            />
                            <v-text-field
                                    outlined
                                    clearable
                                    v-model="model.password"
                                    prepend-icon="mdi-lock"
                                    placeholder="请输入密码"
                                    name="password"
                                    label="密码"
                                    type="password"
                                    required
                            />
                            <v-text-field
                                    outlined
                                    clearable
                                    v-model="model.captcha"
                                    placeholder="请输入验证码"
                                    name="captcha"
                                    label="验证码"
                                    required
                            >
                                <div slot="append" class="mt-0 captcha" @click.prevent="refreshCaptcha">
                                    <v-img class="v-sheet" ref="captcha" :src="captchaSrc" height="40px"/>
                                </div>

                                <v-icon slot="prepend">mdi-security</v-icon>
                            </v-text-field>

                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer/>
                        <!--                        <v-btn color="primary" outlined to="/singup">注册</v-btn>-->
                        <v-btn class="submit-btn" color="#acb6e5" dark @click="login">登录</v-btn>
                    </v-card-actions>

                </v-card>
            </v-col>
            <v-alert color="error" v-model="snackbar.switch" top>
                {{ snackbar.text }}
                <!-- <v-btn outlined @click="snackbar.switch = false">确认</v-btn> -->
            </v-alert>
        </v-row>
        <vue-threejs-birds style="max-width: none" :color1="birds.color1" :color2="birds.color2"
                           :quantity="birds.quantity"
                           :canvasBgAlpha="birds.canvasBgAlpha" :wingsSpan="birds.wingsSpan"
                           :colorEffect="birds.colorEffect"/>
        <!--消息提示-->

    </v-container>
</template>

<script>
    import VueThreejsBirds from 'vue-threejs-birds'
    import {API_BASE_PATH} from "../../config";

    const CAPTCHA_BASE_URL = API_BASE_PATH + '/rest/verify/captcha';

    export default {
        components: {
            VueThreejsBirds
        },
        data: () => ({
            logoSrc: require('../../assets/text.png'),
            captchaSrc: CAPTCHA_BASE_URL,
            model: {
                loginId: '',
                mode: 'password',
                password: '',
                captcha: '',
            },
            snackbar: {
                switch: false,
                text: '',
            },
            birds: {
                color1: '#000000',
                color2: '#271e1e',
                quantity: 4,
                canvasBgAlpha: 0,
                wingsSpan: 20,
                colorEffect: 2,
            }
        }),
        methods: {
            handleResize() {
                this.$root.$emit('resized');
            },
            login() {
                this.$store.dispatch("user/login", this.model).then(() => {
                    this.$router.push("/")
                }).catch(err => {
                    console.warn(err);

                    this.refreshCaptcha();
                    this.snackbar.text = err.message;
                    this.snackbar.switch = true;
                })
            },
            refreshCaptcha() {
                this.captchaSrc = CAPTCHA_BASE_URL + "?timestamp=" + Date.now();
            }
        },
        mounted() {
            window.addEventListener('resize', this.handleResize)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.handleResize)
        }
    }
</script>

<style scoped lang="stylus">
    .sea-bg
        background url(../../assets/cool-background.png) no-repeat;
        background-size cover

    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    .color-white
        background-color #fff

    .captcha
        cursor pointer
        z-index 999
        position relative
        top -8px

    .submit-btn
        background #536976; /* fallback for old browsers */
        background -webkit-linear-gradient(to right, #292E49, #536976); /* Chrome 10-25, Safari 5.1-6 */
        background linear-gradient(to right, #292E49, #536976);

    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    .bg-white
        background-color: rgba(255, 255, 255, 0.6) !important

    input::-webkit-input-placeholder
        color rgba(255, 255, 255, 0.1) !important

    .logo-mount
        position relative

    /*    content: '';
        position: absolute;
        z-index: 2;
        top: 60px;
        background-image: url("../../assets/logo.png");
        background-size: 100% 100%;
        left: 50px;
        width: 50px;
        height: 50px;
        border-radius: 2px;
        transform: rotate(45deg);
        -webkit-animation: box .8s infinite;
    */
    .logo-mount:before {
        content: '';
        position: absolute;
        z-index: 2;
        top: -30px;
        left: 10px;
        width: 50px;
        height: 50px;
        background-image: url("../../assets/logo.png");
        background-size: 100% 100%;
        border-radius: 2px;
        transform: rotate(45deg);
        -webkit-animation: box .8s infinite;
    }

    .logo-mount:after {
        content: '';
        position: absolute;
        z-index: 1;
        top: 48px;
        left: 12px;
        width: 44px;
        height: 3px;
        background: #eaeaea;
        border-radius: 100%;
        -webkit-animation: shadow .8s infinite;
    }

    //底部阴影动效
    @-webkit-keyframes shadow {
        0%, 100% {
            left: 14px;
            width: 40px;
            background: #eaeaea;
        }
        50% {
            top: 46px;
            left: 10px;
            width: 50px;
            height: 7px;
            background: #eee;
        }
    }

    //box跳动+旋转效果
    @-webkit-keyframes box {
        0% {
            top: -30px;
        }
        20% {
            border-radius: 2px;
        }
        50% {
            top: 0;
            border-bottom-right-radius: 25px;
        }
        80% {
            border-radius: 2px;
        }
        100% {
            top: -30px;
        }
    }

</style>
