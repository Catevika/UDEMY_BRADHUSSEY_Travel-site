import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

class StickyHeader {
	constructor() {
		this.previousScrollY = window.scrollY;
		this.siteHeader = document.querySelector('.site-header');
		this.pageSections = document.querySelectorAll('.page-section');
		this.browserHeight = window.innerHeight;
		this.events();
	}

	events() {
		window.addEventListener(
			'scroll',
			throttle(() => this.runOnScroll(), 200)
		);

		window.addEventListener(
			'resize',
			debounce(() => {
				this.browserHeight = window.innerHeight;
			}, 333)
		);
	}

	determineScrollDirection() {
		if (window.scrollY > this.previousScrollY) {
			this.ScrollDirection = 'down';
		} else {
			this.ScrollDirection = 'up';
		}
		this.previousScrollY = window.scrollY;
	}

	runOnScroll() {
		this.determineScrollDirection();
		if (window.scrollY > 60) {
			this.siteHeader.classList.add('site-header--dark');
		} else {
			this.siteHeader.classList.remove('site-header--dark');
		}

		this.pageSections.forEach((el) => this.calcSection(el));
	}

	calcSection(el) {
		if (
			window.scrollY + this.browserHeight > el.offsetTop &&
			window.scrollY < el.offsetTop + el.offsetHeight
		) {
			let scrollPercent =
				(el.getBoundingClientRect().y / this.browserHeight) * 100;
			if (
				(scrollPercent < 18 &&
					scrollPercent > -0.1 &&
					this.ScrollDirection == 'down') ||
				(scrollPercent < 33 && this.ScrollDirection == 'up')
			) {
				let matchingLink = el.getAttribute('data-matching-link');
				document
					.querySelectorAll(`.primary-nav a:not(${matchingLink})`)
					.forEach((el) => el.classList.remove('is-current-link'));
				document.querySelector(matchingLink).classList.add('is-current-link');
			}
		}
	}
}

export default StickyHeader;
