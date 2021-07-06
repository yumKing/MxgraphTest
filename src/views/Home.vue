<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <button @click="test">修改msg值</button>
    <HelloWorld :msg="msg" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref, watch, watchEffect } from 'vue';
import HelloWorld from '@/views/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },

  // props: {
  //   name: String,
  //   success: { type: String },
  //   callback: {
  //     type: Function as PropType<() => void>
  //   },
  //   message: {
  //     type: Object as PropType<ComplexMessage>,
  //     required: true,
  //     validator(message: ComplexMessage) {
  //       return !!message.title
  //     }
  //   }
  // }

  setup(props, context) {
    let msg = ref('Welcome to Your Vue.js + TypeScript App');
    const title = ref('this is title');

    console.log('create home component');
    // console.dir(props);
    // console.dir(context);
    // console.log(title);

    onBeforeUnmount(() => {
      console.log('close home component');
    });

    // 计算属性
    const count = ref(1);
    // const propsCount = computed({
    //   get: () => count.value + 1,
    //   set: val => count.value = val -1
    // });
    // 监听属性
    // const stop = watchEffect(() => console.log(count.value))
    // setTimeout(() => count.value++, 100)
    // 主动停止帧听
    // stop()

    // 注册 清除函数， 在id改变时暂停fetchData函数执行，等改变完成再执行
    // const data = ref(null)
    // watchEffect(async onInvalidate => {
    //   onInvalidate(() => {...}) // 我们在Promise解析之前注册清除函数
    //   data.value = await fetchData(props.id)
    // }， { onTrigger(e){debugger}})

    // watch( count, (count,preCount) => {})
    // watch( [fooRef, barRef], ([fooRef, barRef],[preFooRef, preBarRef]) => {})

    const test = (): void => {
      msg.value = 'test' + Math.floor(Math.random() * 10);
    };

    const showData = (): void => {
      console.log(title.value);
    };

    showData();

    return {
      test,
      msg,
    };
  },

  // data() {

  // },

  // methods: {
  //   test() {

  //   },

  //   showData() {

  //   },
  // },
});
</script>
