

import axios from 'axios';
import qs from 'qs'
import {role} from './apiConfig/role';
import { user } from './apiConfig/user';
import { brand } from './apiConfig/brand';
import { category } from './apiConfig/category';
import {commodity} from './apiConfig/commodity'

/**
 *
 * @param {*} options
 * 发送请求
 */
function axiosSubmit(options) {
	let config = {
		timeout: 3000,
		method: options.method,
		baseURL: '',
		url: options.url,
		params: options.params,
		headers:options.headers || {"Content-Type": "application/json;charset=UTF-8"},
    }
    console.log(config.method)
   
    console.log( config.params)
    if (config.method === 'GET') {
         let str = ''
        for(let key in config.params){
            str = str + '/'+config.params[key]
            console.log(config.params[key])
        }
        console.log(str)
        config.url = config.url + str
        console.log(config.url)
        config.params = {}
    }
    console.log(config)
    if ( config.method === 'POST') {
        config.data=config.params;
        config.params={}
        console.log(config.headers['content-type'])
        if(config.headers['Content-Type'] == 'application/x-www-form-urlencoded'){
            config.data = qs.stringify(config.data)
        }
    }
    console.log(config)
	return axios(config).then((res) => {
        return Promise.resolve(res.data)
	}).catch(err => {
        // console.log(err)
		return err
	})

}
// import { from } from 'core-js/fn/array';

export default Object.assign(
    role(axiosSubmit),
    user(axiosSubmit),
    brand(axiosSubmit),
    category(axiosSubmit),
    commodity(axiosSubmit)
)
