/**
 * Created by Lily on 2018/7/4.
 */
(function ($) {
    window.store = function(){
        function addRowStoreInfo(tableData) {
            $.each(tableData, function(i, o) {
                var strHtml = "<tr>";
                strHtml += '<td class="storeNo">' + o.storeId + '</td>'
                        + '<td class="storeName">' + o.storeName + '</td>'
                        + '<td class="storeAddress">' + o.storeAddress + '</td>'
                        + '<td class="openTime">' + o.storeOpenDate + '</td>'
                        + '<td class="storeKeeperName">' + o.storeKeeperName + '</td>'
                        + '<td class="storeAMName">' + o.storeAreaManagerName + '</td>'
                        + '<td class="msgRestNum">' + o.storeOddsms + '</td>'
                        + '<td class="viewCosumeMsg">'
                        +   '<a href="#" class="view-btn">查看</a>'
                        + '</td>'
                        + '<td class="storeStaffList">'
                        +   '<a href="#" class="view-btn">查看</a>'
                        + '</td>'
                        + '<td class="storeDetailInfo">'
                            + '<a href="#" class="view-btn">查看</a>'
                        + '</td>'
                        + '<td class="rowOper">'
                        + '<button type="button" class="btn btn-primary row_delete" style="padding: 4px 8px">'
                        + '<span class="glyphicon glyphicon-trash" style="color: rgb(0, 2, 78);"></span>'
                        + '</button>'
                        + '<button type="button" data-target="#add_new_store" data-toggle="modal" ' +
                          'class="btn btn-primary row_update" style="padding: 4px 8px">'
                        + '<span class="glyphicon glyphicon-edit" style="color: rgb(0, 2, 78);"></span>'
                        + '</button>'
                        + '</td></tr>';
                $(".store_manage .storemgr_table tbody").append(strHtml);
            });
        }

        var initStoreMgr = function() {
            $.ajax({
                url: config.serverHost + "/stores?pageSize=5",
                type: "get",
                data: {},
                dataType: "json",
                beforeSend: function(){
                    $("#store_loading").show();
                },
                success: function(resp) {
                    try{
                        $(".storemgr_table .table tbody").empty();
                        if(resp.ret == "SUCCESS") {
                            //init manger list
                            var managerList = resp.dat.managers;
                            $.each(managerList, function(i, n) {
                                $("#con_am_name").append("<option data-id='"
                                + n.epyId + "'>" + n.epyName + "</option>");
                                $("#new_store_AM").append("<option data-id='"
                                + n.epyId + "'>" + n.epyName + "</option>");
                            });
                            //init page info
                            var pageinfo = resp.dat.page;
                            $(".pagination_bar .total .page_number").text(pageinfo.pt);

                            var storeTableData = resp.dat.stores;
                            addRowStoreInfo(storeTableData);
                        }else {
                            layer.msg(resp.msg);
                        }
                    } catch (e){
                    }
                },
                error: function(jqXHR, textStatus, exp) {
                    layer.msg("服务异常");
                },
                complete: function() {
                    $("#store_loading").hide();
                }
            });
        };

        //查询
        $(".store_manage .operation_button .search_button").click(function(e) {
            var pageSize = $(".pagination_bar .p_panel .page_size select option:selected").text();
            var pageNo = $(".pagination_bar .p_panel .page_index .page_no").text();
            var storeName = $("input[name='con_storename']").val();
            var queryParam = {
                "storeName" : storeName!=null&&storeName!=undefined?storeName:"",
                "areaManager": $("#con_am_name option:selected").attr("data-id"),
                "pageSize": pageSize != null&&pageSize != undefined?pageSize:"",
                "pageNo": ""
            };
            $.ajax({
                url: config.serverHost + "/stores",
                type: "get",
                data: queryParam,
                dataType: "json",
                beforeSend: function(){
                    $("#store_loading").show();
                },
                success: function(resp) {
                    try{
                        if(resp.ret == "SUCCESS") {
                            //render table data
                            $(".storemgr_table .table tbody").empty();
                            if(resp.dat.stores.length == 0) {
                                layer.msg("无数据");
                            }
                            else {
                                addRowStoreInfo(resp.dat.stores);
                            }
                            var pageInfo = resp.dat.page;
                            $(".pagination_bar .total .page_number").text(pageInfo.pt);
                            $(".pagination_bar .page_index .page_no").text(pageInfo.pc);
                        }
                    } catch (e) {
                    }
                },
                error: function(jqXHR, txtStatus, exp) {
                    layer.msg("服务异常");
                },
                complete: function() {
                    $("#store_loading").hide();
                }
            });
        });

        //上一页
        $(".store_manage").on("click", ".pagination_bar .last_page button", function(e) {
            var pageSize = $(".pagination_bar .p_panel .page_size select option:selected").text();
            var pageNo = $(".pagination_bar .p_panel .page_index .page_no").text();
            if(pageNo != null && pageNo != undefined) {
                pageNo = Number(pageNo);
            } else {
                pageNo = 1;
            }
            if(pageNo <= 1) {
                layer.msg("当前已经是第一页");
                return;
            }
            var queryParam = {
                "storeName" : $("input[name='con_storename']").val(),
                "areaManager": $("#con_am_name option:selected").attr("data-id"),
                "pageSize": pageSize != null&&pageSize != undefined?pageSize:"",
                "pageNumber": pageNo - 1
            };
            $.ajax({
                url: config.serverHost + "/stores",
                type: "get",
                data: queryParam,
                dataType: "json",
                beforeSend: function() {
                    $("#store_loading").show();
                },
                success: function(resp) {
                    try{
                        if(resp.ret == "SUCCESS") {
                            $(".storemgr_table .table tbody").empty();
                            if(resp.dat.stores.length != 0)
                            {
                                addRowStoreInfo(resp.dat.stores);
                            }
                            //init page info
                            var pageinfo = resp.dat.page;
                            $(".pagination_bar .page_index .page_no").text(pageNo - 1);
                        }
                    }catch (e) {
                    }
                },
                error: function() {
                    layer.msg("数据加载失败");
                },
                complete: function(){
                    $("#store_loading").hide();
                }
            });
        });
        //下一页
        $(".store_manage").on("click", ".pagination_bar .next_page button", function(e){
            var pageSize = $(".pagination_bar .p_panel .page_size select option:selected").text();
            var totalPageSize = $(".pagination_bar .p_panel .total .page_number").text();
            var pageNo = $(".pagination_bar .p_panel .page_index .page_no").text();
            if(pageNo != null && pageNo != undefined) {
                pageNo = Number(pageNo);
            } else {
                pageNo = 1;
            }
            if(totalPageSize != null && totalPageSize != undefined) {
                totalPageSize = Number(totalPageSize);
            } else {
                totalPageSize = 1;
            }
            if(pageNo >= totalPageSize) {
                layer.msg("当前已经是最后一页");
                return;
            }

            var queryParam = {
                "storeName" : $("input[name='con_storename']").val(),
                "areaManager": $("#con_am_name option:selected").attr("data-id"),
                "pageSize": pageSize != null&&pageSize != undefined?pageSize:"",
                "pageNumber": pageNo + 1
            };
            $.ajax({
                url: config.serverHost + "/stores",
                type: "get",
                data: queryParam,
                dataType: "json",
                beforeSend: function() {
                    $("#store_loading").show();
                },
                success: function(resp) {
                    try{
                        if(resp.ret == "SUCCESS") {
                            $(".storemgr_table .table tbody").empty();
                            if(resp.dat.stores.length != 0)
                            {
                                addRowStoreInfo(resp.dat.stores);
                            }
                            //init page info
                            $(".pagination_bar .page_index .page_no").text(pageNo + 1);
                        } else {
                            layer.msg(resp.msg);
                        }
                    }catch (e){
                    }
                },
                error: function() {
                    layer.msg("获取店铺信息异常");
                },
                complete: function() {
                    $("#store_loading").hide();
                }
            });
        });

        //click add button
        $(".store_manage .operation_button .add_button").click(function(e){
            //send request to get keeper list
            $.ajax({
                url: config.serverHost + "/getkeepers",
                type: "get",
                data: {},
                success: function(resp) {
                    var managerList = resp.dat;
                    $.each(managerList, function(i, n) {
                        $("#new_store_keeper").append("<option data-id='"
                        + n.epyId + "'>" + n.epyName + "</option>");
                    });
                },
                error: function(jqXHR, txtStatus, exp) {
                }
            });
            $("input[name='new_store_name']").val("");
            $("input[name='new_store_address']").val("");
        });

        //新增/修改店铺信息
        $("#store_btn_submit").click(function(e) {
            var param = {
                "storeName": $("input[name='new_store_name']").val(),
                "storeAddress": $("input[name='new_store_address']").val(),
                "storeKeeper": $("#new_store_keeper option:selected").attr("data-id"),
                "storeAreaManager": $("#new_store_AM option:selected").attr("data-id")
            };

            //user for query store info
            var pageSize = $(".pagination_bar .p_panel .page_size select option:selected").text();
            var pageNo = $(".pagination_bar .p_panel .page_index .page_no").text();
            var queryParam = {
                "storeName" : $("input[name='con_storename']").val(),
                "areaManager": $("#con_am_name option:selected").attr("data-id"),
                "pageSize": pageSize != null&&pageSize != undefined?pageSize:"",
                "pageNumber": pageNo != null&&pageNo != undefined?pageNo:""
            };

            var isUpdateSuc = false;
            $.ajax({
                url: config.serverHost + "/addstore",
                type: "get",
                async: false,
                data: param,
                dataType: "json",
                beforeSend: function() {
                    $("#store_loading").show();
                },
                success: function(resp) {
                    if(resp.ret == "SUCCESS") {
                        isUpdateSuc = true;
                        $('#add_new_store').modal('hide');
                    } else {
                        layer.msg(resp.msg);
                    }
                },
                error: function(jqXHR, txtStatus, exp){
                    layer.msg("店铺信息更新异常");
                },
                complete: function() {
                    $("#store_loading").hide();
                }
            });

            if(isUpdateSuc) {
                $.ajax({
                    url: config.serverHost + "/stores",
                    type: "get",
                    data: queryParam,
                    dataType: "json",
                    beforeSend: function(){
                        $("#store_loading").show();
                    },
                    success: function(resp) {
                        try{
                            if(resp.ret == "SUCCESS") {
                                $(".storemgr_table tbody").empty();
                                addRowStoreInfo(resp.dat.stores);
                            } else {
                                layer.msg(resp.msg);
                            }
                        }catch (e){}
                    },
                    error: function(jqXHR, txtStatus, exp){
                        layer.msg("加载店铺列表异常");
                    },
                    complete: function(){
                        $("#store_loading").hide();
                    }
                });
            }
        });

        //删除店铺信息
        $(document).on("click", ".storemgr_table td.rowOper .row_delete", function(e){
            var $selectRow = $(this).parent("td.rowOper").parent();
            var storeId = $selectRow.find("td.storeNo").text();
            var param = {
                storeId: storeId
            };
            Ewin.confirm({message: "确认删除店铺?"}).on(function(isDelete) {
               if(isDelete) {
                   $.ajax({
                       url: config.serverHost + "/delstore",
                       type: "post",
                       data: param,
                       dataType: "json",
                       beforeSend: function(){
                           $("#store_loading").show();
                       },
                       success: function(resp) {
                           if(resp.ret == "SUCCESS") {
                               $selectRow.remove();
                           } else {
                               layer.msg(resp.msg);
                           }
                       },
                       error: function(jqXHR, txtStatus, exp) {
                           layer.msg("删除店铺异常");
                       },
                       complete: function(){
                           $("#store_loading").hide();
                       }
                   });
               }
            });
        });

        //更新店铺信息
        $(document).on("click", ".storemgr_table td.rowOper .row_update", function(e){
            var getKeeperListAjax = {
                url: config.serverHost + "/getkeepers",
                type: "get",
                data: {},
                dataType: "json",
                success: function(resp) {
                    if(resp.ret == "SUCCESS") {
                        var managerList = resp.dat;
                        $.each(managerList, function(i, n) {
                            $("#new_store_keeper").append("<option data-id='"
                            + n.epyId + "'>" + n.epyName + "</option>");
                        });
                    }
                },
                error: function() {
                }
            };
            $.ajax(getKeeperListAjax);
            var $selectRow = $(this).parent("td.rowOper").parent();
            var storeName = $selectRow.find("td.storeName").text();
            $("input[name='new_store_name']").val((storeName != null&&storeName!=undefined)?storeName:"");
            var adddress = $selectRow.find("td.storeAddress").text();
            $("input[name='new_store_address']").val((storeName != null&&storeName!=undefined)?storeName:"");
            var keeperName = $selectRow.find("td.storeKeeperName").text();
            var amName = $selectRow.find("td.storeAMName").text();
            $("#new_store_keeper").text((keeperName != null&&keeperName!=undefined)?keeperName:"");
            $("#new_store_AM").val((amName!=null&&amName!=undefined)?amName:"");
        });

        //查看店铺详情
        $(document).on("click", ".storemgr_table td.storeDetailInfo .view-btn", function(e) {
            var $selectCol = $(this).parent("td.storeDetailInfo");
            var detailHtml = $selectCol.find("div.detail").html();
            $("#new_store_dialog").find(".modal-content .modal-body").append(detailHtml);
        });

        //查看消费统计
        $(document).on("click", ".storemgr_table td.viewCosumeMsg .view-btn", function(e) {
            //send ajax to get comusme info
            $.ajax({
                url: config.serverHost + "/consume",
                type: "get",
                data: {},
                dataType: "json",
                success: function(resp) {
                    if(resp.ret == "SUCCESS") {

                    }
                }
            });
        });

        $(document).ready(function(){
            initStoreMgr();
        });
        return {
            initStoreMgr: initStoreMgr
        }
    }();
})(jQuery);