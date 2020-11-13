<template>
  <div class="continer">
    <p style="font-size: 18px; margin-bottom: 15px">申请学生列表:</p>
    <el-alert title="有颜色标记出的学生为自定义题目" type="warning" show-icon>
    </el-alert>
    <el-table
      :data="studentTableData"
      style="width: 100%"
      @row-click="showDetail"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="studentname" label="姓名" align="center">
      </el-table-column>
      <el-table-column prop="gender" label="性别" align="center">
      </el-table-column>
      <el-table-column prop="specialized_subject" label="专业" align="center">
      </el-table-column>
      <el-table-column prop="calssname" label="班级" align="center">
      </el-table-column>
      <el-table-column prop="studentnumber" label="学号" align="center">
      </el-table-column>
      <el-table-column label="所选课题" show-overflow-tooltip>
        <template v-slot="{ row }">
          <p v-if="row.ifcustom == 1">{{ row.title_name }}</p>
          <p v-else>{{ row.select_subject }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="{ row }">
          <el-tag
            v-if="row.select_title_status == 0 || !row.select_title_status"
            type="info"
          >
            待选题
          </el-tag>

          <el-tag v-if="row.select_title_status == 1">待审核</el-tag>
          <el-tag v-if="row.select_title_status == 2" type="success">
            已通过
          </el-tag>
          <el-tag v-if="row.select_title_status == 4" type="info"
            >已退回</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="item" effect="dark" content="通过" placement="top">
            <el-button
              type="success"
              icon="el-icon-check"
              circle
              size="mini"
              @click.stop="pass(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="退回" placement="top">
            <el-button
              type="danger"
              icon="el-icon-minus"
              circle
              size="mini"
              @click.stop="refuse(row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 展示题目详细信息 -->
    <el-dialog title="题目详细信息" :visible.sync="titleDetailShow" width="30%">
      <p class="detailTitle">题目名称</p>
      <p class="title">{{ showTitleDetailInfo.title_name }}</p>
      <p class="detailTitle">题目描述</p>
      <div class="contentcontienr">
        <p class="content">{{ showTitleDetailInfo.title_description }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentTableData: [],
      id: window.sessionStorage.getItem("id"),
      titleDetailShow: false,
      showTitleDetailInfo: {},
    };
  },
  created() {
    this.teaGetSelectStuInfo();
  },
  methods: {
    async teaGetSelectStuInfo() {
      let res = await this.$api.teaGetSelectStuInfo({ id: this.id });
      if (res.msg == "success") {
        this.studentTableData = res.data;
      }
    },

    async showDetail(row) {
      // console.log(row);
      let res = await this.$api.getStudentSelTitleInfo({
        id: row.id,
      });
      if (res.msg == "success") {
        this.showTitleDetailInfo = res.data;
        this.titleDetailShow = true;
      } else if (row.title_name) {
        this.showTitleDetailInfo.title_name = row.title_name;
        this.showTitleDetailInfo.title_description = row.title_description;
        this.titleDetailShow = true;
      } else {
        this.$message.info("该学生暂未选择课题");
      }
    },
    tableRowClassName(row) {
      // console.log(row.row.ifcustom);
      if (row.row.ifcustom == 1) {
        return "warning-row";
      } else {
        return "";
      }
    },
    pass(row) {
      console.log(row);
    },
    refuse(row) {
      console.log(row);
    },
  },
};
</script>

<style lang="scss" scoped>
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