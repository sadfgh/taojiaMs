<template>
  <a-layout-sider :theme="sideTheme" :class="['side-menu', isMobile ? null : 'shadow']" width="256px" :collapsible="collapsible" v-model="collapsed" :trigger="null">
    <!-- <div :class="['logo', theme]">
      <router-link to="/dashboard/workplace">
        <img src="@/assets/img/logo.png">
        <h1>{{systemName}}</h1>
      </router-link>
    </div> -->
    <div class="information ">
        <header-avatar style="float:left;" class="header-item"/>
        <header-notice style="float:right;" class="header-item"/>
    </div>
    <i-menu :theme="theme" :collapsed="collapsed" :options="menuData" @select="onSelect" class="menu"/>
  </a-layout-sider>
</template>

<script>
import IMenu from './menu'
import {mapState} from 'vuex'
import HeaderAvatar from '@/layouts/header/HeaderlAvatar'
import HeaderNotice from '@/layouts/header/HeaderNotice'


export default {
  name: 'SideMenu',
  components: {IMenu,HeaderAvatar,HeaderNotice},
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  computed: {
    sideTheme() {
      return this.theme == 'light' ? this.theme : 'dark'
    },
    ...mapState('setting', ['isMobile', 'systemName'])
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
@import "index";
.information{
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  padding-right: 30px;
  background: #eee;
}
</style>
