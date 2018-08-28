/**
 * @author: llk
 * @date: 2018/7/30
 * @function: 商品详情页相关功能
 */

$(function() {
	loadDetailTabContent();
	detailViewTab($('.detail-hd-slide'));
	addToCart($('.btn-addcart'));
});

function loadDetailTabContent() {
	let tabItems = $('.detail-navbar .item');
	let detailWrap = $('.detail-wrap');
	let curIndex = 0;
	let loadUrl = [
		'/pages/components/detail/detail.html .detail-html',
		'/pages/components/detail/comment.html .detail-comment',
		'/pages/components/detail/issue.html .comment-issue'
	];

	loadDetail();

	tabItems.on('click', function() {
		let index = $(this).index();
		if(index === curIndex) {
			return;
		}
		curIndex = index;
		tabItems.removeClass('active').eq(index).addClass('active');

		switch (index) {
			case 0:
				loadDetail()
				break;
			case 1:
				loadDetailComment();
				break;
			case 2:
				loadDetailIssue()
				break;
			default: break;
		}
	});

	function loadDetail() {
		detailWrap.load(loadUrl[0], function() {
			let attrList = $('.attr-list');
			let listImgDesc= $('.list-img-des');
			$.getJSON('/api/goodDetail', function(data) {
				attrList.append(createAttrList(data.goodAttrs));
				listImgDesc.append(creatDetailImgDesc(data.goodImgUrls));
			});
		});
	}

	function loadDetailComment() {
		detailWrap.load(loadUrl[1], function() {
			console.log('success');
			tab($('.commnet-nav .label'));
		});
	}

	function loadDetailIssue() {
		detailWrap.load(loadUrl[2], function() {
			// console.log('success');
		});
	}
}

/*
以下四个函数为商品详情页详情块相关函数
*/
// 创建商品属性列表，返回一个HTML字符串
function createAttrList(goodAttrs) {
	let attrListHtml = ""
	if(!goodAttrs) {
		return attrListHtml;
	} else {
		goodAttrs.forEach(attr => {
			attrListHtml += attrItemHtml(attr.name, attr.value);
		});
	}
	return attrListHtml;
}
//商品属性html字符串模板
function attrItemHtml(name, value) {
	let attrItem = `
		<li class="item">
			<span class="name">${name}</span>
			<span class="value">${value}</span>
		</li>
	`
	return attrItem;
}

//创建详情图片描述，返回一个HTML字符串
function creatDetailImgDesc(goodImgUrls) {
	let imgDescHtml = "";
	if(!goodImgUrls) {
		return imgDescHtml;
	} else {
		goodImgUrls.forEach(url => {
			imgDescHtml += detailImgDescHtml(url);
		});
	}
	return imgDescHtml
}
//详情图片HTML字符串模板
function detailImgDescHtml(url) {
	let html = `<p><img src="${url}" /></p>`
	return html;
}

/**
 * 详情页视图切换
 * 详情页头部小图片列表onmouseover事件
 * @param  {[type]} detail [description]
 * @return {[type]}        [description]
 */
function detailViewTab(detail) {
	let largeImg = detail.find('.img-large');
	let viewList = detail.find('.view-list li');

	viewList.on('mouseover', function() {
		let index = $(this).index();
		viewList.removeClass('active').eq(index).addClass('active');
		let imgSrc =viewList.eq(index).find('.img-small').attr('src');
		largeImg.attr('src', imgSrc);
	});
}

/**
 * 添加到购物车
 */
function addToCart(startObj) {
	let btnCart = startObj;
	let isFly = false;

	/*
		点击加入购物车时，生成一架小飞机飞行购物车
	 */
	btnCart.on('click', function(event) {
		if(!isFly) {
			isFly = true;
			let cart = $('.yx-top-cart');
			let cartNum = cart.find('.cart-num');

			let start = {//计算起始点，即鼠标点击点
				x: event.pageX,
				y: event.pageY - $(document).scrollTop()
			}

			let end = {//计算结束点，即购物车的位置
				x: Math.floor(cart.offset().left + cart.width()/2),
				y: Math.floor(cart.offset().top + cart.height()/2 - $(document).scrollTop())
			}

			let fly = createFly();
			$('body').append(fly);

			$('.fly').css({
				top: start.y + 'px',
				left: start.x + 'px'
			}).velocity({
				left: end.x,
				top: end.y,
				opacity: 0.3,
				scale: 0.3
			}, {
				duration: 1700,
				complete: function(elem) {
					//动画完成，移除小飞机，购物车数量加1
					$(elem).remove();
					let num = Number.parseInt(cartNum.text());
					cartNum.velocity({
						scale: 0.1,
						opacity: 0
					}).text(num+1).velocity({
						scale: 1,
						opacity: 1
					});
					isFly = false;
				}
			});
		}
	});

	function createFly() { //小飞机的HTML代码
		return `<div class="fly"><i class="iconfont icon-fly"></i></div>`;
	}
};