import { t } from '@src/common/funcation'
import { ResponseResult } from '@src/common/interface'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@src/vue-router'
import dayjs from 'dayjs'

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
    // 在发送请求前需要做的事
    // 携带验证信息 首先确认token没有过期
    let tokenExpire = sessionStorage.getItem('tokenExpire')
    let jwtEffective = Number(sessionStorage.getItem('jwtEffective'))
    if (tokenExpire && jwtEffective) {
      let now = dayjs()
      let tokenExpireDate = dayjs(tokenExpire, 'YYYY-MM-DD HH:mm:ss')
      let intervalTime = now.diff(tokenExpireDate, 'm')
      if (intervalTime > jwtEffective) {
        ElMessage({
          type: 'error',
          grouping: true,
          plain: true,
          message: t('system.tip.401_status')
        })
        sessionStorage.clear()
        router.push('/login')
      } else {
        const authorization = sessionStorage.getItem('Authorization')
        if (authorization) {
          config.headers.setAuthorization(authorization)
          sessionStorage.setItem('tokenExpire', dayjs().format('YYYY-MM-DD HH:mm:ss'))
        }
      }
    }
    return config
  },
  function (error) {
    // 对请求错误的处理
    ElMessage({
      type: 'error',
      grouping: true,
      plain: true,
      message: t('system.tip.request_fail')
    })
    console.log(error)
    return Promise.reject(new Error(error))
  }
)

// 全局响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数
    // 对响应数据的处理
    // console.log(response)
    let body = response.data as ResponseResult
    if (body.code === 500) {
      ElMessage({
        type: 'error',
        grouping: true,
        plain: true,
        message: t('system.tip.response_fail')
      })
      ElMessage({
        type: 'error',
        grouping: true,
        plain: true,
        message: body.message
      })
      console.log(body)
    }
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误的处理
    if (error.response !== null && error.response !== undefined) {
      const status = error.response.status as number
      if (status === 401) {
        ElMessage({
          type: 'error',
          grouping: true,
          plain: true,
          message: t('system.tip.401_status')
        })
      } else if (status === 403) {
        ElMessage({
          type: 'error',
          grouping: true,
          plain: true,
          message: t('system.tip.403_status')
        })
        router.push('/noPermission')
      } else {
        ElMessage({
          type: 'error',
          grouping: true,
          plain: true,
          message: t('system.tip.response_fail')
        })
      }
    }
    console.log(error)
    return Promise.reject(new Error(error))
  }
)

export default instance
