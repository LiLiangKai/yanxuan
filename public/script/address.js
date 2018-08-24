/**
 * @author: llk
 * @date: 2018/8/21
 * @function: 地址管理相关功能
 */

/**
 * 地址管理相关表单事件
 * @param  {[type]} modal [description]
 * @return {[type]}       [description]
 */
function addressHandler(modal) {
	let addrForm = modal.find('.addrForm');

	//添加地址表单相关字段
	let obj = {
		province: addrForm.find("select[name='province']"),
		city: addrForm.find("select[name='city']"),
		area: addrForm.find("select[name='area']"),
		address: addrForm.find("textarea[name='address']"),
		receiver: addrForm.find("input[name='receiver']"),
		mobile: addrForm.find("input[name='mobile']"),
		defaultAddress: addrForm.find("input[name='defaultAddress']")
	};
	// console.log(obj)

	let comfirm = addrForm.find('.btn-comfirm');

	//对应错误信息
	let errorMsgs = {
		province: '省不能为空',
		city: '市不能为空',
		area: '区不能为空',
		address: '详细地址不能为空',
		receiver: '收货人不能为空',
		mobile: '手机号不能为空',
		mobileRegErr: '手机号格式错误',
		addressRegErr: '详细地址不正确'
	};

	//表单字段值信息
	let address = {
		province: '',
		city: '',
		area: '',
		address: '',
		receiver: '',
		mobile: '',
		isDefault: '',
	}

	//相关正则
	let regular = {
		mobile: /^[1][3,4,5,7,8][0-9]{9}$/g, //手机
	}

	//遍历obj对象，为每个表单字段添加onchange事件
	for(let key of Object.keys(obj)) {
		//设置默认 字段不需要添加onchange事件
		if(key === 'isDefault') break;

		obj[key].on('change', function() {
			//移除错误提示
			obj[key].siblings('.error-msg').remove();

			if(!obj[key].val()) {
				//如果对应字段为空，则显示错误提示
				obj[key].after(errorMsgTip(errorMsgs[key]));
			}
		});
	}

	//确认按钮点击事件
	comfirm.on('click', function() {
		let isSubmit = true;

		//遍历循环address对象
		for(let key of Object.keys(address)) {
			//为address对象的每个属性赋值，值为obj对象中对应表单字段的值
			if(key === 'isDefault') {
				address.isDefault = obj.defaultAddress.prop('checked');
				continue;
			}
			address[key] = obj[key].val();

			//判断address对应属性值是否为空，若为空，显示错误提示
			if(!address[key]) {
				isSubmit = false;
				obj[key].siblings('.error-msg').remove();
				obj[key].after(errorMsgTip(errorMsgs[key]));
			} else {
				isSubmit = true;
				obj[key].siblings('.error-msg').remove();

				if(key === 'mobile') {
					if(!regular.mobile.test(address[key])) {
						isSubmit = false;
						obj[key].after(errorMsgTip(errorMsgs.mobileRegErr));
					}
				}
			}
		}

		if(isSubmit) {
			addrForm.submit();
			/*$.get('/pages/user/address.html', address, function(data) {
				console.log(data);
				$('.fixed-modal').velocity({
					opacity: 0
				}, {
					complete(elem) {
						$(elem).css('display', 'none');
						clearForm();
					}
				});
			}, 'json');*/
		}
	});
}

/**
 * 生成错误信息提示html字符串
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
function errorMsgTip(msg) {
	let errorHTML =
		`<div class="error-msg">
			<i class="iconfont icon-tip"></i>
			<span class="error-txt">${msg}</span>
		</div>`;
	return errorHTML;
}


/**
 * 清除表单填写字段
 * @return {[type]} [description]
 */
function clearForm() {
	let addrForm = $('.addrForm')[0];
	addrForm.reset();
}

/**
 * 加载省市区下拉列表
 * @param  {Object} obj [description]
 * @return {[type]}     [description]
 */
function loadProvinceCityDistrict(obj={}) {
	let default_obj = {
		province: $('select[name="province"]'),
		city: $('select[name="city"]'),
		area: $('select[name="area"]')
	}

	let {province, city, area} = $.extend({}, default_obj, obj);

	loadDate().then(datas => {
		let {provinces, cities, areas} = datas;
		let provinceOptions = optionHTML(provinces);

		province.append(provinceOptions);
		provinceChangeHandler(cities, areas);
	});

	/**
	 * 省会下拉列表框change事件触发函数
	 * @param  {[type]} cityData [description]
	 * @param  {[type]} areaData [description]
	 * @return {[type]}          [description]
	 */
	function provinceChangeHandler(cityData, areaData) {
		province.on('change', function(e) {
			/*
			根据选取的省会id编号获取对应的城市，
			并生成option选项列表，再将其添加到城市下拉列表框中。
			 */
			let provinceId = this.options[this.options.selectedIndex].getAttribute('data-id');

			if(!!provinceId) {
				let cities = cityData[provinceId];
				let cityOptions = optionHTML(cities);

				city.children(':not(:first-child)').remove();
				city.append(cityOptions);
				cityChangeHandler(areaData);
			} else {
				city.children(':not(:first-child)').remove();
				area.children(':not(:first-child)').remove();
			}
		});
	}

	/**
	 * 城市下拉列表框change事件触发函数
	 * @param  {[type]} areaData [地区数据]
	 * @return {[type]}          [description]
	 */
	function cityChangeHandler(areaData) {
		city.on('change', function(e) {
			/*
			根据选取的城市id编号获取对应的地区，
			并生成option选项列表，再将其添加到地区下拉列表框中。
			 */
			let cityId = this.options[this.options.selectedIndex].getAttribute('data-id');

			if(!!cityId) {
				let areas = areaData[cityId];
				let areaOptions = optionHTML(areas);

				area.children(':not(:first-child)').remove();
				area.append(areaOptions);
			} else {
				area.children(':not(:first-child)').remove();
			}
		});
	}

	/**
	 * 生成下拉列表选项列表
	 * @param  {[type]} data [生成option列表的数据]
	 * @return {[type]}      [返回option列表字符串]
	 */
	function optionHTML(data) {
		let options = '';
		if(!!data)
			data.forEach(item => {
				options += `<option value="${item.name}" data-id="${item.id}">${item.name}</option>`
			});

		return options;
	}
}

/**
* 异步加载省市区数据
* @return {[type]} [description]
*/
async function loadDate() {
	let provinces = await new Promise((resolve) => {
		$.getJSON('/api/province', function(data) {
			resolve(data);
		});
	});
	let cities = await new Promise((resolve) => {
		$.getJSON('/api/city', function(data) {
			resolve(data);
		});
	});
	let areas = await new Promise((resolve) => {
		$.getJSON('/api/area', function(data) {
			resolve(data);
		});
	});
	return {
		provinces,
		cities,
		areas
	}
}

