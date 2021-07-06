import { createStore } from 'vuex';
import getters from './getters';
import process from './modules/process';

export default createStore({
  modules: {
    process,
  },
  getters: getters,
});
