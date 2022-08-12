<template>
  <el-dialog 
    :show-close="false"
    :show-header="false"
    :visible.sync="show"
  >
    <div class="container">
      <el-radio-group v-model="mode">
        <el-radio-button :label="modes[0]"></el-radio-button>
        <el-radio-button :label="modes[1]"></el-radio-button>
      </el-radio-group>
    </div>
    <el-image
      :src="imageUrl"
      fit="fill"
    >
    </el-image>
    <div class="footer" v-if="isShowFooter">
      <el-button size="mini" type="warning" @click="close">偷偷打赏</el-button>
      <el-button size="mini"  @click="close" class="cancal">下次一定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props:{
    isShowFooter:{
      type: Boolean,
      default: false
    }
  },
  computed:{
    imageUrl(){
      const { modes, mode, images } = this;
      return mode === modes[0] ? images[0] : images[1]; 
    }
  },
  data(){
    return {
      show: false,
      modes:[],
      images:[],
      mode: ''
    }
  },
  methods:{
    open(modes, images){
      this.mode = modes[0];
      this.modes = modes;
      this.images = images;
      this.show = true;
    },
    close(){
      this.show = false;
    }
  }
}
</script>

<style scoped>
.container{
  display: flex;
  justify-content: center;
}
.footer{
  display: flex;
}

.cancal:hover{
  display: none;
}
</style>