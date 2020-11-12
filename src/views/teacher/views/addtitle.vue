<template>
  <div>
    <el-button icon="el-icon-plus" type="primary" @click="addTitle">
      添加题目
    </el-button>
    <splitline></splitline>
    <!-- 展示详细信息 -->
    <el-dialog title="题目详细信息" :visible.sync="titleDetailShow" width="30%">
      <p class="detailTitle">题目名称</p>
      <p class="title">{{ showTitleDetailInfo.title_name }}</p>
      <p class="detailTitle">题目描述</p>
      <div class="contentcontienr">
        <p class="content">{{ showTitleDetailInfo.title_description }}</p>
      </div>
    </el-dialog>

    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      @row-click="showTitleDetail"
    >
      <el-table-column prop="title_name" label="题目名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="title_description"
        label="题目描述"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="选题状态" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="row.status == 0">待选择</el-tag>
          <el-tag type="success" v-else-if="row.status == 1">选择中</el-tag>
          <el-tag type="info" v-else-if="row.status == 2">已被选</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              :disabled="row.status == 0 ? false : true"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click.stop="editTitle(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              :disabled="row.status == 0 ? false : true"
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click.stop="deleteTitle(row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加题目信息 -->
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
          <el-input
            v-model="addTitleFrom.title_name"
            @input="searchsimilar"
          ></el-input>
        </el-form-item>

        <el-card class="card" v-show="showcard">
          <p style="font-weight: 700; font-size: 16px; margin-bottom: 20px">
            已有如下类似的题目
          </p>
          <div
            v-for="(item, i) in similarTitleName"
            :key="i"
            class="showSimilarTitle"
          >
            <p class="showSimilarItem" v-html="item.content">
              <!-- {{ item.content }} -->
            </p>
            <p>
              {{ item.uptime | dateFormat }}
            </p>
          </div>
        </el-card>

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
    <!-- 编辑题目信息 -->
    <el-dialog
      @close="closeEditDialog"
      title="修改题目信息"
      :visible.sync="editCloseDialog"
      width="30%"
    >
      <el-form ref="editTitleFrom" :model="editTitleFrom" label-width="80px">
        <el-form-item label="题目名称" prop="title_name">
          <el-input v-model="editTitleFrom.title_name"></el-input>
        </el-form-item>

        <el-form-item label="题目描述" prop="title_description">
          <el-input
            v-model="editTitleFrom.title_description"
            type="textarea"
            rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%; text-align: center">
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCloseDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitEditTitle">确 定</el-button>
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
      titleDetailShow: false,
      editCloseDialog: false,
      addTitleFrom: {
        title_name: "",
        title_description: "",
      },
      editTitleFrom: {
        title_name: "",
        title_description: "",
      },
      showTitleDetailInfo: {},
      similarTitleName: [],
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
    // console.log(this.$store.state.id);
    this.addTitleFrom.id = this.$store.state.id;
    this.showTitle();
  },
  computed: {
    showcard() {
      return !(this.similarTitleName.length == 0);
    },
  },
  methods: {
    closeDialog() {
      this.$refs.titleForm.resetFields();
      this.similarTitleName = [];
    },
    showTitleDetail(row) {
      // console.log("ok");
      this.titleDetailShow = true;
      console.log(row);
      this.showTitleDetailInfo = Object.assign({}, row);
    },
    addTitle() {
      this.dialogVisible = true;
    },
    async showTitle() {
      let res = await this.$api.showTitle({ id: this.$store.state.id });
      this.tableData = res.data;
    },
    // 全文分词搜索是否已经有类似的题目了
    async searchsimilar() {
      // console.log(this.addTitleFrom.title_name);
      this.similarTitleName = [];
      let res = await this.$api.searchSimilarTitleName({
        title: this.addTitleFrom.title_name,
      });
      // console.log(res.data.hits.hits);
      res.data.hits.hits.forEach((item) => {
        let obj = {};
        obj.content = item.highlight.content[0];
        obj.uptime = item._source.uptime;
        this.similarTitleName.push(obj);
      });
      // console.log(this.similarTitleName);
      // console.log(this.showcard);
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
    editTitle(row) {
      // console.log(row);
      this.editTitleFrom.id = row.id;
      this.editTitleFrom.title_name = row.title_name;
      this.editTitleFrom.title_description = row.title_description;
      this.editCloseDialog = true;
    },
    async submitEditTitle() {
      // console.log(this.editTitleFrom);
      let res = await this.$api.editTitle(this.editTitleFrom);
      if (res.msg === "success") {
        this.showTitle();
        this.editCloseDialog = false;
        this.$message.success("修改信息成功");
      }
    },
    closeEditDialog() {
      this.editTitleFrom.title_name = "";
      this.editTitleFrom.title_description = "";
    },
    deleteTitle(row) {
      // console.log(row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$api.deleteTitle({ id: row.id });
          if (res.msg === "success") {
            this.showTitle();
            this.$message.success("删除题目成功");
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

<style lang="scss" scoped>
.card {
  position: absolute;
  width: 500px;
  left: -520px;
  transition: all 0.5s;
}
.showSimilarTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.showSimilarItem {
  height: 30px;
  display: flex;
  align-items: center;
}
.detailTitle {
  font-weight: 700;
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.title {
  font-size: 16px;
  text-indent: 2em;
}
.contentcontienr {
  margin-left: 2em;
}
.content {
  font-size: 16px;
  white-space: pre-wrap;
  line-height: 150%;
}
</style>