<template>
<div class="grid-container">

  <div class="item1">{{room.title}}</div>

  <div id="furniture-container" class="item2"></div>

  <!--Toolbar-->
  <div id="decorator" style="text-align:center" class="item3">Decorate:
    <button @click="createFurniture">Add furniture</button>
    <!--button @click="enterRoomModify">Modify room</button-->
  </div>

  <!--Modify Events-->
  <div id="f-modifier" class="item3" style="display: none; text-align: center">Modify Furniture:
    <form>
      <br>
      <button @click="exitFurnitureModify" style="width: 50%">Back</button><br><br>
      <label>Title</label><input type="text" @input="saveFurnitureModifications" @change="saveFurnitureModifications" v-on:blur="saveFurnitureModifications" v-model="mod.new.title"><br>
      <label>Link</label><input type="url" @input="saveFurnitureModifications" @change="saveFurnitureModifications" v-on:blur="saveFurnitureModifications" v-model="mod.new.url"><br>
      <label>Image</label><input type="url" @input="saveFurnitureModifications" @change="saveFurnitureModifications" v-on:blur="saveFurnitureModifications" v-model="mod.new.iconUrl"><br>
      <label>Color</label><input type="color" @input="saveFurnitureModifications" @change="saveFurnitureModifications" v-on:blur="saveFurnitureModifications" v-model="mod.new.color"><br>
      <label>Z-index</label><input type="number" @input="saveFurnitureModifications" @change="saveFurnitureModifications" v-on:blur="saveFurnitureModifications" min="0" max="100" v-model="mod.new.z"><br><br>
      <label>Padding</label><input type="number" @input="saveFurnitureModifications" @change="saveFurnitureModifications" v-on:blur="saveFurnitureModifications" min="0" max="100" v-model="mod.new.padding"><br><br>
      <label>Width</label><input type="text" @input="saveFurnitureModifications" @change="saveFurnitureModifications" v-on:blur="saveFurnitureModifications" v-model="mod.new.width">
      <label>Height</label><input type="text" @input="saveFurnitureModifications" @change="saveFurnitureModifications" v-on:blur="saveFurnitureModifications" v-model="mod.new.height"><br><br>
      <button v-if="moderator" @click="deleteFurniture" style="background-color: red; color: ; font-weight: bold;">Delete furniture</button><br><br>
    </form>
  </div>

  <div id="r-modifier" class="item3" style="display: none">Modify Room:
    <form>
      <button @click="saveRoomModifications">Save changes</button>
      <button @click="exitRoomModify">Back</button><br><br>
      <label>Title</label><input type="text" v-model="modr.new.title"><br><br>
      <label>Background Color</label><input type="color" v-model="modr.new.color"><br><br>
      <label>Wallpaper URL</label><input type="url" v-model="modr.new.wallpaper">
    </form>
  </div>


  <div class="item4"></div>
</div>
</template>

<script>
import firebase from 'firebase'
//import functions from 'firebase-functions'

const GROUP_ID = "4f71f44b-dca2-4997-bf13-311459912f25";
const functions = console.log(firebase);

