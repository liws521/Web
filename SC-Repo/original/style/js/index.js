    /*banner start*/
	/*banner_left start*/
	var setInter=null;
	var _index=0;
	$(".banner_left_right ul li").mouseover(function(){
			clearInterval(setInter);
			_index=$(this).index();
			$(".banner_left_right .hover").stop(true).animate({top:_index*71+15},500);
			$(".banner_left_left ul li").eq(_index).fadeIn().siblings("li").fadeOut();
	    });
		$(".banner_left_right ul li").mouseout(function(){
		autoplay();
		});
		$(".banner_left_left ul li").hover(function(){
			clearInterval(setInter);
			},function(){
			autoplay();
		});
		$(".banner_left_right .hover").hover(function(){
			clearInterval(setInter);
			},function(){
			autoplay();
		});
	function autoplay(){
		setInter=setInterval(function(){
		_index++;
		if (_index>3)
		{	
			_index=0;
			$(".banner_left_right .hover").stop(true).animate({top:_index*71+15},500);
			$(".banner_left_left ul li").eq(_index).fadeIn().siblings("li").fadeOut();
		}else{
			$(".banner_left_right .hover").stop(true).animate({top:_index*71+15},500);
			$(".banner_left_left ul li").eq(_index).fadeIn().siblings("li").fadeOut();
		}
		},2000);
	}
	autoplay();
	/*banner_left end*/
	/*banner end*/