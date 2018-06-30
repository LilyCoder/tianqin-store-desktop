
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
    $("ul.cates_tabs li").click(function() {
        $("ul.cates_tabs li").removeClass("current"); //Remove any "active" class
        $(this).addClass("current"); //Add "active" class to selected tab
        $(".tab_content").hide(); //Hide all tab content
        var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
        $(activeTab).fadeIn(); //Fade in the active content
        return false;
    });
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

    //消费管理,添加订单上商品或者移除
    $(".category_row>div").each(function(index) {
        $(this).on("click", function() {
            if($(this).hasClass("goods_unchecked")) {   //选中商品
                $(this).removeClass("goods_unchecked");
                $(this).addClass("goods_checked");
            }
        });

    });

    //选择订单中的某一行
    $(".order-list>table>tbody>tr").on("click", function () {
        if($(this).hasClass("active")){
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
            $(".order-list>table>tbody>tr").not(this).removeClass("active");
            createOrderItemNode($(this));
        }
    });
    $(".add_goods>button").click(function() {
        var $selectRow = $(".order-list tr.active");
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
    $(".delete_goods>button").click(function(){
        var $selectRow = $(".order-list tr.active");
        if($selectRow.length == 0) {
            return;
        }
        //商品数量
        var itemNum = $selectRow.find(".item_num").text();
        var intNum = parseInt(itemNum);
        if(intNum <= 0) {
            return;
        }
        $selectRow.find(".item_num").text(intNum - 1);

        //商品单价
        var itemUnitPrice = $selectRow.find(".item_unit_price").text();
        //商品折扣
        var itemDiscount = $selectRow.find(".item_discount").text();
        //计算商品的价格
        var itemPrice = (intNum - 1) * Number(itemUnitPrice).toFixed(2) * toPoint(itemDiscount);
        $selectRow.find(".item_total_price").text(itemPrice.toFixed(2));
    });

    //$(".submit_btn>button").click
    //商品管理-添加商品
    $(".goods-management .operation_button .add_button>button").click(function(){
        $("#addModalLabel").text("新增商品");
        $('#addGoodsModal').modal();
    });
    //图片上传
    $("#img_submit_btn").click(function(){
        var imgurl = document.getElementById("uploadGoodsImage").value;
        $.ajaxFileUpload({
            url:"http://192.168.43.106:8080/stm/upload",
            fileElementId: "uploadGoodsImage", //文件上传域的ID，这里是input的ID，而不是img的
            dataType: 'json', //返回值类型 一般设置为json
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (resp) {
                //alert(data.code + " " + data.msg);
                if(resp.ret == "SUCCESS") {
                    $("#uploadGoodsImage").val(resp.dat);
                    alert(resp.msg);
                } else {
                    alert(resp.msg);
                }
            }
        });
    });

    //选择某一行修改商品信息
    $(".goods-management .goods_table>tbody>tr").on("click", function(){
        $(this).addClass("active");
        $(".goods-management .goods_table tbody tr").not(this).removeClass("active");
    });
    $(".goods-management .operation_button .update_button>button").click(function(){
        $("#addModalLabel").text("修改商品信息");
        //取表格中的某一行
        var $selections = $(".goods-management .goods_table tbody tr.active");
        if($selections.length == 0) {
            toastr.warning("请选择有效数据");
            return;
        }

        //Ewin.confirm({message: "确认要删除选择的订单吗?"}).on(function(e){
        //    if(!e) {
        //        return;
        //    }
        //
        //    $.ajax()
        //});
        //打开修改窗口
        $("input[name='goodsName']").val($selections.find(".goodsName").val());
        $("input[name='goodsUnitPrice']").val($selections.find(".goodsUnitPrice"));
        $("input[name='goodsCosts']").val($selections.find(".goodsCost"));
        $("input[name='goodsRates']").val($selections.find(".goodsDeduct"));
        $("#selectGoodsCate").val($selections.find(".goodsCate"));
        $("input[name='goodsRates']").val($selections.find(".goodsDeduct"));
        $("#selectDeductWays").val($selections.find(".deductWays"));
        $("input[name='deductValue']").val($selections.find(".deductMoney") != ""?
            $selections.find(".deductMoney"):$selections.find(".deductRate"));
        $("input[name='goodsRemark']").val($selections.find(".goodsMark"));
    });



    //添加新的商品信息
    $(".modal-footer #btn_submit").click(function(){
        //send ajax to save goods info
        var newGoodsInfo = {
            "cmdyName": $("input[name='goodsName']").val(),
            "cmdyUprice": $("input[name='goodsUnitPrice']").val(), //商品单价
            "cmdyCost": $("input[name='goodsCosts']").val(),
            "cmdyUnit": $("#goodsUnitSlect").find("option:selected").text(),
            "cmdyCategory": $("#selectGoodsCate").find("option:selected").text(),
            "promRate": $("input[name='goodsRates']").val(),
            "cmsiMethod": $("#selectDeductWays").find("option:selected").text(),
            "cmsiMoney": $("input[name='goodsDeductMoney']").val(),
            "cmsiRate": $("input[name='goodsDeductRates']").val(),
            "cmdyRemark": $("input[name='goodsRemark']").val()
        };

        $.ajax({
            url: "http://192.168.43.106:8080",
            type: "post",
            async: false,
            data: newGoodsInfo,
            dataType: "json",
            success: function(resp) {
                if(resp.ret == "SUCCESS") {
                    try{
                        //在表格中添加一行
                        addNewRowGoodsHtml(newGoodsInfo);
                    }catch (e) {
                    }
                }
                alert(resp.msg);
            }
        })
    });
});


