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
        <div class="form-group">
          <input type="password"
                 class="form-control register-input"
                 placeholder="Password"
                 v-model="password"
                 @keyup.enter="signUp">
        </div>
        <!--<div>-->
          <!--User Icon-->
        <!--<input type="file"  @change="onFileSelected">-->
        <!--</div>-->
        <br>
      </form>
      <button @click="signUp" type="submit" class="btn btn-warning">Sign Up</button>
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
        username: '',
        // selectedFile: null
      }
    },
    methods: {
      // onFileSelected(event){
      //   this.selectedFile=event.target.files[0]
      // },
      signUp: function () {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            console.log("User id: " + this.email);
            const user_uid=user.user.uid;
            const room_uid=uuidv4();

            // let iconRef = firebase.storage().ref().child('userIcons').child(user_uid).child(this.selectedFile.name);
            let photoURL="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg";

            // if(this.selectedFile!=null){
            //   iconRef.put(this.selectedFile).then(function(snapshot){
            //     // console.log(snapshot)
            //     photoURL=snapshot.ref.getDownloadURL();
            //   }
            //   )
            // }


              firebase.database().ref('rooms/' + room_uid).set({
                uid: room_uid,
                title: this.username + "'s room",
                owner: user_uid,
                group: false,
                // furniture:
              });
              firebase.database().ref('users/' + user_uid).set({
                uid: user_uid,
                displayName: this.username,
                email: this.email,
                photoURL: photoURL,
                admin: false,
                // followers: [],
                // groups: [],
                roomId: room_uid
              });
            this.$router.push({ path: `/home/` });


              // this.$emit("log_in");

          },
          (err) => {
            alert('Oops. ' + err.message);
          }
        );
      }
    }
  }

  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
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
    color: black;
  }

</style>
