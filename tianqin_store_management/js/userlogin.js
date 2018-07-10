/**
 * Created by Lily on 2018/5/24.
 */

$(function() {
    function checkUserNameAndPassword() {
        var isValid = true;
        var userName = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        //验证用户名
        if(userName.length >= 3 && userName.length <= 12 && userName != '') {
            $(".name_label").remove();
        } else {
            $(".name_label").empty();
            $('input[name="username"]').after("<label class='name_label'><font>用户名不能为空</font></label>");
            isValid = false;
        }

        //验证密码
        if(password.length >= 6 && password.length <= 20 && password != ''){
            $(".pwd_label").remove();
        }else{
            $(".pwd_label").empty();
            $('input[name="password"]').after("<label class='pwd_label'><font>密码不能为空</font></label>");
            isValid = false;
        }
        return isValid;
    }

    $("input[name='username']").blur(function(){
        var userName = $('input[name="username"]').val();
        //验证用户名
        if(userName.length >= 3 && userName.length <= 12 && userName != '') {
            $(".name_label").remove();
        } else {
            $(".name_label").empty();
            $('input[name="username"]').after("<label class='name_label'><font>用户名不能为空</font></label>");
        }
    });

    $("input[name='password']").blur(function(){
        var password = $('input[name="password"]').val();
        //验证密码
        if(password.length >= 6 && password.length <= 20 && password != '') {
            $(".pwd_label").remove();
        }else{
            $(".pwd_label").empty();
            $('input[name="password"]').after("<label class='pwd_label'><font>密码不能为空</font></label>");
        }
    });

    //登录按钮
    $("#logon_button").click(function(e) {
        e.preventDefault();
        if (checkUserNameAndPassword()) {
            var userName = $('input[name="username"]').val();
            var password = $('input[name="password"]').val();
            $.ajax({
                url : config.serverHost + "/login?name=" + userName + "&pwd=" + password,
                type : "POST",
                dataType : "json",
                beforeSend: function() {
                    $("#loading").show();
                    $("#forgetpwd_btn").attr({ disabled: "disabled" });
                    $("#logon_button").attr({ disabled: "disabled" });
                },
                success : function(data) {
                    var result = data.ret;
                    try{
                        if (result == "SUCCESS") {
                            //save session id
                            window.common.setCookie("sessionId", data.dat.sessionId);
                            loginUser.username = data.dat.employee.epyName;
                            loginUser.password = data.dat.employee.epyPwd;
                            loginUser.positionId = data.dat.position.positionId;
                            loginUser.positionName = data.dat.position.positionName;
                            saveUserInfo();
                            window.location.href="./html/main.html";
                            layer.msg("登录成功");
                        } else {
                            layer.msg(data.msg);
                        }
                    }catch (e) {
                    }
                },
                error:function(msg) {
                    layer.msg("登录异常");
                },
                complete: function() {
                    $("#loading").hide();
                    $("#forgetpwd_btn").removeAttr("disabled");
                    $("#logon_button").removeAttr("disabled");
                }
            });
        } else {
            return;
        }
    });

    $(document).ready(function(){
        $('input[name="username"]').val("");
        $('input[name="password"]').val("");
        //自动登录
        if(window.common.getCookie("islogon") == "true") {
            var username = window.common.getCookie("username");
            var password = window.common.getCookie("password");
            if(username && password) {
                loginUser.isAutoLogon = true;
                window.location.href="./html/main.html";
            }
        }
    });

    ////自动添加用户名密码
    //function autoPwd(){
    //    if (window.common.getCookie("islogon") == "true") {
    //        var username = $("#txt_username").val();
    //        if(username==$.cookie("username")){
    //            $("#ck_rmbUser").attr("checked", true);
    //            $("#txt_password").val($.cookie("password"));
    //        }
    //    }
    //}

    //记住用户名密码
    function saveUserInfo() {
        var username = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        window.common.setCookie("username", username);
        window.common.setCookie("password", password);
        window.common.setCookie("islogon", "true");
    }
});