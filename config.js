var Path = require("path");
var config = {
	isDev: true,
	services: [],
	routersbase: "./", // 路由的处理
	beforebase: "./",  // 路由之前的处理 包括对数据的处理 对请求的拦截等
	afterbase: "./",   // 路由之后的处理，包括对出口数据的处理以及对出口数据的检测、拦截等。
	routers: {},       // 路由的定义  定义路由的名字和路径
	before: {
		"favicon": Path.join(__dirname,"./before/favicon.js")
	},        // 预处理的定义  定义预处理的名字和路径
	after: {},         // 发送前处理的定义，定义发送前处理的名字和路径
	port: 80,
	hosts: {
		default: {
			before: {
				default: ["favicon"]
			},
			static: "./"
		}
	}
};
module.exports = config;
/* * options {
 * 	   services: [{},{}]
 * 	   routersbase: "/asd/asd",
 * 	   routers: {  // 路由的配置
 * 	   		router1: "/asd/asd/asd/as/das/d"
 * 	   }，
 * 	   berforebase: "/s/asd",
 * 	   before: {
 * 	   		before1: "as/asd/da/asd/lmlk/lkmlk"
 * 	   },
 * 	   afterbase: 'asd',
 * 	   after: {
 * 	   	    after1: "/asd/as/da/sd/as/d"
 * 	   },
 * 	   hosts: {  // 某个域名如果没有定义default 那么就使用父层的default 如果父层没有，则使用系统默认的
 * 	       default: {
 * 	           port: 80,
 * 	           static: "/asd/as/dasd",
 * 	       },
 * 	       "www.baidu.com": {
 * 	           "default": {
 * 	               static: "/asdas/asd/as/d/as",
 * 	               favicon: "asdasdasd",
 * 	               router: ..
 * 	               ....
 * 	           }
 * 	           "9999":{
 * 	              static: "./asmdklasdmlas", // 静态文件的目录
 * 	              favicon: 'https://adas/asdadas.icon',
 * 	              hascache: "是否缓存",
 * 	              routers: {
 * 	               "default": [router1,router2,rotuer3],
 * 	               "private": {
 * 	               		"/query/test": [router3,router6],
 * 	               		"/asda/sadasd": [router5,router9]
 * 	               }
 * 	              },
 * 	              before: {
 * 	           	      default: [pre1,pre2,pre4] // 流的预处理，例如对base64解密，例如一些特殊的验证等
 * 	            	  private: {
 * 	           	         "/asd/adas/asd": [pre2,pre9],
 * 	           	         "/as/asd/d/c": [pre6,pre9]
 * 	           	      }
 * 	              },
 * 	              after: {
 * 	                 default: [aft1,aft2,aft3],
 * 	                 private: {
 * 	                   "/asd/as/da/sd": [aft2,aft7],
 * 	                   "/asd/as/da/sda/hh": [aft5,aft9,"/as/d/asd/as/das/da/s"] //配置可以是一个名字，也可以是一个路径
 *                   }
 * 	             }
 * 	           },
 * 	           "asdasd"
 * 	       },
 * 	       "www.asa.ss.as": {
 * 	           
 * 	       }
 * 	   }
 * }
 */