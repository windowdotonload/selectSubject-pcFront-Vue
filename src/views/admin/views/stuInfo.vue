<template>
  <div class="continer">
    <div>
      <el-alert title="" type="warning" effect="dark">
        <p>
          请选择要导入的学生信息EXCEL表，表中需要包含的字段与下表保持一致
          初始用户名和密码均为学生的学号。
        </p>
      </el-alert>
      <el-upload
        style="margin: 10px 0"
        class="upload-demo"
        action="/receiveFile"
        accept=".xlsx"
        :limit="1"
        :on-exceed="handleExceed"
        :on-success="successResponse"
        :on-error="errResponse"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <i class="el-icon-warning-outline icon-self"></i>
        <span class="tip">只能上传xlsx文件，且不超过500kb </span>
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
        <el-table-column prop="select_teacher" label="所选老师">
        </el-table-column>
        <el-table-column prop="select_subject" label="所选课题">
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
  </div>
</template>

<script>
export default {
  created() {
    this.showStuData();
  },
  data() {
    return {
      fileList: [],
      tableData: [],
      loading: false,
      pageParams: {
        pagesize: 5,
        pagenumber: 1,
      },
      count: 0,
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageParams.pagesize = val;
      this.showStuData();
    },
    handleCurrentChange(val) {
      this.pageParams.pagenumber = val;
      this.showStuData;
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
    async successResponse(val) {
      // console.log("上传成功钩子", val);
      if (val.status === 0) {
        this.$message.success(val.msg);
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
</style>