<template>
<div class="grid-container">
  <div class="item1">header:
    <div>
      {{room}}
    </div>
  </div>
  <div id="furniture-container" class="item2">Room:
    <!--div v-for="(piece, index) in room.furniture" :id="'f' + index" class="draggable">
      <div :id="'f' + index+'-header'" class="draggableheader">
        <a href="../assets/logo.png" download><img src="https://i.imgur.com/dQemleO.jpg?1" class="testImage"></a>
      </div>
    </div-->
  </div>
  <div class="item3">Controls:</div>
  <div class="item4">footer:</div>
</div>
</template>

<script>
import firebase from 'firebase'

const GROUP_ID = "4f71f44b-dca2-4997-bf13-311459912f25";

export default {
  name: 'room',
  data() {
    return {
      room: "",
      activeFurnitureIndex: -1,
      /*user : {
         "photoURL": "",
         "displayName": "",
         "email": "",
         "friends": []
       },*/
      params: undefined
    }
  },
  props: ['username'],
  methods: {
    getUser: function() {
      //Gets the correct user by checking if there is a router param and then calls getUserById (firebase call)

      //console.log("route params:", this.$route.params.username);


      if (this.params != undefined && this.params != " ") {
        //This is when you visit another profile, there is a path param in the route
        console.log("In getUser call with route params");
        const userId = this.params.replace(".", "");
        console.log("userId", userId);
        this.getUserById(userId);
      } else {
        //default call with no router params
        console.log("In getUser call where there is no route params");
        const userId = firebase.auth().currentUser.email.replace(".", "");
        console.log("userId", userId);
        this.getUserById(userId);
      }

    },

    getUserById: function(userId) {
      firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
        this.user = snapshot.val();
        //console.log(this.user);
        console.log(this.user.following);

      }).then(() => {
        this.friends = []; //empty the array before filling it with user info
        this.user.following.forEach(friend => {
          let tempId = friend.replace(".", "");
          firebase.database().ref('/users/' + tempId).once('value').then((snapshot) => {
            this.friends.push(snapshot.val());

          });

        });
      });
    },

    populateRoom: function(callback) {
      firebase.database()
        .ref(`/rooms/${GROUP_ID}`)
        .once('value')
        .then(snapshot => {
          //set the room
          this.room = snapshot.val();
          console.log("snapshot.val()" + snapshot.val());

          //initialize room furniture if nonexistent
          if (!this.room.furniture) this.initializeFurniture(callback);
          //else callback();




          //for each furniture, render on the page
          //document.getElementById("furniture-container").innerHTML = "";
          this.renderFurniture(callback);
          //this.room.furniture.forEach((piece, index) => this.renderFurniture(piece, index));
        });
    },

    initializeFurniture: function(callback) {
      //TODO initialize with a default furniture instead of {name:"Hello"}
      this.room.furniture = [
        {
          title: "Welcome!",
          iconUrl: "https://i.imgur.com/dQemleO.jpg?1",
          url: "https://www.google.com",
          creator: "friendzone",
          dateCreated: Date.now(),
          position: {top: "0px", left: "0px"}
        }
      ];
      this.saveRoomState(callback);
    },

    saveRoomState: function(callback) {
      firebase.database().ref(`/rooms/${GROUP_ID}`).set(this.room);
      console.log("saving " + JSON.stringify(this.room));
      if (callback) callback();
    },

    renderFurniture: function(callback) {
      //place to insert the furniture
      const furnitureContainer = document.getElementById("furniture-container");
        this.room.furniture.forEach((piece, index) => {
        //[1, 1].forEach((piece, index) => {
          //TODO change href="#"
          const DOG_URL = "https://i.imgur.com/dQemleO.jpg?1";
          const pieceHTML = `<div id="furniture-${index}"class="draggable" style="position: absolute;
          z-index: 9;
          background-color: #f1f1f1;
          border: 1px solid #d3d3d3;
          text-align: center;
          top: ${piece.position.top}px;
          left: ${piece.position.left}px;"><div class="draggableheader" id="furniture-${index}-header"><img src="${DOG_URL}" class="testImage" style="width: 90px; height: 90px"></div></div>`;
          furnitureContainer.innerHTML += pieceHTML;
        });
        if (callback) callback();
        //this.makeDraggable(`${index}`);
    },

    setCookie: function(cname, cvalue) {
      var d = new Date();
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";";
    },

    getCookie: function(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }


  },
  mounted: function() {

    this.getUser();
    this.populateRoom(() => {
      console.log("calllbackkk");
      const elmnts = document.getElementsByClassName("draggable");
      console.log(elmnts.length);
      for (let i = 0; i < elmnts.length; i++){
        console.log(i);
        dragElement(elmnts[i]);
      }
    });

    console.log("props: ", this.username);
    // Make the DIV element draggable:
    //document.getElementsByClassName("draggable").forEach(elmnt => dragElement(elmnt));


    function dragElement(elmnt) {
      console.log("dragElement");
      const id = elmnt.id.replace("f","");
      //const position = this.room.furniture[id].position;
      const position = [0, 0, 0, 0];
      var pos1 = position[0], pos2 = position[1], pos3 = position[2], pos4 = position[3];
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

.draggable {
  position: absolute;
  z-index: 9;
  background-color: #f1f1f1;
  border: 1px solid #d3d3d3;
  text-align: center;
}

.draggableheader {
  padding: 10px;
  cursor: move;
  z-index: 10;
  background-color: #2196F3;
  color: #fff;
}
</style>
