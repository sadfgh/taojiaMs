export function role (axiosSubmit) {
	return {
		role: {
            /**
             * 获取列表
             * @param {*} params 
             * @param {*} _this 
             */
			list (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/role/queryAll',
                    params: Object.assign({
                    }, params),
                })
            },
            add (params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/role/add',
                    params: Object.assign({
                    }, params),
                })
            },
            del (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/role/deleteById',
                    params: Object.assign({
                    }, params),
                })
            },
            queryById(params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/role/queryById',
                    params: Object.assign({
                    }, params),
                })
            },
            update(params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/role/update',
                    params: Object.assign({
                    }, params),
                })
            },
		},
	}
}
