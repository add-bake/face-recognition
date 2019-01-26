import Vue from 'vue'
import axios from 'axios'

const service = axios.create({
  baseURL: 'https://192.168.0.162:8888'
})

Vue.prototype.$axios = service
