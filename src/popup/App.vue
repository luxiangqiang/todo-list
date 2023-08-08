<template>
  <div class="container">
    <!-- header -->
    <header>
      <div v-if="isShowTitle" class="header-title" @dblclick="handlerDbclickTitle">
        {{ title }}
      </div>
      <el-input v-else v-focus class="title-input" v-model.trim="title" placeholder="请输入标题～" size="medium"
        @blur="handlerTitleInputBlur()" @keyup.enter.native="handlerTitleInputBlur()"></el-input>
    </header>
    <!-- card -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <div class="card-time">
          <i class="iconfont icon-mdatepicker"></i>
          {{ nowTime }}
        </div>
        <el-button type="text" @click="handlerAddTask">
          <i class="el-icon-circle-plus-outline card-add-icon"></i>
          添加待办事项
        </el-button>
      </div>
      <!-- todo list -->
      <div v-if="tasks.length !== 0">
        <draggable v-model="tasks" :disabled="draggableDisabled" animation="200" @start="onStart" @end="onEnd"
          @click.stop>
          <transition-group name="fade" tag="div">
            <el-row :class="{ 'clear-transition': !isDrag }" v-for="item of tasks" :key="item.id">
              <el-col>
                <el-checkbox class="checkbox" v-model="item.checked" @change="handlerCheckboxChange(item)"></el-checkbox>
                <el-tooltip v-if="!item.isEdit" class="item" effect="light" :content="item.label" placement="top"
                  :open-delay="500">
                  <label class="checkbox-text" :class="{ select: item.checked }" @dblclick.stop="handlerEditTask(item)">
                    {{ item.label }} </label>
                </el-tooltip>
                <el-input v-else v-focus class="text-input" v-model="item.label" placeholder="输入待办任务～" size="mini"
                  @blur="handlerBlur(item)"></el-input>
                <i class="el-icon-delete show-remove-icon" @click="handlerRemoveTask(item)"></i>
              </el-col>
            </el-row>
          </transition-group>
        </draggable>
      </div>
      <!-- empty -->
      <el-empty v-else :image-size="70" description="暂无任务列表，快去创建吧～"></el-empty>
    </el-card>
    <!-- footer -->
    <footer>
      <el-button size="mini" @click="handlerSourceCode">
        <i class="iconfont icon-github"></i>
        源码
      </el-button>
      <el-button size="mini" @click="handlerContactAuthor">
        <i class="iconfont icon-weixin1"></i>
        联系我
      </el-button>
      <el-button size="mini" @click="handlerRewardAuthor" class="reward">
        <i class="iconfont icon-dashang1"></i>
        打赏
      </el-button>
      <el-button size="mini" @click="handlerClear" :disabled="clearDisabled" class="clear">
        <i class="iconfont icon-qingkong1"></i>
        清空
      </el-button>
    </footer>
    <!-- Dialog -->
    <AuthorDialog ref="AuthorDialog" :isShowFooter="isShowFooter">
    </AuthorDialog>
    <ClearDialog ref="ClearDialog" @confirm="handlerConfirmClear">
    </ClearDialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import AuthorDialog from './components/author-dialog.vue';
import ClearDialog from './components/clear-dialog.vue'
import {
  saveTitleLocalstory,
  getTitleLocalstory,
  setTasksListLocalstory,
  getTasksListLocalstory,
  updateTasksListLocalstory,
  clearTasksLocalstory,
  setBadgeText
} from '../utils/index';
import myWechart from '../icons/myWechart.png';
import wechart from '../icons/wechart.png';
import zhifubao from '../icons/zhifubao.png';
import gongzhonghao from '../icons/gongzhonghao.png';

