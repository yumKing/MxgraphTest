<template>
  <svg :class="svgClass" aria-hidden="true" v-bind="$attrs">
    <use :xlink:href="iconClassName" />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

export default defineComponent({
  name: 'SvgIcon',

  props: {
    iconName: {
      type: String,
      required: false,
      default: '',
    },
    className: {
      type: String,
      required: false,
      default: '',
    },

    // // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    // propA: Number,
    // // 多个可能的类型
    // propB: [String, Number],
    // // 必填的字符串
    // propC: {
    //   type: String,
    //   required: true,
    // },
    // // 带有默认值的数字
    // propD: {
    //   type: Number,
    //   default: 100,
    // },
    // // 带有默认值的对象
    // propE: {
    //   type: Object,
    //   // 对象或数组默认值必须从一个工厂函数获取
    //   default: function () {
    //     return { message: 'hello' };
    //   },
    // },
    // // 自定义验证函数
    // propF: {
    //   validator: function (value) {
    //     // 这个值必须匹配下列字符串中的一个
    //     return ['success', 'warning', 'danger'].indexOf(value) !== -1;
    //   },
    // },
    // // 具有默认值的函数
    // propG: {
    //   type: Function,
    //   // 与对象或数组默认值不同，这不是一个工厂函数 —— 这是一个用作默认值的函数
    //   default: function () {
    //     return 'Default function';
    //   },
    // },
  },

  setup(props) {
    const pps = toRefs(props);

    //   const iconClassName = computed({
    //       get: () => '#icon-' + pps.iconName.value,
    //       set: val => {}
    //   })
    const iconClassName = computed(() => `#icon-${pps.iconName.value}`);
    const svgClass = computed(() => {
      if (pps.className.value) {
        return `svg-icon ${pps.className.value}`;
      } else {
        return 'svg-icon';
      }
    });
    return {
      iconClassName,
      svgClass,
    };
  },
});
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1.1em;
  height: 1.1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
