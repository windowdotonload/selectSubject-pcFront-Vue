<template>
  <div>
    <el-button
      v-if="status == 1"
      type="success"
      icon="el-icon-edit"
      size="mini"
      @click="selectTeacher"
    >
      选择教师
    </el-button>
    <el-table
      :data="selectTableData"
      style="width: 100%"
      @row-click="showTeacherTitle"
    >
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="password" label="密码" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="teachername" label="教师姓名"> </el-table-column>
      <el-table-column prop="specialized_subject" label="所带专业系别">
      </el-table-column>
      <el-table-column prop="phonenumber" label="手机号"> </el-table-column>
      <el-table-column prop="tecentqnumber" label="QQ"> </el-table-column>
      <el-table-column prop="professional" label="教师职称"> </el-table-column>
      <!-- <el-table-column prop="titlenumber" label="毕设题目数量" align="center">
      </el-table-column> -->
      <el-table-column align="center" label="操作" v-if="status == 1">
        <template v-slot="{ row }">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click.stop="deleteSelectTeacher(row)"
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
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column prop="teachername" label="姓名" width="300">
        </el-table-column>
        <el-table-column
          prop="specialized_subject"
          label="所带专业系别"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <div style="width: 100%; text-align: center; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pagenumber"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitSelectTeacher">
            确 定
          </el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 教师所出题目弹框 -->
    <el-dialog title="所出题目详情" :visible.sync="teacherTitleVisible">
      <p style="margin-left: 10px">
        共
        <strong style="margin: 5px">{{ count }}</strong>
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
  props: ["id", "status"],
  data() {
    return {
      tableData: [],
      selectTableData: [],
      teacherTitleTableData: [],
      count: 0,
      titlenumber: 0,
      dialogVisible: false,
      teacherTitleVisible: false,
      count: 0,
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
    handleSizeChange(val) {
      this.pageParams.pagesize = val;
      this.showTeacher();
    },
    handleCurrentChange(val) {
      this.pageParams.pagenumber = val;
      this.showTeacher();
    },
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
    // 点击某一行显示这个教师所出题目的详情
    async showTeacherTitle(row) {
      // console.log(row);
      this.teacherTitleVisible = true;
      let res = await this.$api.adminShowTeacherTitle({
        teacherid: row.id,
        recordid: this.id,
      });
      if (res.msg == "success") {
        this.teacherTitleTableData = res.data;
        this.count = this.teacherTitleTableData.length;
      }
    },

    // 根据对应的记录id和教师id在关系表中删除
    deleteSelectTeacher(row) {
      // console.log(row);
      if (row.titlenumber != 0) {
        return this.$message.info("该教师已出题");
      }
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