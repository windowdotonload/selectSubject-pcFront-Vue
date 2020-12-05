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
          <el-tag v-if="row.select_title_status == 4" type="info">
            已退回
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="item" effect="dark" content="通过" placement="top">
            <el-button
              :disabled="row.select_title_status != 1 ? true : false"
              type="success"
              icon="el-icon-check"
              circle
              size="mini"
              @click.stop="pass(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="退回" placement="top">
            <el-button
              :disabled="row.select_title_status != 1 ? true : false"
              type="danger"
              icon="el-icon-minus"
              circle
              size="mini"
              @click.stop="refuse(row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="消息" align="center">
        <template v-slot="{ row }">
          <el-badge
            is-dot
            class="item"
            :hidden="!row.sendmessage || row.sendmessage == 0"
          >
            <i class="el-icon-bell" @click.stop="lookatmessage(row)"></i>
          </el-badge>
        </template>
      </el-table-column>
    </el-table>
    <!-- 展示题目详细信息 -->
    <el-dialog title="题目详细信息" :visible.sync="titleDetailShow" width="30%">
      <p class="detailTitle">选题状态</p>
      <div class="contentcontienr">
        <el-tag v-if="rowStuInfo.select_title_status == 1"> 待审核</el-tag>
        <el-tag v-if="rowStuInfo.select_title_status == 2" type="success">
          已通过
        </el-tag>
        <el-tag v-if="rowStuInfo.select_title_status == 4" type="info">
          已退回，待学生重新申请
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
    </el-dialog>
    <!-- 聊天框 -->
    <el-dialog
      :visible.sync="connectionVisible"
      width="30%"
      @close="closeMessageBox"
    >
      <div class="messageBox">
        <div v-for="(item, i) in messagecontent" :key="i">
          <p v-if="item.sender == 'stu'" style="width: 100%">
            <el-card style="width: 69%; margin: 5px">{{ item.msg }}</el-card>
          </p>
          <p
            v-if="item.sender == 'tea'"
            style="width: 100%; display: flex; justify-content: flex-end"
          >
            <el-card style="width: 69%; margin: 5px">{{ item.msg }}</el-card>
          </p>
        </div>
      </div>
      <div>
        <el-input
          class="sendMessage"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="sendmessageinfo"
        >
        </el-input>

        <p style="width: 100%; text-align: right">
          <el-button
            size="mini"
            style="margin-top: 10px"
            @click="sendmessageto"
          >
            发送
          </el-button>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 配置socket通信
  sockets: {
    // socket.on 的注册事件放在这个对象中写，本身就含有connect等默认监听事件
    connect: function (val) {
      console.log("socket connected");
    },
    customEmit: function (data) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("customEmit", data)'
      );
    },
    message(val) {
      // console.log("id", this.stuinfo.id);
      // console.log(val);
      this.messagecontent.push(val);
      console.log("this.message", this.messagecontent);
    },
  },
  data() {
    return {
      studentTableData: [],
      id: window.sessionStorage.getItem("id"),
      titleDetailShow: false,
      showTitleDetailInfo: {},
      rowStuInfo: {},
      applyhistory: [],
      connectionVisible: false,
      messagecontent: [],
      sendmessageinfo: "",
      sendMessageStuInfo: {},
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
      this.rowStuInfo = row;
      let applyres = await this.$api.teacherGetApplyHistory({
        id: row.id,
      });
      if (applyres.msg == "success") {
        this.applyhistory = applyres.data;
      }
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
      // debugger;
      this.$confirm("是否确认通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res;
          if (row.ifcustom == 1) {
            res = await this.$api.teacherAuditCustomTitle({
              id: row.id,
              title_name: row.title_name,
            });
          } else {
            res = await this.$api.passStudentSelTitle({
              id: row.id,
              title_name: row.select_subject,
            });
          }
          // console.log(res);
          if (res.msg == "success") {
            // console.log(res);
            this.teaGetSelectStuInfo();
            this.$message.success("审核通过");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    refuse(row) {
      // console.log(row);
      this.$confirm("是否确认退回?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 老师将一个学生的选题退回，学生选题状态变为被退回，而题目的状态直接可以变为待选择
          // 要判断是否为自定义
          let res;
          if (row.ifcustom == 1) {
            res = await this.$api.refuseStudentSelTitle({
              id: row.id,
              titlename: row.title_name,
            });
          } else {
            res = await this.$api.refuseStudentSelTitle({
              id: row.id,
              titlename: row.select_subject,
            });
          }

          if (res.msg == "success") {
            this.teaGetSelectStuInfo();
            this.$message.success("已退回");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    async lookatmessage(row) {
      // console.log(row);
      this.sendMessageStuInfo = row;
      // console.log("info", this.sendMessageStuInfo);
      let res = await this.$api.showHistoryMessage({
        studentid: row.id,
        teacherid: this.id,
      });
      res.data.forEach((item) => {
        item.stuid = item.studentid;
        item.teaid = item.teacherid;
        this.messagecontent.push(item);
      });
      console.log("start message", this.messagecontent);
      this.connectionVisible = true;
      // console.log(this.messagecontent);
      await this.$api.teacherAlreadyReadMessage({
        id: row.id,
      });
      this.teaGetSelectStuInfo();
    },
    closeMessageBox() {
      this.sendMessageStuInfo = {};
      this.messagecontent = [];
      // console.log("clear info", this.sendMessageStuInfo);
    },
    // 发送消息接口
    async sendmessageto() {
      if (this.sendmessageinfo == "") {
        return;
      }
      await this.$api.remindStudentMessage({
        id: this.sendMessageStuInfo.id,
      });
      this.$socket.emit("server", {
        stuid: this.sendMessageStuInfo.id,
        teaid: this.id,
        msg: this.sendmessageinfo,
        sender: "tea",
      });
      this.sendmessageinfo = "";
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
.item {
  margin-top: 5px;
}
.messageBox {
  box-shadow: 5px 5px 5px #95a5a6;
  height: 300px;
  width: 100%;
  border: 1px solid #95a5a6;
  border-radius: 3px;
  margin-top: 20px;
  overflow-y: auto;
}
.messageBox::-webkit-scrollbar {
  width: 5px;
  background: rgba(243, 210, 178, 0.788);
}
.messageBox::-webkit-scrollbar-thumb {
  width: 5px;
  background: rosybrown;
}
.sendMessage {
  margin-top: 20px;
  height: 50px;
  width: 100%;
  border: 1px solid #95a5a6;
  border-radius: 3px;
}
</style>