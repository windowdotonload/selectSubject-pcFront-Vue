<!--
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
-->
<template>
  <div>
    <p class="detailTitle">选题状态</p>
    <div class="contentcontienr">
      <el-tag v-if="rowStuInfo.select_title_status == 1"> 待审核</el-tag>
      <el-tag v-if="rowStuInfo.select_title_status == 2" type="success">
        已通过
      </el-tag>
      <el-tag v-if="rowStuInfo.select_title_status == 4" type="info">
        老师已退回，待学生重新申请
      </el-tag>
    </div>
    <p class="detailTitle">题目名称</p>
    <p class="title">{{ showTitleDetailInfo.title_name }}</p>
    <p class="detailTitle">题目描述</p>
    <div class="contentcontienr">
      <p class="content">{{ showTitleDetailInfo.title_description }}</p>
    </div>
    <p class="detailTitle">申请历史</p>
    <el-timeline>
      <el-timeline-item
        style="margin-left: 10px"
        v-for="(activity, index) in applyhistory"
        :key="index"
        :timestamp="activity.createdAt | dateFormat"
      >
        <p class="content">{{ activity.content }}</p>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      tpye: Number,
    },
  },
  watch: {
    id() {
      console.log("id", this.id);
      this.getStuInfo();
      this.getApply();
      this.getTitleInfo();
    },
  },
  created() {
    console.log(this.id);
    this.getStuInfo();
    this.getApply();
    this.getTitleInfo();
  },
  data() {
    return {
      rowStuInfo: {},
      showTitleDetailInfo: {},
      applyhistory: [],
    };
  },
  methods: {
    async getTitleInfo() {
      let res = await this.$api.adminClickStuTitleInfo({
        id: this.id,
      });
      if (res.msg == "success") {
        this.showTitleDetailInfo = res.data;
      }
    },
    async getApply() {
      let applyres = await this.$api.teacherGetApplyHistory({
        id: this.id,
      });
      if (applyres.msg == "success") {
        this.applyhistory = applyres.data;
      }
    },
    async getStuInfo() {
      let res = await this.$api.getStuInfo({
        id: this.id,
      });
      this.rowStuInfo = res.data;
    },
  },
};
</script>

<style lang="scss">
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
