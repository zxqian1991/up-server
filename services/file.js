var $q = require("./promise");
var $path = require("path");
var fs = require("fs")
var myfs = {
	readFolder: readFolder,
	readFolderSync: readFolderSync,
	getType: getType,
	getTypeSync: getTypeSync,
	load: load,
	loadSync: loadSync,
	watch: watch,
};
function readFolder(path){
	var deferred = $q.defer();
	fs.readdir(path,function(err,name){
		if(!err) {
			deferred.resolve(name);
		} else {
			deferred.resolve(null)
		}
	})
	return deferred.promise;
}
function readFolderSync(path){
	var arr = fs.readdirSync(path);
	if(arr) {
		return arr
	}
	return null;
};
function getTypeSync(path) {
	try {
		var st = fs.statSync(path);
		if(st) {
			if(st.isFile()) {
				//是个文件
				return "file";
			}else {
				//是个文件夹 遍历旗下文件
				return "folder"
			}
		}
	} catch(e) {
		return null;
	}
	return null;
}
function getType(path){
	var deferred = $q.defer();
	fs.stat(path,function(err,st){

		if(!err && st != null) {
			//存在文件
			if(st.isFile()) {
				//是个文件
				deferred.resolve(null,"file")
			}else {
				//是个文件夹 遍历旗下文件
				deferred.resolve(null,"folder")
			}
		} else {
			deferred.resolve(err,null)
		}
	})
	return deferred.promise;
}
function load(){
	var deferred = $q.defer();
	var sum = arguments.length;
	var count = 0;
	var store = [];
	if(arguments && arguments.length >= 1) {
		for(var i = 0; i < arguments.length;i++) {
			var value = arguments[i];
			var type = typeof value;
			var isArray = value instanceof Array;
			switch(type) {
				case "string":
					loadSingleFile(value).then(function(data){
						count++;
						data ? store.push(data) :null;			
						if(count == sum) {
							deferred.resolve(store);
						}
					});
					break;
				case "object":
					if(isArray) {
						var sum__ = value.length;
						var count__ = 0;
						value.forEach(function(array_value,i){
							loadSingleFile(array_value).then(function(data){
								count__++;
								data ? store.push(data) :null;
								if(count__ == sum__) {
									// 结束了
									count++;
									if(count == sum) {
										deferred.resolve(store);
									}
								}								
							})
						})
					}
					break;
				default: 
					count++;
					if(count == sum) {
						deferred.resolve(store);
					}
			}
		}
	} else {
		deferred.resolve(store)
	}
	return deferred.promise;
};
function loadSync() {
	var __arr = [];
	if(arguments && arguments.length >= 1) {
		for(var i = 0; i < arguments.length;i++) {
			var value = arguments[i];
			var type = typeof value;
			var isArray = value instanceof Array;
			switch(type) {
				case "string":
					var __tmp = loadSingleFileSync(value)
					__arr = __arr.concat(__tmp);
					break;
				case "object":
					if(isArray) {
						value.forEach(function(array_value,i){
							__arr =__arr.concat(loadSingleFileSync(array_value));
						})
					}
					break;
			}
		}
	}
	return __arr;
}
function loadSingleFile(path){
	var deferred = $q.defer();
	getType(path).then(function(err,type){
		if(!err) {
			if(type == "file") {
				var data = require(path)
				deferred.resolve(data)
			}
			if(type == "folder") {
				readFolder(path).then(function(arr){
					arr 
					?(function(){
						var sum = arr.length;
						var count = 0;
						var store = [];
						arr.forEach(function(value){
							// 文件夹下面除了文件可能还有文件夹，所以用load 而不用load singlefile
							load($path.join(path,value)).then(function(data){
								data && data.length > 0 
								? store.push(data)
								: null;
								count++;
								if(count == sum) {
									deferred.resolve(store);
								}
							})
						})
					})()
					: deferred.resolve(null);
				})
			}
		} else {
			deferred.resolve(null)
		}
	});
	return deferred.promise;
};
function loadSingleFileSync(path){
	var type = getTypeSync(path);
	if(type) {
		if(type == "file") {
			var __config = require(path);
			return __config;
		}
		if(type == "folder") {
			var obj = readFolderSync(path);
			var __arr = [];
			obj.forEach(function(value){
				var __res = loadSync($path.join(path,value));
				__arr = __arr.concat(__res);
			})
			return __arr;
		}
	}
	return null;
}
function watch(path){
	var deferred = $q.defer();
	var type = getTypeSync(path);
	var watcher = null;
	if(type) {
		watcher = fs.watch(path,{
			persistent: true, // 设为false时，不会阻塞进程。
			recursive: true  // 递归
		},listener);
		function listener(changetype,filename){
			deferred.resolve(type,changetype,filename,watcher)
		};
	} else {
		deferred.resolve(null);
	};
	return {
		get: function(func){
			func && typeof func == "function" ?　func(type,watcher) : null;
			return deferred.promise;
		},
		then: function(func){
			return deferred.promise.then(func);
		}
	};
}
module.exports = myfs;
