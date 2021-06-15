<template>
  <div class="main-pane">
    <!-- 菜单栏 -->
    <menus></menus>
    <!-- 工具栏 -->
    <toolbar></toolbar>
    <!-- main -->
    <div class="main">
      <!-- 左侧列表栏 -->
      <left-list></left-list>
      <!-- 中间画布栏 -->
      <div class="main-router">
        <router-view />
      </div>
      <!-- <process></process> -->
      <!-- 右侧属性配置栏 -->
      <right-props></right-props>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Menus from '@/views/main/Menus.vue';
import Toolbar from '@/views/main/Toolbar.vue';
import LeftList from '@/views/main/LeftList.vue';
import RightProps from '@/views/main/RightProps.vue';

export default defineComponent({
  name: 'MainPane',
  components: {
    Menus,
    Toolbar,
    LeftList,
    RightProps,
  },
  setup() {},
});
</script>

<style></style>
