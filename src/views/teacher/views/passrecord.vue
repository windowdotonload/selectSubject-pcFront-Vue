<!--
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
-->
<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="" label="记录名称"> </el-table-column>
      <el-table-column prop="" label="创建日期"> </el-table-column>
      <el-table-column prop="" label="截止日期"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: {},
    };
  },
};
</script>