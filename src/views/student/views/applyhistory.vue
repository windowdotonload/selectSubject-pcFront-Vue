<!--
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
-->

<template>
  <div>
    <el-card style="width: 36%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.createdAt | dateFormat"
        >
          <p class="content">{{ activity.content }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getApplay();
  },
  data() {
    return {
      id: window.sessionStorage.getItem("id"),
      activities: [],
    };
  },
  methods: {
    async getApplay() {
      let applyres = await this.$api.teacherGetApplyHistory({
        id: this.id,
      });
      if (applyres.msg == "success") {
        this.activities = applyres.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  font-size: 16px;
  white-space: pre-wrap;
  line-height: 150%;
}
</style>