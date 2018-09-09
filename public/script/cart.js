/**
 * @author: llk
 * @date: 2018/8/20
 * @function: 购物车相关功能
 */

$(function() {
	cartHandler();
});

/**
 * 购物车类
 */
class Cart {
	constructor(id, price) {
		this.cartId = id;   //商品id
		this.goodImg = '';  //商品图片
		this.goodName = ''; //商品名字
		this.goodSpec = ''; //商品规格
		this.goodNumber = 1;   //商品数量
		this.goodSinglePrice = parseFloat(price); //商品单价
		this.goodAllPrice = this.goodNumber * this.goodSinglePrice; //小计
	}
	set setGoodImg(src) {
		this.goodImg = src;
	}
	set setGoodName(name) {
		this.goodName = name;
	}
	set setGoodSpec(spec) {
		this.goodSpec = spec;
	}
	set setGoodNumber(num) {
		this.goodNumber = num;
		this.goodAllPrice = this.goodNumber * this.goodSinglePrice;
	}
	get getGoodAllPrice() {
		return this.goodAllPrice;
	}
	get getCartId() {
		return this.cartId;
	}

	getCartItem() {
		return {
			cartId: this.cartId,
			goodImg: this.goodImg,
			goodName: this.goodName,
			goodSpec: this.goodSpec,
			goodNumber: this.goodNumber,
			goodSinglePrice: this.goodSinglePrice,
			goodAllPrice: this.goodAllPrice,
		}
	}
}

