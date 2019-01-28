<template>
  <div class="face-recognition">
    <video
      id="video"
      class="video"
      autoplay
      playsinline>
    </video>
    <!--描绘video截图-->
    <div class="modal">
      <p
        v-if="testing"
        class="testing">
          检测中<span class="dotting"></span>
        </p>
    </div>
    <canvas
      id="canvas"
      class="canvas">
    </canvas>
  </div>
</template>

<script>
import '@/utils/vconsole'
import errorTips from '@/utils/errorTips'

export default {
  name: 'FaceRecognition',
  data () {
    return {
      video: '',
      clientHeight: `${document.documentElement.clientHeight}px`,
      testing: true
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
    async success (stream) {
      //兼容webkit核心浏览器
      this.video = document.getElementById('video')
      //将视频流转化为video的源
      await this.$nextTick()
      this.video.srcObject = stream
      // video.play()//播放视频
      //将视频绘制到canvas上
      this.postFace()
    },
    error (error) {
      console.log('访问用户媒体失败：', error.name, error.message)
    },
    postFace () {
      this.video.addEventListener('canplay', () => {
        this.sendAuth()
      });
    },
    sendAuth () {
      let scale = 0.4
      let canvas = document.getElementById('canvas')
      let context = canvas.getContext('2d')
      
      this.testing = true      
      canvas.width = this.video.videoWidth * scale
      canvas.height = this.video.videoHeight * scale
      context.drawImage(this.video, 0, 0, canvas.width, canvas.height)
      let img = canvas.toDataURL('image/jpg') // 获取完整的base64编码

      this.$axios.post('/auth', {
        src: img.split(',')[1]
      })
      .then(async res => {
        this.testing = false
        await this.$nextTick()
        let {data} = res
        console.log(data)
        alert(data.code === 0 ? data.result.score >= 80 ? '检测通过' : '检测不通过' : errorTips(data.code) || '人脸识别未知错误')
        if (data.code !== 0 || data.result && data.result.score < 80) this.sendAuth()
      })
      .catch(err => {
        this.testing = false
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
.modal .testing {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
  z-index: 1;
  font-size: 14px;
  color: #fff;
  text-align: center;
}
.dotting {
  display: inline-block;
  min-width: 2px;
  min-height: 2px;
  box-shadow: 2px 0 currentColor, 6px 0 currentColor, 10px 0 currentColor; 
  animation: dot 4s infinite step-start both;
}
.canvas {
  display: none;
}
@keyframes dot {
    25% { box-shadow: none; }
    50% { box-shadow: 2px 0 currentColor; }
    75% { box-shadow: 2px 0 currentColor, 6px 0 currentColor; }
}
</style>
