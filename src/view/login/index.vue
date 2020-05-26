<template>
    <v-container class="container--fluid fill-height  sea-bg">
        <v-row no-gutters align="center" justify="center">
            <v-col cols="12" sm="8" md="4" lg="4">
                <v-card class="elevation-10 pa-3 z-index-99 color-white bg-white">
                    <v-card-text>
                        <div class="layout column align-center mb-6 ">
                           <v-img :src="logoSrc" height="30" width="150"/>
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
        </v-row>
        <vue-threejs-birds :color1="birds.color1" :color2="birds.color2" :quantity="birds.quantity"
                           :canvasBgAlpha="birds.canvasBgAlpha" :wingsSpan="birds.wingsSpan"
                           :colorEffect="birds.colorEffect"/>
        <!--消息提示-->
        <v-snackbar color="warn"  v-model="snackbar.switch" top multi-line>
            {{ snackbar.text }}
            <v-btn  outlined  @click="snackbar.switch = false">确认</v-btn>
        </v-snackbar>
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
            logoSrc:require('../../assets/text.png'),
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
                color1: '#2568af',
                color2: '#2568af',
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
        background-image: url("data:image/svg+xml,%3Csvg width='56' height='28' viewBox='0 0 56 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M56 26c-2.813 0-5.456.726-7.752 2H56v-2zm-26 2h4.087C38.707 20.783 46.795 16 56 16v-2c-.672 0-1.339.024-1.999.07L54 14a2 2 0 0 1 2-2v-2a4 4 0 0 0-3.98 3.602 28.087 28.087 0 0 0-2.793-3.862A7.994 7.994 0 0 1 56 6V4a9.988 9.988 0 0 0-8.17 4.232 28.156 28.156 0 0 0-3.03-2.634A13.979 13.979 0 0 1 56 0h-7.752a16.078 16.078 0 0 0-5.09 4.454 27.941 27.941 0 0 0-3.536-1.936c.63-.896 1.33-1.738 2.095-2.518H39.03c-.46.557-.893 1.137-1.297 1.737A27.787 27.787 0 0 0 33.723.585c.12-.196.24-.392.364-.585H30l-.001.07A28.406 28.406 0 0 0 26 .07L26 0h-4.087c.124.193.245.389.364.585a27.787 27.787 0 0 0-4.009 1.152c-.404-.6-.837-1.18-1.297-1.737h-2.688c.764.78 1.466 1.622 2.095 2.518-1.23.562-2.41 1.21-3.536 1.936A16.078 16.078 0 0 0 7.752 0H0c4.58 0 8.645 2.199 11.2 5.598a28.156 28.156 0 0 0-3.03 2.634A9.988 9.988 0 0 0 0 4v2a7.994 7.994 0 0 1 6.773 3.74 28.087 28.087 0 0 0-2.793 3.862A4 4 0 0 0 0 10v2a2 2 0 0 1 1.999 2.07C1.339 14.024.672 14 0 14v2c9.205 0 17.292 4.783 21.913 12H26a2 2 0 1 1 4 0zM7.752 28C5.456 26.726 2.812 26 0 26v2h7.752zM56 20c-6.832 0-12.936 3.114-16.971 8h2.688A19.94 19.94 0 0 1 56 22v-2zm-39.029 8C12.936 23.114 6.831 20 0 20v2a19.94 19.94 0 0 1 14.283 6h2.688zm15.01-.398a28.087 28.087 0 0 1 2.792-3.862A7.994 7.994 0 0 0 28 20a7.994 7.994 0 0 0-6.773 3.74 28.087 28.087 0 0 1 2.793 3.862 4 4 0 0 1 7.96 0zm14.287-11.865C42.318 9.864 35.61 6 28 6c-7.61 0-14.318 3.864-18.268 9.737a27.787 27.787 0 0 0-4.009-1.152C10.275 7.043 18.548 2 28 2c9.452 0 17.725 5.043 22.277 12.585a27.787 27.787 0 0 0-4.009 1.152zm-5.426 2.717a27.941 27.941 0 0 1 3.536-1.936C40.76 11.367 34.773 8 28 8s-12.76 3.367-16.378 8.518c1.23.562 2.41 1.21 3.536 1.936C18.075 14.537 22.741 12 28 12s9.925 2.537 12.842 6.454zm-4.672 3.778a28.156 28.156 0 0 1 3.03-2.634A13.979 13.979 0 0 0 28 14c-4.58 0-8.645 2.199-11.2 5.598a28.156 28.156 0 0 1 3.03 2.634A9.988 9.988 0 0 1 28 18a9.988 9.988 0 0 1 8.17 4.232z' fill='%23ffffff' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")
        background #77A1D3; /* fallback for old browsers */
        background -webkit-linear-gradient(to right, #E684AE, #79CBCA, #77A1D3); /* Chrome 10-25, Safari 5.1-6 */
        background linear-gradient(to right, #E684AE, #79CBCA, #77A1D3);

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

</style>
