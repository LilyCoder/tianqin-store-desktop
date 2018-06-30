/**
 * Created by Lily on 2018/6/9.
 */
(function ($){
    var scroll = 0;
    $(document).ready(function(){
        $(".theme-popover").on("click", ".theme-popover-close", function(){
            $(".theme-popover").hide();
            $(".theme-popover-close").hide();
            $(".all_goods_detail").hide();
            $(".theme-popover-mask").hide();
            $("html").css({"overflow": "auto", "position":"static"});
            $(window).scrollTop(scroll);
        });

        $(".theme-popover .paymentWays button").click(function(e){
            var orderInfo = {
                "orderNum": $(".order_settle .order_nums").text(),
                "userId": "",
                "userName": $(".order_settle input[name='consumer']").text(),
                "userContact": "",
                "orderPrice": Number($(".order_settle .total_amt").text()),
                "orderCommitTime": $(".order_settle .order_date").text()
            };
        });
        $(".theme-footer button.cancel_submit").click(function(){
            $(".theme-popover").hide();
            $(".theme-popover-close").hide();
            $(".theme-popover-mask").hide();
            $(".all_goods_detail").hide();
            $("html").css({"overflow": "auto", "position":"static"});
            $(window).scrollTop(scroll);
        });
    });

    window.POPOVER = function() {
        return {
            open: function(option) {
                $(".theme_title").text(option.title);
                $(".theme-popover").fadeIn();
                $(".theme-popover").fadeIn("slow");
                $(".theme-popover-close").show();
                $(".theme-popover-mask").show();
                scroll = $(window).scrollTop();
                $('html').css({'overflow':'hidden',
                    'position':'fixed',
                    'top':'- '+scroll+'px'});
            },
            close: function(){
                $(".theme-popover").hide();
                $(".theme-popover-close").hide();
                $(".all_goods_detail").hide();
                $(".theme-popover-mask").hide();
                $("html").css({"overflow": "auto", "position":"static"});
                $(window).scrollTop(scroll);
            }
        }
    }();
})(jQuery);
