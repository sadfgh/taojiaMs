import axios from 'axios'
import Cookie from 'js-cookie'
import {logout} from '@/services'
import router from 'vue-router'
// import {initRouter} from '@/router'
// import store from '@/store'
// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization'

// axios.defaults.timeout = 5000
axios.defaults.withCredentials= true
// axios.defaults.xsrfHeaderName= xsrfHeaderName
// axios.defaults.xsrfCookieName= xsrfHeaderName
// axios.defaults.baseURL = '/api'
// axios.defaults.baseURL = '/'


// 认证类型
const AUTH_TYPE = {
  BEARER: 'Bearer',
  BASIC: 'basic',
  AUTH1: 'auth1',
  AUTH2: 'auth2',
}

// http method
const METHOD = {
  GET: 'get',
  POST: 'post'
}

//请求拦截
axios.interceptors.request.use(config =>{
    console.log(config);
    console.log(Cookie.get(xsrfHeaderName));
    const TOKEN = Cookie.get(xsrfHeaderName);
    console.log(TOKEN)
    if(TOKEN !== undefined){
      config.headers['Authorization'] = TOKEN
    }
    return config
  },
  error =>{
    console.log(error)
    Promise.reject(error)
  }
)

//响应拦截
axios.interceptors.response.use(res =>{
    const code = res.data.code;
    console.log("响应拦截")
    console.log(res)
    console.log(code)
    if (code === undefined) {
      logout();
      // const router = initRouter(store.state.setting.asyncRoutes)
      router.push('/login')
    }
    if(code === 401){
      console.log(code)
      logout();
      // const router = initRouter(store.state.setting.asyncRoutes)
      router.push('/login')
    }else if(code !== 200){
      console.log(code)
      return Promise.reject('error')
    }else{
      console.log(res.data)
      return res
    }
})



/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params) {
  switch (method) {
    case METHOD.GET:
      return axios.get(url, {params})
    case METHOD.POST:
      return axios.post(url, params)
    default:
      return axios.get(url, {params})
  }
}
/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
//建立token有效期保存token
function setAuthorization(auth, authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      console.log("保存")
      // Cookie.set(xsrfHeaderName, 'Bearer ' + auth.token, {expires: auth.expireAt})
      Cookie.set(xsrfHeaderName, auth.token)
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.remove(xsrfHeaderName)
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      if (Cookie.get(xsrfHeaderName)) {
        return true
      }
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
  return false
}

export {
  METHOD,
  AUTH_TYPE,
  request,
  setAuthorization,
  removeAuthorization,
  checkAuthorization
}
