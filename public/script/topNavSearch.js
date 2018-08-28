/**
 * @fn：顶部导航栏搜索功能
 * @author: llk
 * @date: 2018/8/5
 */

$(function() {

	let searchDom = $('.yx-top-search');
	search(searchDom, 'api/search_suggest', {
		searchInputWrap: searchDom.find('.yx-searchInputWrap'),
		suggestWrap: searchDom.find('.yx-suggest')
	});
});


function search(searchObj, ajaxUrl, objs = {}) {
	this.$elem = searchObj;

	let default_objs = {
		searchInputWrap: $elem.find('div*[class="searchInputWrap"]'),
		defaultKeyword: $elem.find('.default-keyword'),
		inputSearch: $elem.find('input[name="keyword"]'),
		searchButton: $elem.find('a[class="btn-search"]'),
		suggestWrap: $elem.find('div[class*="suggest"]'),
		suggestList: $elem.find('.suggest-list')
	};
	let {
		searchInputWrap,
		inputSearch,
		defaultKeyword,
		searchButton,
		suggestWrap,
		suggestList
	} = $.extend({}, objs, default_objs);

	let keywordList = [];

	/*
		搜索输入框点击时，输入框获得焦点，默认推荐的关键词隐藏，关键词推荐面板显示;
		搜索框获得焦点时，如果输入为空或不输入或变为空，关键词推荐面板显示，默认推荐的关键词显示；
		关键词推荐面板中的推荐词条被点击时，被点击的词条称为搜索框的值，并隐藏关键词推荐面板；
	 */
	defaultKeyword.on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();

		inputSearch.focus();
		inputFocusEventHandle();
	});

	inputSearch.on('focus', function(event) {
		event.preventDefault();
		event.stopPropagation();

		inputFocusEventHandle();
	});

	inputSearch.on('blur', function(event) {
		event.preventDefault();
		event.stopPropagation();

		!$(this).val() && defaultKeyword.show();
	});

	inputSearch.on('input', function(event) {
		event.stopPropagation();
		let sl = suggestWrap.find('.sl-item');
		inputEventHandle($(this).val(), sl);
	});

	$(document).on('click', function(event) {
		// event.preventDefault();
		event.stopPropagation();

		suggestWrap.hide();
	});


	//隐藏推荐关键词，显示推荐关键词面板
	this.inputFocusEventHandle = function() {
		defaultKeyword.hide();
		suggestWrap.show();
		suggestWrap.find('.sl-item').show();
	};

	//显示推荐关键词，隐藏推荐关键词面板
	/*this.inputBlurEventHandle = function(isHideDk = false) {
		//如果搜索框的值不为空，则显示推荐关键词；否则隐藏
		!isHideDk && defaultKeyword.show();
		// suggestWrap.hide();
	};*/


	//搜索框键盘keypress事件
	this.inputEventHandle = function(value, sl) {
		sl.css('display', 'block');
		suggestWrap.show();
		keywordList.map((val, index) => {
			if(val.startsWith(value)){
				sl.eq(index).show();
				// return index;
			} else {
				sl.eq(index).hide();
			}
		});
	};

	//通过ajax加载默认推荐关键词
	this.loadDefaultKeyword = function() {
		$.get(ajaxUrl, function(data) {
			let default_keyword = data.filter(v => {
				return !!v.isDefault;
			}).pop();
			// console.log(default_keyword);
			defaultKeyword.text(default_keyword.keyword);
		}, 'json');
	};

	//通过ajax加载推荐关键词面板
	this.loadSuggestKeyword = function() {
		$.get(ajaxUrl, function(data) {
			let suggest_keyword = data.filter(v => {
				return !v.isDefault;
			});

			let items = '';
			suggest_keyword.forEach(keyword => {
				items += addSuggestKeyword(keyword);
				keywordList.push(keyword.keyword);
			});
			suggestList.children('.sl-item').remove();
			suggestList.append(items);

			addClickEventWithSuggestKeyword();
			// console.log(keywordList);
		});
	};

	//添加推荐关键词条
	this.addSuggestKeyword = function(item) {
		let keywordItem = `<li class="sl-item ${(item.isHighlight)?'highlight':''}">
						<span class="sl-item-txt">${item.keyword}</span>
					</li>`;

		return keywordItem;
	};

	//为推荐的搜索关键词添加点击事件
	this.addClickEventWithSuggestKeyword = function() {
		let keywords = suggestList.children('.sl-item');
		keywords.on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			let keyword = $(this).text().trim();
			inputSearch.val(keyword);
			defaultKeyword.hide();
			suggestWrap.hide();
		});
	}

	//初始化，页面加载完就调用的方法
	this.init = function() {
		loadDefaultKeyword();
		loadSuggestKeyword();
	};
	init();
}