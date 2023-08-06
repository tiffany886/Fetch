import { JsonBodyConverterFactory } from "./request/JsonConverterFactory";

const BASE_URL = 'http://47.115.32.14:8082/screenControl/';
const BASE_URL_2 = 'http://47.125.32.14:8082/screenControlbvb /';
// export default ({
// 	url,
// 	method,
// 	data,
// 	header
// }) => {
// 	return new Promise((resolve, reject) => {
// 		uni.request({
// 			url: url,
// 			method: method,
// 			data: data,
// 			header: header | "content-type': 'application/x-www-form-urlencoded",
// 			success: res => {
// 				const {
// 					data,
// 					code,
// 					msg
// 				} = res.data;
// 				if (code === 0) {
// 					resolve(data);
// 					return;
// 				}
// 				reject({
// 					message: msg,
// 					code
// 				})
// 			},
// 			fail: err => {
// 				reject({
// 					message: err.msg,
// 					code: err.code
// 				})
// 			}
// 		})
// 	})
// }

/**
 * https://api.example.com/scs/
 */


const HttpClient = function (config = {}) {

    this._baseUrl = config.baseUrl ?? '';

    this._requestInterceptor = config.requestInterceptor ?? [];

    this._responseInterceptor = config.responseInterceptor ?? [];

    this._dataConverterFactory = config.dataConverterFactory ?? null;

    /**
     * path: scenePack/collection/add real: http://47.115.32.14:8082/screenControl/scenePack/collection/add
     * path: /screenControl2/scenePack/collection/add real:  http://47.115.32.14:8082/screenControl2/scenePack/collection/add
     */

    this.get = function (params) {
        console.log('get');
		console.log('params',params);
        const filledParams = {
            header: {},
            query: {},
            ...params,
        }
		console.log('query',filledParams.query);
        // console.log('post');
        return new Promise((resolve, reject) => {
            const {
                path,
                header,
                query
            } = filledParams;

            const config = {
                url: this._handleUrl(path, query),
                header,
            };

            this._requestInterceptor.forEach(interceptor => interceptor.intercept(config));
            uni.request({
                method: "GET",
                dataType: 'xml',
                ...config,
                success: res => {
					console.log(666,res);
                    for (let intercepter of this._responseInterceptor) {
                        try {
                            intercepter.intercept(res);
                        } catch (err) {
                            reject({
                                msg: err.msg,
                                code: err.code,
                                data: err.data,
                            });
                            return;
                        }
                    }
					let result=this._dataConverterFactory.responseBodyConverter().convert(res.data);
					console.log(233, result.data);
                    resolve(result.data);
                },
                fail (err) {
                    reject({
                        msg: err.errMsg,
                    })
                },
            })
        })
    }

    // Post 请求， 
    this.post = function (params) {
        const filledParams = {
            header: {},
            query: {},
            body: {},
            ...params,
        }
        console.log('post');
        return new Promise((resolve, reject) => {
            const {
                path,
                header,
                query,
                body,
            } = filledParams;

            const config = {
                url: this._handleUrl(path, query),
                data: body,
                header,
            };
            this._requestInterceptor.forEach(interceptor => interceptor.intercept(config));
            config.data = this._dataConverterFactory.requestBodyConverter().convert(config.data);
			console.log(config.data);
            uni.request({
                method: "POST",
                dataType: 'xml',
                ...config,
                success: res => {
                    for (let intercepter of this._responseInterceptor) {
                        try {
                            intercepter.intercept(res);
                        } catch (err) {
                            reject({
                                msg: err.msg,
                                code: err.code,
                                data: err.data,
                            });
                            return;
                        }
                    }
					console.log(666,res.data);
                    resolve(this._dataConverterFactory.responseBodyConverter().convert(res.data));
                },
                fail (err) {
                    reject({
                        msg: err.errMsg,
                    })
                },
            })
        })

    }

    this._handleUrl = function (path, query) {
        return this._getUrl(path) + Object.keys(query).reduce((curr, next, index, array) => {
            if (index !== 0) {
                curr += '&';
            }
            curr += `${next}=${query[next]}`;
            return curr;
        }, '?')
    }

    this._getUrl = function (path = '') {
        if (!path) {
            throw new Error(`Unexpected url: ${path}`);
        }

        return path.startsWith('/') ? `${this._getHost()}/${path}` : this._baseUrl + path;
    },

        this._getHost = function () {
            return this._baseUrl.split('/').slice(0, 3).join('/');
        }
}

const TokenRequestInterceptor = function () {
	
    this.intercept = function (params) {
		console.log("addToken");
		// if(params.url.indexOf('token')!==-1){
			params.url = params.url + (params.url.indexOf('?') > 0 ? '&' : '?') + 'token=' + uni.getStorageSync("user")?.token || '';
		// }
    }
}

const JsonRequestInterceptor = function () {

    this.intercept = function (params) {
        params.data = JSON.stringify(params.data);
    }
}

const LogRequestInterceptor = function () {

    this.intercept = function (params) {
        console.log('请求参数：', params)
    }
}

const LogResponseInterceptor = function () {

    this.intercept = function (params) {
        console.log('响应数据：：', params)
    }
}

const CommonResponseInterceptor = function () {

    this.intercept = function (response = {
        data: ''
    }) {
        response.data = JSON.parse(response.data)
        const {
            code,
            data,
            msg
        } = response.data;
        if (code === 0) {
            response.data = data;
            return;
        }

        throw response.data;
    }
}

export const ScsService = new HttpClient({
    baseUrl: BASE_URL,
    dataConverterFactory: JsonBodyConverterFactory.create(),
    requestInterceptor: [new TokenRequestInterceptor(), new LogRequestInterceptor()],
    responseInterceptor: [new LogResponseInterceptor()],
});

// const CustomService = new HttpClient(BASE_URL_2);

// ScsService.get()

// module.exports={
// 	ScsService
// }

// const BodyConverter = function () {
//     this.convert();
// }


// const JsonBody
// const JsonBodyConverterFactory

// const CustomService = new HttpClient(BASE_URL_2);

// ScsService.get()
