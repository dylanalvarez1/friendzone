<template>
<div>
  <div class="grid-container">
    <div class="grid-item item1">
      <div class="box">
        <h4>Register your group</h4>

        <div>
          <p>Icon Preview</p>
          <div id="groupList" key="groupName" class="container">
            <img id="groupIcon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg" alt="Avatar" class="image groupPic" style="width:100%">
            <div class="middle iconLabel">
              <div id="iconLabel" class="text">
                {{groupName}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <table>
        <tr>
          <td><label id="grp-name">Group Name</label></td>
          <td><input v-model="groupName" @change="onNameChanged" type="text"></td>
        </tr>

        <tr>
          <td><label id="grp-desc">Description</label></td>
          <td><textarea v-model="groupDescription" @change="onDescChanged" style="height: 200px"></textarea></td>
        </tr>

        <tr>
          <td><label id="grp-img">Picture Upload</label></td>
          <td><input type="file" @change="onFileChanged"></td>
        </tr>

        <tr>
          <td></td>
          <td><img id="pic" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg" style="height: 100px; width: 100px"/></td>
        </tr>

        <tr>
          <td>
            <p id="status" style="display: none; font-size: 15px;float: right; color: red; padding: 0; margin: 0;"></p>
          </td>
          <td><button @click="onFormSubmission()" style="width: 100%">Register Group</button></td>
        </tr>
      </table>

    </div>




  </div>
</div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'groupRegistration',
  data: function() {
    return {
      uid: firebase.auth().currentUser.uid,
      groupName: "",
      groupDescription: "",
      groupPicture: new file(),
      attemptedSubmission: false,
      group_ref:"",
      group_key:"",
      room_ref:"",
      room_key:""
    }
  },
  methods: {
    onFileChanged: function(input) {
      //name
      //Konachan_com___238107_2girls_blue_eyes_braids_cevio_ia_kneehighs_long_hair_one__cevio__pink_hair_short_hair_skirt_sotsunaku_thighhighs_vocal
      this.groupPicture = input.target.files[0];
      //this.groupPicture.name = "profilePicture" + this.groupPicture.name.substr(this.groupPicture.name.indexOf("."));
      this.isValid();
      console.log(this.groupPicture);
      const reader = new FileReader();
      reader.onload = e => {
        document.getElementById("pic").src = e.target.result;
        document.getElementById("groupIcon").src = e.target.result;
      }
      reader.readAsDataURL(this.groupPicture);
    },

    onNameChanged: function() {
      document.getElementById("iconLabel").innerText = this.groupName;
      this.isValid();
    },

    onDescChanged: function() {
      this.isValid();
    },

    onFormSubmission: function() {
      //for logical purposes. Avoid showing the user Red Text until they mess up.
      this.attemptedSubmission = true;

      //input verification
      if (!this.isValid()) return;


      // alert("form \"submitted\"");
      // const groupID = this.createGid();
      // const roomID = groupID;

      // //intialize the group
      // const newGroup = {
      //   description: this.groupDescription,
      //   groupID: groupID,
      //   iconURL: iconUrl,
      //   members: [],
      //   moderators: [],
      //   ownerID: firebase.auth().currentUser.email.replace(".",""),
      //   roomID: roomID
      // };
      //
      //
      // //initialize the room
      // const newRoom = {
      //   furnitures: {},
      //   isGroupRoom: true,
      //   ownerID: groupID,
      //   roomID: roomID,
      //   title: `${this.groupName}'s Room`
      // };
      //
      //
      //
      // console.log(newGroup);
      // console.log(newRoom);
       this.group_ref=firebase.database().ref('groups').push();
       this.group_key=this.group_ref.key;
      this.room_ref=firebase.database().ref(`rooms/${this.group_key}`);
      this.room_key=this.group_key;
      const iconUrl = this.uploadPicture();



      this.group_ref.set({
        description: this.groupDescription,
        title: this.groupName,
        groupID: this.group_key,
        iconURL: iconUrl,
        members: [firebase.auth().currentUser.uid],
        moderators: [firebase.auth().currentUser.uid],
        ownerID: firebase.auth().currentUser.uid,
        roomID: this.room_key
      })
      this.room_ref.set({
        furnitures: {},
        group: true,
        owner: this.group_key,
        uid: this.room_key,
        title: `${this.groupName}'s Room`
      }).then(() => {
        let group_key=this.group_key;
        let current_user_group_data_ref=firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('groups');
        let current_user_group_data=[];

        current_user_group_data_ref.once('value').then(function(snapshot){
          snapshot.forEach(function(child){
            current_user_group_data.push(child.val());
          });
          current_user_group_data.push(group_key);
          current_user_group_data_ref.set(current_user_group_data);
        }).then(()=>{
          this.$router.push({path:`/group/${group_key}`});
        });

        // current_user_group_data.push(this.group_key);
        // firebase.database().ref('users').child('groups').set(current_user_group_data);
        });
    },
//https://firebasestorage.googleapis.com/v0/b/friendzone-4930.appspot.com/o/images%2FKonachan_com___238107_2girls_blue_eyes_braids_cevio_ia_kneehighs_long_hair_one__cevio__pink_hair_short_hair_skirt_sotsunaku_thighhighs_vocaloid_1818x1358.jpg?alt=media&token=d4411814-ae75-4612-a591-50b7b309fae9
    uploadPicture: function() {
      const storageRef = firebase.storage().ref();
      const fullpath = `images/groups/${this.group_key}/profilePicture/${this.groupPicture.name}`;
      const uploadTask = storageRef.child(fullpath).put(this.groupPicture);
      uploadTask.on('state_changed',
        snapshot => {},
        err => console.log(err),
        () => console.log('successfully uploaded'));
      return fullpath;
    },



    //This function checks to see if name, desc, and file exists, and that the file is an image file.
    isValid: function() {
      if (!this.attemptedSubmission) return;

      let valid = this.groupName && this.groupDescription && this.groupPicture && this.groupPicture.type.split("/")[0] === 'image';
      const status = document.getElementById("status");
      if (!valid) {
        status.style.display = "block";
        status.innerText = "Missing fields / invalid entries"
      } else {
        status.style.display = "none";
      }
      if (!this.groupName) document.getElementById("grp-name").style.color = "red";
      else document.getElementById("grp-name").style.color = "initial";

      if (!this.groupDescription) document.getElementById("grp-desc").style.color = "red";
      else document.getElementById("grp-desc").style.color = "initial";

      if (!this.groupPicture || this.groupPicture.type.split("/")[0] !== 'image') document.getElementById("grp-img").style.color = "red";
      else document.getElementById("grp-img").style.color = "initial";

      return valid;
    }
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
