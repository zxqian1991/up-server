var req = function(request){
	var me = this;
	require("./util").extend(me,request);
	me.transform();
};
req.prototype = require("http").IncomingMessage.prototype;
req.prototype.transform = function(){
	var me = this;
	me.host = me.headers["host"];
	var host_arr = me.headers["host"].split(":");
	if(host_arr && host_arr.length > 0) {
		me.host = host_arr[0];
		me.port = host_arr.length > 1 ? host_arr[1] : 80;
	}
	var parseurl = require("url").parse(me.url,true);
	me.query = parseurl.query;
	me.path = parseurl.pathname;
	var __parse = me.headers['referer'] ? require("url").parse(me.headers['referer']): null;
	me.referpath = __parse ? __parse['path'] : "./";
};
module.exports = req;