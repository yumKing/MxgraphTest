<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <button @click="test">修改msg值</button>
    <HelloWorld :msg="msg" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },

  setup(props, context) {
    let msg = ref('Welcome to Your Vue.js + TypeScript App');
    const title = ref('this is title');

    console.log('create home component');
    console.dir(props);
    console.dir(context);
    console.log(title);

    onBeforeUnmount(() => {
      console.log('close home component');
    });

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

  // created() {

  // },
  // beforeUnmount() {

  // },
  // methods: {
  //   test() {

  //   },

  //   showData() {

  //   },
  // },
});
</script>
