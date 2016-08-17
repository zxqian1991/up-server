var console = require("Console");
var ip = {
	get: function(){
		var interfaces = require('os').networkInterfaces();
		var address = "127.0.0.1";
		for(var i in interfaces) {
			var lists = interfaces[i];
			lists.forEach(function(obj){
				if(obj.family == "IPv4" && obj.address != "127.0.0.1") {
					address = obj.address;
				}
			})
		};
		return address;
	}
};
module.exports = ip;