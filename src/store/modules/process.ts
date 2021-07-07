import { Types } from './type';

export interface ProcessState {
  create: boolean;
  save: boolean;
  publish: boolean;
  processId: number;
  showGlobal: boolean;
  showNode: boolean;
  activetabName: string;
  form: any;
  nodeData: any;
}

const process = {
  state: {
    create: false,
    save: false,
    publish: false,
    processId: 0,
    showGlobal: true,
    showNode: false,
    activetabName: 'first',
    form: null,
    nodeData: null,
  },
  mutations: {
    // 触发创建操作
    [Types.TRIGGER_CREATE]: (state: ProcessState) => {
      state.create = !state.create;
    },
    // 触发保存操作
    [Types.TRIGGER_SAVE]: (state: ProcessState) => {
      state.save = !state.save;
    },
    // 触发发布操作
    [Types.TRIGGER_PUBLISH]: (state: ProcessState) => {
      state.publish = !state.publish;
    },
    // 触发发布操作
    [Types.SET_PROCESS_DETAIL]: (state: ProcessState, id: number) => {
      state.processId = id;
    },
    // 右侧栏 show 全局操作
    [Types.SHOW_GLOBAL]: (state: ProcessState, form: any) => {
      state.showGlobal = true;
      state.showNode = false;
      state.activetabName = 'first';
      state.form = form;
    },
    // 右侧栏 show 结点操作
    [Types.SHOW_NODE]: (state: ProcessState, form: any) => {
      state.showGlobal = false;
      state.showNode = true;
      state.activetabName = 'first';
      state.form = form;
    },
    // 右侧栏 show 结点关系操作
    [Types.SHOW_REL]: (state: ProcessState, form: any) => {
      state.showGlobal = false;
      state.showNode = false;
      state.activetabName = 'first';
      state.form = form;
    },
    // 右侧栏 修改结点数据
    [Types.UPDATE_NODE_DATA]: (state: ProcessState, form: any) => {
      state.nodeData = form;
    },
  },
  actions: {
    [Types.TRIGGER_CREATE]: ({ commit }: any) => {
      commit(Types.TRIGGER_CREATE);
    },
    [Types.TRIGGER_SAVE]: ({ commit }: any) => {
      commit(Types.TRIGGER_SAVE);
    },
    [Types.TRIGGER_PUBLISH]: ({ commit }: any) => {
      commit(Types.TRIGGER_PUBLISH);
    },
    [Types.SET_PROCESS_DETAIL]: ({ commit }: any, id: number) => {
      commit(Types.SET_PROCESS_DETAIL, id);
    },
    [Types.SHOW_GLOBAL]: ({ commit }: any, form: any) => {
      commit(Types.SHOW_GLOBAL, form);
    },
    [Types.SHOW_NODE]: ({ commit }: any, form: any) => {
      commit(Types.SHOW_NODE, form);
    },
    [Types.SHOW_REL]: ({ commit }: any, form: any) => {
      commit(Types.SHOW_REL, form);
    },
    [Types.UPDATE_NODE_DATA]: ({ commit }: any, form: any) => {
      commit(Types.UPDATE_NODE_DATA, form);
    },
  },
};

export default process;