export default {
  name: 'room',
  data() {
    return {
      modr: {
        new: {},
        old: {}

      },
      mod: {
        new: {},
        old: {}
      },
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
      moderator: false,
      furniture: [],
      DEFAULT_FURNITURE: {
        title: "Welcome!",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Japan_small_icon.png",
        url: "",
        creator: "friendzone",
        dateCreated: Date.now(),
        position: {top: "0px", left: "0px"},
        color: "#2196F3",
        height: "90px",
        width: "90px",
        z: 0,
      }
    }
  },
  props: ['username'],
  methods: {
    getUser: function () {
      //Gets the correct user by checking if there is a router param and then calls getUserById (firebase call)

      console.log("route params:", this.$route.params.ownerID);
      this.params=this.$route.params.ownerID;


      if (this.params != undefined && this.params != " ") {
        //This is when you visit another profile, there is a path param in the route
        console.log("In getUser call with route params");
        const userId = this.params;
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
        console.log(snapshot.val());
        console.log(this.user);
        //console.log(this.user.following);

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
       this.userId=this.$route.params.ownerID;
      // this.userId=GROUP_ID;
      firebase.database()
        .ref(`/rooms/${this.userId}`)
        .once('value')
        .then(snapshot => {
          //set the room
          this.room = snapshot.val();
          console.log(snapshot.val());
          console.log(this.room);
          if(this.room.hasOwnProperty('furniture')) {
            this.verifyFurnitureIsArray(this.room.furniture);
          }
          this.furniture = this.room.furniture || [];
          console.log("snapshot.val()" + snapshot.val());

          //initialize room furniture if nonexistent
          if (this.room.furniture === []) this.initializeFurniture();
          //else callback();




          //for each furniture, render on the page
          //document.getElementById("furniture-container").innerHTML = "";
          else this.renderFurniture(callback);
          //this.room.furniture.forEach((piece, index) => this.renderFurniture(piece, index));
        });
    },

    initializeFurniture: function(callback) {
      this.room.furniture = [JSON.parse(JSON.stringify(this.DEFAULT_FURNITURE))];
    },

    verifyFurnitureIsArray: function(furniture){
      if (furniture.forEach) return;
      let array = [];
      this.room.furniture = Object.keys(this.room.furniture).filter(key => key >= 0).forEach(key => array.push(this.room.furniture[key]));
      this.room.furniture = array;
    },

    createFurniture: function() {
      let currentRoom = this.room;
      let tempList=[];
      if(this.room.hasOwnProperty('furniture')) {
        tempList = this.room.furniture;
      }

      console.log(tempList);
      if (!tempList.push) tempList = [];
      tempList.push(JSON.parse(JSON.stringify(this.DEFAULT_FURNITURE)));
      this.furniture = tempList;
      currentRoom.furniture = tempList;
      this.activeFurnitureIndex = currentRoom.furniture.length - 1;

      this.room = currentRoom;
      this.saveRoomState();
      this.renderFurniture();
      this.selectFurniture(currentRoom.furniture.length-1);
      this.enterFurnitureModify();
    },

    deleteFurniture: function(){
      this.room.furniture.splice(this.activeFurnitureIndex, 1);
      this.exitFurnitureModify();
      this.saveRoomState();
      this.renderFurniture();
    },

    saveRoomState: function(callback) {
      firebase.database().ref(`/rooms/${this.userId}`).set(this.room);
      if (callback) callback();
    },

    //populates with html. in hindsight, this should make them draggable too
    //makes all draggable
    renderFurniture: function(callback) {
      //place to insert the furniture
      console.log("f: " + JSON.stringify(this.room.furniture));
      const furnitureContainer = document.getElementById("furniture-container");
      furnitureContainer.innerHTML = "";
      //if (!this.room.furniture.forEach) return;
        this.room.furniture.forEach((piece, index) => {
          const DOG_URL = "https://upload.wikimedia.org/wikipedia/commons/d/d5/Japan_small_icon.png";
          const pieceHTML = `<div id="furniture-${index}"class="draggable" style="position: absolute;
          z-index: ${piece.z};
          background-color: #f1f1f1;
          border: 1px solid #d3d3d3;
          text-align: center;

          top: ${piece.position.top};
          left: ${piece.position.left};"><div class="draggableheader" id="furniture-${index}-header" style="cursor: move; padding: 5px; z-index: ${piece.z};">${piece.title}</div><a id="furniture-${index}-a" href="${piece.url}" ><img id="furniture-${index}-img" src="${piece.iconUrl}" class="testImage" style="padding: 5px;
          padding: ${piece.padding}px;
          object-fit: fill;
          background-color: ${piece.color};
           width: ${piece.width}; height: ${piece.height};
          color: #fff;"></a></div>`;
          furnitureContainer.innerHTML += pieceHTML;
        });

        //this code persists the selected Index across renderings
        const temp = this.activeFurnitureIndex;
        this.activeFurnitureIndex = -1;
        this.selectFurniture(temp);
        this.makeAllDraggable(callback);
    },
    //unused
    renderPiece: function(callback){
      const piece = this.mod.new;
      const index = this.activeFurnitureIndex;
      const elem = document.getElementById(`furniture-${index}`);
      const elemHeader = document.getElementById(`furniture-${index}-header`);
      elem.style.zIndex = piece.z;
      elem.style.top = piece.position.top;
      elem.style.left = piece.position.left;
      elem.style.backgroundColor = piece.color;
      elemHeader.style.zIndex = piece.z;
      elemHeader.innerText = piece.title;
      document.getElementById(`furniture-${index}-a`).href = piece.url;
      document.getElementById(`furniture-${index}-img`).src = piece.iconUrl;
      if (callback) callback();
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

      this.activeFurnitureIndex = index;
      this.enterFurnitureModify();

      //SELECT FURNITURE
      document.getElementById(`furniture-${this.activeFurnitureIndex}`).style.fontWeight = "bold";
    },

    enterFurnitureModify: function(){
      if (this.activeFurnitureIndex === -1) return;
      document.getElementById("decorator").style.display = "none";
      document.getElementById("f-modifier").style.display = "block";
      //stash old furniture data (deep clone)
      this.mod.old = JSON.parse(JSON.stringify(this.room.furniture[this.activeFurnitureIndex]));
      this.mod.new = this.room.furniture[this.activeFurnitureIndex];
    },

    saveFurnitureModifications: function(){
      this.mod.old = this.mod.new;
      this.room.furniture[this.activeFurnitureIndex] = this.mod.old;
      this.saveRoomState(this.renderFurniture);
    },

    exitFurnitureModify: function(){
      //deselect
      document.getElementById(`furniture-${this.activeFurnitureIndex}`).style.fontWeight = "initial";
      this.activeFurnitureIndex = -1;
      document.getElementById("f-modifier").style.display = "none";
      document.getElementById("decorator").style.display = "block";
    },

    enterRoomModify: function(){
      document.getElementById("decorator").style.display = "none";
      document.getElementById("r-modifier").style.display = "block";
      //stash current settings
      this.modr.old.title = this.room.title;
      this.modr.old.color= this.room.color;
      this.modr.old.wallpaperUrl = this.room.wallpaperUrl;
    },

    saveRoomModifications: function(){
      this.modr.old = this.modr.new;
    },

    exitRoomModify: function(){
      this.room.title = this.modr.old.title;
      this.room.color = this.modr.old.color;
      this.room.wallpaperUrl = this.modr.old.wallpaperUrl;
      this.saveRoomState(() => {
        document.getElementById("r-modifier").style.display = "none";
        document.getElementById("decorator").style.display= "block";
      });
    },

    makeAllDraggable: function(callback){
      const elmnts = document.getElementsByClassName("draggable");
      for (let i = 0; i < elmnts.length; i++)
        this.dragElement(elmnts[i]);
      if (callback) callback();
    },
    checkCred(uid) {
       console.log("checking credentials of: ", uid);
       firebase.database().ref('/groups/' + this.$route.params.ownerID).once('value').then((snapshot) => {
        let response = snapshot.val();
        console.log("response:", response);
        let tempArray = response.moderators;
        console.log("temp array:", tempArray);
        tempArray.forEach(user => {
          if(user == firebase.auth().currentUser.uid) {
            this.moderator = true;
          }

        });
      });
    }

  },
  mounted: function() {

    // this.getUser();
    this.populateRoom();
    this.checkCred(firebase.auth().currentUser.uid);
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

  grid-template-rows: 100px 250px 250px 50px;
  grid-template-columns: 50px 1fr 1fr 1fr 50px 150px;

}

.item1 {
  grid-area: header;
  border-style: solid;
  font-size: 50px;
  background-color: #2196F3;
  color: white;
  padding: 10px;
  font-weight: bold;
}

.item2 {
  grid-area: room;
  border-style: solid

}

.item3 {
  grid-area: control;
  border-style: solid;
  background-color: #2196F3;
  color: white;
  padding: 5px;

}

.item4 {
  grid-area: footer;
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

#f-modifier *{
  font-size: 15px;
  width: 90%;
  margin-bottom: 2px;
}

#f-modifier button{
  width: 100%;
}
#r-modifier *{
  font-size: 15px;
  width: 90%;
}

#r-modifier button{
  width: 100%;
}
</style>
