<template>
  <body>



  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">


  <div class="w3-bar w3-light-grey w3-border w3-large">

    <ul>

      <li style="float:left"><a>FRIEND ZONE <i class="fa fa-globe"></i></a></li>

      <li style="float:left" @click="toRoom"><a>My Room <i class="fa fa-home"></i></a></li>

      <li style="float:left"><a href="#home">Search <i class="fa fa-search"></i></a></li>

      <li style="float:left" @click="toProfile"><a href="#hello">Profile <i class="glyphicon glyphicon-user"></i></a></li>

      <li style="float:right" @click="logout"><a>Logout <i class="fa fa-sign-in"></i></a></li>

    </ul>

  </div>
  </body>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'NavBar',
    data: function () {
      return {}
    },
    methods: {
      logout: function () {
        firebase.auth().signOut().then(() => {
          this.$emit("loggedIn", false);
          this.$router.replace('login');
        });
      },
      toProfile: function () {
        console.log("To home!");
        this.$router.replace('hello');
      },
      toRoom: function () {
        console.log("To home!");
        this.$router.replace('home');

      }

    },

  }
</script>

<style scoped>

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #171717;
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
    background-color: #306ba3;
  }


</style>

