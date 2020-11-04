<template>
  <div>
    <el-button icon="el-icon-plus" type="primary" @click="addTitle"
      >添加题目</el-button
    >
    <splitline></splitline>
    <el-table :data="tableData" style="width: 100%; margin-top: 10px">
      <el-table-column prop="title_name" label="题目名称"> </el-table-column>
      <el-table-column prop="title_description" label="题目描述">
      </el-table-column>
      <el-table-column label="选题状态" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="row.status == 0">待选</el-tag>
          <el-tag type="success" v-else-if="row.status == 1">选择中</el-tag>
          <el-tag type="info" v-else-if="row.status == 2">已被选</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      @close="closeDialog"
      title="添加题目信息"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form
        ref="titleForm"
        :model="addTitleFrom"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="题目名称" prop="title_name">
          <el-input v-model="addTitleFrom.title_name"></el-input>
        </el-form-item>
        <el-form-item label="题目描述" prop="title_description">
          <el-input
            v-model="addTitleFrom.title_description"
            type="textarea"
            rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%; text-align: center">
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitTitle">确 定</el-button>
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
      dialogVisible: false,
      addTitleFrom: {
        title_name: "",
        title_description: "",
      },
      rules: {
        title_name: [
          { required: true, message: "请输入题目名称", trigger: "blur" },
        ],
        title_description: [
          { required: true, message: "请输入题目描述", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.showTitle();
  },
  methods: {
    closeDialog() {
      this.$refs.titleForm.resetFields();
    },
    addTitle() {
      this.dialogVisible = true;
    },
    async showTitle() {
      let res = await this.$api.showTitle();
      this.tableData = res.data;
    },
    submitTitle() {
      this.$refs.titleForm.validate(async (valid) => {
        if (valid) {
          // console.log(this.addTitleFrom);
          let res = await this.$api.addTitleInfo(this.addTitleFrom);
          if (res.msg === "success") {
            this.showTitle();
            this.dialogVisible = false;
            this.$message.success("添加题目成功");
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

<style lang="stylus" scoped></style>