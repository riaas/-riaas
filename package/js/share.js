$(document).ready(function(){
	//通用背景遮罩 2016-11-8 15:54:32
	bgShow = function(zindex){
		if($(".wenr-bg").length == 0){
			$("body").append('<div class="wenr-bg" style="z-index:' + zindex + '"></div>')
			$(".wenr-bg").fadeIn(100)
		}else{
			$(".wenr-bg").css("z-index",zindex)
		}
	}
	bgClose = function(){
		$(".wenr-bg").fadeOut(100,function(){
			$(this).remove();
		})
	}
	//选择规格 2017-2-23 09:37:11
	wenrProdItem = function(obj){
		var $obj = $(".wenr-item-choose");
		if($obj.is(":hidden")){
	    	bgShow("5");
	    	$(".wenr-bg").attr("onClick","wenrProdItem()");
	    	$obj.fadeIn(200).addClass("play");
		}else{
			bgClose()
			$obj.removeClass("play").fadeOut(100);
		}
	}
	var p_n_t = $("#wnerProdNtext"),//数量
		p_n_a = $("#wnerProdNamount"),//结算金额隐藏域
		p_n_max = p_n_t.attr("data-max"),//最大数量
		p_n_t_v = "0",//默认数量
		t_html = $("#wenrProdItem"),
		p_html = $("#wenrProdPrice");
	$("#wenrProdItemSelect a").click(function(){
		var p_t = $(this).attr("data-title"),
			p_s = $(this).attr("data-amount"),
			p_p = $(this).attr("data-price"),
			p_n = $(this).attr("data-number");
		$(this).addClass("select").siblings().removeClass("select");
		t_html.text(p_t);p_html.text(p_p);p_n_t.val(p_n);
		wenrUpdatePrice();
	})
	wenrUpdatePrice = function(){
	    var p_s_obj = $("#wenrProdItemSelect a.select"),
	    	p_s_number = p_s_obj.attr("data-number"),
	    	p_s_price = p_s_obj.attr("data-price"),
	    	p_s_total =  p_s_price*p_s_number;   //单价乘以数量
	    console.log(p_s_price,p_s_number)
	    p_n_a.val(p_s_total);
	    p_s_obj.attr({"data-number":p_s_number,"data-amount":p_s_total});
	}
	$("#wenrProdNadd").click(function() {
	    if(p_n_t.val() >= p_n_max){
	    	alert("每人限购"+ p_n_max +"件");
	    }else{
	    	p_n_t.val(parseInt(p_n_t.val()) + 1); //点击加号输入框数值加1
	    	$("#wenrProdItemSelect a.select").attr("data-number",parseInt(p_n_t.val()))
	    	wenrUpdatePrice();  //重置总金额
	    }
	});
	$("#wenrProdNminus").click(function(){
	    if(p_n_t.val()<=1){
	        
	    }else{
	    	p_n_t.val(parseInt(p_n_t.val())-1); //点击减号输入框数值减1
	    	$("#wenrProdItemSelect a.select").attr("data-number",parseInt(p_n_t.val()))
	    	wenrUpdatePrice();//重置总金额
	    }
	});
    $("#wnerProdNtext").on({
        focus:function(){
            v = $(this).val();
            $(this).val("")
        },
        blur:function(){
            var $value_max = parseInt(p_n_max),
                $value = $(this).val();
            if($value == ""){
                $(this).val(v)
            }else if($value != "" && !regexp($value,"int")){
                alert("请输入正确数量")
                $(this).val(v)
            }else if($value > $value_max || $value < "1"){
                alert("每人限购"+ $value_max +"件")
                $(this).val(v)
            }else{
            	$("#wenrProdItemSelect a.select").attr("data-number",parseInt(p_n_t.val()))
            	wenrUpdatePrice();  //重置总金额
            }
        }
    })
    //搭配商品
    var rma_p_a = 0,rma_p_z = 0,rma_p_q = 0;
    wenrRmaPrice = function(type,p){
    	var	rma_p_p = $("#wenrOrderRmaPrice"),
    		rma_p_n = $("#wenrOrderRmaNumber"),
    		rma_p_t = $("#wenrOrderAdditional"),
    		rma_p_t_html = $("#wenrOrderAdditional_html"),
    		rma_p_carriage = $("#wenrOrderCarriage").val()*1,//运费
    		rma_p_amount = $("#wenrOrderAmount"),//结算金额
    		rma_p_amount_html = $("#wenrOrderAmount_html"),
    		rma_p_unitprice = $("#wenrOrderUnitprice").val()*1,//商品单价
	    	rma_p_total = 0,
	    	rma_p_as = 0;
	    if(type == 0){
	    	rma_p_z += rma_p_a + p;
	    	rma_p_q ++;
	    }if(type == 1){
	    	rma_p_z += rma_p_a - p;
	    	rma_p_q --;
	    }
	    rma_p_total = wenrFmoney(rma_p_z);
	    rma_p_as = wenrFmoney((rma_p_z*1 + rma_p_unitprice + rma_p_carriage));
	    rma_p_amount.val(rma_p_as);
	    rma_p_amount_html.text(rma_p_as);
	    rma_p_p.text(rma_p_total);
	    rma_p_t_html.text(rma_p_total);
	    rma_p_t.val(rma_p_total);
	    rma_p_n.text(rma_p_q);
	}
	$(".w-r-l-number .numberBtn").click(function(){
		var rma_p_n = $(this).siblings(".number-text"),
			rma_p_m = $(this).siblings(".number-minus"),
			rma_p_p = Number(rma_p_n.attr("data-price"));
		if($(this).hasClass("number-add")){
			var n = parseInt(rma_p_n.text()) + 1;
	    	rma_p_n.text(n);
	    	if(rma_p_n.text() > 0){
				rma_p_n.css("display","block");
				rma_p_m.css("display","block");
			}
	    	wenrRmaPrice("0",rma_p_p);
	    }
	    if($(this).hasClass("number-minus")){
	    	var n = parseInt(rma_p_n.text()) - 1;
		    rma_p_n.text(n);
		    if(rma_p_n.text() < 1){
				rma_p_n.css("display","none");
				$(this).css("display","none");
			}
			wenrRmaPrice("1",rma_p_p);
		}
	});
	//地址选择
	wenrAddressSelect = function(url,result){
		if($(".wenr-popup-right").length == 0){
			if(result != ""){
		    	$("body").append(result)
		    	$("html,body").addClass("on")
		    	wenrRightPopup()
		    	bgClose();
			}else{
				wenrHash("addresSelect")
				wenrAjaxUrl(url,wenrAddressSelect);
			}
		}
	}
	wenrAddressAdd = function(){
		if($(".wenr-address-add").is(":hidden")){
			var w_a_a = $(".wenr-address-add");
	    	w_a_a.fadeIn(100,function(){
	    		wenrHash("addresAdd")
				$(this).addClass("play")
			})
		}else{
			w_a_a.fadeOut(100,function(){
				wenrHash("")
				$(this).removeClass("play")
			})
		}
	}
	//右边弹出框架 2016-11-17 09:56:34
	wenrRightPopup = function(result){
		wenrAnimated("right");
	}
	//动画添加
	wenrAnimated = function(type){
		if(type == "bottom"){
			$(".wenr-popup-bottom").fadeIn(100,function(){
				$(this).addClass("play")
			})
		}
		if(type == "right"){
			$(".wenr-popup-right").fadeIn(100,function(){
				$(this).addClass("play")
			})
		}
	}
	//中心通用弹出框架
	wenrCenterPopup = function(title,con){
		if($(".wenr-popup-center").length == 0){
			bgShow("7");
			$("body").append('<div class="wenr-popup-center wenr-c wenr-time">'+
							 '<div class="wenr-p-c-title">' + title + '</div><div class="wenr-p-c-close"></div>'+
							 '<div class="wenr-p-c-con">' + con + '</div></div>')
			$(".wenr-popup-center").fadeIn(100,function(){
					$(this).addClass("play");
			})
			$(".wenr-popup-center").on("click",".wenr-p-c-close",function(){
				wenrCenterPopupClose()
			})
		}
	}
	wenrCenterPopupClose = function(){
		$(".wenr-popup-center").removeClass("play").fadeOut(100,function(){
			$(this).remove()
		});
		bgClose()
	}
	wenrFmoney = function(num)   
    {   
       num = num.toString().replace(/\$|\,/g, '');
	    if (isNaN(num))
	        num = "0";
	    sign = (num == (num = Math.abs(num)));
	    num = Math.floor(num * 100 + 0.50000000001);
	    cents = num % 100;
	    num = Math.floor(num / 100).toString();
	    if (cents < 10)
	        cents = "0" + cents;
	    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
	        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
	    num.substring(num.length - (4 * i + 3));
	    return (((sign) ? '' : '') + num + '.' + cents);
    }
	//更改hash
	wenrHash = function(id){
        window.location.hash = id;
    }
    //Ajax地址调用
	wenrAjaxUrl = function(url,f){
		$.ajax({
	        type:"get",
	        url:url,
	        dataType:"html",
	        cache:false,
	        beforeSend:function(){
	            $.loading_add();
		    },
	        success:function(result){
	            $.loading_close();
	            f(url,result)
	        }
	    })
	}
    //正则验证
	regexp = function (s,type) {
	    var objbool = false;
	    var objexp = "";
	    switch (type) {
	        case 'money': //金额格式,格式定义为带小数的正数，小数点后最多三位
	            objexp = "^[0-9]+[\.][0-9]{0,3}$";
	            break;
	        case 'numletter': //英文字母和数字组成
	            objexp = "^[0-9a-zA-Z]+$";
	            break;
	        case 'email': //邮件地址格式 
	            objexp = "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$";
	            break;
	        case 'date': //日期 YYYY-MM-DD格式
	            objexp = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
	            break;
	        case 'int': //整数 
	            objexp = "^[0-9]*[1-9][0-9]*$";
	            break;
	        case 'mobile': //手机号
	        	objexp = MOBILE = "^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\\d{8}$";
	        	break;
	    }
	    var re = new RegExp(objexp);
	    if (re.test(s)) {
	        return true;
	    }else {
	        return false;
	    }
	};
})
$.extend({
	loading_add : function(){
		var t = "<div id='wenrLoading'><div class='wenr-loading'><div class='loading-animation'></div><p class='loading-text'>数据加载中..</p></div></div>";
		if($("#loadingBox").length == 0){
			$("body").append(t);
			$(".wenr-loading").fadeIn(100);
			bgShow("7");
			$(".bglayer").removeAttr("onClick");
		    var l = $("#loadingBox"),
		        la = $(".loading-animation");
		    for(i=0;i<12;i++){
		        la.append("<div class='loading-line loading-line-" + i + "'></div>")
		    }
		}
	},
	loading_close : function(){
		$("#wenrLoading").fadeOut(200,function(){
			$(this).remove();
		})
	},
	wenrAlert : function(options){
		var defaults = {
			text: "",
			style: "warn",
			type: "prompt"
	    };
	    var settings = $.extend(defaults, options || {}),$this;
	    $_alert = '<div class="wenr-prompt wenr-time wenr-c '+ settings.style +'"><strong>'+ settings.text +'</strong></div>';
	    if($(".wenr-prompt").length == 0){
	    	$("body").append($_alert);
	    	var a = $(".wenr-prompt"),
	    		action = {
	    		close : function(){
	    			a.removeClass("play").fadeOut(30,function(){
	    				$(this).remove();
	    			})
	    		}
	    	}
	    	a.fadeIn(0,function(){
				a.addClass("play")
			})
			if(settings.type == "prompt"){
	    		setTimeout(function(){
					action.close()
	    		},1500)
	    	}
	    }
    }
});