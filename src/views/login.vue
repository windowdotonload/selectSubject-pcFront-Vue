<template>
  <div class="continer">
    <div>
      <el-form :model="loginForm" ref="loginForm" :rules="rules">
        <el-form-item prop="userName">
          <el-input
            v-model.trim="loginForm.userName"
            placeholder="账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            type="password"
            v-model.trim="loginForm.passWord"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="loginType" class="radioSel">
          <el-radio v-model="loginForm.loginType" label="1">教务</el-radio>
          <el-radio v-model="loginForm.loginType" label="2">老师</el-radio>
          <el-radio v-model="loginForm.loginType" label="3">学生</el-radio>
        </el-form-item>
      </el-form>
      <div class="button-continer">
        <el-button type="primary" @click="login">L O G I N</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const validateLength = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("输入密码长度不小于六位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        userName: "",
        passWord: "",
        loginType: "",
      },
      routerArr: ["admin", "teacher", "student"],
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        passWord: [
          { required: true, message: "请输入账号", trigger: "change" },
          { validator: validateLength, trigger: "blur" },
        ],
        loginType: [
          { required: true, message: "请选择身份类型", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    login() {
      const type = this.loginForm.loginType - 1;
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          let res = await this.$api.login(this.loginForm);
          // console.log("--------");
          // console.log(res);
          // console.log("--------");
          if (res.msg === "success") {
            window.sessionStorage.setItem("username", res.data.username);
            window.sessionStorage.setItem("token", res.token);
            this.$store.commit("recordId", res.data.id);

            this.$message({
              message: "登录成功",
              type: "success",
            });
            this.$router.push({ name: this.routerArr[type] });
          } else {
            this.$message({
              message: res.msg,
              type: "info",
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.button-continer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.el-button {
  width: 350px;
}
.continer {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    60deg,
    rgba(52, 152, 219, 0.5),
    rgba(230, 126, 34, 0.6),
    #2980b9
  );
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.el-form {
  width: 360px;
}
.el-input {
  margin: 5px;
}
.radioSel {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>