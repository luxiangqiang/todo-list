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
  </el-dialog>
</template>

<script>
export default {
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
    }
  }
}
</script>

<style scoped>
.container{
  display: flex;
  justify-content: center;
}
</style>