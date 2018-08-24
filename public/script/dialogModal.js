/**
 * @author: llk
 * @date: 2018/8/5
 * @function: 模态框相关功能
 */

//加载模态框
function loadModal() {
	let fixedModal = $('.fixed-modal');
	let modalWrap = fixedModal.children('.modal-wrap');
	let tiggerBtn = $('[data-tigger]');//触发模态框的按钮

	tiggerBtn.on('click', function() {
		let type = $(this).attr('data-tigger'); //模态框类型
		let isload;

		// console.log(type);
		switch(type) {
			case 'login':// 登录模态框
				/*
					判断当前模态框是否有该组件，
					如果没有，加载；
					如果有，显示
				 */
				isload = !modalWrap.find('.yx-login-wrap').length;
				if(isload) {
					modalWrap.load('/pages/components/modal/login.html .yx-login-wrap', function() {
						let closeBtn = modalWrap.find('.close');
						closeModal(closeBtn);
					});
				}

				fixedModal
					.css('display', 'block')
					.velocity({opacity: 1});
				break;
			case 'address': //添加地址模态框
				isload = !modalWrap.find('.address-modal').length;
				if(isload) {
					modalWrap.load('/pages/components/modal/address.html .address-modal', function() {
						let closeBtn = modalWrap.find('.close');
						closeModal(closeBtn);
						loadProvinceCityDistrict();
						addressHandler(modalWrap.find('.address-modal'));

					});
				} else {
					clearForm()
				}

				fixedModal
					.css('display', 'block')
					.velocity({opacity: 1});
				break;
			case '':
				break;
		}

	});

	//模态框关闭按钮点击事件
	function closeModal(btn, fn) {
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