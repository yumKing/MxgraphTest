import { Types } from './type';

export interface ProcessState {
  create: boolean;
  save: boolean;
  publish: boolean;
  processId: number;
}

const process = {
  state: {
    create: false,
    save: false,
    publish: false,
    processId: 0,
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
  },
};

export default process;
