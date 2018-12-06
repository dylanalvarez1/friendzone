<template>
  <div class="container">
    <img id="friendIcon" :src="url" alt="Avatar" class="image friendPic" style="width:100%">
    <div class="middle iconLabel">
      <div id="iconLabel" class="text overlay">
        {{label}}
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

  export default {
    name: 'Icon',
    props: ['url', 'label'],
    data: function() {
      return {

      }
    },
    methods: {

    },

  }
</script>

<style scoped>

  #friendLabel {
    vertical-align: top;
    display: inline-block;
    margin-right: 5px;
  }

.container {
  position: relative;
  width: 100%;
  max-width: 100px;
}

* {box-sizing: border-box;}

.image {
  display: block;
  width: 100%;
  height: auto;
}

.overlay {
  position: absolute;
  bottom: 0;
  background: rgb(0, 0, 0);
  background: rgba(0, 0, 0, 0.5); /* Black see-through */
  color: #f1f1f1;
  width: 100%;
  transition: .5s ease;
  opacity:0;
  color: white;
  font-size: 14px;
  padding: 0px;
  text-align: center;
}

.container:hover .overlay {
  opacity: 1;
}


</style>

