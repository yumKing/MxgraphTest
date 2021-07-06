<template>
  <div class="toolbar">
    <span style="margin-right: 50px">工具栏</span>
    <el-button type="primary" round @click="createProcess">新建</el-button>
    <el-button type="primary" round @click="saveProcess">保存</el-button>
    <el-button type="primary" round @click="publishProcess">发布</el-button>
    <el-tag style="margin-left: 50px">发布状态</el-tag>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { Types } from '@/store/modules/type';

export default defineComponent({
  name: 'Toolbar',
  setup() {
    const store = useStore();

    const saveProcess = () => {
      store.dispatch(Types.TRIGGER_SAVE);
    };

    const publishProcess = () => {
      store.dispatch(Types.TRIGGER_PUBLISH);
    };

    const createProcess = () => {
      store.dispatch(Types.TRIGGER_CREATE);
    };

    return {
      saveProcess,
      publishProcess,
      createProcess,
    };
  },
});
</script>

<style></style>
