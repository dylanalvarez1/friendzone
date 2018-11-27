<template>
  <div id="app">
    <NavBar v-if="user" @loggedIn="login"></NavBar>
    <router-view @loggedIn="login" />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
export default {
  name: 'App',
  components: {
    NavBar
  },
  data: function() {
      return {
       user : false,
      }
    },
  methods: {
    login: function(bool) {
      console.log("In logged in");
      this.user = bool;
    }
  },

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

}

</style>
