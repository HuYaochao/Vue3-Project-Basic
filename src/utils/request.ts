import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { baseURL_dev } from '@/config/baseURL';
import { ElNotification, ElMessage } from 'element-plus'

class HttpRequest {
    private readonly baseUrl: string;
    constructor() {
        this.baseUrl = baseURL_dev
        // this.baseUrl = baseURL_dev + "/api"
    }
    getInsideConfig() {
        const config = {
            baseURL: this.baseUrl,// 所有的请求地址前缀部分(没有后端请求不用写)
            timeout: 80000, // 请求超时时间(毫秒)
            // withCredentials: true,// 异步请求携带cookie
            headers: {
                // 设置后端需要的传参类型
                'Content-Type': 'application/json',
                // 'token': x-auth-token',//一开始就要token
                // 'X-Requested-With': 'XMLHttpRequest',
            },
        }
        return config
    }

    // 请求拦截
    interceptors(instance: AxiosInstance, url: string | number | undefined) {
        instance.interceptors.request.use((config: any) => {
            // 添加全局的loading..
            config.headers.Authorization = localStorage.getItem('token');
            // 请求头携带token
            return config
        }, (error: any) => {
            return Promise.reject(error)
        })
        //响应拦截
        instance.interceptors.response.use((res: any) => {
            // debugger;
            if (res.data.code == 200) {
                ElNotification({
                    title: 'Success',
                    message: 'success',
                    type: 'success',
                })
            }
            // console.log('返回数据处理', res)
            return res
        }, (error: any) => {
            ElMessage({
                message: error.message,
                type: 'error',
            })
            console.log('error==>', error)
            return Promise.reject(error)
        })
    }

    request(options: AxiosRequestConfig) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}

const http = new HttpRequest()

export default http