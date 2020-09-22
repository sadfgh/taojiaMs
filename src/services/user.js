import {LOGIN, ROUTES} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'
// import store from '../store'
/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    name: name,
    password: password
  })
}

async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
function logout() {
  console.log(process.env.VUE_APP_ROUTES_KEY)
  // localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  // localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  localStorage.clear();
  removeAuthorization()
  // localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  // store.commit('setting/setMenuData', [])
  // store.commit('setting/setFuncList', [])
  // store.commit('account/setRoutesConfig', [])
}

export {login, logout, getRoutesConfig}
