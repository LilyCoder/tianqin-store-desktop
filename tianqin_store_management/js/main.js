
var serverHost = "http://192.168.132.104:8080/stm";
$(document).ready(function() {
    //Default Action
    $(".tab-pane").hide();
    $("ul.nav.tabs-left li:first").addClass("active").show();
    $(".tab-pane:first").show();

    $("ul.nav.tabs-left li").click(function() {
        $("ul.nav.tabs-left li").removeClass("active");
        $(this).addClass("active");
        $(".tab-pane").hide();
        var activeTab = $(this).find("a").attr("href");
        $(activeTab).fadeIn();
        return false;
    });

    //On Click Event Tab切换 商品类别tab切换
    $("ul.cates_tabs").delegate("li", "click", function(){
        $("ul.cates_tabs li").removeClass("current"); //Remove any "active" class
        $(this).addClass("current"); //Add "active" class to selected tab
        $(".tab_content").hide(); //Hide all tab content
        var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
        $(activeTab).fadeIn(); //Fade in the active content
        return false;
    });

    ///////////////////////////////////我的桌面///////////////////////////////
    //我的桌面刷新按钮
    $(".refresh").click(function(){
        initMyDeskData();
    })

    //图表切换
    $("#turnoverBtn > button").click(function() {
        $(".summary_chart").hide();
        $("#turnover-chart").show();
    });

    $("#consumerBtn > button").click(function() {
        $(".summary_chart").hide();
        $("#consumer-chart").show();
    });

    //初始化我的桌面数据
    initMyDeskData();
    //消费管理信息
    initConsumerMgrInfo();

    //////////////////////////////////消费管理//////////////////////////////////////
    //消费管理,添加订单商品或者移除
    $(".category_row>div").each(function(index) {
        $(this).on("click", function() {
            if($(this).hasClass("goods_unchecked")) {   //选中商品
                $(this).removeClass("goods_unchecked");
                $(this).addClass("goods_checked");
                //在订单列表中增加一行
                var $lastTr = $(".order-info.activeTab").find("table>tbody.order_list>tr").last();
                var orderId = null;
                if($lastTr.length == 0) {
                    orderId = 1;
                } else {
                    orderId = parseInt($lastTr.find("td.orderId").text()) + 1;
                }
                $(this).attr("data-selected-No", "No_" + orderId); //根据订单的序号进行绑定
                var strHtml = "";
                strHtml +=  "<tr data-selected-No='No_" + orderId + "'>" +
                "<td class='orderId' style='width: 45px'>" + orderId + "</td>" +
                "<td class='item_name' style='width: 130px;'>" + $(this).find(".cmdyName").text() + "</td>" +
                "<td class='item_num' style='45px;'>1</td>" +
                "<td class='item_unit_price' style='width: 60px;'>" + $(this).find(".cmdyUprice").text() + "</td>" +
                "<td class='item_discount' style='width: 50px;'>" + $(this).find(".promRate").text() + "</td>" +
                "<td class='item_total_price' style='width: 70px;'>" + $(this).find(".cmdyUprice").text() + "</td>" +
                "</tr>";
                $(".order-info.activeTab").find("table>tbody.order_list").append(strHtml);
            }
        });

    });

    //动态添加订单Tab&Table content
    $("button.add_tab_item").click(function(e){
        var $exTab = $("ul.order_dynmic_tab>li");
        $exTab.removeClass("active");
        var lastTabIndex = 0;
        if($exTab.length != 0) {
            lastTabIndex = $("ul.order_dynmic_tab>li").last().children("a").attr("tabindex");
        }
        var tabLabel = $("#order_tab_label option:selected").text();
        var $newTab = $("<li class='active'>" +
        "<a href='#order_" + (parseInt(lastTabIndex) + 1) + "' class='btn btn-primary'></a></li>");
        $newTab.find("a").text(tabLabel);
        $newTab.find("a").attr("tabindex", (parseInt(lastTabIndex) + 1));
        $("ul.order_dynmic_tab").append($newTab);

        //创建订单信息
        var $outerHtml = $("<div class='order-info activeTab' id='order_" + (parseInt(lastTabIndex) + 1) + "'></div>");
        //添加Table
        var $tableHtml = $("<table class='table' style='table-layout: fixed; width: 408px;'>"
                        + "<thead class='t_head'>"
                        + "<tr>"
                        + "<th style='width: 45px;'>序号</th>"
                        + "<th style='width: 130px;'>名称</th>"
                        + "<th style='width: 45px;'>数量</th>"
                        + "<th style='width: 60px;'>单价</th>"
                        + "<th style='width: 50px;'>折扣</th>"
                        + "<th style='width: 70px;'>金额</th>"
                        + "</tr>"
                        + "</thead></table>");
        $tableHtml.append("<tbody class='order_list'></tbody>");
        $outerHtml.append($tableHtml).append(orderSettleHtml());
        $("div.order-info").removeClass("activeTab").last().after($outerHtml);
    });

    //删除订单Tab
    $("button.delete_tab_item").click(function(e){
        var $deleteTab = $("ul.order_dynmic_tab>li.active>a");
        if($deleteTab.length == 0) {
            return;
        }
        layer.confirm("确认删除订单？", {
            btn: ['取消','确定'],//按钮
            skin: "confirm_layer",
            area:["345px", "345px"]
        }, function(){
        }, function(){
            $("div.order-info").removeClass("activeTab");
            $("" + $deleteTab.attr("href")).remove(); //remove order info
            $deleteTab.parent().remove(); //remove TabItem

            $("ul.order_dynmic_tab>li").removeClass("active").last().addClass("active");
            var tabId = $("ul.order_dynmic_tab>li").last().find("a").attr("href");
            $("" +tabId).addClass("activeTab");
            $("" +tabId).fadeIn();
        });
    });

    //订单Tab切换
    $("ul.order_dynmic_tab").on("click", "li>a", function(e){
        e.preventDefault();
        $("ul.order_dynmic_tab>li").removeClass("active");
        $(this).parent().addClass("active");

        $("div.order-info").removeClass("activeTab");
        var tabId = $(this).attr("href");
        $(tabId).addClass("activeTab").fadeIn();
    });

    //选择订单中的某一行
    $(document).on("click", ".order-info.activeTab .order_list tr", function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
            $(".order-info.activeTab .order_list tr").not(this).removeClass("active");
        }
    });

    $(".add_goods>button").click(function() {
        var $selectRow = $(".order-info.activeTab .order_list tr.active");
        if($selectRow.length == 0) {
            return;
        }
        //商品数量
        var itemNum = $selectRow.find(".item_num").text();
        $selectRow.find(".item_num").text(parseInt(itemNum) + 1);
        //商品单价
        var itemUnitPrice = $selectRow.find(".item_unit_price").text();
        //商品折扣
        var itemDiscount = $selectRow.find(".item_discount").text();
        //计算商品的价格
        var itemPrice = (parseInt(itemNum) + 1) * Number(itemUnitPrice).toFixed(2) * toPoint(itemDiscount);
        $selectRow.find(".item_total_price").text(itemPrice.toFixed(2));
    });

    //减少商品
    $(".minus_goods>button").click(function(){
        var $selectRow = $(".order-info.activeTab .order_list tr.active");
        if($selectRow.length == 0) {
            return;
        }
        //商品数量
        var itemNum = $selectRow.find(".item_num").text();
        var intNum = parseInt(itemNum);
        if(intNum <= 0) {
            return;
        }
        //数量为0时删除当前行
        $selectRow.find(".item_num").text(intNum - 1);
        if((intNum - 1) <= 0) {
            var selectRow = $selectRow.find("td.orderId").text();
            $(".category_row>div[data-selected-No=" + $selectRow.attr("data-selected-No") + "]")
                .removeClass("goods_checked").addClass("goods_unchecked").removeAttr("data-selected-No");
            $selectRow.remove();
            var rowId = 1;
            $("table.activeTab>tbody.order_list>tr").each(function(){
                $(this).find("td.orderId").text(rowId);
                rowId = rowId + 1;
            });
            return;
        }
        //商品单价
        var itemUnitPrice = $selectRow.find(".item_unit_price").text();
        //商品折扣
        var itemDiscount = $selectRow.find(".item_discount").text();
        //计算商品的价格
        var itemPrice = (intNum - 1) * Number(itemUnitPrice).toFixed(2) * toPoint(itemDiscount);
        $selectRow.find(".item_total_price").text(itemPrice.toFixed(2));
    });

    /**
     *
     * 删除订单中的某一项
     */
    $("div.delete_goods>button").click(function(e){
        e.preventDefault();
        var $selectRow = $(".order-info.activeTab tbody.order_list tr.active");
        if($selectRow.length == 0) {
            return;
        }
        var selectRow = $selectRow.find("td.orderId").text();
        $(".category_row>div[data-selected-No=" + $selectRow.attr("data-selected-No") + "]")
            .removeClass("goods_checked").addClass("goods_unchecked")
            .removeAttr("data-selected-No");
        $selectRow.remove();
        var rowId = 1;
        $(".order-info.activeTab tbody.order_list tr").each(function(){
            $(this).find("td.orderId").text(rowId);
            rowId = rowId + 1;
        });
    });
    //清空订单信息
    $(".submit_btn>button.mg_right").click(function (e) {
        $(".order-info.activeTab tbody.order_list").empty();
        $(".order-info.activeTab .order_settle .order_nums").text("00");
        $(".order-info.activeTab .order_settle .total_amt").text("00.00");

        //reset all of selected goods status
        $(".category_row>div").each(function(){
            if($(this).hasClass("goods_checked"))
            {
                $(this).removeClass("goods_checked");
                $(this).addClass("goods_unchecked");
            }
        });
    });

    /**
     * 提交订单信息
     */
    $(".submit_btn .lg_button-left").click(function(e){
        var options = {
            title: "请选择支付方式"
        };
        POPOVER.open(options);
    });

    //查询顾客信息
    $(".order_settle input[name='consumer']").blur(function(){
        //查询顾客信息
        var queryParam = {
            "userId": $("input[name='consumer']").val(),
            "price": Number($(".order_settle .total_amt").text())
        }
        $.ajax({
            url: serverHost + "/pmcheck",
            type: "get",
            async: false,
            data: queryParam,
            dataType: "json",
            success: function(resp){

            }

        });
        console.log("dddddd");
    });

    ///////////////////////////////////商品管理/////////////////////////////////////
    $("ul.goods_tabs_nav li").click(function() {
        if($(this).hasClass("activeTab")){
            return false;
        }
        $("ul.goods_tabs_nav li").removeClass("activeTab");
        $(this).addClass("activeTab");
        $(".goods_tabs_content").hide();
        var activeTab = $(this).find("a").attr("href");
        $(activeTab).fadeIn();
        return false;
    });

    //商品管理-添加商品
    $("#goods_mgr").find(".operation_button .add_button>button").click(function(){
        var options = {
            "title": "新增商品"
        };
        $("#goods_btn_submit").attr("data-action", "AG");
        $(".packinfo_update").hide();
        $(".goodsinfo_update").show();
        POPOVER.open(options);
    });

    $("input[name='uploadGoodsImage']").change(function(){
        var file = this.files[0];
        name = file.name;
        size = file.size;
        type = file.type;
    });

    //图片上传
    $("#img_submit_btn").click(function(){
        var fd = new FormData();
        fd.append("desc", "123456");
        fd.append("uploadFile", $("input[name='MultipartFile']")[0].files[0]);
        $.ajax({
            url: serverHost + "/upload",
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json', //返回值类型 一般设置为json
            async : false,   //是否是异步
            success: function(resp){
                if(resp.ret == "SUCCESS"){
                    var filename = resp.dat;
                    $("#uploadGoodsImage").attr("value", filename);
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

    $("#goods_btn_submit").click(function(){
        //send ajax to save goods info
        var deductWays = $("#selectDeductWays").find("option:selected").text();
        var btnAction = $("#goods_btn_submit").attr("data-action");
        var cmsiMethod = "";
        if(deductWays == "固定金额") {
            cmsiMethod = "1";
        } else if(deductWays == "提成比例"){
            cmsiMethod = "2";
        }
        var newGoodsInfo = {
            "cmdyName": $("input[name='goodsName']").val(),
            "cmdyUprice": $("input[name='goodsUnitPrice']").val(), //商品单价
            "cmdyCost": $("input[name='goodsCosts']").val(),
            "cmdyUnit": $("#goodsUnitSlect").find("option:selected").text(),
            "cmdyCategory": $("#selectGoodsCate").find("option:selected").attr("data-cateid"),
            "promRate": $("input[name='goodsRates']").val(),
            "cmsiMethod": cmsiMethod,
            "cmsiMoney": (deductWays == "固定金额")?
                $("input[name='deductValue']").val():"",
            "cmsiRate": (deductWays == "提成比例")?
                $("input[name='deductValue']").val():"",
            "cmdyRemark": $("input[name='goodsRemark']").val()
        };
        $.ajax({
            url: serverHost + "/addcommo",
            type: "post",
            async: false,
            data: newGoodsInfo,
            dataType: "json",
            success: function(resp) {
                if(resp.ret == "SUCCESS") {
                    try{
                        if(btnAction == "AG") {
                            //在表格中添加一行
                            addNewRowGoodsHtml(newGoodsInfo);
                        } else if(btnAction == "UG"){
                            updateRowGoodsHtml(newGoodsInfo);
                        }
                        toastr.options.positionClass = 'toast-top-center';
                        toastr.success('提交数据成功');
                        POPOVER.close();
                    }catch (e) {
                    }
                } else {
                    if(btnAction == "AG") {
                        toastr.options.positionClass = 'toast-top-center';
                        toastr.error("添加商品失败");
                    } else if(btnAction == "UG"){
                        toastr.options.positionClass = 'toast-top-center';
                        toastr.error("商品信息更新失败");
                    }
                }
            },
            error: function(jqXHR, textStatus, exp) {
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });

    /**
     * 修改商品信息
     */
    $(".goods_table>table>tbody").on("click", "tr>td.rowOper>button.row_update", function(){
        //取表格中的某一行
        var $selections = $(this).parent("td.rowOper").parent();
        $selections.addClass("update_row_goods");
        //打开修改窗口
        $("input[name='goodsName']").val($selections.find("td.goodsName").text());
        $("input[name='goodsUnitPrice']").val($selections.find("td.goodsUnitPrice").text());
        $("input[name='goodsCosts']").val($selections.find("td.goodsCost").text());
        $("input[name='goodsRates']").val($selections.find("td.goodsRate").text());
        $("input[name='deductValue']").val($selections.find("td.deductMoney").text() != ""?
            $selections.find("td.deductMoney").text():$selections.find("td.deductRate").text());
        $("input[name='goodsRemark']").val($selections.find("td.goodsMark").text());
        //删除class值为modal-backdrop的标签，可去除阴影
        $("#goods_btn_submit").attr("data-action", "UG");
        var options = {
            title: "修改商品信息"
        };
        POPOVER.open(options);
    });

    /**
     * 删除商品
     */
    $(".goods_table>table>tbody").on("click", "tr>td.rowOper>button.row_delete", function(){
        var $selections = $(this).parent("td.rowOper").parent();
        //取表格中的某一行
        Ewin.confirm({message: "确定删除商品?"}).on(function (status) {
            if(status) {
                $selections.remove();
                var rowNo = 1;
                $(".goods_table>table>tbody>tr").each(function(){
                    $(this).find("tr.goodsNo").text(rowNo);
                    rowNo = rowNo + 1;
                });
            }
        });
    });

    /**
    * 查询商品
    */
    $(".goods-management .operation_button .search_button>button").click(function(e) {
        var checkText = $("#con_goods_cate").find("option:selected").attr("data-cateid");
        var queryParam = {
            "commoName": $("input[name='con_goods_name']").val(),
            "categoryId": checkText,
            "sign": "yes"
        };
        $.ajax({
            url: serverHost + "/commodity",
            type: "get",
            data: queryParam,
            dataType: "json",
            success: function(resp) {
                if(resp.ret == "SUCCESS") {
                    $(".goods_table>table>tbody").empty();
                    var rowNo = 1;
                    $.each(resp.dat.commodity, function(i, n) { //商品列表
                        $(".goods_table>table>tbody").append("<tr>"
                        + "<td class='goodsNo' style='text-align: left'>" + rowNo + "</td>"
                        + "<td class='goodsName'>" + n.cmdyName + "</td>"
                        + "<td class='goodsUnitPrice'>" + n.cmdyUprice + "</td>"
                        + "<td class='goodsCost'>" + n.cmdyCost + "</td>"
                        + "<td class='goodsUnit'>" + n.cmdyUnit + "</td>"
                        + "<td class='goodsDeduct'>" + n.promRate + "</td>"
                        + "<td class='goodsCate'>" + n.cmdyCategory + "</td>"
                        + "<td class='deductWays'>" + n.cmsiMethod + "</td>"
                        + "<td class='deductMoney'>" + n.cmsiMoney + "</td>"
                        + "<td class='deductRate'>" + n.cmsiRate + "</td>"
                        + "<td class='goodsMark'>" + n.cmdyRemark + "</td>"
                        + "<td class='rowOper'>"
                        + "<button type='button' class='btn btn-default row_delete' style='padding: 4px 8px;'>删除</button>"
                        + "<button type='button' class='btn btn-default row_update' style='padding: 4px 8px;'>更新</button>"
                        + "</td>"
                        + "</tr>");
                        rowNo = rowNo + 1;
                    });
                }else{
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("查询失败");
                }
            },
            error: function(jqXHR, textStatus, exp){
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });

    ////////////////////////////////////////===员工管理===///////////////////////////////
    //查询员工信息
    $(".employee-management .operation_button .search_button>button").click(function(e){
        var queryParam = {
            "employeeMes": $("input[name='con_staff_name']").val(),
            "position": $("#con_staff_pos option:selected").text(),
            "onJob": ($("#con_staff_onjob option:selected").text())=="是"?"1":"3"
        };
        $.ajax({
            url: serverHost + "/employee",
            type: "get",
            async : false,
            data: queryParam,
            dataType: "json",
            success: function(resp) {
                try{
                    if(resp.ret == "SUCCESS"){
                        var qryStaffLst = resp.dat;
                        renderEmployeeTable(qryStaffLst);
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
            }

        });
    });

    /**
     * 添加员工信息
     */
    $(".employee-management .add_button>button").click(function(e){
        var options = {
            title: "添加员工"
        };
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
        $("#staff_btn_submit").attr("data-action", "AG");
        POPOVER.open(options);
    });
    $("#staff_btn_submit").click(function(e) {
        var rowActin = $("#staff_btn_submit").attr("data-action");
        //点击提交
        var employee = {
            "epyName" : $("input[name='staffName']").val(),
            "epySex": $("#staffSex option:selected").text(),
            "epyBirthday": $("input[name='staffBirthday']").val(),
            "epyPosition": $("input[name='staffPos']").val(),
            "epyIdentity": $("input[name='staffIdenty']").val(),
            "epyContact": $("input[name='staffTel']").val(),
            "epyOnjob": ($("#staffObJob").text() == "是"?"1":"3"),
            "epyRemark": $("input[name='staffMark']").val()
        };
        $.ajax({
            url: serverHost + "/addemplo",
            type: "post",
            async: false,
            data: employee,
            dataType: "json",
            success: function(resp) {
                if(resp.ret == "SUCCESS") {
                    try{
                        if(rowActin == "AG") {
                            //在表格中添加一行
                            addNewEmployeeRowHtml(employee);
                        } else {
                            updateEmployeeRowHtml(employee);
                        }
                        toastr.options.positionClass = 'toast-top-center';
                        toastr.success('提交数据成功');
                        POPOVER.close();
                    }catch (e) {
                        console.log(resp.msg);
                    }
                } else {
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("更新失败");
                }
            },
            error: function(jqXHR, textStatus, exp){
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });

    /**
     *修改员工信息 delegate("tr", "click", function()
     */
    $(".employee_table>table>tbody").on("click", "tr>td.rowOper>button.row_update", function(e){
        $(".employee_table>table>tbody>tr").removeClass("update_staff_row");
        //取表格中的某一行
        var $selections = $(this).parent("td.rowOper").parent();
        $selections.addClass("update_staff_row");
        //打开修改窗口
        $("input[name='staffName']").attr("value", $selections.find("td.staffName").text());
        $("input[name='staffSex']").attr("value",$selections.find("td.staffSex").text());
        $("input[name='staffBirthday']").attr("value", $selections.find("td.staffAge").text());
        $("input[name='staffPos']").attr("value", $selections.find("td.staffPos").text());
        $("input[name='staffIdenty']").attr("value", $selections.find("td.staffId").text());
        $("input[name='staffTel']").attr("value", $selections.find("td.staffTel").text());
        $("input[name='staffObJob']").text($selections.find("td.staffOnJob").text());
        $("input[name='staffMark']").attr("value", $selections.find("td.staffMark").text());
        var options = {
            title: "修改商品信息"
        };
        $("#staff_btn_submit").attr("data-action", "UG");
        POPOVER.open(options);

    });

    //删除员工
    $(".employee_table>table>tbody").on("click", "tr>td.rowOper>button.row_delete", function(e){
        var $selections = $(this).parent("td.rowOper").parent();
        Ewin.confirm({message: "确定删除员工信息?"}).on(function(status){
            if(status) {
                $selections.remove();
                var rowNo = 1;
                $(".employee_table>table>tbody>tr").each(function(i){
                    $(this).find("td.staffNo").text(rowNo);
                    rowNo = rowNo + 1;
                });
            }
        });
    });

    ///////////////////////////订单管理///////////////////////////////////
    /**
     * 订单查询
     */
    $(".order_management .search_button").click(function(e){
        var queryParam = {
            "orderNum": $("#con_order_number").val(),
            "userMes": $("#con_vip_info").val(),
            "epyMes": $("#con_staff_info").val()
        };
        var payMode = $("#order_paymode_select").val();
        if(payMode == "会员卡") {
            queryParam.payMode = "1";
        } else if (payMode == "现金") {
            queryParam.payMode = "2";
        } else if(payMode == "积分") {
            queryParam.payMode = "3";
        }
        $.ajax({
            url: serverHost + "/getorder",
            type: "get",
            data: queryParam,
            dataType: "json",
            success: function(resp) {
                try{
                    if(resp.ret == "SUCCESS") {
                        renderOrderMgrTable(resp.dat);
                    } else {
                        toastr.options.positionClass = 'toast-top-center';
                        toastr.error("查询失败");
                    }
                }catch (e) {
                }
            },
            error: function(jqXHR, textStatus, exp) {
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });

    //订单冲抵 todo

    ///////////////////////////////会员管理系统//////////////////////////
    //删除会员信息
    $(document).on("click", ".vip_table_body>tr>td.rowOper>button.row_delete", function(e){
        var $selectRow = $(this).parent("td.rowOper").parent();
        var param = {
            "userId": $selectRow.find("td.vipUserNo").text()
        };
        Ewin.confirm({message: "确定删除吗？"}).on(function(status){
            if(status) {
                $.ajax({
                    url: serverHost + "/deluser",
                    type: "post",
                    data: param,
                    dataType: "json",
                    success: function(resp){
                        if(resp.ret == "SUCCESS") {
                            $selectRow.remove();
                            toastr.options.positionClass = 'toast-top-center';
                            toastr.success("删除成功");
                        } else {
                            toastr.options.positionClass = 'toast-top-center';
                            toastr.error("删除失败");
                        }
                    },
                    error: function(jqXHR, textStatus, thrownExp) {
                        toastr.options.positionClass = 'toast-top-center';
                        toastr.error("服务异常");
                    }
                });
            }
        });
    });

    //更新会员信息
    $(document).on("click", ".vip_table_body>tr>td.rowOper>button.row_update", function(e){
        var options = {
            title: "*更新会员信息*"
        };
        var $selectRow = $(this).parent("td.rowOper").parent();
        $selectRow.addClass("update_row_vip");
        $("input[name='vipUserName']").val($selectRow.find("td.vipUserName").text());
        $("#vipUserSex").val($selectRow.find("td.vipUserSex").text());
        $("input[name='vipUserTel']").val($selectRow.find("td.vipUserTel").text());
        $("input[name='vipRegTime']").val($selectRow.find("td.vipRegTime").text());
        $("input[name='vipConsumeSum']").val($selectRow.find("td.vipConsumeSum").text());
        $("input[name='vipIntegral']").val($selectRow.find("td.vipIntegral").text());
        $("input[name='vipBalance']").val($selectRow.find("td.vipBalance").text());
        $("#vipUserStatus").val($selectRow.find("td.vipUserStatus").text());

        $("#vip_btn_submit").attr("data-action", "UV");
        POPOVER.open(options);
    });

    //新增会员
    $(".vip_management .add_button").click(function(e){
        e.preventDefault();
        var options = {
            title: "*新增会员信息*"
        };
        $("#vip_btn_submit").attr("data-action", "AV");
        POPOVER.open(options);
    });

    //提交确定更新会员信息
    $("#vip_btn_submit").click(function(e){
        var user = {
            "userName": $("input[name='vipUserName']").val(),
            "userSex": $("#vipUserSex option:selected").text(),
            "userContact": $("input[name='vipUserTel']").val(),
            "userRegisterTime": $("input[name='vipRegTime']").val(),
            "userSumConsum": $("input[name='vipConsumeSum']").val(),
            "userIntegral": $("input[name='vipIntegral']").val(),
            "userBalance": $("input[name='vipBalance']").val(),
            "userStatus": $("#vipUserStatus option:selected").text()
        };
        var action = $("#vip_btn_submit").attr("data-action");
        $.ajax({
            url: serverHost + "/adduser",
            type: "post",
            data: user,
            dataType: "json",
            success: function(resp) {
                if(resp.ret == "SUCCESS") {
                    if(action == "AV") {
                        renderVIPUserInfo(user);
                    } else if(action == "UV") {
                        updateVIPUserInfo(user);
                    }
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("添加成功");
                } else {
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("添加失败");
                }
            },
            error: function(jqXHR, textStatus, exp) {
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });
    //查询会员
    $(".vip_management .query_opera .search_button").click(function(){
        var queryParam = {
            "userName": $("#con_vip_name").val(),
            "phone": $("#con_vip_tel").val(),
            "regStart": $("#con_reg_startdate").val(),
            "regEnd": $("#con_reg_enddate").val()
        };

        $.ajax({
            url: serverHost + "/users",
            type: "get",
            data: queryParam,
            dataType: "json",
            success: function(resp){
                if(resp.ret == "SUCCESS"){
                    $(".vip_table>table>tbody").empty();
                    var vipList = resp.dat;
                    renderVIPTableInfo(vipList);
                } else {
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("查询会员信息失败");
                }
            },
            error: function(jqXHR, textStatus, exp) {
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });

    ////////////////////////////////报表中心///////////////////////////////
    //报表中心Tab切换
    $("ul.sm-report-nav li a").click(function(){
        $("ul.sm-report-nav li").removeClass("active");
        $(this).parent().addClass("active");
        $(".report-content").hide();
        var activeTab = $(this).attr("href");
        $(activeTab).fadeIn();
        return false;
    });

    //当月新增会员
    $("a[href='#sm_new_vip']").click(function(e){
        //clear exist data
        $("#sm_new_vip").find("tbody").empty();
        //call api to get current month vip number
        var myDate = new Date();
        var yearMon = "" + myDate.getFullYear() + "-" + ((myDate.getMonth() + 1) < 10?
            "0"+(myDate.getMonth() + 1):""+(myDate.getMonth() + 1));
        $.ajax({
            url: serverHost + "/uincrease?month=" + yearMon,
            type: "get",
            data:{},
            dataType: "json",
            success: function(resp) {
                if(resp.ret == "SUCCESS") {
                    var user = resp.dat.user;
                    $("a[href='#sm_new_vip']").find("span").text(resp.dat.total);
                    if(user.length == 0) {
                        $("#sm_new_vip").find("tbody").css("height", "123px");
                        $("#sm_new_vip").find("tbody").html("无数据");
                    } else {
                        var rowNo = 1;
                        $.each(resp.dat.user, function(i, obj){
                            var strHtml = "<tr>"
                                + "<td>" + rowNo + "</td>"
                                + "<td>" + obj.userName + "</td>"
                                + "<td>" + obj.userSex + "</td>"
                                + "<td>" + obj.userContact + "</td>"
                                + "<td>" + obj.userRegisterTime + "</td>"
                                + "<td>" + obj.userRecentConsumTime + "</td>"
                                + "<td>" + obj.userSumConsum + "</td>"
                                + "<td>" + obj.userIntegral + "</td>"
                                + "<td>" + obj.userBalance + "</td>"
                                + "</tr>";
                            $("#sm_new_vip").find("tbody").append(strHtml);
                            rowNo = rowNo + 1;
                        });
                    }
                } else {
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("数据加载失败");
                }
            },
            error: function(jqXHR, textResp, exp) {
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });
    //新增会员比例
    $("a[href='#sm_month_vip_percent']").click(function(){
        $("#sm_month_vip_percent tbody").empty();
        //获取当月消费会员比例
        $.ajax({
            url: serverHost + "/consumrate",
            type: "get",
            data: {},
            dataType: "json",
            success: function(resp) {
                if(resp.ret == "SUCCESS") {
                    var user = resp.dat.user;
                    $("a[href='#sm_month_vip_percent']").find("span").text(resp.dat.rate);
                    if(user.length == 0) {
                        $("#sm_month_vip_percent table")
                            .after("<div class='empty_hint' style='height: 123px'>无&nbsp;数&nbsp;据</div>");
                    } else {
                        var rowNo = 1;
                        strHtml = "";
                        $.each(user, function(i, n){
                            strHtml = "<tr>"
                            + "<td>" + user.userName + "</td>"
                            + "<td>" + user.userSex + "</td>"
                            + "<td>" + user.userContact + "</td>"
                            + "<td>" + user.userRegisterTime + "</td>"
                            + "<td>" + user.userRecentConsumTime + "</td>"
                            + "<td>" + user.userSumConsum + "</td>"
                            + "<td>" + user.userIntegral + "</td>"
                            + "<td>" + user.userBalance + "</td>"
                            + "<td>" + user.userStatus + "</td>" + "</tr>";
                            $("#sm_month_vip_percent tbody").append(strHtml);
                        });
                    }
                } else {
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("获取数据失败");
                }
            },
            error: function(jqXHR, textStatus, exp){
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });
    //近半年未消费会员
    $("a[href='#half_year_notshow_vip']").click(function(){
        $("#half_year_notshow_vip tbody").empty();
        //获取当月消费会员比例
        $.ajax({
            url: serverHost + "/unconsume",
            type: "get",
            data: {},
            dataType: "json",
            success: function(resp) {
                if(resp.ret == "SUCCESS") {
                    var user = resp.dat.user;
                    $("a[href='#half_year_notshow_vip']").find("span").text(resp.dat.total);
                    if(user.length == 0) {
                        $("#half_year_notshow_vip table")
                            .after("<div class='empty_hint' style='height: 123px'>无&nbsp;数&nbsp;据</div>");
                    } else {
                        var rowNo = 1;
                        strHtml = "";
                        $.each(user, function(i, n){
                            strHtml = "<tr>"
                            + "<td>" + n.userName + "</td>"
                            + "<td>" + n.userSex + "</td>"
                            + "<td>" + n.userContact + "</td>"
                            + "<td>" + n.userRegisterTime + "</td>"
                            + "<td>" + n.userRecentConsumTime + "</td>"
                            + "<td>" + n.userSumConsum + "</td>"
                            + "<td>" + n.userIntegral + "</td>"
                            + "<td>" + n.userBalance + "</td>"
                            + "<td>" + (n.userStatus == '1' ? '正常':'禁用') + "</td>" + "</tr>";
                            $("#half_year_notshow_vip tbody").append(strHtml);
                        });
                    }
                }else{
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("数据加载失败");
                }
            },
            error: function(jqXHR, textStatus, exp){
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });
    //员工提成比例
    $("a[href='#deduct_percent']").click(function(){
        $("#deduct_percent tbody").empty();
        //员工提成比例
        var date = new Date();
        var yearMon = date.getFullYear() + "-" +
            (date.getMonth() < 10? "0"+date.getMonth():""+date.getMonth());
        $.ajax({
            url: serverHost + "/commrate?month=" + yearMon,
            type: "get",
            data: {},
            dataType: "json",
            success: function(resp) {
                if(resp.ret == "SUCCESS") {
                    var commission = resp.dat.commission;
                    $("a[href='#deduct_percent']").find("span").text(resp.dat.rate);
                    if(commission.length == 0) {
                        $("#deduct_percent table")
                            .after("<div class='empty_hint' style='height: 123px'>无&nbsp;数&nbsp;据</div>");
                    } else {
                        var rowNo = 1;
                        strHtml = "";
                        $.each(user, function(i, n){
                            strHtml = "<tr>"
                            + "<td>" + n.cmdyName + "</td>"
                            + "<td>" + n.pkgName + "</td>"
                            + "<td>" + n.cmsiMethod + "</td>"
                            + "<td>" + n.cmsiPrice + "</td>"
                            + "<td>" + n.cmsiRate + "</td></tr>";
                            $("#deduct_percent tbody").append(strHtml);
                        });
                    }
                } else {
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("数据加载失败");
                }
            },
            error: function(jqXHR, textStatus, exp){
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });

    //热销商品排行榜
    $("a[href='#best_selling']").click(function(){
        $("#best_selling tbody").empty();
        //员工提成比例
        var date = new Date();
        var yearMon = date.getFullYear() + "-" +
            (date.getMonth() < 10? "0"+date.getMonth():""+date.getMonth());
        $.ajax({
            url: serverHost + "/commrate?month=" + yearMon,
            type: "get",
            async: false,
            data: {},
            dataType: "json",
            success: function(resp) {
                if(resp.ret == "SUCCESS") {
                    var commission = resp.dat.commission;
                    if(commission.length == 0) {
                        $("#best_selling table")
                            .after("<div class='empty_hint' style='height: 123px'>无&nbsp;数&nbsp;据</div>");
                    } else {
                        var rowNo = 1;
                        strHtml = "";
                        $.each(user, function(i, n){
                            strHtml = "<tr>"
                            + "<td>" + n.cmdyName + "</td>"
                            + "<td>" + n.pkgName + "</td>"
                            + "<td>" + n.cmsiMethod + "</td>"
                            + "<td>" + n.cmsiPrice + "</td>"
                            + "<td>" + n.cmsiRate + "</td></tr>";
                            $("#best_selling tbody").append(strHtml);
                        });
                    }
                } else{
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("数据加载失败");
                }
            },
            error: function(jqXHR, textStatus, exp){
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        });
    });
});


//添加一行到商品表格中
function addNewRowGoodsHtml(newGoodsInfo) {
    var $lastRowEle = $(".goods_table>table>tbody>tr").last();
    var lastRowNo = $lastRowEle.find(".goodsNo");
    var strHtml = "<tr>";
    strHtml += "<td class='goodsNo'>" + (parseInt(lastRowNo) + 1) + "</td>";
    strHtml += "<td style='width: 82px; height:37px; overflow: hidden;' class='goodsName'>" + newGoodsInfo.cmdyName + "</td>";
    strHtml += "<td class='goodsUnitPrice'>" + newGoodsInfo.cmdyUprice + "</td>";
    strHtml += "<td class='goodsCost'>" + newGoodsInfo.cmdyCost + "</td>";
    strHtml += "<td class='goodsUnit'>" + newGoodsInfo.cmdyUnit + "</td>";
    strHtml += "<td class='goodsRate'>" + newGoodsInfo.promRate + "</td>";
    strHtml += "<td class='goodsCate'>" + newGoodsInfo.goodsCate + "</td>";
    strHtml += "<td class='deductWays'>" + newGoodsInfo.cmsiMethod + "</td>";
    strHtml += "<td class='deductMoney'>" + newGoodsInfo.cmsiMoney + "</td>";
    strHtml += "<td class='deductRate'>" + newGoodsInfo.cmsiRate + "</td>";
    strHtml += "<td class='goodsMark'>" + newGoodsInfo.cmdyRemark + "</td>";
    strHtml += "<td class='rowOper'>"
                + "<button type='button' class='btn btn-default row_update' style='padding: 4px 8px;'>X删除</button>"
                + "<button type='button' class='btn btn-default row_delete' style='padding: 4px 8px;'>修改</button>"
                + "</td>";
    strHtml += "</tr>";
    $(".goods_table>table>tbody").append(strHtml);
}

/**
 * 更新某一行商品的信息
 * @param newGoodsInfo
 */
function updateRowGoodsHtml(newGoodsInfo) {
    var $updateRow = $(".goods_table>table>tbody>tr.update_row_goods");
    $updateRow.find("td.goodsName").text(newGoodsInfo.cmdyName);
    $updateRow.find("td.goodsUnitPrice").text(newGoodsInfo.cmdyUprice);
    $updateRow.find("td.goodsCost").text(newGoodsInfo.cmdyCost);
    $updateRow.find("td.goodsUnit").text(newGoodsInfo.cmdyUnit);
    $updateRow.find("td.goodsRate").text(newGoodsInfo.promRate);
    $updateRow.find("td.goodsCate").text(newGoodsInfo.goodsCate);
    $updateRow.find("td.deductWays").text(newGoodsInfo.cmsiMethod);
    $updateRow.find("td.deductMoney").text(newGoodsInfo.cmsiMoney);
    $updateRow.find("td.deductRate").text(newGoodsInfo.cmsiRate);
    $updateRow.find("td.goodsMark").text(newGoodsInfo.cmdyRemark);
}

/**
 * 添加新的一行员工信息
 */
function addNewEmployeeRowHtml(newEmployee) {
    var $lastRowEle = $(".employee_table>table>tbody>tr").last();
    var lastRowNo = $lastRowEle.find(".staffNo");
    var strHtml = "<tr>";
    var rowOperCol = "<td class='rowOper'>"
                    + "<button type='button' class='btn btn-default row_delete'>删除</button>"
                    + "<button type='button' class='btn btn-default row_update'>修改</button>"
                    + "</td>";
    strHtml += "<td class='staffNo'>" + (parseInt(lastRowNo) + 1) + "</td>";
    strHtml += "<td class='staffName'>" + (newEmployee.epyName!=null?newEmployee.epyName:"") + "</td>";
    strHtml += "<td class='staffSex'>" + (newEmployee.epySex!=null?newEmployee.epySex:"") + "</td>";
    strHtml += "<td class='staffAge'>" + (newEmployee.epyBirthday!=null?newEmployee.epyBirthday:"") + "</td>";
    strHtml += "<td class='staffPos'>" + (newEmployee.epyPosition!=null?newEmployee.epyPosition:"") + "</td>";
    strHtml += "<td class='staffId'>" + (newEmployee.epyIdentity!=null?newEmployee.epyIdentity:"") + "</td>";
    strHtml += "<td class='staffTel'>" + (newEmployee.epyContact!=null?newEmployee.epyContact:"") + "</td>";
    strHtml += "<td class='staffOnJob'>" + (newEmployee.epyOnjob!=null?newEmployee.epyOnjob:"") + "</td>";
    strHtml += "<td class='staffMark'>" + (newEmployee.epyRemark!=null?newEmployee.epyRemark:"") + "</td>";
    strHtml += rowOperCol;
    strHtml += "</tr>";
    $(".goods_table>table>tbody").append(strHtml);
}

//更新员工信息
function updateEmployeeRowHtml(newEmployee) {
    var $updateRow = $(".employee_table tr.update_staff_row");
    $updateRow.find("td.staffName").text(newEmployee.epyName);
    $updateRow.find("td.staffSex").text(newEmployee.epySex);
    $updateRow.find("td.staffAge").text(newEmployee.epyBirthday);
    $updateRow.find("td.staffPos").text(newEmployee.epyPosition);
    $updateRow.find("td.staffId").text(newEmployee.epyIdentity);
    $updateRow.find("td.staffTel").text(newEmployee.epyContact);
    $updateRow.find("td.staffOnJob").text(newEmployee.epyOnjob);
    $updateRow.find("td.staffMark").text(newEmployee.epyRemark);
    $updateRow.removeClass("update_staff_row");
}

function renderVIPUserInfo(user) {
    var strHtml = "";
    strHtml = "<tr>"
    + "<td class='vipUserNo' style='display: none;'></td>"
    + "<td class='vipUserName'>" + user.userName + "</td>"
    + "<td class='vipUserSex'>" + user.userSex + "</td>"
    + "<td class='vipUserTel'>" + user.userContact + "</td>"
    + "<td class='vipRegTime'>" + user.userRegisterTime + "</td>"
    + "<td class='vipConsumeSum'>" + user.userSumConsum + "</td>"
    + "<td class='vipIntegral'>" + user.userIntegral + "</td>"
    + "<td class='vipBalance'>" + user.userBalance + "</td>"
    + "<td class='vipUserStatus'>" + user.userStatus + "</td>"
    + "<td class='rowOper'>"
    + "<button type='button' class='btn btn-primary row_delete'>删除</button>"
    + "<button type='button' class='btn btn-primary row_update'>更新</button>"
    + "</td>"
    + "</tr>";
    $(".vip_table_body").append(strHtml);
}
function updateVIPUserInfo(user) {
    var $selectRow = $(".vip_table_body").find("tr.update_row_vip");
    $selectRow.find("td.vipUserName").text(user.userName);
    $selectRow.find("td.vipUserSex").text(user.userSex);
    $selectRow.find("td.vipUserTel").text(user.userContact);
    $selectRow.find("td.vipRegTime").text(user.userRegisterTime);
    $selectRow.find("td.vipConsumeSum").text(user.userSumConsum);
    $selectRow.find("td.vipIntegral").text(user.userIntegral);
    $selectRow.find("td.vipBalance").text(user.userBalance);
    $selectRow.find("td.vipUserStatus").text(user.userStatus);
    $selectRow.removeClass("update_row_vip");
}

/**
 * 初始化我的桌面数据
 */
function initMyDeskData() {
    var dateArray = [];
    var turnoverData = [];
    var consumerDateArray = [];
    var consumerData = [];
    //send ajax to get mydesk data
    $.ajax({
        url: serverHost + "/home",
        type: "get",
        async : false,
        data:{},
        dataType: "json",
        success: function(result) {
            try {
                var ret = result.ret;
                if (ret == "SUCCESS")
                {
                    renderKPIData(result.dat);
                    $.each(result.dat.turnoverChart, function(key, value) {
                        dateArray.push(key);
                        turnoverData.push(value);
                    });

                    $.each(result.dat.consumberChart, function (key, value) {
                        consumerDateArray.push(key);
                        consumerData.push(value);
                    });

                } else {
                    initMyDeskErrorHandle();
                }
            } catch (e) {
                initMyDeskErrorHandle();
            }
        },
        error: function(errorMsg) {
            alert(errorMsg);
        },
        complete: function() {
            //default show turnover chart info
            geneTurnOverBarChart(dateArray, turnoverData);
            geneConsumerBarChart(consumerDateArray, consumerData);
            $("#turnover-chart").show();
        }
    });
}

function renderKPIData(data) {
    //营业额
    var $revenueElement =  $(".total_revenue").find("ul:eq(1)").find("li");
    $revenueElement.eq(0).text((data.todayKPI.intradayTurnover != undefined
    && data.todayKPI.intradayTurnover != null
    && data.todayKPI.intradayTurnover != "") ? data.todayKPI.intradayTurnover: "-");
    $revenueElement.eq(1).text(data.todayKPI.yesterdayTurnover);
    $revenueElement.eq(2).text(data.todayKPI.weekTurnover);
    $revenueElement.eq(3).text(data.todayKPI.monthTurover);

    //客单数
    var $consumerElement =  $(".consumer_num").find("ul:eq(1)").find("li");
    $consumerElement.eq(0).text(data.todayKPI.orderNum);
    $consumerElement.eq(1).text(data.todayKPI.yesterdayOrderNum);
    $consumerElement.eq(2).text(data.todayKPI.weekOrderNum);
    $consumerElement.eq(3).text(data.todayKPI.monthOrderNum);

    //支付方式
    var $payWaysElement =  $(".payment-ways").find("ul:eq(1)").find("li");
    $payWaysElement.eq(1).text(data.todayKPI.cardTurnover);
    $payWaysElement.eq(2).text(data.todayKPI.cashTurnover);
    $payWaysElement.eq(3).text(data.todayKPI.integralTurnover);
}

function initMyDeskErrorHandle() {

}

//获取消费管理信息
function initConsumerMgrInfo() {
    //send ajax to get goods list
    $.ajax({
        url: serverHost + "/commcate",
        type: "get",
        async : false,
        data:{},
        dataType: "json",
        success: function(result) {
            try{
                if(result.ret == "SUCCESS") {
                    var goodsLst = result.dat.commodity;
                    renderGoodsCategoryTab(goodsLst);
                    initEmployeeSelectList(result.dat.employee);
                }
            }catch(e) {

            }
        }
    });

    $(".order-info tbody.order_list").css("height", "148px");
    $(".order-info tbody.order_list").css("width", "150px");
    $(".order-info tbody.order_list").html("");
    $(".order-info .empty_hint").html("从右边添加商品");
    $(".order_settle .order_nums").html("00"); //数量清0
    $(".order_settle .total_amt").html("00"); //数量清0
    //获取系统当前时间
    $(".order_settle .order_date").text(getSystemCurDateTime());
    $(".order_settle .order_no").text("00000000000000");

}

function orderSettleHtml(){ //new html
    var strHtml = "";
    strHtml += "<div class='order_settle'>"
    + "<table class='table'>"
    + "<tr>"
    + "<td>顾客： <input type='text' name='consumer'>"
    + "</td>";
    strHtml += "<td>员工："
    + "<select class='employee'><option>张三</option></select>"
    + "</td>"
    + "</tr>"
    + "<tr style='border-bottom: hidden;'>"
    + "<td>单号：<span class='order_no'></span></td>"
    + "<td>时间：<span class='order_date'></span></td>"
    + "</tr>"
    + "<tr style='border-bottom: hidden;'>"
    + "<td>已选数量：<span class='order_nums'>0</span></td>"
    + "<td>合计金额：<span class='total_amt'>0.00</span></td>"
    + "</tr>"
    + "</table>"
    + "</div>";
    return strHtml;
}
/**
 * 订单管理中的员工列表
 * @param emploeeLst
 */
function initEmployeeSelectList(emploeeLst) {
    $("#employee").empty();
    $.each(emploeeLst, function(i){
        $("#employee").appendChild("<option>" + emploeeLst[i] + "</option>");
    });
}

//function initGoods
//render the Tab
function renderGoodsCategoryTab(commodity) {
    $(".ms-right .cates_tabs").empty();
    $(".ms-right .tab_content").replaceWith(""); //clear the existed data
    var liIndex = 0;
    $.each(commodity, function(key, value){
        var hrefLink = key.split("-")[1];
        var cateName = key.split("-")[0];
        if(liIndex == 0)
        {
            $(".ms-right .cates_tabs").append("<li class='current'>" +
                                     "<a href='#" + hrefLink + "' class='btn btn-primary'>" +
                                       cateName +
                                     "</a>" +
                                     "</li>");
        } else {
            $(".ms-right .cates_tabs").append("<li>" +
                "<a href='#" + hrefLink + "' class='btn btn-primary'>" +
                   cateName +
                "</a>" +
                "</li>");
        }
        liIndex++;
        //获取当前类别下的所有商品
        if($.isArray(value))
        {
            var rowHtml = "";
            var allRowHtml = "";
            var goodsRowStartHtml = "<div class='category_row'>";
            var goodsRowEndtHtml = "</div>";
            var countObj = 0;
            $.each(value, function(i, obj){
                var goodsObj = {};
                if(hrefLink == "Category0") {
                    //套餐类,字段名称有不同
                    goodsObj.cmdyName = obj.pkgName;
                    goodsObj.cmdyUprice = obj.pkgPrice;
                    goodsObj.promRate = obj.promRate;
                } else {
                    goodsObj = obj;
                }
                rowHtml += createGoodsInfoNode(goodsObj);
                if(countObj == 2) {//每一行三个
                    allRowHtml += goodsRowStartHtml + rowHtml + goodsRowEndtHtml;
                    rowHtml = "";
                    countObj = 0;
                    return true;
                }
                countObj = countObj + 1;
            });
            allRowHtml = (allRowHtml != "")?
                allRowHtml:(goodsRowStartHtml + rowHtml + goodsRowEndtHtml);
            var $tabConent = $(".ms-right .tab_content");
            if($tabConent.length == 0) {
                $(".ms-right>ul").after("<div id='" + hrefLink + "' class='tab_content'>" + allRowHtml + "</div>");
            } else {
                $(".ms-right .tab_content").last().after("<div id='" + hrefLink +
                                        "' class='tab_content'>" + allRowHtml + "</div>");
            }
        }
    });
}

//创建商品详情节点
function createGoodsInfoNode(goodsInfoObj) {
    var strhtml = "";
    strhtml += "<div class='goods_desc'>"; //start
    strhtml += "<h5 class='cmdyName'>" + goodsInfoObj.cmdyName + "</h5>";
    strhtml += "<p class='cmdyUprice'>" + goodsInfoObj.cmdyUprice + "</p>";
    //折扣
    strhtml += "<p class='promRate ms_hidden'>" + goodsInfoObj.promRate + "%</p>" + "</div>"; //end
    return strhtml;
}

/**
 * 初始化商品管理信息
 */
function initGoodsMgrInfo(){
    //获取新增会员
    $(".goods_tabs_content").hide();
    $(".ul.goods_tabs_nav li").removeClass("activeTab");
    $("ul.goods_tabs_nav li:first").addClass("activeTab").show();
    $(".goods_tabs_content:first").show();

    $.ajax({
        url: serverHost + "/commodity?sign=1",
        type: "get",
        data:{},
        dataType: "json",
        success: function(resp) {
            if(resp.ret == "SUCCESS") {
                var cate = resp.dat.category;
                $("#con_goods_cate").empty();
                    $.each(cate, function(index, obj) { //商品类别
                    $("#con_goods_cate").append("<option data-cateid='" + cate[index].cmdycateId + "'>" + cate[index].cmdycateName + "</option>");
                    $("#selectGoodsCate").append("<option data-cateid='" + cate[index].cmdycateId + "'>" + cate[index].cmdycateName + "</option>");
                });

                //初始化商品表
                var commondityLst = resp.dat.commodity;
                var rowNo = 1;
                $(".goods_table>table>tbody").empty();
                $.each(commondityLst, function(i, n) { //商品列表
                    $(".goods_table>table>tbody").append("<tr>"
                    + "<td class='goodsNo' style='text-align: left'>" + rowNo + "</td>"
                    + "<td class='goodsName'>" + n.cmdyName + "</td>"
                    + "<td class='goodsUnitPrice'>" + n.cmdyUprice + "</td>"
                    + "<td class='goodsCost'>" + n.cmdyCost + "</td>"
                    + "<td class='goodsUnit'>" + n.cmdyUnit + "</td>"
                    + "<td class='goodsDeduct'>" + n.promRate + "</td>"
                    + "<td class='goodsCate'>" + n.cmdyCategory + "</td>"
                    + "<td class='deductWays'>" + n.cmsiMethod + "</td>"
                    + "<td class='deductMoney'>" + n.cmsiMoney + "</td>"
                    + "<td class='deductRate'>" + n.cmsiRate + "</td>"
                    + "<td class='goodsMark'>" + n.cmdyRemark + "</td>"
                    + "<td class='rowOper'>"
                    + "<button type='button' class='btn btn-default row_delete' style='padding: 4px 8px;'>删除</button>"
                    + "<button type='button' class='btn btn-default row_update' style='padding: 4px 8px;'>更新</button>"
                    + "</td>"
                    + "</tr>");
                    rowNo = rowNo + 1;
                });
            } else {
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("获取商品列表失败");
            }
        },
        error: function(msg) {
            toastr.options.positionClass = 'toast-top-center';
            toastr.error("服务异常");
        }
    });
}

/**
 * 初始化员工管理信息
 */
function initEmployeeMgrInfo() {
    $(".employee_table>table>tbody").empty();
    $.ajax({
        url: serverHost + "/employee",
        type: "get",
        data:{},
        dataType: "json",
        success: function(resp) {
            if(resp.ret == "SUCCESS") {
                //初始化员工表
                var staffLst = resp.dat;
                renderEmployeeTable(staffLst);
            } else {
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("获取员工信息失败");
            }
        },
        error: function(msg) {
            toastr.options.positionClass = 'toast-top-center';
            toastr.error("服务异常");
        }
    });
}

function renderEmployeeTable(staffLst) {
    $(".employee_table>table>tbody").empty();
    $.each(staffLst, function(i, n) {
        var isOnJob = null;
        if(n.epyOnjob == "1") {
            isOnJob = "在职";
        } else if(n.epyOnjob == "2") {
            isOnJob = "休假";
        } else if(n.epyOnjob == "3") {
            isOnJob = "离职";
        }
        $(".employee_table>table>tbody").append("<tr>"
            + "<td class='staffNo' style='text-align: left'>" + n.epyId + "</td>"
            + "<td class='staffName'>" + n.epyName + "</td>"
            + "<td class='staffSex'>" + n.epySex + "</td>"
            + "<td class='staffAge'>" + n.epyBirthday + "</td>"
            + "<td class='staffPos'>" + n.epyPosition + "</td>"
            + "<td class='staffId'>" + n.epyIdentity + "</td>"
            + "<td class='staffTel'>" + n.epyContact + "</td>"
            + "<td class='staffOnJob'>" + isOnJob + "</td>"
            + "<td class='staffMark'>" + n.epyRemark + "</td>"
            + "<td class='rowOper'>"
            + "<button type='button' class='btn btn-primary row_delete' style='padding: 4px 8px;'>删除</button>"
            + "<button type='button' class='btn btn-primary row_update' style='padding: 4px 8px;'>修改</button>"
            + "</td>"
            + "</tr>");
    });
}

/**
 * 订单管理界面初始化
 */
function initOrderManagement() {
    $(".ordermgr_table>table>tbody").empty();
    $.ajax({
        url: serverHost + "/getorder",
        type: "get",
        //async: false,
        data: {},
        dataType: "json",
        success: function(resp) {
            try{
                if(resp.ret == "SUCCESS") {
                    renderOrderMgrTable(resp.dat);
                } else {
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("获取订单信息失败");
                }
            }catch (e) {
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("服务异常");
            }
        }
    });
}
//加载订单管理表
function renderOrderMgrTable(data) {
    $(".ordermgr_table>table>tbody").empty();
    if(data.length == 0) {
        $(".ordermgr_table .empty_hint").html("无查询结果").show();
        return;
    }
    $.each(data, function(i, o) {
        var payMode = ""
        if("1" == o.orderPaymode) {
            payMode = "会员卡";
        } else if("2" == o.orderPaymode) {
            payMode = "现金";
        } else if("3" == o.orderPaymode) {
            payMode = "积分";
        }
        var strHtml = "";
        strHtml = "<tr>"
        + "<td class='orderNo'>" + o.orderNum + "</td>"
        + "<td class='userName'>" + o.userName + "</td>"
        + "<td class='userContact'>" + o.userContact + "</td>"
        + "<td class='orderPrice'>" + o.orderPrice + "</td>"
        + "<td class='commitTime'>" + o.orderCommitTime + "</td>"
        + "<td class='empName'>" + o.epyName + "</td>"
        + "<td class='payTime'>" + o.orderPaytime + "</td>"
        + "<td class='payMode'>" + payMode + "</td>"
        + "<td class='rowOper'>"
        + "<button type='button' class='btn btn-primary orderRect'>订单冲抵</button>"
        + "</td>"
        + "</tr>";
        $(".ordermgr_table>table>tbody").append(strHtml);
    });
}

/**
 * 初始化报表中心
 */
function initReportCenter() {
    //获取新增会员
    $(".report-content").hide();
    $("ul.sm-report-nav li:first").addClass("active").show();
    $(".report-content:first").show();

    //clear exist data
    $("#sm_new_vip").find("tbody").empty();
    //call api to get current month vip number
    var myDate = new Date();
    var yearMon = "" + myDate.getFullYear() + "-" + ((myDate.getMonth() + 1) < 10?
        "0"+(myDate.getMonth() + 1):""+(myDate.getMonth() + 1));
    $.ajax({
        url: serverHost + "/uincrease?month=" + yearMon,
        type: "get",
        async: false,
        data:{},
        dataType: "json",
        success: function(resp) {
            if(resp.ret == "SUCCESS") {
                var user = resp.dat.user;
                if(user.length == 0) {
                    $("#sm_new_vip").find("tbody").css("height", "123px");
                    $("#sm_new_vip").find("tbody").html("无数据");
                } else {
                    var rowNo = 1;
                    $.each(resp.dat.user, function(i, obj){
                        var strHtml = "<tr>"
                            + "<td>" + rowNo + "</td>"
                            + "<td>" + obj.userName + "</td>"
                            + "<td>" + obj.userSex + "</td>"
                            + "<td>" + obj.userContact + "</td>"
                            + "<td>" + obj.userRegisterTime + "</td>"
                            + "<td>" + obj.userRecentConsumTime + "</td>"
                            + "<td>" + obj.userSumConsum + "</td>"
                            + "<td>" + obj.userIntegral + "</td>"
                            + "<td>" + obj.userBalance + "</td>"
                            + "</tr>";
                        $("#sm_new_vip").find("tbody").append(strHtml);
                        rowNo = rowNo + 1;
                    });
                }
            } else {
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("数据加载失败");
            }
        },
        error: function(jqXHR, textResp, exp) {
            toastr.options.positionClass = 'toast-top-center';
            toastr.error("服务异常");
        }
    });
}

function initVIPMgrInfo(){
    $.ajax({
        url: serverHost + "/users",
        type: "get",
        data:{},
        dataType: "json",
        success: function(resp){
            if(resp.ret == "SUCCESS"){
                $(".vip_table>table>tbody").empty();
                var vipList = resp.dat;
                renderVIPTableInfo(vipList);
            } else{
                toastr.options.positionClass = 'toast-top-center';
                toastr.error("获取会员信息失败");
            }
        },
        error: function(jqXHR, textStatus, exp){
            toastr.options.positionClass = 'toast-top-center';
            toastr.error("服务异常");
        }
    });
}

function renderVIPTableInfo(vipList){
    $.each(vipList, function(i, n){
        $(".vip_table>table>tbody").append("<tr>" +
        "<td class='vipName'>" + n.userName + "</td>" +
        "<td class='vipSex'>" + n.userSex + "</td>" +
        "<td class='vipContact'>" + n.userContact + "</td>" +
        "<td class='vipRegisterTime'>" + n.userRegisterTime + "</td>" +
        "<td class='vipRecentConsumTime'>" + n.userRecentConsumTime + "</td>" +
        "<td class='vipSumConsum'>" + n.userSumConsum + "</td>" +
        "<td class='vipIntegral'>" + n.userIntegral + "</td>" +
        "<td class='vipBalance'>" + n.userBalance + "</td>" +
        "<td class='vipStatus'>" + n.userStatus + "</td>" +
        "<td class='rowOper'>" +
            "<button type='button' class='btn btn-primary row_delete'>删除</button>" +
            "<button type='button' class='btn btn-primary row_update'>更新</button>" +
        "</td>" +
        "</tr>");
    });
}

/**
 * 绘制图表
 * @param dateArray
 * @param dataArray
 */
//绘制图表
function geneTurnOverBarChart(dateArray, dataArray) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('turnover-chart'));
    // 指定图表的配置项和数据
    var option = {
        // 标题
        title: {
            text: "营业额",
            left: 'center'
        },
        color: ['#3398DB'],
        // 工具箱
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        // x轴
        xAxis: {
            //data: ['2017.12.21', '2017.12.22', '2017.12.23',
            //    '2017.12.24', '2017.12.25', '2017.12.26', '2017.12.27'],
            name: "日期(yyyy-mm-dd)",
            data: dateArray,
            axisLabel: {
                textStyle: {
                    fontSize: 12,
                    fontWeight: "normal"
                }
            },
            axisTick: {
                alignWithLabel: true
            },
            nameTextStyle: {
                fontStyle: "italic"
            },
            interval: 5
        },
        grid: {
            left: '8%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type : 'value',
            name: "金额（元）",
            nameTextStyle : {
                color: "#000",
                padding : [5, 0, 0, 20],
                fontSize: 14,
                fontWeight: 8
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12,
                    fontWeight: 6,
                    color:"#FFF"
                }
            },
            splitNumber: 8
        },
        // 数据
        series: [{
            name: '销量',
            type: 'bar',
            barWidth : '50',
            data: dataArray
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//绘制图表
function geneConsumerBarChart(dateArray, dataArray) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('consumer-chart'));
    // 指定图表的配置项和数据
    var option = {
        // 标题
        title: {
            text: "客单数",
            left: 'center'
        },
        color: ['#3398DB'],
        // 工具箱
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        // x轴
        xAxis: {
            //data: ['2017.12.21', '2017.12.22', '2017.12.23',
            //    '2017.12.24', '2017.12.25', '2017.12.26', '2017.12.27'],
            name: "日期(YYYY-MM-DD)",
            data: dateArray,
            axisLabel: {
                textStyle: {
                    fontSize: 12,
                    fontWeight: "normal"
                }
            },
            axisTick: {
                alignWithLabel: true
            },
            nameTextStyle: {
                fontStyle: "italic"
            },
            interval: 5
        },
        grid: {
            left: '8%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type : 'value',
            name: "人数（人）",
            nameTextStyle : {
                color: "#000",
                padding : [5, 0, 0, 20],
                fontSize: 14,
                fontWeight: 8
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12,
                    fontWeight: 6,
                    color:"#FFF"
                }
            },
            splitNumber: 8
        },
        // 数据
        series: [{
            name: '客流量',
            type: 'bar',
            barWidth : '50',
            data: dataArray
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

/*百分数转小数*/
function toPoint(percent){
    var str = percent.replace("%","");
    str = str/100;
    return str;
}

/**
 *
 * 获取当前时间
 */
function p(s) {
    return s < 10 ? '0' + s: s;
}
function getSystemCurDateTime() {
    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month  = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();
    var h = myDate.getHours();       //获取当前小时数(0-23)
    var m = myDate.getMinutes();     //获取当前分钟数(0-59)
    var s = myDate.getSeconds();

    var now = year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
}

//生成订单号
function createOrderNo(curDate) {
    curDate = curDate.replaceAll("-", "");

}

function logout() {
    Ewin.confirm({title: "退出系统", message: "您确定要退出系统吗？"}).on(function(status){
       if(status) {
           window.location.href = "./LogonPage.html";
       }
    });
}

function image_check(feid) { //自己添加的文件后缀名的验证
    var img = document.getElementById(feid);
    return /.(jpg|png|gif|bmp)$/.test(img.value)? true:(function() {
        modals.info('图片格式仅支持jpg、png、gif、bmp格式，且区分大小写。');
        return false;
    })();
}

function initGoodsCateTab() {
    $(".tab_content").hide(); //Hide all content
    $("ul.cates_tabs li:first").addClass("current").show(); //Activate first tab
    $(".tab_content:first").show(); //Show first tab content

    $(".category_row div").each(function(i) {
        $(this).addClass("goods_unchecked");
    });
}
