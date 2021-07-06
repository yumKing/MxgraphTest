import { App, Directive } from 'vue';
import store from '@/store';
import * as _ from 'lodash';

const directives: Array<{ name: string; op: Directive }> = [];

directives.push({
  name: 'privilege',
  op: {
    mounted(el: HTMLElement, binding) {
      const tempArr = store.getters.privilege;
      const index = _.findIndex(tempArr, (item: any) => {
        return item.code === binding.value;
      });
      if (index === -1) {
        (el as any).parentNode.removeChild(el);
      }
    },
    updated(el: HTMLElement, binding) {},
  },
});

export default function configDirectives(app: App) {
  directives.forEach((ds) => {
    app.directive(ds.name, ds.op);
  });
}
