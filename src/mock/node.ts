export default {
  getNodeList: (req: any) => {
    console.log("nodeListReq: ", req)
    return {
      code: 0,
      data: {
        nodesList: [
          {
              "id": "2",
              "xpos": 400,
              "ypos": 20,
              "content": "你好，请问是A先生吗？",
              "soundRecordable": false,
              "hasVariable": false
          },
          {
              "id": "3",
              "xpos": 230,
              "ypos": 165,
              "content": "请输入文本",
              "soundRecordable": false,
              "hasVariable": false
          },
          {
              "id": "5",
              "xpos": 520,
              "ypos": 145,
              "content": "请输入文本",
              "soundRecordable": false,
              "hasVariable": false
          },
          {
              "id": "7",
              "xpos": 750,
              "ypos": 155,
              "content": "请输入文本",
              "soundRecordable": false,
              "hasVariable": false
          },
          {
              "id": "9",
              "xpos": 340,
              "ypos": 285,
              "content": "请输入文本",
              "soundRecordable": false,
              "hasVariable": false
          },
          {
              "id": "11",
              "xpos": 510,
              "ypos": 275,
              "content": "请输入文本",
              "soundRecordable": false,
              "hasVariable": false
          },
          {
              "id": "13",
              "xpos": 680,
              "ypos": 295,
              "content": "请输入文本",
              "soundRecordable": false,
              "hasVariable": false
          },
          {
              "id": "15",
              "xpos": 100,
              "ypos": 315,
              "content": "请输入文本",
              "soundRecordable": false,
              "hasVariable": false
          },
          {
              "id": "17",
              "xpos": 260,
              "ypos": 395,
              "content": "请输入文本",
              "soundRecordable": false,
              "hasVariable": false
          },
          {
              "id": "19",
              "xpos": 420,
              "ypos": 395,
              "content": "请输入文本",
              "soundRecordable": false,
              "hasVariable": false
          }
          
      ],
        nodeRelations: [
          {
              "id": "2_3",
              "sourceId": "2",
              "targetId": "3",
              "intent": "请设置意图"
          },
          {
              "id": "2_5",
              "sourceId": "2",
              "targetId": "5",
              "intent": "请设置意图"
          },
          {
              "id": "2_7",
              "sourceId": "2",
              "targetId": "7",
              "intent": "请设置意图"
          },
          {
              "id": "5_9",
              "sourceId": "5",
              "targetId": "9",
              "intent": "请设置意图"
          },
          {
              "id": "5_11",
              "sourceId": "5",
              "targetId": "11",
              "intent": "请设置意图"
          },
          {
              "id": "5_13",
              "sourceId": "5",
              "targetId": "13",
              "intent": "请设置意图"
          },
          {
              "id": "3_15",
              "sourceId": "3",
              "targetId": "15",
              "intent": "请设置意图"
          },
          {
              "id": "9_17",
              "sourceId": "9",
              "targetId": "17",
              "intent": "请设置意图"
          },
          {
              "id": "9_19",
              "sourceId": "9",
              "targetId": "19",
              "intent": "请设置意图"
          },
          {
              "id": "17_21",
              "sourceId": "17",
              "targetId": "21",
              "intent": "请设置意图"
          },
          {
              "id": "17_23",
              "sourceId": "17",
              "targetId": "23",
              "intent": "请设置意图"
          }
      ]
      },
    };
  },
};
