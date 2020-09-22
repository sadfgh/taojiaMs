export function brand (axiosSubmit) {
	return {
		brand: {
            /**
             * 获取列表
             * @param {*} params 
             * @param {*} _this 
             */
			list (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/mall/queryAllBrand',
                    params: Object.assign({
                    }, params),
                })
            },
            add (params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/mall/addBrand',
                    params: Object.assign({
                    }, params),
                })
            },
            del (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/mall/deleteBrandById',
                    params: Object.assign({
                    }, params),
                })
            },
            update(params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/mall/updateBrand',
                    params: Object.assign({
                    }, params),
                })
            },
            showOrHideBrand (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/mall/showOrHideBrand',
                    params: Object.assign({
                    }, params),
                })
            },
		},
	}
}
