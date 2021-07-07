<template>
  <div class="right-props">
    <span>右侧属性配置栏</span>
    <div class="diagram" v-if="showGlobal">
      <el-tabs v-model="activetabName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="流程基本信息" name="first">
          <el-form :model="speechCraftForm" label-width="80px">
            <el-form-item label="全局数据信息">
              <el-input v-model="speechCraftForm.globalData"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="文本对话测试" name="second"> 画对话 </el-tab-pane>
      </el-tabs>
    </div>
    <div class="diagram" v-else-if="showNode">
      <el-tabs v-model="activetabName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="语句管理" name="first">
          <el-form :model="speechCraftForm" label-width="80px">
            <el-form-item label="可用变量">
              <el-select v-model="selectVal">
                <el-option label="姓名" value="{name}"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="话术内容">
              <el-input type="textarea" v-model="speechCraftForm.content" @input="fixSpeechContent"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="录制管理" name="second">录制管理</el-tab-pane>
        <el-tab-pane label="其他" name="last">其他</el-tab-pane>
      </el-tabs>
    </div>

    <div class="diagram" v-else>
      <el-tabs v-model="activetabName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="意图管理" name="first">
          <el-form :model="speechCraftForm" label-width="80px">
            <el-form-item label="选择意图">
              <el-select v-model="speechCraftForm.intentId" @change="fixSpeechIntent">
                <el-option label="意图1" value="1"></el-option>
                <el-option label="意图2" value="2"></el-option>
                <el-option label="意图3" value="3"></el-option>
                <el-option label="意图4" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <span>新增意图</span>
          <el-form :model="addIntentForm" label-width="80px">
            <el-form-item label="意图名称">
              <el-input v-model="addIntentForm.intentName"></el-input>
            </el-form-item>
            <el-form-item label="意图code">
              <el-input v-model="addIntentForm.intentCode"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitIntentForm">新增</el-button>
              <el-button type="primary" @click="resetIntentForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="其他" name="last">其他</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Types } from '@/store/modules/type';
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'RightProps',
  setup() {
    const store = useStore();
    const showGlobal = computed(() => store.getters.showGlobal);
    const showNode = computed(() => store.getters.showNode);
    const activetabName = computed({ get: () => store.getters.activetabName, set: (c) => c });
    const handleTabClick = (tab: any, evt: any) => {
      // console.log(tab, evt);
    };
    const selectVal = '';
    const speechCraftForm = ref<{
      globalData: string;
      content: string;
      intentId: string;
      nodeId: string;
    }>({
      globalData: '',
      content: '',
      intentId: '',
      nodeId: '',
    });

    // 修改结点话术内容
    const fixSpeechContent = (val: string) => {
      store.dispatch(Types.UPDATE_NODE_DATA, { nodeId: speechCraftForm.value.nodeId, content: val });
    };
    // 修改意图
    const fixSpeechIntent = (val: string) => {
      store.dispatch(Types.UPDATE_NODE_DATA, { nodeId: speechCraftForm.value.nodeId, intentId: val });
    };

    const addIntentForm = ref<{
      intentName: string;
      intentCode: string;
    }>({
      intentName: '',
      intentCode: '',
    });
    const resetIntentForm = () => {
      ElMessage.success({
        message: '重置',
        type: 'success',
      });
    };

    const submitIntentForm = () => {
      ElMessage.success({
        message: '提交成功',
        type: 'success',
      });
    };

    //展示数据
    watch(
      () => store.getters.form,
      (cur, pre) => {
        speechCraftForm.value = cur;
      }
    );

    // 保存数据
    // watch(
    //   () => store.getters.rightSave,
    //   (cur, pre) => {

    //   }
    // )
    return {
      showGlobal,
      showNode,
      activetabName,
      speechCraftForm,
      handleTabClick,
      selectVal,
      fixSpeechContent,
      fixSpeechIntent,
      submitIntentForm,
      resetIntentForm,
      addIntentForm,
    };
  },
});
</script>

<style></style>
