(function($) {
	$(document).ready(function() {
/*		$(".menu1").click(function(){
			//$(this).removeClass("slt");
			if($(this).next('ul').is(":hidden")) {
				//$(this).addClass("slt");
				$(this).next('ul').slideDown(300);
			}else {
				$(this).next('ul').slideUp(300);
			}
		});
*/
		//팝업창 닫기
		$(".lp_close").click(function(e) {
			e.preventDefault();
			$(this).parents('.layer').hide();
			$.dimPopup.layerClose();
		});

/*		
		// sub menu 열고/닫기
		$('.add_txt').mouseover(function(){
			$('.detail_nav').addClass("view_addtxt");
		});	
		$('.add_txt').mouseout(function(){
			$('.detail_nav').removeClass("view_addtxt");
		});	

		//div창 접기/펼치기
		$(".input_view").click(function(){
			$("#" + $(this).attr("id") + "_table").toggle();
			if($("#" + $(this).attr("id") + "_table").css('display') == 'none') {
				$(this).find("img").attr("src", "../resources/images/btn_show.gif");
			}else {
				$(this).find("img").attr("src", "../resources/images/btn_hide.gif");
			}
		});*/
	});


	// 레이어 띄우기
	var layer, layerBg;

	$.dimPopup = $({});
	$.dimPopup.init = function(){
		layer = new createLayer();
		layerBg = new createLayerBg();
	}
	$.dimPopup.layerOpen = function( ele ){
		layerBg.open();
		layer.open( ele );
	}
	$.dimPopup.layerClose = function(){
		layerBg.close();
		layer.close();
	}
	//레이어팝업 추가 close
	$.dimPopup.elelayerClose = function(ele){
		layerBg.close();
		layer.eleclose(ele);
	}
	
	$.fn.dimPopup = function(){
		return this.each(function(){
			
		});
	}
	
	// 레이어생성함수
	function createLayer(){
		var $layer = "";
		
		this.open = function(ele){
			$layer = $(ele);
			$layer.fadeIn("slow");
			this.position();
			$(window).bind("resize.dimPopup", this.position);
		}
		
		this.close = function(){
			if( $layer ){
				$layer.fadeOut("slow");
				$layer = "";
			}
			$(window).unbind("resize.dimPopup");
		}
		//레이어팝업 추가 close
		this.eleclose = function(ele){
			$layer = $(ele);
			if( $layer ){
				$layer.fadeOut("slow");
				$layer = "";
			}
			$(window).unbind("resize.dimPopup");
		}
		
		this.position = function(){
			var scrollTop = $(document).scrollTop(),
				scrollLeft = $(document).scrollLeft(),
				t = scrollTop + $(window).height()/2 - $layer.outerHeight(true)/2,
				l = scrollLeft + $(window).width()/2 - $layer.outerWidth(true)/2;

			$layer.css({
				position : "absolute",
				top : t < scrollTop ? scrollTop : t,
				left : l < scrollLeft ? scrollLeft : l,
				zIndex : 10001
			});
		}
	}

	// 배경레이어생성함수
	function createLayerBg(){
		var $bg = $('<div id="evtSandara-layerBg"></div>')
			.css({
				display : "none",
				position : "absolute", top : 0, left : 0,
				width : $(document).width(), height : $(document).height(),
				background : "black", opacity : .0, zIndex : 10000 
			})
			.appendTo("body");

		this.open = function(){
			if( $bg.is(':hidden') ){
				$bg.css({ display : "block", opacity : 0 }).animate({ opacity : .5 }, "slow");
				//$("select").css({ visibility : "hidden" });
				
				this.position();
				$(window).bind("resize.dimPopupBg", this.position);
			}
		}
		this.close = function(){
			if( $bg.is(':visible') ){
				$bg.fadeOut("slow");
				$("select").css({ visibility : "" });
			}
			$(window).unbind("resize.dimPopupBg");
		}

		this.position = function(){
			$bg.css({
				top : 0,
				left : 0,
				width : $(".content_wrap").width(),
				height : $(document).height()
			});
		}
	}

	/* tabmenu */
	$.fn.tabMenu = function(num) {
		var hook = $(this).find('a');
		var firstNum = (num) ? num : 0;
		var locationNum = firstNum;

		$.each(hook, function(i) {
			if(hook.eq(i).attr('href').replace('#', '').length > 0 && i != firstNum)	{
				$(hook.eq(i).attr('href')).hide();
			}
			hook.eq(firstNum).addClass('on');
		});

		hook.click(function(){
			var objThisNum = hook.index(this);

			if (hook.attr('href').replace('#', '').length > 0) {
				$.each(hook, function(i) {
					$(hook.eq(i).attr('href')).hide();
					$(this).removeClass('on');
				});
			}
			$(hook.eq(objThisNum).attr('href')).show();
			hook.eq(objThisNum).addClass('on');

			locationNum = objThisNum;
			$(".tab_title").html($(this).html());
			return false;
		});
	};

})(jQuery);


