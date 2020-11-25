<template>
  <div class="continer">
    <!-- 选择老师 -->
    <el-button
      @click="studentSelectTeacher"
      type="success"
      size="mini"
      icon="el-icon-plus"
      v-if="canselect != 1"
    >
      选择老师
    </el-button>

    <!-- 自定义选题 -->
    <el-button
      @click="studentCustomTitle"
      type="warning"
      size="mini"
      icon="el-icon-edit"
      v-if="
        stuinfo.select_title_status == 0 ||
        !stuinfo.select_title_status ||
        stuinfo.select_title_status == 4
      "
    >
      自定义选题
    </el-button>

    <!-- 修改选题 -->
    <el-button
      type="warning"
      size="mini"
      icon="el-icon-refresh-left"
      @click="stuSelectChangeTitle"
    >
      修改选题
    </el-button>
    <div
      style="
        float: right;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      "
    >
      <p style="font-family: 'Arial'; font-weight: 600">所选择的老师：</p>
      <el-tag effect="plain" v-if="teachername"> {{ teachername }} </el-tag>
      <el-tag effect="plain" v-else> 还未选择老师 </el-tag>
      <el-tooltip
        v-if="teachername && canselect != 1"
        class="item"
        effect="dark"
        content="确定选择老师"
        placement="top"
      >
        <el-button
          type="success"
          icon="el-icon-check"
          circle
          size="mini"
          style="margin-left: 10px; margin-right: 30px"
          @click="confirmTeacher"
        ></el-button>
      </el-tooltip>
    </div>
    <splitline></splitline>
    <el-steps
      style="margin-top: 30px; margin-bottom: 20px; margin-left: -60px"
      :active="selectTitleActive"
      finish-status="success"
      align-center
    >
      <el-step title="选择题目"></el-step>
      <el-step v-if="stuinfo.select_title_status != 4" title="待审核"></el-step>
      <el-step
        v-if="stuinfo.select_title_status == 4"
        title="被退回，请重新申请"
      ></el-step>

      <el-step title="审核通过"></el-step>
    </el-steps>

    <!--学生选择完老师出的题目后显示的详情-->
    <el-card
      v-if="
        (selectTitleActive == 1 || selectTitleActive == 3) &&
        stuinfo.ifcustom != 1
      "
    >
      <el-row class="rowformat">
        <el-col :span="12">
          <el-row style="display: flex; align-items: center">
            <el-col :span="4">选题状态：</el-col>
            <el-col :span="20">
              <el-tag v-if="stuinfo.select_title_status == 1">待审核</el-tag>
              <el-tag type="success" v-if="stuinfo.select_title_status == 2">
                审核通过
              </el-tag>
              <el-tag v-if="stuinfo.select_title_status == 4" type="danger">
                已退回,请重新申请
              </el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="rowformat">
        <el-col :span="12">
          <el-row style="display: flex; align-items: center">
            <el-col :span="4">题目信息：</el-col>
            <el-col :span="20">
              <p v-html="stuinfo.select_subject"></p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="rowformat">
        <el-col :span="12">
          <el-row style="display: flex; align-items: center">
            <el-col :span="4">题目描述：</el-col>
            <el-col :span="20">
              <p
                v-html="titleinfo.title_description"
                style="white-space: pre-wrap; line-height: 150%"
              ></p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <!--学生自定义选题提交后显示的详情 -->
    <el-card
      v-if="
        (selectTitleActive == 1 || selectTitleActive == 3) &&
        stuinfo.ifcustom == 1
      "
    >
      <el-row class="rowformat">
        <el-col :span="12">
          <el-row style="display: flex; align-items: center">
            <el-col :span="4">选题状态：</el-col>
            <el-col :span="20">
              <el-tag v-if="stuinfo.select_title_status == 1">待审核</el-tag>
              <el-tag type="success" v-if="stuinfo.select_title_status == 2">
                审核通过
              </el-tag>
              <el-tag type="danger" v-if="stuinfo.select_title_status == 4">
                已退回，请重新申请
              </el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="rowformat">
        <el-col :span="12">
          <el-row style="display: flex; align-items: center">
            <el-col :span="4">题目信息：</el-col>
            <el-col :span="20">
              <p v-html="stuinfo.title_name"></p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="rowformat">
        <el-col :span="12">
          <el-row style="display: flex; align-items: center">
            <el-col :span="4">题目描述：</el-col>
            <el-col :span="20">
              <p
                v-html="stuinfo.title_description"
                style="white-space: pre-wrap; line-height: 150%"
              ></p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <transition>
      <el-table
        style="margin-top: 15px"
        v-if="selectTitleActive == 0 || stuinfo.select_title_status == 4"
        :data="tableData"
        @row-click="titleDetail"
      >
        <el-table-column prop="title_name" label="题目名称" width="350">
        </el-table-column>
        <el-table-column prop="title_description" label="题目描述" width="539">
        </el-table-column>
        <el-table-column label="选题状态" align="center" width="250">
          <template v-slot="{ row }">
            <el-tag v-if="row.status == 0">待选择</el-tag>
            <el-tag type="success" v-if="row.status == 1">选择中</el-tag>
            <el-tag type="info" v-if="row.status == 2">已被选</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template v-slot="{ row }">
            <el-tooltip
              v-if="row.status == 0"
              class="item"
              effect="dark"
              content="确认选择题目"
              placement="top"
            >
              <el-button
                type="success"
                icon="el-icon-check"
                circle
                size="mini"
                @click.stop="selectTitle(row)"
              ></el-button>
            </el-tooltip>
            <el-button
              v-else
              type="success"
              icon="el-icon-check"
              circle
              size="mini"
              disabled
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </transition>

    <!-- 题目详情对话框 -->
    <el-dialog title="题目详细信息" :visible.sync="titleDetailShow" width="30%">
      <p class="detailTitle">题目名称</p>
      <p class="title">{{ showTitleDetailInfo.title_name }}</p>
      <p class="detailTitle">题目描述</p>
      <div class="contentcontienr">
        <p class="content">{{ showTitleDetailInfo.title_description }}</p>
      </div>
    </el-dialog>
    <!-- 选择老师对话框 -->
    <el-dialog title="选择所属的老师" :visible.sync="selectDialogVisible">
      <el-table
        ref="studentSelectTeacherTable"
        :data="studentSelectTeacherTableData"
        tooltip-effect="dark"
        style="width: 100%"
        @select="selectRow"
        @select-all="selectAll"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="教师姓名" prop="teachername"> </el-table-column>
        <el-table-column label="所带专业系别" prop="specialized_subject">
        </el-table-column>
        <el-table-column label="职称" prop="professional"> </el-table-column>
        <el-table-column label="手机号" prop="phonenumber"> </el-table-column>
        <el-table-column label="QQ" prop="tecentqnumber"> </el-table-column>
      </el-table>
      <div style="width: 100%; text-align: center; margin-top: 10px">
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitStudentSelectTeacher">
            确 定
          </el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 自定义选题对话框 -->
    <el-dialog
      @close="closeDialog"
      title="自定义选择"
      :visible.sync="customDialogVisible"
      width="30%"
    >
      <el-form
        ref="customTitleForm"
        :model="customTitleForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="题目名称" prop="title_name">
          <el-input
            v-model="customTitleForm.title_name"
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
            v-model="customTitleForm.title_description"
            type="textarea"
            rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%; text-align: center">
        <span slot="footer" class="dialog-footer">
          <el-button @click="customDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitCustomTitle">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 通信 -->

    <div class="connection" @click="startConnect">
      <el-tooltip
        class="item"
        effect="dark"
        content="与老师联系"
        placement="top"
      >
        <el-badge
          is-dot
          class="item"
          :hidden="
            !this.stuinfo.receiveteamessage ||
            this.stuinfo.receiveteamessage == 0
          "
        >
          <img src="../../../public/img/lianxi.png" alt="" />
        </el-badge>
      </el-tooltip>
    </div>

    <!-- 通信聊天对话框 -->
    <el-dialog
      :visible.sync="connectionVisible"
      width="30%"
      @close="closeMessageBox"
    >
      <div class="messageBox">
        <div v-for="(item, i) in messagecontent" :key="i">
          <p v-if="item.sender == 'tea'" style="width: 100%">
            <el-card style="width: 69%; margin: 5px">{{ item.msg }}</el-card>
          </p>
          <p
            v-if="item.sender == 'stu'"
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
import splitline from "@/components/splitline";

