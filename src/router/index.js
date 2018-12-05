import Vue from 'vue'
import Router from 'vue-router'
import Explore from '@/components/Explore'
import GroupRegistration from '@/components/GroupRegistration'
import UserCustomization from '@/components/UserCustomization'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import UserProfile from '@/components/UserProfile'
import GroupProfile from '@/components/GroupProfile'
import RoomComponent from '@/components/Room'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '*',
      redirect: '/home/:userID?'
    },
    {
      path: '/',
      redirect: '/home/:userID?'
    },
    {
      path: '/home/:userID?',
      name: 'Home',
      component: UserProfile,
      meta: {
        requiresAuth: true
      }

    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/group-registration',
      name: 'Group Registration',
      component: GroupRegistration,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user-customization',
      name: 'User Customization',
      component: UserCustomization,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/explore',
      name: 'Explore',
      component: Explore,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/group/:id',
      name: 'group',
      component: GroupProfile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/room/:ownerID',
      name: 'room',
      component: RoomComponent,
      meta: {
        requiresAuth: true
      },
    }
  ]
})

router.beforeEach((to, from, next) => {

  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  //we use .some() in case there are nested routes

  if(!currentUser && (to.path === '/login'||to.path==='/sign-up' )){
    next();
  }else if(!currentUser && requiresAuth){
    next(`/login`);
  }else if(currentUser && to.path==='/home'){
    next(`/home/${currentUser.uid}`);
  }
  //  else if(requiresAuth&&currentUser) {
  //   // next(`/home/${currentUser.uid}`);
  //   next();
  // }
  else {
    next();
      // next(`/home/${currentUser.uid}`);

  }
})

export default router;
