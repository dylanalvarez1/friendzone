<template>
  <div class="grid-container">
    <div class="item1">header:
      <div v-if="params">
        <!--{{user.displayName}}-->
      </div>
    </div>
    <div class="item2">Room:
      <div id="draggable">
        <div id="draggableheader">
          <a href="../assets/logo.png" download><img src="https://i.imgur.com/dQemleO.jpg?1" class="testImage"></a>
        </div>
      </div>
    </div>
    <div class="item3">Controls:</div>
    <div class="item4">footer:</div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'room',
  data() {
    return {
      // user : {
      //    "photoURL": "",
      //    "displayName": "",
      //    "email": "",
      //    "friends": []
      //  },
      params: undefined,
    }
  },
  props: ['username'],
  methods: {
    getUser: function () {
      //Gets the correct user by checking if there is a router param and then calls getUserById (firebase call)

      //console.log("route params:", this.$route.params.username);

      this.params = this.$route.params.ownerID;

      //   if(this.params !== undefined && this.params !== " ") {
      //     //This is when you visit another profile, there is a path param in the route
      //     console.log("In getUser call with route params");
      //     const userId = this.params;
      //     console.log("userId", userId);
      //     this.getUserById(userId);
      //   }
      //
      //   else {
      //     //default call with no router params
      //     console.log("In getUser call where there is no route params");
      //     const userId = firebase.auth().currentUser.email.replace(".","");
      //     console.log("userId", userId);
      //     this.getUserById(userId);
      //   }
      //
      // },
      //
      // getUserById: function (userId) {
      //   firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
      //       this.user = snapshot.val();
      //       //console.log(this.user);
      //       console.log(this.user.following);
      //
      //     }).then(() => {
      //         this.friends = []; //empty the array before filling it with user info
      //         this.user.following.forEach(friend => {
      //           let tempId = friend.replace(".","");
      //           firebase.database().ref('/users/' + tempId).once('value').then((snapshot) => {
      //           this.friends.push(snapshot.val());
      //
      //           });
      //
      //         });
      //     });
      // }
    },
    mounted: function () {

      this.getUser();


      console.log("props: ", this.username);
      // Make the DIV element draggable:
      dragElement(document.getElementById("draggable"));

      function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid-container {
  margin-top: 10px;
  display: grid;
  width: 100%;
  height: 100%;
  column-gap: 10px;
  row-gap: 10px;
  grid-template-areas:
      'header header header header header header'
      '. room room room . control'
      '. room room room . control'
      'footer footer footer footer footer footer';

  grid-template-rows: 100px 200px 200px 50px;
  grid-template-columns: 50px 1fr 1fr 1fr 50px 100px;

}

.item1 {
  grid-area: header;
  border-style: solid;
}
.item2 {
  grid-area: room;
  border-style: solid;

}
.item3 {
  grid-area: control;
  border-style: solid;
}
.item4 {
  grid-area: footer;
  border-style: solid;
}
.testImage {
  object-fit: contain;
  overflow: hidden;
  width: 50px;
  height: 50px;
}

#draggable {
    position: absolute;
    z-index: 9;
    background-color: #f1f1f1;
    border: 1px solid #d3d3d3;
    text-align: center;
}

#draggableheader {
    padding: 10px;
    cursor: move;
    z-index: 10;
    background-color: #2196F3;
    color: #fff;
}

</style>
