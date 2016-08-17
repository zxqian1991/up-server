var Path = require("path");
var fs = require("fs");

/**
 * [service description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 * path 定义service的文件夹
 */
var service = function(path,name){
	var me = this;
	me.init()
	path ? me.add(path,name) : null;
};
 
service.prototype.rootpath = __dirname;
service.prototype.servicesStore= {}; // 存储着所有的服务以及对应的名称
service.prototype.servicesLists = [{}];

service.prototype.init = function(){
	var me = this;
	me.servicesLists = [];
	try {
		var needpath = Path.join(me.rootpath,"./services");
		var obj = {};
		obj = me.addService(obj, needpath, "",true);
		me.servicesLists.push(obj); // 
		me.servicesStore['$root'] = obj;
	} catch(e) {
		// 未读取到文件
		console.error(e,'adasasd');
	}
};
service.prototype.addService = function(obj,path,prefix,first){// first是用来判别是不是从根处加载的文件，主要是解决文件加载的时候的取名问题
	var me = this;
	try {
		
		var status = fs.statSync(path); // 读取同步状态
		if(status.isFile()) {
			// 是个文件
			var name = Path.basename(path,".js");
			var resname = prefix ? prefix + "-" + name : name;
			obj[resname] = path; // 只存储路径而不加载
		} else if(status.isDirectory()){
			var name = Path.basename(path);
			var resname = first ? "" : (prefix ? prefix + "-" + name : name);
			var filelists = fs.readdirSync(path);
			if(filelists && (filelists instanceof Array)) {
				filelists.forEach(function(value){
					obj = me.addService(obj,Path.join(path,value),resname);
				})
			}
		}

	} catch(e) {

	};
	return obj;
}
/**
 * 
 */
service.prototype.add = function(path,name) {
	var me = this;
	path = Path.isAbsolute(path) ? path : Path.join(process.cwd(),path);
	name = name ? name : Path.basename(path,".js");
	try {
		if(me.servicesStore[name]) {
			console.warn("\x1b[35m服务",name,"已被加载过了\x1b[36m");
		}
		var obj = {};
		!me["servicesLists"] 
		? (function(){
			me.servicesLists = [obj];
		})()
		: (function(){
			 obj = {
				__proto__: me.servicesLists[me.servicesLists.length - 1]
			};
		})();
		obj = me.addService(obj, path, "", true);
		me.servicesLists.push(obj); // 
		me.servicesStore[name] = obj;
	} catch(e) {
		console.log(" \x1b[35min ",__dirname,path,name,e,"\x1b[37m")
	}
};
/**
 * get 用来获取服务名称的服务，如果没有指定，则默认是使用跟木下的
 */

service.prototype.get = function(servicename,serviceroot){
	var me = this;
	// console.log('阿卡接收到卡上就等你',servicename,me.servicesLists)
	if(!serviceroot || !me.servicesStore[serviceroot]) {
		try {
			return require(me.servicesLists[me.servicesLists.length - 1][servicename]);
		} catch(e) {
			try {
				return require(servicename);
			} catch(e) {
				return null;
			}
		}
	} else {
		try {
			return require(me.servicesStore[serviceroot][servicename]);
		} catch(e) {
			try {
				return require(servicename);
			} catch(e) {
				return null;
			}
		}
	}
}
/**
 * [exports description]
 * @type {[type]}
 */

service.prototype.remove = function(servicename,serviceroot){
	var me = this;
	if(!serviceroot || !me.servicesStore[serviceroot]) {
		try {
			delete require.cache(me.servicesLists[me.servicesLists.length - 1][servicename]);
		} catch(e) {
			try {
				delete require.cache(servicename);
			} catch(e) {
				return null;
			}
		}
	} else {
		try {
			delete require.cache(me.servicesStore[serviceroot][servicename]);
		} catch(e) {
			try {
				delete require.cache(servicename);
			} catch(e) {
				return null;
			}
		}
	}
}
module.exports = service;