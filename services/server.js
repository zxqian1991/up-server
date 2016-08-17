function server(config,app,host){
	var me = this;
	me.config = config;
	// console.log(me.config)
	me.app = app;
	me.host = host;
};
server.prototype.handle = function(req,res){
	var me = this;
	// me.app
	// .get("send")
	// .getStatic(me.config.static,req,res)
	// .then(function(data){
		var date = new Date();
    	console.log("\x1b[35m["+ date.toLocaleDateString() + "~~" + date.toLocaleTimeString() +"]","\x1b[35m"+req.host+":"+req.port,"\x1b[34m",req.method,"\x1b[32m",req.path);
		// 开始请求预处理
		// console.log("\x1b[33m","开始进行before相关的处理")
		me.handleFunc(req,res,me.app.types[0])
		.then(function(){
			// console.log("\x1b[33m","before相关的处理结束,开始进行router处理");
			return me.app.get("send").getStatic(me.config.static,req,res).then(function(){
				return me.handleFunc(req,res,me.app.types[1])
			})
		})
		.then(function(){
			// console.log("\x1b[33m","router相关的处理结束,开始进行after处理");
			return me.handleFunc(req,res,me.app.types[2])
		})
		.then(function(){
			// console.log("\x1b[31m","没有对",req.path,"的处理！");
			res.end("对不起，我这里没有对应的处理");
		})

	// })
};
server.prototype.handleFunc = function(req,res,type){
	var me = this;
	var deferred = require("./promise").defer();
	if(me.config.hasOwnProperty(type)) {
		if(me.config[type].hasOwnProperty("private")) {
			if(me.config[type].private.hasOwnProperty(req.path)) {
				var cfg = me.config[type].private[req.path];
				if(me.get("util").isString(cfg)) {
					// 是个字符串
					runDefault([cfg],type);
				} else if(me.get("util").isArray(cfg)) {
					// 是个数组
					runDefault(cfg,type);
				}
			} else {
				// 虽然拥有私有处理，但是没有对应的路径
				if(me.config[type].hasOwnProperty("default") && me.app.get("util").isArray(me.config[type].default)&&me.config[type].default.length > 0){
					// 有默认的配置
					runDefault(me.config[type].default,type);
				} else {
					console.log("\x1b[33m",type.toUpperCase(),"下没有处理器");
					deferred.resolve();
				}
			}
		} else if(me.config[type].hasOwnProperty("default") && me.app.get("util").isArray(me.config[type].default)&&me.config[type].default.length > 0){
			// 有默认的配置
			runDefault(me.config[type].default,type);
		} else {
			console.log("\x1b[33m",type.toUpperCase(),"下没有处理器");
			deferred.resolve();
		}
	} else {
		console.log("\x1b[33m",type.toUpperCase(),"下没有处理器");
		deferred.resolve();
	}
	//me.confi[type].default
	function runDefault(list){
	    var i = 0;
		var len = list.length;
		console.log(type.toUpperCase(),"下的处理器是:",list);
		me.app.get("util").isBoolean(me.config.no_cache)
		? (me.config.no_cache ?  (function(){
			var path = me.app[type].remove(list[i])
			console.log("\x1b[32mType:",type.toUpperCase(),"\x1b[36m已清除处理器",list[i],"的缓存,其对应的路径是:",path)
		})() : null)
		: (
			me.app.get("util").isArray(me.config.no_cache)
			? (function(){
				// 是数组
				if(me.config.no_cache.indexOf(list[i]) < 0) {
					me.app[type].remove(list[i]);
				}
			})()
			: null
		)
		var ctrl = me.app[type].get(list[i]);
		var last = ctrl(req,res,next,end)
		function next(){
			i++;
			if(i < len) {
				ctrl = me.app[type].get(list[i]);
				ctrl(req,res,next,end)
			} else {
				// 都执行好了
				end();
			}
		};
		function end(){
			// 结束当前循环
			deferred.resolve();
		}
	}

	return deferred.promise;
}
module.exports = server;