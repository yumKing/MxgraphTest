import { App } from 'vue';
import configDirectives from './directive/index';
import configFilters from './filters/index';
import configComponents from './components/index';

export default function customConfig(app: App) {
  configDirectives(app);
  configFilters(app);
  configComponents(app);
}
