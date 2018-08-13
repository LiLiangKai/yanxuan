/**
 * @author: llk
 * @date: 2018/7/30
 * @function: 头部导航栏动态变化
 */

$(function() {
	let mainBody = $('#yx-body');
	let navTabDropdown = $('.yx-tab-dropdown');
	let tabNavs = $('.yx-tabnavs');
	let topTabnavs = $('.top-tabnavs');
	let topSearch = $('.yx-top-search');
	let searchInputWrap = $('.yx-searchInputWrap');

	let tabNavsTop = tabNavs.offset().top;

	resizeNavTabDropdownLeft($(window).outerWidth());
	hideSearchWrapWithFixed();

	// 窗口大小改变事件
	$(window).on('resize', function() {
		let width = $(this).outerWidth();
		resizeNavTabDropdownLeft(width);
	});

	//窗口滚动
	$(window).on('scroll', function() {
		let scrollTop = $(this).scrollTop();
		addClassToTabnavs(scrollTop);
	});

	/**
	 * 为顶部导航添加类yx-tabnavs-fixed，使之在窗口滚动到某个位置时更改样式
	 * @param {[type]} top 通常是滚动条相对窗口顶部的距离
	 */
	function addClassToTabnavs(top) {
		if(Math.floor(tabNavsTop - top) > 1) {
			if(topTabnavs.hasClass('yx-tabnavs-fixed')) {
				/*解除顶部导航栏固定状态*/

				$('.yx-tabnavs-fixed .yx-searchButton').off('click');
				searchInputWrap.show();//搜索容器显示
				topSearch.css('zIndex', 5);

				topTabnavs.removeClass('yx-tabnavs-fixed');
				mainBody.css('marginTop', 0);
				resizeNavTabDropdownLeft($(window).outerWidth());

			}
		} else if(Math.floor(tabNavsTop - top) <= 0) {
			if(!topTabnavs.hasClass('yx-tabnavs-fixed')) {
				/*将顶部导航栏设置为固定状态*/

				topTabnavs.addClass('yx-tabnavs-fixed')
					.css('top', '-60px')
					.animate({top: '0'}, 300);
				mainBody.css('marginTop', '200px');
				resizeNavTabDropdownLeft($(window).outerWidth());

				searchInputWrap.hide();//隐藏搜索容器
				topSearch.css('zIndex', 0);

				//为搜索按钮添加点击事件，当点击时，搜索容器显示
				$('.yx-tabnavs-fixed .yx-searchButton').on('click', function() {
					searchInputWrap.show();
					topSearch.css('zIndex', 5);
				});
			}
		}
	}

	/**
	 * 设置顶部导航选项的下拉面板宽度适应窗口变化
	 * @param  {[type]} width [description]
	 * @return {[type]}       [description]
	 */
	function resizeNavTabDropdownLeft(width) {
		let left = Math.ceil(tabNavs.offset().left);
		if(left > 0)
			return navTabDropdown.css({
				left: -left + 'px',
				width: width
			});
		else
			return navTabDropdown.css({
				left: 0 + 'px',
				width: width
			});
	}

	/**
	 * 当导航栏处于固定状态，搜索框处于展示状态时，隐藏搜索框方法
	 * @return {[type]} [description]
	 */
	function hideSearchWrapWithFixed() {
		let hideBtn = $('.fixed-hide-search-wrap');
		hideBtn.on('click', function() {
			topSearch.css('zIndex', 0);
			searchInputWrap.hide();
		});
	}
});