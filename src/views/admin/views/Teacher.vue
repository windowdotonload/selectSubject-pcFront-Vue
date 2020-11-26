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
        <el-table-column prop="phonenumber" label="手机号"> </el-table-column>
        <el-table-column prop="tecentqnumber" label="QQ"> </el-table-column>
        <el-table-column prop="professional" label="教师职称">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot:default="{ row }">
            <el-button
              type="success"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editTeacher(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteTeacher(row)"
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
          <el-form-item label="手机号" prop="phonenumber">
            <div class="format">
              <el-input
                v-model="teacherForm.phonenumber"
                placeholder="请输入教师所带专业学科"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="QQ号">
            <div class="format">
              <el-input
                v-model="teacherForm.tecentqnumber"
                placeholder="请输入教师所带专业学科"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="职称" prop="professional">
            <div class="format">
              <el-input
                v-model="teacherForm.professional"
                placeholder="请输入教师职称"
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
          :rules="editRules"
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
          <el-form-item label="手机号" prop="phonenumber">
            <div class="format">
              <el-input
                v-model="editForm.phonenumber"
                placeholder="请输入教师所带专业学科"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="QQ号">
            <div class="format">
              <el-input
                v-model="editForm.tecentqnumber"
                placeholder="请输入教师所带专业学科"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="职称" prop="professional">
            <div class="format">
              <el-input
                v-model="editForm.professional"
                placeholder="请输入教师职称"
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
    const checkUsernameExist = async (rule, value, callback) => {
      let res = await this.$api.checkUsernameExist({ username: value });
      if (res.msg == "success") {
        if (res.data.msg == "exist") {
          return callback(new Error("用户名已存在"));
        } else {
          return callback();
        }
      }
    };
    const checkPhoneNumber = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        return callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    const validateLength = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("输入密码长度不小于六位"));
      } else {
        callback();
      }
    };
    const editValidateLength = (rule, value, callback) => {
      if (value == "") {
        callback();
      } else if (value.length < 6) {
        callback(new Error("输入密码长度不小于六位"));
      } else {
        callback();
      }
    };
    const editCheckPhoneNumber = (rule, value, callback) => {
      if (value == "") {
        callback();
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        return callback(new Error("请输入正确的手机号"));
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
          { validator: checkUsernameExist, trigger: "blur" },
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
        phonenumber: [
          { required: true, message: "请输入教师手机号", trigger: "blur" },
          { validator: checkPhoneNumber, trigger: "blur" },
        ],
        professional: [
          { required: true, message: "请输入教师职称", trigger: "blur" },
        ],
      },
      editRules: {
        username: [],
        password: [{ validator: editValidateLength, trigger: "blur" }],
        teachername: [],
        specialized_subject: [],
        phonenumber: [{ validator: editCheckPhoneNumber, trigger: "blur" }],
        professional: [],
      },
      teacherForm: {
        username: "",
        password: "",
        teachername: "",
        specialized_subject: "",
        phonenumber: "",
        tecentqnumber: "",
        professional: "",
      },
      editForm: {
        id: 0,
        username: "",
        password: "",
        teachername: "",
        specialized_subject: "",
        phonenumber: "",
        tecentqnumber: "",
        professional: "",
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
      this.teacherForm.tecentqnumber = "";
      this.$refs.teacherForm.resetFields();
    },
    // 提交添加老师信息
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
    // 提交修改老师信息
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
    // 删除老师信息
    deleteTeacher(row) {
      this.$confirm("是否确定删除该教师信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$api.deleteTeacher({ id: row.id });
          if (res.msg === "success") {
            this.showTeacher();
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
    EditClose() {
      this.dialogEditVisible = false;
      this.editForm.phonenumber = "";
      this.editFrom.tecentqnumber = "";
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