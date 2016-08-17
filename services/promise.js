
/**
 * Created by qianzhixiang on 16/5/9.
 */
var $q = {};
(function(){
    $q.defer = function(){
        return new promise();
    };
    var promise = function(){
        var me = this;
        me.promise = new temp(me);
    };
    promise.prototype.resolve = function(data1,data2,data3,data4){
        var me = this;
        me.isEnd = true;
        me.params_1 = data1;
        me.params_2 = data2;
        me.params_3 = data3;
        me.params_4 = data4;
        if(me.promise.thenFunc) {
            me.promise.thenFunc(data1,data2,data3,data4);
        }
    };
    promise.prototype.isEnd = null;
    promise.prototype.params = null;
    var temp = function(promise){
        var me = this;
        me.promise = promise;
    };
    temp.prototype.then = function(func){
        var me = this;
        var deferred = $q.defer();
        me.thenFunc = function(data1,data2,data3,data4){
            var temp_promise = func(data1,data2,data3,data4);
            if(temp_promise && temp_promise.then != null) {
                temp_promise.then(function(opts_1,opts_2,opts_3,opts_4){
                    deferred.resolve(opts_1,opts_2,opts_3,opts_4);
                })
            } else {
                deferred.resolve(temp_promise);
            }
        };
        if(me.promise.isEnd) {
            me.thenFunc(me.promise.params_1,me.promise.params_2,me.promise.params_3,me.promise.params_4);
        }
        return deferred.promise;
    };
})();
module.exports = $q;