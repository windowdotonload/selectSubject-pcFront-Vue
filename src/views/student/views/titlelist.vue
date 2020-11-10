<template>
  <div class="continer">
    <el-button
      @click="studentSelectTeacher"
      type="success"
      size="mini"
      icon="el-icon-plus"
    >
      选择老师
    </el-button>
    <el-button
      @click="studentCustomTitle"
      type="warning"
      size="mini"
      icon="el-icon-edit"
    >
      自定义选题
    </el-button>
    <div style="float: right; display: flex; align-items: center">
      <p style="font-family: 'Arial'; font-weight: 600">所选择的老师：</p>
      <el-tag effect="plain" v-if="teachername"> {{ teachername }} </el-tag>
      <el-tag effect="plain" v-else> 还未选择老师 </el-tag>
      <el-tooltip
        v-if="teachername"
        class="item"
        effect="dark"
        content="确定选择老师"
        placement="top"
      >
        <el-button
          type="success"
          icon="el-icon-check"
          circle
          size="mini"
          style="margin-left: 10px; margin-right: 30px"
          @click="confirmTeacher"
        ></el-button>
      </el-tooltip>
    </div>
    <splitline></splitline>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title_name" label="题目名称"> </el-table-column>
      <el-table-column prop="title_description" label="题目描述">
      </el-table-column>
    </el-table>

    <!-- 选择老师对话框 -->
    <el-dialog title="选择所属的老师" :visible.sync="selectDialogVisible">
      <el-table
        ref="studentSelectTeacherTable"
        :data="studentSelectTeacherTableData"
        tooltip-effect="dark"
        style="width: 100%"
        @select="selectRow"
        @select-all="selectAll"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="教师姓名" prop="teachername"> </el-table-column>
        <el-table-column label="所带专业系别" prop="specialized_subject">
        </el-table-column>
        <el-table-column label="职称" prop="professional"> </el-table-column>
        <el-table-column label="手机号" prop="phonenumber"> </el-table-column>
        <el-table-column label="QQ" prop="tecentqnumber"> </el-table-column>
      </el-table>
      <div style="width: 100%; text-align: center; margin-top: 10px">
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitStudentSelectTeacher">
            确 定
          </el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 自定义选题对话框 -->
    <el-dialog
      title="自定义选题"
      :visible.sync="customDialogVisible"
      width="30%"
    >
      <span>这是一段信息</span>
      <div style="width: 100%; text-align: center; margin-top: 10px">
        <span slot="footer" class="dialog-footer">
          <el-button @click="customDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitCustomTitle">
            确 定
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import splitline from "@/components/splitline";

export default {
  components: {
    splitline,
  },
  data() {
    return {
      tableData: [],
      selectDialogVisible: false,
      customDialogVisible: false,
      studentSelectTeacherTableData: [],
      //根据学生对应的记录id查找参与这条记录的老师
      recordid: window.sessionStorage.getItem("recordid"),
      studentid: window.sessionStorage.getItem("id"),
      selectTeacherId: 0,
      teachername: "",
    };
  },
  created() {
    this.createdShowSelectTeacherId();
    this.stuGetSelectTeacherName();
    this.getStuInfo();
  },
  methods: {
    async getStuInfo() {
      this.$api.getStuInfo({ id: window.sessionStorage.getItem("id") });
    },
    confirmTeacher() {
      this.$confirm("确定选择老师后将不可更改，是否确认选择?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$api.confirmSelectTeacher({
            id: this.studentid,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async studentSelectTeacher() {
      let res = await this.$api.showAllStudentCanSelectTeacher({
        recordid: this.recordid,
      });
      if (res.msg === "success") {
        this.studentSelectTeacherTableData = res.data;
        this.selectDialogVisible = true;
      }
    },
    async stuGetSelectTeacherName() {
      let res = await this.$api.stuGetSelectTeacherName({ id: this.studentid });
      this.teachername = res.data.teachername;
    },
    studentCustomTitle() {
      this.customDialogVisible = true;
    },
    handleSelectionChange(val) {
      // console.log(val);
    },
    selectRow(val, row) {
      // console.log(val);
      // console.log(row);
      this.$refs.studentSelectTeacherTable.clearSelection();
      this.$refs.studentSelectTeacherTable.toggleRowSelection(row, true);
      this.selectTeacherId = row.id;
      // console.log(this.selectTeacherId);
    },
    selectAll() {
      this.$refs.studentSelectTeacherTable.clearSelection();
    },
    // 将选择的老师的id存储到数据库中
    async saveTeacherId() {
      let res = await this.$api.saveTeacherId({
        studentid: this.studentid,
        teacherid: this.selectTeacherId,
      });
      if (res.msg === "success") {
        window.sessionStorage.setItem("selectTeacherId", res.data.teacherid);
      }
    },
    async createdShowSelectTeacherId() {
      let res = await this.$api.createdShowSelectTeacherId({
        id: this.studentid,
      });
      this.tableData = res.data;
    },
    async showSelectTeacherTitle(params) {
      let res = await this.$api.showSelectTeacherTitle({
        id: params,
      });
      if (res.msg === "success") {
        this.tableData = res.data;
        this.selectDialogVisible = false;
      }
    },
    submitStudentSelectTeacher() {
      // this.selectDialogVisible = false;
      this.saveTeacherId();
      this.showSelectTeacherTitle(this.selectTeacherId);
      this.stuGetSelectTeacherName();
    },
    submitCustomTitle() {
      this.customDialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>