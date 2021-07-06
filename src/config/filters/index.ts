import { App } from 'vue';

/**
 * 在组件中使用 $filters.xxx()调用
 * @param app
 */
export default function configFilters(app: App) {
  app.config.globalProperties.$filters = {
    /**
     * 设置美元
     * @param value
     * @returns
     */
    currencyUSD(value: string | number) {
      return `$${value}`;
    },
  };
}
