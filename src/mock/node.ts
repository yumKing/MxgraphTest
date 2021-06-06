export default {
  getNodeList: (req: any) => {
    console.log('nodeListReq: ', req);
    return {
      code: 0,
      data: {
        nodesList: {
          '2': {
            id: '2',
            xpos: 640,
            ypos: 20,
            content: '你好，请问是A先生吗？',
            soundRecordable: false,
            hasVariable: false,
          },
          '3': {
            id: '3',
            xpos: 230,
            ypos: 165,
            content: '有兴趣可以了解下理财产品，增值自己的资金',
            soundRecordable: false,
            hasVariable: false,
          },
          '5': {
            id: '5',
            xpos: 640,
            ypos: 150,
            content: '你了解理财吗？',
            soundRecordable: false,
            hasVariable: false,
          },
          '7': {
            id: '7',
            xpos: 1090,
            ypos: 150,
            content: '那不打扰您了，再见！',
            soundRecordable: false,
            hasVariable: false,
          },
          '9': {
            id: '9',
            xpos: 390,
            ypos: 285,
            content: '你想投资xx理财产品吗',
            soundRecordable: false,
            hasVariable: false,
          },
          '11': {
            id: '11',
            xpos: 630,
            ypos: 275,
            content: '那不打扰您了，再见！',
            soundRecordable: false,
            hasVariable: false,
          },
          '13': {
            id: '13',
            xpos: 910,
            ypos: 280,
            content: '后续可以咨询12345来了解相关理财产品，再见！',
            soundRecordable: false,
            hasVariable: false,
          },
          '15': {
            id: '15',
            xpos: 90,
            ypos: 300,
            content: '后续想了解相关问题，可咨询12345 ，再见',
            soundRecordable: false,
            hasVariable: false,
          },
          '17': {
            id: '17',
            xpos: 240,
            ypos: 410,
            content: '好的，具体投资可咨询12345联系，祝您生活愉快，再见！',
            soundRecordable: false,
            hasVariable: false,
          },
          '19': {
            id: '19',
            xpos: 560,
            ypos: 395,
            content:
              '好的，你后续可以关注下xx理财产品，有任何想了解的，可致电12345了解，再见！',
            soundRecordable: false,
            hasVariable: false,
          },
        },
        nodeRelations: {
          '2_3': {
            id: '2_3',
            sourceId: '2',
            targetId: '3',
            intent: '其他',
          },
          '2_5': {
            id: '2_5',
            sourceId: '2',
            targetId: '5',
            intent: '肯定',
          },
          '2_7': {
            id: '2_7',
            sourceId: '2',
            targetId: '7',
            intent: '否定',
          },
          '5_9': {
            id: '5_9',
            sourceId: '5',
            targetId: '9',
            intent: '肯定',
          },
          '5_11': {
            id: '5_11',
            sourceId: '5',
            targetId: '11',
            intent: '否定',
          },
          '5_13': {
            id: '5_13',
            sourceId: '5',
            targetId: '13',
            intent: '其他',
          },
          '3_15': {
            id: '3_15',
            sourceId: '3',
            targetId: '15',
            intent: '任意',
          },
          '9_17': {
            id: '9_17',
            sourceId: '9',
            targetId: '17',
            intent: '肯定',
          },
          '9_19': {
            id: '9_19',
            sourceId: '9',
            targetId: '19',
            intent: '否定',
          },
        },
      },
    };
  },
};
