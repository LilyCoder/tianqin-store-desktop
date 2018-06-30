/**
 * Created by Lily on 2018/6/20.
 */
(function($){
    window.systemSetting = function(){
        //系统设置界面初始化
        function initSysSettingMgr() {
            $.ajax({
                url: serverHost + "/store",
                type: "get",
                data: {},
                dataType: "json",
                success: function(resp) {
                    if(resp.ret == "SUCCESS") {
                        $("input[name='storename']").val(resp.dat.storeName);
                        $("input[name='storeaddress']").val(resp.dat.storeAddress);
                        $("#headPic").attr("src", resp.dat.storeIcon);
                        $("input[name='telnumber']").val(resp.dat.storeTel);
                        $("input[name='mastertel']").val(resp.dat.storeKeeperPhone);
                    } else {
                        $("input[name='storename']").val("-");
                        $("input[name='storeaddress']").val("-");
                        $("input[name='storeaddress']").val("-");
                        $("input[name='telnumber']").val("-");
                        $("input[name='mastertel']").val("-");
                    }
                }
            });
        }

        /**
         * 头像上传
         */
        $("#headPic").click(function(){
            $("#upload").click(); //隐藏了input:file样式后，点击头像就可以本地上传
            $("#upload").on("change", function(){
                var objUrl = function(file) {
                    var url = null;
                    if (window.createObjectURL != undefined) { // basic
                        url = window.createObjectURL(file);
                    } else if (window.URL != undefined) { // mozilla(firefox)
                        url = window.URL.createObjectURL(file);
                    } else if (window.webkitURL != undefined) { // webkit or chrome
                        url = window.webkitURL.createObjectURL(file);
                    }
                    return url;
                }(this.files[0]) ;

                //获取图片的路径，该路径不是图片在本地的路径
                if (objUrl) {
                    $("#headPic").attr("src", objUrl) ; //将图片路径存入src中，显示出图片
                }
                //上传图片到服务器上
                var fd = new FormData();
                fd.append("desc", "123456");
                fd.append("uploadFile", $("input[name='file']")[0].files[0]);
                $.ajax({
                    url: serverHost + "/upload",
                    type: "POST",
                    data: fd,
                    async : false,
                    processData: false,
                    contentType: false,
                    dataType: 'json', //返回值类型 一般设置为json
                    success: function (resp) {
                        if(resp.ret == "SUCCESS"){
                            var filename = resp.dat;
                            $("#upload").attr("value", filename);
                            alert(resp.msg);
                        } else {
                            alert(resp.msg);
                        }
                    },
                    error: function(jqXHR, status, exp){
                        alert(exp);
                    }
                });
            });
        });


        //表单验证
        $("#sys_setting_form").validate({
            rules: {
                storeaddress: "required",
                telnumber: {
                    required: true,
                    minlength: 11
                }
            },
            messages: {
                storeaddress: "请输入店铺地址",
                telnumber: {
                    required: "请输入店铺电话",
                    minlength: "长度不能小于11个数字"
                }
            }
        });

        $.validator.setDefaults({
            submitHandler: function() {
                var storeInfo = {
                    "storeName": $("input[name='storename']").val(),
                    "storeAddress" : $("input[name='storeaddress']").val(),

                }
                $.ajax({
                    url: serverHost + "/storeset",
                    type: "post",
                    data: storeInfo,
                    dataType: "json",
                    success: function(resp){

                    },
                    error: function(jqXHR, textStatus, exp) {

                    }
                });

            }
        });

        return {
            initSysSettingMgr:initSysSettingMgr
        }
    }();
})(jQuery)