//添加一行到商品表格中
function addNewRowGoodsHtml(newGoodsInfo) {
    var $lastRowEle = $(".goods_table>table>tbody>tr").last();
    var lastRowNo = $lastRowEle.find(".goodsNo");
    var strHtml = "<tr>";
    strHtml += "<td class='goodsNo'>" + (parseInt(lastRowNo) + 1) + "</td>";
    strHtml += "<td class='goodsName'>" + newGoodsInfo.cmdyName + "</td>";
    strHtml += "<td class='goodsUnitPrice'>" + newGoodsInfo.cmdyUprice + "</td>";
    strHtml += "<td class='goodsCost'>" + newGoodsInfo.cmdyCost + "</td>";
    strHtml += "<td class='goodsUnit'>" + newGoodsInfo.cmdyUnit + "</td>";
    strHtml += "<td class='goodsDeduct'>" + newGoodsInfo.promRate + "</td>";
    strHtml += "<td class='goodsCate'>" + newGoodsInfo.cmdyCategory + "</td>";
    strHtml += "<td class='deductWays'>" + newGoodsInfo.cmsiMethod + "</td>";
    strHtml += "<td class='deductMoney'>" + newGoodsInfo.cmsiMoney + "</td>";
    strHtml += "<td class='deductRate'>" + newGoodsInfo.cmsiRate + "</td>";
    strHtml += "<td class='goodsMark'>" + newGoodsInfo.cmdyRemark + "</td>";
    strHtml += "</tr>";
    $(".goods_table>table>tbody").after(strHtml);
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
        url: "http://192.168.132.104:8080/stm/home",
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
        url: "http://192.168.132.104:8080/stm/commcate",
        type: "get",
        async : false,
        data:{},
        dataType: "json",
        success: function(result) {
            try{
                if(result.ret == "SUCCESS") {
                    var commodity = result.dat.commodity;
                    renderGoodsCategoryTab(commodity);
                    initEmployeeSelectList(result.dat.employee);
                }

            }catch(e) {

            }
        }
    });
    $(".order-info tbody.order_list").addClass("order_empty_list").removeClass("order_list");
    $(".order-info tbody.order_empty_list").html("");
    $(".order-info .empty_hint").html("从右边添加商品");
    $(".order_settle .order_nums").html("0"); //数量清0
    //获取系统当前时间
    $(".order_settle .order_date").text(getSystemCurDateTime());
    $(".order_settle .order_no").text("00000000000000");

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
                rowHtml += createGoodsInfoNode(obj);
                if(countObj == 2) {
                    allRowHtml += goodsRowStartHtml + rowHtml + goodsRowEndtHtml;
                    rowHtml = "";
                    countObj = 0;
                    return true;
                }
                countObj = countObj + 1;
            });

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
    strhtml += "<p class='cmdyUprice'>￥" + goodsInfoObj.cmdyUprice + "</p>";
    //折扣
    strhtml += "<p class='promRate ms_hidden'>" + goodsInfoObj.promRate + "%</p>" +
    "</div>"; //end
    return strhtml;
}

/**
 * 增加订单的一项
 * @param checkedGoodsObj
 * @param index
 */
function createOrderItemNode(checkedGoodsObj, index) {
    if(checkedGoodsObj instanceof jQuery) {
        var $itemTr = $(".order-list>table>tbody>tr");
        var strHtml = "";
        strHtml +=  "tr" + "<td>" + index + "</td>" +
                    "<td class='item_name'>" + checkedGoodsObj.find(".cmdyName") + "</td>" +
                    "<td class='item_num'>1</td>" +
                    "<td class='item_unit_price'>" + checkedGoodsObj.find(".cmdyUprice") + "</td>" +
                    "<td class='item_discount'>" + checkedGoodsObj.find(".promRate") + "</td>" +
                    "<td class='item_total_price'>" + checkedGoodsObj.find(".cmdyUprice") + "</td>" +
                    "</tr>";
        $(".order-list>table>tbody").after(strHtml);
    }
}

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
    if(confirm("您确定要退出系统吗？")) {
        window.location.href = "./LogonPage.html";
    }
}

function initGoodsCateTab() {
    $(".tab_content").hide(); //Hide all content
    $("ul.cates_tabs li:first").addClass("current").show(); //Activate first tab
    $(".tab_content:first").show(); //Show first tab content

    $(".category_row div").each(function(i) {
        $(this).addClass("goods_unchecked");
    });
}
