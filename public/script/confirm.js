/**
 * @author: llk
 * @date: 2018/8/24
 * @function: 付款确认页相关函数
 */

$(function() {
gotoPay()
});

function gotoPay(opt={}) {
	let defaultOpt = {
		payUrl: '/pages/order/topay.html'
	}
	let {payUrl} = Object.assign({}, defaultOpt, opt);

	let gotoPayBtn = $('.goto-pay');
	let $totalPay = $('#totalPrice');

	gotoPayBtn.on('click', function() {
		let totalPay = $totalPay.text();
		if(!storage.get('downTIme')) {
			let time = new Date().getTime() + 3600*1000;
			storage.save('downTIme', time);
			storage.save('totalPay', totalPay);
		}
		self.location = payUrl;
	});
}