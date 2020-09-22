// const decoupling = {
//     dashboard:{
//         workplace:'dashboard/workplace',
//         analysis: 'dashboard/analysis',
//     },
//     form:{
//         basicForm: 'form/basicForm',
//         stepForm: 'form/stepForm',
//         advanceForm:'form/advanceForm',

//     },
//     list:{
//         queryList:'list/queryList',
//         primaryList:'list/primaryList',
//         cardList:'list/cardList',
//     },
//     searchList:{
//         article:'searchList/article',
//         application:'searchList/application',
//         project:'searchList/project',
//     },
//     text:{
//         text1:'text/text1',
//         text2: 'text/text2',
//         text3: 'text/text3'
//     },
//     details:{
//         basicDetails:'details/basicDetails',
//         advanceDetails:'details/advanceDetails',

//     },
//     result:{
//         success:'result/success',
//         error:'result/error',
//     },
//     exception:{
//         exp403:'exception/exp403',
//         exp404:'exception/exp404',
//         exp500:'exception/exp500',
//     },
//     components:{
//         taskCard:'components/taskCard',
//         palette:'components/palette',
//     }
// }

const decoupling = [
    //这是鸣哥写的 start
    // {
    //     router: 'result',
    //     children: [],
    // },
    // {
    //     router: 'exception',
    //     children: [],
    // }

    //end


//这是我写的 start
   {
        workplace:'dashboard/workplace',
        analysis: 'dashboard/analysis',
        rest:{
            router: 'dashboard',
            children: [],
        }
    },
   {
        basicForm: 'form/basicForm',
        stepForm: 'form/stepForm',
        advanceForm:'form/advanceForm',
        rest:{
            router: 'form',
            children: [],
        }

    },
    {
        queryList:'list/queryList',
        primaryList:'list/primaryList',
        cardList:'list/cardList',
        rest:{
            router: 'list',
            children: [],
        }
    },
    {
        article:'searchList/article',
        application:'searchList/application',
        project:'searchList/project',
        rest:{
            router: 'searchList',
            children: [],
        }
    },
    {
        authorizationManagement:'permissionQueryAll',
        roleManagement: 'roleQueryAll',
        userManagement: 'userQueryAll',
        rest:{
            router: 'authorityManagement',
            children: [],
        }
    },
    {
        brandManagement:'mallQueryAllBrand',
        categoryManagement: 'mallQueryProductCategoryByPid',
        commodityManagement: 'mallQueryAllProduct',
        rest:{
            router: 'product',
            children: [],
        }
    },
    {
        basicDetails:'details/basicDetails',
        advanceDetails:'details/advanceDetails',
        rest:{
            router: 'details',
            children: [],
        }

    },
    {
        success:'result/success',
        error:'result/error',
        rest:{
            router: 'result',
            children: [],
        }
    },
    {
        exp403:'exception/ex4p03',
        exp404:'exception/exp404',
        exp500:'exception/exp500',
        rest:{
            router: 'exception',
            children: [],
        }
    }
    ,
    {
        taskCard:'components/taskCard',
        palette:'components/palette',
        rest:{
            router: 'components',
            children: [],
        }
    }
    //end
]

export default decoupling 