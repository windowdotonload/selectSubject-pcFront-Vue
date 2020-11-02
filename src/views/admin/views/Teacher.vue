<template>
  <div class="continer">
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addTeacher">
        添加教师
      </el-button>
      <hr class="split" />

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="password" label="密码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="teachername" label="教师姓名"> </el-table-column>
        <el-table-column prop="specialized_subject" label="所带专业系别">
        </el-table-column>
        <el-table-column>
          <template v-slot:default="{ row }">
            <el-button
              type="success"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editTeacher(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        class="pagination"
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
    <!-- 添加Dialog -->
    <el-dialog
      @close="dialogClose"
      title="添加一个新的教师"
      :visible="dialogVisible"
      width="30%"
    >
      <span slot="footer" class="dialog-footer">
        <el-form
          :rules="rules"
          ref="teacherForm"
          :model="teacherForm"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <div class="format">
              <el-input
                v-model="teacherForm.username"
                placeholder="请输入教师登录用户名"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <div class="format">
              <el-input
                v-model="teacherForm.password"
                placeholder="请输入教师登录密码"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="教师姓名" prop="teachername">
            <div class="format">
              <el-input
                v-model="teacherForm.teachername"
                placeholder="请输入教师真实姓名"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="所带专业" prop="specialized_subject">
            <div class="format">
              <el-input
                v-model="teacherForm.specialized_subject"
                placeholder="请输入教师所带专业学科"
              ></el-input>
            </div>
          </el-form-item>
        </el-form>
        <div style="width: 100%; display: flex; justify-content: center">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitTacher"> 确 定 </el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 编辑教师信息Dialog -->
    <el-dialog
      @close="EditClose"
      title="修改教师信息"
      :visible="dialogEditVisible"
      width="30%"
    >
      <span slot="footer" class="dialog-footer">
        <el-form
          :rules="rules"
          ref="teacherEditForm"
          :model="editForm"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <div class="format">
              <el-input
                v-model="editForm.username"
                placeholder="请输入教师登录用户名"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <div class="format">
              <el-input
                v-model="editForm.password"
                placeholder="请输入教师登录密码"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="教师姓名" prop="teachername">
            <div class="format">
              <el-input
                v-model="editForm.teachername"
                placeholder="请输入教师真实姓名"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="所带专业" prop="specialized_subject">
            <div class="format">
              <el-input
                v-model="editForm.specialized_subject"
                placeholder="请输入教师所带专业学科"
              ></el-input>
            </div>
          </el-form-item>
        </el-form>
        <div style="width: 100%; display: flex; justify-content: center">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditTacher">
            确 定
          </el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validateLength = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("输入密码长度不小于六位"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      pageParams: {
        pagesize: 5,
        pagenumber: 1,
      },
      count: 0,
      dialogVisible: false,
      dialogEditVisible: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validateLength, trigger: "blur" },
        ],
        teachername: [
          { required: true, message: "请输入教师真实姓名", trigger: "blur" },
        ],
        specialized_subject: [
          {
            required: true,
            message: "请输入教师所带专业学科",
            trigger: "blur",
          },
        ],
      },
      teacherForm: {
        username: "",
        password: "",
        teachername: "",
        specialized_subject: "",
      },
      editForm: {
        id: 0,
        username: "",
        password: "",
        teachername: "",
        specialized_subject: "",
      },
    };
  },
  created() {
    this.showTeacher();
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
    addTeacher() {
      this.dialogVisible = true;
    },
    async showTeacher() {
      let res = await this.$api.showTeacher(this.pageParams);
      // console.log(res);
      this.tableData = res.data.pageData;
      this.count = res.data.count;
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$refs.teacherForm.resetFields();
    },
    submitTacher() {
      this.$refs.teacherForm.validate(async (valid) => {
        if (valid) {
          let res = await this.$api.addTacher(this.teacherForm);
          if (res.msg === "success") {
            this.dialogVisible = false;
            this.$message.success("添加老师信息成功");
            this.showTeacher();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editTeacher(row) {
      // console.log(row);
      this.editForm.id = row.id;
      this.editForm.username = row.username;
      this.editForm.specialized_subject = row.specialized_subject;
      this.editForm.teachername = row.teachername;

      this.dialogEditVisible = true;
    },
    submitEditTacher() {
      this.$refs.teacherEditForm.validate(async (valid) => {
        if (valid) {
          // console.log(this.teacherForm);
          let res = await this.$api.editTeacher(this.editForm);
          if (res.msg === "success") {
            this.dialogEditVisible = false;
            this.$message.success("修改教师信息成功");
            this.showTeacher();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    EditClose() {
      this.dialogEditVisible = false;
      this.$refs.teacherEditForm.resetFields();
    },
  },
};
</script>

<style lang="scss">
.split {
  width: 120%;
  margin-top: 10px;
  margin-left: -20px;
  border: none;
  border-top: 1px solid #dfe6e9;
}
.continer {
  min-height: 550px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.pagination {
  width: 100%;
  margin-top: 15px;
  text-align: right;
}
</style>