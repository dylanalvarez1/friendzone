<template>
  <div class="groupProfile">
    <div class="grid-container">
      <div class="grid-item item1">
        <div @click="joinGroup(group.groupID)">
          <img src="../assets/logo.png" style="width: 50px; height: 50px"/>
          <p>Join group</p>
        </div>
      </div>
      <div class="grid-item item4">
        <div @click="goToRoom(group.groupID)">
          <img src="../assets/logo.png" style="width: 50px; height: 50px;"/>
          <p>Go to group room</p>
        </div>
      </div>
      <div class="grid-item item5">
        <div @click="customizeGroupProfile(group.groupID)">
          <img src="../assets/logo.png" style="width: 50px; height: 50px;"/>
          <p>Customize page</p>
        </div>
      </div>
      <div class="grid-item item2">
        <h2>{{this.group.groupID}}</h2>
        <img :src="group.iconURL" alt="No group icon"/><br>
        <p>{{this.group.description}}</p>
      </div>
      <div class="grid-item item3">
        <div><p id="memberLabel">Members:</p>
            <div id="memberList" v-for="member in members" :key="member.displayName" class="container" @click="goToFollowedPage(member.uid)">
              <Icon :url="member.photoURL" :label="member.displayName"></Icon>
            </div>
        </div>
        <div><p id="adminLabel">Admins:</p>
            <div id="adminList" v-for="admin in admins" :key="admin.displayName" class="container" @click="goToFollowedPage(admin.uid)">
              <Icon :url="admin.photoURL" :label="admin.displayName"></Icon>
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
  name: 'GroupProfile',
  data () {
    return {
      group: {
        "description" : "",
        "groupID" : "",
        "iconURL" : "",
        "members" : [],
        "moderators" : [],
        "ownerID" : "",
        "roomID" : ""
        },
      members: undefined,
      admins: undefined,
      group: undefined,
      params: "",
    }
  },
  components: {
      Icon,
    },
  methods: {
    joinGroup: function(groupName) {
      alert('Joined '+groupName);
    },
    goToRoom: function(name) {
      alert("Now entering " + name + "'s room");
    },
    customizeGroupProfile: function(groupName) {
      let authorization = "member";
      if(authorization === "admin") {
        alert("You can customize this profile");
      }
      else {
        alert("You cannot edit this profile, this also means you shouldnt see this");
      }
    },
    getGroup: function() {
      //Gets the correct user by checking if there is a router param and then calls getUserById (firebase call)

      console.log("route params:", this.$route.params.id);

      this.params = this.$route.params.id;


      //This is when you visit another profile, there is a path param in the route
      console.log("In getGroup call with route params");
      console.log("params to be passed: ", this.params);
      const groupId = this.params;
      console.log("groupId", groupId);
      this.getGroupById(groupId);




    },

    getGroupById: function (groupId) {
      console.log("groupId", groupId);
      firebase.database().ref('/groups/' + groupId).once('value').then((snapshot) => {
        console.log("Inside getgroupbyid firebase call");
        console.log(snapshot.val());
        let temp= snapshot.val();
        //console.log("temp", temp);
        let storage = firebase.storage();

        // Create a storage reference from our storage service
        let storageRef = storage.ref();

        // Create a child reference
        var imagesRef = storageRef.child('images');
        // imagesRef now points to 'images'
        console.log("part 2");
        console.log(temp.iconURL);
        // Child references can also take paths delimited by '/'
        var spaceRef = storageRef.child(temp.iconURL);
        // spaceRef now points to "images/space.jpg"
        // imagesRef still points to "images"

        spaceRef.getDownloadURL().then((url) => {
            let test = url;
            console.log("url", url);
            temp.iconURL = url;
            console.log("temp", temp);
            this.group = temp;

        }).catch(function(error) {

        }).then(() => {

            this.members = []; //empty the array before filling it with user info
            this.admins = [];
            this.group.members.forEach(member => {
              let tempId = member.replace(".","");
              firebase.database().ref('/users/' + tempId).once('value').then((snapshot) => {
              this.members.push(snapshot.val());
              });
            });

            this.group.moderators.forEach(admin => {
              let tempId = admin.replace(".","");
              firebase.database().ref('/users/' + tempId).once('value').then((snapshot) => {
              this.admins.push(snapshot.val());
              });
            });
            console.log("end of big statement");
            console.log(this.members);
            console.log(this.admins);
            console.log(this.group);
        });
      });





    }

  },

 mounted: function() {
    this.getGroup();
  },

  watch: {
    '$route.params.id': function (id) {
      console.log("In watched for param: ", id);
      this.params = id;
      this.getGroup();

    }
  },

  beforeRouteUpdate (to, from, next) {
    const groupId = to.params.id;
    console.log("BeforeRouteUpdate:", to.params.id);
    this.params = groupId;
    next();
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .profile {
    text-align: center;
  }

  #memberList {
    display: inline-block;
    padding: 15px;
  }

  #adminList {
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

  #memberLabel {
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
    grid-template-rows: 250px;

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
    grid-row: 1 / span 3;

  }
  .item3 {
    grid-column: 1 / span 4;
    grid-row: 4;
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
  .item5 {
    grid-column: 1;
    grid-row: 3;
    vertical-align: middle !important;
    cursor: pointer;
  }
  .item5:hover {
     background-color: rgba(152, 170, 206, 0.925);
  }

</style>
