/**
 * [app description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 * 所有的配置项均相对于当前的目录而非配置文件的目录，因此，配置文件随便放在那里都可以
 **/
var console = require("Console");
app = function(){
	var me = this;
	return function(){
		me.root = process.cwd();
		var arr = [];
		for(var i in arguments) {
			arr.push(arguments[i]);
		}
		me.init(arr);;
		return me;
	}
};


app.prototype.root = null;
app.prototype.types = ["before","routers","after"];
app.prototype.config = require("./config");
app.prototype.serversLists = {};
app.prototype.configOld = null;
app.prototype.__proto__ = new (require("./service.js"))();
/**
 * [init description]
 * @param  {[type]} ar1 [description]
 * @param  {[type]} ar2 [description]
 * @return {[type]}     [description]
 * app的初始化
 */
app.prototype.init = function(ar1,ar2){
	var me = this;
	me.initWatcher();
	me.initConfig(arguments[0]);
	me.transformConfig();
	me.initController(me.config.routers,"routersLists",me.types[1]);
	me.initController(me.config.before,"beforeLists",me.types[0]);
	me.initController(me.config.after,"afterLists",me.types[2]);
	me.start();
}

/**
 * [start description]
 * @return {[type]} [description]
 * 对服务器做配置处理
 * 
 */
app.prototype.start = function(){
	var me = this;
	// 开始监听
	me.watcher.start();
	// 将不同的端口和主机进行相应的初始化
	if(me.config.hasOwnProperty("port")) {
		var port = +me.config['port'];
		if(!me.serversLists["" + port]) {
			me.serversLists["" + port] = {
				handler: {},
				server: null
			};
		};
		me.serversLists["" + port]["handler"]["0.0.0.0"] = new (me.get("server","$root"))(me.config.hosts.default,me,"0.0.0.0:"+ port);
	}
	for(var i in me.config.hosts) {
		if(i != "default") {
			for(var j in me.config.hosts[i]) {
				var port = me.get("util").trim(j);
				if(j != "default" && me.get("util").isNumber(+port)) {
					if(!me.serversLists[port]) {
						me.serversLists[port] = {
							handler: {},
							server: null
						};
					}
					me.serversLists[port]["handler"][i] = new  (me.get("server"))(me.config.hosts[i][j],me,i+":"+port);
				};
			}
		}
	};
	me.run();
};
/**
 * [run description]
 * @return {[type]} [description]
 * 对服务器做启动处理
 */
app.prototype.run = function(){
	var me = this;
	for(var i in me.serversLists) {
		if(!me.serversLists[i].server) {
			(function(i){
				me.startServer(i).then(function(req,res){
					if(me.serversLists[i]["handler"].hasOwnProperty(req.host)) {
						// 是否拥有主机名称
						me.serversLists[i]["handler"][req.host].handle(req,res);
					} else if(me.serversLists[i].hasOwnProperty("0.0.0.0")){
						me.serversLists[i]["0.0.0.0"].handler.handle(req,res);

					} else {
						me.serversLists[me.config.port]["handler"]['0.0.0.0'].handle(req,res);
					}
				})
			})(i)
		}
	}
};
app.prototype.startServer = function(port){
	var me = this;
	var deferred = me.get("promise").defer();
	var server = me.get("http").createServer(function(req,res){
		deferred.resolve(new (me.get("request","$root"))(req),new (me.get("response","$root"))(res))
	});
	server.listen(+port);
	console.log("\x1b[35m Now Listening At Port: \x1b[33m",port,"\x1b[37m");
	console.log("\x1b[36m The Related Host Is",getHosts(port),"\x1b[37m");
	console.log("\x1b[36m Use Http://" + "127.0.0.1" + ":" + port,"\x1b[37m");
	console.log("\x1b[36m Use Http://" + me.get("ip").get() + ":" + port,"\x1b[37m");
	function getHosts(port){
		var arr = [];
		for(var i in me.serversLists[""+port]["handler"]) {
			arr.push(i);
		}
		return arr;
	}
	return deferred.promise;
};

app.prototype.initController = function(config,name,pro){
	var me = this;
	me[pro] = new (me.get("router"))(config,name,me);
};
/**
 * [transformConfig description]
 * @return {[type]} [description]
 * 对config进行一个初始化配置
 */
