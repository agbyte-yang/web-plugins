;!function (win) {
    "use strict";

    var WinMsg = {
        callback:{},
        gcallback:[],

        onmessage: function (key, callback) {                // 监听指令
            if(typeof key === "function"){
                callback = key;
                key = null;
            }
            if(callback){
                if(key){
                    WinMsg.callback[key] = callback;
                }else{
                    WinMsg.gcallback.push(callback);
                }
            }
        },

        clear: function (key) {                // 清除监听
            if(key){
                delete WinMsg.callback[key];
            }
        },
        clearg: function (i) {                // 清除监听
            if(i){
                delete WinMsg.gcallback[i];
            }else{
                WinMsg.gcallback = [];
            }
        },

        post: function (data, dest) {			// 给别的窗口发消息
            dest.postMessage(data, '*');
        },

        postback: function (data) {			// 给父窗口发消息
            WinMsg.post(data, window.opener || window.parent)
        }
    };

    function handler(e) {
        if(e.data instanceof Object && e.data.key){
            var func = WinMsg.callback[e.data.key];
            if(func){
                func(e);
            }
        }else{
            for(var i in WinMsg.gcallback){
                WinMsg.gcallback[i](e);
            }
        }
    }

    //监听postMessage消息事件
    if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', handler, false);
    } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', handler);
    }

    window.jwindow = WinMsg;
}(window);