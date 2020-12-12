<!--
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
-->
<!--
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
-->





# pc_vue

## [预览](http://47.97.195.37:6808)
<br>
<br>


### 📰这是课程选题系统的前端部分实现，其中有几点写的比较有意思，也算是去尝试了一下Vue中的之前没太用过的API，在此做个记录，供日后参考  
<br>  

此系统分为三个身份登录，教务，老师，学生，教务负责导入和管理人员信息，教师负责出题并审查学生的申请，学生可以选择老师和题目
<br>
### 主要的技术栈为：    

* vue ，vue-router，vuex
* element-ui，axios
* vue-socket.io  
  
<br>
<br>

### 全局接口请求API 🚁:  
为了方便调用与维护，所求的api请求接口写在了[**src/api/api**](https://github.com/windowdotonload/selectSubject-pcFront-Vue/blob/main/src/api/api.js) 文件中，并在[**src/api/globalRequest**](https://github.com/windowdotonload/selectSubject-pcFront-Vue/blob/main/src/api/globalRequest.js)文件中对axios的get和post请求进行了封装。  
<br>
### 登录与鉴权 💽：  
本系统是采用的前后端分离模式开发， 所以鉴权主要是依靠JWT颁发令牌返回给前端，前端在获取到后端返回的token后存储到sessionstorage中，使用[axios拦截器](https://github.com/windowdotonload/selectSubject-pcFront-Vue/blob/main/src/api/globalRequest.js)，每次请求之前在请求信息头部加上Authorization字段，这样可以一定程度上保证了安全性问题。   
   

另外使用vue-router的钩子函数，在每次路由跳转之前检查本地是否存有后端返回的token，如果没有的话直接返回到登录界面。
  
<br>  

### 组件的复用 🔃 :
虽然是分为了三个不同的身份登录，但操作界面都大体相似，Vue中的extends为组件的复用提供了便利。
三个身份的操作界面都继承自[**views/publicContiner**](https://github.com/windowdotonload/selectSubject-pcFront-Vue/blob/main/src/views/publicContiner.vue)组件，而侧边栏和面包的数据是不同的，需要在继承的时候将数据覆盖为对应身份组件本身的数据。  
<br>    
### 面包屑 🍞:
面包屑是根据route对象的matched属性获取，这样当有二级菜单时，也可以显示出一个层级关系。    


<br>  


### 侧边栏 📜：  
侧边栏使用的是element-ui的el-menu，考虑到系统需要分为三个身份登录，每个身份对应的界面都需要有不同的侧边栏，如果是直接在template中写为固定的菜单比较麻烦，而且如果涉及到后期的功能扩展也不易维护。  
所以决定让菜单栏的数据从**路由对象中动态导入**，在[**router/index**](https://github.com/windowdotonload/selectSubject-pcFront-Vue/blob/main/src/router/index.js) 文件中，将三个身份对应的路由导出，侧边栏的菜单在遍历时根据路由对象的meta属性中desc获取，而菜单的小图标可以根据icon属性，动态绑定到class。

<br>  
 


### 通信📡

简单尝试了一下vue-socket。


  
<br/>
<br/>
<br/>


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).




