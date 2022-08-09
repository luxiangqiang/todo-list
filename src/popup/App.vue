<template>
  <div class="container">
    <!-- header -->
    <header>
      <div 
        v-if="isShowTitle"
        class="header-title" 
        @dblclick="handlerDbclickTitle"
      >
        {{ title }}
      </div>
      <el-input 
        v-else
        v-focus
        class="title-input"
        v-model.trim="title" 
        placeholder="请输入标题～"
        size="medium"
        @blur="handlerTitleInputBlur()"
        @keyup.enter.native="handlerTitleInputBlur()" 
      ></el-input>
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
        <draggable 
          v-model="tasks" 
          animation="300"
          @start="onStart"
          @end="onEnd"
        >
          <el-row v-for="(item, index) of tasks" :key="index">
            <el-col>
              <el-checkbox 
                class="checkbox"
                v-model="item.checked"
                @change="handlerCheckboxChange"
              ></el-checkbox>
              <label 
                v-if="!item.isEdit"
                class="checkbox-text" 
                :class="{select: item.checked}"
                @dblclick.stop="handlerEditTask(item)"
              >
                {{ item.label }}
              </label> 
              <el-input 
                v-else
                v-focus
                class="text-input"
                v-model="item.label" 
                placeholder="输入待办任务～"
                size="mini"
                @blur="handlerBlur(item)"
              ></el-input>
              <i class="el-icon-delete show-remove-icon" @click="handlerRemoveTask(item)"></i>
            </el-col>
          </el-row>
        </draggable>
      </div>
      <!-- empty -->
      <el-empty
        v-else
        :image-size="70"
        description="暂无任务列表，快去创建吧～"
      ></el-empty>
    </el-card>
    <!-- footer -->
    <footer>
      
    </footer>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { 
  saveTitleLocalstory,
  getTitleLocalstory,
  setTasksListLocalstory, 
  getTasksListLocalstory, 
  updateTasksListLocalstory,
  setBadgeText
} from '../utils/index';

const defaultTitle = "标题";
export default {
  components:{
    draggable
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus()
        el.querySelector('input').select()
      }
    }
  },
  data() {
    return {
      drag: false,
      isShowAddTaskDialog: false,
      title: defaultTitle,
      isTitleEdit: false,
      tasks: [],
    }
  },
  computed: {
    nowTime(){
      return dayjs().format('YYYY-MM-DD');
    },
    isShowTitle(){
      return !this.isTitleEdit && this.title !== ''
    }
  },

  created(){
    this.init();
  },

  destroyed(){
    setTasksListLocalstory(this.tasks);
  },

  watch:{
    tasks:{
      deep: true,
      immediate: true,
      handler(tasks){
        const undone = tasks.filter(el=>!el.checked);
        setBadgeText(String(undone.length));
      }
    }
  },

  methods:{
    // Init
    init(){
      getTasksListLocalstory(this);
      getTitleLocalstory(this);
    },
    // Start Drag
    onStart(){
      this.drag = true;
    },
    // End Drag
    onEnd(){
      this.drag = false;
      updateTasksListLocalstory(this.tasks);
    },
    // Dbclick Title
    handlerDbclickTitle(){
      this.isTitleEdit = true;
    },
    // Save Title
    handlerTitleInputBlur(){
      const { title } = this;
      if(title !== ''){
        this.isTitleEdit = false;
      }
      saveTitleLocalstory(title);
    },
    // Add Task
    handlerAddTask(){
      const id = uuidv4();
      const task = {
        id: id,
        label: '',
        isEdit: true,
        checked: false
      }
      this.tasks.push(task);
    },
    // Remove Task
    handlerRemoveTask(item){
      const index = this.tasks.findIndex(el=>el.id === item.id);
      this.tasks.splice(index, 1);
      updateTasksListLocalstory(this.tasks);
    },
    // Input Blur
    handlerBlur(item){
      if(item.label !== ''){
        item.isEdit = false;
        setTasksListLocalstory(this.tasks);
      }else{
        this.handlerRemoveTask(item);
      }
    },
    // Edit Text
    handlerEditTask(item){
      if(!item.isEdit){
        item.isEdit = true;
      }
    },
    // Checkbox Change
    handlerCheckboxChange(){
      updateTasksListLocalstory(this.tasks);
    }
  }
}
</script>

<style scoped>
.container {
  width: 350px;
  padding: 0 10px;
  background: #F2F6FC;
  margin: 20px 0;
  font-family: "微软雅黑";
}
.header-title {
  width: 350px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 18px;
  padding:0 0 10px 10px;
  margin-bottom: 15px;
  color: #2a3a4a;
  font-weight: 500;
  border-bottom: 1px solid #E4E7ED;
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
.checkbox-text{
  width: 100%;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
/*  移除 icon */
.el-icon-delete{
  display: none;
  position: absolute;
  right: 0;
  cursor: pointer;
  font-size: 14px;
  color: #ccc;
}
/* 移除 icon hover */
.el-col:hover .show-remove-icon{
  display: block;
}
.select{
  text-decoration: line-through;
  color: #ccc;
}
.card-header{
  display: flex;
  justify-content: space-between;
}
.card-time{
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}
.icon-mdatepicker{
  margin-right: 5px;
}
.card-add-icon{
  font-size: 15px;
  font-weight: 500;
}
</style>
<style>
.el-checkbox {
  width: 100%;
}
.checkbox{
  width: auto !important;
  margin-right: 10px !important;
}
/* 默认 checkbox 样式 */
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: #4ea30a !important;
  background-color: #4ea30a !important;
}
.el-checkbox__input.is-checked+.el-checkbox__label{
  color: #4ea30a !important;
}
.el-checkbox__inner:hover{
  border-color: #4ea30a !important;
}
.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #4ea30a !important;
}
/* card */
.el-card__header{
  padding: 0 15px 0 12px!important
}
.el-card__body{
  padding: 10px 20px !important;
  min-height: 200px !important;
  max-height: 236px !important;
  overflow-y: auto !important;
}
/* input */
.box-card .el-input__inner{
  border: 0 !important;
  margin-left: -15px !important;
  color: #606266 !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}
/* titl input */
.title-input .el-input__inner{
  border-top: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
  background-color: #F2F6FC !important;
  font-size: 18px !important;
  padding-bottom: 10px !important;
  margin-bottom: 15px !important;
  border-bottom: 1px solid #E4E7ED !important;
  color: #2a3a4a !important;
  font-weight: 500 !important;
}
</style>
