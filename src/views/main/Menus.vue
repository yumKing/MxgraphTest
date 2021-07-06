<template>
  <div class="menus">
    <span style="margin-right: 50px">顶部菜单栏</span>
    <router-link to="/dashboard/home">Home</router-link> |
    <!-- <router-link to="/about">About</router-link> | -->
    <router-link to="/test/testHome">Graph-Index</router-link> |
    <router-link to="/process/processHome">MainPane</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Menus',
  setup() {},
});
</script>

<style></style>
