$(function() {
	loadDetailTabContent();
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
			// let attrList = $('.attr-list');
			// let listImgDesc= $('.list-img-des');
			// $.getJSON('/api/goodDetail', function(data) {
			// 	attrList.append(createAttrList(data.goodAttrs));
			// 	listImgDesc.append(creatDetailImgDesc(data.goodImgUrls));
			// });
		});
	}

	function loadDetailComment() {
		detailWrap.load(loadUrl[1], function() {
			// console.log('success');
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

