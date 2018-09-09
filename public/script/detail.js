/**
 * @author: llk
 * @date: 2018/7/30
 * @function: 商品详情页相关功能
 */

$(function() {
	loadDetailTabContent();
	detailViewTab($('.detail-hd-slide'));
	addToCart($('.btn-addcart'));
	setDetailNavbarFixed();
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
	let timer = null;

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

					clearTimeout(timer);
					showCart(timer);
				}
			});
		}
	});

	function createFly() { //小飞机的HTML代码
		return `<div class="fly"><i class="iconfont icon-fly"></i></div>`;
	}
};

function showCart(timer) {
	let cartPanel = $('.cart-show-panel');
	let cartBlock = $('.yx-top-cart');

	cartPanel.fadeIn(100);
	hide();

	cartBlock.off('mouseover').on('mouseover', function() {
		cartPanel.fadeIn(100);
		clearTimeout(timer);
	});

	cartBlock.off('mouseout').on('mouseout', function() {
		hide();
	});

	function hide() {
		timer = setTimeout(function(){
			cartPanel.fadeOut(100);
		}, 2000);
	}
}

/**
 * 详情页相关模板函数
 */
//评论导航
function commentTypeHtml(tagInfos) {
	let tags = '';
	tagInfos.map((item, index) => {
		tags += commentTypeTagLabelHtml(item, index);
	});
	return `<div class="title">大家都在说：</div>
			<div class="label-list">`
				+ tags +
			`</div>`
}

//评论类型
function commentTypeTagLabelHtml(item, index) {
	let isActive = index == 0 ? 'active' : '';
	return `<span class="label ${isActive}" data-name="${item.name}">${item.name}(${item.count})</span>`
}

//评论星级
function commentStarHtml(num) {
	let star = '';
	for(let i=0; i<num; i++) {
		star += `<span class="iconfont icon-collected star"></span> `;
	}
	return star;
}

//好评率
function goodRateHtml(goodInfos) {
	if(!goodInfos)
		return '';

	return `<div class="label">好评率</div>
	<div class="good-rate">${goodInfos.goodRate}</div>
	<div class="star-wrap">`
		+ commentStarHtml(goodInfos.star) +
	`</div>`
}

//评论区头
function commentHdHtml(data) {
	if(!data)
		return '';

	let goodRates = $('.good-rates');
	let commnetNav = $('.commnet-nav');

	goodRates.empty().append(goodRateHtml(data.goodInfos));
	commentNav.empty().append(commentTypeHtml(data.tagInfos));
}

//评论项
function commentItemHtml(commentInfo) {
	if(!commentInfo) {
		return '';
	}

	let stars = commentStarHtml(commentInfo.comStar);
	let comPic = commentItemPic(commentInfo.comPic);
	let replay = '';
	if(commentInfo.comReply) {
		replay = `<div class="reply">
					<div class="service-name yx-ibt">小选回复:</div>
					<div class="content yx-ibt">${commentInfo.comReply}</div>
				</div>`;
	}

	let html =
	`<li class="com-item">
		<div class="com-user yx-ibt">
			<div class="avator-wrap">
				<img src="${commentInfo.userAvatar}" class="avator-img">
				<div class="mask"></div>
			</div>
			<div class="username">${commentInfo.userName}</div>
		</div>
		<div class="com-content yx-ibt">
			<div class="star-wrap">` + stars + `</div>
			<div class="content">${commentInfo.content}</div>
			<ul class="pic-list">`
				+ comPic +
			`</ul><div class="pulish-time">2018-05-23 18:07</div>`
				+ replay +
		`</div></li>`;
	return html;
}

//评论图片向
function commentItemPic(comPic) {
	let html = '';

	if(!comPic || comPic.length <= 0) {
		return html;
	}

	comPic.forEach(src => {
		html += `<li class="pic-item">
					<div class="before"></div>
					<img src="${src}" class="img">
				</li>`;
	});

	return html;
}

//分页
function pagerNav(pageInfo) {
	let {curpage, size, totalPage, total} = pageInfo;

	let prev =
		`<a href="javascript:;" data-page="${curpage - 1}" class="page ${curpage-1<=0 ? 'disabled':''}">
			<i class="iconfont icon-prev"></i>上一页
		</a>`;
	let page = ''
	for(let i=1; i<=totalPage; i++) {
		page += `<a href="javascript:;" data-page="${i}" class="page ${i==curpage ? 'selected':''}">${i}</a>`
	}
	let next =
		`<a href="javascript:;" data-page="${curpage+1}" class="page ${curpage+1 == totalPage ? 'disabled':''}">
			下一页<i class="iconfont icon-next"></i>
		</a>`;
	return prev + page + next;
}

//详情页内容区导航设置
function setDetailNavbarFixed() {
	let detailNavbar = $('.detail-navbar');
	let timer = null;
	let isflag = false;

	$(document).on('scroll', function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			// console.log($(this).scrollTop());
			if($(this).scrollTop() >= 1200 && !isflag) {
				//console.log($('.yx-tabnavs-fixed'));
				$('.yx-tabnavs-fixed').velocity({
					translateY: -60
				}, {
					duration: 300,
					complete(elem) {
						detailNavbar.addClass('fixed-detail-navbar').css('top', '-50px');
						detailNavbar.velocity({
							top: 0
						}, {
							duration: 300
						});
						isflag = true;
					}
				});
			} else if($(this).scrollTop() < 1200 && isflag) {
				if(detailNavbar.hasClass('fixed-detail-navbar')) {
					detailNavbar.removeClass('fixed-detail-navbar');
					$('.yx-tabnavs-fixed').velocity({
						translateY: 0
					}, {
						duration: 300,
						complete() {
							isflag = false;
						}
					});
				}
			}
		}, 70);
	});
}