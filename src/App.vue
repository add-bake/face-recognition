<template>
  <div id="app">
    <face-recognition></face-recognition>
  </div>
</template>

<script>
import FaceRecognition from './components/FaceRecognition.vue'

export default {
  name: 'app',
  components: {
    FaceRecognition
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
