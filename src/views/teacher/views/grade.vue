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
<template>
  <div>
    <el-table :data="studentTableData" style="width: 100%">
      <el-table-column prop="studentname" label="姓名"> </el-table-column>
      <el-table-column prop="gender" label="性别"> </el-table-column>
      <el-table-column prop="specialized_subject" label="专业">
      </el-table-column>
      <el-table-column prop="calssname" label="班级" align="center">
      </el-table-column>
      <el-table-column prop="studentnumber" label="学号"> </el-table-column>
      <el-table-column label="所选课题" show-overflow-tooltip>
        <template v-slot="{ row }">
          <p v-if="row.select_subject">{{ row.select_subject }}</p>
          <el-tag v-else>待定</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="评分">
        <template v-slot="{ row }">
          <p v-if="row.score">{{ row.score }}</p>
          <p v-else>暂未评分</p>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <div style="display: flex; align-items: center">
            <el-select v-model="row.score" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button
              style="margin-left: 10px"
              type="success"
              icon="el-icon-check"
              circle
              size="mini"
              @click="score(row)"
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentTableData: [],
      id: window.sessionStorage.getItem("id"),
      options: [
        {
          value: "优秀",
          label: "优秀",
        },
        {
          value: "良好",
          label: "良好",
        },
        {
          value: "中等",
          label: "中等",
        },
        {
          value: "及格",
          label: "及格",
        },
        {
          value: "不及格",
          label: "不及格",
        },
      ],
    };
  },
  created() {
    this.teaGetSelectStuInfo();
  },
  methods: {
    async score(row) {
      // console.log(row);
      let res = await this.$api.teacherSubmitScore(row);
      if (res.msg == "success") {
        this.teaGetSelectStuInfo();
        this.$message.success("给定评级成功");
      }
    },
    async teaGetSelectStuInfo() {
      let res = await this.$api.teaGetSelectStuInfo({ id: this.id });
      if (res.msg == "success") {
        this.studentTableData = res.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
