import { ProductSlider } from "./js/classes/product-slider";

window.addEventListener("DOMContentLoaded", () => {
	let targetNode = document.querySelectorAll(".product-slider");

	targetNode.forEach((slider) => {
		new ProductSlider(slider);
	});
});
