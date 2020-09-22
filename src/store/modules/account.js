export default {
  namespaced: true,
  state: {
    user: undefined,
    routesConfig: [],
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = localStorage.getItem(process.env.VUE_APP_USER_KEY)
          state.user = JSON.parse(user)
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    },
    routesConfig: state => {
      if (!state.routesConfig || state.routesConfig.length === 0) {
        try {
          const routesConfig = localStorage.getItem(process.env.VUE_APP_ROUTES_KEY)
          state.routesConfig = eval(routesConfig) ? JSON.parse(routesConfig) : state.routesConfig
        } catch (e) {
          console.error(e.message)
        }
      }
      console.log("储存的路由表")
      console.log(state.routesConfig)
      return state.routesConfig
    },
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user))
    },
    setRoutesConfig(state, routesConfig) {
      console.log("然后走到这里？")
      console.log(routesConfig)
      state.routesConfig = routesConfig
      localStorage.setItem(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig))
    },
  }
}
