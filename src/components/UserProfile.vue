<template>
<div>
  <div class="grid-container">
    <div class="grid-item item1">
      <div @click="followUser(user.displayName)">
        <img src="../assets/logo.png" style="width: 50px; height: 50px"/>
        <p>Follow</p>
      </div>
    </div>
    <div class="grid-item item4">
      <div @click="goToRoom(user.displayName)">
        <img src="../assets/logo.png" style="width: 50px; height: 50px;"/>
        <p>Go to room</p>
      </div>
    </div>
    <div v-if="user" class="grid-item item2">
      <h2 v-if="user.displayName">{{this.user.displayName}}</h2>
      <p v-if="user.email">{{this.user.email}}</p>
      <img v-if="user.photoURL" :src="user.photoURL" /><br>
    </div>
    <div class="grid-item item3">
      <div><p id="friendLabel">Following:</p>
          <div id="friendList" v-for="friend in friends" :key="friend.displayName" class="container" @click="goToFollowedPage(friend.uid)">
            <Icon :url="friend.photoURL" :label="friend.displayName"></Icon>
          </div>
      </div>
      <div><p id="groupLabel">Groups:</p>
          <div id="groupList" v-for="group in groups" :key="group.groupID" class="container" @click="goToGroupPage(group.groupID)">
            <Icon :url="group.iconURL" :label="group.groupID"></Icon>
          </div>
      </div>

    </div>
  </div>
</div>

</template>

<script>
import firebase from 'firebase'
import Icon from '@/components/Icon'
  export default {
    name: 'login',
    data: function() {
      return {
       user : {
         "photoURL": "",
         "displayName": "",
         "email": "",
         "friends": [],
         "groups": [],
       },
       friends: [],
       groups: [],
       params: undefined,

      }
    },
    props: ['username'],
    components: {
      Icon,
    },
    methods: {
      goToUserPage: function(name) {
        alert("Go to " + name + "'s room?");
      },
      goToFollowedPage: function(name) {
        console.log("name", name);
        this.$router.push({ path: `/home/${name}` });
      },
      goToGroupPage: function(name) {
        alert(name);
      },
      followUser: function(name) {
        alert("Follow " + name + "?");
      },
      goToRoom: function(name) {
        alert("Now entering " + name + "'s room");
      },

      getUser: function() {
        //Gets the correct user by checking if there is a router param and then calls getUserById (firebase call)

        //console.log("route params:", this.$route.params.username);


        if(this.params != undefined && this.params != " ") {
          //This is when you visit another profile, there is a path param in the route
          console.log("In getUser call with route params");
          const userId = this.params.replace(".","");
          console.log("userId", userId);
          this.getUserById(userId);
        }

        else {
          //default call with no router params
          console.log("In getUser call where there is no route params");
          const userId = firebase.auth().currentUser.uid;
          console.log("userId", userId);
          this.getUserById(userId);
        }

      },

      getUserById: function (userId) {
        firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
            this.user = snapshot.val();
            //console.log(this.user);
            //console.log(this.user.following);

          }).then(() => {
              this.friends = []; //empty the array before filling it with user info
              this.groups = [];
              this.user.following.forEach(friend => {
                let tempId = friend.replace(".","");
                firebase.database().ref('/users/' + tempId).once('value').then((snapshot) => {
                this.friends.push(snapshot.val());

                });

              });

              this.user.groups.forEach(group => {
                console.log("for each group:")
                let tempId = group.replace(".","");
                firebase.database().ref('/groups/' + tempId).once('value').then((snapshot) => {
                  let temp = snapshot.val();
                  console.log("Group: ", temp);
                  // Get a reference to the storage service, which is used to create references in your storage bucket
                  let storage = firebase.storage();

                  // Create a storage reference from our storage service
                  let storageRef = storage.ref();

                  // Create a child reference
                  var imagesRef = storageRef.child('images');
                  // imagesRef now points to 'images'

                  // Child references can also take paths delimited by '/'
                  var spaceRef = storageRef.child(temp.iconURL);
                  // spaceRef now points to "images/space.jpg"
                  // imagesRef still points to "images"

                  spaceRef.getDownloadURL().then((url) => {
                      let test = url;
                      console.log("url", url);
                      temp.iconURL = url;
                      console.log("temp", temp);
                      this.groups.push(temp);

                  }).catch(function(error) {

                  });




                });

              });
          });
      }

    },
    mounted: function() {

      this.getUser();
    },
    watch: {
      '$route.params.username': function (username) {
        console.log("In watched for param: ", username);
        if(this.params === " ") {
          //There is no router param so set it equal to who is signed in
        }
        this.params = username;
        this.getUser();

      }
    },
    beforeRouteUpdate (to, from, next) {
      if(to.params) {
        if(to.params.username === " ") {
          //If the route param is empty
          console.log("Param is a space!")
          this.params = " ";
          next();
        }
        else {
          const userId = to.params.username.replace(".","");
          console.log("BeforeRouteUpdate:", to.params.username);
          this.params = userId;
           next();
        }


      }
    },
  }
</script>

<style scoped>
  .profile {
    text-align: center;
  }

  #friendList {
    display: inline-block;
    padding: 15px;
  }

  #groupList {
    display: inline-block;
    padding: 15px;
  }

  .container {
    position: relative;
    width: 5%;
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

  .active {
      background-color: #4CAF50;
  }


  .grid-container {
    display: grid;
    grid-gap: 10px;
    background-color: #2196F3;
    padding: 10px;
    align-content: center;
    grid-template-columns: 250px;

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
    cursor: pointer;
  }
  .item1:hover {
     background-color: rgba(152, 170, 206, 0.925);
  }
  .item2 {
    grid-column: 2 / span 3;
    grid-row: 1 / span 2;

  }
  .item3 {
    grid-column: 1 / span 4;
    grid-row: 3;
    text-align: left !important;
  }
  .item4 {
    grid-column: 1;
    grid-row: 2;
    vertical-align: middle !important;
    cursor: pointer;
  }
  .item4:hover {
     background-color: rgba(152, 170, 206, 0.925);
  }


</style>
