<template>
  <div>
<h1>TODO: This is /about</h1>
<h3>{{user}}</h3>
</div>
</template>

<script>
import firebase from 'firebase'


export default {
  name: 'About',
  data () {
    return {
      user: firebase.auth().currentUser
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
