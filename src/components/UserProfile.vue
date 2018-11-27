<template>
 <div class="profile">
   <h2>{{this.username}}</h2>
   <p>{{this.uid}}</p>
   <img src="../assets/logo.png"><br>
   <span><p id="friendLabel">Friends:</p>
        <div id="friendList" v-for="friend in friends" :key="friend.name" class="container">
          <img id="friendIcon" :src="friend.url" alt="Avatar" class="image friendPic" style="width:100%">
          <div class="middle iconLabel">
            <div id="iconLabel" class="text">
              {{friend.name}}
            </div>
          </div>
        </div>
   </span>
 </div>
</template>

<script>
import firebase from 'firebase'

  export default {
    name: 'login',
    data: function() {
      return {
        username: "",
        uid: "",
        friends: undefined,

      }
    },
    methods: {

    },
    mounted: function() {
      let friend1 = {"name": "friend1", "id": 1, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let friend2 = {"name": "friend2", "id": 2, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let friend3 = {"name": "friend3", "id": 3, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let friend4 = {"name": "friend4", "id": 4, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};
      let friend5 = {"name": "friend5", "id": 5, "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"};

      let currentUser = firebase.auth().currentUser;
      console.log(currentUser);
      this.username = currentUser.email;
      this.uid = currentUser.uid;
      this.friends = new Array(friend1, friend2, friend3, friend4, friend5);
      this.friends.forEach(friend => console.log(friend.name));
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

</style>
