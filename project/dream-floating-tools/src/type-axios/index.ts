import axios from 'axios'

// 创建 axios 实例
const instance = axios.create({
  // 请求地址
  baseURL: '/api',
  // 请求超时时间 60s
  timeout: 60000,
  // 请求头携带信息
  headers: {
    'Content-Type': 'application/json'
  }
})

// 全局请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(new Error(error))
  }
)

// 全局响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log(error)
    return Promise.reject(new Error(error))
  }
)

export default instance
