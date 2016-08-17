// var service = require("./service");
// var ser = new service();
// var res = ser.get("qzx");
// console.log(res);
// console.log(ser);
var app = (require("./main"))();
// var fs = require("fs");
// var EventEmitter = require('events').EventEmitter;
// var eventer = new EventEmitter();
// var watcher = fs.watch("./service.js");
// watcher.on("change",function(type,filename){
// 	eventer.emit("change",type,filename,"./service.js");
// });
// eventer.on("change",function(type,filename,path){
// 	console.log(type,filename,path)
// })
// var util = require("./services/util.js");
// var a = {
// 	a: [1,2,3,4]
// };
// var b = {
// 	a: [2,3,4,6]
// }
// var c = {
// 	a: [12,234,543]
// }
// util.merge(a,b,c);
// console.log(a)