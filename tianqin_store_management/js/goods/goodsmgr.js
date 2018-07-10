/**
 * Created by Lily on 2018/7/6.
 */
(function($){
    window.goods = function(){

        function addGoodsTableRow(tableData) {
            var rowNo = 1;
            $.each(tableData, function(i, n) { //商品列表
                $(".goods_table>table>tbody").append("<tr>"
                + "<td class='goodsNo' style='text-align: left'>" + rowNo + "</td>"
                + "<td class='storeName' data-storeid='" + n.storeId + "'>" + n.storeName + "</td>"
                + "<td class='goodsName'>" + n.cmdyName + "</td>"
                + "<td class='goodsUnitPrice'>" + n.cmdyUprice + "</td>"
                + "<td class='goodsCost'>" + n.cmdyCmsiBase + "</td>"
                + "<td class='goodsUnit'>" + n.cmdyUnit + "</td>"
                + "<td class='goodsDeduct'>" + n.promRate + "</td>"
                + "<td class='goodsCate'>" + n.cmdyCategory + "</td>"
                + "<td class='deductWays'>" + n.cmsiMethod + "</td>"
                + "<td class='deductMoney'>" + n.cmsiMoney + "</td>"
                + "<td class='deductRate'>" + n.cmsiRate + "</td>"
                + "<td class='goodsMark'>" + n.cmdyRemark + "</td>"
                + "<td class='rowOper'>"
                + "<button type='button' class='btn btn-default row_delete' style='padding: 4px 8px;'>" +
                "<span class='glyphicon glyphicon-trash' style='color: rgb(0, 0, 252);'></span></button>"
                + "<button type='button' class='btn btn-default row_update' " +
                "data-target='#addGoodsModal' data-toggle='modal' style='padding: 4px 8px;'>" +
                "<span class='glyphicon glyphicon-edit' style='color: rgb(0, 0, 252);'></span></button>"
                + "</td>"
                + "</tr>");
                rowNo = rowNo + 1;
            });
        }

        /**
         * 初始化商品管理信息
         */
        function initGoodsMgrInfo(){
            //商品管理tab切换
            $(".goods_tabs_content", parent.document).hide();
            $(".ul.goods_tabs_nav li", parent.document).removeClass("activeTab");
            $("ul.goods_tabs_nav li:first", parent.document).addClass("activeTab").show();
            $(".goods_tabs_content:first", parent.document).show();
            $.ajax({
                url: config.serverHost + "/commodity?sign=1&pageSize=5",
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
                        $(".goods_table>table>tbody").empty();
                        addGoodsTableRow(commondityLst);

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

        //图片上传
        $("#img_submit_btn").click(function(){
            var fd = new FormData();
            fd.append("desc", "123456");
            fd.append("uploadFile", $("input[name='MultipartFile']")[0].files[0]);
            $.ajax({
                url: config.serverHost + "/upload",
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
            var isUpdateSuc = false;
            $.ajax({
                url: config.serverHost + "/addcommo",
                type: "post",
                async: false,
                data: newGoodsInfo,
                dataType: "json",
                beforeSend: function() {
                    $("#goodsmgr_loading").show();
                },
                success: function(resp) {
                    if(resp.ret == "SUCCESS") {
                        try{
                            addNewRowGoodsHtml(newGoodsInfo);
                            toastr.options.positionClass = 'toast-top-center';
                            toastr.success('提交数据成功');
                            isUpdateSuc = true;
                            $("#addGoodsModal").modal("hide");
                        }catch (e) {
                        }
                    } else {
                        layer.msg(resp.msg);
                    }
                },
                error: function(jqXHR, textStatus, exp) {
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("服务异常");
                },
                complete: function() {
                    $("#goodsmgr_loading").hide();
                }
            });

            if(isUpdateSuc) {
                var pageSize = $(".pagination_bar .page_size").find("select option:selected").text();
                var pageNo = $(".pagination_bar .page_index").find(".page_no").text();
                queryGoodsDetail(pageSize, 1);
            }
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

        function queryGoodsDetail(pageSize, pageNo) {
            var checkText = $("#con_goods_cate").find("option:selected").attr("data-cateid");
            var goodsName = $("input[name='con_goods_name']").val();
            var queryParam = {
                "commoName": (goodsName != null && goodsName != undefined)?goodsName:"",
                "categoryId": (checkText != null && checkText != undefined)?checkText:"",
                "sign": "yes",
                "pageSize": pageSize,
                "pageNumber": pageNo
            };
            $.ajax({
                url: config.serverHost + "/commodity",
                type: "get",
                data: queryParam,
                dataType: "json",
                beforeSend: function() {
                    $("#goodsmgr_loading").show();
                },
                success: function(resp) {
                    try{
                        if(resp.ret == "SUCCESS") {
                            $(".goods_table>table>tbody").empty();
                            addGoodsTableRow(resp.dat.commodity);
                        }else{
                            toastr.options.positionClass = 'toast-top-center';
                            toastr.error(resp.msg);
                        }
                    }catch (e) {
                    }
                },
                error: function(jqXHR, textStatus, exp){
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("服务异常");
                },
                complete: function() {
                    $("#goodsmgr_loading").hide();
                }
            });
        }

        /**
         * 查询商品
         */
        $(".goodsmgr_body .operation_button .search_button>button").click(function(e) {
            var pageSize = $(".pagination_bar .page_size").find("select option:selected").text();
            var pageNo = $(".pagination_bar .page_index").find(".page_no").text();
            queryGoodsDetail(pageSize, pageNo);
        });

        $(document).ready(function(e){
           // initGoodsMgrInfo();
        });
    }();
})(jQuery);
