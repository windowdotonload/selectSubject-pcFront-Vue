import axios from 'axios'

// 设置超时时间
axios.defaults.timeout = 30000;
// 请求拦截器
axios.interceptors.request.use(config => {
    // 在请求头中携带token以此进行安全认证
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

// 响应拦截器
axios.interceptors.response.use(res => {
    // console.log('res =  ', res)
    const data = res.data
    return data
})

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function post(url, params) {
    return new Promise((resovle, reject) => {
        axios.post(url, params).then(res => {
            resovle(res)
        }).catch(err => {
            reject(err)
        })
    })
}