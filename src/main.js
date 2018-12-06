// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import A11yDialog from 'vue-a11y-dialog'

Vue.use(A11yDialog)
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
  // this.$emit("user_change",firebase.auth().currentUser);

  if(!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      // render:h=>h(app),
      components: { App },
      template: '<App/>'
    })//.$mount('#app');
  }
});



