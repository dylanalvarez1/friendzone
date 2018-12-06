<template>
  <div class="groupProfile" id="root_group_div">
    <div class="grid-container">
      <div class="grid-item item1" @click="joinGroup(group.groupID)">
        <div >
          <img src="../assets/logo.png" style="width: 50px; height: 50px"/>
          <p>{{group_status}}</p>
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
        <div v-if="group">
          <h2>{{this.group.title}}</h2>
          <img :src="group.iconURL" alt="No group icon" style="max-height:300px; max-width:300px;"/><br>
          <p>{{this.group.description}}</p>
        </div>
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
    <a11y-dialog
      id="main-dialog"
      app-root="#root_group_div"
      @dialog-ref="assignDialogReference"
      :class-names="{}"
    >

      <h1 style="color: #ff7895" slot="title">WARMING</h1>
      <div>
        You are the owner of this group. You leaving the group will disband the group, do you want to proceed?
      </div>
      <div>
        <button type="button" data-a11y-dialog-hide="main-dialog" v-on:click="disband_group" aria-label="Close the dialog">Proceed</button>
      </div>
      <span slot="closeButtonContent">
        Cancel
      </span>
    </a11y-dialog>
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
      owner: undefined,
      params: "",
      group_status:"join group",
      dialog: null
    }
  },
  components: {
      Icon,
    },
  methods: {
    disband_group:function(){
      alert('disbanding');
      let group_id=this.group.groupID;
      this.members.forEach(member=>{
        let individual_member_ref=firebase.database().ref().child(`users/${member.uid}`);
        individual_member_ref.once('value').then(snapshot=>{
          let user=snapshot.val();
          if(user.hasOwnProperty('groups')){
            if(user.groups.includes(group_id)) {
              user.groups.splice(user.groups.indexOf(group_id), 1);
            }
          }
          individual_member_ref.set(user);
        })
      });
      firebase.database().ref().child(`rooms`).once('value').then(snapshot=>{
        let rooms=snapshot.val();
        Object.keys(rooms).forEach(function(key){
          if(key===group_id){
            firebase.database().ref().child(`rooms`).child(key).remove();
          }
        });
      });
      firebase.database().ref().child(`groups`).once('value').then(snapshot=>{
        let groups=snapshot.val();
        Object.keys(groups).forEach(function(key){
          if(key===group_id){
            firebase.database().ref().child(`groups`).child(key).remove();
          }
        });
      })
      .then(()=>{
        let space = firebase.auth().currentUser.uid;
        this.$router.push({ path: `/home/${space}` });
      });
    },
    assignDialogReference(dialog) {
      this.dialog = dialog
    },

    openMainDialog() {
      if (this.dialog) {
        this.dialog.show()
      }
    },
    joinGroup: function(groupID) {
      // alert('Joined '+groupName);

      if(this.owner===firebase.auth().currentUser.uid){
        this.openMainDialog();
      }else {
        let group_member_ref=firebase.database().ref().child(`groups/${groupID}/members`);
        let current_user_ref=firebase.database().ref().child(`users/${firebase.auth().currentUser.uid}/groups`);
        let current_group_member_data = [];
        let user_uid = firebase.auth().currentUser.uid;
        group_member_ref.once('value').then(function (snapshot) {
          snapshot.forEach(function (child) {
            current_group_member_data.push(child.val());
          });
          if (current_group_member_data.includes(user_uid)) {
            current_group_member_data.splice(current_group_member_data.indexOf(user_uid), 1);
          } else {
            current_group_member_data.push(user_uid);
          }
          group_member_ref.set(current_group_member_data);
        });
        let current_user_group_data = [];

        current_user_ref.once('value').then((snapshot) => {
          snapshot.forEach(function (child) {
            current_user_group_data.push(child.val());
          });
          if (current_user_group_data.includes(groupID)) {
            current_user_group_data.splice(current_user_group_data.indexOf(groupID), 1);
          } else {
            current_user_group_data.push(groupID);
          }
          current_user_ref.set(current_user_group_data);
        });

        if (this.group_status === "join group") {
          this.group_status = "leave group";
        } else if (this.group_status === "leave group") {
          this.group_status = "join group";
        }
        this.getGroupById(groupID);
      }

    },
    goToRoom: function(groupID) {
      // alert("Now entering " + name + "'s room");
      this.$router.push({ path: `/room/${groupID}` });

    },
    goToFollowedPage: function(name) {
      this.$router.push({ path: `/home/${name}` });
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

      //console.log("route params:", this.$route.params.id);

      this.params = this.$route.params.id;


      //This is when you visit another profile, there is a path param in the route
      //console.log("In getGroup call with route params");
      //console.log("params to be passed: ", this.params);
      const groupId = this.params;
      //console.log("groupId", groupId);
      this.getGroupById(groupId);




    },

    getGroupById: function (groupId) {
      ///console.log("groupId", groupId);
      firebase.database().ref('/groups/' + groupId).once('value').then((snapshot) => {
       // console.log("Inside getgroupbyid firebase call");
        //console.log(snapshot.val());
        let temp= snapshot.val();
        //console.log("temp", temp);
        // let storage = firebase.storage();

        // Create a storage reference from our storage service
        // let storageRef = storage.ref();

        // Create a child reference
        // var imagesRef = storageRef.child('images');
        // imagesRef now points to 'images'
        //console.log("part 2");
        //console.log(temp.iconURL);
        // Child references can also take paths delimited by '/'
        var spaceRef = firebase.storage().ref().child(temp.iconURL);
        // spaceRef now points to "images/space.jpg"
        // imagesRef still points to "images"

        spaceRef.getDownloadURL().then((url) => {
            // let test = url;
            //console.log("url", url);
            temp.iconURL = url;
            //console.log("temp", temp);
            this.group = temp;

        }).catch(function(error) {

        }).then(() => {

            this.members = []; //empty the array before filling it with user info
            this.admins = [];
            this.owner="";
            if(this.group.hasOwnProperty('ownerID')){
              this.owner=this.group.ownerID;
            }
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
            //console.log("end of big statement");

        });
      });





    },

    alterGroupStatus: function(){
      let group_member_ref=firebase.database().ref().child(`groups/${this.params}/members`);
      let current_group_member_data=[];
      let user_uid=firebase.auth().currentUser.uid;
      group_member_ref.once('value').then(snapshot=> {

        snapshot.forEach(function (child) {
          current_group_member_data.push(child.val());
        });
        if(current_group_member_data.includes(user_uid)){
          this.group_status=("leave group");
        }else {
          this.group_status=("join group");
        }
        group_member_ref.set(current_group_member_data);
      });

    }

  },

 mounted: function() {
    this.getGroup();
    this.alterGroupStatus();
  },

  watch: {
    '$route.params.id': function (id) {
      //console.log("In watched for param: ", id);
      this.params = id;
      this.getGroup();
      this.alterGroupStatus();

    }
  },

  beforeRouteUpdate (to, from, next) {
    const groupId = to.params.id;
    //console.log("BeforeRouteUpdate:", to.params.id);
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
 #root_group_div {
   font-family: 'Avenir', Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
   color: #2c3e50;
   margin-top: 60px;
 }

</style>
