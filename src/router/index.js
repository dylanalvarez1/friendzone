import Vue from 'vue'
import Router from 'vue-router'
import GroupRegistration from '@/components/GroupRegistration'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import UserProfile from '@/components/UserProfile'
import GroupProfile from '@/components/GroupProfile'
import RoomComponent from '@/components/Room'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/hello',
      name: 'HelloWorld',
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
      path: '/home',
      name: 'home',
      component: HelloWorld
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
      path: '/group',
      name: 'group',
      component: GroupProfile
    },
    {
      path: '/room',
      name: 'room',
      component: RoomComponent
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;

  //we use .some() in case there are nested routes
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if(requiresAuth && !currentUser) next('login');
  else next();
})

export default router;
