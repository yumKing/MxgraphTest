<template>
  <div class="right-props">
    <span>右侧属性配置栏</span>
    <div class="diagram" v-if="isGlobal">
      <!-- header -->
      <div class="d-header">
        <div><span>通用</span></div>
      </div>

      <!-- body -->
      <div class="d-body">
        <span>body</span>
      </div>
    </div>
    <div class="diagram" v-else>
      <!-- header -->
      <div class="d-header">
        <div><span>文本</span></div>
        <div><span>录制</span></div>
        <div><span>其他</span></div>
      </div>

      <!-- body -->
      <div class="d-body">
        <span>body</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'RightProps',
  setup() {
    const isGlobal = ref(true);
    return {
      isGlobal,
    };
  },
});
</script>

<style></style>
