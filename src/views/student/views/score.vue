<!--
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
-->
<template>
  <div>
    <el-card>
      <h1>基本信息：</h1>
      <div class="infobox">
        <p style="width: 30%; padding-left: 100px">
          <span>姓名:</span>
          <span>{{ stuinfo.studentname }}</span>
        </p>
        <p style="width: 70%">
          <span>性别:</span>
          <span>{{ stuinfo.gender }}</span>
        </p>
      </div>
      <div class="infobox">
        <p style="width: 30%; padding-left: 100px">
          <span>专业:</span>
          <span>{{ stuinfo.specialized_subject }}</span>
        </p>
        <p style="width: 70%">
          <span>班级:</span>
          <span>{{ stuinfo.calssname }}</span>
        </p>
      </div>
      <div class="infobox">
        <p style="width: 30%; padding-left: 100px">
          <span>选题:</span>
          <span>{{ stuinfo.select_subject }}</span>
        </p>
        <p style="width: 70%">
          <span>老师:</span>
          <span>{{ stuinfo.select_teacher }}</span>
        </p>
      </div>
    </el-card>
    <el-card style="margin-top: 10px">
      <h1>最终得分：</h1>
      <p v-if="!stuinfo.score" class="showscore">
        您的成绩暂未评定，请耐心等待
      </p>
      <p v-else class="showscore">
        您的成绩最终为：
        <el-tag effect="plain" size="medium ">
          {{ stuinfo.score }}
        </el-tag>
      </p>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stuinfo: {},
    };
  },
  created() {
    this.getStuInfo();
  },
  methods: {
    async getStuInfo() {
      let res = await this.$api.getStuInfo({
        id: window.sessionStorage.getItem("id"),
      });
      this.stuinfo = res.data;
      //   console.log(this.stuinfo);
    },
  },
};
</script>

<style lang="scss" scoped>
.infobox {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    font-size: 18px;
    font-weight: 500;
  }
}
.showscore {
  margin-top: 10px;
  margin-left: 100px;
  font-size: 18px;
}
</style>
