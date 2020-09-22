import Mock from 'mockjs'
// import { hasOwnMetadata } from 'core-js/fn/reflect'

Mock.mock('/routes', 'get', () => {
  let result = {}
  result.code = 0
  // result.data = [{
  //   router: 'root',
  //   children: [
  //     {
  //       router: 'dashboard',
  //       children: ['workplace', 'analysis'],
  //     },
  //     {
  //       router: 'form',
  //       children: ['basicForm', 'stepForm', 'advanceForm']
  //     },
  //     {
  //       router: 'basicForm',
  //       name: '验权表单',
  //       icon: 'file-excel',
  //       authority: 'form'
  //     }
  //   ]
  // }]

  result.data = 
  [
    'dashboard/workplace',
    'dashboard/analysis',
    'form/basicForm',
    'form/stepForm',
    'form/advanceForm',
    'list/queryList',
    'list/primaryList',
    'list/cardList',
    'text/text1',
    'text/text2',
    'text/text3',
    'searchList/article',
    'searchList/application',
    'searchList/project',
    'details/basicDetails',
    'details/advanceDetails',
    'result/success',
    'result/error',
    'exception/exp403',
    // 'exception/exp404',
    // 'exception/exp500',
    // 'components/taskCard',
    'components/palette',

    ]

  return result
})
