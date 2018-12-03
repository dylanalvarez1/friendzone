<template>
  <div id="background">

    <div class="container" style="display: inline; float: left; width: 100%; margin-top: 50px;">
      <button @click="createGroup">Register a new group</button>
      <input placeholder="Search" v-model="query" @keyup.enter="queryDatabase"/>
      <select v-model="selected">
        <option value="" selected disabled hidden>Choose a filter here</option>
        <option value="none">No filter</option>
        <option value="users">Users</option>
        <option value="groups">Groups</option>
      </select>
    </div>
      <br>

      <div id="resultSet">
        <h1 style="color: white;">Results</h1>
      <div id="resultsList" v-for="user in users" :key="user.uid" class="container" @click="goToUserPage(user.uid)">
        <img id="icon" :src="user.photoURL" alt="Avatar" class="image friendPic">
        <div class="middle iconLabel">
          <div id="iconLabel" class="text">
            {{user.displayName}}
          </div>
        </div>
      </div>
       <div id="resultsList" v-for="group in groups" :key="group.groupID" class="container" @click="goToGroupPage(group.groupID)">
        <img id="icon" :src="group.iconURL" alt="Avatar" class="image friendPic">
        <div class="middle iconLabel">
          <div id="iconLabel" class="text">
            {{group.description}}
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'explore',
    data: function() {
      return {
        username: "",
        uid: "",
        results: [],
        users: [],
        groups: [],
        selected: "",
        query: ""
      }
    },

    methods: {
      //for traversing to each user / groups page
      goToUserPage: function(name) {
        this.$router.push({ path: `/home/${name}` });
      },
      goToGroupPage: function(name) {
        this.$router.push({ path: `/group/${name}` });
      },
      createGroup: function() {
       this.$router.push({ path: `/group-registration/` });
      },
      queryDatabase: function() {
        this.results = [];
        this.users = [];
        this.groups = [];

        console.log("selected: ", this.selected);
        if(this.query != "") {
          if(this.selected == "none") {
            firebase.database().ref('/groups/').orderByChild("title").equalTo(this.query).once('value').then((snapshot) => {
              console.log("group serach");
              let response = snapshot.val();
              console.log(response);

              console.log("right before the for each");
              let newResponse = [];
              Object.entries(response).forEach(group => {
                console.log("response: ", group);
                let temp = group[1];
                console.log("temp before change:", temp);

                this.getDownloadLink(temp.iconURL).then(function (url) {
                  console.log("callback for download link where url is:", url)
                  temp.iconURL = url;
                  console.log("temp2", temp);
                  newResponse.push(temp);
                  return newResponse;
                }).then((newResponse) => {
                  this.groups = response;
                  console.log("this.results: ", this.results);
                });

              });
            });

            firebase.database().ref('/users/').orderByChild("displayName").equalTo(this.query).once('value').then((snapshot) => {
              let response = snapshot.val();
              this.users = response;
              console.log("this.users: ", this.users);
            });
          }
          else if(this.selected == "groups") {
            firebase.database().ref('/groups/').orderByChild("title").equalTo(this.query).once('value').then((snapshot) => {
              console.log("group serach");
              let response = snapshot.val();
              console.log(response);

              console.log("right before the for each");
              let newResponse = [];
              Object.entries(response).forEach(group => {
                console.log("response: ", group);
                let temp = group[1];
                console.log("temp before change:", temp);

                this.getDownloadLink(temp.iconURL).then(function (url) {
                  console.log("callback for download link where url is:", url)
                  temp.iconURL = url;
                  console.log("temp2", temp);
                  newResponse.push(temp);
                  return newResponse;
                }).then((newResponse) => {
                  this.groups = response;
                  console.log("this.results: ", this.results);
                });

              });
            });
          }
          else if(this.selected == "users") {
            firebase.database().ref('/users/').orderByChild("displayName").equalTo(this.query).once('value').then((snapshot) => {
              let response = snapshot.val();
              this.users = response;
              console.log("this.users: ", this.users);
            });
          }
        }
        else {
          if(this.selected == "none") {
            firebase.database().ref('/groups/').orderByChild("title").once('value').then((snapshot) => {
               console.log("group serach");
              let response = snapshot.val();
              console.log(response);

              console.log("right before the for each");
              let newResponse = [];
              Object.entries(response).forEach(group => {
                console.log("response: ", group);
                let temp = group[1];
                console.log("temp before change:", temp);

                this.getDownloadLink(temp.iconURL).then(function (url) {
                  console.log("callback for download link where url is:", url)
                  temp.iconURL = url;
                  console.log("temp2", temp);
                  newResponse.push(temp);
                  return newResponse;
                }).then((newResponse) => {
                  this.groups = response;
                  console.log("this.results: ", this.results);
                });

              });
            });

            firebase.database().ref('/users/').orderByChild("displayName").once('value').then((snapshot) => {
              let response = snapshot.val();
              this.users = response;
              console.log("this.users: ", this.users);
            });
          }
          else if(this.selected == "groups") {
            firebase.database().ref('/groups/').orderByChild("title").once('value').then((snapshot) => {
              console.log("group serach");
              let response = snapshot.val();
              console.log(response);

              console.log("right before the for each");
              let newResponse = [];
              Object.entries(response).forEach(group => {
                console.log("response: ", group);
                let temp = group[1];
                console.log("temp before change:", temp);

                this.getDownloadLink(temp.iconURL).then(function (url) {
                  console.log("callback for download link where url is:", url)
                  temp.iconURL = url;
                  console.log("temp2", temp);
                  newResponse.push(temp);
                  return newResponse;
                }).then((newResponse) => {
                  this.groups = response;
                  console.log("this.results: ", this.results);
                });

              });

            });
          }
          else if(this.selected == "users") {
            firebase.database().ref('/users/').orderByChild("displayName").once('value').then((snapshot) => {
              let response = snapshot.val();
              this.users = response;
              console.log("this.users: ", this.users);
            });
          }
        }

    },
    async getDownloadLink(url) {


        let storage = firebase.storage();

        // Create a storage reference from our storage service
        let storageRef = storage.ref();

        // Create a child reference
        var imagesRef = storageRef.child('images');

        // Child references can also take paths delimited by '/'
        var spaceRef = storageRef.child(url);

        return await spaceRef.getDownloadURL();

    }
  },

    mounted: function() {
      let currentUser = firebase.auth().currentUser;
      //console.log(currentUser);
      this.username = currentUser.email;
      this.uid = currentUser.uid;

    }
  }
</script>

<style scoped>
  #background {
    position: absolute;
    height: 100%;
    width: 98.9%;
    background-color: #2196F3;
  }

  .container {
    position: relative;
    display: inline;
  }

  .container button {
    margin-right: 20%;
    margin-left: 5%;
    height: 30px;
    border-radius: 5px;
  }

  .container input {
    height: 30px; width: 30%;
  }

  .container select {
    margin-left: 5%;
  }

  #resultSet{
    margin-top: 200px;
    margin-left: 10%;
    margin-right: 10%;
  }

  #resultsList {
    display: inline-block;
    padding: 15px;
    margin: 30px;
  }



  .image {
    opacity: 1;
    display: block;
    width: 100px;
    height: auto;
    transition: .5s ease;
    margin-right: 10px;
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

  #iconLabel {
    vertical-align: bottom;
    display: inline-block;
    margin-left: 40px;
    margin-top: 10px;
  }

</style>