export default {
  components: {
    splitline,
  },
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
      console.log("id", this.stuinfo.id);
      console.log(val);
      this.messagecontent.push(val);
      console.log("this.message", this.messagecontent);
    },
  },
  data() {
    return {
      tableData: [],
      stuinfo: {
        select_title_status: 1,
      },
      connectionVisible: false,
      selectDialogVisible: false,
      customDialogVisible: false,
      studentSelectTeacherTableData: [],
      //根据学生对应的记录id查找参与这条记录的老师
      recordid: window.sessionStorage.getItem("recordid"),
      studentid: window.sessionStorage.getItem("id"),
      selectTeacherId: 0,
      teachername: "",
      canselect: 1,
      showTitleDetailInfo: {},
      titleDetailShow: false,
      selectTitleActive: undefined,
      titleinfo: {},
      customTitleForm: {
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
      similarTitleName: [],
      sendmessageinfo: "",
      messagecontent: [],
    };
  },
  created() {
    this.createdShowSelectTeacherId();
    this.stuGetSelectTeacherName();
    this.getStuInfo();
    this.getStudentSelTitleInfo();
  },
  computed: {
    showcard() {
      return !(this.similarTitleName.length == 0);
    },
  },
  methods: {
    closeDialog() {
      this.$refs.customTitleForm.resetFields();
      this.similarTitleName = [];
    },
    async searchsimilar() {
      this.similarTitleName = [];
      let res = await this.$api.searchSimilarTitleName({
        title: this.customTitleForm.title_name,
      });
      // console.log(res.data.hits.hits);
      res.data.hits.hits.forEach((item) => {
        let obj = {};
        obj.content = item.highlight.content[0];
        obj.uptime = item._source.uptime;
        this.similarTitleName.push(obj);
      });
    },
    async selectTitle(row) {
      // console.log(row);
      if (this.stuinfo.canselect != 1) {
        this.$message.info("请先确认选择老师");
        return;
      }
      this.$confirm("确定选择此选题?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // console.log(row);
          let res = await this.$api.confirmStudentSelTitle({
            stuid: this.studentid,
            titleid: row.id,
            titlename: row.title_name,
          });
          let titleAfterChange = await this.$api.changeTitleStatus({
            stuid: this.studentid,
            titleid: row.id,
          });
          // this.showSelectTeacherTitle();
          this.getStudentSelTitleInfo();
          this.getStuInfo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消选择",
          });
        });
    },
    // 获取学生选择的题目的信息
    async getStudentSelTitleInfo() {
      let res = await this.$api.getStudentSelTitleInfo({
        id: window.sessionStorage.getItem("id"),
      });
      this.titleinfo = res.data;
    },
    async getStuInfo() {
      let res = await this.$api.getStuInfo({
        id: window.sessionStorage.getItem("id"),
      });
      this.stuinfo = res.data;
      this.canselect = res.data.canselect;
      switch (res.data.select_title_status) {
        case null:
          this.selectTitleActive = 0;
        case 0:
          this.selectTitleActive = 0;
          break;
        case 1:
          this.selectTitleActive = 1;
          break;
        case 2:
          this.selectTitleActive = 3;
          break;
        case 4:
          this.selectTitleActive = 1;
      }
    },
    confirmTeacher() {
      this.$confirm("确定选择老师后将不可更改，是否确认选择?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$api.confirmSelectTeacher({
            id: this.studentid,
          });
          this.getStuInfo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async studentSelectTeacher() {
      // console.log(this.recordid);
      let res = await this.$api.showAllStudentCanSelectTeacher({
        recordid: this.recordid,
      });
      if (res.msg === "success") {
        this.studentSelectTeacherTableData = res.data;
        this.selectDialogVisible = true;
      }
    },
    async stuGetSelectTeacherName() {
      let res = await this.$api.stuGetSelectTeacherName({ id: this.studentid });
      if (res.msg == "success") {
        this.teachername = res.data.teachername;
      } else {
        this.teachername = undefined;
      }
    },
    studentCustomTitle() {
      this.customTitleForm.id = this.studentid;
      this.customDialogVisible = true;
    },
    handleSelectionChange(val) {
      // console.log(val);
    },
    selectRow(val, row) {
      // console.log(val);
      // console.log(row);
      this.$refs.studentSelectTeacherTable.clearSelection();
      this.$refs.studentSelectTeacherTable.toggleRowSelection(row, true);
      this.selectTeacherId = row.id;
      // console.log(this.selectTeacherId);
    },
    selectAll() {
      this.$refs.studentSelectTeacherTable.clearSelection();
    },
    // 将选择的老师的id存储到数据库中
    async saveTeacherId() {
      let res = await this.$api.saveTeacherId({
        studentid: this.studentid,
        teacherid: this.selectTeacherId,
      });
      if (res.msg === "success") {
        window.sessionStorage.setItem("selectTeacherId", res.data.teacherid);
      }
    },
    // 在created()中根据学生表中记录的老师的id查找到所选择的这个老师的题目
    async createdShowSelectTeacherId() {
      let res = await this.$api.createdShowSelectTeacherId({
        id: this.studentid,
      });
      this.tableData = res.data;
    },
    async showSelectTeacherTitle(params) {
      let res = await this.$api.showSelectTeacherTitle({
        id: params,
      });
      if (res.msg === "success") {
        this.tableData = res.data;
        this.selectDialogVisible = false;
      }
    },
    submitStudentSelectTeacher() {
      // this.selectDialogVisible = false;
      this.saveTeacherId();
      this.showSelectTeacherTitle(this.selectTeacherId);
      this.stuGetSelectTeacherName();
      this.getStuInfo();
      window.location.reload();
    },
    submitCustomTitle() {
      if (this.stuinfo.canselect != 1) {
        this.$message.info("请先确认选择老师");
        return;
      }
      this.$refs.customTitleForm.validate(async (valid) => {
        if (valid) {
          // console.log(this.customTitleForm);
          let res = await this.$api.studentCustomTitle(this.customTitleForm);

          if (res.msg === "success") {
            this.$message.success("申请自定义题目成功，等待老师审核");
            this.getStuInfo();
            this.customDialogVisible = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    titleDetail(row) {
      // console.log(row);
      this.titleDetailShow = true;
      this.showTitleDetailInfo = row;
    },
    closeMessageBox() {
      this.messagecontent = [];
    },
    // 点击聊天按钮是调取之前的聊天记录，点击发送才是调用socket
    async startConnect() {
      await this.$api.studentAlreadyReadMessage({
        id: this.stuinfo.id,
      });
      let res = await this.$api.showHistoryMessage({
        studentid: this.stuinfo.id,
        teacherid: this.stuinfo.teacherid,
      });
      res.data.forEach((item) => {
        item.stuid = item.studentid;
        item.teaid = item.teacherid;
        this.messagecontent.push(item);
      });
      this.getStuInfo();
      this.connectionVisible = true;
    },
    async sendmessageto() {
      if (this.sendmessageinfo == "") {
        return;
      }
      this.$socket.emit("server", {
        stuid: this.stuinfo.id,
        teaid: this.stuinfo.teacherid,
        msg: this.sendmessageinfo,
        sender: "stu",
      });
      await this.$api.recordIfStuSendMessage({
        id: this.stuinfo.id,
      });
      this.sendmessageinfo = "";
    },
    stuSelectChangeTitle() {
      this.$confirm("确定修改选题？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {})
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
  position: absolute;
}
.v-move {
  transition: all 0.5s ease;
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
.rowformat {
  margin-top: 10px;
}
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
.connection {
  width: 50px;
  height: 50px;
  cursor: pointer;
  position: fixed;
  right: 50px;
  bottom: 50px;
  border-radius: 50%;
  background: #55efc4;
  text-align: center;
  padding-top: 10px;
  box-sizing: border-box;
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