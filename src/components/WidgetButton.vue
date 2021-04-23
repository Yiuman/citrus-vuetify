<template>
  <!--按钮及控件-->
  <v-row no-gutters class="mt-2">
    <!--按钮的渲染-->
    <v-col class="button-col pr-10 flex-column" md="auto">
      <template v-for="(button, index) in buttons">
        <v-btn
            v-if="!button.group"
            :key="index"
            class="my-1 ml-2"
            @click="buttonClick(button.action)"
            :color="button.color"
            depressed
            tile
            small
        >
          <v-icon small left v-if="button.icon">mdi-{{ button.icon }}</v-icon>
          {{ button.text }}
        </v-btn>
        <v-menu
            v-else
            :key="index"
            bottom
            offset-y
            rounded="0"
            transition="slide-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="my-1 ml-2"
                tile
                v-bind="attrs"
                v-on="on"
                :color="button.color"
                depressed
                small
                outlined
            >
              {{ button.text }}
              <v-icon right small>mdi-{{ button.icon }}</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
                v-for="(operation, index) in button.actions"
                :key="index"
                :color="operation.color"
                @click="buttonClick(operation.action)"
            >
              <v-list-item-icon>
                <v-icon small left :color="operation.color"
                >mdi-{{ operation.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ operation.text || operation.action }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-col>

    <!--控件的渲染-->
    <v-col v-for="(widget, index) in widgets" :key="index" class="pl-10" md="2">
      <component
          :is="widget.widgetName"
          v-bind="convert(widget)"
          v-model="modelObject[widget.key]"
          @change="widgetChange"
      />
    </v-col>
  </v-row>
</template>

<script>
import {convertWidget} from "@/utils/widget";

export default {
  name: "WidgetButton",
  props: {
    widgets: Array,
    buttons: Array,
    modelObject: Object,
  },
  methods: {
    convert(widget) {
      return convertWidget(widget);
    },
    widgetChange() {
      this.$emit("widgetChange");
    },
    buttonClick(action) {
      this.$emit("buttonClick", action);
    },
  },
};
</script>
