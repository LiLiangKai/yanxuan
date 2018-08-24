/**
 * @author: llk
 * @time: 1018/8/24
 * 付款确认页相关函数
 */


function animatePoint(container) {
	let pointHTML = `<div class="animate"></div>`;
	let bgs = ['#b4a078', '#dceea5', '#d3d2d2', '#e8e8e8', '#a5d6ee'];

	setInterval(function() {
		movePoint();
	}, 3000);

	function movePoint() {
		let color = Math.floor(Math.random()*6);
		container.append(pointHTML);
		let point = $('.animate');

		point.velocity({
			top: 215,
			backgroundColor: bgs[color]
		}, {
			duration: 0,
			begin(elem) {
				$(elem).css({
					transform: 'translate(0px, 0px)'
				})
			}
		}).velocity({
			translateX: 875,
			translateY: 0,
			opacity: 0
		}, {
			duration: 1500,
			delay: 1000,
			complete(elem) {
				$(elem).remove();
			}
		});
	}

}