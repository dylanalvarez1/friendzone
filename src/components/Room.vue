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
      pos1: 0,
      pos2: 0,
      pos3: 0,
      pos4: 0,
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
          this.pieces = this.room.furniture;
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
          url: "",
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
          top: ${piece.position.top};
          left: ${piece.position.left};"><div class="draggableheader" id="furniture-${index}-header" style="cursor: move; padding: 5px;">test</div><a href="${piece.url}"><img src="${DOG_URL}" class="testImage" style="padding: 5px;
          padding: 25px;
          z-index: 10;
          background-color: #2196F3;
          color: #fff;
          width: 100px; height: 100px;"></a></div>`;
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
    },

    dragElement: function(elmnt){
      let position = [0,0,0,0];
      const index = elmnt.id.replace("furniture-","");
      console.log("dragElement");
      if (document.getElementById(elmnt.id + "-header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "-header").onmousedown = e => {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          position[2] = e.clientX;
          position[3] = e.clientY;
          document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
            this.saveRoomState();
          };
          // call a function whenever the cursor moves:
          document.onmousemove = e => {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            position[0] = position[2] - e.clientX;
            position[1] = position[3] - e.clientY;
            position[2] = e.clientX;
            position[3] = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - position[1]) + "px";
            elmnt.style.left = (elmnt.offsetLeft - position[0]) + "px";
            this.room.furniture[index].position.top = elmnt.style.top;
            this.room.furniture[index].position.left = elmnt.style.left;
          };
        };
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        this.elmnt.onmousedown = e => {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          this.pos3 = e.clientX;
          this.pos4 = e.clientY;
          document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
            this.saveRoomState();
          };
          // call a function whenever the cursor moves:
          document.onmousemove = e => {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            position[0] = position[2] - e.clientX;
            position[1] = position[3] - e.clientY;
            position[2] = e.clientX;
            position[3] = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - position[1]) + "px";
            elmnt.style.left = (elmnt.offsetLeft - position[0]) + "px";
            this.room.furniture[index].position.top = elmnt.style.top;
            this.room.furniture[index].position.left = elmnt.style.left;
            //console.log(this.piece.position.left + ", " + this.piece.position.top);
          };
        };
      }
    },

    dragMouseDown: function(e){
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
        this.saveRoomState();
      };
      // call a function whenever the cursor moves:
      document.onmousemove = e => {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        position[0] = position[2] - e.clientX;
        position[1] = position[3] - e.clientY;
        position[2] = e.clientX;
        position[3] = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - position[1]) + "px";
        elmnt.style.left = (elmnt.offsetLeft - position[0]) + "px";
        this.room.furniture[index].position.top = elmnt.style.top;
        this.room.furniture[index].left = elmnt.style.left;
        //console.log(this.piece.position.left + ", " + this.piece.position.top);
      };
    },

    elementDrag: function(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      this.pos1 = this.pos3 - e.clientX;
      this.pos2 = this.pos4 - e.clientY;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      // set the element's new position:
      this.elmnt.style.top = (this.elmnt.offsetTop - this.pos2) + "px";
      this.elmnt.style.left = (this.elmnt.offsetLeft - this.pos1) + "px";
      this.piece.position.top = this.elmnt.style.top;
      this.piece.position.left = this.elmnt.style.left;
      console.log(this.piece.position.left + ", " + this.piece.position.top);
    },

    closeDragElement: function() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      this.saveRoomState();
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
        this.dragElement(elmnts[i]);
      }
    });

    console.log("props: ", this.username);
    // Make the DIV element draggable:
    //document.getElementsByClassName("draggable").forEach(elmnt => dragElement(elmnt));



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
