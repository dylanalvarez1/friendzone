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
  apiKey: "AIzaSyAyfUqqoHVR-wHgS4DL9_M_3IaOIw5wJ3g",
  authDomain: "friendzone-3ffa2.firebaseapp.com",
  databaseURL: "https://friendzone-3ffa2.firebaseio.com",
  projectId: "friendzone-3ffa2",
  storageBucket: "friendzone-3ffa2.appspot.com",
  messagingSenderId: "97024283244"
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



