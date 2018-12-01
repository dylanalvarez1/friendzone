<template>
  <body id="newinfo">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/paper/bootstrap.min.css">
  <div class="container">
    <div class="row">
      <br>
      <h2>Log In</h2>
    </div>
    <br><br><br>
    <div class="col-md-4"></div>
    <div class="col-md-4">
      <form>
        <div class="form-group">
          <input type="text"
                 id="addListingUsername"
                 class="form-control register-input"
                 placeholder="Username"
                 v-model="email">
        </div>
        <br><br><br>
      </form>
      <form>
        <div class="form-group">
          <input type="text"
                 id="addListingCode"
                 class="form-control register-input"
                 placeholder="Full Name"
                 v-model="password">
        </div>
        <br><br><br>
      </form>
      <br><br><br><br><br><br>
      <button type="submit" class="btn btn-warning" v-on:click="signIn">Log In</button>
      <br><br><br><br><br>
      <p>You don't have an account?
        <router-link to="/sign-up">You can create one</router-link>
      </p>
      <br><br><br><br><br><br>
    </div>
    <div class="col-md-4"></div>
  </div>
  </body>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'login',
    data: function () {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      signIn: function () {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            // this.$emit("log_in");
            this.$router.replace('home');
          },
          (err) => {
            alert('Oops. ' + err.message);
          }
        )
      }
    }
  }
</script>

<style scoped>
  h2 {
    text-align: center;
    color: #ff7895;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }

  .btn-warning {
    background-color: #ff95bb;
  }

  label {
    color: #ff7895;
  }

  body {
    background-image: url("../assets/123.jpg");
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

  }

  input[type="text"]::-webkit-input-placeholder {
    color: #ff7895 !important;
  }

  input[type="text"]:-moz-placeholder {
    color: #ff7895 !important;
  }

  input[type="text"]::-moz-placeholder {
    color: #ff7895 !important;
  }

  input[type="text"]:-ms-input-placeholder {
    color: #ff7895 !important;
  }

  .register-input {
    color: #ff7895;
  }
</style>
