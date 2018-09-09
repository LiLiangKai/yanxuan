/**
 * @author: llk
 * @date: 2018/9/3
 * @function: 搜索也
 */

(function(global, factory) {
	global.search = factory();
})(window, function() {
	function createItem(data) {
		let itemHtml = "";
		if(data) {
			let isTag = '';
			if(data.tag) {
				isTag = `<span class="tag tag-other">${data.tag}</span>`;
			}

			itemHtml =
			`<div class="product-item good-item">
				<div class="item-hd">
					<a href="/pages/item/detail.html?id=${id}" target="_blank" title="${data.name}">
						<div style="width: 100%; height: 100%"><img class="img img-noload img-small" src="${data.pic}" alt="${data.name}"></div>
					</a>
				</div>
				<div class="item-bd">
					<div class="item-tags">`
						+ isTag +
					`</div>
					<div class="item-name">
						<a href="/pages/item/detail.html?id=${id}" target="_blank" title="${data.name}">${data.name}</a>
					</div>
					<div class="item-price">
						<span class="price">¥${data.price}</span>
					</div>
					<div class="item-desc">${data.desc}</div>
				</div>
			</div>`;
		}

		return itemHtml;
	}

	return createItem;
});