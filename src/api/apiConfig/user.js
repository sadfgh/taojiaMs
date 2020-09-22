export function user (axiosSubmit) {
	return {
		user: {
            /**
             * 获取列表
             * @param {*} params 
             * @param {*} _this 
             */
			list (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/user/queryAll',
                    params: Object.assign({
                    }, params),
                })
            },
            lockOrUnlock (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/user/lockOrUnlock',
                    params: Object.assign({
                    }, params),
                })
            },
            loginSms(params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    headers:{'Content-Type': 'application/x-www-form-urlencoded' },
                    url: '/taojia/login',
                    params: Object.assign({
                    }, params),
                })
            },


            del (params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/user/deleteById',
                    params: Object.assign({
                    }, params),
                })
            },
            queryById(params = {}) {
                return axiosSubmit({
                    method: 'GET',
                    url: '/user/queryById',
                    params: Object.assign({
                    }, params),
                })
            },


            authorizationToUser(params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/user/authorizationToUser',
                    params: Object.assign({
                    }, params),
                })
            },

            updateUser(params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/user/updateUser',
                    params: Object.assign({
                    }, params),
                })
            },

            updatePassword(params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/user/updatePassword',
                    params: Object.assign({
                    }, params),
                })
            },
            unbindPhone(params = {}) {
                return axiosSubmit({
                    method: 'POST',
                    url: '/user/unbindPhone',
                    params: Object.assign({
                    }, params),
                })
            },
		},
	}
}
