<template>
  <div class="groupProfile">
    <div class="grid-container">
      <div class="grid-item item1">
        <div @click="joinGroup(groupName)">
          <img src="../assets/logo.png" style="width: 50px; height: 50px"/>
          <p>Join group</p>
        </div>
      </div>
      <div class="grid-item item4">
        <div @click="goToRoom(groupName)">
          <img src="../assets/logo.png" style="width: 50px; height: 50px;"/>
          <p>Go to group room</p>
        </div>
      </div>
      <div class="grid-item item5">
        <div @click="customizeGroupProfile(groupName, authorization)">
          <img src="../assets/logo.png" style="width: 50px; height: 50px;"/>
          <p>Customize page</p>
        </div>
      </div>
      <div class="grid-item item2">
        <h2>Test group</h2>
        <img src="../assets/logo.png"/><br>
        <p>This is a random description</p>
      </div>
      <div class="grid-item item3">
        <div><p id="memberLabel">Members:</p>
            <div id="memberList" v-for="member in members" :key="member.name" class="container" @click="goToUserPage(member.name)">
              <img id="memberIcon" :src="member.url" alt="Avatar" class="image memberPic" style="width:100%">
              <div class="middle iconLabel">
                <div id="iconLabel" class="text">
                  {{member.name}}
                </div>
              </div>
            </div>
        </div>
        <div><p id="adminLabel">Admins:</p>
            <div id="adminList" v-for="admin in admins" :key="admin.name" class="container" @click="goToUserPage(admin.name)">
              <img id="adminIcon" :src="admin.url" alt="Avatar" class="image adminPic" style="width:100%">
              <div class="middle iconLabel">
                <div id="iconLabel" class="text">
                  {{admin.name}}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'GroupProfile',
  data () {
    return {
        username: "",
        uid: "",
        friends: undefined,
        groups: undefined
    }
  },
  methods: {
    joinGroup: function(groupName) {
      alert('Joined '+groupName);
    },
    goToRoom: function(name) {
      alert("Now entering " + name + "'s room");
    },
    customizeGroupProfile: function(groupName, authorization) {
      if(authorization === "admin") {
        alert("You can customize this profile");
      }
      else {
        alert("You cannot edit this profile, this also means you shouldnt see this");
      }
    }

  },

  mounted: function() {

  }
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
