<template>
  <div>
    <template v-for="(button, index) in buttons">
      <v-btn
        v-if="!button.group"
        :key="index"
        class="my-1 ml-2"
        @click="buttonClick(button)"
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
            @click="buttonClick(operation)"
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
  </div>
</template>

<script>
  export default {
    name: "ButtonGroup",
    props: {
      buttons: Array,
    },
    methods: {
      buttonClick(button) {
        this.$emit("buttonClick", button.action,null,button);
      },
    },
  };
</script>

<style></style>
