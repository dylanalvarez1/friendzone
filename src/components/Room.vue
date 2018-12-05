<template>
<div class="grid-container">
  <div class="item1">header:
    <div>
      {{activeFurnitureIndex}}
    </div>
  </div>
  <div id="furniture-container" class="item2">Room:
    <!--div v-for="(piece, index) in room.furniture" :id="'f' + index" class="draggable">
      <div :id="'f' + index+'-header'" class="draggableheader">
        <a href="../assets/logo.png" download><img src="https://i.imgur.com/dQemleO.jpg?1" class="testImage"></a>
      </div>
    </div-->
  </div>

  <!--Toolbar-->
  <div id="decorator" class="item3">Decorate:
    <button @click="createFurniture">Add furniture</button>
    <button @click="enterFurnitureModify">Modify furniture</button>
    <button @click="deleteFurniture">Delete furniture</button>
  </div>

  <!--Modify Events-->
  <div id="modifier" class="item3" style="display: none">Modify Furniture:
    <button @click="exitFurnitureModify">Back</button>
    <button @click="saveFurnitureModifications">Save changes</button><br><br>
    <label>Name</label><input type="text"><br>
    <label>URL</label><input type="url"><br>
    <label>Color</label><input type="color"><br>
    <label>Z-index</label><input type="number"><br><br>
    <label>Width</label><input type="range">
    <label>Height</label><input type="range">
  </div>


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
      params: undefined,
      furniture: []
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

    //populateRoom => renderFurniture => makeAllDraggable

    //umbrella function
    //gets the data for the room ready
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

          this.furniture = this.room.furniture;



          //for each furniture, render on the page
          //document.getElementById("furniture-container").innerHTML = "";
          this.renderFurniture(callback);
          //this.room.furniture.forEach((piece, index) => this.renderFurniture(piece, index));
        });
    },

    initializeFurniture: function(callback) {
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

    createFurniture: function() {
      let currentRoom = this.room;
      let defaultFurniture = {
        title: "Welcome!",
        iconUrl: "https://i.imgur.com/dQemleO.jpg?1",
        url: "",
        creator: "friendzone",
        dateCreated: Date.now(),
        position: {top: "0px", left: "0px"}
      };
      let tempList = this.room.furniture;
      console.log(tempList);
      tempList.push(defaultFurniture);
      this.furniture = tempList;
      currentRoom.furniture = tempList;

      this.room = currentRoom;
      this.saveRoomState();
      this.renderFurniture();
      this.selectFurniture(currentRoom.furniture.length-1);
      this.enterFurnitureModify();
    },

    deleteFurniture: function(){
      this.room.furniture.splice(this.activeFurnitureIndex, 1);
      this.activeFurnitureIndex = -1;
      this.saveRoomState();

      //this is copy-pasted from mounted run
      this.populateRoom();
    },

    saveRoomState: function(callback) {
      firebase.database().ref(`/rooms/${GROUP_ID}`).set(this.room);
      //console.log("saving " + JSON.stringify(this.room));
      if (callback) callback();
    },

    //populates with html. in hindsight, this should make them draggable too
    //makes all draggable
    renderFurniture: function(callback) {
      //place to insert the furniture
      const furnitureContainer = document.getElementById("furniture-container");
      furnitureContainer.innerHTML = "Room:";
        this.room.furniture.forEach((piece, index) => {
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
        this.makeAllDraggable(callback);
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
            this.selectFurniture(index);
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
            this.selectFurniture(index);
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
      }
    },

    selectFurniture: function(index){
      if (this.activeFurnitureIndex === index) return;
      //DESELECT FURNITURE
      if (this.activeFurnitureIndex !== -1)
        document.getElementById(`furniture-${this.activeFurnitureIndex}`).style.fontWeight = "initial";

      this.exitFurnitureModify();

      this.activeFurnitureIndex = index;

      //SELECT FURNITURE
      document.getElementById(`furniture-${this.activeFurnitureIndex}`).style.fontWeight = "bold";
    },

    enterFurnitureModify: function(){
      if (this.activeFurnitureIndex === -1) return;
      document.getElementById("decorator").style.display = "none";
      document.getElementById("modifier").style.display = "block";
    },

    saveFurnitureModifications: function(){

    },

    exitFurnitureModify: function(){
      document.getElementById("modifier").style.display = "none";
      document.getElementById("decorator").style.display = "block";
    },

    makeAllDraggable: function(callback){
      const elmnts = document.getElementsByClassName("draggable");
      for (let i = 0; i < elmnts.length; i++)
        this.dragElement(elmnts[i]);
      if (callback) callback();
    }

  },
  mounted: function() {

    this.getUser();
    this.populateRoom();

    console.log("props: ", this.username);
  },

  watched: {
    furniture: {
      handler: function () {
        console.log("room has changed!");
        this.renderFurniture();
      },
      deep: true
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

.selected {
}

.selected-h {
}

#modifier *{
  font-size: 11px;
  width: 90%;
}

#modifier button{
  width: 100%;
}
</style>
