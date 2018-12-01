<template>
  <div style="position: absolute; height: 100%; width: 100%;background-color: #2196F3;">

    <div class="container" style="display: inline; float: left; width: 100%; margin-top: 50px;">
      <button style="margin-right: 20%; margin-left: 5%; height: 30px; corner-radius: 10px;">Register a new group</button>
      <input placeholder="Search" style="height: 30px; width: 30%;"></input>
      <select style="margin-left: 5%;">
        <option value="none">No filter</option>
        <option value="users">Users</option>
        <option value="groups">Groups</option>
      </select>
    </div>
      <br>

      <div style="margin-top: 200px; margin-left: 10%; margin-right: 10%;">
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
    name: 'login',
    data: function() {
      return {
        username: "",
        uid: "",
        results: undefined

      }
    },

    methods: {
      goToPage: function(name) {
        alert(name);
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

  .container * {
    display: inline;
    float: left;
  }
  .item1 {
    grid-column: 1 / span 5;
    grid-row: 1;
    vertical-align: middle !important;
  }

  .item1 input{
    width: 40%;
    height: 30px;
  }

  .item1 button{
    margin-right:100px;
    height: 40px;
  }

  .item1 select{
    margin-left: 50px;
  }

  //for the resulting icons
  .item2 {
    grid-column: 2 / span 3;
    grid-row: 2 / span 2;
    width: auto;
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
  }


  .profile {
    text-align: center;
  }

  #resultsList {
    display: inline-block;
    padding: 15px;
    margin: 30px;
  }

  .container {
    position: relative;
    width: 5%;
    float: left;
    display: inline;
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
  }


  .grid-container {
    display: grid;
    grid-gap: 10px;
    padding: 10px;
    align-content: center;

  }

  .grid-item {
    text-align: center;
    padding: 20px;
    font-size: 30px;
  }
</style>
