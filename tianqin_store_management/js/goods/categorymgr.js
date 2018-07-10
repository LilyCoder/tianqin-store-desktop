/**
 * Created by Lily on 2018/7/7.
 */
(function($){
    window.category = function() {
        //新增类别
        $(".goodscate_mgr .operation_button .add_button").click(function(e) {
            $("#new_category_submit").attr("data-action", "AC");
        });

        $("#new_category_submit").click(function(e) {
            var cateParam = {
                "categoryName": $("input[name='categoryName']").val() != null?
                    $("input[name='categoryName']").val():"",
                "storeName": $("input[name='cateStoreName']").val()!=null?
                    $("input[name='cateStoreName']").val():""
            };

            $.ajax({
                url: config.serverHost + "/addcategory",
                type: "post",
                data: cateParam,
                dataType: "json",
                success: function(resp) {
                    if(resp.ret == "SUCCESS") {
                        layer.msg('添加成功');
                       //update table todo

                        //close dialog todo
                    } else {
                        //open 提示框
                        layer.msg('添加失败');
                    }
                }
            })
        });

        //delete category
        $(".goodscate_mgr .table").on("click", "td.rowOper>button.row_delete", function(e) {
            var $selectRow = $(this).parent("td.rowOper").parent();
            Ewin.confirm({message: "确认删除类别?"}).on(function(isFlag) {
                if(isFlag) {
                    var param = {
                        "categoryName": ($selectRow.find("td.cate_name").text() != null &&
                            $selectRow.find("td.cate_name").text() != undefined)?
                            $selectRow.find("td.cate_name").text():""
                    };
                    //delete row
                    $.ajax({
                        url: config.serverHost + "/deletecate",
                        type: "post",
                        data: param,
                        dataType: "json",
                        success: function(resp) {
                            if(resp.ret == "SUCCESS") {
                                layer.msg("删除成功");
                                $selectRow.remove();
                            } else {
                                layer.msg("删除失败");
                            }
                        },
                        error: function(jqXHR, txtStatus, exp) {
                            //todo
                        }
                    });
                }
            });
        });

        //update category
        $(".goodscate_mgr .table").on("click", "td.rowOper>button.row_update", function(e){
            var $selectRow = $(this).parent("td.rowOper").parent();
            $("input[name='categoryName']").val($selectRow.find("td.cate_name").text());
            $("input[name='cateStoreName']").val($selectRow.find("td.store_name").text());

            $("#new_category_submit").attr("data-action", "UC");
        });

        //init catgory info
        function initCategoryMgr() {
            $.ajax({
                url: config.serverHost + "/category",
                type: "get",
                date: {},
                dataType: "json",
                success: function(resp) {

                },
                error: function(jqXHR, txtStatus, exp) {

                }
            });
        }

        return {
            initCategoryMgr: initCategoryMgr
        }
    }();
})(jQuery);