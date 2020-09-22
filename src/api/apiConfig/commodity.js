export function commodity (axiosSubmit) {
	return {
		commodity: {
            /**
             * 获取列表
             * @param {*} params 
             * @param {*} _this 
             */
			list (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/mall/queryAllProduct',
                    params: Object.assign({
                    }, params),
                })
            },
            add (params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/mall/addProduct',
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
                    url: '/mall/updateProduct',
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
