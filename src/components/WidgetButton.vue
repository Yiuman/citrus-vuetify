<template>
    <!--按钮及控件-->
    <v-row justify="end" no-gutters class="mt-2">
        <!--控件的渲染-->
        <v-col v-for="(widget,index) in widgets" :key="index" class="pr-10" md="auto">
            <component :is="widget.widgetName " v-bind="convert(widget)" v-model="modelObject[widget.key]"
                       @change="widgetChange"/>
        </v-col>

        <!--按钮的渲染-->
        <v-col class="button-col pl-10 flex-column" md="auto">
            <v-btn v-for="(button,index) in buttons" :key="index" class="my-1 ml-2" @click="buttonClick(button.action)"
                   :color="button.color"
                   small
                   depressed
                   outlined>
                <v-icon left v-if="button.icon">mdi-{{button.icon}}</v-icon>
                {{button.text}}
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
    import transform from '../utils/widget';

    export default {
        name: "WidgetButton",
        props: {
            widgets: Array,
            buttons: Array,
            modelObject: Object
        },
        methods: {
            convert(widget) {
                return transform(widget);
            },
            widgetChange() {
                this.$emit("widgetChange");
            },
            buttonClick(action) {
                this.$emit("buttonClick", action);
            }
        }
    }
</script>

<style scoped>

</style>
