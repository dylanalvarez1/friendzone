// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

// Initialize Firebase
let app;
var config = {
  apiKey: "AIzaSyBgk6vasRQOAdt_mX3qVfQUWy9JOQwu_FM",
  authDomain: "friendzone-4930.firebaseapp.com",
  databaseURL: "https://friendzone-4930.firebaseio.com",
  projectId: "friendzone-4930",
  storageBucket: "friendzone-4930.appspot.com",
  messagingSenderId: "437470176183"
};

firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
  console.log("on auth state change")
  if(!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
});



