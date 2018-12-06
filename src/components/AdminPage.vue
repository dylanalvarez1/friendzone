<template>
  <div>
    <table style="width:100%">
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Icon</th>
      <th>Remove</th>
    </tr>
      <tr v-for="user in users" :key="user.uid" >
        <td>{{user.displayName}}</td>
        <td>{{user.email}}</td>
        <td><img id="icon" :src="user.photoURL" alt="Avatar" class="image friendPic" style="max-height: 100px; max-width:100px;"></td>
        <td><button @click="goToUserPage(user.uid)">Delete</button></td>
      </tr>
    </table>
  </div>

</template>

<script>
  import firebase from 'firebase';
    export default {
        name: "AdminPage",
      data: function () {
        return {
         users: []
        }
      },
      methods: {
       getUserById: function(userId) {
          firebase.database().ref('/users/').once('value').then((snapshot) => {
            let response = snapshot.val();
            console.log(snapshot.val());
            this.users = response;
          });
        },
      },
      mounted: function() {
        this.getUserById(firebase.auth().currentUser.uid);
      }
    }
</script>

<style scoped>
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

