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
            $(".name_label").empty();
        } else {
            $(".name_label").empty();
            $('input[name="username"]').after("<label class='name_label'><font>用户名不能为空</font></label>");
            isValid = false;
        }

        //验证密码
        if(password.length >= 6 && password.length <= 20 && password != ''){
            $(".pwd_label").empty();
        }else{
            $(".pwd_label").empty();
            $('input[name="password"]').after("<label class='pwd_label'><font>密码不能为空</font></label>");
            isValid = false;
        }
        return isValid;
    }

    //http://192.168.43.106:8080/stm/login?name=###&pwd=###
    $("#logon_button").click(function(e) {
        e.preventDefault();
        if (checkUserNameAndPassword()) {
            var userName = $('input[name="username"]').val();
            var password = $('input[name="password"]').val();
            $.ajax({
                url : "http://192.168.43.106:8080/stm/login?name=" + userName + "&pwd=" + password,
                type : "POST",
                dataType : "json",
                success : function(data) {
                    var result = data.ret;
                    if (result == "SUCCESS") {
                        window.location.href="main.html";
                    } else {
                        $(".notice").html(data.msg).css("color", "red");
                        $(".notice").show();
                    }
                },
                error:function(msg) {
                    $(".notice").html('Error:'+ msg);
                }
            });
        } else {
            return;
        }
    });
});