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
    <div class="grid-item item2">
      <h2>{{this.user.displayName}}</h2>
      <p>{{this.user.email}}</p>
      <img :src="user.photoURL" /><br>
    </div>
    <div class="grid-item item3">
      <div><p id="friendLabel">Friends:</p>
          <div id="friendList" v-for="friend in friends" :key="friend.displayName" class="container" @click="goToUserPage(friend.uid)">
            <Icon :url="friend.photoURL" :label="friend.displayName"></Icon>
          </div>
      </div>
      <div><p id="groupLabel">Groups:</p>
          <div id="groupList" v-for="group in groups" :key="group.name" class="container" @click="goToGroupPage(group.name)">
           <Icon :url="group.url" :label="group.name"></Icon>
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
         "friends": []
       },
       friends: []

      }
    },
    props: ['username'],
    components: {
      Icon,
    },
    methods: {
      goToUserPage: function(name) {
        alert(name);
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

    },
    mounted: function() {
     /*  let friend1 = {"name": "friend1", "id": 1, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let friend2 = {"name": "friend2", "id": 2, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let friend3 = {"name": "friend3", "id": 3, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let friend4 = {"name": "friend4", "id": 4, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let friend5 = {"name": "friend5", "id": 5, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};

      let group1 = {"name": "group1", "id": 1, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let group2 = {"name": "group2", "id": 2, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let group3 = {"name": "group3", "id": 3, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let group4 = {"name": "group4", "id": 4, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let group5 = {"name": "group5", "id": 5, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      */

     console.log("props: " + this.username);

      const userId = firebase.auth().currentUser.email.replace(".","");

      firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
        this.user = snapshot.val();
        //console.log(this.user);
        console.log(this.user.friends);

      }).then(() => {
          let i = 0;
          this.user.friends.forEach(friend => {
            let tempId = friend.replace(".","");
            firebase.database().ref('/users/' + tempId).once('value').then((snapshot) => {
            this.friends[i++] = snapshot.val();

            });

          });
      });

    console.log("my full friends profile array:", this.friends);

    }
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
