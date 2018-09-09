/**
 * @author: llk
 * @dare: 2018/8/24
 * @function: 付款页
 */

$(function() {
	goPayClickHandler();
});

function goPayClickHandler(opt = {}) {
	let { alipay } = opt;
	let method = -1;

	let $toPayBtn = $('#go-pay');
	let $payMethods = $('input[name="methods"]');
	// console.log($payMethods);

	let weixinTip = `<p class="txt-center">呀！微信支付正在赶来的路上！！！</p>`;
	let wyTip = `<p class="txt-center">呀！网易支付罢工了！！！</p>`;
	let emptyTyp = `<p class="txt-ceneter">不选点什么吗？</p>`

	$payMethods.off('click').on('click', function() {
		// console.log($(this));
		method = parseInt($(this).val());
		// console.log(method);
	});

	$toPayBtn.off('click').on('click', function() {
		//console.log(method);
		switch(method) {
			case -1:
				dialogTip(emptyTyp);
				break;
			case 0:
				self.location = '/pages/pay/alpay.html';
				break;
			case 1:
				dialogTip(weixinTip);
				break;
			case 2:
				dialogTip(wyTip);
				break;
		}
	});

	remainTime()
}

function dialogTip(tip) {
	let $fixedModal = $('.fixed-modal');
	let $payTip = $('#payTip');
	let $close = $fixedModal.find('.close');

	$payTip.html(tip);
	$fixedModal.velocity('fadeIn', 500);

	$close.off('click').on('click', function() {
		$fixedModal.velocity('fadeOut', 500);
	});
}

//倒计时
function remainTime() {
	let $remainTime = $('.remain-time');
	let $toPayBtn = $('#go-pay');

	let aimtime = storage.get('downTIme');
	if(!aimtime) return;
	let time = aimtime - new Date().getTime();
	let timer = null;

	$remainTime.text(formatTime(time));
	$toPayBtn.removeClass('btn-disabled');

	timer = setInterval(function() {
		time = aimtime - new Date().getTime();
		if(time <= 0) {
			$toPayBtn.off('click').addClass('btn-disabled');
			storage.remove('downTIme');
			clearInterval(timer);
		}
		$remainTime.text(formatTime(time));
	}, 1000);
}

//计算时分秒
function countTime(time) {
	let h = parseInt(time / 3600000); //hour
	let m = parseInt(time / 60000);   //minute
	let s = parseInt((time - (m * 60000)) / 1000);//second
	return {h, m, s}
}

//格式化时分秒
function formatTime(time) {
	let {h, m, s} = countTime(time);
	m = m<10 ? '0'+m : m;
	s = s<10 ? '0'+s : s;

	return (h <= 0) ? (m + '分' + s + '秒') : (h + '时' + m + '分' + s + '秒');
}