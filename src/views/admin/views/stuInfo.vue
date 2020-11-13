<template>
  <div class="continer">
    <div>
      <el-alert title="" type="warning" effect="dark" v-if="status == 1">
        <p>
          请选择要导入的学生信息EXCEL表，表中需要包含的字段与下表保持一致
          初始用户名和密码均为学生的学号。
        </p>
      </el-alert>
      <el-upload
        v-if="status == 1"
        style="margin: 10px 0"
        class="upload-demo"
        action="/receiveFile"
        accept=".xlsx"
        :limit="1"
        :on-exceed="handleExceed"
        :on-success="successResponse"
        :before-upload="addRecordId"
        :on-error="errResponse"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <i class="el-icon-warning-outline icon-self"></i>
        <span class="tip">只能上传xlsx文件</span>
      </el-upload>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        element-loading-text="学生数据载入中"
      >
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="studentname" label="姓名"> </el-table-column>
        <el-table-column prop="studentage" label="年龄"> </el-table-column>
        <el-table-column prop="gender" label="性别"> </el-table-column>
        <el-table-column prop="specialized_subject" label="专业">
        </el-table-column>
        <el-table-column prop="calssname" label="班级" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="studentnumber" label="学号"> </el-table-column>
        <el-table-column prop="political_status" label="政治面貌">
        </el-table-column>
        <el-table-column prop="ethnic_groups" label="民族"> </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="select_teacher"
          label="所选老师"
        >
        </el-table-column>
        <el-table-column
          prop="select_subject"
          label="所选课题"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="status == 1">
          <template v-slot="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editStudent(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteStudent(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
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

    <!-- 编辑学生信息对话框 -->
    <el-dialog
      title="编辑学生信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClose"
    >
      <el-form
        :model="editStudentForm"
        :rules="rules"
        ref="editStudentForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="重置密码" prop="password">
          <div class="format">
            <el-input v-model="editStudentForm.password"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="所选老师" prop="select_teacher">
          <div class="format">
            <el-input v-model="editStudentForm.select_teacher"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div style="width: 100%; text-align: center">
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditStudent">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["id", "status"],
  created() {
    // console.log("stu id is  ", this.id);
    this.pageParams.recordid = this.id;
    this.showStuData();
  },
  data() {
    const validateLength = (rule, value, callback) => {
      if (value == "") {
        callback();
      } else if (value.length < 6) {
        callback(new Error("输入密码长度不小于六位"));
      } else {
        callback();
      }
    };
    return {
      fileList: [],
      tableData: [],
      loading: false,
      pageParams: {
        recordid: 0,
        pagesize: 5,
        pagenumber: 1,
        recordid: 0,
      },
      count: 0,
      editDialogVisible: false,
      editStudentForm: {
        id: 0,
        password: "",
        select_teacher: "",
      },
      rules: {
        password: [{ validator: validateLength, trigger: "blur" }],
        select_teacher: [],
      },
    };
  },
  methods: {
    editDialogClose() {
      this.$refs.editStudentForm.resetFields();
    },
    editStudent(row) {
      // console.log(row);
      this.editStudentForm.id = row.id;
      this.editDialogVisible = true;
    },
    submitEditStudent() {
      this.$refs.editStudentForm.validate(async (valid) => {
        if (valid) {
          let res = await this.$api.submitEditStudent(this.editStudentForm);
          if (res.msg === "success") {
            this.showStuData();
            this.$message.success("更新学生信息成功");
            this.editDialogVisible = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteStudent(row) {
      // console.log(row);
      this.$confirm("确定删除此学生数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$api.deleteStudent({ id: row.id });
          if (res.msg === "success") {
            this.showStuData();
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
    handleSizeChange(val) {
      this.pageParams.pagesize = val;
      this.showStuData();
    },
    handleCurrentChange(val) {
      this.pageParams.pagenumber = val;
      this.showStuData();
    },
    async showStuData() {
      let res = await this.$api.showStudent(this.pageParams);
      if (res.status === 0) {
        this.loading = false;
        this.tableData = res.data.pageData;
        this.count = res.data.count;
      }
    },
    handleExceed(files, fileList) {
      console.log("files  ", files);
      console.log("fileList   ", fileList);
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    addRecordId() {
      // console.log("before");
      // console.log(this.id);
      this.$api.addRecordId({ id: this.id });
    },
    async successResponse(val) {
      // console.log("success");
      // console.log("上传成功钩子", val);
      if (val.status === 0) {
        // this.$message.success(val.msg);
        this.loading = true;
        this.showStuData();
        this.fileList = [];
      } else {
        this.$message({
          message: "文件上传失败",
          type: "info",
        });
      }
    },
    errResponse() {
      this.$message({
        message: "文件上传失败",
        type: "info",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tip {
  margin-left: 10px;
  font-size: 12px;
}
.icon-self {
  position: relative;
  top: 2px;
  left: 6px;
}
.pagination {
  width: 100%;
  margin-top: 15px;
  text-align: right;
}
.continer {
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.format {
  width: 80%;
}
</style>