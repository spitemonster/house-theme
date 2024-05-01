import { RelatedProductSlider } from "./js/classes/related-product-slider";

window.addEventListener("DOMContentLoaded", () => {
	const relatedProductSliders = document.querySelectorAll(
		".related-product-slider"
	);

	relatedProductSliders.forEach((slider) => {
		new RelatedProductSlider(slider);
	});
});
