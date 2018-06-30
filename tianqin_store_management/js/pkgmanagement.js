/**
 * Created by Lily on 2018/6/17.
 */
(function ($) {
    document.write("<script src='./layer/layer.js'></script>");
    window.pkgmgr = function(){
        var createGoodsInfoNode = function(goodsInfoObj) {
            var strhtml = "";
            strhtml += "<div class='goods_desc'>"; //start
            strhtml += "<h5 class='cmdyName'>" + goodsInfoObj.cmdyName + "</h5>";
            strhtml += "<p class='cmdyUprice'>" + goodsInfoObj.cmdyUprice + "</p>";
            //折扣
            strhtml += "<p class='promRate ms_hidden'>" + goodsInfoObj.promRate + "%</p>" + "</div>"; //end
            return strhtml;
        };

        var createPkgGoodsDetail = function(goodsList) {
            var strHtml = "";
            strHtml = "<div class='pkg_goods_list ms_hidden'>" +
                          "<h4 style='margin-top: 10px; text-align: center; font-size: 16px; font-weight: bold;'>套餐内商品</h4>" +
                          "<table class='table' style='margin: 10px;'>";
            strHtml += "<thead>" +
                       "<tr>" +
                          "<td>商品名称</td>" +
                          "<td>单&nbsp;&nbsp;价</td>" +
                          "<td>单&nbsp;&nbsp;位</td>" +
                          "<td>数&nbsp;&nbsp;量</td>" +
                       "</tr>" +
                      "</thead><tbody>";
            $.each(goodsList, function(i, n){
                strHtml += "<tr>" +
                           "<td class='pkgGoodsName'>" + n.name + "</td>" +
                           "<td class='pkgGoodsPrice'>" + n.price + "</td>" +
                           "<td class='pkgGoodsUnit'>" + n.unit + "</td>" +
                           "<td class='pkgGoodsNum'>" + n.number + "</td>" +
                          "</tr>"
            });
            strHtml += "</tbody></table></div>";
            return strHtml;
        };

        //渲染套餐管理表格
        var renderPackageTableInfo = function(packList){
            $(".package_table>table>tbody").empty();
            var goodsToggle = "<button type='button' class='btn btn-primary goodsToggle'>" +
                                  "<span class='glyphicon glyphicon-chevron-right'></span>" +
                              "</button>";
            $.each(packList, function(i, o){
                $(".package_table>table>tbody").append("<tr>"
                + "<td class='pkgId'>" + o.pkgId + "</td>"
                + "<td class='pkgName'>" + o.pkgName + "</td>"
                + "<td class='pkgPrice'>" + o.pkgPrice + "</td>"
                + "<td class='pkgStatus'>" + o.pkgStatus + "</td>"
                + "<td class='pkgGoodsDetail'>"  + goodsToggle + createPkgGoodsDetail(o.cmdys) + "</td>"
                + "<td class='promRate'>" + o.promRate + "</td>"
                + "<td class='cmsiMethod'>" + o.cmsiMethod + "</td>"
                + "<td class='cmsiMoney'>" + o.cmsiMoney + "</td>"
                + "<td class='cmsiRate'>" + o.cmsiRate + "</td>"
                + "<td class='pkgRemark'>" + o.pkgRemark + "</td>"
                + "<td class='rowOper'>"
                + "<button type='button' class='btn btn-default row_delete' style='padding: 4px 8px;'>删除</button>"
                + "<button type='button' class='btn btn-default row_update' style='padding: 4px 8px;'>修改</button>"
                + "</td>"
                + "</tr>");
            });
        };
        //点击查看商品详情
        $(".package_table>table>tbody").on("click", "tr>td.pkgGoodsDetail>button.goodsToggle", function(e){
            var $detailTd = $(this).parent("td.pkgGoodsDetail");
            var htmlText = $detailTd.find(".pkg_goods_list").html();
            htmlText = htmlText.replace("ms_hidden", "");
            layer.open({
                type: 1,
                title: false,
                skin: "pkg_goods_list",
                shadeClose: true, //点击遮罩关闭
                area: ["450px","350px"],
                anim: 3,
                content: htmlText
            });
        });

        //render the Tab
        var renderGoodsCategoryTab = function (commodity) {
            $(".goods_list_right_tab").empty();
            $(".pkggoods_tab_content").replaceWith(""); //clear the existed data
            var linkPrefix = "goodsDetail_";
            var liIndex = 0;
            $.each(commodity, function(key, value){
                var hrefLink = key.split("-")[1];
                var cateName = key.split("-")[0];
                if(liIndex == 0)
                {
                    $(".goods_list_right_tab").append("<li class='current'>" +
                    "<a href='#" + (linkPrefix + hrefLink) + "' class='btn btn-primary'>" +
                    cateName +
                    "</a>" +
                    "</li>");
                } else {
                    $(".goods_list_right_tab").append("<li>" +
                    "<a href='#" + (linkPrefix + hrefLink) + "' class='btn btn-primary'>" +
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
                    var $tabConent = $(".pkggoods_tab_content");
                    if($tabConent.length == 0) {
                        $(".all_goods_detail>ul").after("<div id='" + (linkPrefix + hrefLink) + "' class='pkggoods_tab_content'>" + allRowHtml + "</div>");
                    } else {
                        $(".all_goods_detail .pkggoods_tab_content").last().after("<div id='" + (linkPrefix + hrefLink) +
                        "' class='pkggoods_tab_content'>" + allRowHtml + "</div>");
                    }
                }
            });
        };

        //初始化套餐
        $("a[href='#goods_sets_mgr']").click(function(e){
            $.ajax({
                url: serverHost + "/packs",
                type: "get",
                data: {},
                dataType: "json",
                success: function(resp){
                    if(resp.ret == "SUCCESS"){
                        var packList = resp.dat;
                        renderPackageTableInfo(packList);
                    } else {
                        toastr.options.positionClass = 'toast-top-center';
                        toastr.error("获取套餐数据失败");
                    }
                },
                error: function(jqXHR, textStatus, exp){
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("服务异常");
                }
            });
        });

        /**
         * 删除套餐信息
         */
        $(".package_table>table>tbody").on("click", "tr>td.rowOper>button.row_delete", function(e){
            var $selectRow = $(this).parent("td.rowOper").parent();
            var delPkgReq = {
                url: serverHost + "/delpkg"
            };
            Ewin.confirm({message:"确定删除套餐吗？"}).on(function(status){
                if(status) {
                    $selectRow.remove();
                    $.ajax(delPkgReq);
                }
            });
        });

        /**
         * 更新商品信息
         */
        $(".package_table>table>tbody").on("click", "tr>td.rowOper>button.row_update", function(e){
            var $selectRow = $(this).parent("td.rowOper").parent();
        });

        $("#goods_sets_mgr ").find(".query_opera .search_button").click(function(){
            //按照名称查询套餐
            var queryParam = {
                "pkgName": $("#con_sets_name").val()
            };
            $.ajax({
                url: serverHost + "/packs",
                type: "get",
                data: queryParam,
                dataType: "json",
                success: function(resp){
                    if(resp.ret == "SUCCESS"){
                        var packList = resp.dat;
                        renderPackageTableInfo(packList);
                    } else {
                        toastr.options.positionClass = 'toast-top-center';
                        toastr.error("套餐数据加载失败");
                    }
                },
                error: function(jqXHR, textStatus, exp){
                    toastr.options.positionClass = 'toast-top-center';
                    toastr.error("服务异常");
                }
            });
        });

        $("#addPkgGoods").click(function(e){
            //$(".all_goods_detail").removeClass("ms_hidden");
            //$(".all_goods_detail").fadeIn();
            //$("#addGoodsModal").addClass("theme_package");
        });

        $("button.goodslist_toggle").click(function(e){
            if($("#addGoodsModal").hasClass("theme_package")) {
                $("#addGoodsModal").removeClass("theme_package")
            } else {
                $("#addGoodsModal").addClass("theme_package");
            }
        });
        //新增套餐
        $("#goods_sets_mgr .operation_button .add_button").click(function(e){
            //call api to get goods list detail
            $.ajax({
                url: serverHost + "/commcate?status=1",
                type: "get",
                data: {},
                dataType: "json",
                success: function(resp) {
                    if(resp.ret == "SUCCESS") {
                        renderGoodsCategoryTab(resp.dat.commodity);
                    } else {
                        toastr.options.positionClass = "toast-top-center";
                        toastr.info("获取商品详情失败");
                    }
                },
                error: function(jqXHR, status, exp) {
                    toastr.options.positionClass = "toast-top-center";
                    toastr.info("获取商品详情服务异常");
                }
            });

            var options = {
                title: "*新增套餐*"
            };
            $("#goods_btn_submit").attr("data-action", "PKG_ADD");
            $(".goodsinfo_update").hide();
            $(".packinfo_update").show();

            POPOVER.open(options);
        });
    }();
})(jQuery);