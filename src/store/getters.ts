const getters = {
  processCreate: (state: any) => state.process.create,
  processSave: (state: any) => state.process.save,
  processPublish: (state: any) => state.process.publish,
  processId: (state: any) => state.process.processId,
  showGlobal: (state: any) => state.process.showGlobal,
  showNode: (state: any) => state.process.showNode,
  activetabName: (state: any) => state.process.activetabName,
  form: (state: any) => state.process.form,
  nodeData: (state: any) => state.process.nodeData,
};

export default getters;
