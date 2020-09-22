import config from '@/config'
import {ADMIN} from '@/config/default'
export default {
  namespaced: true,
  state: {
    isMobile: false,
    animates: ADMIN.animates,
    palettes: ADMIN.palettes,
    dustbins: [],
    pageMinHeight: 0,
    menuData: [],
    //功能权限
    funcList:[],
    ...config,
  },
  mutations: {
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setTheme (state, theme) {
      state.theme = theme
    },
    setLayout (state, layout) {
      state.layout = layout
    },
    setMultiPage (state, multiPage) {
      state.multiPage = multiPage
    },
    setAnimate (state, animate) {
      state.animate = animate
    },
    setWeekMode(state, weekMode) {
      state.weekMode = weekMode
    },
    setFixedHeader(state, fixedHeader) {
      state.fixedHeader = fixedHeader
    },
    setFixedSideBar(state, fixedSideBar) {
      state.fixedSideBar = fixedSideBar
    },
    setLang(state, lang) {
      state.lang = lang
    },
    setHideSetting(state, hideSetting) {
      state.hideSetting = hideSetting
    },
    setDustbins(state, dustbins) {
      state.dustbins = dustbins
    },
    correctPageMinHeight(state, minHeight) {
      state.pageMinHeight += minHeight
    },
    setMenuData(state, menuData) {
      state.menuData = menuData
    },
    setFuncList(state, funcList) {
      state.funcList = funcList
      localStorage.setItem(process.env.VUE_APP_FUNCLIST_KEY, JSON.stringify(funcList))
    },

    // setAsyncRoutes(state, asyncRoutes) {
    //   state.asyncRoutes = asyncRoutes
    // }
  }
}
