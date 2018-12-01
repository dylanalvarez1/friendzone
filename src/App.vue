<template>
  <div id="app">
    <NavBar v-if="current_user" ></NavBar>
    <!--@log_in="log_in" @log_out="log_out"></NavBar>-->
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import firebase from 'firebase'
export default {
  name: 'App',
  components: {
    NavBar
  },
  data: function() {
      return {
       current_user : null,
      };
    },
  methods: {
    // user_change: function(user) {
    //   current_user=user;
    // },


  },
  created:function(){
    var vm=this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        vm.current_user = user;
      } else {
        vm.current_user = null;
      }
    });
  }


}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

}

.fade-enter-active, .fade-leave-active {
  transition: opacity .4s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}

</style>
