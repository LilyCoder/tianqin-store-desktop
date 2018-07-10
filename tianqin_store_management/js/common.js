/**
 * Created by Lily on 2018/7/1.
 */
var config = {
    version: "V1.0.0.1",
    serverHost: "http://192.168.132.107:8080/stm",
    doman: "http://localhost:63342/tianqin_store_management/html",
    defaultPwd: "123456",
    userrole:{
        "0": "全部",
        "1": "股东",
        "2": "区域经理",
        "3": "财务",
        "4": "店长",
        "5": "员工",
        "6": "管理员"
    },
    staffStatus: {
        "1": "在职",
        "2": "休假",
        "3": "离职"
    }
};

var loginUser = {
    isAutoLogon: false
};

(function($){
    window.common = function(){
        function setCookie(key, value){
            document.cookie = key + '=' + value + ';expires=Tue, 17 Jul 1970 14:07:41 GMT';
        }

        function removeCookie(key) {
            document.cookie = key + '=' + value + ';expires=Tue, 17 Jul 1960 14:07:41 GMT';
        }
        function getCookie(key) {
            var cookieArr = document.cookie.split('; ');
            for(var i = 0; i < cookieArr.length; i++) {
                var arr = cookieArr[i].split('=');
                if(arr[0] === key) {
                    return arr[1];
                }
            }
            return false;
        }
        return {
            setCookie: setCookie,
            removeCookie: removeCookie,
            getCookie: getCookie
        }
    }();
})();