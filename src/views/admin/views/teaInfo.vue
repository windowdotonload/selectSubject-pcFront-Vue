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
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="password" label="密码" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="teachername" label="教师姓名"> </el-table-column>
      <el-table-column prop="specialized_subject" label="所带专业系别">
      </el-table-column>
      <el-table-column prop="titlenumber" label="毕设题目数量" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template v-slot="{ row }">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteSelectTeacher(row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 选择老师对话框 -->
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
      titlenumber: 0,
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
      if (res.msg === "success") {
        this.selectTableData = res.data;
      }
    },
    async submitSelectTeacher() {
      // console.log(this.postParams);
      let res = await this.$api.addTeaToRecord(this.postParams);
      if (res.msg === "success") {
        this.dialogVisible = false;
        this.showSelectTeacher();
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

    // 根据对应的记录id和教师id在关系表中删除
    deleteSelectTeacher(row) {
      // console.log(row);
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$api.deleteSelectTeacher({
            teacherid: row.id,
            recordid: this.id,
          });
          if (res.msg === "success") {
            this.showSelectTeacher();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>