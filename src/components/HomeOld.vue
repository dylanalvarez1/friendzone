<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h1>Hello {{displayName || "anon"}}!</h1>
    <label>Give yourself a display name:</label>
    <input type="text" v-model="displayName" placeholder="Display Name">
    <button v-on:click="setDisplayName">Set</button>
    <h2>A canvas</h2>
    <canvas
      id="myCanvas"
      width="200"
      height="100"
      style="border: 1px solid #000000;"
    >
    </canvas><br>
    <button v-on:click="logout">Logout</button>
  </div>
</template>

<script>
import firebase from 'firebase'


export default {
  name: 'HelloWorld',
  data () {
    return {
      user: firebase.auth().currentUser,
      msg: 'THIS IS THE FRIENDZONE HOMEPAGE @ /home',
      displayName: firebase.auth().currentUser.displayName
    }
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(()=> {
        this.$router.replace('login');
      })
    },
    setDisplayName: function() {
      this.user.updateProfile({
        displayName: this.displayName
      });
    }
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
