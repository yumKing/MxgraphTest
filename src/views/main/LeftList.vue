<template>
  <div class="left-list">
    <span>左侧列表栏</span>
    <ul>
      <li v-for="item in processList" :key="item.id" @click="skipProcessDetail(item.id)">{{ item.pname }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, ref, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useStore } from 'vuex';
import * as rx from 'rxjs';
import * as op from 'rxjs/operators';
import ProcessApi from '@/api/process';
import { Types } from '@/store/modules/type';

export default defineComponent({
  name: 'LeftList',
  setup() {
    const cc = getCurrentInstance();
    console.log('left:', cc?.proxy?.$router);

    const queryForm = reactive({
      current: 1,
      size: 10,
    });
    const processList = ref<Array<any>>([]);

    rx.of(123)
      .pipe(
        op.switchMapTo(ProcessApi.getProcessPage(queryForm)),
        op.map((res) => res.data.records),
        op.tap((data) => {
          processList.value = data;
        })
      )
      .subscribe();

    // const router = useRouter();
    // const skipProcessDetail = (id: any) => {
    //   console.log('skipProcessDetail: ', id);
    //   router.push({ name: 'processHome', params: { id: id } });
    // };

    const store = useStore();
    // 触发查询该流程详情
    const skipProcessDetail = (id: number) => {
      store.dispatch(Types.SET_PROCESS_DETAIL, id);
    };

    return {
      processList,
      skipProcessDetail,
    };
  },
});
</script>

<style></style>
