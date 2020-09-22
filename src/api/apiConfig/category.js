export function category (axiosSubmit) {
	return {
		category: {
            /**
             * 获取列表
             * @param {*} params 
             * @param {*} _this 
             */
			list (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/mall/queryProductCategoryByPid',
                    params: Object.assign({
                    }, params),
                })
            },
            add (params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/mall/addCategory',
                    params: Object.assign({
                    }, params),
                })
            },
            del (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/mall/deleteCategoryById',
                    params: Object.assign({
                    }, params),
                })
            },
            update(params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/mall/updateCategory',
                    params: Object.assign({
                    }, params),
                })
            },
            showOrHideCategory (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/mall/showOrHideCategory',
                    params: Object.assign({
                    }, params),
                })
            },
		},
	}
}
