import decoupling from '@/router/decouplingTable'
// import permissionMapping from '@/router/permissionMapping'

function dataProcessing(arr) {

  //这是鸣哥写的 start
  // let newResult = []
  // let result = {
  //   router : 'root',
  //   children : null
  // }

  // if(arr !== null){
  //   permissionMapping.forEach(item =>{
  //     arr.forEach(a =>{
  //       if(item.serverPermission === a){
  //         let result = true
  //         decoupling.forEach(i =>{
  //           if(i.router === item.router){
  //             result = false
  //           }
  //         })

  //         if(result === true){
  //           decoupling.push({
  //             router: item.router,
  //             children: []
  //           })
  //         }

  //         decoupling.forEach(sumItem =>{
  //           if(sumItem.router === item.router) {
  //             sumItem.children.push(item.fun)
  //           }
  //         })
  //       }
  //     })
  //   })
  //   result.children = decoupling
  // }

  // newResult.push(result)
  // return newResult
  //end


  //这是我写的 start

    let leftList = [
      {
        router: 'dashboard',                  
        children: ['workplace', 'analysis'], 
      },
    ];
    let leftMeun = []
    let funcList = []
    
    
   
    decoupling.forEach(item =>{
      item.rest.children = []
        for(let i in item){
          arr.forEach(sumItem =>{
            if (item[i] === sumItem) {
              item.rest.children.push(i)
              leftMeun.push(sumItem)
              
            }
          })
        }
        if (item.rest.children.length !== 0) {
          leftList.push(item.rest)
        }
      })
    let result = {}
    result.router = 'root'
    result.children = leftList
    let newResult = []
    newResult.push(result)
    console.log(newResult)
    funcList = arr.filter(item =>{
          return !leftMeun.includes(item)
        })
    let arr1 =  leftMeun.concat(funcList)
    console.log(arr1)
    // 生成前端想要的路由表
    return {leftFunc: newResult,funcList:funcList}

    //end
}

export{dataProcessing}