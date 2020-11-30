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
    <el-table
      :data="tableData"
      style="width: 100%"
      @row-click="showTitleDetail"
    >
      <el-table-column prop="recordname" label="记录名称"> </el-table-column>
      <el-table-column prop="createdAt" label="创建日期"> </el-table-column>
      <el-table-column prop="deadline" label="截止日期"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  async created() {
    let res = await this.$api.teacherLookUpPastRecord();
    this.tableData = res.data;
  },
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    showTitleDetail(row) {
      // console.log(row);
      this.$router.push({ path: `/teachershowtd/${row.id}` });
    },
  },
};
</script>