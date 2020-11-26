<template>
  <div class="continer">
    <el-container class="app-continer">
      <el-header class="header">
        <div class="header-left">
          <el-tooltip
            effect="dark"
            :content="ifExtend ? '收起侧边栏' : '展开侧边栏'"
            @click="toggle"
          >
            <span class="ifShowIcon" @click="oRc">
              <img :src="require('../public/img/caidan.png')" alt="" />
            </span>
          </el-tooltip>
          <!-- 面包屑 -->
          <el-breadcrumb
            separator="/"
            style="margin-left: 60px; margin-top: -15px"
          >
            <transition-group>
              <el-breadcrumb-item v-for="(item, i) in breadData" :key="i">
                <span style="font-weight: 700">
                  {{ item.meta.desc }}
                </span>
              </el-breadcrumb-item>
            </transition-group>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-popover
            class="pop"
            ref="popover"
            placement="right"
            trigger="hover"
          >
            <p class="pop">{{ username }}</p>
          </el-popover>

          <img
            v-popover:popover
            class="userIcon"
            src="../public/img/yonghu.png"
            alt=""
          />
          <el-button @click="loginOut">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="istoggle ? '130px' : '230px'" class="aside">
          <el-card>
            <el-menu
              :default-active="active"
              :unique-opened="true"
              :collapse="istoggle"
              router
              active-text-color="#5C9ACF"
              text-color="#576574"
              class="el-menu-vertical-demo"
            >
              <div v-for="(item, i) in menuData" :key="i">
                <!-- 如果一个路由没有子路有则不使用二级菜单 -->
                <el-menu-item
                  v-if="!item.children"
                  @click="state(item.path)"
                  :index="item.path"
                >
                  <i :class="item.meta.icon"></i>
                  <span v-if="!istoggle" class="showDesc">{{
                    item.meta.desc
                  }}</span>
                </el-menu-item>
                <!-- 如果一个路由有子路由那么使用二级菜单 -->
                <el-submenu v-else :index="item.path">
                  <template slot="title">
                    <i :class="item.meta.icon"></i>
                    <span v-if="!istoggle" class="showDesc">
                      {{ item.meta.desc }}
                    </span>
                  </template>
                  <span v-for="(item1, i) in item.children" :key="i">
                    <el-menu-item
                      v-if="item1.meta"
                      :index="item1.path"
                      @click="state(item1.path)"
                    >
                      <i :class="item1.meta.icon"></i>
                      <span class="showDesc">
                        {{ item1.meta.desc }}
                      </span>
                    </el-menu-item>
                  </span>
                </el-submenu>
              </div>
            </el-menu>
          </el-card>
        </el-aside>
        <el-main class="main">
          <el-card>
            <router-view></router-view>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
/**
 *
 *  教务，学生，老师的控制面板均继承于此组件，在使用的时候提供menuData的数据，
 *  即   import { admin, student, teacher } from "@/router/index.js";
 *  对应的组件import对应的路由数据
 *
 */
// import { admin, student, teacher } from "@/router/index.js";
export default {
  async created() {
    // this.menuData = admin;
    // this.breadData = this.$route.matched;
    console.log("route", this.$route);
    console.log("matched   ", this.$route.matched);
    this.active = window.sessionStorage.getItem("active");
    this.username += window.sessionStorage.getItem("username");
  },
  watch: {
    "$route.matched"(val) {
      this.breadData = val;
    },
  },
  data() {
    return {
      istoggle: false,
      logintype: "default",
      ifExtend: true,
      active: "",
      menuData: [],
      breadData: [],
      username: "用户：",
    };
  },
  methods: {
    // 侧边栏是否展开openORclose
    oRc() {
      this.ifExtend = !this.ifExtend;
      this.istoggle = !this.istoggle;
    },
    state(path) {
      // console.log("matched   ", this.$route.matched);
      // console.log(path);
      window.sessionStorage.setItem("active", path);
    },
    // 点击面包屑(span标签)刷新sessionstorage并跳转路由，暂时先取消使用
    refresh(path) {
      window.sessionStorage.setItem("active", path);
      this.$router.push({ path: path });
      document.location.reload();
    },
    toggle() {
      this.istoggle = !this.istoggle;
      console.log(this.istoggle);
    },
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}
.continer {
  height: 100%;
}
.app-continer {
  min-height: 100%;
}
.header {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ifShowIcon {
  display: flex;
  height: 60%;
  width: 50px;
  background-position: 20px 20px;
  align-items: center;
  justify-content: center;
}
.aside {
  padding: 20px 10px;
}
.main {
  padding: 20px 10px;
}
.el-card {
  min-height: 98%;
}
.el-menu {
  border: none;
}
.el-menu-item {
  height: 50px;
  line-height: 50px;
}
.header-right {
  position: relative;
}
.userIcon {
  position: absolute;
  top: 3px;
  right: 90px;
}
.pop {
  text-align: center;
  font-weight: 500;
  font-size: 15px;
}
.showDesc {
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  font-weight: 500;
}
</style>