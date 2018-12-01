<template>
  <body id="newinfo">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/paper/bootstrap.min.css">
  <div class="container">
    <div class="row">
      <br><br>
      <h2>Sign Up</h2>
    </div>
    <br><br><br>
    <div class="col-md-4"></div>
    <div class="col-md-4">
      <form>
        <div class="form-group">
          <input type="text"
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
                 class="form-control register-input"
                 placeholder="Username"
                 v-model="username">
        </div>
        <div class="form-group">
          <input type="text"
>>>>>>> Stashed changes
                 class="form-control register-input"
                 placeholder="Username"
                 v-model="username">
        </div>
        <div class="form-group">
          <input type="text"
>>>>>>> Stashed changes
                 class="form-control register-input"
                 placeholder="Username"
                 v-model="username">
        </div>
        <div class="form-group">
          <input type="text"
                 class="form-control register-input"
                 placeholder="Email"
                 v-model="email">
        </div>
        <br><br><br>
      </form>
      <form>
        <div class="form-group">
          <input type="password"
                 class="form-control register-input"
                 placeholder="Password"
                 v-model="password">
        </div>
        <br><br><br>
      </form>
      <button type="submit" class="btn btn-warning">Sign Up</button>
      <br><br><br>
      <span style="color: black">Or go back to <router-link to="/login">login</router-link></span>
      <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </div>
    <div class="col-md-4"></div>
  </div>
  </body>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'signUp',
    data: function () {
      return {
        email: '',
        password: '',
        username: ''
      }
    },
    methods: {
      signUp: function () {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            console.log(user);
            firebase.database().ref('users/' + user.uid).set({
              username: this.username,
              email: this.email,
              profile_picture : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
            });
            // this.$emit("log_in");
            this.$router.replace('home');
          (err) => {
            alert('Oops. ' + err.message);
          }}
        );
      }
    }
  }
</script>

<style scoped>
  h2 {
    text-align: center;
    color: black;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }

  .btn-warning {
    background-color: black;
  }

  label {
    color: #ff7895;
  }

  body {
    background-image: url("../assets/232.jpg");
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

  }

  input[type="text"]::-webkit-input-placeholder {
    color: black !important;
  }

  input[type="password"]::-webkit-input-placeholder {
    color: black !important;
  }

  input[type="password"]::-moz-placeholder {
    color: #ff7895 !important;
  }

  input[type="text"]:-ms-input-placeholder {
    color: #ff7895 !important;
  }

  .register-input {
    color: #ff7895;
  }
</style>
