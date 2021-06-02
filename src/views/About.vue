<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-button @click="jumpMyFlow()">测试路由跳转</el-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const jumpMyFlow = () => {
      router.push({
        name: 'MyFlow',
        params: { user: 'abc' },
        query: { id: 123 },
      });
    };

    return {
      jumpMyFlow,
      // router
    };
  },

  // methods:{
  //   jumpMyFlow: function(){
  //     this.$router.push({name: 'MyFlow', params: {user: 'abc'}, query: {id: 123}})
  //   }
  // }
});
</script>
