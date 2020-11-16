<!--
 * @Descripttion:想要更改选题其实就是将学生的选题状态改为0，并且将之前的选题信息清除，将之前选择的题目信息还原为为选择
 *               具体是修改student-- select_title_status：0 ，更具学生表中titleid修改title -- status：0
 * @version: 
 * @Author: windowdotonload
-->

<template>
  <div>
    <div
      class="warnEdit"
      v-if="!stuinfo.select_title_status || stuinfo.select_title_status == 0"
    >
      <span>
        <img src="@/public/img/warn.png" alt="" />
      </span>
      <p class="warntext">
        还未选择题目,<a class="goApply" @click="goApply">去申请</a>
      </p>
    </div>

    <div
      class="warnEdit"
      v-if="
        stuinfo.change_title_number == 1 && stuinfo.select_title_status != 0
      "
    >
      <span>
        <img src="@/public/img/warn.png" alt="" />
      </span>
      <p class="warntext">以申请修改过选题，无法再次申请</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stuinfo: {},
    };
  },
  created() {
    this.getStuInfo();
  },
  methods: {
    async getStuInfo() {
      let res = await this.$api.getStuInfo({
        id: window.sessionStorage.getItem("id"),
      });
      this.stuinfo = res.data;
      this.confirmChangeTitle();
    },
    async goApply() {
      this.$router.push("/titlelist");
    },
    confirmChangeTitle() {
      // console.log(this.stuinfo.change_title_number);
      if (
        this.stuinfo.select_title_status != 0 &&
        !this.stuinfo.change_title_number
      ) {
        this.$confirm(
          "一旦选择确定修改选题，之前的选题信息将被清空，是否确定修改?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(async () => {
            let res = await this.$api.stuChangeTitle({
              id: this.stuinfo.id,
            });
            if (res.msg === "success") {
              this.$router.push("/titlelist");
            }
          })
          .catch(() => {
            this.$router.push("/titlelist");
          });
      }
    },
  },
};
</script>



<style lang="scss" scoped>
.warnEdit {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
}
.warntext {
  margin-left: 15px;
  font-size: 16px;
  font-weight: bold;
  color: rgb(170, 170, 170);
}
.goApply {
  cursor: pointer;
  color: #3498db;
}
</style>