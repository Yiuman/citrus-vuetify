<template>
    <v-container class="container--fluid fill-height  sea-bg">
        <v-row no-gutters align="center" justify="center" class="">
            <v-col cols="12" sm="8" md="4" lg="4">
                <v-card class="elevation-5 pa-3 z-index-99 ">
                    <v-card-text>
                        <div class="layout column align-center">
                            <h1 class="text-center my-4 primary--text">
                            </h1>
                        </div>
                        <v-form>
                            <v-text-field
                                    v-model="model.loginId"
                                    append-icon="mdi-account"
                                    name="loginId"
                                    label="登录名"
                                    required
                            />
                            <v-text-field
                                    v-model="model.password"
                                    append-icon="mdi-lock"
                                    name="password"
                                    label="密码"
                                    type="password"
                                    required
                            />
                            <v-text-field
                                    v-model="model.captcha"
                                    name="captcha"
                                    label="验证码"
                                    required
                            >
                                <v-img ref="captcha" :src="captchaSrc" width="100px" height="30px" slot="append"/>
                                <v-icon slot="append">mdi-security</v-icon>
                            </v-text-field>

                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer/>
                        <!--                        <v-btn color="primary" outlined to="/singup">注册</v-btn>-->
                        <v-btn color="primary" @click="login">登录</v-btn>
                    </v-card-actions>

                </v-card>
            </v-col>
        </v-row>
        <vue-threejs-birds :color1="birds.color1" :color2="birds.color2" :quantity="birds.quantity"
                           :canvasBgAlpha="birds.canvasBgAlpha" :wingsSpan="birds.wingsSpan"
                           :colorEffect="birds.colorEffect"/>
    </v-container>
</template>

<script>
    import VueThreejsBirds from 'vue-threejs-birds'
    import {API_BASE_PATH} from "../../config";

    export default {
        components: {
            VueThreejsBirds
        },
        data: () => ({
            captchaSrc: API_BASE_PATH + '/rest/verify/captcha',
            model: {
                loginId: '',
                mode: 'password',
                password: '',
                captcha: '',
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
                    this.captchaSrc = this.captchaSrc + "?timestamp=" + Date.now();
                })
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
        background-color #2d3a4b
        background-repeat initial
</style>
