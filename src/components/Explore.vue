<template>
  <div id="background">

    <div class="container" style="display: inline; float: left; width: 100%; margin-top: 50px;">
      <button @click="createGroup">Register a new group</button>
      <input placeholder="Search" style=""/>
      <select style="">
        <option value="none">No filter</option>
        <option value="users">Users</option>
        <option value="groups">Groups</option>
      </select>
    </div>
      <br>

      <div id="resultSet">
        <h1 style="color: white;">Results</h1>
      <div id="resultsList" v-for="result in results" :key="result.name" class="container" @click="goToPage(result.name)">
        <img id="icon" :src="result.url" alt="Avatar" class="image friendPic">
        <div class="middle iconLabel">
          <div id="iconLabel" class="text">
            {{result.name}}
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
        results: undefined
      }
    },

    methods: {
      //for traversing to each user / groups page
      goToPage: function(name) {
        alert(name);
      },
      createGroup: function() {
       this.$router.push({ path: `/group-registration/` });
      }
    },

    mounted: function() {
      let r1 = {
        "name": "result1",
        "id": 1,
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
      };
      let r2 = {
        "name": "result2",
        "id": 2,
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
      };
      let r3 = {
        "name": "result3",
        "id": 3,
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
      };
      let r4 = {
        "name": "result4",
        "id": 4,
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
      };
      let r5 = {
        "name": "result5",
        "id": 5,
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
      };

      let r6 = {
        "name": "result6",
        "id": 6,
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
      };
      let r7 = {
        "name": "result7",
        "id": 7,
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
      };
      let r8 = {
        "name": "result8",
        "id": 8,
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
      };
      let r9 = {
        "name": "result9",
        "id": 9,
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
      };
      let r10 = {
        "name": "result10",
        "id": 10,
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
      };

      let currentUser = firebase.auth().currentUser;
      //console.log(currentUser);
      this.username = currentUser.email;
      this.uid = currentUser.uid;
      this.results = new Array(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10);
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
