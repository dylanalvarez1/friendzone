<template>
  <div id="wrapper">
    <img id="friendIcon" :src="url" alt="Avatar" class="image friendPic" style="width:100%">
    <div class="middle iconLabel">
      <div id="iconLabel" class="text">
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

  #wrapper {
    cursor: pointer;
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

  #friendLabel {
    vertical-align: top;
    display: inline-block;
    margin-right: 5px;
  }

   .container:hover .image {
    opacity: 0.3;
  }

  .container:hover .middle {
    opacity: 1;
  }

  .container {
    position: relative;
    width: 5%;
  }

  .text {
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    padding: 16px 32px;

  }


</style>

