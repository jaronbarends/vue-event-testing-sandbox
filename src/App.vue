<template>
  <div id="app">
    <event-testing-sandbox />
  </div>
</template>

<script>
import EventTestingSandbox from "./components/EventTestingSandbox.vue";

export default {
  name: "App",
  components: {
    EventTestingSandbox,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
