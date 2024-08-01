import axios from 'axios'

// 创建 Axios 实例
const instance = axios.create({
  baseURL: '#', // 根据需要设置基础 URL
  timeout: 10000, // 请求超时时间
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('authorization')

    // 如果存在 token，添加到请求头中
    if (token) {
      config.headers['Authorization'] = token
    }

    return config
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做些处理
    return response
  },
  (error) => {
    // 对响应错误做些处理
    return Promise.reject(error)
  }
)

export default instance
