var Path = require("path");
var Router = function(router,name,app){
	var me = this;
	me.name = name;
	me.app = app;
	me[name] = router;
};
Router.prototype.get = function(name){
	// 相对于文件的使用利好那个
	var me = this;
	// var root = me.app.root;
	// root = base ? (path.isAbsolute(base) ? base : path.join(root,base)) : root;
	if(me[me.name].hasOwnProperty(name)) {
		try{
			var res = require(me[me.name][name]);
			return res;
		}catch(e) {
			console.error("引用文件不存在",me[me.name][name])
		}
	} else {
		// 不存在
		var path = Path.isAbsolute(name) ? name : Path.join(process.cwd(),name);
		try{
			var res = require(path);
			return res;
		}catch(e) {
			console.error("引用文件不存在", path)
		}
	}
};
Router.prototype.remove = function(name){
	// 相对于文件的使用利好那个
	var me = this;
	// var root = me.app.root;
	// root = base ? (path.isAbsolute(base) ? base : path.join(root,base)) : root;
	if(me[me.name].hasOwnProperty(name)) {
		try{
			delete require.cache[me[me.name][name]];
			return me[me.name][name]
		}catch(e) {

		}
	} else {
		// 不存在
		var path = Path.isAbsolute(name) ? name : Path.join(process.cwd(),name);
		try{
			delete require.cache(path);
			return path;
		}catch(e) {
			
		}
	}
};
module.exports = Router;