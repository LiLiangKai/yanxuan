/**
 * @fn：轮播图
 * @author: llk
 * @date: 2018/8/6
 */

/**
 * 轮播图
 * @param  {[type]} slickWrap [轮播图容器]
 * @param  {Object} obj_opts  [轮播图相关DOM对象]
 * @param  {Number} duration  [自动轮播时间]
 * @return {[type]}           [description]
 */
function slickSlide(slickWrap, obj_opts={}, duration) {
	let $elem = slickWrap;

	//默认轮播图DOM对象
	let defaultObjs = {
		prevBtn: $elem.find('.btn-prev'), //向前按钮
		nextBtn: $elem.find('.btn-next'), //向后按钮
		slickItems: $elem.find('.slick-item'), //幻灯片
		dotBtns: $elem.find('.slick-dot') //点按钮
	};

	let {
		prevBtn,
		nextBtn,
		slickItems,
		dotBtns
	} = $.extend({}, defaultObjs, obj_opts);

	duration = duration || 4000;
	let moveFlag = false; //运动标志
	let currShow = 0;     //当前显示的索引
	let slideInterval = null;
	let itemNums = slickItems.length;

	//向前按钮点击事件
	prevBtn.on('click', function(event) {
		event.stopPropagation()

		if(!moveFlag) {
			moveFlag = true;

			prevSlickItem();

			setTimeout(function() {
				moveFlag = false;
			}, 500);
		}
	});

	//向后按钮点击事件
	nextBtn.on('click', function(event) {
		event.stopPropagation();

		if(!moveFlag) {
			moveFlag = true;

			nextSlickItem();

			setTimeout(function() {
				moveFlag = false;
			}, 500);
		}

	});

	if(!!dotBtns) {
		//点按钮点击事件
		dotBtns.on('click', function(event) {
			event.stopPropagation();
			if(!moveFlag) {
				moveFlag = true;

				fadeOutSlickItemAnimate(currShow);
				currShow = $(this).index();
				fadeInSlickItemAnimate(currShow);

				setTimeout(function() {
					moveFlag = false;
				}, 500);
			}
		});
	}

	//轮播图容器鼠标经过事件
	$elem.on('mouseover', function() {
		stopAutoPlay();
	});

	//轮播图容器鼠标移出事件
	$elem.on('mouseout', function() {
		autoPlay();
	});

	//淡出方式隐藏
	function fadeOutSlickItemAnimate(index) {
		dotBtns.eq(index).removeClass('slick-dot-active');
		slickItems.eq(index)
			.velocity({
				opacity: 0,
				zIndex: 0
			})
			.removeClass('show-item');
	}

	//淡入方式显示
	function fadeInSlickItemAnimate(index) {
		dotBtns.eq(index).addClass('slick-dot-active');
		slickItems.eq(index)
			.velocity({
				opacity: 1,
				zIndex: 1
			})
			.addClass('show-item');
	};

	//下一张幻灯片
	function nextSlickItem() {
		fadeOutSlickItemAnimate(currShow);
		currShow = currShow >= itemNums-1 ? 0 : currShow+1;
		fadeInSlickItemAnimate(currShow);
	}

	//上一张幻灯片
	function prevSlickItem() {
		fadeOutSlickItemAnimate(currShow);
		currShow = currShow <= 0 ? itemNums-1 : currShow-1;
		fadeInSlickItemAnimate(currShow);
	}

	//自动播放
	function autoPlay() {
		if(!slideInterval) {
			slideInterval = setInterval(function() {
				if(!moveFlag) {
					moveFlag = true;
					nextSlickItem();

					setTimeout(function() {
						moveFlag = false;
					}, 500);
				}
			}, duration);
		}
	}

	//停止自动播放
	function stopAutoPlay() {
		clearInterval(slideInterval);
		slideInterval = null;
	}

	autoPlay();
}


function slickSlideMove(slickWrap, obj_opts={}, options={}) {
	let $elem = slickWrap;

	//默认轮播图DOM对象
	let defaultObjs = {
		prevBtn: $elem.find('.btn-prev'), //向前按钮
		nextBtn: $elem.find('.btn-next'), //向后按钮
		slickItems: $elem.find('.slick-item'), //幻灯片
		slickTrack: $elem.find('.slick-track') //滚动容器
	};
	let defaultOptions = {
		duration: 2500, //滚动持续时间
		clickDuration: 1000, //点击时滚动持续时间
		easing: 'ease-in-out' //缓动类型
	}

	let {
		prevBtn,
		nextBtn,
		slickItems,
		slickTrack
	} = $.extend({}, defaultObjs, obj_opts);
	let { duration, clickDuration, easing } = $.extend({}, defaultOptions, options);

	let speed = slickItems.eq(0).outerWidth() + 10; //速度，一个slickItem的宽度
	let moveFlag = false; //运动标志
	let slideInterval = null; //定时器
	let itemNums = slickItems.length;
 	let moveMaxWidth = speed * itemNums / 2;//最大滚动值，所有slickItem宽度的一半
	let currentX = 0;    //当前滚动值
	let direction = -1;  //滚动方向，-1代表向左滚动，1代表向右滚动
	// let duration = 2500; //滚动间隔时间

	//向右按钮点击事件
	prevBtn.on('click', function(event) {
		event.stopPropagation()
		if(currentX >= 0) {
			return;
		}

		direction = 1;//设置滚动方向为向右

		if(!moveFlag) {
			moveFlag = true;
			let d = duration;
			duration = clickDuration;
			slideMove();

			setTimeout(function() {
				moveFlag = false;
				duration = d;
			}, 500);
		}
	});

	//向左按钮点击事件
	nextBtn.on('click', function(event) {
		event.stopPropagation();

		if(currentX <= -moveMaxWidth) {
			return;
		}

		direction = -1;//设置滚动方向为向左

		if(!moveFlag) {
			moveFlag = true;
			let d = duration;
			duration = clickDuration;
			slideMove();

			setTimeout(function() {
				moveFlag = false;
				duration = d;
			}, 500);
		}
	});

	//轮播图容器鼠标经过事件
	$elem.on('mouseover', function() {
		stopAutoPlay();
	});

	//轮播图容器鼠标移出事件
	$elem.on('mouseout', function() {
		autoPlay();
	});

	//自动播放
	function autoPlay() {
		slideInterval = setInterval(function(){
			slideMove();
		}, duration);
	}

	//滚动方法
	function slideMove() {
		//判断向左还是向右滚动
		if(direction < 0) {
			//向左滚动

			if(currentX <= -moveMaxWidth) {
				//当当前滚动值小于或等于最大滚动值时，改变滚动方向
				direction = 1;
				return;
			}
			currentX = currentX > -moveMaxWidth ? currentX-speed : -moveMaxWidth;
		} else if(direction > 0) {
			//向右滚动

			if(currentX >= 0) {
				//当当前滚动值大于或等于0时，改变滚动方向
				direction = -1;
				return;
			}
			currentX = currentX < 0 ? currentX+speed : 0;
		}
		slickTrack.velocity({
				translateX: currentX
			}, { duration: duration, easing: easing });
	}

	//停止自动播放
	function stopAutoPlay() {
		clearInterval(slideInterval);
		slideInterval = null;
	}

	//设置slickTrack滚动容器的宽度
	function setSlickTrackWidth() {
		//宽度为单个slickItem的宽度乘slickItem数量
		let width = speed * itemNums;
		slickTrack.css('width', width+'px');
	}

	//初始化
	function init() {
		setSlickTrackWidth();
		autoPlay();
	}
	init();
}
