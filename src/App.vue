<template>
  <div id="app">
    <ul class="navbox">
      <li><router-link to="/about">About</router-link></li>
      <li><router-link to="/search">Search</router-link></li>
      <li><router-link to="/home">Home</router-link></li>
    </ul>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.navbox ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.navbox li {
  display: inline;
  padding: 10px;
  float: right;
}
</style>