app.prototype.transformConfig = function(){
	var me = this;
	function controllersTransform(){
		//Services 配置
		for(var i in me.config.services) {
			var util = me.get("util");
			util.isObject(me.config.services[i])
			? (function(){
				for(var j in me.config.services[i]) {
					me.config.services[i][j] = me.get("path").isAbsolute(me.config.services[i][j]) ? me.config.services[i][j] : me.get("path").join(me.root,me.config.services[i][j]);
					me.add(me.config.services[i][j],j)
				}
			})()
			: (
				util.isString(me.config.services[i])
				? (function(){
					me.config.services[i] = me.get("path").isAbsolute(me.config.services[i]) ? me.config.services[i] : me.get("path").join(me.root,me.config.services[i]);
					me.add(me.config.services[i]);
				})()
				: me.config.services[i]
			)
		};
		/**
		 * [cfg description]
		 * @type {Object}
		 * 对before router after进行配置
		 */
		var cfg = {
			routers: "routersbase",
			before: "beforebase",
			after: "afterbase"
		};
		for(var i in cfg) {
			for(var j in me.config[i]) {
				me.config[i][j] = 
				me.get("path")
				  .isAbsolute(me.config[i][j]) 
				  ? me.config[i][j] 
				  : me.get("path")
				    .join(me.root,me.config[cfg[i]],me.config[i][j]);
			}
		}
	};
	/**
	 * [hostsTransform description]
	 * @return {[type]} [description]
	 * 转变config的参数
	 */
	function hostsTransform(){
		var proNeedToPath = ["static"]; // 需要转变路径的参数
		for(var i in me.config.hosts) {
			if(i == "default") {
				proNeedToPath.forEach(function(j){
					me.config.hosts[i][j] = me.get("path").isAbsolute(me.config.hosts[i][j]) ? me.config.hosts[i][j] : me.get("path").join(me.root,me.config.hosts[i][j]);
				})
			} else {
				for(var j in me.config.hosts[i]) {
					proNeedToPath.forEach(function(k){
						me.config.hosts[i][j].hasOwnProperty(k)
						? me.config.hosts[i][j][k] = me.get("path").isAbsolute(me.config.hosts[i][j][k]) ? me.config.hosts[i][j][k] : me.get("path").join(me.root,me.config.hosts[i][j][k])
						: null;
					});
					if(j !=  "default") {
						// 这里对config下的hosts的属性进行重新配置
						var util = me.get("util");
						var old = me.config.hosts[i][j] ? me.config.hosts[i][j] : {};
						var copy = util.merge({},old);
						me.config.hosts[i][j] = (me.config.hosts[i].hasOwnProperty("default")
						? util.merge(old,me.config.hosts['default'],me.config.hosts[i]["default"],copy)
						: util.merge(old,me.config.hosts['default'],copy));
					}
				}
			}
		}
	}
	controllersTransform();
	hostsTransform();
};
/**
 * [initConfig description]
 * @param  {[type]} arguments [description]
 * @return {[type]}           [description]
 * 根据参数加载配置
 * 参数可以是路径  也可以是对象  可以使对象数组 可以使路径数组
 */
app.prototype.initConfig = function(arguments){
	var me = this;
	if(arguments && arguments.length > 0) {
		for(var i in arguments) {
			var options = arguments[i];
			me.get("util","$root").isString(options)
			? (function(){
				// options 为字符串时的处理
				var path = !require("path").isAbsolute(options) ? require("path").join(me.root,options) : options;
				var list = me.get("file").loadSync(path);
				me.watcher.add(path);
				execOptions(list);
			})()
			: (function(){
				// options 为对象时的处理
				me.get("util").isPointer(options) 
				?(function(){
					execOptions(options)
				})()
				: null;
			})();
		}
	};
	function execOptions(args) {
		/**
		 * [description]
		 * @param  {[type]} obj){			if(obj.services &&            obj.services instanceof Array && obj.services.length > 0) {				obj.services.forEach(function(tmp,i){					for(var key in tmp) {						if(me.servicesStore[key]) {							obj.services.splice(i,1);						}					}				})			}		} [description]
		 * @return {[type]}                          [description]
		 * services是数组，而数组里是对象，在合并的时候会重复添加，这里进行一下去重
		 */
		var util = me.get("util");
		util.isArray(args)
		? (function(){
			// 是个数组
			args.forEach(function(obj){
				if(obj.services && obj.services instanceof Array && obj.services.length > 0) {
					obj.services.forEach(function(tmp,i){
						for(var key in tmp) {
							if(me.servicesStore[key]) {
								obj.services.splice(i,1);
							}
						}
					})
				}
				util.isObject(obj) // 是个对象
				? (function(){
					// console.log("\x1b[31mbefore:\x1b[32m OBJ IS",obj.hosts)
					// console.log("\x1b[31mbefore:\x1b[32m CONFIG IS",me.config.hosts)
					me.get("util").merge(me.config,obj);
					// console.log("\x1b[31mafter:\x1b[32m OBJ IS",obj.hosts)
					// console.log("\x1b[31mafter:\x1b[32m CONFIG IS",me.config.hosts)
				})()
				: me.initConfig(obj)
			})
		})()
		: (function(){
			//是对象console
			me.get("util").merge(me.config,args);
		})()
	};
	return me.config;
};
app.prototype.initWatcher = function(){
	var me = this;
	me.watcher = new (me.get("watcher"))();
	me.watcher.on("change",function(changetype,filename,basepath,basetype){
		me.watcherHandler(changetype,filename,basepath,basetype);
	})
}
app.prototype.watcherHandler = function(changetype,filename,basepath,basetype){
	// 重新加载config
	var me = this;
	var path = ""
	if(basetype == "folder") {
		var path = me.get("path").join(basepath,filename);
	} else {
		path = basepath;
	}
	delete require.cache[path];
	me.initConfig({"0":path,"length":1});
	me.transformConfig(); 
}
module.exports = new app();