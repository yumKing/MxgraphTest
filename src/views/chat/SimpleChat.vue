<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    
  </div>
</template>

<script lang="ts">

import { defineComponent, onBeforeUnmount, onMounted, reactive,toRefs, getCurrentInstance} from "vue";

export default defineComponent({
  // components: {  },
  name: "MyFlow",
  setup() {
    const { curThis } = getCurrentInstance() as any
    const state = reactive({
      title: '简单聊天窗'
    });

    onMounted(() => {
      console.log(state.title)
    });

    onBeforeUnmount(() => {
    });



    return {
      ...toRefs(state),
    };
  },
});
</script>

<style></style>
