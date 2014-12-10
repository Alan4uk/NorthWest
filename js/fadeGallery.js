jQuery.fn.fadeGallery = function(_options) {
		var _options = jQuery.extend({
			slideElements: 'div.slideset > div',
			pagerLinks: '.control-panel li',
			btnNext: 'a.next',
			btnPrev: 'a.prev',
			btnPlayPause: 'a.play-pause',
			pausedClass: 'paused',
			playClass: 'playing',
			activeClass: 'active',
			pauseOnHover: true,
			autoRotation: false,
			autoHeight: false,
			switchTime: 3000,
			duration: 650,
			event: 'click'
		}, _options);

		return this.each(function() {
			var _this = jQuery(this);
			var _slides = jQuery(_options.slideElements, _this);
			var _pagerLinks = jQuery(_options.pagerLinks, _this);
			var _btnPrev = jQuery(_options.btnPrev, _this);
			var _btnNext = jQuery(_options.btnNext, _this);
			var _btnPlayPause = jQuery(_options.btnPlayPause, _this);
			var _pauseOnHover = _options.pauseOnHover;
			var _autoRotation = _options.autoRotation;
			var _activeClass = _options.activeClass;
			var _pausedClass = _options.pausedClass;
			var _playClass = _options.playClass;
			var _autoHeight = _options.autoHeight;
			var _duration = _options.duration;
			var _switchTime = _options.switchTime;
			var _controlEvent = _options.event;

			var _hover = false;
			var _prevIndex = 0;
			var _currentIndex = 0;
			var _slideCount = _slides.length;
			var _timer;
			if (!_slideCount) return;
			_slides.hide().eq(_currentIndex).show();
			if (_autoRotation) _this.removeClass(_pausedClass).addClass(_playClass);
			else _this.removeClass(_playClass).addClass(_pausedClass);

			if (_btnPrev.length) {
				_btnPrev.bind(_controlEvent, function() {
					prevSlide();
					return false;
				});
			}
			if (_btnNext.length) {
				_btnNext.bind(_controlEvent, function() {
					nextSlide();
					return false;
				});
			}
			if (_pagerLinks.length) {
				_pagerLinks.each(function(_ind) {
					jQuery(this).bind(_controlEvent, function() {
						if (_currentIndex != _ind) {
							_prevIndex = _currentIndex;
							_currentIndex = _ind;
							switchSlide();
						}
						return false;
					});
				});
			}

			if (_btnPlayPause.length) {
				_btnPlayPause.bind(_controlEvent, function() {
					if (_this.hasClass(_pausedClass)) {
						_this.removeClass(_pausedClass).addClass(_playClass);
						_autoRotation = true;
						autoSlide();
					} else {
						if (_timer) clearRequestTimeout(_timer);
						_this.removeClass(_playClass).addClass(_pausedClass);
					}
					return false;
				});
			}

			function prevSlide() {
				_prevIndex = _currentIndex;
				if (_currentIndex > 0) _currentIndex--;
				else _currentIndex = _slideCount - 1;
				switchSlide();
			}

			function nextSlide() {
				_prevIndex = _currentIndex;
				if (_currentIndex < _slideCount - 1) _currentIndex++;
				else _currentIndex = 0;
				switchSlide();
			}

			function refreshStatus() {
				if (_pagerLinks.length) _pagerLinks.removeClass(_activeClass).eq(_currentIndex).addClass(_activeClass);
				_slides.eq(_prevIndex).removeClass(_activeClass);
				_slides.eq(_currentIndex).addClass(_activeClass);
			}

			function switchSlide() {
				_slides.stop(true, true);
				_slides.eq(_prevIndex).fadeOut(_duration);
				_slides.eq(_currentIndex).fadeIn(_duration);
				refreshStatus();
				autoSlide();
			}

			function autoSlide() {
				if (!_autoRotation || _hover) return;
				if (_timer) clearRequestTimeout(_timer);
				_timer = requestTimeout(nextSlide, _switchTime + _duration);
			}
			if (_pauseOnHover) {
				_this.hover(function() {
					_hover = true;
					if (_timer) clearRequestTimeout(_timer);
				}, function() {
					_hover = false;
					autoSlide();
				});
			}
			refreshStatus();
			autoSlide();
		});
	}
	/*
	 * Drop in replace functions for setTimeout() & setInterval() that
	 * make use of requestAnimationFrame() for performance where available
	 * http://www.joelambert.co.uk
	 *
	 * Copyright 2011, Joe Lambert.
	 * Free to use under the MIT license.
	 * http://www.opensource.org/licenses/mit-license.php
	 */

// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function */ callback, /* DOMElement */ element) {
			window.setTimeout(callback, 1000 / 60);
		};
})();
/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */

window.requestTimeout = function(fn, delay) {
	if (!window.requestAnimationFrame &&
		!window.webkitRequestAnimationFrame &&
		!window.mozRequestAnimationFrame &&
		!window.oRequestAnimationFrame &&
		!window.msRequestAnimationFrame)
		return window.setTimeout(fn, delay);

	var start = new Date().getTime(),
		handle = new Object();

	function loop() {
		var current = new Date().getTime(),
			delta = current - start;

		delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
	};

	handle.value = requestAnimFrame(loop);
	return handle;
};

/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function(handle) {
	window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
		window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) :
		window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
		window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
		window.msCancelRequestAnimationFrame ? msCancelRequestAnimationFrame(handle.value) :
		clearTimeout(handle);
};