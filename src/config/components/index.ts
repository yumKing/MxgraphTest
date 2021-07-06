import { App } from 'vue';
import IconSvg from './icon/SvgIcon.vue';

export default function configComponents(app: App) {
  app.component('svg-icon', IconSvg);
}
