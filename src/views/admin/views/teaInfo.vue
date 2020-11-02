<template>
  <div>
    <el-button
      type="success"
      icon="el-icon-edit"
      size="mini"
      @click="selectTeacher"
    >
      选择教师
    </el-button>
    <el-table :data="selectTableData" style="width: 100%">
      <el-table-column prop="" label="用户名"> </el-table-column>
      <el-table-column prop="" label="密码"> </el-table-column>
      <el-table-column prop="" label="教师姓名"> </el-table-column>
      <el-table-column prop="" label="所带专业系别"> </el-table-column>
      <el-table-column prop="" label="毕设题目数量"> </el-table-column>
    </el-table>
    <el-dialog
      title="选择课程设计老师"
      :visible.sync="dialogVisible"
      width="60%"
      @close="selectClose"
    >
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="teachername" label="姓名" width="300">
        </el-table-column>
        <el-table-column
          prop="specialized_subject"
          label="所带专业系别"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitSelectTeacher">
            确 定
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      tableData: [],
      selectTableData: [],
      count: 0,
      dialogVisible: false,
      tableData: [],
      pageParams: {
        pagesize: 5,
        pagenumber: 1,
      },
      multipleSelection: [],
      postParams: {
        recordid: 0,
        teacherid: [],
      },
    };
  },
  created() {
    this.postParams.recordid = this.id;
    this.showTeacher();
    this.showSelectTeacher();
  },
  methods: {
    selectClose() {
      this.$refs.multipleTable.clearSelection();
    },
    selectTeacher() {
      this.dialogVisible = true;
    },
    async showTeacher() {
      let res = await this.$api.showTeacher(this.pageParams);
      this.tableData = res.data.pageData;
      this.count = res.data.count;
    },
    async showSelectTeacher() {
      let res = await this.$api.showSelectTeacher({ id: this.id });
    },
    async submitSelectTeacher() {
      // console.log(this.postParams);
      let res = await this.$api.addTeaToRecord(this.postParams);
      if (res.msg === "success") {
        this.dialogVisible = false;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.postParams.teacherid = [];
      // console.log(this.id);
      // console.log(this.multipleSelection);
      this.multipleSelection.forEach((item) => {
        if (!this.postParams.teacherid.includes(item.id)) {
          this.postParams.teacherid.push(item.id);
        }
      });
    },
  },
};
</script>