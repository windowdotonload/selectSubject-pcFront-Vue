<!--
 * @Descripttion:想要更改选题其实就是将学生的选题状态改为0，并且将之前的选题信息清除，将之前选择的题目信息还原为为选择
 *               具体是修改student-- select_title_status：0 ，更具学生表中titleid修改title -- status：0
 * @version: 
 * @Author: windowdotonload
-->

<template>
  <div class="continer">
    <div
      class="warnEdit"
      v-if="!stuinfo.select_title_status || stuinfo.select_title_status == 0"
    >
      <span>
        <img src="@/public/img/warn.png" alt="" />
      </span>
      <p class="warntext">还未选择题目，无法申请修改</p>
    </div>
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
    },
  },
};
</script>



<style lang="scss" scoped>
.warnEdit {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
}
.warntext {
  margin-left: 15px;
  font-size: 16px;
  font-weight: bold;
  color: rgb(170, 170, 170);
}
</style>