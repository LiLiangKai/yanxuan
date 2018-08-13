/**
 * @fn：基础通用功能
 * @author: llk
 * @date: 2018/8/2
 */

$(function() {
	let returnBtn = $('.return-top'); //返回顶部按钮

	showReturnTop(returnBtn);
	returnTop(returnBtn);

	loadModal();
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


//加载模态框
function loadModal() {
	let fixedModal = $('.fixed-modal');
	let modalWrap = fixedModal.children('.modal-wrap');
	let tiggerBtn = $('[data-tigger]');//触发模态框的按钮

	tiggerBtn.on('click', function() {
		let type = $(this).attr('data-tigger'); //模态框类型
		// console.log(type);
		switch(type) {
			case 'login':// 登录模态框
				/*
					判断当前模态框是否有该组件，
					如果没有，加载；
					如果有，显示
				 */
				let isload = !modalWrap.find('.yx-login-wrap').length;
				if(isload)
					modalWrap.load('/pages/components/modal/login.html .yx-login-wrap', function() {
						let closeBtn = modalWrap.find('.close');
						closeModal(closeBtn);
					});

				fixedModal
					.css('display', 'block')
					.velocity({opacity: 1});
				break;
			case 2:
				break;
			case 3:
				break;
		}

	});

	//模态框关闭按钮点击事件
	function closeModal(btn) {
		return btn.on('click', function() {
			fixedModal.velocity({
				opacity: 0
			}, {
				complete(elem) {
					$(elem).css('display', 'none');
				}
			});
		});
	}
}

