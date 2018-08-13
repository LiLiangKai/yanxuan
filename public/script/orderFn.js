$(function() {
	loadOrderTabContent();
});

/**
 * 通过load加载订单页面选项卡内容
 * @return {[type]} [description]
 */
function loadOrderTabContent() {
	let curIndex = 0;
	let tabBtn = $('.order-list .item');
	let orderPanel = $('.order-panel'); //待插入选项卡内容的容器
	let panelComponentUrl = [
		'/pages/components/order/orderItem.html .order-wrap',
		'/pages/components/order/waitPay.html .order-wrap',
		'/pages/components/order/waitSend.html .order-wrap',
		'/pages/components/order/sended.html .order-wrap',
		'/pages/components/order/waitComment.html .order-wrap'
	]; //选项卡内容载入路径数组

	loadOrderItem();

	tabBtn.on('click', function() {
		let index = $(this).index();
		if(index === curIndex) {
			//如果点击的是当前处于激活状态的按钮，不做任何动作
			return;
		}
		tabBtn.removeClass('active').eq(index).addClass('active');
		curIndex = index;

		switch(index) {
			case 0:
				loadOrderItem();
				break;
			case 1:
				loadWaitPay();
				break;
			case 2:
				loadWaitSend();
				break;
			case 3:
				loadSended();
				break;
			case 4:
				loadWaitComment();
				break;
			default:
				break;
		}
	});

	//加载全部订单内容
	function loadOrderItem() {
		orderPanel.load(panelComponentUrl[0], function() {
			orderPanel.show(200);
		});
	}

	//加载待付款内容
	function loadWaitPay() {
		orderPanel.load(panelComponentUrl[1], function() {
			orderPanel.show(200);
		});
	}

	//加载待发货内容
	function loadWaitSend() {
		orderPanel.load(panelComponentUrl[2], function() {
			orderPanel.show(200);
		});
	}

	//加载已发货你内
	function loadSended() {
		orderPanel.load(panelComponentUrl[3], function() {
			orderPanel.show(200);
		});
	}

	//加载待评论内容
	function loadWaitComment() {
		orderPanel.load(panelComponentUrl[4], function() {
			orderPanel.show(200);
		});
	}
}