<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="学生管理" name="stu">
        <stu :id="recordid"></stu>
      </el-tab-pane>
      <el-tab-pane label="老师管理" name="tea">
        <tea></tea>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import stu from "./stuInfo";
import tea from "./teaInfo";
export default {
  components: {
    stu,
    tea,
  },
  props: ["id"],
  created() {
    // console.log(this.id);
    this.recordid = this.id;
  },
  data() {
    return {
      activeName: "stu",
      recordid: 0,
    };
  },
  methods: {
    handleClick(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>