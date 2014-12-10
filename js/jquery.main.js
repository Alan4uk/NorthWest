$(document).ready(function() {
	initSlideShow();
	initSearch();
});

function initSearch() {
	$('.search .open').click(function(event) {
		var _this = $(this);
		if(!_this.closest('.search').hasClass('active')) {
			_this.closest('.search').find('.expanded').slideDown(500, function(){
				_this.closest('.search').addClass('active');
			})
		} else {
			_this.closest('.search').find('.expanded').slideUp(500, function(){
				_this.closest('.search').removeClass('active');
			})
		}
		event.preventDefault();
	});
}

function initSlideShow() {
	$('.promo').fadeGallery({
		slideElements: '.slide li',
		pagerLinks: '.switchers li',
		pauseOnHover: true,
		autoRotation: true,
		switchTime: 6000,
		duration: 650,
		event: 'click'
	});
	$('.block').fadeGallery({
		slideElements: 'li',
		btnNext: 'span.next',
		autoRotation: false,
		switchTime: 3000,
		duration: 650
	});
	var _eq = 0;
	setInterval(function(){
		$('.country .block').eq(_eq).find('.next').trigger('click');
		_eq = _eq + 1;
		if(_eq > 3) _eq = 0;
	}, 2000);
}