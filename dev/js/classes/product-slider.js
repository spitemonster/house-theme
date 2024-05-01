function clamp(num, min, max) {
	return Math.max(Math.min(num, Math.max(min, max)), Math.min(min, max));
}

export class ProductSlider {
	constructor(el) {
		this.el = el;
		this.controls = this.el.querySelector(".product-slider__controls");
		this.productArea = this.el.querySelector(
			".product-slider__product-area"
		);
		this.outer = this.el.querySelector(".product-slider__inner");
		this.navButtons = this.el.querySelectorAll("button[data-direction]");
		this.products = Array.from(this.el.querySelectorAll(".product-card"));
		this.currentSlideIndex = 0;
		this.slideCount = this.products.length;
		this.init();
	}

	init() {
		const slidesVisible =
			getComputedStyle(this.el).getPropertyValue("--slides-visible") * 1;

		if (this.slideCount <= slidesVisible) {
			this.el.classList.add("no-overflow");
		}
		this.navButtons.forEach((b) => {
			b.addEventListener("click", (e) => {
				const dir = b.dataset.direction;
				this.scroll(dir);
			});
		});

		this.productArea.scroll({
			left: 0,
			behavior: "instant",
		});

		this.currentSlideIndex = 1;
		this.scroll("prev");
		this.el.classList.add("initialized");
	}

	scroll(dir) {
		this.currentSlideIndex =
			dir == "prev"
				? this.currentSlideIndex - 1
				: this.currentSlideIndex + 1;

		const slidesVisible =
			getComputedStyle(this.el).getPropertyValue("--slides-visible") * 1;
		const maxIdx = this.currentSlideIndex + slidesVisible;

		this.currentSlideIndex = clamp(
			this.currentSlideIndex,
			0,
			this.slideCount - slidesVisible
		);

		this.products.forEach((s, idx) => {
			const slideVisible = idx >= this.currentSlideIndex && idx < maxIdx;
			s.classList.toggle("visible", slideVisible);
			s.setAttribute("tabindex", slideVisible ? 0 : -1);
		});

		this.navButtons.forEach((b) => {
			const isPrev = b.dataset.direction === "prev";
			const isNext = b.dataset.direction === "next";
			const isFirstSlide = this.currentSlideIndex === 0;
			const isLastSlide =
				this.currentSlideIndex + slidesVisible === this.slideCount;

			if ((isPrev && isFirstSlide) || (isNext && isLastSlide)) {
				b.setAttribute("disabled", true);
			} else {
				b.removeAttribute("disabled");
			}
		});

		const scrollOptions = {
			left: this.products[this.currentSlideIndex].offsetLeft,
			behavior: "smooth",
		};

		this.el.style.setProperty("--current-index", this.currentSlideIndex);
	}
}
