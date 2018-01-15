<template>
  <div id="app">
    <vue-sticky-bubble :size="60" :badgeCount="362" v-on:tapped="tapHandler"></vue-sticky-bubble>
  </div>
</template>

<script>
import Vue from 'vue';
import VueStickyBubblePlugin from './lib';

Vue.use(VueStickyBubblePlugin);

export default {
  name: 'app',
  methods: {
    tapHandler() {
      // Handle tap
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #41B883;
  margin-top: 60px;
  position: relative;
  border: 5px solid #375B64;
  margin-left: auto;
  margin-right: auto;
  height: 300px;
  width: 800px;
}
</style>
