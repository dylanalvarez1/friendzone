<template>
<div>
   <ul id="navbar">
    <li style="float:right" @click="logout"><a>Logout</a></li>
    <li style="float:right" @click="toExplore"><a>Explore</a></li>
    <li style="float:right" @click="toProfile"><a>Profile</a></li>
    <li style="float:right" @click="toRoom"><a>My Room</a></li>
    <li v-if="admin" style="float:right" @click="toAdmin"><a>Manage</a></li>
  </ul>
</div>
</template>

<script>
import firebase from 'firebase'

  export default {
    name: 'NavBar',
    data: function() {
      return {
        admin: false,
      }
    },
    methods: {
      logout: function() {
        firebase.auth().signOut().then(()=> {
          this.$router.push({ path: `/login` });
        });
      },
      toProfile: function() {
        console.log("To home!");
        let space = firebase.auth().currentUser.uid;
        this.$router.push({ path: `/home/${space}` });
      },
      toRoom: function() {
        console.log("To room!");
        this.$router.push({ path: `/room/${firebase.auth().currentUser.uid}` });
      },
      toAdmin: function() {
        console.log("To admin!");
        this.$router.push({ path: `/admin/` });
      },
      toExplore: function() {
        console.log("To explore!");
        this.$router.push({ path: `/explore` });
      },
      toGroup: function() {
        this.$router.push({ path: `/group` });
      },

      getUserById: function(userId) {
        firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
          let response = snapshot.val();
          console.log(snapshot.val());

          if(response.admin) {
            this.admin = true;
          }


        });

    },

    },
    mounted: function() {
      this.getUserById(firebase.auth().currentUser.uid);
    }

  }
</script>

<style scoped>

ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
}

li {
    float: left;
    border-right: 1px solid #bbb;
}

li:first-child {
    border-right: none;
}

li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    cursor: pointer;
}

li a:hover:not(.active) {
    background-color: #111;
}


</style>
