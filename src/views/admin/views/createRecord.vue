<template>
  <div class="continer">
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addRecord"
        >创建</el-button
      >
      <hr class="split" />
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 20px"
        @row-click="toDetail"
      >
        <el-table-column prop="recordname" label="记录名称"> </el-table-column>
        <el-table-column prop="createdAt" label="创建日期"> </el-table-column>
        <el-table-column prop="deadline" label="截止日期"> </el-table-column>
        <el-table-column prop="studentnumber" label="学生人数">
        </el-table-column>
        <el-table-column prop="teachernumber" label="教师人数">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click.stop="deleteRow(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click.stop="deleteRow(row)"
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
    <!-- 添加记录信息对话框 -->
    <el-dialog
      @close="dialogClose"
      title="添加记录信息"
      :visible="dialogVisible"
      width="30%"
    >
      <span slot="footer" class="dialog-footer">
        <el-form
          :rules="rules"
          ref="recordForm"
          :model="recordForm"
          label-width="100px"
        >
          <el-form-item label="记录名称" prop="recordname">
            <div class="format">
              <el-input
                v-model="recordForm.recordname"
                :placeholder="exampleText"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="截止日期" prop="deadline">
            <div class="format">
              <el-date-picker
                v-model="recordForm.deadline"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 101%"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="学生人数" prop="studentnumber">
            <div class="format">
              <el-input
                v-model.number="recordForm.studentnumber"
                placeholder="请输入数字"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="教师人数" prop="teachernumber">
            <div class="format">
              <el-input
                v-model.number="recordForm.teachernumber"
                placeholder="请输入数字"
              ></el-input>
            </div>
          </el-form-item>
        </el-form>
        <div style="width: 100%; display: flex; justify-content: center">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submiRecord"> 确 定 </el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 修改记录信息对话框 -->
    <el-dialog
      title="修改记录信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClose"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiEditRecord">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let isNumber = (rule, value, callback) => {
      // console.log(value);
      // console.log(typeof value);
      let isnumber = typeof value == "number";
      console.log(isnumber);
      if (!isnumber) {
        return callback(new Error("请输入数字"));
      } else {
        return callback();
      }
    };
    return {
      tableData: [],
      dialogVisible: false,
      editDialogVisible: false,
      exampleText: "例如：2020年毕业设计课程选题信息记录",
      recordForm: {
        recordname: "",
        deadline: "",
        studentnumber: "",
        teachernumber: "",
      },
      // 分页请求参数
      pageParams: {
        pagesize: 5,
        pagenumber: 1,
      },
      // 总数
      count: 0,
      rules: {
        recordname: [
          {
            required: true,
            message: "请输入要创建的记录名称",
            trigger: "blur",
          },
        ],
        deadline: [
          {
            required: true,
            message: "请选择截止的日期",
            trigger: "blur",
          },
        ],
        studentnumber: [
          {
            required: true,
            message: "请输入学生的人数",
            trigger: "blur",
          },
          { validator: isNumber, trigger: "blur" },
        ],
        teachernumber: [
          {
            required: true,
            message: "请输入教师的人数",
            trigger: "blur",
          },
          { validator: isNumber, trigger: "blur" },
        ],
      },
    };
  },
  async created() {
    this.refreshTable();
  },
  methods: {
    editDialogClose() {},
    submiEditRecord() {
      this.editDialogVisible = false;
    },
    // 删除记录数据，同时也要删除与记录有关联的学生和老师的数据
    deleteRow(row) {
      // console.log(row);
      this.$confirm(
        "请谨慎删除，此操作将同时删除本记录下的所有学生与老师的数据，是否确认继续删除？",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          let res = await this.$api.deleteRecord({ id: row.id });
          // console.log(res);
          this.refreshTable();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 创建记录后跳转到详细操作页，添加学生和老师的信息
    toDetail(row, column, event) {
      // console.log("rowData is ", row);
      this.$router.push({ path: `recordDetail/${row.id}` });
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$refs.recordForm.resetFields();
    },
    handleSizeChange(val) {
      // 改变每页显示的数据
      this.pageParams.pagesize = val;
      this.refreshTable();
    },
    handleCurrentChange(val) {
      // 改变当前页数
      this.pageParams.pagenumber = val;
      this.refreshTable();
    },
    async refreshTable() {
      let res = await this.$api.getRecord(this.pageParams);
      // console.log("result is  ", res);
      this.tableData = res.data.pageData;
      this.count = res.data.count;
    },
    addRecord() {
      this.dialogVisible = true;
    },
    submiRecord() {
      this.$refs.recordForm.validate(async (valid) => {
        if (valid) {
          // console.log(this.recordForm);
          let res = await this.$api.addRecord(this.recordForm);
          // console.log("res   ", res);
          if (res.status === 0) {
            this.$message({
              message: "添加记录成功",
              type: "success",
            });
            this.refreshTable();
            this.dialogVisible = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.split {
  width: 120%;
  margin-top: 10px;
  margin-left: -20px;
  border: none;
  border-top: 1px solid #dfe6e9;
}
.format {
  width: 80%;
}
.pagination {
  width: 100%;
  margin-top: 15px;
  text-align: right;
}
.continer {
  min-height: 550px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>