<template>
  <div class="face-recognition">
    <button @click="start">开始4</button>
    <video
      id="video"
      class="video"
      autoplay
      playinline>
    </video>
    <!--描绘video截图-->
    <canvas
      id="canvas"
      class="canvas">
    </canvas>
    <img
      v-for="(item, index) in imgList"
      :key="index"
      :src="item"
      alt="">
  </div>
</template>

<script>
import '@/utils/vconsole'

export default {
  name: 'FaceRecognition',
  data () {
    return {
      imgList: []
    }
  },
  methods: {
    start () {
      console.log(navigator)
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia){
        this.getUserMediaToPhoto({
          audio: false,
          video: true
        }, this.success, this.error)
      }else{
        alert('你的浏览器不支持访问用户媒体设备')
      }
    },
    getUserMediaToPhoto (constraints, success, error) {
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        console.log(1)
        //最新标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error)
      }else if (navigator.webkitGetUserMedia) {
        console.log(2)
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error)
      }else if(navigator.mozGetUserMedia){
        console.log(3)
        //firefox浏览器
        navigator.mozGetUserMedia(constraints, success, error)
      }else if(navigator.getUserMedia){
        console.log(4)
        //旧版API
        navigator.getUserMedia(constraints, success, error)
      }
    },
    success (stream) {
      let video = document.getElementById('video') 
      //兼容webkit核心浏览器
      // let compatibleURL = window.URL || window.webkitURL
      //将视频流转化为video的源
      video.srcObject = stream
      // video.play()//播放视频
      //将视频绘制到canvas上
      this.postFace(video)
    },
    error (error) {
      console.log('访问用户媒体失败：', error.name, error.message)
    },
    postFace (video) {
      let canvas = document.getElementById('canvas')
      let context = canvas.getContext('2d')
      setInterval(() => {
        context.drawImage(video,0,0,480,320)
        this.imgList.push(canvas.toDataURL('image/jpg'))
        // 获取完整的base64编码
        // img = img.split(',')[1]
        console.log('111')
      }, 2000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.video,
.canvas {
  width: 100%;
  height: 200px;
}
.canvas {
  display: none;
}
</style>
