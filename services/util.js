var Path = require("path");
module.exports = {
	getPath: function(path){
		return Path.join(process.cwd(),path);
	},
	trim: function(str){
		var reg = /(^\s+)|(\s+$)/gi;
		return str.replace(reg,'');
	},
	duplication: function(arr){  // 去除重复
		var me = this;
		if(me.isArray(arr)) {
			// 规则  字相同去除  对象内容一样、顺序一样去除
			var cache = [];
			for(var i in arr) {
				var flag = false;
				for(var j in cache) {
					if(me.isSame(cache[j],arr[i])) {
						// 删除
						arr.splice(i-1,1);
						flag = true;
					}
				}
				if(!flag) {
					cache.push(arr[i]);
				}
			}
		} else if(me.isObject(arr)){
			for(var i in arr) {
				me.duplication(arr[i]);
			}
		}
		return arr;
	},
	isSame: function(a,b){
		var me = this;
		var typea = me.getType(a);
		var typeb = me.getType(b);
		return typea != typeb ? false : (function(){
			try {
				typea == "array" 
				? (a.length != b.length ? false : (function(){
					for(var i in a) {
						if(!me.isSame(a[i],b[i])) {
							return false;
						}
					}
					return true;
				})())
				: (function(){
					var pro_lists = [];
					for(var i in b) {
						pro_lists.push(i);
						if(!a.hasOwnProperty(i)) {
							return false;
						} else {
							// 有自己的属性
							if(!me.isSame(a[i],b[i])) {
								return false;
							}
						}
					};
					for(var i in a) {
						if(pro_lists.indexOf(i) < 0) {
							return false;
						}
					}
					return true;
				})()
			}catch(e) {	

			}
		})();
	},
	remove: function(arr,i){
		var me = this;
		if(me.isArray(arr) && me.isNumber(+i)) {

		}
		if(me.isObject(arr) && me.isString(i)) {

		}
		return arr;
	},
	extend: function(source,target){
		var me = this;
		var arr = [];
		var other = [];
		for(var i in arguments) {
			var value = arguments[i];
			me.isPointer(value) ? arr.push(value) : other.push(value);
		}
		return arr.length > 0 ? (function(){
			var source = arr[0];
			var sourcetype = me.getType(source);
			source = arr.length == 1 
			? source
			: (function(){
				for(var i = 1; i < arr.length; i++) {
					var target = arr[i];
					var targettype = me.getType(target);
					if(sourcetype == targettype) {
						if(sourcetype == "array") {
							target.forEach(function(value){
								source.push(res);
							})
						} else {
							// 都是对象
							for(var i in target) {
								source[i] = target[i];
							}
						}
					}
				};
				return source;
			})();
			return source;
		})() : (other.length > 0 ? other.pop() : null);
	},
	merge: function(){
		var me = this;
		var arr = [];
		var other = [];
		for(var i in arguments) {
			var value = arguments[i];
			me.isPointer(value) ? arr.push(value) : other.push(value);
		}
		return arr.length > 0 ? (function(){
			var source = arr[0];
			var sourcetype = me.getType(source);
			source = arr.length == 1 
			? (sourcetype == "object" ? me.merge({},source) : me.merge([],source))
			: (function(){
				for(var i = 1; i < arr.length; i++) {
					var target = arr[i];
					var targettype = me.getType(target);
					if(sourcetype == targettype) {
						if(sourcetype == "array") {
							target.forEach(function(value){
								var res = me.isPointer(value) ? (me.isObject(value) ? me.merge({},value) : me.merge([],value)) : value;
								source.indexOf(res) < 0 ? source.push(res) : null;
							})
						} else {
							// 都是对象
							for(var j in target) {
								source[j] = me.merge(source.hasOwnProperty(j) ? source[j] : '',target[j])
							}
						}
					}
				};
				return source;
			})();
			return source;
		})() : (other.length > 0 ? other.pop() : null);
	},
	isObject: function(value){
		return value instanceof Object && !(value instanceof Array);
	},
	isArray: function(value){
		return value instanceof Array;
	},
	isBoolean: function(value){
		return  typeof value == "boolean";
	},
	isString: function(value){
		return (typeof value) == "string";
	},
	isNumber: function(value){
		return (typeof value) == "number" &&　!isNaN(value);
	},
	isPointer: function(value){
		return (typeof value) == "object";
	},
	getType: function(value){
		var type = typeof value;
		var me = this;
		return type == "string"
			   ? "string"
			   : (
			   	type == "number" 
			   	? (isNaN(value) ? "NaN" : "number")
			   	: (me.isArray(value) ? "array" : "object")
			   )	
	}
};