const defaultTitle = "";
export default {
  components: {
    draggable,
    AuthorDialog,
    ClearDialog
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus()
      }
    }
  },
  data() {
    return {
      drag: false,
      isDrag: false,
      isShowAddTaskDialog: false,
      draggableDisabled: false,
      title: defaultTitle,
      isTitleEdit: false,
      isShowFooter: false,
      clearDisabled: false,
      tasks: [],
    }
  },
  computed: {
    nowTime() {
      return dayjs().format('YYYY-MM-DD');
    },
    isShowTitle() {
      return !this.isTitleEdit && this.title !== ''
    }
  },
  created() {
    this.init();
  },
  destroyed() {
    setTasksListLocalstory(this.tasks);
  },
  watch: {
    tasks: {
      deep: true,
      immediate: true,
      handler(tasks) {
        this.clearDisabled = tasks.length === 0;
        const undone = tasks.filter(el => !el.checked);
        setBadgeText(String(undone.length));
      }
    }
  },
  methods: {
    // Init
    init() {
      getTasksListLocalstory(this);
      getTitleLocalstory(this);
    },
    // Start Drag
    onStart() {
      this.drag = true;
      this.isDrag = true;
    },
    // End Drag
    onEnd() {
      this.drag = false;
      this.isDrag = false;
      updateTasksListLocalstory(this.tasks);
    },
    // Clear Tasks
    handlerClear() {
      this.$refs['ClearDialog'].open();
    },
    // Confirm Tasks
    handlerConfirmClear(onlyDeleteDone) {
      const { tasks } = this;
      if (onlyDeleteDone) {
        this.tasks = tasks.filter(el => !el.checked);
        updateTasksListLocalstory(this.tasks);
      } else {
        this.tasks = [];
        clearTasksLocalstory();
      }
    },
    // Look Source Code
    handlerSourceCode() {
      window.open('https://github.com/luxiangqiang/todo-list');
    },
    // Contact Author
    handlerContactAuthor() {
      this.isShowFooter = false;
      this.$refs['AuthorDialog'].open(['公众号', '微信'], [gongzhonghao, myWechart]);
    },
    // Reward Author
    handlerRewardAuthor() {
      this.isShowFooter = true;
      this.$refs['AuthorDialog'].open(['微信', '支付宝'], [wechart, zhifubao]);
    },
    // Dbclick Title
    handlerDbclickTitle() {
      this.isTitleEdit = true;
    },
    // Save Title
    handlerTitleInputBlur() {
      const { title } = this;
      if (title !== '') {
        this.isTitleEdit = false;
      }
      saveTitleLocalstory(title);
    },
    // Add Task
    handlerAddTask() {
      this.isDrag = true;
      if (this.tasks.length > 49) {
        alert('最多创建 50 个任务哦～')
        return;
      }
      this.draggableDisabled = true;
      this.tasks.unshift({
        id: uuidv4(),
        label: '',
        isEdit: true,
        checked: false
      });
    },
    // Remove Task
    handlerRemoveTask(item) {
      this.isDrag = true;
      this.$nextTick(() => {
        const index = this.tasks.findIndex(el => el.id === item.id);
        this.tasks.splice(index, 1);
        updateTasksListLocalstory(this.tasks);
      })
    },
    // Input Blur
    handlerBlur(item) {
      if (item.label.trim() !== '') {
        item.isEdit = false;
        setTasksListLocalstory(this.tasks);
      } else {
        this.handlerRemoveTask(item);
      }
      this.draggableDisabled = false;
    },
    // Edit Text
    handlerEditTask(item) {
      if (!item.isEdit) {
        item.isEdit = true;
      }
    },
    // Checkbox Change
    handlerCheckboxChange(item) {
      if (item.checked) {
        this.isDrag = true;
        const { tasks } = this;
        let temp = []
        const preIndex = tasks.findIndex(el => el.id === item.id);
        if (preIndex > 0) {
          const pre = tasks.slice(0, preIndex);
          temp = pre
        }
        const nextArr = tasks.slice(preIndex + 1, tasks.length)
        if (nextArr.length > 0) {
          temp.push(...nextArr)
        }
        temp.push(item)
        this.tasks = temp;
      }
      updateTasksListLocalstory(this.tasks);
    },
  }
}
</script>

<style>
@import './common.css';
</style>
<style scoped>
/* 动画 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.clear-transition {
  transition: unset !important;
}

.fade-enter {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-leave-active {
  position: absolute;
}

.container {
  width: 350px;
  padding: 0 10px;
  background: #F2F6FC;
  margin: 20px 0 10px 0;
  font-family: "微软雅黑";
}

.header-title {
  width: 350px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 18px;
  padding: 0 0 10px 10px;
  margin-bottom: 15px;
  color: #2a3a4a;
  font-weight: 500;
  border-bottom: 1px solid #E4E7ED;
  user-select: none;
}

.todo-list {
  border-radius: 6px;
  background: #fff;
  padding: 10px;
  height: 300px;
  overflow: auto;
}

/* Row */
.el-row {
  height: 35px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 0 10px;
  margin-bottom: 5px;
  border-bottom: 1px solid #E4E7ED;
}

/* Col */
.el-col {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-right: 20px;
}

/* checkbox 文本 */
.checkbox-text {
  width: 100%;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: move;
  user-select: none;
}

/*  移除 icon */
.el-icon-delete {
  display: none;
  position: absolute;
  right: 0;
  cursor: pointer;
  font-size: 14px;
  color: #ccc;
}

/* 移除 icon hover */
.el-col:hover .show-remove-icon {
  display: block;
}

.select {
  text-decoration: line-through;
  color: #ccc;
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-time {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.icon-mdatepicker {
  margin-right: 5px;
}

.card-add-icon {
  font-size: 15px;
  font-weight: 500;
}

footer {
  margin-top: 10px;
  display: flex;
  font-size: 15px;
  justify-content: space-between;
  color: #afacac;
}

.icon-github {
  font-size: 16px;
}

.icon-dashang1 {
  font-size: 14px;
}

.icon-weixin1 {
  font-size: 18px;
}

.icon-qingkong1 {
  font-size: 13px;
}

.reward:hover .icon-dashang1 {
  -webkit-transform: rotateY(360deg);
  transform: rotateY(360deg);
  -webkit-transition: -webkit-transform .5s;
  transition: transform .5s;
}

.clear:hover .icon-qingkong1 {
  -webkit-transform: rotate(360deg);
  transform: rotate(360deg);
  -webkit-transition: -webkit-transform .5s;
  transition: transform .5s;
}
</style>

