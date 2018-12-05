<template>
  <div>
    <div class="grid-container">
      <div class="grid-item item1">
        <div class="box">
          <h4>Customize User</h4>
          <div>
            <p>Current Icon</p>
            <div id="groupList"  class="container">
              <img id="groupIcon" :src="currentImageSrc" alt="Avatar" class="image groupPic" style="width:100%">
              <!--<div class="middle iconLabel">-->
                <!--<div id="iconLabel" class="text">-->
                  <!--{{currentUserUid}}-->
                <!--</div>-->
              <!--</div>-->
            </div>
          </div>
        </div>

        <table>
          <tr>
            <td><label id="grp-name">Display Name</label></td>
            <td><input v-model="currentUserDisplayName"  type="text"></td>
          </tr>

          <tr>
            <td><label id="grp-desc">Email</label></td>
            <td><input v-model="currentUserEmail"  type="text"></td>
          </tr>

          <tr>
            <td><label id="grp-img">Icon</label></td>
            <td><input type="file" @change="onFileChanged"></td>
          </tr>

          <tr>
            <td></td>
            <td><img id="pic" :src='currentImageSrc' style="height: 100px; width: 100px"/></td>
          </tr>

          <tr>
            <td>
              <p id="status" style="display: none; font-size: 15px;float: right; color: red; padding: 0; margin: 0;"></p>
            </td>
            <td><button @click="onFormSubmission()" style="width: 100%">Submit Changes</button></td>
          </tr>
        </table>

      </div>




    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
    export default {
        name: "UserCustomization",
      data: function () {
        return {
          uploaded_picture:null,
          currentUserUid:"" ,
          currentUserEmail: "",
          currentUserDisplayName: "",
          currentImageSrc:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
        }
      },
      methods: {
        setEmail: function(){
          let current_user=firebase.auth().currentUser;
        },
        onFileChanged: function(input) {
          //name
          //Konachan_com___238107_2girls_blue_eyes_braids_cevio_ia_kneehighs_long_hair_one__cevio__pink_hair_short_hair_skirt_sotsunaku_thighhighs_vocal
          this.uploaded_picture = input.target.files[0];
          // this.isValid();
          console.log(this.uploaded_picture);
          const reader = new FileReader();
          reader.onload = e => {
            document.getElementById("pic").src = e.target.result;
            document.getElementById("groupIcon").src = e.target.result;
          }
          reader.readAsDataURL(this.uploaded_picture);
        },
        onFormSubmission: function() {
          let user_ref=firebase.database().ref(`users/${this.currentUserUid}`);
          let iconUrl=this.currentImageSrc;
          let router=this.$router;
          let currentUserEmail=this.currentUserEmail;
          let currentUserDisplayName=this.currentUserDisplayName;
          let exit_callback=function(){
            router.push({ path: `/home/${firebase.auth().currentUser.uid}` })
          };
          let iconURLCallback=function(result){
            iconUrl=result;
            let callback=function(user){
              user.email=currentUserEmail;
              user.displayName=currentUserDisplayName;
              return user;
            };

            firebase.auth().currentUser.updateEmail(currentUserEmail).then(()=> {
              user_ref.once('value').then(snapshot=>{
                let user=snapshot.val();
                // user.email=this.currentUserEmail;
                user.photoURL=iconUrl;
                // user.displayName=this.currentUserDisplayName;
                user=callback(user);
                user_ref.set(user);
                exit_callback();

              });
            }).catch(function(error) {
              alert(error);
            });
          };

          if(this.uploaded_picture){
            this.uploadPicture(iconURLCallback)//then(()=>this.updateUser(iconUrl));
          }else{

            let callback=function(user){
              user.email=currentUserEmail;
              user.displayName=currentUserDisplayName;
              return user;
            };
            firebase.auth().currentUser.updateEmail(this.currentUserEmail).then(()=> {
              user_ref.once('value').then(snapshot=>{
                let user=snapshot.val();
                // user.email=this.currentUserEmail;
                user.photoURL=iconUrl;
                // user.displayName=this.currentUserDisplayName;
                user=callback(user);
                user_ref.set(user);
                this.exit_callback();
              });
            }).catch(function(error) {
              alert(error);
            });
          }



        },
        exit_callback:function(){
          this.$router.push({ path: `/home/${firebase.auth().currentUser.uid}` })
        },

        uploadPicture: function(callback) {
          const storageRef = firebase.storage().ref();
          const fullpath = `images/users/${this.currentUserUid}/profilePicture/${this.uploaded_picture.name}`;
          const uploadTask = storageRef.child(fullpath).put(this.uploaded_picture);
          uploadTask.on('state_changed',
            snapshot => {
            snapshot.ref.getDownloadURL().then(function(downloadURL){
              callback(downloadURL);
            })
            },
            err => console.log(err),
            () => console.log('successfully uploaded'));
          // return fullpath;

        },
      },
      mounted: function(){
        this.currentUserUid=firebase.auth().currentUser.uid;
        let user_ref=firebase.database().ref().child(`users/${this.currentUserUid}`);
        user_ref.once('value').then(snapshot=>{
          this.currentUserEmail=snapshot.val().email;
          this.currentUserDisplayName=snapshot.val().displayName;
          if(snapshot.val().hasOwnProperty('photoURL')){
            this.currentImageSrc=snapshot.val().photoURL;
          }
        })

      }
    }
</script>

<style scoped>
  table input,
  table textarea,
  table img,
  table button {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 20px;
    float: left;
    margin-left: 10%;
    width: 500px;
    height: 30px;
    resize: none;
  }

  table img {
    height: 100%;
  }


  table {
    margin-top: 5%;
    margin-left: 10%;
    text-align: right;
    width: auto;
  }

  button {
    margin-top: 15px;
    height: 35px;
    color: white;
    font-size: 20px;
    background-color: #2196F3;
    border: 0;
  }

  button:hover {
    background-color: #1085e2;
  }

  /* Below is CSS imported from UserProfile.vue */
  .profile {
    text-align: center;
  }

  .container {
    position: relative;
    width: 5%;
    margin-left: 47%;

  }

  .image {
    opacity: 1;
    display: block;
    width: 5%;
    height: auto;
    transition: .5s ease;
    backface-visibility: hidden;
  }

  .middle {
    transition: .5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;

  }

  .container:hover .image {
    opacity: 0.3;
  }

  .container:hover .middle {
    opacity: 1;
  }

  .text {
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    padding: 16px 32px;

  }

  #friendLabel {
    vertical-align: top;
    display: inline-block;
    margin-right: 5px;
  }

  #groupLabel {
    vertical-align: top;
    display: inline-block;
    margin-right: 5px;
  }

  #menuIcon1 {
    display: inline-block;
    vertical-align: middle;
  }

  #menuIcon2 {
    display: inline-block;
    vertical-align: middle;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
    position: -webkit-sticky;
    /* Safari */
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

  .active {
    background-color: #4CAF50;
  }


  .grid-container {
    display: grid;
    grid-gap: 10px;
    background-color: #2196F3;
    padding: 10px;
    align-content: center;

  }

  .grid-item {
    background-color: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding: 20px;
    font-size: 30px;
  }

  .item1 {
    grid-column: 1;
    grid-row: 1;
    vertical-align: middle !important;
  }
</style>

