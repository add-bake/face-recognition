<template>
  <div class="face-recognition">
    <video
      id="video"
      class="video"
      autoplay
      playsinline>
    </video>
    <!--描绘video截图-->
    <div class="modal"></div>
    <canvas
      id="canvas"
      class="canvas">
    </canvas>
  </div>
</template>

<script>
import '@/utils/vconsole'

export default {
  name: 'FaceRecognition',
  data () {
    return {
      clientHeight: `${document.documentElement.clientHeight}px`
    }
  },
  mounted () {
    this.start()
  },
  methods: {
    start () {
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
        //最新标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error)
      }else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error)
      }else if(navigator.mozGetUserMedia){
        //firefox浏览器
        navigator.mozGetUserMedia(constraints, success, error)
      }else if(navigator.getUserMedia){
        //旧版API
        navigator.getUserMedia(constraints, success, error)
      }
    },
    success (stream) {
      let video = document.getElementById('video') 
      //兼容webkit核心浏览器
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
      let scale = 0.4
      let canvas = document.getElementById('canvas')
      let context = canvas.getContext('2d')
      video.addEventListener('canplay', () => {
        canvas.width = video.videoWidth * scale
        canvas.height = video.videoHeight * scale
        setTimeout(() => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          let img = canvas.toDataURL('image/jpg')
          
          this.sendAuth(img.split(',')[1]) // 获取完整的base64编码
        }, 3000)
      });
    },
    sendAuth (src) {
      this.$axios.post('/auth', {
        src: src
      })
      .then(res => {
        let {data} = res
        console.log(data)
        alert(data.code === 0 ? data.result.score >= 80 ? '检测通过' : '检测不通过' : data.error_msg || '验证错误')
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.video,
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: #eee;
}
.modal {
  z-index: 2;
  background: url("../assets/modal_face_auth.png") 0 0 no-repeat;
  background-size: cover;
}
.canvas {
  display: none;
}
</style>
