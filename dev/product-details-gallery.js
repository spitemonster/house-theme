class ProductDetailsGallery {
	constructor(el) {
		this.el = el;
		this.main = this.el.querySelector(
			".product-details-gallery__main-image img"
		);
		this.thumbs = this.el.querySelector(".product-details-gallery__thumbs");

		this.init();
	}

	init() {
		this.thumbs?.addEventListener("click", (e) => {
			const t = e.target;
			const fullSrc = t.dataset.fullSrc;
			this.main.src = fullSrc;
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const productDetailsGalleries = document.querySelectorAll(
		".product-details-gallery"
	);

	productDetailsGalleries.forEach((g) => {
		new ProductDetailsGallery(g);
	});
});
