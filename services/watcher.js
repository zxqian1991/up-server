var fs = require("fs");
var File = require("./file");
var EventEmitter = require('events').EventEmitter;
var watcher = function(){
	var me = this;
	me.eventer = new EventEmitter();
};
watcher.prototype.on = function(name,func){
	var me = this;
	me.eventer.on(name,function(event,filename,path,typeOfPath){
		func(event,filename,path,typeOfPath)
	});
}
watcher.prototype.lists = [];
watcher.prototype.watchers = {};
watcher.prototype.add = function(path){
	var me = this;
	me.lists.indexOf(path) < 0 ? me.lists.push(path) : null;
}
watcher.prototype.start = function(){
	var me = this;
	me.lists.forEach(function(path){
		var typeOfPath = File.getTypeSync(path);
		if(!me.watchers[path]) {
			var __watcher = fs.watch(path,function(){

			});
			__watcher.on("error",function(err){
				console.log("\x1b[41m",err,"\x1b[47m")
			});

			__watcher.on("change",function(event,filename){
				console.log("\x1b[31m配置文件 ",require("path").join(path,filename)," 有了新的改变,改变的类型是\x1b[36m",event,"\x1b[37m")
				me.eventer.emit("change",event,filename,path,typeOfPath)
			})
			me.watchers[path] = __watcher;
		} else {
			console.log(me.watchers)
		}
	})
};
module.exports = watcher;