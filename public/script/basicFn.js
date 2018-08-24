/**
 * @fn：基础通用功能
 * @author: llk
 * @date: 2018/8/2
 */

$(function() {
	let returnBtn = $('.return-top'); //返回顶部按钮

	showReturnTop(returnBtn);
	returnTop(returnBtn);
});


/**
 * 返回顶部，以减速形式返回顶部
 * @param  {[type]} returnBtn [触发返回顶部事件的按钮]
 * @return {[type]}           [description]
 */
function returnTop(returnBtn) {
	let interval = null;
	let returnFlag = false;

	returnBtn.on('click', function() {
		if(!returnFlag) {
			returnFlag = true;
			interval = setInterval(function() {
				let scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
					stopMove = true,
					speed = scrollTop/5;
				speed = speed>0?Math.ceil(speed):Math.floor(speed);
				if(scrollTop > 0)
					stopMove = false;

				$(document).scrollTop(scrollTop - speed);
				if(stopMove) {
					returnFlag = false;
					clearInterval(interval);
				}
			},30);
		}
	});
}

/**
 * 返回顶部按钮显示与隐藏
 * @param  {[type]} returnBtn [返回顶部按钮]
 * @return {[type]}           [description]
 */
function showReturnTop(returnBtn) {
	$(window).on('scroll', function() {
		let scrollTop = $(this).scrollTop();
		if(scrollTop > 100) {
			returnBtn.show();
		} else {
			returnBtn.hide();
		}
	});
}

function tab(btn, content) {
	btn.on('click', function() {
		let index = $(this).index();
		btn.removeClass('active').eq(index).addClass('active');
		content.removeClass('show').eq(index).addClass('show');
	});
}