function cartHandler() {
	let selectAllChks = $('.select-all'); //全选复选框
	let cartGroups = $('.cart-group');
	let totalPayMoney = $('.items-price .price-num');   //商品合计
	let shouldPayMoney = $('.should-pay-money .money'); //应付金额
	let payBtn = $('.btn-pay');

	let cartList = []; //购物车类数组

	//为每个购物车商品项创建一个购物车类，并将其添加进cartList中
	for(let i=0; i<cartGroups.length; i++) {
		let cartId = cartGroups.eq(i).attr('data-id');
		let single = cartGroups.eq(i).find('.price-num').text();
		let cart = new Cart(cartId, single);
		cartList.push(cart);
	}

	//复选框事件
	function selectHandler() {
		let chkboxs = $('.chkbox input[type="checkbox"]:not(.select-all)');
		//全选复选框
		selectAllChks.on('click', function(e) {
			if(this.checked){
				//全选
				selectAllChks.each(function() {
					$(this).prop('checked', true);
				});
				chkboxs.each(function() {
					$(this).prop('checked', true);
				});
			} else {
				//取消全选
				selectAllChks.removeAttr('checked');
				chkboxs.removeAttr('checked');
			}
			getCheckedCartItem();
		});

		//单选复选框
		chkboxs.on('click', function(e) {
			if(!this.checked) {
				selectAllChks.removeAttr('checked')
			};
			getCheckedCartItem();
		});
	}

	//获取选择的购物车商品项
	function getCheckedCartItem() {
		let chkboxs = $('.chkbox input[type="checkbox"]:not(.select-all)');
		let totalPay = 0;
		let shouldPay = 0;
		let chkNum = 0; //选中数量
		let chkLabel = selectAllChks.eq(1).siblings('.chk-label');

		//遍历所有购物车项的复选框
		for(let i=0; i<chkboxs.length; i++) {
			/*
			 如果对应的复选框已选中，获取对应商品名，规格和图片，
			  并将其赋值给对应购物车类的对应属性
			*/
			if(chkboxs.eq(i).prop('checked')) {
				// isNull = false;
				++ chkNum;

				let item = {
					goodName: cartGroups.eq(i).find('.name').text().trim(),
					goodSpec: cartGroups.eq(i).find('.spec').text().trim(),
					goodImg: cartGroups.eq(i).find('.img').attr('src')
				}
				cartList[i].setGoodName = item.goodName;
				cartList[i].setGoodSpec = item.goodSpec;
				cartList[i].setGoodImg = item.goodImg;

				totalPay += cartList[i].getGoodAllPrice;
			}
		}

		//计算应付金额，并显示
		shouldPay = totalPay;
		totalPayMoney.text(totalPay.toFixed(2));
		shouldPayMoney.text(shouldPay.toFixed(2));

		if(!chkNum) {
			//若选中数量为0时
			payBtn.addClass('btn-disabled');
			payBtn.attr('href', 'javascript:;');
			chkLabel.text('全选');
		} else {
			payBtn.removeClass('btn-disabled');
			payBtn.attr('href', '/pages/order/confirm.html');
			chkLabel.html(`已选(<span>${chkNum}</span>)`);
		}

		return;
	}

	//购物车商品数量改变
	function changeCartItemNumber() {
		for(let i=0; i<cartGroups.length; i++) {
			let index = i;
			let subBtn = cartGroups.eq(index).find('.sub');
			let addBtn = cartGroups.eq(index).find('.add');
			let input = cartGroups.eq(index).find('.sel-num input');
			let price = cartGroups.eq(index).find('.sprice-num');

			//输入框onchange事件
			input.on('change', function(e) {
				let val = parseInt($(this).val());
				let maxVal = parseInt(input.attr('max'));

				if(val !== val || val <= 1) {
					//检查输入，如果输入值不能转为数字或值不大于1，则值仍为1
					val = 1;
					$(this).val(val);
					subBtn.addClass('disabled');
				} else if(!!maxVal && val >= maxVal) {
					//检查输入，如果输入框有限定最大值，且输入的值大于等于最大值
					val = maxVal;
					$(this).val(val);

					//改变按钮状态
					addBtn.addClass('disabled');
					subBtn.removeClass('disabled');
				} else {
					$(this).val(val);
					subBtn.removeClass('disabled');
				}

				//对应购物车类数量改变，购物车项的总计金额改变
				cartList[index].setGoodNumber = val;
				price.text((cartList[index].getGoodAllPrice).toFixed(2));

				getCheckedCartItem();
			});

			//减少数量
			subBtn.on('click', function(e) {
				e.preventDefault();

				//如果按钮为禁止状态，退出
				if($(this).hasClass('disabled'))
					return;

				let val = parseInt(input.val());

				input.val(--val);
				if(addBtn.hasClass('disabled'))
					addBtn.removeClass('disabled');

				cartList[index].setGoodNumber = val;
				price.text((cartList[index].getGoodAllPrice).toFixed(2));

				getCheckedCartItem();

				//如果输入框值减1后值等于1，则禁用按钮
				if(val === 1) {
					$(this).addClass('disabled');
				}
			});

			//增加数量
			addBtn.on('click', function(e) {
				e.preventDefault();

				//如果按钮为禁止状态，退出
				if($(this).hasClass('disabled'))
					return;

				let val = parseInt(input.val());
				let maxVal = parseInt(input.attr('max'));;

				input.val(++val);
				if(subBtn.hasClass('disabled'))
					subBtn.removeClass('disabled');

				cartList[index].setGoodNumber = val;
				price.text((cartList[index].getGoodAllPrice).toFixed(2));

				getCheckedCartItem();

				//如果输入框有最大值，且输入框值加1后大于等于最大值，则禁用按钮
				if(!!maxVal && val >= maxVal) {
					$(this).addClass('disabled');
				}
			});
		}
	}

	//移除购物车商品项
	function deleteHandler() {
		let chkboxs = $('.chkbox input[type="checkbox"]:not(.select-all)');
		let removeAll = $('.batch-delete');
		let price = cartGroups.find('.sprice-num');

		for(let i=0; i<cartGroups.length; i++) {
			let removeBtn = cartGroups.eq(i).find('.remove');
			//移除按钮点击事件
			removeBtn.on('click', function(e) {
				//将要移除的商品id通过ajax发送给后台
				$.get('/pages/cart.html?cartId='+cartList[i].getCartId);

				//移除
				cartGroups.eq(i).velocity('slideUp', {
					complete(elem) {
						$(elem).remove();
						cartList.splice(i, 1)
						getCheckedCartItem();
					}
				});
			});
		}

		//批量删除
		removeAll.on('click', function() {
			let cartIds = [];//保存要移除的商品的id的数组

			for(let i=0; i<chkboxs.length; i++) {
				if(chkboxs.eq(i).prop('checked')) {
					//商品被选中时，将该商品的id存进cartIds数组中
					cartIds.push(cartList[i].getCartId);

					//移除
					cartGroups.velocity('slideUp', {
						complete(elem) {
							$(elem).remove();
							cartList = [];
							getCheckedCartItem();
						}
					});
				}
			}
			$.get('/pages/cart.html', {
				'cartIds': cartIds
			});
		});
	}

	function init() {
		selectHandler();
		changeCartItemNumber();
		deleteHandler();
	}

	return init();
}


