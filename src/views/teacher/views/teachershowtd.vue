<!--
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
-->
<template>
  <div>
    <el-page-header @back="$router.go(-1)"> </el-page-header>
    <el-table
      :data="TableData"
      style="width: 100%"
      @row-click="showTeacherTitle"
    >
      <el-table-column prop="teachername" label="教师姓名"> </el-table-column>
      <el-table-column prop="specialized_subject" label="所带专业系别">
      </el-table-column>
      <el-table-column prop="phonenumber" label="手机号"> </el-table-column>
      <el-table-column prop="tecentqnumber" label="QQ"> </el-table-column>
      <el-table-column prop="professional" label="教师职称"> </el-table-column>
    </el-table>

    <!-- 教师所出题目弹框 -->
    <el-dialog title="所出题目详情" :visible.sync="teacherTitleVisible">
      <p style="margin-left: 10px">
        共
        <strong style="margin: 5px">
          {{ teacherTitleTableData.length }}
        </strong>
        条题目
      </p>
      <el-table :data="teacherTitleTableData" style="width: 100%">
        <el-table-column prop="title_name" label="题目名称"> </el-table-column>
        <el-table-column
          prop="title_name"
          label="题目描述"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["id"],
  created() {
    this.showTeacher();
  },
  data() {
    return {
      TableData: [],
      teacherTitleVisible: false,
      teacherTitleTableData: [],
    };
  },
  methods: {
    async showTeacher() {
      let res = await this.$api.showSelectTeacher({ id: this.id });
      if (res.msg === "success") {
        this.TableData = res.data;
      }
    },
    async showTeacherTitle(row) {
      let res = await this.$api.adminShowTeacherTitle({
        teacherid: row.id,
        recordid: this.id,
      });
      if (res.msg == "success") {
        this.teacherTitleTableData = res.data;
      }
      this.teacherTitleVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
