<template>
  <div id="background">
    <h1 id="title">Search for a user or group:</h1>
    <hr>
    <div class="container" style="display: inline; float: left; width: 100%; margin-top: 50px;">
      <button @click="createGroup">Register a new group</button>
      <input placeholder="Search" v-model="query" @input="queryDatabase" @click="queryIfEmpty" @keyup.enter="queryDatabase"/>
      <select @change="queryDatabase" v-model="selected">
        <option selected value="">No filter</option>
        <option value="users">Users</option>
        <option value="groups">Groups</option>
      </select>
      <p v-if="!checked">Grid View</p>
      <p v-else>Table View</p>
      <!-- Rounded switch -->
      <label class="switch">
        <input type="checkbox" id="checkbox" v-model="checked">
        <span class="slider round"></span>
      </label>
    </div>
    <br>

    <div id="resultSet">
      <h1 v-if="results != []" style="color: white;">Results:</h1>
      <div v-if="!checked">
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
              {{group.title}}
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <table style="width:100%">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Type</th>
          <th>Icon</th>
        </tr>
          <tr v-for="user in users" :key="user.uid" @click="goToUserPage(user.uid)">
            <td>{{user.displayName}}</td>
            <td>{{user.email}}</td>
            <td>User</td>
            <td><img id="icon" :src="user.photoURL" alt="Avatar" class="image friendPic"></td>
          </tr>
          <tr v-for="group in groups" :key="group.groupID" @click="goToGroupPage(group.groupID)">
            <td>{{group.title}}</td>
            <td>{{group.description}}</td>
            <td>Group</td>
            <td><img id="icon" :src="group.iconURL" alt="Avatar" class="image friendPic"></td>
          </tr>
        </table>
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
        checked: false,
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
      queryIfEmpty: function() {
        console.log("queyr if empty: ", this.query);
        if (this.query == "") this.queryDatabase();
      },
      queryDatabase: function() {
        this.results = [];
        this.users = [];
        this.groups = [];

        console.log("selected: ", this.selected);
        if(this.query != "") {
          if(this.selected == "") {
            firebase.database().ref('/groups/').orderByChild("title").startAt(this.query).endAt(`${this.query}\uf8ff`).once('value').then((snapshot) => {
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

            firebase.database().ref('/users/').orderByChild("displayName").startAt(this.query).endAt(`${this.query}\uf8ff`).once('value').then((snapshot) => {
              let response = snapshot.val();
              this.users = response;
              console.log("this.users: ", this.users);
            });
          }
          else if(this.selected == "groups") {
            firebase.database().ref('/groups/').orderByChild("title").startAt(this.query).endAt(`${this.query}\uf8ff`).once('value').then((snapshot) => {
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
            firebase.database().ref('/users/').orderByChild("displayName").startAt(this.query).endAt(`${this.query}\uf8ff`).once('value').then((snapshot) => {
              let response = snapshot.val();
              this.users = response;
              console.log("this.users: ", this.users);
            });
          }
        }
        else {
          if(this.selected == "") {
            firebase.database().ref('/groups/').orderByChild("title").startAt(this.query).endAt(`${this.query}\uf8ff`).once('value').then((snapshot) => {
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

            firebase.database().ref('/users/').orderByChild("displayName").startAt(this.query).endAt(`${this.query}\uf8ff`).once('value').then((snapshot) => {
              let response = snapshot.val();
              this.users = response;
              console.log("this.users: ", this.users);
            });
          }
          else if(this.selected == "groups") {
            firebase.database().ref('/groups/').orderByChild("title").startAt(this.query).endAt(`${this.query}\uf8ff`).once('value').then((snapshot) => {
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
            firebase.database().ref('/users/').orderByChild("displayName").startAt(this.query).endAt(`${this.query}\uf8ff`).once('value').then((snapshot) => {
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

  #title {
    text-align: center;
  }

  #background {
    position: absolute;
    height: 100%;
    width: 98.9%;

  }



  .container {
    position: relative;
    padding-top: 100px;
    display: inline;
  }

  .container button {
    margin-right: 15%;
    margin-left: 5%;
    height: 30px;
    display: inline-block;

  }

  .container input {
    height: 30px; width: 30%;
    margin-right: 5%;
    display: inline-block;
  }

  .container #checkbox {
    margin-right: 5% !important;
  }

  .container p {
    display: inline-block;
  }

  .container select {
    margin-right: 5%;
    display: inline-block;
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

 /* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 22px;
  margin-left: 4px;

}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 15px;
  width: 15px;
  left: 4px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: black;
}

input:focus + .slider {
  box-shadow: 0 0 1px black;
}

input:checked + .slider:before {
  -webkit-transform: translateX(27px);
  -ms-transform: translateX(27px);
  transform: translateX(27px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

tr:nth-child(even) {background-color: #f2f2f2;}

tr:hover {background-color: yellow;}

th, td {
    border-bottom: 1px solid #ddd;
    padding: 15px;
    text-align: left;
}

th {
    background-color: #4CAF50;
    color: white;
}
</style>
