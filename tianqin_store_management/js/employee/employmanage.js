/**
 * Created by Lily on 2018/7/9.
 */
(function($){
    window.employee = function() {
        function renderEmployeeTable(staffLst) {
            $.each(staffLst, function(i, n) {
                $(".employee_table>table>tbody").append("<tr>"
                + "<td class='staffNo' style='text-align: left'>" + n.epyId + "</td>"
                + "<td class='staffName'>" + n.epyName + "</td>"
                + "<td class='staffSex'>" + n.epySex + "</td>"
                + "<td class='staffAge'>" + n.epyBirthday + "</td>"
                + "<td class='staffPos' data-posid='" + n.epyPosition + "'>" +
                   config.userrole[n.epyPosition] + "</td>"
                + "<td class='accountNo'>" + n.epyAccount + "</td>"
                + "<td class='password'>" + n.epyPwd + "</td>"
                + "<td class='staffId'>" + n.epyIdentity + "</td>"
                + "<td class='staffTel'>" + n.epyContact + "</td>"
                + "<td class='staffOnJob'>" + config.staffStatus[n.epyOnjob] + "</td>"
                + "<td class='staffMark'>" + n.epyRemark + "</td>"
                + "<td class='rowOper'>"
                + "<button type='button' class='btn btn-primary row_delete'>" +
                "<span class='glyphicon glyphicon-trash' style='color: rgb(0, 187, 223);'></span>" +
                "</button>"
                + "<button type='button' class='btn btn-primary row_update' " +
                "data-toggle='modal' data-target='#add_newstaff_modal'>" +
                "<span class='glyphicon glyphicon-edit' style='color: rgb(0, 187, 223);'></span>" +
                "</button>"
                + "</td>"
                + "</tr>");
            });
        }

        /**
         * 初始化员工管理信息
         */
        function initEmployeeMgrInfo() {
            $.ajax({
                url: config.serverHost + "/employee?pageSize=8",
                type: "get",
                data:{},
                dataType: "json",
                beforeSend: function() {
                    $("#staff_loading").show();
                },
                success: function(resp) {
                    if(resp.ret == "SUCCESS") {
                        try{
                            //初始化员工表
                            $(".employee_table>table>tbody").empty();
                            var staffLst = resp.dat.employees;
                            renderEmployeeTable(staffLst);
                            var page = resp.dat.page;
                            $(".employ_mgr .pagination_bar .page_no").text(page.pc);
                            $(".employ_mgr .pagination_bar .page_number").text(page.pt);
                        } catch (e) {
                        }
                    } else {
                        toastr.options.positionClass = 'toast-top-center';
                        toastr.error(resp.msg);
                    }
                },
                error: function(msg) {
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("服务异常");
                },
                complete: function() {
                    $("#staff_loading").hide();
                }
            });
        }

        function queryStaffDetail(pageSize, pageNumber) {
            var staffName = $("input[name='con_staff_name']").val();
            var position = $("select#con_staff_pos option:selected").attr("data-posid");
            var onJobStatus = $("select#con_staff_onjob option:selected").attr("data-stat");
            var queryParam = {
                "employeeMes": staffName!=null&&staffName!=undefined?staffName:"",
                "position": position!=null&&position!=undefined?position:"",
                "onJob": onJobStatus,
                "pageSize": pageSize,
                "pageNumber": pageNumber
            };
            $.ajax({
                url: config.serverHost + "/employee",
                type: "get",
                async : false,
                data: queryParam,
                dataType: "json",
                beforeSend: function() {
                    $("#staff_loading").show();
                },
                success: function(resp) {
                    try{
                        if(resp.ret == "SUCCESS"){
                            $(".employee_table>table>tbody").empty();
                            var qryStaffLst = resp.dat.employees;
                            renderEmployeeTable(qryStaffLst);
                            var page = resp.dat.page;
                            $(".employ_mgr .pagination_bar .page_no").text(page.pc);
                            $(".employ_mgr .pagination_bar .page_number").text(page.pt);
                        } else {
                            toastr.options.positionClass = 'toast-top-center';
                            toastr.error("查询失败");
                        }
                    }catch (e) {
                    }
                },
                error: function(msg) {
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("服务异常");
                },
                complete: function(e) {
                    $("#staff_loading").hide();
                }
            });
        }

        //查询员工信息
        $(".employ_mgr .operation_button .search_button>button").click(function(e){
            var pageSize = $(".employ_mgr .pagination_bar .page_size select").text();
            var pageNumber = $(".employ_mgr .pagination_bar .page_no").text();
            queryStaffDetail(pageSize, pageNumber);
        });

        //查询上一页
        $(".employ_mgr .pagination_bar .last_page button").click(function(e) {
            var pageSize = $(".employ_mgr .page_size select option:selected").text();
            var pageNumber = $(".employ_mgr .page_no").text();
            var pageTotal = $(".employ_mgr .page_number").text();
            if(pageNumber != null && pageNumber != undefined) {
                pageNumber = Number(pageNumber);
            } else {
                pageNumber = 1;
            }
            if(pageNumber <= 1) {
                //hint
                toastr.options.positionClass = 'toast-top-center';
                toastr.info("当前已是第一页");
                return;
            }
            queryStaffDetail(pageSize, pageNumber);
        });

        //查询下一页
        $(".employ_mgr .pagination_bar .next_page button").click(function(e) {
            var pageSize = $(".employ_mgr .page_size select option:selected").text();
            var pageNumber = $(".employ_mgr .page_no").text();
            var pageTotal = $(".employ_mgr .page_number").text();
            if(pageNumber != null && pageNumber != undefined && pageNumber != "") {
                pageNumber = Number(pageNumber);
            } else {
                pageNumber = 1;
            }

            if(pageTotal != null && pageTotal != undefined && pageTotal != "") {
                pageTotal = Number(pageTotal);
            } else {
                pageTotal = 1;
            }

            if(pageNumber >= pageTotal) {
                toastr.options.positionClass = 'toast-top-center';
                toastr.info("当前已是最后一页");
                return;
            }
            queryStaffDetail(pageSize, pageNumber);
        });

        /**
         * 添加员工信息
         */
        $(".employee-management .add_button>button").click(function(e){
            //$.datetimepicker.setLocale('en');
            $( "#datepicker" ).datepicker({
                dateFormat: 'yy-mm-dd',
                dayNamesMin: ['日','一','二','三','四','五','六'],
                monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                showButtonPanel:true,//是否在日期面板中显示按钮
                currentText: '今天',//给今天按钮设置文字
                closeText: '关闭',//给关闭按钮设置文字
                firstDay:1,//设置一周从星期一开始
                showMonthAfterYear:true,
                lang: "zh",
                theme: "redmond"
            });
        });

        $("#staff_btn_submit").click(function(e) {
            var rowActin = $("#staff_btn_submit").attr("data-action");
            //点击提交
            var employee = {
                "epyName" : $("input[name='staffName']").val(),
                "epySex": $("#staffSex option:selected").text(),
                "epyBirthday": $("input[name='staffBirthday']").val(),
                "epyPosition": $("select#staffPos option:selected").attr("data-posid"),
                "epyIdentity": $("input[name='staffIdenty']").val(),
                "epyAccount": $("input[name='staffAccount']").val(),
                "epyPwd": $("input[name='staffPassword']").val(),
                "epyContact": $("input[name='staffTel']").val(),
                "epyOnjob": $("select#staffObJob option:selected").attr("data-stat"),
                "epyRemark": $("input[name='staffMark']").val()
            };
            var isAddSuc = false;
            $.ajax({
                url: config.serverHost + "/addemplo",
                type: "post",
                async: false,
                data: employee,
                dataType: "json",
                beforeSend: function() {
                   $("#staff_loading").show();
                },
                success: function(resp) {
                    if(resp.ret == "SUCCESS") {
                        try{
                            isAddSuc = false;
                            toastr.options.positionClass = 'toast-top-center';
                            toastr.success('提交数据成功');
                            $("#add_newstaff_modal").modal("hide");
                        }catch (e) {
                        }
                    } else {
                        toastr.options.positionClass = 'toast-top-center';
                        toastr.success(resp.msg);
                    }
                },
                error: function(jqXHR, textStatus, exp){
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("服务异常");
                },
                complete: function() {
                    $("#staff_loading").hide();
                }
            });
            if(isAddSuc) {
                var pageSize = $(".employ_mgr .pagination_bar .page_size select").text();
                queryStaffDetail(pageSize, "1");
            }
        });

        /**
         *修改员工信息 delegate("tr", "click", function()
         */
        $(".employee_table>table>tbody").on("click", "tr>td.rowOper>button.row_update", function(e){
            //取表格中的某一行
            var $selections = $(this).parent("td.rowOper").parent();
            //打开修改窗口
            $("input[name='staffName']").attr("value", $selections.find("td.staffName").text());
            $("input[name='staffSex']").attr("value",$selections.find("td.staffSex").text());
            $("input[name='staffBirthday']").attr("value", $selections.find("td.staffAge").text());
            $("select#staffPos").val($selections.find("td.staffPos").text());
            $("input[name='staffIdenty']").attr("value", $selections.find("td.staffId").text());
            $("input[name='staffAccount']").attr("value", $selections.find("td.accountNo").text());
            $("input[name='staffPassword']").attr("value", $selections.find("td.password").text());
            $("input[name='staffTel']").attr("value", $selections.find("td.staffTel").text());
            $("input[name='staffObJob']").text($selections.find("td.staffOnJob").text());
            $("input[name='staffMark']").attr("value", $selections.find("td.staffMark").text());
        });

        //删除员工
        $(".employee_table>table>tbody").on("click", "tr>td.rowOper>button.row_delete", function(e){
            var $selections = $(this).parent("td.rowOper").parent();
            Ewin.confirm({message: "确定删除员工信息?"}).on(function(status){
                if(status) {
                    $selections.remove();
                }
            });
        });

        $(document).ready(function(e){
            initEmployeeMgrInfo();
        });
    }();
})(jQuery);
